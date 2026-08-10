import React, { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { DisclosureProps } from '../types';

/**
 * Manual Disclosure Component built strictly to W3C ARIA Authoring Practices (APG).
 * 
 * Features:
 * - Trigger: <button type="button"> with aria-expanded and aria-controls
 * - Content: Container element with matching id and hidden state
 * - Keyboard Accessibility: Native button handling for Space / Enter keys
 * - Accessible state binding: Dynamically communicates collapsed/expanded state to AT
 */
export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  subtitle,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  id: customId,
  className = '',
}) => {
  const generatedId = useId();
  const baseId = customId || generatedId;
  const buttonId = `disclosure-button-${baseId}`;
  const contentId = `disclosure-content-${baseId}`;

  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const nextState = !isOpen;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(nextState);
    }
    onToggle?.(nextState);
  };

  return (
    <div className={`border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all ${className}`}>
      {/* Header / Trigger Button */}
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
      >
        <div className="flex flex-col pr-4">
          <span className="text-base font-medium text-slate-900 dark:text-slate-100">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Collapsible Content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`p-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/50 ${
          isOpen ? 'animate-in fade-in-50 duration-150' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};
