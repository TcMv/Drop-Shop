'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiCheck, FiArrowLeft } from 'react-icons/fi';

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
  });

  useEffect(() => {
    setMounted(true);
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) router.push('/cart');
      setItems(cart);
    } catch {
      router.push('/cart');
    }
  }, [router]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const valid = form.name && form.email && form.address && form.city && form.state && form.postcode;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || processing) return;
    
    setProcessing(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, title: i.title, price: i.price, quantity: i.quantity })),
          total,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            line1: form.address,
            city: form.city,
            state: form.state,
            postcode: form.postcode,
            country: 'Australia',
          },
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setOrderId(data.order.id);
        localStorage.removeItem('cart');
        setDone(true);
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    }
    
    setProcessing(false);
  }

  function updateField(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  if (!mounted) return null;

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <FiCheck className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mt-6 text-gray-100">Order Placed!</h1>
        <p className="mt-3 text-gray-400">
          Your order has been submitted and will be processed automatically.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Order reference: <span className="text-blue-400 font-mono">{orderId}</span>
        </p>
        <p className="mt-1 text-xs text-gray-600">
          The AI order agent will place this with the supplier shortly. Check the audit log for updates.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-8 inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="font-semibold mb-4">Shipping Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="John Smith"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => updateField('phone', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="0400 000 000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => updateField('address', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="123 Main St"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => updateField('city', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Sydney"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => updateField('state', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="NSW"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Postcode</label>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={e => updateField('postcode', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="2000"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!valid || processing}
            className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              !valid ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
              processing ? 'bg-blue-600/50 text-blue-200' :
              'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <FiLock className="w-4 h-4" />
            {processing ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>
        
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-24">
            <h2 className="font-semibold mb-4">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</h2>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-100 truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-800 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
