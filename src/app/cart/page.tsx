'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiTrash2, FiPlus, FiMinus, FiShoppingCart,
  FiArrowLeft, FiShield, FiTruck, FiZap
} from 'react-icons/fi';
import { formatAUD, gstComponent, shippingFor, instalment, FREE_SHIPPING_THRESHOLD } from '@/lib/format';

interface CartItem {
  productId: string; title: string; slug?: string; price: number;
  quantity: number; image: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    load();
    const h = () => load();
    window.addEventListener('cart-updated', h);
    return () => window.removeEventListener('cart-updated', h);
  }, []);

  function load() {
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(c);
    } catch { setItems([]); }
  }

  function updateQty(id: string, d: number) {
    const cart = [...items];
    const idx = cart.findIndex(i => i.productId === id);
    if (idx < 0) return;
    cart[idx].quantity = Math.max(1, cart[idx].quantity + d);
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems(cart);
    window.dispatchEvent(new Event('cart-updated'));
  }

  function remove(id: string) {
    const c = items.filter(i => i.productId !== id);
    localStorage.setItem('cart', JSON.stringify(c));
    setItems(c);
    window.dispatchEvent(new Event('cart-updated'));
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;
  const awayFromFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.1)] flex items-center justify-center">
            <FiShoppingCart className="w-6 h-6 text-[var(--color-brand-400)]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text-primary)]">
              Shopping Cart
            </h1>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-2xl bg-[rgba(251,191,36,0.06)] border border-[rgba(251,191,36,0.08)] flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="w-10 h-10 text-[var(--color-brand-400)]" />
            </div>
            <h2 className="text-xl font-display font-semibold text-[var(--color-text-primary)] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[var(--color-text-tertiary)] mb-8">
              Looks like you haven&apos;t added anything yet. The AI agents are waiting!
            </p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              <FiArrowLeft className="w-4 h-4" />
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping progress */}
              <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)]">
                {awayFromFree > 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    🚚 Add <strong className="text-[var(--color-brand-400)]">{formatAUD(awayFromFree)}</strong> more for <strong className="text-[var(--color-text-primary)]">free shipping</strong> Australia-wide
                  </p>
                ) : (
                  <p className="text-sm text-emerald-400 font-medium mb-2">
                    🎉 You&apos;ve unlocked free shipping Australia-wide!
                  </p>
                )}
                <div className="h-1.5 rounded-full bg-[var(--color-surface-raised)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>

              {items.map(item => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all group"
                >
                  <Link href={item.slug ? `/products/${item.slug}` : '/'} className="shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)]">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={item.slug ? `/products/${item.slug}` : '/'}>
                      <h3 className="font-medium text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-400)] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                      {formatAUD(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[var(--color-border-default)] rounded-full bg-[var(--color-surface-raised)]">
                        <button
                          onClick={() => updateQty(item.productId, -1)}
                          className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[var(--color-text-primary)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, 1)}
                          className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => remove(item.productId)}
                        className="p-2 text-[var(--color-text-tertiary)] hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* AI Note */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[rgba(251,191,36,0.04)] border border-[rgba(251,191,36,0.08)]">
                <div className="w-9 h-9 rounded-xl bg-[rgba(251,191,36,0.1)] flex items-center justify-center">
                  <FiZap className="w-4 h-4 text-[var(--color-brand-400)]" />
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  All items are AI-sourced and quality-checked. Prices in AUD inc. GST — free shipping Australia-wide on orders over $50.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] sticky top-28">
                <h3 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-tertiary)]">Subtotal</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {formatAUD(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-tertiary)]">Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400 font-medium' : 'text-[var(--color-text-primary)]'}>
                      {shipping === 0 ? 'Free' : formatAUD(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
                      <FiTruck className="w-3 h-3 text-[var(--color-brand-400)]" />
                      Free shipping Australia-wide on orders over $50
                    </p>
                  )}
                  <div className="border-t border-[var(--color-border-default)] pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-[var(--color-text-primary)]">Total</span>
                      <span className="font-bold text-[var(--color-text-primary)]">
                        {formatAUD(total)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1.5">
                      Includes {formatAUD(gstComponent(total))} GST
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1 flex items-center gap-1">
                      <FiZap className="w-3 h-3 text-[var(--color-brand-400)]" />
                      Or 4 × {formatAUD(instalment(total))} with Afterpay or Zip
                    </p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                >
                  <FiShield className="w-4 h-4" />
                  <span>Checkout</span>
                </Link>

                <Link
                  href="/"
                  className="block text-center text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] mt-3 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
