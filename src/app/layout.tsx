import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['400'] });

export const metadata: Metadata = {
  title: 'DropShop — AI-Powered Dropshipping',
  description: 'Every product is AI-sourced, quality-checked, and delivered to your door. Smart sourcing, automated fulfillment, unbeatable value.',
  keywords: ['dropshipping', 'AI ecommerce', 'online store', 'smart shopping'],
  openGraph: {
    title: 'DropShop — AI-Powered Dropshipping',
    description: 'Every product is AI-sourced, quality-checked, and delivered to your door.',
    type: 'website',
    siteName: 'DropShop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DropShop — AI-Powered Dropshipping',
    description: 'Every product is AI-sourced, quality-checked, and delivered to your door.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
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
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-tertiary)] leading-relaxed max-w-xs">
                  AI-powered dropshipping. Every product curated by intelligent agents, quality-checked, and delivered to your door.
                </p>
              </div>

              {/* Links */}
              {[
                { title: 'Shop', links: ['All Products', 'Categories', 'New Arrivals', 'Best Sellers', 'Deals'] },
                { title: 'Support', links: ['Help Center', 'Shipping Info', 'Returns', 'Contact', 'FAQ'] },
                { title: 'Company', links: ['About', 'AI Technology', 'Careers', 'Privacy', 'Terms'] },
              ].map(col => (
                <div key={col.title}>
                  <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">{col.title}</h4>
                  <ul className="space-y-3">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-brand-400)] transition-colors duration-200">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border-default)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[var(--color-text-tertiary)]">
                © 2026 DropShop. All operations AI-powered and audited.
              </p>
              <div className="flex items-center gap-6">
                {['Twitter', 'Instagram', 'GitHub', 'Discord'].map(social => (
                  <a key={social} href="#" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-brand-400)] transition-colors">
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
