'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Sparkles,
  Loader2,
  Check,
  RotateCcw,
  AlertCircle,
  ArrowUp,
  Brain,
} from 'lucide-react';

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export interface BrainButtonLabels {
  idle?: string;
  loading?: string;
  success?: string;
  error?: string;
  retry?: string;
}

export interface BrainButtonProps {
  /** Optional explicit controlled status */
  status?: ButtonStatus;
  /** Initial status when uncontrolled */
  defaultStatus?: ButtonStatus;
  /** Async click handler. Return false or reject to trigger error state. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<boolean | void> | boolean | void;
  /** Callback fired whenever the internal status changes */
  onStatusChange?: (newStatus: ButtonStatus, previousStatus: ButtonStatus) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'subtle' | 'compact' | 'pill';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom labels for each state */
  labels?: BrainButtonLabels;
  /** Primary icon for idle state */
  icon?: 'sparkles' | 'arrow' | 'brain' | 'none';
  /** Random failure rate between 0 and 1 for fake async operations (default: 0.20) */
  randomFailureRate?: number;
  /** Forced outcome for deterministic testing or demo controls */
  forceOutcome?: 'success' | 'error' | 'random' | null;
  /** Simulated async duration in milliseconds (default: 1200) */
  asyncDurationMs?: number;
  /** Duration in ms to show the success state before returning to idle (default: 700) */
  autoResetSuccessMs?: number;
  /** Optional override for prefers-reduced-motion */
  forceReducedMotion?: boolean;
  /** Unique ID for accessibility */
  id?: string;
  /** Additional CSS class names */
  className?: string;
  /** Button HTML type */
  type?: 'button' | 'submit' | 'reset';
  /** Accessible label */
  'aria-label'?: string;
}

