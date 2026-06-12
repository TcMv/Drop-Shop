'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiCheck, FiArrowLeft, FiShield, FiTruck, FiCreditCard } from 'react-icons/fi';
import Link from 'next/link';
interface CartItem { productId:string; title:string; price:number; quantity:number; image:string; }
export default function CheckoutPage() {
  const router=useRouter(); const [items,setItems]=useState<CartItem[]>([]); const [mounted,setMounted]=useState(false);
  const [processing,setProcessing]=useState(false); const [done,setDone]=useState(false); const [orderId,setOrderId]=useState('');
  const [form,setForm]=useState({name:'',email:'',phone:'',address:'',city:'',state:'',postcode:''});
  useEffect(()=>{setMounted(true);try{const c=JSON.parse(localStorage.getItem('cart')||'[]');if(c.length===0)router.push('/cart');setItems(c)}catch{router.push('/cart')}},[router]);
  const subtotal=items.reduce((s,i)=>s+i.price*i.quantity,0); const shipping=subtotal>50?0:5.99; const total=subtotal+shipping; const valid=form.name&&form.email&&form.address&&form.city;
  const handleSubmit=async(e:React.FormEvent)=>{e.preventDefault();if(!valid||processing)return;setProcessing(true);try{const r=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,total,customerName:form.name,customerEmail:form.email,customerPhone:form.phone,shippingAddress:{address:form.address,city:form.city,state:form.state,postcode:form.postcode}})});const d=await r.json();if(d.id){setOrderId(d.id);setDone(true);localStorage.removeItem('cart');window.dispatchEvent(new Event('cart-updated'))}}catch{}setProcessing(false);};
  if(!mounted) return null;
  if(done) return (
    <div className="min-h-screen flex items-center justify-center pt-20"><div className="text-center max-w-md mx-auto px-4">
      <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"><FiCheck className="w-8 h-8 text-emerald-400"/></div>
      <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1><p className="text-gray-400 mb-2">Your order has been placed successfully.</p>
      <p className="text-sm text-gray-600 mb-8">Order ID: <span className="text-[var(--color-accent)] font-mono">{orderId.slice(0,8)}</span></p>
      <div className="p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] mb-8 text-sm text-gray-400">
        <p className="flex items-center gap-2 mb-1"><FiCheck className="w-4 h-4 text-emerald-400"/>Payment confirmed</p>
        <p className="flex items-center gap-2"><FiTruck className="w-4 h-4 text-[var(--color-accent)]"/>Processing for shipping</p>
      </div>
      <Link href="/" className="btn-primary inline-flex items-center gap-2">Continue Shopping</Link>
    </div></div>
  );
  return (
    <div className="min-h-screen pt-24 pb-16"><div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link href="/cart" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"><FiArrowLeft className="w-4 h-4"/>Back to Cart</Link>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><FiCreditCard className="w-4 h-4 text-[var(--color-accent)]"/>Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="block text-sm text-gray-400 mb-1">Full Name</label><input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="John Smith" required/></div>
                <div><label className="block text-sm text-gray-400 mb-1">Email</label><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="john@example.com" required/></div>
                <div><label className="block text-sm text-gray-400 mb-1">Phone</label><input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="+1 (555) 000-0000"/></div>
                <div className="sm:col-span-2"><label className="block text-sm text-gray-400 mb-1">Address</label><input type="text" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="123 Main Street" required/></div>
                <div><label className="block text-sm text-gray-400 mb-1">City</label><input type="text" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="Sydney" required/></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm text-gray-400 mb-1">State</label><input type="text" value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="NSW"/></div><div><label className="block text-sm text-gray-400 mb-1">Postcode</label><input type="text" value={form.postcode} onChange={e=>setForm(f=>({...f,postcode:e.target.value}))} className="w-full px-4 py-2.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--color-accent)]/50 transition-colors" placeholder="2000"/></div></div>
              </div>
            </div>
            <button type="submit" disabled={!valid||processing} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"><FiLock className="w-4 h-4"/>{processing?'Processing...':`Pay $${total.toFixed(2)}`}</button>
            <p className="text-center text-xs text-gray-600 flex items-center justify-center gap-1"><FiShield className="w-3 h-3"/>Secure checkout — your info is encrypted</p>
          </form>
        </div>
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] sticky top-28">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">{items.map(item=>(
              <div key={item.productId} className="flex gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shrink-0"><img src={item.image||'/placeholder.png'} alt={item.title} className="w-full h-full object-cover"/></div>
                <div className="flex-1 min-w-0"><p className="text-sm text-gray-100 line-clamp-1">{item.title}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p><p className="text-sm font-medium text-white">${(item.price*item.quantity).toFixed(2)}</p></div>
              </div>
            ))}</div>
            <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className={shipping===0?'text-emerald-400':''}>{shipping===0?'Free':`$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[var(--color-border)]"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
}
