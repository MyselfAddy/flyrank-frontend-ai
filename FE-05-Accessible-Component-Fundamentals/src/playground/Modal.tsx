import React, { useEffect, useRef, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ModalProps } from '../types';

/**
 * Manual Modal Dialog built strictly to W3C ARIA Authoring Practices (APG) standards.
 * 
 * Features:
 * - Proper ARIA semantics: role="dialog", aria-modal="true", aria-labelledby, aria-describedby
 * - Focus Trap: Tab and Shift+Tab cycle within modal focusable elements
 * - Initial Focus: Focuses initialFocusRef, first focusable child, or dialog container
 * - Focus Restoration: Automatically restores focus to triggering element on close
 * - Keyboard: Escape key dismisses the dialog
 * - Portal: Renders via React Portal to prevent z-index/clipping issues
 * - Background Lock: Disables background scroll and provides backdrop overlay
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  closeOnBackdropClick = true,
  initialFocusRef,
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  // Selector for all focusable elements inside the dialog
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];
    const selectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const rawElements = Array.from(dialogRef.current.querySelectorAll(selectors));
    const elements = rawElements as HTMLElement[];
    return elements.filter((el) => {
      // Ensure element is visible and not display:none / visibility:hidden
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    });
  }, []);

  // Handle Modal Open & Focus Management
  useEffect(() => {
    if (!isOpen) return;

    // 1. Store currently focused trigger element for focus restoration on close
    if (document.activeElement instanceof HTMLElement) {
      triggerElementRef.current = document.activeElement;
    }

    // 2. Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Move focus into modal
    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusables = getFocusableElements();
        if (focusables.length > 0) {
          focusables[0].focus();
        } else if (dialogRef.current) {
          dialogRef.current.focus();
        }
      }
    }, 20);

    // Cleanup when closing
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;

      // 4. Restore focus back to triggering element on close
      if (triggerElementRef.current && document.contains(triggerElementRef.current)) {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen, initialFocusRef, getFocusableElements]);

  // Handle Keyboard Navigation (Escape to close, Tab for focus trap)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];
        const currentActive = document.activeElement;

        if (event.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (currentActive === firstElement || !dialogRef.current?.contains(currentActive)) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (currentActive === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose, getFocusableElements]
  );

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`relative w-full max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
