import Link from 'next/link';
import { Activity, CheckCircle2, ShieldCheck, ArrowRight, Code2, Server } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="rounded-2xl bg-white border border-slate-200 p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Phase: Foundations — FE-04 Complete</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              FlyRank Capstone Skeleton
            </h1>
            <p className="text-slate-600 max-w-2xl text-base leading-relaxed">
              Clean, lightweight Next.js 15 App Router architecture serving as the foundational skeleton for the FlyRank AI Engineering platform.
            </p>
          </div>
          <Link
            href="/health"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors shrink-0"
          >
            <Activity className="h-4 w-4" />
            <span>Inspect Health Status</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Grid of specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Code2 className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-lg">Next.js 15 & TS</h3>
          <p className="text-slate-600 text-sm leading-normal">
            Built on Next.js 15 App Router with strict TypeScript, standard React 19 server components, and Tailwind v4.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-lg">Health Verification</h3>
          <p className="text-slate-600 text-sm leading-normal">
            Integrated health check system featuring dynamic JSON route <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/api/health</code> and UI monitoring.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-lg">Vercel Target</h3>
          <p className="text-slate-600 text-sm leading-normal">
            Self-contained architecture structured for automated deployment targeting Vercel serverless runtime.
          </p>
        </div>
      </div>

      {/* System Status Table */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <span>Foundational Core Routes</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">FE-04 Scope</span>
        </div>
        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-3 flex justify-between items-center">
            <div className="font-mono text-slate-800">/</div>
            <span className="text-slate-600">Home Landing & Foundational Overview</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <div className="font-mono text-slate-800">/health</div>
            <span className="text-slate-600">Health Inspection Dashboard (fetches /api/health)</span>
          </div>
          <div className="py-3 flex justify-between items-center">
            <div className="font-mono text-slate-800">/api/health</div>
            <span className="text-slate-600">JSON Health API Endpoint</span>
          </div>
        </div>
      </section>
    </div>
  );
}
