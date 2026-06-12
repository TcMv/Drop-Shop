import type { Metadata } from 'next';
import './../globals.css';

export const metadata: Metadata = {
  title: 'Dropship Admin — AI Operations',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
