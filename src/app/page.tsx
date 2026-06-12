'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiShoppingBag, FiTrendingUp, FiTruck, FiStar, FiShield,
  FiClock, FiZap, FiArrowRight, FiCheck, FiCpu, FiPackage,
  FiBarChart2, FiGlobe, FiDollarSign, FiActivity
} from 'react-icons/fi';
import { getProducts, Product } from '@/lib/db';

const CATEGORIES = [
  { name: 'Electronics', icon: '🔌', desc: 'Gadgets & gear', color: 'from-amber-500/10 to-amber-700/5' },
  { name: 'Home', icon: '🏠', desc: 'Living essentials', color: 'from-amber-400/10 to-amber-600/5' },
  { name: 'Travel', icon: '✈️', desc: 'On the go', color: 'from-amber-300/10 to-amber-500/5' },
  { name: 'Kitchen', icon: '🍳', desc: 'Cook & prep', color: 'from-amber-600/10 to-amber-800/5' },
  { name: 'Fitness', icon: '💪', desc: 'Active life', color: 'from-amber-500/10 to-amber-700/5' },
  { name: 'Beauty', icon: '✨', desc: 'Look good', color: 'from-amber-400/10 to-amber-600/5' },
  { name: 'Wellness', icon: '🧘', desc: 'Mind & body', color: 'from-amber-300/10 to-amber-500/5' },
  { name: 'Pets', icon: '🐾', desc: 'For your pets', color: 'from-amber-600/10 to-amber-800/5' },
];

const TRUST_METRICS = [
  { label: 'Products Sourced', value: '2,847+', icon: FiPackage },
  { label: 'Orders Fulfilled', value: '12.5K', icon: FiTruck },
  { label: 'Avg. Savings', value: '37%', icon: FiDollarSign },
  { label: 'AI Agents Running', value: '4', icon: FiCpu },
];

const AGENT_ACTIVITIES = [
  { agent: 'Sourcing Agent', action: 'Scanned AliExpress for "wireless earbuds 2024"', status: 'completed', time: 'Just now' },
  { agent: 'Listing Agent', action: 'Created product page for new headphones', status: 'active', time: '2 min ago' },
  { agent: 'Audit Agent', action: 'Verified 3 supplier ratings — all >4.5★', status: 'completed', time: '5 min ago' },
  { agent: 'Sourcing Agent', action: 'Found 12 new products in Electronics', status: 'active', time: '8 min ago' },
  { agent: 'Ordering Agent', action: 'Processed order #1042 — shipped via DHL', status: 'completed', time: '12 min ago' },
  { agent: 'Audit Agent', action: 'Price check: 6 products updated', status: 'completed', time: '15 min ago' },
];

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

