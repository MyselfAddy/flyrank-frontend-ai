'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Application Error]:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0b0f19] text-slate-100 text-center">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <div className="w-14 h-14 bg-rose-950/60 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-500/30">
          <AlertTriangle className="w-7 h-7" aria-hidden="true" />
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          Application Error
        </h2>
        
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          An unexpected error occurred. You can reload the interface to resume.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
