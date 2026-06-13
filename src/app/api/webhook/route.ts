import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy init — env vars are not evaluated at module load time, so builds
// without Supabase credentials don't crash during page-data collection.
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') || '';
  let event;
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && webhookSecret !== 'whsec_...er') {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // No webhook secret configured — parse raw for dev/testing
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCompletedCheckout(session);
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        await handleCompletedCheckout(session);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        console.error('Payment failed for session:', session.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handleCompletedCheckout(session: any) {
  const { metadata, shipping_details, amount_total, payment_intent } = session;

  if (!metadata?.items) {
    console.warn('No items metadata in session', session.id);
    return;
  }

  const items = JSON.parse(metadata.items);
  const total = amount_total / 100;

  // Create order in Supabase
  const orderId = `stripe_${session.id}`;
  const order = {
    id: orderId,
    items: JSON.stringify(items),
    total,
    customer_name: metadata.customer_name || 'Unknown',
    customer_email: session.customer_details?.email || '',
    customer_phone: metadata.customer_phone || '',
    shipping_address: JSON.stringify({
      address: shipping_details?.address?.line1 || '',
      city: shipping_details?.address?.city || '',
      state: shipping_details?.address?.state || '',
      postcode: shipping_details?.address?.postal_code || '',
      country: shipping_details?.address?.country || 'AU',
    }),
    status: 'paid',
    payment_intent: payment_intent || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();

  const { error } = await supabase.from('orders').upsert(order, { onConflict: 'id' });
  if (error) {
    console.error('Failed to save order:', error);
  } else {
    console.log('Order created:', orderId);
  }

  // Also log to audit
  await supabase.from('audit_log').insert({
    id: `webhook_${Date.now()}`,
    timestamp: new Date().toISOString(),
    agent: 'Stripe Webhook',
    action: 'order.paid',
    details: `Order ${orderId} — $${total.toFixed(2)} — ${items.length} items`,
    status: 'success',
  });
}
