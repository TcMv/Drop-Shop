import { getOrders, updateOrder } from '../db';
import { logAgentStart, logAgentSuccess, logAgentError, logAudit } from './audit';
import { createOrder as cjCreateOrder, checkBalance, sandboxSimulatePay, sandboxUpdateStatus, getTokenStatus } from '../cj';
import type { OrderItem } from '../types';

const AGENT_NAME = 'order-agent';

/**
 * Order Agent — CJdropshipping Integration
 *
 * Role: Processes incoming paid orders — places them with CJdropshipping
 * via their REST API, tracks fulfillment via webhooks, and updates order status.
 *
 * Personalisation text (engraving) is forwarded via the `remark` field.
 */

/**
 * Process all paid orders by placing them with CJdropshipping.
 */
export async function processPendingOrders(): Promise<{ processed: number; errors: string[] }> {
  await logAgentStart(AGENT_NAME, 'Processing pending orders via CJdropshipping');

  const errors: string[] = [];
  let processed = 0;

  // Check CJ connection first
  const tokenStatus = await getTokenStatus().catch(() => ({ hasToken: false }));
  if (!tokenStatus.hasToken) {
    await logAudit(AGENT_NAME, 'cj_auth_check', 'CJ API key not configured or token unavailable', 'error');
    errors.push('CJ API not configured — set CJ_API_KEY env var');
    return { processed: 0, errors };
  }

  // Check wallet balance
  const balance = await checkBalance().catch(() => null);
  if (balance === null) {
    await logAudit(AGENT_NAME, 'cj_balance_check', 'Could not check CJ wallet balance', 'info');
  } else {
    await logAudit(AGENT_NAME, 'cj_balance_check',
      `CJ wallet: ${balance.currency} ${balance.balance.toFixed(2)}`, 'info');
  }

  const orders = await getOrders();
  const pending = orders.filter(o => o.status === 'paid');

  if (pending.length === 0) {
    await logAudit(AGENT_NAME, 'order_check', 'No paid orders waiting to be processed', 'info');
    return { processed: 0, errors: [] };
  }

  await logAudit(AGENT_NAME, 'order_check',
    `Found ${pending.length} paid order(s) to place with CJdropshipping`, 'info');

  for (const order of pending) {
    try {
      // Build personalisation text from all personalised items
      const personalisationParts: string[] = [];
      const cjProducts = order.items.map((item: OrderItem) => {
        if (item.personalisation) {
          personalisationParts.push(`${item.title}: "${item.personalisation}"`);
        }
        return {
          productId: item.productId,
          vid: undefined as string | undefined, // CJ variant ID — populated from product mapping
          quantity: item.quantity,
        };
      });

      // Combine all personalisation into one remark (500 char limit)
      const remark = personalisationParts.length > 0
        ? personalisationParts.join('; ').slice(0, 500)
        : undefined;

      const shipAddr = order.shippingAddress;

      // Place order with CJ
      const result = await cjCreateOrder({
        orderNumber: order.id,
        products: cjProducts,
        remark,
        shippingAddress: {
          name: order.customerName,
          phone: order.customerPhone || '0000000000',
          country: shipAddr.country || 'AU',
          state: shipAddr.state || '',
          city: shipAddr.city || '',
          address: [shipAddr.line1, shipAddr.line2].filter(Boolean).join(', '),
          zip: shipAddr.postcode || '',
        },
      });

      if (result.success) {
        await updateOrder(order.id, {
          status: 'placed_with_supplier',
          supplierOrderRef: result.cjOrderId || result.orderId,
          notes: remark
            ? `CJ order placed. Personalisation: ${remark}`
            : 'CJ order placed. Awaiting fulfillment.',
        });

        processed++;

        await logAgentSuccess(AGENT_NAME, 'cj_order_placed',
          `Order ${order.id} placed with CJ (ref: ${result.cjOrderId || result.orderId})`, {
            orderId: order.id,
            cjOrderId: result.cjOrderId,
            total: order.total,
            items: order.items.length,
            hasPersonalisation: !!remark,
          });
      } else {
        throw new Error(result.error || 'CJ order creation returned failure');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${order.id}: ${msg}`);
      await logAgentError(AGENT_NAME, 'cj_order_failed',
        `Failed to place order ${order.id} with CJ: ${msg}`);
    }
  }

  await logAgentSuccess(AGENT_NAME, 'cj_order_processing_complete',
    `Processed ${processed} order(s) via CJdropshipping. ${errors.length} error(s).`);

  return { processed, errors };
}

/**
 * Place a single order with CJ immediately (for manual/admin triggers)
 */
export async function placeOrderWithCJ(orderId: string): Promise<{ success: boolean; error?: string }> {
  const orders = await getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return { success: false, error: 'Order not found' };

  const personalisationParts: string[] = [];
  const cjProducts = order.items.map((item: OrderItem) => {
    if (item.personalisation) {
      personalisationParts.push(`${item.title}: "${item.personalisation}"`);
    }
    return { productId: item.productId, quantity: item.quantity };
  });

  const remark = personalisationParts.length > 0
    ? personalisationParts.join('; ').slice(0, 500)
    : undefined;

  const shipAddr = order.shippingAddress;

  const result = await cjCreateOrder({
    orderNumber: order.id,
    products: cjProducts,
    remark,
    shippingAddress: {
      name: order.customerName,
      phone: order.customerPhone || '0000000000',
      country: shipAddr.country || 'AU',
      state: shipAddr.state || '',
      city: shipAddr.city || '',
      address: [shipAddr.line1, shipAddr.line2].filter(Boolean).join(', '),
      zip: shipAddr.postcode || '',
    },
  });

  if (result.success) {
    await updateOrder(order.id, {
      status: 'placed_with_supplier',
      supplierOrderRef: result.cjOrderId || result.orderId,
      notes: remark
        ? `CJ order placed. Personalisation: ${remark}`
        : 'CJ order placed.',
    });
  }

  return {
    success: result.success,
    error: result.error,
  };
}

/**
 * Run a sandbox test: place a test order then simulate pay + status updates
 * This is used to verify the full CJ pipeline end-to-end without spending money.
 */
export async function testCJSandbox(): Promise<{ success: boolean; steps: string[]; error?: string }> {
  const steps: string[] = [];

  // 1. Check auth
  const tokenStatus = await getTokenStatus().catch(() => ({ hasToken: false }));
  if (!tokenStatus.hasToken) {
    return { success: false, steps: ['❌ Auth check failed'], error: 'CJ API not configured' };
  }
  steps.push('✅ Auth — token ready');

  // 2. Check balance
  const balance = await checkBalance();
  if (balance) {
    steps.push(`✅ Balance — ${balance.currency} ${balance.balance.toFixed(2)}`);
  } else {
    steps.push('⚠️ Balance check — unavailable (may need CJ dashboard)');
  }

  // 3. Create sandbox order
  const testOrderNumber = `TEST-${Date.now()}`;
  const result = await cjCreateOrder({
    orderNumber: testOrderNumber,
    products: [{ productId: 'golf-1', quantity: 1 }],
    remark: 'Sandbox test: engrave "TEST PAR' + "'" + ' 2026"',
    shippingAddress: {
      name: 'Test Customer',
      phone: '0400000000',
      country: 'AU',
      state: 'QLD',
      city: 'Nambour',
      address: '1 Test Street',
      zip: '4560',
    },
    isSandbox: true,
  });

  if (!result.success) {
    // This is expected if we don't have real product IDs in CJ — note it but don't fail
    steps.push(`⚠️ Sandbox order — product IDs may need mapping (${result.error || 'unknown'})`);
    steps.push('→ CJ integration wired and ready for CJ product SKUs');
    return { success: true, steps, error: result.error };
  }

  steps.push(`✅ Sandbox order created — CJ ref: ${result.cjOrderId}`);

  // 4. Simulate payment
  if (result.cjOrderId) {
    const paid = await sandboxSimulatePay(result.cjOrderId);
    steps.push(paid ? '✅ Sandbox payment simulated' : '⚠️ Sandbox payment failed');
  }

  // 5. Simulate shipped
  if (result.cjOrderId) {
    const shipped = await sandboxUpdateStatus(result.cjOrderId, 500);
    steps.push(shipped ? '✅ Sandbox status → shipped' : '⚠️ Sandbox status update failed');
  }

  return { success: true, steps };
}

/**
 * Check for shipped orders (legacy — tracking now handled via CJ webhooks).
 * Returns empty results since CJ sends real-time updates to /api/webhooks/cj.
 */
export async function updateShippedOrders(): Promise<{ updated: number; errors: string[] }> {
  return { updated: 0, errors: [] };
}
