import type { Metadata } from 'next';
import { Inter, Oswald, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const oswald = Oswald({ subsets: ['latin'], display: 'swap', variable: '--font-display' });
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-accent' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['400'] });

export const metadata: Metadata = {
  title: 'Slice & Dice Golf — Accessories for the Other 90%',
  description: 'AU golf accessories for weekend hackers. Personalised ball stamps, towels, divot tools, and more. Hit it. Slice it. Try again.',
  keywords: ['golf accessories', 'AU golf store', 'personalised golf', 'golf gifts', 'hackers club', 'slice and dice'],
  openGraph: {
    title: 'Slice & Dice Golf — Accessories for the Other 90%',
    description: 'AU golf accessories for weekend hackers. Hit it. Slice it. Try again.',
    type: 'website',
    siteName: 'Slice & Dice Golf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slice & Dice Golf — Accessories for the Other 90%',
    description: 'AU golf accessories for weekend hackers. Hit it. Slice it. Try again.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border-default)]" style={{ background: '#1B3A2D' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#40916C] flex items-center justify-center shadow-lg shadow-[#2D6A4F]/30">
                    <svg className="w-5 h-5 text-[#FBFBFB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="9" cy="9" r="0.8" fill="currentColor" />
                      <circle cx="15" cy="15" r="0.8" fill="currentColor" />
                      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold tracking-tight text-[#FBFBFB]" style={{ fontFamily: 'var(--font-display)' }}>
                    SLICE & DICE
                    <span className="block text-xs font-normal text-[#E8DCC4]" style={{ fontFamily: 'var(--font-body)' }}>GOLF</span>
                  </span>
                </div>
                <p className="text-sm text-[#E8DCC4] leading-relaxed max-w-xs">
                  Accessories for the other 90%. AU golf gear for weekend hackers who don't take themselves too seriously.
                </p>
              </div>

              {/* Links */}
              {[
                { title: 'Shop', links: ['All Products', 'Personalised', 'Accessories', 'The Hackers Club'] },
                { title: 'Support', links: ['Shipping Info', 'Returns', 'Contact', 'FAQ'] },
                { title: 'Company', links: ['About', 'The Hackers Club', 'Privacy', 'Terms'] },
              ].map(col => (
                <div key={col.title}>
                  <h4 className="text-xs font-semibold text-[#E8DCC4] uppercase tracking-widest mb-4">{col.title}</h4>
                  <ul className="space-y-3">
                    {col.links.map(link => (
                      <li key={link}>
                        <a href="#" className="text-sm text-[#FBFBFB]/60 hover:text-[#52B788] transition-colors duration-200">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-[#FBFBFB]/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#E8DCC4]/60">
                © 2026 Slice & Dice Golf. Hit it. Slice it. Try again.
              </p>
              <div className="flex items-center gap-6">
                {['Instagram', 'Facebook', 'TikTok'].map(social => (
                  <a key={social} href="#" className="text-xs text-[#FBFBFB]/60 hover:text-[#52B788] transition-colors">
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
