'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, RefreshCw, Check, AlertTriangle, Wand2 } from 'lucide-react';
import { ButtonStatus } from './BrainButton';

export interface BrainActionButtonProps {
  label?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  icon?: 'wand' | 'refresh' | 'sparkles';
  disabled?: boolean;
  onTrigger?: () => Promise<boolean | void> | boolean | void;
  className?: string;
  id?: string;
}

export function BrainActionButton({
  label = 'Enhance with AI',
  loadingLabel = 'Enhancing...',
  successLabel = 'Enhanced!',
  errorLabel = 'Retry Enhance',
  icon = 'wand',
  disabled = false,
  onTrigger,
  className = '',
  id,
}: BrainActionButtonProps) {
  const isReducedMotion = useReducedMotion();
  const [status, setStatus] = useState<ButtonStatus>('idle');
  const isRunningRef = useRef<boolean>(false);

  const handleClick = async () => {
    if (disabled || status === 'loading' || isRunningRef.current) return;
    isRunningRef.current = true;
    setStatus('loading');

    try {
      if (onTrigger) {
        const res = await onTrigger();
        if (res === false) {
          setStatus('error');
        } else {
          setStatus('success');
        }
      } else {
        // default simulated run
        await new Promise((r) => setTimeout(r, 1100));
        setStatus('success');
      }
    } catch {
      setStatus('error');
    } finally {
      isRunningRef.current = false;
      if (status === 'success' || status === 'idle') {
        setTimeout(() => {
          setStatus('idle');
        }, 800);
      }
    }
  };

  const IconComponent = () => {
    if (status === 'loading') {
      return (
        <RefreshCw
          className={`w-3.5 h-3.5 text-violet-300 ${isReducedMotion ? '' : 'animate-spin'}`}
        />
      );
    }
    if (status === 'success') {
      return <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[2.5]" />;
    }
    if (status === 'error') {
      return <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />;
    }
    if (icon === 'wand') return <Wand2 className="w-3.5 h-3.5 text-violet-400" />;
    if (icon === 'refresh') return <RefreshCw className="w-3.5 h-3.5 text-slate-300" />;
    return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
  };

  const getLabel = () => {
    if (status === 'loading') return loadingLabel;
    if (status === 'success') return successLabel;
    if (status === 'error') return errorLabel;
    return label;
  };

  return (
    <motion.button
      id={id}
      type="button"
      onClick={handleClick}
      disabled={disabled || status === 'loading'}
      aria-busy={status === 'loading'}
      aria-live="polite"
      whileHover={!disabled && status !== 'loading' ? { scale: isReducedMotion ? 1 : 1.02 } : undefined}
      whileTap={!disabled && status !== 'loading' ? { scale: isReducedMotion ? 1 : 0.98 } : undefined}
      animate={
        status === 'error' && !isReducedMotion
          ? { x: [0, -5, 5, -4, 4, -2, 2, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.3 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200 cursor-pointer select-none
        border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
        ${
          status === 'error'
            ? 'bg-rose-950/70 border-rose-500/60 text-rose-200'
            : status === 'success'
            ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
            : status === 'loading'
            ? 'bg-violet-950/60 border-violet-500/50 text-violet-200'
            : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200 hover:text-white'
        }
        ${className}
      `}
    >
      <IconComponent />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: isReducedMotion ? 0 : 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isReducedMotion ? 0 : -5 }}
          transition={{ duration: 0.15 }}
          className="whitespace-nowrap"
        >
          {getLabel()}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
