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
    // Log unexpected errors for monitoring without leaking stack to the UI
    console.error('[Application Route Error]:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100 shadow-2xs">
          <AlertTriangle className="w-7 h-7" aria-hidden="true" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Unable to Load Interface
        </h2>
        
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          An unexpected application error occurred. You can reload the interface or try again to resume your session.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Try recovering from application error"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}

