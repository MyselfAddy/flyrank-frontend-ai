import React, { useState, useRef, useId, useCallback } from 'react';
import { TabsProps } from '../types';

/**
 * Manual Tabs Component built strictly according to W3C ARIA Authoring Practices (APG).
 * 
 * Features:
 * - ARIA Semantics: role="tablist", role="tab", role="tabpanel"
 * - ARIA Relationships: aria-controls and aria-labelledby dynamically bound
 * - Roving Tabindex: Active tab has tabIndex={0}, inactive tabs have tabIndex={-1}
 * - Keyboard Navigation: ArrowRight, ArrowLeft, Home, End keys move focus
 * - Activation Modes: Supports 'automatic' (focus selects tab) and 'manual' (Enter/Space selects tab)
 * - Orientation: Supports horizontal and vertical orientations
 */
export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTabId,
  activeTabId,
  onTabChange,
  ariaLabel,
  activationMode = 'automatic',
  orientation = 'horizontal',
  className = '',
}) => {
  const baseId = useId();
  const tabListRef = useRef<HTMLDivElement>(null);

  // Uncontrolled state fallback
  const [internalActiveId, setInternalActiveId] = useState<string>(() => {
    if (defaultTabId && items.some((item) => item.id === defaultTabId)) {
      return defaultTabId;
    }
    const firstEnabled = items.find((item) => !item.disabled);
    return firstEnabled ? firstEnabled.id : items[0]?.id || '';
  });

  const selectedTabId = activeTabId !== undefined ? activeTabId : internalActiveId;

  const selectTab = useCallback(
    (id: string) => {
      const targetItem = items.find((item) => item.id === id);
      if (targetItem?.disabled) return;

      if (activeTabId === undefined) {
        setInternalActiveId(id);
      }
      onTabChange?.(id);
    },
    [activeTabId, items, onTabChange]
  );

  const getEnabledTabs = useCallback(() => {
    return items.filter((item) => !item.disabled);
  }, [items]);

  const focusTabByIndex = (index: number) => {
    if (!tabListRef.current) return;
    const rawButtons = Array.from(
      tabListRef.current.querySelectorAll('[role="tab"]:not([disabled])')
    );
    const tabButtons = rawButtons as HTMLButtonElement[];
    if (tabButtons[index]) {
      tabButtons[index].focus();
      if (activationMode === 'automatic') {
        const targetId = tabButtons[index].getAttribute('data-tab-id');
        if (targetId) {
          selectTab(targetId);
        }
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const enabledItems = getEnabledTabs();
    if (enabledItems.length === 0) return;

    // Find closest tab element from target or activeElement
    const targetEl =
      (event.target as HTMLElement)?.closest('[data-tab-id]') ||
      (document.activeElement as HTMLElement)?.closest('[data-tab-id]');
    
    const currentFocusedId = targetEl?.getAttribute('data-tab-id');
    const currentIndex = enabledItems.findIndex((item) => item.id === currentFocusedId);

    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    const isNextKey = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const isPrevKey = event.key === 'ArrowLeft' || event.key === 'ArrowUp';

    if (isNextKey) {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % enabledItems.length;
      focusTabByIndex(nextIndex);
    } else if (isPrevKey) {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
      focusTabByIndex(nextIndex);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTabByIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTabByIndex(enabledItems.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (currentFocusedId) {
        event.preventDefault();
        selectTab(currentFocusedId);
      }
    }
  };

  const firstFocusableId =
    items.find((i) => i.id === selectedTabId && !i.disabled)?.id ||
    items.find((i) => !i.disabled)?.id ||
    items[0]?.id;

  return (
    <div className={`w-full ${orientation === 'vertical' ? 'flex gap-6' : 'space-y-4'} ${className}`}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className={`flex ${
          orientation === 'vertical'
            ? 'flex-col border-r border-slate-200 dark:border-slate-800 pr-4 min-w-[180px] gap-1'
            : 'flex-row border-b border-slate-200 dark:border-slate-800 gap-2'
        }`}
      >
        {items.map((item) => {
          const isSelected = item.id === selectedTabId;
          const isFocusable = item.id === firstFocusableId;
          const tabId = `tab-${baseId}-${item.id}`;
          const panelId = `panel-${baseId}-${item.id}`;

          return (
            <button
              key={item.id}
              id={tabId}
              type="button"
              role="tab"
              data-tab-id={item.id}
              aria-selected={isSelected}
              aria-controls={panelId}
              disabled={item.disabled}
              tabIndex={isFocusable ? 0 : -1}
              onClick={() => selectTab(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 ${
                item.disabled
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : isSelected
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-sans ${
                    isSelected
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {items.some((item) => item.content !== null && item.content !== undefined) && (
        <div className="flex-1">
          {items.map((item) => {
            const isSelected = item.id === selectedTabId;
            const tabId = `tab-${baseId}-${item.id}`;
            const panelId = `panel-${baseId}-${item.id}`;

            if (item.content === null || item.content === undefined) return null;

            return (
              <div
                key={item.id}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                tabIndex={0}
                hidden={!isSelected}
                className={`p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected ? 'animate-in fade-in-50 duration-150' : ''
                }`}
              >
                {isSelected && item.content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
