import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description:
    '30-day change-of-mind returns plus your full rights under Australian Consumer Law. Easy returns and fast refunds in AUD.',
};

export default function ReturnsPage() {
  return (
    <InfoPage
      title="Returns & Refunds"
      subtitle="30-day change-of-mind returns, plus your full rights under Australian Consumer Law."
    >
      <InfoSection heading="Your rights under Australian Consumer Law">
        <p>
          Our goods come with guarantees that cannot be excluded under the Australian Consumer
          Law. You are entitled to a replacement or refund for a major failure and compensation
          for any other reasonably foreseeable loss or damage. You are also entitled to have the
          goods repaired or replaced if the goods fail to be of acceptable quality and the
          failure does not amount to a major failure.
        </p>
        <p>
          These consumer guarantees apply in addition to — and are not limited by — our 30-day
          returns policy below.
        </p>
      </InfoSection>

      <InfoSection heading="30-day change-of-mind returns">
        <p>
          Changed your mind? No worries. You can return most items within 30 days of delivery
          for a full refund of the purchase price, provided the item is unused and in its
          original packaging. Return postage for change-of-mind returns is at your cost.
        </p>
      </InfoSection>

      <InfoSection heading="Faulty, damaged or incorrect items">
        <p>
          If your item arrives faulty, damaged, or isn&apos;t what you ordered, contact us with a
          photo and your order number. We&apos;ll cover return postage and offer you a
          replacement or full refund — whichever you prefer. No restocking fees, ever.
        </p>
      </InfoSection>

      <InfoSection heading="How to start a return">
        <ol className="list-decimal pl-5 space-y-2">
          <li>Email us via the <a href="/contact" className="text-[var(--color-brand-400)] hover:underline">contact page</a> with your order number.</li>
          <li>We&apos;ll reply within 1 business day with return instructions.</li>
          <li>Refunds are processed in AUD to your original payment method (including Afterpay and Zip) within 3–5 business days of us receiving the return.</li>
        </ol>
      </InfoSection>
    </InfoPage>
  );
}
