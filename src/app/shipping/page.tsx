import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description:
    'Free standard shipping Australia-wide on orders over $50. Delivery times, express options, and tracking for all Australian states and territories.',
};

export default function ShippingPage() {
  return (
    <InfoPage
      title="Shipping & Delivery"
      subtitle="We ship to every state and territory in Australia — free on orders over $50."
    >
      <InfoSection heading="Shipping rates">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-[var(--color-text-primary)]">Free standard shipping</strong> on all orders over $50 AUD.</li>
          <li><strong className="text-[var(--color-text-primary)]">Standard shipping — $5.99</strong> for orders under $50.</li>
          <li><strong className="text-[var(--color-text-primary)]">Express shipping — $9.95</strong> available on all orders at checkout.</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Delivery times">
        <p>
          Orders are dispatched within 1–2 business days. Because our AI agents source directly
          from verified suppliers, delivery times vary slightly by location:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-[var(--color-text-primary)]">Metro areas</strong> (Sydney, Melbourne, Brisbane, Perth, Adelaide): 5–10 business days standard, 3–5 express.</li>
          <li><strong className="text-[var(--color-text-primary)]">Regional areas</strong>: 7–14 business days standard, 5–7 express.</li>
          <li><strong className="text-[var(--color-text-primary)]">NT, TAS and remote areas</strong>: allow up to 14 business days.</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Tracking">
        <p>
          Every order ships with tracking. You&apos;ll receive a tracking link by email as soon as
          your order is dispatched, and our Ordering Agent monitors every shipment until it&apos;s
          delivered.
        </p>
      </InfoSection>

      <InfoSection heading="Missing or delayed orders">
        <p>
          If your order hasn&apos;t arrived within the estimated window, contact us and we&apos;ll
          chase it up with the carrier. If an order is lost in transit, we&apos;ll replace it or
          refund you in full — your choice.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