export function BrainButton({
  status: controlledStatus,
  defaultStatus = 'idle',
  onClick,
  onStatusChange,
  disabled = false,
  variant = 'primary',
  size = 'md',
  labels = {},
  icon = 'sparkles',
  randomFailureRate = 0.2,
  forceOutcome = null,
  asyncDurationMs = 1200,
  autoResetSuccessMs = 700,
  forceReducedMotion,
  id: customId,
  className = '',
  type = 'button',
  'aria-label': customAriaLabel,
}: BrainButtonProps) {
  const generatedId = useId();
  const id = customId || `brain-btn-${generatedId}`;
  const systemReducedMotion = useReducedMotion();
  const isReducedMotion = forceReducedMotion ?? systemReducedMotion;

  // Uncontrolled status state
  const [internalStatus, setInternalStatus] = useState<ButtonStatus>(defaultStatus);
  const currentStatus = controlledStatus ?? internalStatus;
  const prevStatusRef = useRef<ButtonStatus>(currentStatus);

  // Guard against spam clicks during active transitions
  const isTransitioningRef = useRef<boolean>(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Status transition helper with notifications
  const transitionTo = useCallback((newStatus: ButtonStatus) => {
    const prev = prevStatusRef.current;
    if (prev !== newStatus) {
      prevStatusRef.current = newStatus;
      if (controlledStatus === undefined) {
        setInternalStatus(newStatus);
      }
      onStatusChange?.(newStatus, prev);
    }
  }, [controlledStatus, onStatusChange]);

  // Sync controlled status if provided
  useEffect(() => {
    if (controlledStatus !== undefined && controlledStatus !== prevStatusRef.current) {
      prevStatusRef.current = controlledStatus;
    }
  }, [controlledStatus]);

  // Handle auto-reset from success back to idle
  useEffect(() => {
    if (currentStatus === 'success' && autoResetSuccessMs > 0) {
      resetTimerRef.current = setTimeout(() => {
        transitionTo('idle');
      }, autoResetSuccessMs);
    }
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [currentStatus, autoResetSuccessMs, transitionTo]);

  // Merge default labels
  const resolvedLabels: Required<BrainButtonLabels> = {
    idle: labels.idle ?? (variant === 'compact' ? '' : 'Send message'),
    loading: labels.loading ?? (variant === 'compact' ? '' : 'Generating...'),
    success: labels.success ?? (variant === 'compact' ? '' : 'Sent!'),
    error: labels.error ?? (variant === 'compact' ? '' : 'Failed'),
    retry: labels.retry ?? (variant === 'compact' ? '' : 'Retry'),
  };

  // Execute the async operation safely
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || currentStatus === 'loading' || isTransitioningRef.current) {
      e.preventDefault();
      return;
    }

    // If in error state, clicking retries
    isTransitioningRef.current = true;
    transitionTo('loading');

    try {
      if (onClick) {
        // Custom user-provided promise or callback
        const result = await onClick(e);
        if (result === false) {
          transitionTo('error');
        } else {
          transitionTo('success');
        }
      } else {
        // Built-in simulated async operation
        await new Promise((resolve) => setTimeout(resolve, asyncDurationMs));

        let isSuccess = true;
        if (forceOutcome === 'success') {
          isSuccess = true;
        } else if (forceOutcome === 'error') {
          isSuccess = false;
        } else {
          isSuccess = Math.random() >= randomFailureRate;
        }

        if (isSuccess) {
          transitionTo('success');
        } else {
          transitionTo('error');
        }
      }
    } catch {
      transitionTo('error');
    } finally {
      isTransitioningRef.current = false;
    }
  };

  // Size styling tokens
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 min-h-[34px] gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 min-h-[42px] gap-2 rounded-xl',
    lg: 'text-base px-5 py-3 min-h-[48px] gap-2.5 rounded-xl',
  }[size];

  // Visual state classes based on status
  const getVariantStyles = () => {
    if (disabled) {
      return 'bg-slate-800/60 text-slate-500 border border-slate-700/40 cursor-not-allowed opacity-60 shadow-none';
    }

    switch (currentStatus) {
      case 'loading':
        return 'bg-indigo-950/80 text-indigo-200 border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.25)] cursor-wait';
      case 'success':
        return 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.35)]';
      case 'error':
        return 'bg-rose-950/90 text-rose-200 border border-rose-500/70 shadow-[0_0_24px_rgba(244,63,94,0.35)] hover:bg-rose-900/90 hover:border-rose-400';
      case 'idle':
      default:
        if (variant === 'secondary') {
          return 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border border-slate-700 hover:border-slate-600 shadow-md hover:shadow-slate-900/50';
        }
        if (variant === 'subtle') {
          return 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent hover:border-slate-700/60';
        }
        // Primary gradient
        return 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:via-indigo-400 hover:to-violet-500 text-white border border-indigo-400/30 shadow-[0_4px_16px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.45)]';
    }
  };

  // Motion variants for button container
  const containerVariants = {
    idle: { scale: 1, x: 0 },
    hover: {
      scale: isReducedMotion || disabled || currentStatus === 'loading' ? 1 : 1.02,
      transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const },
    },
    tap: {
      scale: isReducedMotion || disabled || currentStatus === 'loading' ? 1 : 0.97,
      transition: { duration: 0.1, ease: 'easeOut' as const },
    },
    error: {
      scale: 1,
      x: isReducedMotion ? 0 : [0, -7, 7, -5, 5, -2, 2, 0],
      transition: {
        duration: isReducedMotion ? 0.05 : 0.38,
        ease: 'easeInOut' as const,
      },
    },
    success: {
      scale: isReducedMotion ? 1 : [1, 1.03, 1],
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
  };

  // Content transition variants
  const contentVariants = {
    initial: {
      opacity: 0,
      y: isReducedMotion ? 0 : 8,
      filter: isReducedMotion ? 'none' : 'blur(2px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'none',
      transition: {
        duration: isReducedMotion ? 0.08 : 0.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: isReducedMotion ? 0 : -8,
      filter: isReducedMotion ? 'none' : 'blur(2px)',
      transition: {
        duration: isReducedMotion ? 0.06 : 0.15,
        ease: 'easeIn' as const,
      },
    },
  };

  // Dynamic accessible text
  const currentLabelText = () => {
    switch (currentStatus) {
      case 'loading':
        return resolvedLabels.loading;
      case 'success':
        return resolvedLabels.success;
      case 'error':
        return resolvedLabels.retry;
      case 'idle':
      default:
        return resolvedLabels.idle;
    }
  };

  const ariaLabel =
    customAriaLabel ||
    (currentStatus === 'error'
      ? `Error occurred. Click to retry: ${resolvedLabels.retry}`
      : currentStatus === 'loading'
      ? resolvedLabels.loading
      : currentStatus === 'success'
      ? resolvedLabels.success
      : resolvedLabels.idle || 'Send AI message');

  return (
    <motion.button
      id={id}
      type={type}
      onClick={handleClick}
      disabled={disabled || currentStatus === 'loading'}
      aria-busy={currentStatus === 'loading'}
      aria-live="polite"
      aria-label={ariaLabel}
      aria-disabled={disabled || currentStatus === 'loading'}
      variants={containerVariants}
      initial="idle"
      animate={currentStatus === 'error' ? 'error' : currentStatus === 'success' ? 'success' : 'idle'}
      whileHover={!disabled && currentStatus !== 'loading' ? 'hover' : undefined}
      whileTap={!disabled && currentStatus !== 'loading' ? 'tap' : undefined}
      className={`
        relative inline-flex items-center justify-center font-medium
        outline-none select-none transition-colors duration-200
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f19]
        focus-visible:ring-indigo-400 active:outline-none
        overflow-hidden cursor-pointer
        ${sizeClasses}
        ${getVariantStyles()}
        ${className}
      `}
    >
      {/* Background ambient glow pulse on loading/success */}
      <AnimatePresence>
        {currentStatus === 'loading' && (
          <motion.div
            key="loading-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: isReducedMotion ? 0.1 : [0.15, 0.35, 0.15] }}
            exit={{ opacity: 0 }}
            transition={isReducedMotion ? { duration: 0.1 } : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/30 to-indigo-500/20 pointer-events-none rounded-inherit"
          />
        )}
        {currentStatus === 'success' && (
          <motion.div
            key="success-glow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-emerald-400/20 pointer-events-none rounded-inherit"
          />
        )}
      </AnimatePresence>

      {/* Animated content slot with cross-fade & compositor sliding */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentStatus}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 inline-flex items-center justify-center gap-2"
        >
          {/* Icon state rendering */}
          {currentStatus === 'loading' ? (
            <Loader2
              className={`w-4 h-4 text-indigo-300 ${
                isReducedMotion ? 'opacity-80' : 'animate-spin'
              }`}
              aria-hidden="true"
            />
          ) : currentStatus === 'success' ? (
            <motion.div
              initial={isReducedMotion ? {} : { scale: 0.5, rotate: -20 }}
              animate={isReducedMotion ? {} : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" aria-hidden="true" />
            </motion.div>
          ) : currentStatus === 'error' ? (
            <motion.div
              initial={isReducedMotion ? {} : { rotate: -45 }}
              animate={isReducedMotion ? {} : { rotate: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-300" aria-hidden="true" />
            </motion.div>
          ) : (
            <>
              {icon === 'sparkles' && (
                <Sparkles className="w-4 h-4 text-indigo-200 transition-transform group-hover:rotate-12" aria-hidden="true" />
              )}
              {icon === 'arrow' && (
                <ArrowUp className="w-4 h-4 text-slate-200" aria-hidden="true" />
              )}
              {icon === 'brain' && (
                <Brain className="w-4 h-4 text-violet-200" aria-hidden="true" />
              )}
            </>
          )}

          {/* Text label rendering */}
          {currentLabelText() && (
            <span className="font-semibold tracking-wide whitespace-nowrap">
              {currentLabelText()}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

export default BrainButton;
