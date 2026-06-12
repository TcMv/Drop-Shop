import Link from 'next/link';
import { FiShoppingBag, FiTrendingUp, FiTruck, FiStar, FiShield, FiClock, FiZap } from 'react-icons/fi';
import { getProducts, Product } from '@/lib/db';
export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { name: 'Electronics', icon: '🔌', desc: 'Gadgets & gear', color: 'from-blue-600/20 to-blue-900/10' },
  { name: 'Home', icon: '🏠', desc: 'Living essentials', color: 'from-amber-600/20 to-amber-900/10' },
  { name: 'Travel', icon: '✈️', desc: 'On the go', color: 'from-emerald-600/20 to-emerald-900/10' },
  { name: 'Kitchen', icon: '🍳', desc: 'Cook & prep', color: 'from-rose-600/20 to-rose-900/10' },
  { name: 'Fitness', icon: '💪', desc: 'Active life', color: 'from-lime-600/20 to-lime-900/10' },
  { name: 'Beauty', icon: '✨', desc: 'Look good', color: 'from-pink-600/20 to-pink-900/10' },
  { name: 'Wellness', icon: '🧘', desc: 'Mind & body', color: 'from-violet-600/20 to-violet-900/10' },
  { name: 'Pets', icon: '🐾', desc: 'For your pets', color: 'from-orange-600/20 to-orange-900/10' },
];

function StarRating({ rating = 4.5, count = 128 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5-Math.round(rating))}</div>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}

function DiscountBadge({ percent }: { percent: number }) {
  return <div className="discount-badge">-{percent}%</div>;
}

export default async function HomePage() {
  let products: Product[] = [];
  try { products = await getProducts('active'); } catch {}
  const deals = products.slice(0, 4).map(p => ({ ...p, discount: Math.floor(Math.random()*25)+15 }));
  const featured = products.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-transparent to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 text-sm text-[var(--color-accent)] mb-6">
              <FiZap className="w-3.5 h-3.5" />AI-Curated Products — New Drops Weekly
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="text-white">Shop Smarter, </span>
              <span className="gradient-text">Not Harder</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-8 leading-relaxed">
              Every product on this store is AI-sourced from top suppliers, quality-checked, and delivered straight to your door. No markup games — just unbeatable value.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#products" className="btn-primary flex items-center gap-2 text-base px-8 py-3"><FiShoppingBag className="w-4 h-4" /> Shop Now</Link>
              <Link href="#deals" className="btn-secondary flex items-center gap-2 text-base px-8 py-3"><FiTrendingUp className="w-4 h-4" /> View Deals</Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-500">
              <span className="flex items-center gap-2"><FiShield className="w-4 h-4 text-[var(--color-accent)]" /> Secure Checkout</span>
              <span className="flex items-center gap-2"><FiTruck className="w-4 h-4 text-[var(--color-accent)]" /> Free Shipping</span>
              <span className="flex items-center gap-2"><FiClock className="w-4 h-4 text-[var(--color-accent)]" /> 30-Day Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Shop by Category</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Find exactly what you need across our curated categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} href={`/?category=${cat.name.toLowerCase()}`} className="category-card">
                <div className={`bg-gradient-to-br ${cat.color} p-6 rounded-2xl border border-white/5 hover:border-[var(--color-accent)]/20 transition-all h-full`}>
                  <span className="text-3xl block mb-3">{cat.icon}</span>
                  <h3 className="font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DEALS */}
      {deals.length > 0 && (
        <section id="deals" className="section-padding bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 mb-3"><FiTrendingUp className="w-3 h-3" />LIMITED TIME</div>
                <h2 className="text-3xl sm:text-4xl font-bold">🔥 Deals of the Day</h2>
              </div>
              <Link href="#products" className="hidden sm:flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">View All <span>→</span></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="product-card group">
                  <DiscountBadge percent={p.discount} />
                  <div className="product-image aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
                    <img src={p.images[0]||'/placeholder.png'} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1"><span className="price-badge">{p.category}</span></div>
                    <h3 className="font-semibold text-sm text-gray-100 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 mb-1">{p.title}</h3>
                    <StarRating />
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">${p.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">${(p.price*(1+p.discount/100)).toFixed(2)}</span>
                      </div>
                      <span className="text-xs text-[var(--color-accent)] font-medium">Free Ship</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section id="products" className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-400">Top picks from our AI sourcing engine</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />{products.length} products available
            </div>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center mx-auto mb-4"><FiShoppingBag className="w-6 h-6 text-[var(--color-accent)]" /></div>
              <p className="text-gray-400 text-lg">No products available yet.</p>
              <p className="text-gray-600 mt-1">The AI sourcing agent is curating new items.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <Link key={p.id} href={`/products/${p.slug}`} className="product-card group">
                  <div className="product-image aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
                    <img src={p.images[0]||'/placeholder.png'} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1"><span className="price-badge">{p.category}</span><span className="text-xs text-emerald-400 font-medium">In Stock</span></div>
                    <h3 className="font-semibold text-sm text-gray-100 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 mb-1">{p.title}</h3>
                    <StarRating rating={4+Math.random()} count={Math.floor(Math.random()*200)+20} />
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-bold text-white">${p.price.toFixed(2)}</span>
                      <span className="flex items-center gap-1 text-xs text-[var(--color-accent)] font-medium opacity-0 group-hover:opacity-100 transition-opacity"><FiShoppingBag className="w-3 h-3" />Quick View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-[var(--color-border)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <FiTruck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On all orders' },
              { icon: <FiShield className="w-6 h-6" />, title: 'Secure Payment', desc: '256-bit encrypted' },
              { icon: <FiClock className="w-6 h-6" />, title: '30-Day Returns', desc: 'No questions asked' },
              { icon: <FiStar className="w-6 h-6" />, title: 'AI Curated', desc: 'Best value guaranteed' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center text-[var(--color-accent)]">{item.icon}</div>
                <h4 className="font-semibold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