function DiscountBadge({ percent }: { percent: number }) {
  return <div className="discount-badge">-{percent}%</div>;
}

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeActivity, setActiveActivity] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate activity feed cycling
    const interval = setInterval(() => {
      setActiveActivity(prev => (prev + 1) % AGENT_ACTIVITIES.length);
    }, 4000);
    // Fetch products
    fetch('/api/products?status=active')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {});
    return () => clearInterval(interval);
  }, []);

  const deals = products.slice(0, 4).map(p => ({ ...p, discount: Math.floor(Math.random() * 25) + 15 }));
  const featured = products.slice(0, 8);

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-blob hero-blob--3" />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-surface-canvas)] to-transparent z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.12)] text-sm text-[var(--color-brand-400)] mb-6">
                  <FiZap className="w-3.5 h-3.5" />
                  AI-Powered — New Products Daily
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-6">
                  <span className="text-[var(--color-text-primary)]">Shop </span>
                  <span className="amber-gradient">Smarter.</span>
                  <br />
                  <span className="text-[var(--color-text-primary)]">Save </span>
                  <span className="amber-gradient">More.</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll>
                <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-lg mb-10 leading-relaxed">
                  Every product is <strong className="text-[var(--color-text-primary)]">AI-sourced</strong> from top suppliers, quality-checked, and delivered to your door. No markup games — just unbeatable value.
                </p>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#products"
                    className="btn-primary flex items-center gap-2 text-base px-10 py-4 text-sm"
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    <span>Shop Now</span>
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="btn-secondary flex items-center gap-2 text-base px-10 py-4"
                  >
                    <FiCpu className="w-4 h-4" />
                    How It Works
                  </Link>
                </div>
              </RevealOnScroll>

              <RevealOnScroll>
                <div className="flex flex-wrap gap-8 mt-12">
                  {[
                    { icon: FiShield, text: 'Secure Checkout' },
                    { icon: FiTruck, text: 'Free Shipping' },
                    { icon: FiClock, text: '30-Day Returns' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-2.5 text-sm text-[var(--color-text-tertiary)]">
                      <div className="w-8 h-8 rounded-lg bg-[rgba(251,191,36,0.08)] flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[var(--color-brand-400)]" />
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            {/* Right — Live AI Activity Feed */}
            <RevealOnScroll>
              <div className="relative">
                {/* Glass card */}
                <div className="relative rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/60 backdrop-blur-xl p-8 glow-border">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(251,191,36,0.1)] flex items-center justify-center">
                        <FiActivity className="w-5 h-5 text-[var(--color-brand-400)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">AI Agent Activity</h3>
                        <p className="text-xs text-[var(--color-text-tertiary)]">Live feed — automatic operations</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Running
                    </span>
                  </div>

                  {/* Activity list */}
                  <div className="space-y-3">
                    {AGENT_ACTIVITIES.map((act, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-500 ${
                          i === activeActivity
                            ? 'bg-[rgba(251,191,36,0.06)] border border-[rgba(251,191,36,0.1)]'
                            : 'bg-transparent border border-transparent'
                        }`}
                      >
                        <div className={`activity-dot ${act.status === 'active' ? 'amber' : 'green'} mt-1`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                              {act.agent}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-tertiary)]">
                              {act.time}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-text-primary)] mt-0.5 line-clamp-1">
                            {act.action}
                          </p>
                        </div>
                        {act.status === 'active' && (
                          <div className="flex items-center gap-1 text-[10px] text-[var(--color-brand-400)] whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-400)] animate-pulse" />
                            Processing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
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
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(251,191,36,0.06)] border border-[rgba(251,191,36,0.08)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(251,191,36,0.1)] group-hover:border-[rgba(251,191,36,0.15)] transition-all">
                    <metric.icon className="w-6 h-6 text-[var(--color-brand-400)]" />
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

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.12)] text-sm text-[var(--color-brand-400)] mb-4">
                <FiCpu className="w-3.5 h-3.5" />
                Powered by AI
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">
                How It <span className="amber-gradient">Works</span>
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Four AI agents working 24/7 to find, verify, list, and deliver the best products at the lowest prices.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Source',
                desc: 'AI scans global suppliers for the best quality-to-price ratio products.',
                icon: FiGlobe,
                color: 'from-amber-400/20 to-amber-600/10',
              },
              {
                step: '02',
                title: 'Verify',
                desc: 'Every product is quality-checked — supplier ratings, reviews, shipping times.',
                icon: FiShield,
                color: 'from-amber-400/20 to-amber-600/10',
              },
              {
                step: '03',
                title: 'List',
                desc: 'Products are automatically listed with optimized pricing, descriptions, and images.',
                icon: FiBarChart2,
                color: 'from-amber-400/20 to-amber-600/10',
              },
              {
                step: '04',
                title: 'Deliver',
                desc: 'Orders are processed and shipped automatically. Track everything in real-time.',
                icon: FiTruck,
                color: 'from-amber-400/20 to-amber-600/10',
              },
            ].map((item, i) => (
              <RevealOnScroll key={item.title}>
                <div className="group relative p-8 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-glow-amber)] transition-all duration-500 h-full">
                  {/* Step number */}
                  <div className="text-6xl font-display font-bold text-[rgba(251,191,36,0.04)] absolute top-4 right-6 select-none">
                    {item.step}
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 relative`}>
                    <item.icon className="w-6 h-6 text-[var(--color-brand-400)]" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
                Shop by <span className="amber-gradient">Category</span>
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
                Find exactly what you need across our AI-curated categories
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <RevealOnScroll key={cat.name}>
                <Link
                  href={`/?category=${cat.name.toLowerCase()}`}
                  className="group category-card block"
                >
                  <div className={`bg-gradient-to-br ${cat.color} p-7 rounded-2xl border border-[var(--color-border-default)] group-hover:border-[var(--color-border-hover)] transition-all duration-300 h-full`}>
                    <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                      {cat.icon}
                    </span>
                    <h3 className="font-semibold text-[var(--color-text-primary)] mb-1 text-sm">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{cat.desc}</p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DEALS ═══════════ */}
      {deals.length > 0 && (
        <section id="deals" className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(251,191,36,0.03)] via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <RevealOnScroll>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 mb-3">
                    <FiTrendingUp className="w-3 h-3" />
                    LIMITED TIME
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold">
                    🔥 Deals of the Day
                  </h2>
                </div>
                <Link
                  href="#products"
                  className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--color-brand-400)] hover:text-[var(--color-brand-300)] transition-colors group"
                >
                  View All
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((p, i) => (
                <RevealOnScroll key={p.id}>
                  <Link href={`/products/${p.slug}`} className="product-card group block">
                    <DiscountBadge percent={p.discount} />
                    <div className="product-card-image aspect-square">
                      <img
                        src={p.images[0] || '/placeholder.png'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="category-badge">{p.category}</span>
                      </div>
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-400)] transition-colors line-clamp-2 mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <StarRating />
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[var(--color-text-primary)]">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-[var(--color-text-tertiary)] line-through">
                            ${(p.price * (1 + p.discount / 100)).toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--color-brand-400)] font-medium">
                          Free Ship
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

      {/* ═══════════ PRODUCTS ═══════════ */}
      <section id="products" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                  Featured <span className="amber-gradient">Products</span>
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Top picks from our AI sourcing engine
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-400)]" />
                {products.length} products available
              </div>
            </div>
          </RevealOnScroll>

          {!mounted || products.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(251,191,36,0.06)] flex items-center justify-center mx-auto mb-6 border border-[rgba(251,191,36,0.08)]">
                <FiPackage className="w-8 h-8 text-[var(--color-brand-400)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                Products Loading...
              </h3>
              <p className="text-[var(--color-text-tertiary)]">
                The AI sourcing agent is curating new items right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p, i) => (
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
                        <span className="category-badge">{p.category}</span>
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <FiCheck className="w-3 h-3" />
                          In Stock
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-400)] transition-colors line-clamp-2 mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <StarRating rating={4 + Math.random()} count={Math.floor(Math.random() * 200) + 20} />
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">
                          ${p.price.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-brand-400)] font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
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

      {/* ═══════════ BRAND MARQUEE ═══════════ */}
      <section className="border-t border-[var(--color-border-default)] py-10">
        <div className="marquee">
          <div className="marquee-inner">
            {[...Array(2)].map((_, arrIdx) => (
              <div key={arrIdx} className="flex items-center gap-12">
                {[
                  { name: 'AI-Powered', icon: '🤖' },
                  { name: 'Free Shipping', icon: '📦' },
                  { name: 'Quality Checked', icon: '✅' },
                  { name: '24/7 Support', icon: '🎧' },
                  { name: 'Best Prices', icon: '🏷️' },
                  { name: 'Secure Checkout', icon: '🔒' },
                  { name: 'AI-Powered', icon: '🤖' },
                  { name: 'Free Shipping', icon: '📦' },
                  { name: 'Quality Checked', icon: '✅' },
                  { name: '24/7 Support', icon: '🎧' },
                  { name: 'Best Prices', icon: '🏷️' },
                  { name: 'Secure Checkout', icon: '🔒' },
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
        <div className="hero-blob hero-blob--1" style={{ opacity: 0.15 }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <RevealOnScroll>
            <div className="p-12 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/40 backdrop-blur-sm glow-border">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 flex items-center justify-center mx-auto mb-6">
                <FiZap className="w-7 h-7 text-[var(--color-brand-400)]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Ready to Shop <span className="amber-gradient">Smarter?</span>
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
                Join thousands of smart shoppers saving money with AI-curated products. New items added daily.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="#products" className="btn-primary flex items-center gap-2 px-10 py-4">
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>
                <Link href="/admin" className="btn-secondary flex items-center gap-2 px-10 py-4">
                  <FiBarChart2 className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
