import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'DropShop — AI-Powered E-Commerce',
  description: 'AI-curated products at unbeatable prices. Smart sourcing, automated fulfillment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-[var(--color-border)] py-12 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="font-bold text-sm">
                <span className="gradient-text">Drop</span>
                <span className="text-white">Shop</span>
              </span>
            </div>
            <p className="text-sm text-gray-600">AI-Powered Dropshipping — All operations logged for audit</p>
            <p className="text-xs text-gray-700 mt-2">Every product AI-sourced, quality-checked, and fulfilled automatically.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
