import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dropship Store — AI-Powered',
  description: 'AI-run dropshipping store. Fully automated product sourcing, listing, and order processing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
          <p>AI-Powered Dropshipping Store — All operations logged for audit</p>
          <p className="mt-1">This store is fully automated. Every action is recorded in the audit log.</p>
        </footer>
      </body>
    </html>
  );
}
