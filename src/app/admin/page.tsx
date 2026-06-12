'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiActivity, FiBox, FiShoppingBag, FiAlertCircle, FiRefreshCw, FiExternalLink, FiClipboard } from 'react-icons/fi';

interface DashboardData {
  products: { total: number; active: number; draft: number };
  orders: { total: number; pending: number; placed: number; shipped: number };
  audit: { total: number; last24h: number; errors: number };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function fetchData() {
    try {
      const [prodRes, orderRes, auditRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/audit?limit=1'),
      ]);
      
      const products = await prodRes.json();
      const orders = await orderRes.json();
      const audit = await auditRes.json();
      
      // Count by status from the admin API — simplified for now
      // In production, add dedicated count endpoints
      setData({
        products: {
          total: products.length,
          active: products.filter((p: any) => p.status === 'active').length,
          draft: products.filter((p: any) => p.status === 'draft').length,
        },
        orders: {
          total: orders.length || 0,
          pending: orders.filter((o: any) => o.status === 'pending').length,
          placed: orders.filter((o: any) => o.status === 'placed_with_supplier').length,
          shipped: orders.filter((o: any) => o.status === 'shipped').length,
        },
        audit: {
          total: audit.total || 0,
          last24h: 0,
          errors: 0,
        },
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
    setLoading(false);
  }

  async function runAgents() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch('/api/agents/run', { method: 'POST' });
      const data = await res.json();
      setResult(data.success ? '✅ Agents ran successfully' : `❌ Failed: ${data.error}`);
      fetchData();
    } catch {
      setResult('❌ Network error running agents');
    }
    setRunning(false);
  }

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-800 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">AI Operations Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Fully autonomous dropshipping — oversee via audit log</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/audit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors">
            <FiClipboard className="w-4 h-4" /> Audit Log
          </Link>
          <button
            onClick={runAgents}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
            {running ? 'Running...' : 'Run Agents Now'}
          </button>
        </div>
      </div>
      
      {result && (
        <div className="mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 text-sm">
          {result}
        </div>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FiBox className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.products.total || 0}</p>
              <p className="text-sm text-gray-500">Products</p>
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-xs text-gray-500">
            <span className="text-green-400">{data?.products.active || 0} active</span>
            <span className="text-yellow-400">{data?.products.draft || 0} draft</span>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FiShoppingBag className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.orders.total || 0}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-xs text-gray-500">
            <span className="text-yellow-400">{data?.orders.pending || 0} pending</span>
            <span className="text-blue-400">{data?.orders.placed || 0} placed</span>
            <span className="text-green-400">{data?.orders.shipped || 0} shipped</span>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.audit.total || 0}</p>
              <p className="text-sm text-gray-500">Audit Entries</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Every action is logged for your review
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="font-semibold mb-4">Agent Controls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={async () => {
            await fetch('/api/agents/source', { method: 'POST' });
            fetchData();
          }} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors">
            <FiBox className="w-4 h-4 text-blue-400" /> Source Products
          </button>
          <button onClick={async () => {
            await fetch('/api/agents/list', { method: 'POST' });
            fetchData();
          }} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors">
            <FiExternalLink className="w-4 h-4 text-purple-400" /> List Drafts
          </button>
          <button onClick={async () => {
            await fetch('/api/agents/process-orders', { method: 'POST' });
            fetchData();
          }} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors">
            <FiShoppingBag className="w-4 h-4 text-green-400" /> Process Orders
          </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-yellow-400 font-semibold">Fully AI-Operated</p>
            <p className="text-sm text-gray-500 mt-1">
              This store is designed to run autonomously. The AI agents source products, create listings, 
              process orders, and update shipments — all logged to the audit trail. Your role is oversight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
