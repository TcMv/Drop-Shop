import Link from 'next/link';
import { FiPackage, FiTruck, FiBarChart2, FiSettings, FiShield, FiExternalLink } from 'react-icons/fi';
import { getProducts, getOrders, Product, Order } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let products: Product[] = []; let orders: Order[] = [];
  try { products = await getProducts(); orders = await getOrders(); } catch {}
  const active = products.filter(p=>p.status==='active').length;
  const drafts = products.filter(p=>p.status==='draft').length;
  const revenue = orders.reduce((s,o)=>s+o.total,0);

  return (
    <div className="min-h-screen pt-24 pb-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] flex items-center justify-center"><FiShield className="w-5 h-5 text-[var(--color-accent)]"/></div>
        <div><h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1><p className="text-sm text-gray-500">Manage your dropshipping store</p></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {icon:<FiPackage/>,label:'Active Products',value:active,color:'text-blue-400',bg:'bg-blue-500/10'},
          {icon:<FiBarChart2/>,label:'Drafts',value:drafts,color:'text-amber-400',bg:'bg-amber-500/10'},
          {icon:<FiTruck/>,label:'Orders',value:orders.length,color:'text-emerald-400',bg:'bg-emerald-500/10'},
          {icon:<FiSettings/>,label:'Revenue',value:`$${revenue.toFixed(0)}`,color:'text-purple-400',bg:'bg-purple-500/10'},
        ].map((s,i)=>(
          <div key={i} className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Products ({products.length})</h2>
          <Link href="/" className="flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"><FiExternalLink className="w-3 h-3"/>View Store</Link>
        </div>
        <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] overflow-hidden">
          {products.length===0?<div className="text-center py-12 text-gray-500"><p>No products yet.</p></div>:(
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 text-gray-500 font-medium">Product</th>
                <th className="text-left p-4 text-gray-500 font-medium">Category</th>
                <th className="text-right p-4 text-gray-500 font-medium">Price</th>
                <th className="text-center p-4 text-gray-500 font-medium">Stock</th>
                <th className="text-center p-4 text-gray-500 font-medium">Status</th>
              </tr></thead>
              <tbody>{products.map(p=>(
                <tr key={p.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface-raised)]/50 transition-colors">
                  <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0"><img src={p.images[0]||''} alt="" className="w-full h-full object-cover"/></div><span className="text-white line-clamp-1 max-w-[200px]">{p.title}</span></div></td>
                  <td className="p-4"><span className="price-badge text-[10px]">{p.category}</span></td>
                  <td className="p-4 text-right font-medium">${p.price.toFixed(2)}</td>
                  <td className="p-4 text-center">{p.stock}</td>
                  <td className="p-4 text-center"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status==='active'?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20':p.status==='draft'?'bg-amber-500/10 text-amber-400 border border-amber-500/20':'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>{p.status}</span></td>
                </tr>
              ))}</tbody></table></div>
          )}
        </div>
      </div>
      <div><h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/api/setup" className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all group"><h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">🔄 Setup / Seed</h3><p className="text-xs text-gray-500 mt-1">Create tables and seed sample products</p></Link>
          <Link href="/admin/audit" className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all group"><h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">📋 Audit Log</h3><p className="text-xs text-gray-500 mt-1">View all agent actions and operations</p></Link>
          <a href="https://supabase.com/dashboard/project/oaklafuvpugiafxfjgls" target="_blank" rel="noopener noreferrer" className="p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all group"><h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">🗄️ Supabase Dashboard</h3><p className="text-xs text-gray-500 mt-1">Manage database, tables, and queries</p></a>
        </div>
      </div>
    </div></div>
  );
}
