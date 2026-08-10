'use client';

import { useState, useEffect, useCallback } from 'react';
import { HealthStatus } from '@/lib/health';
import { Activity, RefreshCw, CheckCircle2, Clock, Server, Cpu } from 'lucide-react';

export default function HealthPage() {
  const [data, setData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Health check failed with status ${res.status}`);
      }
      const json: HealthStatus = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Health Inspection
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real-time status metrics retrieved from <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/api/health</code>
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
          <strong>Error:</strong> {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Status</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xl font-bold text-slate-900 capitalize">
              {data ? data.status : loading ? 'Checking...' : 'Unknown'}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Service</span>
            <Server className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {data ? data.service : loading ? '...' : '-'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Environment</span>
            <Cpu className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 capitalize">
            {data ? data.environment : loading ? '...' : '-'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Uptime</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {data ? `${data.uptime}s` : loading ? '...' : '-'}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <span>Raw Response Payload</span>
        </h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs font-mono text-slate-100 leading-relaxed">
          {loading && !data ? 'Fetching payload...' : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
