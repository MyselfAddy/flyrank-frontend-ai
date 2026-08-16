'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  RefreshCw,
  Terminal,
  Activity,
  Sliders,
  Maximize2,
  Wand2,
} from 'lucide-react';
import { BrainButton, ButtonStatus } from './BrainButton';
import { BrainActionButton } from './BrainActionButton';

interface TelemetryEvent {
  id: string;
  time: string;
  from: ButtonStatus;
  to: ButtonStatus;
  durationMs?: number;
  outcome?: string;
}

export function MotionShowcase() {
  // State controls for Hero Button
  const [heroStatus, setHeroStatus] = useState<ButtonStatus>('idle');
  const [forceOutcome, setForceOutcome] = useState<'success' | 'error' | 'random' | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(1200);
  const [forceReducedMotion, setForceReducedMotion] = useState<boolean>(false);
  const [simulatedPrompt, setSimulatedPrompt] = useState<string>(
    'Synthesize key findings from the 2026 Q3 autonomous systems benchmark.'
  );

  // Telemetry & stats
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [stats, setStats] = useState({
    attempts: 0,
    successes: 0,
    errors: 0,
  });

  const handleHeroStatusChange = (newStatus: ButtonStatus, prevStatus: ButtonStatus) => {
    setHeroStatus(newStatus);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;

    if (newStatus === 'loading') {
      setStats((s) => ({ ...s, attempts: s.attempts + 1 }));
    } else if (newStatus === 'success') {
      setStats((s) => ({ ...s, successes: s.successes + 1 }));
    } else if (newStatus === 'error') {
      setStats((s) => ({ ...s, errors: s.errors + 1 }));
    }

    setEvents((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        time: timeStr,
        from: prevStatus,
        to: newStatus,
        durationMs: newStatus === 'loading' ? latencyMs : undefined,
      },
      ...prev.slice(0, 19),
    ]);
  };

  const getStatusBadgeStyle = (status: ButtonStatus) => {
    switch (status) {
      case 'loading':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'error':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'idle':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[400px] bg-violet-600/10 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Header Section */}
        <header className="space-y-4 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-slate-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FE-AA1 Component Specification</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Buttons with a Brain
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-1 leading-relaxed">
              State-machine micro-interactions & motion choreography for AI chat actions.
              Compositor-only animations, zero layout thrashing, and full reduced-motion accessibility.
            </p>
          </div>

          {/* Global Reduced-Motion Simulator */}
          <div className="mt-4 sm:mt-0 flex items-center justify-center sm:justify-end gap-3 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Reduced Motion Mode</span>
            <button
              id="reduced-motion-toggle"
              type="button"
              onClick={() => setForceReducedMotion((prev) => !prev)}
              aria-pressed={forceReducedMotion}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                forceReducedMotion ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <motion.span
                layout
                transition={{ duration: 0.15 }}
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm block ${
                  forceReducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </header>

        {/* Hero Interactive Stage */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Stage Box */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-8 relative overflow-hidden">
            {/* Top State Status Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span className="text-sm font-semibold text-slate-200">Interactive Hero Arena</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Current State:</span>
                <span
                  id="current-state-badge"
                  className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all duration-200 ${getStatusBadgeStyle(
                    isDisabled ? 'idle' : heroStatus
                  )}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      heroStatus === 'loading'
                        ? 'bg-indigo-400 animate-ping'
                        : heroStatus === 'success'
                        ? 'bg-emerald-400'
                        : heroStatus === 'error'
                        ? 'bg-rose-400'
                        : 'bg-slate-400'
                    }`}
                  />
                  {isDisabled ? 'disabled' : heroStatus}
                </span>
              </div>
            </div>

            {/* Prominent Hero Button Showcase */}
            <div className="py-8 flex flex-col items-center justify-center space-y-6 bg-slate-950/60 border border-slate-800/50 rounded-xl p-6">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Standalone Hero Trigger
              </span>
              
              <div className="flex items-center justify-center min-h-[64px]">
                <BrainButton
                  id="hero-brain-button"
                  size="lg"
                  disabled={isDisabled}
                  forceOutcome={forceOutcome}
                  asyncDurationMs={latencyMs}
                  forceReducedMotion={forceReducedMotion}
                  onStatusChange={handleHeroStatusChange}
                  labels={{
                    idle: 'Generate with AI',
                    loading: 'Thinking & Synthesizing...',
                    success: 'Generated!',
                    error: 'Generation Failed',
                    retry: 'Retry Generation',
                  }}
                  className="shadow-xl"
                />
              </div>

              <p className="text-xs text-slate-400 text-center max-w-sm">
                Click to initiate async transition. Notice smooth morphing, tactile press response, compositor-driven error shake, and auto-reset.
              </p>
            </div>

            {/* Real AI Chat Input Simulation with Embedded BrainButton */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="sim-prompt" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-World Chat Composer Integration</span>
                </label>
                <span className="text-[11px] text-slate-500">Live Send Button Slot</span>
              </div>

              <div className="relative rounded-xl bg-slate-950/80 border border-slate-700/70 p-3 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <textarea
                  id="sim-prompt"
                  rows={2}
                  value={simulatedPrompt}
                  onChange={(e) => setSimulatedPrompt(e.target.value)}
                  placeholder="Enter a prompt for the AI model..."
                  className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 resize-none outline-none pr-32"
                />
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Gemini 2.5 Flash</span>
                  </div>

                  <BrainButton
                    id="composer-send-button"
                    size="sm"
                    disabled={isDisabled || !simulatedPrompt.trim()}
                    forceOutcome={forceOutcome}
                    asyncDurationMs={latencyMs}
                    forceReducedMotion={forceReducedMotion}
                    onStatusChange={handleHeroStatusChange}
                    labels={{
                      idle: 'Send',
                      loading: 'Sending...',
                      success: 'Sent!',
                      retry: 'Retry',
                    }}
                    icon="arrow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Control & Telemetry Deck */}
          <div className="lg:col-span-5 space-y-6">
            {/* Deterministic State Triggers */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span>Deterministic State Triggers</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="trigger-success-btn"
                  type="button"
                  onClick={() => setForceOutcome('success')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    forceOutcome === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Force Success</span>
                </button>

                <button
                  id="trigger-failure-btn"
                  type="button"
                  onClick={() => setForceOutcome('error')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    forceOutcome === 'error'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Force Failure</span>
                </button>

                <button
                  id="trigger-random-btn"
                  type="button"
                  onClick={() => setForceOutcome(null)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    forceOutcome === null
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Random (20% Fail)</span>
                </button>

                <button
                  id="trigger-disabled-btn"
                  type="button"
                  onClick={() => setIsDisabled((prev) => !prev)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDisabled
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isDisabled ? 'Disabled (On)' : 'Disable Button'}</span>
                </button>
              </div>

              {/* Simulated Latency Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-800/70">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Simulated Async Duration:</span>
                  </span>
                  <span className="font-mono text-indigo-300 font-semibold">{latencyMs} ms</span>
                </div>
                <input
                  id="latency-slider"
                  type="range"
                  min={300}
                  max={3000}
                  step={100}
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Live State Telemetry & Execution Log */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>State Transition Telemetry</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>Att: {stats.attempts}</span>
                  <span className="text-emerald-400">✓ {stats.successes}</span>
                  <span className="text-rose-400">✗ {stats.errors}</span>
                </div>
              </div>

              <div
                id="telemetry-log-container"
                className="h-44 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px] select-text"
              >
                {events.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs italic">
                    No state transitions logged yet. Click any button to observe.
                  </div>
                ) : (
                  events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-slate-300"
                    >
                      <span className="text-slate-500">{ev.time}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">{ev.from}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                        <span
                          className={`font-bold ${
                            ev.to === 'success'
                              ? 'text-emerald-400'
                              : ev.to === 'error'
                              ? 'text-rose-400'
                              : ev.to === 'loading'
                              ? 'text-indigo-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {ev.to}
                        </span>
                      </div>
                      {ev.durationMs && (
                        <span className="text-[10px] text-indigo-400/80">({ev.durationMs}ms)</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Related Action Buttons Variant Showcase */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Multi-Variant Motion Language & Micro-interaction Family</span>
            </h2>
            <p className="text-xs text-slate-400">
              The same spring physics, compositor transforms, and error resilience applied to compact and secondary AI actions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {/* Secondary Brain Action */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Secondary Action
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Prompt enhancer variant</p>
              </div>
              <BrainActionButton
                id="enhance-action-btn"
                icon="wand"
                label="Enhance Prompt"
                loadingLabel="Optimizing..."
                successLabel="Optimized!"
              />
            </div>

            {/* Regenerate Action */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Regenerate
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Retry context generator</p>
              </div>
              <BrainActionButton
                id="regenerate-action-btn"
                icon="refresh"
                label="Regenerate Answer"
                loadingLabel="Recomputing..."
                successLabel="Recreated!"
              />
            </div>

            {/* Secondary Style BrainButton */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Secondary Variant
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Dark slate styling</p>
              </div>
              <BrainButton
                id="secondary-variant-btn"
                variant="secondary"
                size="sm"
                labels={{
                  idle: 'Summarize',
                  loading: 'Summarizing...',
                  success: 'Done!',
                  retry: 'Retry',
                }}
                icon="sparkles"
              />
            </div>

            {/* Compact Icon-Only Send */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Compact Icon
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Zero layout shift</p>
              </div>
              <div className="flex items-center">
                <BrainButton
                  id="compact-icon-btn"
                  variant="primary"
                  size="sm"
                  labels={{ idle: '', loading: '', success: '', retry: '', error: '' }}
                  icon="arrow"
                  className="!px-3 !py-2.5 !min-w-[40px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Motion System Specifications & Architectural Choices */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Motion System Architecture & Easing Rationale</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mathematical rationale and performance guarantees implemented in BrainButton.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Timing & Easings */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>Intentional Timing Scales</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <li>
                  <strong className="text-slate-200">Hover / Press (120–180ms):</strong> Instant tactile response with <code className="text-indigo-300">[0.16, 1, 0.3, 1]</code> snappy cubic bezier.
                </li>
                <li>
                  <strong className="text-slate-200">State Transition (200–300ms):</strong> Smooth cross-fade and vertical pop-layout label sliding.
                </li>
                <li>
                  <strong className="text-slate-200">Success Dwell (600–700ms):</strong> Gives human eye clear cognitive confirmation before auto-resetting.
                </li>
              </ul>
            </div>

            {/* Card 2: Compositor & Layout Thrashing */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Layers className="w-4 h-4" />
                <span>Zero Layout Thrashing</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All micro-interactions mutate strictly GPU-compositor properties: <code className="text-emerald-300">transform (scale, translate, rotate)</code> and <code className="text-emerald-300">opacity</code>.
                No geometry reflows or geometry recalculations during rapid state transitions.
              </p>
            </div>

            {/* Card 3: Reduced Motion & a11y */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
                <Shield className="w-4 h-4" />
                <span>Accessible Micro-interactions</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When <code className="text-violet-300">prefers-reduced-motion</code> is active, horizontal error shaking and high-frequency rotations are suppressed, preserving clean color boundaries, focus rings, and screen-reader ARIA notifications.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MotionShowcase;
