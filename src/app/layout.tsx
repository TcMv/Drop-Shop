import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['400'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drop-shop-plum.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DropShop Australia — AI-Powered Online Shopping | Afterpay & Zip',
    template: '%s | DropShop Australia',
  },
  description:
    'Australia’s smartest online store. AI-sourced products at unbeatable prices, free shipping Australia-wide over $50, Afterpay & Zip available. All prices in AUD inc. GST.',
  keywords: [
    'online shopping australia', 'afterpay stores', 'zip pay shopping',
    'free shipping australia', 'cheap online shopping au', 'dropshipping australia',
    'AI shopping', 'gadgets australia', 'home essentials australia',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'DropShop Australia — AI-Powered Online Shopping',
    description:
      'AI-sourced products at unbeatable prices. Free shipping Australia-wide over $50. Afterpay & Zip available.',
    type: 'website',
    siteName: 'DropShop Australia',
    locale: 'en_AU',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DropShop Australia — AI-Powered Online Shopping',
    description:
      'AI-sourced products at unbeatable prices. Free shipping Australia-wide over $50. Afterpay & Zip available.',
  },
  robots: { index: true, follow: true },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': `${siteUrl}/#organization`,
      name: 'DropShop Australia',
      url: siteUrl,
      description: 'AI-powered online store shipping Australia-wide. Afterpay, Zip, and all major cards accepted.',
      currenciesAccepted: 'AUD',
      paymentAccepted: 'Credit Card, Afterpay, Zip, Apple Pay, Google Pay',
      areaServed: { '@type': 'Country', name: 'Australia' },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'DropShop Australia',
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/?search={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/#products' },
      { label: 'Categories', href: '/#categories' },
      { label: 'Deals', href: '/#deals' },
      { label: 'How It Works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border-default)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <svg className="w-5 h-5 text-[#08080a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold tracking-tight">
                    <span className="amber-gradient">Drop</span>
                    <span className="text-[var(--color-text-primary)]">Shop</span>
                    <span className="text-xs font-semibold text-[var(--color-text-tertiary)] ml-1.5">AU</span>
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed max-w-xs mb-5">
                  Australia&apos;s smartest online store. AI-curated products, quality-checked, and
                  delivered to your door anywhere in Australia.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Visa', 'Mastercard', 'Amex', 'Afterpay', 'Zip', 'Apple Pay', 'Google Pay'].map(method => (
                    <span
                      key={method}
                      className="px-2.5 py-1 rounded-md bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] text-[10px] font-medium text-[var(--color-text-tertiary)]"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {FOOTER_COLUMNS.map(col => (
                <div key={col.title}>
                  <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">{col.title}</h4>
                  <ul className="space-y-3">
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-brand-400)] transition-colors duration-200">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border-default)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[var(--color-text-tertiary)]">
                © 2026 DropShop Australia. All prices in AUD and include GST.
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                🇦🇺 Free shipping Australia-wide on orders over $50
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
