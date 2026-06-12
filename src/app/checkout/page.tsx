'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiLock, FiCheck, FiArrowLeft, FiShield,
  FiTruck, FiCreditCard, FiZap
} from 'react-icons/fi';
import Link from 'next/link';

interface CartItem {
  productId: string; title: string; price: number;
  quantity: number; image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState('');
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
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  const valid = form.name && form.email && form.address && form.city;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || processing) return;
    setProcessing(true);
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items, total,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            address: form.address,
            city: form.city,
            state: form.state,
            postcode: form.postcode
          }
        })
      });
      const d = await r.json();
      if (d.id) {
        setOrderId(d.id);
        setDone(true);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch {}
    setProcessing(false);
  };

  if (!mounted) return null;

  if (done) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
          <FiCheck className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-[var(--color-text-primary)] mb-2">
          Order Confirmed! 🎉
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-8">
          Order ID: <span className="text-[var(--color-brand-400)] font-mono">{orderId.slice(0, 8)}</span>
        </p>
        <div className="p-5 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-default)] mb-8 text-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <FiCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[var(--color-text-secondary)]">Payment confirmed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(251,191,36,0.1)] flex items-center justify-center">
              <FiTruck className="w-4 h-4 text-[var(--color-brand-400)]" />
            </div>
            <span className="text-[var(--color-text-secondary)]">Processing for shipping</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(251,191,36,0.1)] flex items-center justify-center">
              <FiZap className="w-4 h-4 text-[var(--color-brand-400)]" />
            </div>
            <span className="text-[var(--color-text-secondary)]">AI agent notified — tracking soon</span>
          </div>
        </div>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );

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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Info */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)]">
                <h2 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5 text-[var(--color-brand-400)]" />
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
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="input-field"
                      placeholder="+1 (555) 000-0000"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={!valid || processing}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <FiLock className="w-4 h-4" />
                <span>{processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}</span>
              </button>

              <p className="text-center text-xs text-[var(--color-text-tertiary)] flex items-center justify-center gap-1">
                <FiShield className="w-3 h-3 text-[var(--color-brand-400)]" />
                Secure checkout — your info is encrypted
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] sticky top-28">
              <h3 className="font-display font-semibold text-lg text-[var(--color-text-primary)] mb-6">
                Order Summary
              </h3>

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
                    <FiTruck className="w-3 h-3 text-[var(--color-brand-400)]" />
                    Free on orders $50+
                  </p>
                )}
                <div className="border-t border-[var(--color-border-default)] pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-[var(--color-text-primary)]">Total</span>
                    <span className="font-bold text-[var(--color-text-primary)]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
