import React from 'react';
import { Globe, ShieldCheck, ShieldAlert, CheckCircle2, FileText, BarChart3, ExternalLink } from 'lucide-react';
import type { WebsiteAnalysisResult } from '@/lib/tools/analyzeWebsite';

export interface WebsiteAnalysisCardProps {
  result: WebsiteAnalysisResult;
}

/**
 * Helper to clamp score safely between 0 and 100
 */
function clampScore(score?: number): number {
  if (typeof score !== 'number' || isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Helper to determine score color class
 */
function getScoreColorClass(score: number): {
  bar: string;
  badge: string;
  text: string;
} {
  if (score >= 80) {
    return {
      bar: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: 'text-emerald-700',
    };
  }
  if (score >= 60) {
    return {
      bar: 'bg-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'text-amber-700',
    };
  }
  return {
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    text: 'text-rose-700',
  };
}

export default function WebsiteAnalysisCard({ result }: WebsiteAnalysisCardProps) {
  const seoScore = clampScore(result?.seoScore);
  const a11yScore = clampScore(result?.accessibilityScore);
  const seoColors = getScoreColorClass(seoScore);
  const a11yColors = getScoreColorClass(a11yScore);

  const displayUrl = result?.url || 'Not available';
  const displayDomain = result?.domain || 'Not available';
  const displayTitle = result?.title || 'Not available';
  const displayDescription = result?.description || 'Not available';
  const displaySummary = result?.summary || 'Not available';
  const isHttps = Boolean(result?.https);
  const hasValidLink = displayUrl.startsWith('http://') || displayUrl.startsWith('https://');

  return (
    <div
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-200 motion-reduce:transition-none hover:border-slate-300 w-full max-w-full overflow-hidden text-slate-900 font-sans"
      role="region"
      aria-label={`Website Analysis for ${displayDomain}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2.5 pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0"
            aria-hidden="true"
          >
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {displayDomain}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Audit
              </span>
            </div>
            {hasValidLink ? (
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-700 hover:underline truncate flex items-center gap-1 mt-0.5 group"
                title={displayUrl}
              >
                <span className="truncate max-w-[200px] sm:max-w-[280px]">{displayUrl}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                {displayUrl}
              </span>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="shrink-0">
          {isHttps ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" aria-hidden="true" />
              <span>HTTPS Secure</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="w-3 h-3 text-amber-600" aria-hidden="true" />
              <span>HTTP Insecure</span>
            </span>
          )}
        </div>
      </div>

      {/* Performance & Score Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* SEO Score Meter */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>SEO Score</span>
            </span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded-md border text-[11px] ${seoColors.badge}`}
            >
              {seoScore} / 100
            </span>
          </div>
          <div
            className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="SEO Score"
            aria-valuenow={seoScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full ${seoColors.bar} transition-all duration-500 motion-reduce:transition-none ease-out`}
              style={{ width: `${seoScore}%` }}
            />
          </div>
        </div>

        {/* Accessibility Score Meter */}
        <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Accessibility</span>
            </span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded-md border text-[11px] ${a11yColors.badge}`}
            >
              {a11yScore} / 100
            </span>
          </div>
          <div
            className="w-full h-2 bg-slate-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Accessibility Score"
            aria-valuenow={a11yScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full ${a11yColors.bar} transition-all duration-500 motion-reduce:transition-none ease-out`}
              style={{ width: `${a11yScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Structural Metadata Tags */}
      <div className="space-y-1.5 mb-3.5 text-xs">
        <div className="flex items-start gap-2 bg-slate-50 border border-slate-100/80 rounded-lg p-2.5">
          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
              Title
            </div>
            <div className="text-slate-800 font-medium text-xs truncate mt-0.5" title={displayTitle}>
              {displayTitle}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-slate-50 border border-slate-100/80 rounded-lg p-2.5">
          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">
              Description
            </div>
            <div
              className="text-slate-700 text-xs line-clamp-2 mt-0.5 leading-relaxed [overflow-wrap:anywhere]"
              title={displayDescription}
            >
              {displayDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-xl p-3 text-xs leading-relaxed text-slate-800">
        <div className="font-semibold text-indigo-900 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>Executive Summary</span>
        </div>
        <p className="text-slate-700 [overflow-wrap:anywhere] break-words">{displaySummary}</p>
      </div>
    </div>
  );
}
