'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiShoppingCart, FiArrowLeft, FiCheck, FiTruck, FiShield,
  FiClock, FiStar, FiPlus, FiMinus, FiHeart, FiShare2,
  FiPackage, FiZap
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

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.productId === product.id);
    if (existing >= 0) cart[existing].quantity += quantity;
    else cart.push({
      productId: product.id, title: product.title,
      price: product.price, quantity, image: product.images[0]
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
        <div className="w-20 h-20 rounded-2xl bg-[rgba(251,191,36,0.06)] flex items-center justify-center mx-auto mb-6 border border-[rgba(251,191,36,0.08)]">
          <FiPackage className="w-8 h-8 text-[var(--color-brand-400)]" />
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

  const discount = Math.round((1 - product.cost / product.price) * 100);

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
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)] border border-[var(--color-border-default)] mb-4 group">
              <img
                src={product.images[selectedImage] || product.images[0] || '/placeholder.png'}
                alt={product.title}
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {discount > 20 && <div className="discount-badge">-{discount}%</div>}
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
                        ? 'border-[var(--color-brand-400)] ring-1 ring-[rgba(251,191,36,0.3)]'
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
              <span className="category-badge">{product.category}</span>
              {product.stock > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <FiCheck className="w-3 h-3" />
                  In Stock ({product.stock})
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4 leading-tight text-[var(--color-text-primary)]">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <FiStar key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-[var(--color-text-tertiary)]'}`} />
                ))}
              </div>
              <span className="text-sm text-[var(--color-text-tertiary)]">4.8 (128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                ${product.price.toFixed(2)}
              </span>
              {product.cost < product.price && (
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
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
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
                { icon: FiTruck, text: 'Free shipping', sub: 'On all orders' },
                { icon: FiShield, text: 'Secure payment', sub: '256-bit encrypted' },
                { icon: FiClock, text: '30-day returns', sub: 'No questions asked' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(251,191,36,0.08)] flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[var(--color-brand-400)]" />
                  </div>
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">{item.text}</span>
                  <span className="text-[10px] text-[var(--color-text-tertiary)]">{item.sub}</span>
                </div>
              ))}
            </div>

            {/* AI Badge */}
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-[rgba(251,191,36,0.04)] border border-[rgba(251,191,36,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[rgba(251,191,36,0.1)] flex items-center justify-center">
                <FiZap className="w-5 h-5 text-[var(--color-brand-400)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">AI-Sourced Product</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  This product was found, verified, and listed by our AI agents
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
