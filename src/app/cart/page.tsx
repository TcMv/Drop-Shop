'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiCheck,
  FiArrowLeft, FiShield, FiTruck, FiZap, FiPackage
} from 'react-icons/fi';

interface CartItem {
  productId: string; title: string; price: number;
  quantity: number; image: string; personalisation?: string;
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
  const shipping = subtotal > 79 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(45,106,79,0.08)] border border-[rgba(45,106,79,0.1)] flex items-center justify-center">
            <FiShoppingCart className="w-6 h-6 text-[#52B788]" />
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
            <div className="w-24 h-24 rounded-2xl bg-[rgba(45,106,79,0.06)] border border-[rgba(45,106,79,0.08)] flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="w-10 h-10 text-[#52B788]" />
            </div>
            <h2 className="text-xl font-display font-semibold text-[var(--color-text-primary)] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[var(--color-text-tertiary)] mb-8">
              Your cart&apos;s emptier than a Sunday arvo on the back nine.
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
              {items.map(item => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all group"
                >
                  <Link href={`/products/${item.productId}`} className="shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)]">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-medium text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-400)] transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    {item.personalisation && (
                      <p className="text-xs text-[#E8DCC4] mt-0.5 flex items-center gap-1">
                        <FiPackage className="w-3 h-3 text-[#52B788]" />
                        <span className="italic">"{item.personalisation}"</span>
                      </p>
                    )}
                    <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                      ${item.price.toFixed(2)}
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
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[rgba(45,106,79,0.04)] border border-[rgba(45,106,79,0.08)]">
                <span className="text-xl">🏌️</span>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Premium AU golf accessories. Free shipping on orders over $79.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] sticky top-28">
                <h3 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-4">
                  Order Summary
                </h3>

                {/* Free shipping progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {subtotal >= 79
                        ? "You've unlocked free shipping!"
                        : `Add $${(79 - subtotal).toFixed(0)} more for free shipping`}
                    </span>
                    {subtotal > 0 && subtotal < 79 && (
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        {Math.min(100, Math.round((subtotal / 79) * 100))}%
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        subtotal >= 79
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-[#D4A843] to-[#52B788]'
                      }`}
                      style={{ width: `${Math.min(100, (subtotal / 79) * 100)}%` }}
                    />
                  </div>
                  {subtotal >= 79 && (
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <FiCheck className="w-3 h-3" /> Free shipping applied
                    </p>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-tertiary)]">Subtotal</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-tertiary)]">Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400 font-medium' : 'text-[var(--color-text-primary)]'}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
                      <FiTruck className="w-3 h-3 text-[var(--color-brand-400)]" />
                      Free shipping on orders over $79
                    </p>
                  )}
                  <div className="border-t border-[var(--color-border-default)] pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-[var(--color-text-primary)]">Total</span>
                      <span className="font-bold text-[var(--color-text-primary)]">
                        ${total.toFixed(2)}
                      </span>
                    </div>
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
