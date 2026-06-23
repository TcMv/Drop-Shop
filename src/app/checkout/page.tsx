'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiLock, FiCheck, FiArrowLeft, FiShield,
  FiTruck, FiCreditCard, FiZap, FiShoppingCart
} from 'react-icons/fi';
import Link from 'next/link';

interface CartItem {
  productId: string; title: string; price: number;
  quantity: number; image: string; personalisation?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', postcode: ''
  });

  useEffect(() => {
    setMounted(true);
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      if (c.length === 0) router.push('/cart');
      setItems(c);
    } catch { router.push('/cart'); }
  }, [router]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 79 ? 0 : 5.99;
  const total = subtotal + shipping;
  const valid = form.name && form.email && form.address && form.city;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || processing) return;
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            personalisation: i.personalisation,
          })),
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            address: form.address,
            city: form.city,
            state: form.state,
            postcode: form.postcode,
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        // Clear cart and redirect to Stripe Checkout
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to payment provider');
    }

    setProcessing(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors mb-8 group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text-primary)] mb-8">
              Checkout
            </h1>

            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Shipping Info */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)]">
                <h2 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                  <FiTruck className="w-5 h-5 text-[#52B788]" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="input-field"
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="input-field"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="input-field"
                      placeholder="0400 000 000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                      Address
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="input-field"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="input-field"
                      placeholder="Sydney"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                        State
                      </label>
                      <input
                        type="text"
                        value={form.state}
                        onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                        className="input-field"
                        placeholder="NSW"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-tertiary)] mb-1.5 font-medium uppercase tracking-wider">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={form.postcode}
                        onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))}
                        className="input-field"
                        placeholder="2000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Preview */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)]">
                <h2 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5 text-[#52B788]" />
                  Payment Methods
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                  You'll be redirected to our secure checkout where you can pay with:
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)] flex items-center gap-2">
                    <FiCreditCard className="w-4 h-4 text-blue-400" />
                    Credit Card
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)]">
                    💳 Afterpay
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)]">
                    🟣 Zip Pay
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)]">
                    🍎 Apple Pay
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border-default)] text-sm text-[var(--color-text-primary)]">
                    💳 Google Pay
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!valid || processing}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                <FiLock className="w-4 h-4" />
                <span>
                  {processing ? 'Redirecting to Payment...' : `Pay $${total.toFixed(2)} AUD`}
                </span>
              </button>

              <p className="text-center text-xs text-[var(--color-text-tertiary)] flex items-center justify-center gap-1">
                <FiShield className="w-3 h-3 text-[#52B788]" />
                Secure checkout — powered by Stripe. Afterpay, Zip, and cards accepted.
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] sticky top-28">
              <h3 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-6">
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

              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)] shrink-0">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)] line-clamp-1 font-medium">
                        {item.title}
                      </p>
                      {item.personalisation && (
                        <p className="text-[10px] text-[#E8DCC4] mt-0.5 italic">
                          "{item.personalisation}"
                        </p>
                      )}
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--color-border-default)] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-tertiary)]">Subtotal</span>
                  <span className="text-[var(--color-text-primary)]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-tertiary)]">Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-400 font-medium' : 'text-[var(--color-text-primary)]'}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
                    <FiTruck className="w-3 h-3 text-[#52B788]" />
                    Free on orders $79+
                  </p>
                )}
                <div className="border-t border-[var(--color-border-default)] pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[var(--color-text-primary)]">Total</span>
                    <span className="font-bold text-[var(--color-text-primary)]">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-1 flex items-center gap-1">
                    <span className="text-[#52B788] text-xs">🏌️</span>
                    Or 4 interest-free payments of ${(total / 4).toFixed(2)} with Afterpay
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
