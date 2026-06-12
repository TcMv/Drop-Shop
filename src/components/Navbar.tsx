'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiBox, FiShield } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
            <FiShield className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {isAdmin ? 'Dropship Admin' : 'Dropship Store'}
            </span>
          </Link>
          
          {/* Nav links */}
          <div className="flex items-center gap-6">
            {isAdmin ? (
              <>
                <Link href="/admin/audit" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Audit Log
                </Link>
                <Link href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  View Store
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Products
                </Link>
                <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  <FiShoppingCart className="w-4 h-4" />
                  Cart
                </Link>
                <Link href="/admin" className="text-sm text-gray-500 hover:text-blue-400 transition-colors">
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
