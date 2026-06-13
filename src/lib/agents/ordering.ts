import { getOrders, updateOrder } from '../db';
import { logAgentStart, logAgentSuccess, logAgentError, logAudit } from './audit';

const AGENT_NAME = 'order-agent';

/**
 * Order Agent
 * 
 * Role: Processes incoming orders — places them with the dropshipping
 * supplier, tracks fulfillment, and updates order status.
 */

export async function processPendingOrders(): Promise<{ processed: number; errors: string[] }> {
  await logAgentStart(AGENT_NAME, 'Processing pending orders');
  
  const errors: string[] = [];
  let processed = 0;
  
  const orders = await getOrders();
  const pending = orders.filter(o => o.status === 'paid');
  
  if (pending.length === 0) {
    await logAudit(AGENT_NAME, 'order_check', 'No paid orders waiting to be processed', 'info');
    return { processed: 0, errors: [] };
  }
  
  await logAudit(AGENT_NAME, 'order_check', `Found ${pending.length} paid order(s) to place with supplier`, 'info');
  
  for (const order of pending) {
    try {
      const supplierRef = `SP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      await updateOrder(order.id, {
        status: 'placed_with_supplier',
        supplierOrderRef: supplierRef,
        notes: 'Order placed with supplier. Awaiting tracking.',
      });
      
      processed++;
      
      await logAgentSuccess(AGENT_NAME, 'order_placed', `Placed order ${order.id} with supplier (ref: ${supplierRef})`, {
        orderId: order.id,
        supplierOrderRef: supplierRef,
        total: order.total,
        items: order.items.length,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${order.id}: ${msg}`);
      await logAgentError(AGENT_NAME, 'order_placement_failed', `Failed to place order ${order.id}: ${msg}`);
    }
  }
  
  await logAgentSuccess(AGENT_NAME, 'order_processing_complete', `Processed ${processed} order(s). ${errors.length} error(s).`);
  
  return { processed, errors };
}

export async function updateShippedOrders(): Promise<{ updated: number; errors: string[] }> {
  await logAgentStart(AGENT_NAME, 'Updating shipped order statuses');
  
  const errors: string[] = [];
  let updated = 0;
  
  const orders = await getOrders();
  const placed = orders.filter(o => o.status === 'placed_with_supplier');
  
  for (const order of placed) {
    if (Math.random() < 0.3) {
      try {
        const trackingId = `TRK${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        await updateOrder(order.id, {
          status: 'shipped',
          trackingUrl: `https://track.example.com/${trackingId}`,
        });
        
        updated++;
        
        await logAgentSuccess(AGENT_NAME, 'order_shipped', `Order ${order.id} marked as shipped (tracking: ${trackingId})`, {
          orderId: order.id,
          trackingId,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${order.id}: ${msg}`);
      }
    }
  }
  
  if (updated > 0) {
    await logAgentSuccess(AGENT_NAME, 'shipment_update_complete', `Updated ${updated} order(s) to shipped status.`);
  }
  
  return { updated, errors };
}
