'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiShield, FiSearch, FiChevronDown, FiPackage, FiHome, FiGrid } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { name: 'Electronics', icon: '🔌' }, { name: 'Home', icon: '🏠' }, { name: 'Travel', icon: '✈️' },
  { name: 'Kitchen', icon: '🍳' }, { name: 'Fitness', icon: '💪' }, { name: 'Beauty', icon: '✨' },
  { name: 'Accessories', icon: '🎒' }, { name: 'Wellness', icon: '🧘' }, { name: 'Pets', icon: '🐾' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const update = () => {
      try { const c = JSON.parse(localStorage.getItem('cart')||'[]'); setCartCount(c.reduce((s: number,i:any)=>s+i.quantity,0)); }
      catch { setCartCount(0); }
    };
    update();
    window.addEventListener('cart-updated', update);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('cart-updated', update); window.removeEventListener('scroll', onScroll); };
  }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`; };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FiShield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Drop</span><span className="text-white">Shop</span>
            </span>
          </Link>

          {!isAdmin && (
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors relative group">Home<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" /></Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"><FiGrid className="w-3.5 h-3.5" />Categories<FiChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" /></button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-elevated)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {CATEGORIES.map(cat => (
                      <Link key={cat.name} href={`/?category=${cat.name.toLowerCase()}`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[var(--color-accent-subtle)] transition-colors">
                        <span className="text-lg">{cat.icon}</span>{cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors relative group">Deals<span className="absolute -top-2 -right-4 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">HOT</span></Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            {!isAdmin && (
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all" />
                </div>
              </form>
            )}
            {!isAdmin && (
              <Link href="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">{cartCount > 9 ? '9+' : cartCount}</span>}
              </Link>
            )}
            <Link href={isAdmin ? '/' : '/admin'} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-border)] text-gray-400 hover:text-white hover:border-[var(--color-accent)]/30 transition-all">
              {isAdmin ? <FiHome className="w-3.5 h-3.5" /> : <FiPackage className="w-3.5 h-3.5" />}{isAdmin ? 'Store' : 'Admin'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
