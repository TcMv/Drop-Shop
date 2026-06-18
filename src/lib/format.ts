/**
 * Shared formatting + storefront constants for the Australian market.
 * All prices are AUD and GST-inclusive.
 */

export const FREE_SHIPPING_THRESHOLD = 50;
export const STANDARD_SHIPPING = 5.99;
export const EXPRESS_SHIPPING = 9.95;

const audFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
});

export function formatAUD(amount: number): string {
  return audFormatter.format(amount);
}

/** GST component of a GST-inclusive price (GST is 1/11th of the total). */
export function gstComponent(totalIncGst: number): number {
  return totalIncGst / 11;
}

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}

/** Afterpay-style 4 equal instalments. */
export function instalment(total: number): number {
  return total / 4;
}

/**
 * Deterministic pseudo-random number from a string seed.
 * Used so product ratings/review counts are stable across renders
 * and between server and client (no hydration mismatch).
 */
export function seeded(seed: string, min: number, max: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const t = ((h >>> 0) % 10000) / 10000;
  return min + t * (max - min);
}

export function seededRating(id: string): number {
  return Math.round(seeded(id, 4.2, 5.0) * 10) / 10;
}

export function seededReviewCount(id: string): number {
  return Math.floor(seeded(id + ':count', 18, 240));
}

export function seededDiscount(id: string): number {
  return Math.floor(seeded(id + ':deal', 15, 40));
}

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;
