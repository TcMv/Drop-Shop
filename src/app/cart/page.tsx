'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCart();
    
    const handler = () => loadCart();
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  function loadCart() {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(cart);
    } catch {
      setItems([]);
    }
  }

  function updateQuantity(productId: string, delta: number) {
    const cart = [...items];
    const idx = cart.findIndex(i => i.productId === productId);
    if (idx < 0) return;
    
    cart[idx].quantity += delta;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems(cart);
    window.dispatchEvent(new Event('cart-updated'));
  }

  function removeItem(productId: string) {
    const cart = items.filter(i => i.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    setItems(cart);
    window.dispatchEvent(new Event('cart-updated'));
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-8">
        <FiShoppingCart className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        {itemCount > 0 && (
          <span className="text-sm text-gray-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-20">
          <FiShoppingCart className="w-16 h-16 text-gray-700 mx-auto" />
          <p className="mt-4 text-gray-500 text-lg">Your cart is empty</p>
          <Link href="/" className="inline-flex items-center gap-1 mt-4 text-blue-400 hover:text-blue-300">
            <FiArrowLeft className="w-4 h-4" /> Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex gap-4">
                <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-100 truncate">{item.title}</h3>
                  <p className="text-blue-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 h-fit">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-400">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link
              href="/checkout"
              className="block mt-6 w-full py-3 px-6 rounded-xl font-semibold text-center bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Proceed to Checkout
            </Link>
            
            <Link href="/" className="block mt-3 text-center text-sm text-gray-500 hover:text-blue-400">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
