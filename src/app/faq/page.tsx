import type { Metadata } from 'next';
import { InfoPage, InfoSection } from '@/components/InfoPage';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about shipping, Afterpay & Zip, GST, returns, and how our AI-powered Australian store works.',
};

const FAQS = [
  {
    q: 'Are prices in Australian dollars?',
    a: 'Yes — every price on the site is in AUD and includes GST. What you see is exactly what you pay, with no surprise currency conversion or import fees.',
  },
  {
    q: 'Can I pay with Afterpay or Zip?',
    a: 'Absolutely. At checkout you can pay with Afterpay, Zip, all major credit and debit cards, Apple Pay, or Google Pay — all processed securely by Stripe.',
  },
  {
    q: 'How much is shipping?',
    a: 'Standard shipping is free on orders over $50 and $5.99 below that. Express shipping is $9.95 on any order. We ship to every state and territory in Australia.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Metro areas typically receive orders in 5–10 business days (3–5 with express). Regional and remote areas can take up to 14 business days. Every order includes tracking.',
  },
  {
    q: 'What does "AI-sourced" mean?',
    a: 'Our AI agents continuously scan verified global suppliers, compare quality-to-price ratios, check supplier ratings and reviews, and list only products that pass our quality checks — so you get good gear at low prices.',
  },
  {
    q: 'What if my item arrives damaged or never arrives?',
    a: 'We replace it or refund you in full, your choice, at no cost to you. Australian Consumer Law guarantees apply to everything we sell.',
  },
  {
    q: 'Can I return something if I change my mind?',
    a: 'Yes — we offer 30-day change-of-mind returns on unused items in original packaging, on top of your Australian Consumer Law rights.',
  },
  {
    q: 'Is checkout secure?',
    a: 'Yes. Payments are handled entirely by Stripe with bank-level encryption. We never see or store your card details.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <InfoPage
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about shopping with DropShop Australia."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {FAQS.map(f => (
        <InfoSection key={f.q} heading={f.q}>
          <p>{f.a}</p>
        </InfoSection>
      ))}
    </InfoPage>
  );
}
