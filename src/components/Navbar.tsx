'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiShoppingCart, FiMenu, FiX, FiGrid
} from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
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
      setScrolled(window.scrollY > 40 || !isHome);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome]);

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
            {/* Dice Ball Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D6A4F] to-[#40916C] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#2D6A4F]/30">
              <svg className="w-5 h-5 text-[#FBFBFB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <circle cx="9" cy="9" r="0.8" fill="currentColor" />
                <circle cx="15" cy="15" r="0.8" fill="currentColor" />
                <circle cx="12" cy="12" r="0.8" fill="currentColor" />
              </svg>
            </div>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
                SLICE & DICE
              </span>
              <span className="text-[10px] font-normal text-[#E8DCC4] -mt-1">
                GOLF
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isAdmin && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors relative group"
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#2D6A4F] to-[#52B788] transition-all group-hover:w-full rounded-full" />
              </Link>

              {/* Categories */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  <FiGrid className="w-3.5 h-3.5" />
                  Personalised
                  <FiMenu className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] rounded-2xl shadow-[var(--shadow-elevated)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-3 space-y-1">
                    {[
                      { name: 'Ball Stamps', icon: '🏏' },
                      { name: 'Towels', icon: '🧴' },
                      { name: 'Divot Tools', icon: '🔧' },
                      { name: 'Ball Markers', icon: '📍' },
                      { name: 'Scorecard Holders', icon: '📋' },
                    ].map(cat => (
                      <Link
                        key={cat.name}
                        href={`/?category=${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(45,106,79,0.08)] transition-all"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="#hackers-club"
                className="text-sm text-[#D4A843] hover:text-[#E8C25A] transition-colors relative group font-semibold"
              >
                The Hackers Club
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4A843] transition-all group-hover:w-full rounded-full" />
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            {/* Cart */}
            {!isAdmin && (
              <Link
                href="/cart"
                className="relative p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-xl hover:bg-[rgba(45,106,79,0.06)]"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-[#2D6A4F] to-[#40916C] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-[#2D6A4F]/30">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Admin toggle */}
            <Link
              href={isAdmin ? '/' : '/admin'}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] transition-all"
            >
              {isAdmin ? 'Store' : 'Admin'}
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
              className="block px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(45,106,79,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏌️ Shop
            </Link>
            <Link
              href="#hackers-club"
              className="block px-4 py-3 rounded-xl text-sm text-[#D4A843] hover:text-[#E8C25A] hover:bg-[rgba(212,168,67,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              🎲 The Hackers Club
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(45,106,79,0.06)] transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
