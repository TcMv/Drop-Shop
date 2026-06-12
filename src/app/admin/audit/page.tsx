'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

interface AuditEntry {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  status: 'success' | 'error' | 'info';
  metadata?: Record<string, unknown>;
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  async function loadAudit() {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`);
      const data = await res.json();
      setEntries(data.entries || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load audit log:', err);
    }
    setLoading(false);
  }

  useEffect(() => { loadAudit(); }, [page]);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.status === filter);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  function formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-AU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'success': return <FiCheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <FiAlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <FiInfo className="w-4 h-4 text-blue-400" />;
    }
  }

  function getAgentColor(agent: string): string {
    const colors: Record<string, string> = {
      'sourcing-agent': 'text-blue-400 bg-blue-500/10',
      'listing-agent': 'text-purple-400 bg-purple-500/10',
      'order-agent': 'text-green-400 bg-green-500/10',
      'api-trigger': 'text-yellow-400 bg-yellow-500/10',
    };
    return colors[agent] || 'text-gray-400 bg-gray-500/10';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-blue-400">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Audit Log</h1>
            <p className="text-sm text-gray-500 mt-1">
              {total} total entries — every AI action is recorded here
            </p>
          </div>
        </div>
        <button
          onClick={loadAudit}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'info', 'success', 'error'].map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Entries */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-20 bg-gray-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <FiClock className="w-12 h-12 mx-auto text-gray-700" />
          <p className="mt-4 text-lg">No audit entries yet</p>
          <p className="mt-2 text-sm">Run the AI agents to see actions appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getStatusIcon(entry.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAgentColor(entry.agent)}`}>
                      {entry.agent}
                    </span>
                    <span className="text-xs text-gray-600">{formatTimestamp(entry.timestamp)}</span>
                    <span className="text-xs text-gray-600">({timeAgo(entry.timestamp)})</span>
                  </div>
                  <p className="text-sm font-medium text-gray-200 mt-1">{entry.action}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{entry.details}</p>
                  
                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400">View metadata</summary>
                      <pre className="mt-2 p-2 bg-gray-950 rounded-lg text-xs text-gray-500 overflow-x-auto">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-sm disabled:opacity-50 hover:bg-gray-700"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg bg-gray-800 text-sm disabled:opacity-50 hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
