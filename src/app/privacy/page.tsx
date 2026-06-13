import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How DropShop Australia collects, uses, and protects your personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles.',
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      subtitle="How we handle your personal information, in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles."
    >
      <InfoSection heading="What we collect">
        <p>
          When you place an order we collect your name, email address, phone number (optional),
          and shipping address. We use this information solely to process and deliver your order
          and to contact you about it.
        </p>
        <p>
          Payment details are collected and processed by Stripe, our payment provider. We never
          see or store your card, Afterpay, or Zip account details.
        </p>
      </InfoSection>

      <InfoSection heading="How we use your information">
        <ul className="list-disc pl-5 space-y-2">
          <li>Processing and delivering your orders, including sharing your shipping address with delivery carriers.</li>
          <li>Sending order confirmations, tracking updates, and responding to support requests.</li>
          <li>Improving the store — aggregate, de-identified analytics only.</li>
        </ul>
        <p>We do not sell your personal information, and we do not send marketing emails without your consent.</p>
      </InfoSection>

      <InfoSection heading="Storage and security">
        <p>
          Order data is stored securely with industry-standard encryption. Your cart is stored
          locally in your own browser and never leaves your device until you check out.
        </p>
      </InfoSection>

      <InfoSection heading="Access, correction and complaints">
        <p>
          You may request access to, or correction of, the personal information we hold about
          you at any time via our <a href="/contact" className="text-[var(--color-brand-400)] hover:underline">contact page</a>.
          If you have a privacy concern we can&apos;t resolve, you can complain to the Office of
          the Australian Information Commissioner (OAIC) at oaic.gov.au.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
