import React from 'react';
import type { ToolInvocation } from 'ai';
import { Search, Loader2, AlertTriangle, Globe } from 'lucide-react';
import WebsiteAnalysisCard from './WebsiteAnalysisCard';
import {
  isWebsiteAnalysisResult,
  isWebsiteAnalysisError,
} from '@/lib/tools/analyzeWebsite';

export interface ToolInvocationViewProps {
  invocation: ToolInvocation;
}

export default function ToolInvocationView({ invocation }: ToolInvocationViewProps) {
  const { state, toolName } = invocation;

  // Extract URL argument safely if available
  const rawArgs = 'args' in invocation ? invocation.args : undefined;
  const targetUrl =
    typeof rawArgs === 'object' && rawArgs !== null && 'url' in rawArgs && typeof rawArgs.url === 'string'
      ? rawArgs.url
      : '';

  // ----------------------------------------------------
  // STATE 1: INPUT STREAMING ('partial-call')
  // The model is still preparing/generating the tool arguments
  // ----------------------------------------------------
  if (state === 'partial-call') {
    return (
      <div
        className="w-full bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all duration-200 motion-reduce:transition-none animate-in fade-in"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2.5 mb-2 text-slate-800 font-semibold text-xs sm:text-sm">
          <div
            className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"
            aria-hidden="true"
          >
            <Search className="w-3.5 h-3.5" />
          </div>
          <span>Preparing website analysis</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 pl-9">
          <span>Reading analysis request</span>
          <span className="inline-flex gap-1 items-center" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce motion-reduce:animate-none" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce motion-reduce:animate-none [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce motion-reduce:animate-none [animation-delay:0.3s]" />
          </span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STATE 2: INPUT AVAILABLE ('call')
  // Input parameters are validated and the tool is executing
  // ----------------------------------------------------
  if (state === 'call') {
    return (
      <div
        className="w-full bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 shadow-2xs transition-all duration-200 motion-reduce:transition-none animate-in fade-in"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-xs sm:text-sm">
            <div
              className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"
              aria-hidden="true"
            >
              <Search className="w-3.5 h-3.5" />
            </div>
            <span>Website Analysis</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span>Analyzing</span>
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 text-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
            Target URL
          </div>
          <div className="font-mono text-indigo-600 truncate flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{targetUrl || 'Detecting target...'}</span>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
          <span>Executing server-side audit...</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Handle 'result' state
  // ----------------------------------------------------
  if (state === 'result') {
    const rawResult = invocation.result;

    // STATE 4: OUTPUT ERROR (Failed execution or invalid URL)
    if (isWebsiteAnalysisError(rawResult) || !rawResult) {
      const errorMessage =
        rawResult && typeof rawResult === 'object' && 'error' in rawResult && typeof rawResult.error === 'string'
          ? rawResult.error
          : 'Check the URL and try again. URL must begin with http:// or https://';

      return (
        <div
          className="w-full bg-rose-50/90 border border-rose-200 rounded-2xl p-4 shadow-2xs text-rose-900 transition-all duration-200 motion-reduce:transition-none animate-in fade-in"
          role="alert"
        >
          <div className="flex items-center gap-2.5 mb-2 font-semibold text-xs sm:text-sm text-rose-800">
            <div
              className="w-7 h-7 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0"
              aria-hidden="true"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span>Website analysis couldn&apos;t be completed</span>
          </div>

          <p className="text-xs text-rose-700 leading-relaxed mb-2.5 [overflow-wrap:anywhere]">
            {errorMessage}
          </p>

          {targetUrl && (
            <div className="bg-rose-100/70 border border-rose-200/90 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-rose-800 truncate">
              URL: {targetUrl}
            </div>
          )}
        </div>
      );
    }

    // STATE 3: OUTPUT AVAILABLE (Successful structured analysis result)
    if (toolName === 'analyzeWebsite' && isWebsiteAnalysisResult(rawResult)) {
      return <WebsiteAnalysisCard result={rawResult} />;
    }
  }

  return null;
}
