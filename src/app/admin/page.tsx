import Link from 'next/link';
import { FiPackage, FiTruck, FiBarChart2, FiSettings, FiShield, FiExternalLink, FiZap, FiActivity } from 'react-icons/fi';
import { getProducts, getOrders } from '@/lib/db';
import type { Product, Order } from '@/lib/types';
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let products: Product[] = [];
  let orders: Order[] = [];
  try { products = await getProducts(); orders = await getOrders(); } catch {}
  const active = products.filter(p => p.status === 'active').length;
  const drafts = products.filter(p => p.status === 'draft').length;
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2D6A4F]/20 to-[#40916C]/10 border border-[rgba(45,106,79,0.12)] flex items-center justify-center">
            <FiShield className="w-6 h-6 text-[#52B788]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-text-primary)] uppercase">
                Slice & Dice Golf
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#2D6A4F]/10 border border-[#2D6A4F]/20 text-[#52B788]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52B788] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Manage your golf accessories store — products, orders, catalog
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FiPackage, label: 'Active Products', value: active, color: 'text-[#52B788]', bg: 'bg-[#2D6A4F]/10' },
            { icon: FiBarChart2, label: 'Drafts', value: drafts, color: 'text-[#52B788]', bg: 'bg-[#2D6A4F]/10' },
            { icon: FiTruck, label: 'Orders', value: orders.length, color: 'text-[#D4A843]', bg: 'bg-[#D4A843]/10' },
            { icon: FiSettings, label: 'Revenue', value: `$${revenue.toFixed(0)}`, color: 'text-[#D4A843]', bg: 'bg-[#D4A843]/10' },
          ].map((s, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold font-display text-[var(--color-text-primary)]">{s.value}</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-[var(--color-text-primary)]">
              Golf Products ({products.length})
            </h2>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-[#52B788] hover:text-[#40916C] transition-colors"
            >
              <FiExternalLink className="w-3 h-3" />
              View Store
            </Link>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] overflow-hidden">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-[rgba(45,106,79,0.06)] flex items-center justify-center mx-auto mb-4 border border-[rgba(45,106,79,0.08)]">
                  <FiPackage className="w-6 h-6 text-[#52B788]" />
                </div>
                <p className="text-[var(--color-text-primary)] font-medium">No products yet.</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">The catalog is being curated.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border-default)]">
                      <th className="text-left p-4 text-[var(--color-text-tertiary)] font-medium text-xs uppercase tracking-wider">Product</th>
                      <th className="text-left p-4 text-[var(--color-text-tertiary)] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Category</th>
                      <th className="text-right p-4 text-[var(--color-text-tertiary)] font-medium text-xs uppercase tracking-wider">Price (AUD)</th>
                      <th className="text-center p-4 text-[var(--color-text-tertiary)] font-medium text-xs uppercase tracking-wider hidden md:table-cell">Stock</th>
                      <th className="text-center p-4 text-[var(--color-text-tertiary)] font-medium text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-[var(--color-border-default)]/50 hover:bg-[rgba(45,106,79,0.02)] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[#1B3A2D] to-[#0C0C0C] shrink-0">
                              <img src={p.images[0] || ''} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[var(--color-text-primary)] line-clamp-1 max-w-[200px] font-medium">
                              {p.title}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="category-badge text-[10px]">{p.category}</span>
                        </td>
                        <td className="p-4 text-right font-medium text-[var(--color-text-primary)]">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="p-4 text-center hidden md:table-cell text-[var(--color-text-tertiary)]">
                          {p.stock}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            p.status === 'active'
                              ? 'bg-[#2D6A4F]/10 text-[#52B788] border-[#2D6A4F]/20'
                              : p.status === 'draft'
                              ? 'bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/20'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-display font-semibold text-[var(--color-text-primary)] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/api/setup"
              className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-glow-green)] transition-all group"
            >
              <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[#52B788] transition-colors flex items-center gap-2">
                <FiZap className="w-4 h-4 text-[#52B788]" />
                Setup / Seed
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                Create tables and seed sample products
              </p>
            </Link>
            <Link
              href="/admin/audit"
              className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-glow-green)] transition-all group"
            >
              <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[#52B788] transition-colors flex items-center gap-2">
                <FiActivity className="w-4 h-4 text-[#52B788]" />
                Audit Log
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                View all agent actions and operations
              </p>
            </Link>
            <a
              href="https://supabase.com/dashboard/project/oaklafuvpugiafxfjgls"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-glow-green)] transition-all group"
            >
              <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[#52B788] transition-colors flex items-center gap-2">
                <FiSettings className="w-4 h-4 text-[#52B788]" />
                Supabase Dashboard
              </h3>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
                Manage database, tables, and queries
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
