import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAudit } from '@/lib/agents/audit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * CJdropshipping Webhook Handler
 *
 * Receives order status updates and logistics tracking events from CJ.
 * Two webhook types:
 *   - ORDER: order status changes (CREATED, PAID, SHIPPED, DELIVERED, CANCELLED)
 *   - LOGISTIC: real-time tracking updates (in transit, out for delivery, delivered)
 *
 * CJ webhooks are HMAC-SHA256 signed with your openId as the secret.
 * Verification: base64(HMAC-SHA256(payload, openId)) === sign header
 */

// ── CJ webhook payload types ──

interface CJOrderWebhook {
  type: 'ORDER';
  messageType: 'CREATE' | 'UPDATE';
  params: {
    orderNumber: string;     // Your store's order ID
    cjOrderId: string;
    orderStatus: string;     // CREATED | UNPAID | UNSHIPPED | SHIPPED | DELIVERED | CANCELLED
    logisticName?: string;
    trackNumber?: string;
    trackingProvider?: string;
    createDate?: string;
    updateDate?: string;
    payDate?: string;
    deliveryDate?: string;
    completeDate?: string;
    orderItems?: Array<{ vid: string; quantity: number; sellPrice: number; lineItemId: string }>;
  };
}

interface CJLogisticsWebhook {
  type: 'LOGISTIC';
  messageType: 'UPDATE';
  params: {
    orderId: string;         // CJ's internal order ID
    trackingNumber: string;
    trackingProvider: string;
    trackingStatus: number;  // 12=Delivered, 10=Out For Delivery, etc.
    logisticsTrackEvents: string; // JSON string of events
  };
}

type CJWebhookPayload = CJOrderWebhook | CJLogisticsWebhook;

// ── Webhook verification ──

async function verifySignature(payload: string, signature: string, secret: string | number): Promise<boolean> {
  if (!payload || !signature || !secret) return false;
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(String(secret)),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const computed = btoa(String.fromCharCode(...new Uint8Array(sig)));
    return computed === signature;
  } catch {
    return false;
  }
}

// ── Order status mapper (CJ → our system) ──

const CJ_STATUS_MAP: Record<string, string> = {
  CREATED: 'placed_with_supplier',
  UNPAID: 'placed_with_supplier',
  UNSHIPPED: 'placed_with_supplier',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// ── Handler ──

async function handleOrderWebhook(params: CJOrderWebhook['params']): Promise<void> {
  const { orderNumber, cjOrderId, orderStatus, trackNumber, trackingProvider, logisticName } = params;
  const ourStatus = CJ_STATUS_MAP[orderStatus];

  if (!orderNumber) {
    console.warn('CJ webhook: missing orderNumber', params);
    return;
  }

  // Build note
  const trackingInfo = trackNumber
    ? `Tracking: ${trackNumber}${trackingProvider ? ` (${trackingProvider})` : ''}${logisticName ? ` via ${logisticName}` : ''}`
    : '';

  // Update order in Supabase
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (ourStatus) updates.status = ourStatus;
  if (trackNumber) updates.tracking_url = trackNumber;
  if (cjOrderId) updates.supplier_order_ref = cjOrderId;
  if (trackingInfo) updates.notes = trackingInfo;

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderNumber);

  if (error) {
    console.error(`CJ webhook: failed to update order ${orderNumber}:`, error);
    return;
  }

  await supabase.from('audit_log').insert({
    id: `cj_wh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    agent: 'CJ Webhook',
    action: `order.${orderStatus.toLowerCase()}`,
    details: `Order ${orderNumber} → ${ourStatus || orderStatus}${trackingInfo ? `. ${trackingInfo}` : ''}`,
    status: 'success',
  });

  console.log(`CJ webhook: order ${orderNumber} → ${orderStatus} (our: ${ourStatus})`);
}

async function handleLogisticsWebhook(params: CJLogisticsWebhook['params']): Promise<void> {
  const { orderId, trackingNumber, trackingStatus, trackingProvider, logisticsTrackEvents } = params;

  // Parse tracking events
  let events: Array<{ status: number; activity: string; location: string; eventTime: string }> = [];
  try {
    events = JSON.parse(logisticsTrackEvents);
  } catch {
    events = [{ status: trackingStatus, activity: '', location: '', eventTime: '' }];
  }

  const latestEvent = events[events.length - 1];
  const eventSummary = latestEvent?.activity
    ? `${latestEvent.activity}${latestEvent.location ? ` — ${latestEvent.location}` : ''}`
    : `Status code ${trackingStatus}`;

  // Try to find order by CJ order ID in supplier_order_ref
  const { data: orders } = await supabase
    .from('orders')
    .select('id, supplier_order_ref')
    .eq('supplier_order_ref', orderId)
    .limit(1);

  if (orders && orders.length > 0) {
    const orderId = orders[0].id;
    const { error } = await supabase
      .from('orders')
      .update({
        tracking_url: trackingNumber,
        notes: `CJ tracking: ${eventSummary}`,
        updated_at: new Date().toISOString(),
        ...(trackingStatus === 12 ? { status: 'delivered' } : {}),
      })
      .eq('id', orderId);

    if (error) {
      console.error(`CJ webhook: failed to update tracking for order ${orderId}:`, error);
    } else {
      await supabase.from('audit_log').insert({
        id: `cj_trk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        agent: 'CJ Webhook',
        action: 'tracking.updated',
        details: `Order ${orderId}: ${eventSummary}`,
        status: 'success',
      });
    }
  }

  console.log(`CJ logistics webhook: order ${orderId}, tracking ${trackingNumber}, status ${trackingStatus}`);
}

// ── Route Handler ──

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-cj-sign') || request.headers.get('sign') || '';

  // Try to verify signature using openId (stored as CJ_OPEN_ID)
  const openId = process.env.CJ_OPEN_ID;
  if (openId && signature) {
    const valid = await verifySignature(rawBody, signature, openId);
    if (!valid) {
      console.warn('CJ webhook: invalid signature');
      // Still process in dev mode
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
  }

  let payload: CJWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    if (payload.type === 'ORDER') {
      await handleOrderWebhook((payload as CJOrderWebhook).params);
    } else if (payload.type === 'LOGISTIC') {
      await handleLogisticsWebhook((payload as CJLogisticsWebhook).params);
    } else {
      console.log('CJ webhook: unknown type');
    }

    // CJ expects 200 OK within 3 seconds
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('CJ webhook handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
