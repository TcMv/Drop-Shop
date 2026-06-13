import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { shippingFor, EXPRESS_SHIPPING } from '@/lib/format';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drop-shop-plum.vercel.app';

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerName, customerEmail, customerPhone, shippingAddress } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    const total = items.reduce((s: number, i: CartItem) => s + i.price * i.quantity, 0);
    const shipping = shippingFor(total);

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: [
        'card',
        'afterpay_clearpay',
        'zip',
      ],
      line_items: lineItems,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['AU'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(shipping * 100), currency: 'aud' },
            display_name: shipping === 0 ? 'Free Standard Shipping (Australia-wide)' : 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 14 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: Math.round(EXPRESS_SHIPPING * 100), currency: 'aud' },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      metadata: {
        items: JSON.stringify(items.map((i: CartItem) => ({ id: i.productId, title: i.title, price: i.price, qty: i.quantity }))),
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: JSON.stringify(shippingAddress),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout session error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
