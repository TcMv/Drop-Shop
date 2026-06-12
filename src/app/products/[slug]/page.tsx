'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiTruck } from 'react-icons/fi';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  cost: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
}

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const addToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.productId === product.id);
    
    if (existing >= 0) {
      cart[existing].quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.images[0],
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    
    // Dispatch custom event for cart badge
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse"><div className="w-20 h-20 bg-gray-800 rounded-full mx-auto" /></div>
        <p className="mt-4 text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <button onClick={() => router.push('/')} className="mt-4 text-blue-400 hover:text-blue-300">
          ← Back to store
        </button>
      </div>
    );
  }

  const margin = Math.round(((product.price - product.cost) / product.price) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-400 mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={product.images[selectedImage] || '/placeholder.png'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-blue-500' : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/30">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold mt-3 text-gray-100">{product.title}</h1>
          
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-blue-400">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500 line-through">${(product.price * 1.4).toFixed(2)}</span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{margin}% off RRP</span>
          </div>
          
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><FiTruck className="w-3 h-3" /> Free Shipping</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>
          
          <p className="mt-6 text-gray-400 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
          
          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Add to Cart */}
          <div className="mt-8">
            <button
              onClick={addToCart}
              className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {added ? (
                <><FiCheck className="w-5 h-5" /> Added to Cart</>
              ) : (
                <><FiShoppingCart className="w-5 h-5" /> Add to Cart</>
              )}
            </button>
          </div>
          
          {/* Product details */}
          <div className="mt-8 p-4 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Product Details</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <p>Category: {product.category}</p>
              <p>Supplier: Direct Import</p>
              <p>Ships from: Warehouse (3-7 business days)</p>
              <p>Returns: 30-day satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
