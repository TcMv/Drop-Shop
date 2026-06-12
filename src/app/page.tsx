import Link from 'next/link';
import { FiShoppingBag, FiTrendingUp, FiTruck } from 'react-icons/fi';
import { getProducts, Product } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getProducts('active');
  } catch {
    // Products unavailable — show empty state
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Welcome to the Store
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          AI-curated products at unbeatable prices. Everything is sourced, listed, and fulfilled automatically.
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
          <span className="flex items-center gap-1"><FiShoppingBag className="w-4 h-4" /> AI Sourced</span>
          <span className="flex items-center gap-1"><FiTrendingUp className="w-4 h-4" /> Trending Picks</span>
          <span className="flex items-center gap-1"><FiTruck className="w-4 h-4" /> Direct Shipping</span>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products available yet.</p>
          <p className="text-gray-600 mt-2">The AI sourcing agent will populate the store shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                  <img
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-400">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-600">Free Shipping</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
