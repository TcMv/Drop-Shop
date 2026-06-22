'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiTruck, FiStar, FiShield, FiClock, FiArrowRight, FiCheck } from 'react-icons/fi';

interface Product {
  id: string; title: string; slug: string; description: string;
  price: number; cost: number; images: string[]; category: string;
  tags: string[]; stock: number; status: string;
}

const TRUST_METRICS = [
  { label: 'Products', value: '15+', icon: '🏌️' },
  { label: 'Free Shipping', value: 'Over $99', icon: '📦' },
  { label: 'AU Delivery', value: '14-21 Days', icon: '🦘' },
  { label: 'Hackers Club', value: 'Free to Join', icon: '🎲' },
];

function RevealOnScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function StarRating({ rating = 4.5, count = 128 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="rating-stars">
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      </div>
      <span className="text-xs text-[var(--color-text-tertiary)]">({count})</span>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/products?status=active')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setProducts)
      .catch(err => {
        console.error('Failed to load products:', err);
        // Retry once after 5s on failure
        setTimeout(() => {
          fetch('/api/products?status=active')
            .then(r => r.ok && r.json().then(setProducts).catch(() => {}))
            .catch(() => {});
        }, 5000);
      });
  }, []);

  const featured = products.slice(0, 8);
  const personalised = products.filter(p => p.category === 'personalised');
  const standards = products.filter(p => p.category === 'standard');

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-blob hero-blob--3" />

        {/* Dark green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B3A2D]/40 via-transparent to-[#0C0C0C]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-surface-canvas)] to-transparent z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(45,106,79,0.1)] border border-[rgba(45,106,79,0.15)] text-sm text-[#52B788] mb-6">
                  <span>🏌️</span>
                  AU Golf Accessories — Free Shipping Over $99
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-6 uppercase">
                  <span className="text-[var(--color-text-primary)]">Hit it.</span>
                  <br />
                  <span className="golf-gradient">Slice it.</span>
                  <br />
                  <span className="text-[var(--color-text-primary)]">Try again.</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll>
                <p className="text-lg sm:text-xl text-[#E8DCC4] max-w-lg mb-10 leading-relaxed">
                  Accessories for the other 90%. Premium golf gear for weekend hackers who don't take themselves too seriously. Built for AU fairways.
                </p>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#products"
                    className="btn-primary flex items-center gap-2 text-base px-10 py-4"
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    <span>Shop Accessories</span>
                  </Link>
                  <Link
                    href="#hackers-club"
                    className="btn-secondary flex items-center gap-2 text-base px-10 py-4 border-[#D4A843]/30 text-[#D4A843] hover:border-[#D4A843]/50"
                  >
                    <span>🎲</span>
                    Join The Hackers Club
                  </Link>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="flex flex-wrap gap-8 mt-12">
                  {[
                    { icon: FiShield, text: 'AU Sourced' },
                    { icon: FiTruck, text: 'Free Shipping $99+' },
                    { icon: FiClock, text: '30-Day Returns' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2.5 text-sm text-[var(--color-text-tertiary)]">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(45,106,79,0.08)] flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#52B788]" />
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            {/* Right — Dice Ball Graphic */}
            <RevealOnScroll>
              <div className="relative flex items-center justify-center">
                <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-[#1B3A2D] to-[#0C0C0C] border border-[rgba(45,106,79,0.2)] flex items-center justify-center shadow-2xl shadow-[#2D6A4F]/20">
                  <div className="text-center">
                    {/* Dice ball SVG */}
                    <svg viewBox="0 0 120 120" className="w-48 h-48 sm:w-64 sm:h-64">
                      {/* Golf ball */}
                      <defs>
                        <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#FBFBFB" />
                          <stop offset="100%" stopColor="#E8DCC4" />
                        </radialGradient>
                      </defs>
                      <circle cx="60" cy="60" r="55" fill="url(#ballGrad)" />
                      {/* Dimple pattern */}
                      {[18, 30, 42, 54, 66, 78, 90].map((cx, i) =>
                        [18, 30, 42, 54, 66, 78, 90].map((cy, j) => {
                          const dx = cx - 60, dy = cy - 60;
                          if (Math.sqrt(dx*dx + dy*dy) > 52) return null;
                          return <circle key={`${i}-${j}`} cx={cx} cy={cy} r="2.5" fill="#D4C9B0" opacity="0.4" />;
                        })
                      )}
                      {/* Dice pips (three-dot L-shape) */}
                      <circle cx="44" cy="44" r="5" fill="#1B3A2D" />
                      <circle cx="60" cy="60" r="5" fill="#1B3A2D" />
                      <circle cx="76" cy="76" r="5" fill="#1B3A2D" />
                      {/* Slice curve */}
                      <path d="M 90 20 Q 110 40 95 75" stroke="#2D6A4F" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="3,3" />
                    </svg>
                    <p className="text-sm text-[#E8DCC4] mt-4" style={{ fontFamily: 'var(--font-display)' }}>
                      SLICE & DICE GOLF
                    </p>
                    <p className="text-[10px] text-[#E8DCC4]/60 uppercase tracking-widest mt-1">
                      Accessories for the other 90%
                    </p>
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#2D6A4F]/10 rounded-full blur-[80px] pointer-events-none" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST METRICS ═══════════ */}
      <section className="border-t border-[var(--color-border-default)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TRUST_METRICS.map((metric, i) => (
              <RevealOnScroll key={metric.label}>
                <div className="text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(45,106,79,0.06)] border border-[rgba(45,106,79,0.08)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(45,106,79,0.1)] group-hover:border-[rgba(45,106,79,0.15)] transition-all">
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <p className="text-3xl font-bold font-display text-[var(--color-text-primary)] mb-1">
                    {metric.value}
                  </p>
                  <p className="text-sm text-[var(--color-text-tertiary)]">{metric.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED PRODUCTS ═══════════ */}
      <section id="products" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2 uppercase">
                  Featured <span className="golf-gradient">Gear</span>
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Curated accessories for your round
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                <span className="w-2 h-2 rounded-full bg-[#52B788]" />
                {products.length} products
              </div>
            </div>
          </RevealOnScroll>

          {!mounted || products.length === 0 ? (
            <div className="text-center py-24">
              <div className="dice-ball-loader mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Loading Gear...
              </h3>
              <p className="text-[var(--color-text-tertiary)]">
                We&apos;re teeing up our latest accessories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((p, i) => (
                <RevealOnScroll key={p.id}>
                  <Link href={`/products/${p.slug}`} className="product-card group block">
                    <div className="product-card-image aspect-square">
                      <img
                        src={p.images[0] || '/placeholder.png'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        {p.category === 'personalised' ? (
                          <span className="personalised-badge">Personalised</span>
                        ) : (
                          <span className="category-badge">{p.category}</span>
                        )}
                        <span className="text-xs text-[#52B788] font-medium flex items-center gap-1">
                          <FiCheck className="w-3 h-3" />
                          In Stock
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[#52B788] transition-colors line-clamp-2 mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">
                          ${p.price.toFixed(2)} AUD
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#52B788] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <FiShoppingBag className="w-3 h-3" />
                          Quick View
                        </span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ THE HACKERS CLUB ═══════════ */}
      <section id="hackers-club" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: '#1B3A2D' }} />
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="hero-blob hero-blob--1" style={{ background: 'rgba(212, 168, 67, 0.08)', top: '-20%' }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealOnScroll>
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(212,168,67,0.1)] border border-[rgba(212,168,67,0.15)] text-sm gold-text mb-4">
                🎲 Free to Join
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-accent, var(--font-display))' }}>
              The <span className="gold-gradient">Hackers</span> Club
            </h2>
            <p className="text-lg text-[#E8DCC4] max-w-xl mx-auto mb-4">
              No tiers. No points. Just perks for the other 90%.
            </p>
            <p className="text-sm text-[#E8DCC4]/70 max-w-lg mx-auto mb-10">
              Free shipping over $79 · 10% off all core products · Early access to drops · 
              Member-only products · Birthday bonus · Monthly comps
            </p>

            {/* Email signup */}
            {!emailSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setEmailSubmitted(true);
                }}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input-field flex-1 bg-[#0C0C0C]/50 border-[rgba(212,168,67,0.15)] focus:border-[#D4A843] text-center sm:text-left"
                  style={{ color: '#FBFBFB' }}
                />
                <button type="submit" className="btn-gold whitespace-nowrap px-8 py-3 text-sm">
                  Join Free
                </button>
              </form>
            ) : (
              <div className="p-8 rounded-2xl bg-[rgba(212,168,67,0.06)] border border-[rgba(212,168,67,0.12)] max-w-md mx-auto">
                <p className="gold-text font-semibold text-lg">🎉 Welcome to the club!</p>
                <p className="text-sm text-[#E8DCC4]/70 mt-2">Check your email for your member number and perks.</p>
              </div>
            )}

            {/* Benefits grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
              {[
                { icon: '🚚', text: 'Free Shipping $79+' },
                { icon: '🏷️', text: '10% Off Core' },
                { icon: '⏰', text: 'Early Access' },
                { icon: '🎲', text: 'Member-Only' },
                { icon: '🎁', text: 'Birthday Bonus' },
                { icon: '🏆', text: 'Monthly Comps' },
              ].map(b => (
                <div key={b.text} className="p-4 rounded-xl bg-[rgba(12,12,12,0.3)] border border-[rgba(212,168,67,0.08)]">
                  <span className="text-2xl block mb-2">{b.icon}</span>
                  <span className="text-xs text-[#E8DCC4]/80">{b.text}</span>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ═══════════ PERSONALISED SECTION ═══════════ */}
      {personalised.length > 0 && (
        <section className="section-padding">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2 uppercase">
                    Make It <span className="golf-gradient">Yours</span>
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Custom-engraved and personalised gear
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalised.slice(0, 6).map((p, i) => (
                <RevealOnScroll key={p.id}>
                  <Link href={`/products/${p.slug}`} className="product-card group block">
                    <div className="product-card-image aspect-square">
                      <span className="personalised-badge absolute top-4 left-4 z-10">Personalised</span>
                      <img
                        src={p.images[0] || '/placeholder.png'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[#52B788] transition-colors line-clamp-2 mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">
                          ${p.price.toFixed(2)} AUD
                        </span>
                        <span className="text-xs text-[#52B788] font-medium">
                          Custom
                        </span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ BRAND MARQUEE ═══════════ */}
      <section className="border-t border-[var(--color-border-default)] py-10">
        <div className="marquee">
          <div className="marquee-inner">
            {[...Array(2)].map((_, arrIdx) => (
              <div key={arrIdx} className="flex items-center gap-12">
                {[
                  { name: 'AU Delivery', icon: '🦘' },
                  { name: 'Free Shipping $99+', icon: '📦' },
                  { name: 'Personalised Available', icon: '✏️' },
                  { name: 'Hackers Club', icon: '🎲' },
                  { name: 'Premium Quality', icon: '🏌️' },
                  { name: '30-Day Returns', icon: '🔄' },
                  { name: 'AU Delivery', icon: '🦘' },
                  { name: 'Free Shipping $99+', icon: '📦' },
                  { name: 'Personalised Available', icon: '✏️' },
                  { name: 'Hackers Club', icon: '🎲' },
                  { name: 'Premium Quality', icon: '🏌️' },
                  { name: '30-Day Returns', icon: '🔄' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] whitespace-nowrap">
                    <span>{item.icon}</span>
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="hero-blob hero-blob--2" style={{ opacity: 0.15 }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealOnScroll>
            <div className="p-12 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/40 backdrop-blur-sm glow-border">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/20 to-[#40916C]/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏌️</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 uppercase">
                Ready to <span className="golf-gradient">Slice</span> and Dice?
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
                Join the hackers. Premium AU golf accessories that won't fix your slice, but at least you'll look good slicing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="#products" className="btn-primary flex items-center gap-2 px-10 py-4">
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>
                <Link href="#hackers-club" className="btn-secondary flex items-center gap-2 px-10 py-4">
                  <span>🎲</span>
                  Join The Hackers Club
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
