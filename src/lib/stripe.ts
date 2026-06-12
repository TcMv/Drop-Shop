import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set — Stripe won\'t initialise');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_tes...lder', {
  typescript: true,
});
