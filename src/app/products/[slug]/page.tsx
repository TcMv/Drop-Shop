'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiShoppingCart, FiArrowLeft, FiCheck, FiTruck, FiShield,
  FiClock, FiStar, FiPlus, FiMinus, FiHeart, FiShare2,
  FiPackage
} from 'react-icons/fi';
import Link from 'next/link';

interface Product {
  id: string; title: string; slug: string; description: string;
  price: number; cost: number; images: string[]; category: string;
  tags: string[]; stock: number;
}

function Skeleton() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="aspect-square rounded-2xl skeleton" />
          <div className="space-y-4">
            <div className="h-4 w-24 skeleton" />
            <div className="h-10 w-3/4 skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-2/3 skeleton" />
            <div className="h-12 w-48 skeleton mt-8" />
            <div className="h-20 w-full skeleton mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [personalisation, setPersonalisation] = useState('');
  const [personalisationError, setPersonalisationError] = useState('');

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const getCharLimit = (): number => {
    if (!product) return 30;
    const idNum = parseInt(product.id.replace('golf-', ''), 10);
    if (idNum <= 2) return 20;  // ball stamps
    if (idNum === 5) return 50; // towels
    return 30;                  // divot tools, ball markers, scorecard holders
  };

  const addToCart = () => {
    if (!product) return;
    if (product.category === 'personalised' && !personalisation.trim()) {
      setPersonalisationError('Please enter your engraving text');
      return;
    }
    if (product.category === 'personalised' && personalisation.trim().length > getCharLimit()) {
      setPersonalisationError(`Maximum ${getCharLimit()} characters`);
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.productId === product.id);
    if (existing >= 0) cart[existing].quantity += quantity;
    else cart.push({
      productId: product.id, title: product.title,
      price: product.price, quantity, image: product.images[0],
      personalisation: product.category === 'personalised' ? personalisation.trim() : undefined
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) return <Skeleton />;

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-2xl bg-[rgba(45,106,79,0.06)] flex items-center justify-center mx-auto mb-6 border border-[rgba(45,106,79,0.08)]">
          <FiPackage className="w-8 h-8 text-[#52B788]" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-text-primary)]">Product not found</h2>
        <p className="text-[var(--color-text-tertiary)] mb-8">This product doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );

  const discount = product.cost > 0 ? Math.round((1 - product.cost / product.price) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-8 group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ─── Image Gallery ─── */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B3A2D] to-[#0C0C0C] border border-[var(--color-border-default)] mb-4 group">
              <img
                src={product.images[selectedImage] || product.images[0] || '/placeholder.png'}
                alt={product.title}
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {discount > 20 && <div className="discount-badge">-{discount}%</div>}
              {product.category === 'personalised' && (
                <div className="absolute top-4 left-4">
                  <span className="personalised-badge">Personalised</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                >
                  <FiHeart className={`w-5 h-5 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all">
                  <FiShare2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      idx === selectedImage
                        ? 'border-[#52B788] ring-1 ring-[rgba(45,106,79,0.3)]'
                        : 'border-[var(--color-border-default)] hover:border-[var(--color-text-tertiary)]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ─── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {product.category === 'personalised' ? (
                <span className="personalised-badge">Personalised</span>
              ) : (
                <span className="category-badge">{product.category}</span>
              )}
              {product.stock > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-[#52B788] bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 px-3 py-1 rounded-full">
                  <FiCheck className="w-3 h-3" />
                  In Stock ({product.stock})
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-tight text-[var(--color-text-primary)]">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                ${product.price.toFixed(2)} AUD
              </span>
              {product.cost < product.price && product.cost > 0 && (
                <>
                  <span className="text-lg text-[var(--color-text-tertiary)] line-through">
                    ${product.cost.toFixed(2)}
                  </span>
                  <span className="category-badge text-sm">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-8">
              {product.description}
            </p>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.map(t => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] text-[var(--color-text-tertiary)]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* ─── Personalisation Input ─── */}
            {product.category === 'personalised' && (
              <div className="mb-8 p-5 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(45,106,79,0.08)] flex items-center justify-center">
                    <FiPackage className="w-4 h-4 text-[#52B788]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      Personalise Your Item
                    </h3>
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">
                      Enter the text you'd like engraved or stamped
                    </p>
                  </div>
                </div>

                <textarea
                  value={personalisation}
                  onChange={e => {
                    setPersonalisation(e.target.value);
                    if (personalisationError) setPersonalisationError('');
                  }}
                  placeholder="e.g. Par 3 Champion '24"
                  maxLength={getCharLimit() + 5}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-[var(--color-surface-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] resize-none transition-all duration-200 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[rgba(45,106,79,0.15)]"
                />

                {/* Character count + preview */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${
                    personalisation.length > getCharLimit()
                      ? 'text-red-400'
                      : 'text-[var(--color-text-tertiary)]'
                  }`}>
                    {personalisation.length}/{getCharLimit()} characters
                  </span>
                  {personalisation.length > 0 && personalisation.length <= getCharLimit() && (
                    <span className="text-xs text-[#52B788] flex items-center gap-1">
                      <FiCheck className="w-3 h-3" /> Ready
                    </span>
                  )}
                </div>

                {/* Preview */}
                {personalisation.trim().length > 0 && personalisation.trim().length <= getCharLimit() && (
                  <div className="mt-3 p-3 rounded-xl bg-[rgba(45,106,79,0.06)] border border-[rgba(45,106,79,0.1)]">
                    <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1.5 font-medium">
                      Preview
                    </p>
                    <p className="text-sm font-accent text-[#E8DCC4] tracking-wider">
                      {personalisation.trim()}
                    </p>
                  </div>
                )}

                {/* Error */}
                {personalisationError && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <span>⚠</span> {personalisationError}
                  </p>
                )}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[var(--color-border-default)] rounded-full bg-[var(--color-surface-raised)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-[var(--color-text-primary)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-3 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={addToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  added
                    ? 'bg-[#2D6A4F] text-white shadow-lg shadow-[#2D6A4F]/20'
                    : 'btn-primary'
                }`}
              >
                {added ? (
                  <><FiCheck className="w-4 h-4" /> Added to Cart</>
                ) : (
                  <><FiShoppingCart className="w-4 h-4" /> Add to Cart — ${(product.price * quantity).toFixed(2)}</>
                )}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-default)]">
              {[
                { icon: FiTruck, text: 'AU Shipping', sub: '14-21 days' },
                { icon: FiShield, text: 'Secure payment', sub: '256-bit encrypted' },
                { icon: FiClock, text: '30-day returns', sub: 'No questions asked' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(45,106,79,0.08)] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#52B788]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">{item.text}</span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)]">{item.sub}</span>
                </div>
              ))}
            </div>

            {/* Hackers Club Banner */}
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-[rgba(212,168,67,0.06)] border border-[rgba(212,168,67,0.12)]">
              <span className="text-2xl">🎲</span>
              <div>
                <p className="text-sm font-semibold gold-text">The Hackers Club</p>
                <p className="text-xs text-[#E8DCC4]/70">
                  Members get 10% off — <Link href="/#hackers-club" className="gold-text underline">join free</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
