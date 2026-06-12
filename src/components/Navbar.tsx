'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiShoppingCart, FiSearch, FiChevronDown,
  FiPackage, FiHome, FiGrid, FiZap, FiMenu, FiX
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { name: 'Electronics', icon: '🔌' }, { name: 'Home', icon: '🏠' },
  { name: 'Travel', icon: '✈️' }, { name: 'Kitchen', icon: '🍳' },
  { name: 'Fitness', icon: '💪' }, { name: 'Beauty', icon: '✨' },
  { name: 'Wellness', icon: '🧘' }, { name: 'Pets', icon: '🐾' },
  { name: 'Accessories', icon: '🎒' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = pathname.startsWith('/admin');
  const isHome = pathname === '/';

  useEffect(() => {
    const update = () => {
      try {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(c.reduce((s: number, i: any) => s + i.quantity, 0));
      } catch { setCartCount(0); }
    };
    update();
    window.addEventListener('cart-updated', update);
    const onScroll = () => {
      // Only apply glass effect when scrolled OR on inner pages
      setScrolled(window.scrollY > 40 || !isHome);
    };
    onScroll(); // initial check
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href={isAdmin ? '/admin' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-[#08080a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="amber-gradient">Drop</span>
              <span className="text-[var(--color-text-primary)]">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all group-hover:w-full rounded-full" />
              </Link>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  <FiGrid className="w-3.5 h-3.5" />
                  Categories
                  <FiChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] rounded-2xl shadow-[var(--shadow-elevated)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-3 grid grid-cols-2 gap-1">
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.name}
                        href={`/?category=${cat.name.toLowerCase()}`}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(251,191,36,0.06)] transition-all"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="#deals"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                Deals
                <span className="absolute -top-2 -right-5 text-[10px] bg-gradient-to-r from-red-500 to-red-600 text-white px-1.5 py-0.5 rounded-full font-bold shadow-lg shadow-red-500/30">
                  HOT
                </span>
              </Link>

              <Link
                href="/#how-it-works"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all group-hover:w-full rounded-full" />
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            {!isAdmin && (
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-40 lg:w-52 pl-10 pr-4 py-2 bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] rounded-full text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-border-active)] focus:ring-1 focus:ring-[rgba(251,191,36,0.06)] transition-all"
                  />
                </div>
              </form>
            )}

            {/* Cart */}
            {!isAdmin && (
              <Link
                href="/cart"
                className="relative p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-xl hover:bg-[rgba(251,191,36,0.06)]"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-[10px] font-bold text-[#08080a] shadow-lg shadow-amber-500/30">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Admin / Store toggle */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] transition-all"
            >
              {isAdmin ? (
                <><FiHome className="w-3.5 h-3.5" /> Store</>
              ) : (
                <><FiPackage className="w-3.5 h-3.5" /> Admin</>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--color-border-default)] bg-[var(--color-surface-canvas)]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(251,191,36,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              href="/#deals"
              className="block px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(251,191,36,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔥 Deals
            </Link>
            <Link
              href="/#how-it-works"
              className="block px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(251,191,36,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              🤖 How It Works
            </Link>
            <div className="border-t border-[var(--color-border-default)] my-2" />
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(251,191,36,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
