import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for DropShop Australia — pricing, payments, shipping, returns, and your rights under Australian Consumer Law.',
};

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      subtitle="The terms that apply when you shop with DropShop Australia. Last updated June 2026."
    >
      <InfoSection heading="Pricing and payment">
        <p>
          All prices are in Australian dollars (AUD) and include GST. Payment is processed
          securely by Stripe and may be made by credit or debit card, Afterpay, Zip, Apple Pay,
          or Google Pay. Your order is confirmed once payment has been authorised.
        </p>
      </InfoSection>

      <InfoSection heading="Shipping">
        <p>
          We ship Australia-wide. Delivery estimates shown at checkout are estimates only;
          see our <a href="/shipping" className="text-[var(--color-brand-400)] hover:underline">Shipping &amp; Delivery</a> page
          for details. Risk in the goods passes to you on delivery.
        </p>
      </InfoSection>

      <InfoSection heading="Returns and consumer guarantees">
        <p>
          Nothing in these terms excludes, restricts, or modifies any consumer guarantee, right,
          or remedy available to you under the Australian Consumer Law. Our voluntary 30-day
          change-of-mind returns policy applies in addition to those rights — see{' '}
          <a href="/returns" className="text-[var(--color-brand-400)] hover:underline">Returns &amp; Refunds</a>.
        </p>
      </InfoSection>

      <InfoSection heading="Product information">
        <p>
          Product listings are generated and verified by our AI agents from supplier data. We
          take care to ensure accuracy, but minor variations in colour or packaging can occur.
          If an item differs materially from its listing, you are entitled to a replacement or
          refund.
        </p>
      </InfoSection>

      <InfoSection heading="Order cancellation">
        <p>
          You may cancel an order at no cost any time before it is dispatched by contacting us.
          We may cancel and fully refund an order if a product becomes unavailable or was listed
          at an obviously incorrect price due to error.
        </p>
      </InfoSection>

      <InfoSection heading="Contact">
        <p>
          Questions about these terms? Reach us via the{' '}
          <a href="/contact" className="text-[var(--color-brand-400)] hover:underline">contact page</a>.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
