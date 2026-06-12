'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowLeft, FiShield } from 'react-icons/fi';
interface CartItem { productId:string; title:string; price:number; quantity:number; image:string; }
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); load();
    const h=()=>load(); window.addEventListener('cart-updated',h); return ()=>window.removeEventListener('cart-updated',h);
  },[]);
  function load() { try { const c=JSON.parse(localStorage.getItem('cart')||'[]'); setItems(c); } catch { setItems([]); } }
  function updateQty(id:string, d:number) {
    const cart=[...items]; const idx=cart.findIndex(i=>i.productId===id); if(idx<0) return;
    cart[idx].quantity=Math.max(1,cart[idx].quantity+d); localStorage.setItem('cart',JSON.stringify(cart)); setItems(cart); window.dispatchEvent(new Event('cart-updated'));
  }
  function remove(id:string) { const c=items.filter(i=>i.productId!==id); localStorage.setItem('cart',JSON.stringify(c)); setItems(c); window.dispatchEvent(new Event('cart-updated')); }
  const subtotal=items.reduce((s,i)=>s+i.price*i.quantity,0); const shipping=subtotal>50?0:5.99; const total=subtotal+shipping;
  if(!mounted) return null;
  return (
    <div className="min-h-screen pt-24 pb-16"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center"><FiShoppingCart className="w-5 h-5 text-[var(--color-accent)]"/></div>
        <div><h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1><p className="text-sm text-gray-500">{items.length} {items.length===1?'item':'items'}</p></div>
      </div>
      {items.length===0?(
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center mx-auto mb-6"><FiShoppingCart className="w-8 h-8 text-[var(--color-accent)]"/></div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2><p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2"><FiArrowLeft className="w-4 h-4"/>Start Shopping</Link>
        </div>
      ):(
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item=>(
              <div key={item.productId} className="flex gap-4 p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all">
                <Link href={`/products/${item.productId}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <img src={item.image||'/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productId}`}><h3 className="font-medium text-sm text-gray-100 hover:text-[var(--color-accent)] transition-colors line-clamp-1">{item.title}</h3></Link>
                  <p className="text-lg font-bold text-white mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[var(--color-border)] rounded-full">
                      <button onClick={()=>updateQty(item.productId,-1)} className="p-1.5 text-gray-400 hover:text-white transition-colors"><FiMinus className="w-3.5 h-3.5"/></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={()=>updateQty(item.productId,1)} className="p-1.5 text-gray-400 hover:text-white transition-colors"><FiPlus className="w-3.5 h-3.5"/></button>
                    </div>
                    <button onClick={()=>remove(item.productId)} className="p-2 text-gray-500 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] sticky top-28">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white font-medium">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className={shipping===0?'text-emerald-400':'text-white'}>{shipping===0?'Free':`$${shipping.toFixed(2)}`}</span></div>
                {shipping>0&&<p className="text-xs text-gray-500">Free shipping on orders over $50</p>}
                <div className="border-t border-[var(--color-border)] pt-3 mt-3">
                  <div className="flex justify-between text-lg"><span className="font-semibold">Total</span><span className="font-bold text-white">${total.toFixed(2)}</span></div>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mt-6"><FiShield className="w-4 h-4"/>Checkout</Link>
              <Link href="/" className="block text-center text-xs text-gray-500 hover:text-gray-400 mt-3 transition-colors">Continue Shopping</Link>
            </div>
          </div>
        </div>
      )}
    </div></div>
  );
}
