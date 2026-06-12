import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.redirect(new URL('/cart', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status;

    if (paymentStatus === 'paid' || paymentStatus === 'no_payment_required') {
      return NextResponse.redirect(new URL(
        `/checkout/success?session_id=${sessionId}`,
        request.url
      ));
    }
  } catch {}

  return NextResponse.redirect(new URL('/cart', request.url));
}
