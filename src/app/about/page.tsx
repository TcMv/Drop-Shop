import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'DropShop Australia is an AI-powered online store built for Australian shoppers — smart sourcing, honest AUD pricing, and delivery to every corner of the country.',
};

export default function AboutPage() {
  return (
    <InfoPage
      title="About DropShop Australia"
      subtitle="An AI-powered store built for Australian shoppers."
    >
      <InfoSection heading="Our mission">
        <p>
          Aussies pay too much for everyday products. Between the &ldquo;Australia tax&rdquo;,
          inflated retail markups, and confusing overseas sites with hidden fees, getting a fair
          price usually means hours of comparison shopping. We built DropShop to fix that.
        </p>
      </InfoSection>

      <InfoSection heading="How we're different">
        <p>
          Four AI agents run the store around the clock. A Sourcing Agent scans verified global
          suppliers for the best quality-to-price products. An Audit Agent checks supplier
          ratings, reviews, and shipping reliability before anything is listed. A Listing Agent
          writes honest descriptions and sets fair AUD prices. An Ordering Agent processes
          your order, arranges shipping, and tracks it to your door.
        </p>
        <p>
          The result: low prices without the usual dropshipping pain — slow untracked shipping,
          mystery quality, and non-existent customer service.
        </p>
      </InfoSection>

      <InfoSection heading="Built for Australia">
        <ul className="list-disc pl-5 space-y-2">
          <li>All prices in AUD, GST included — no currency conversion surprises.</li>
          <li>Afterpay and Zip at checkout.</li>
          <li>Free standard shipping Australia-wide on orders over $50.</li>
          <li>30-day returns plus full Australian Consumer Law guarantees.</li>
        </ul>
      </InfoSection>
    </InfoPage>
  );
}
