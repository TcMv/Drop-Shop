'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiTruck, FiShield, FiClock, FiStar, FiPlus, FiMinus, FiHeart } from 'react-icons/fi';
import Link from 'next/link';

interface Product { id:string; title:string; slug:string; description:string; price:number; cost:number; images:string[]; category:string; tags:string[]; stock:number; }

export default function ProductPage() {
  const { slug } = useParams(); const router = useRouter();
  const [product, setProduct] = useState<Product|null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`).then(r=>r.json()).then(data=>{ setProduct(data); setLoading(false); }).catch(()=>setLoading(false));
  }, [slug]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart')||'[]');
    const existing = cart.findIndex((i:any)=>i.productId===product.id);
    if (existing>=0) cart[existing].quantity+=quantity;
    else cart.push({ productId:product.id, title:product.title, price:product.price, quantity, image:product.images[0] });
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true); setTimeout(()=>setAdded(false),2500);
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) return (
    <div className="min-h-screen pt-24 pb-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12"><div className="aspect-square skeleton"/><div className="space-y-4"><div className="h-4 w-24 skeleton"/><div className="h-8 w-3/4 skeleton"/><div className="h-4 w-full skeleton"/><div className="h-4 w-2/3 skeleton"/><div className="h-12 w-48 skeleton mt-8"/></div></div></div></div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-20"><div className="text-center"><h2 className="text-2xl font-bold mb-2">Product not found</h2><p className="text-gray-400 mb-6">This product doesn't exist or has been removed.</p><Link href="/" className="btn-primary inline-flex items-center gap-2"><FiArrowLeft className="w-4 h-4"/>Back to Store</Link></div></div>
  );

  const discount = Math.round((1-product.cost/product.price)*100);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={()=>router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"><FiArrowLeft className="w-4 h-4"/>Back</button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 border border-[var(--color-border)] mb-4">
              <img src={product.images[selectedImage]||product.images[0]||'/placeholder.png'} alt={product.title} className="w-full aspect-square object-cover" />
              {discount>20&&<div className="discount-badge">-{discount}%</div>}
              <button onClick={()=>setLiked(!liked)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                <FiHeart className={`w-5 h-5 ${liked?'text-red-500 fill-red-500':'text-white'}`} />
              </button>
            </div>
            {product.images.length>1&&(
              <div className="flex gap-3">
                {product.images.map((img,idx)=>(
                  <button key={idx} onClick={()=>setSelectedImage(idx)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${idx===selectedImage?'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30':'border-[var(--color-border)] hover:border-gray-600'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="price-badge">{product.category}</span>
              {product.stock>0&&<span className="flex items-center gap-1 text-xs text-emerald-400"><FiCheck className="w-3 h-3"/>In Stock ({product.stock})</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{product.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">{[1,2,3,4,5].map(s=><FiStar key={s} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}</div>
              <span className="text-sm text-gray-400">4.8 (128 reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-white">${product.price.toFixed(2)}</span>
              {product.cost<product.price&&<><span className="text-lg text-gray-500 line-through">${product.cost.toFixed(2)}</span><span className="price-badge text-sm">Save {discount}%</span></>}
            </div>
            <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>
            {product.tags.length>0&&(
              <div className="flex flex-wrap gap-2 mb-8">{product.tags.map(t=><span key={t} className="px-3 py-1 rounded-full text-xs bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-gray-400">#{t}</span>)}</div>
            )}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[var(--color-border)] rounded-full">
                <button onClick={()=>setQuantity(Math.max(1,quantity-1))} className="p-3 text-gray-400 hover:text-white transition-colors"><FiMinus className="w-4 h-4"/></button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={()=>setQuantity(Math.min(product.stock||99,quantity+1))} className="p-3 text-gray-400 hover:text-white transition-colors"><FiPlus className="w-4 h-4"/></button>
              </div>
              <button onClick={addToCart} className={`flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all ${added?'bg-emerald-500 text-white':'btn-primary'}`}>
                {added?<><FiCheck className="w-4 h-4"/>Added to Cart</>:<><FiShoppingCart className="w-4 h-4"/>Add to Cart — ${(product.price*quantity).toFixed(2)}</>}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
              {[{icon:<FiTruck/>,text:'Free shipping'},{icon:<FiShield/>,text:'Secure payment'},{icon:<FiClock/>,text:'30-day returns'}].map((item,i)=>(
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="text-[var(--color-accent)]">{item.icon}</div>
                  <span className="text-xs text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
