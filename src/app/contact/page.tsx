import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with DropShop Australia — order help, returns, and general questions. We reply within 1 business day.',
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact Us"
      subtitle="We reply to every message within 1 business day (AEST)."
    >
      <InfoSection heading="Order support">
        <p>
          For anything about an existing order — tracking, changes, returns, or refunds — email{' '}
          <a href="mailto:support@dropshop.au" className="text-[var(--color-brand-400)] hover:underline">
            support@dropshop.au
          </a>{' '}
          and include your order number. You can find it in your confirmation email.
        </p>
      </InfoSection>

      <InfoSection heading="General enquiries">
        <p>
          Questions about products, payments (Afterpay, Zip, cards), or anything else? Email{' '}
          <a href="mailto:hello@dropshop.au" className="text-[var(--color-brand-400)] hover:underline">
            hello@dropshop.au
          </a>.
        </p>
      </InfoSection>

      <InfoSection heading="Response times">
        <p>
          Our support hours are 9am–5pm AEST, Monday to Friday. Messages received outside these
          hours are answered the next business day. Urgent delivery issues are prioritised.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
