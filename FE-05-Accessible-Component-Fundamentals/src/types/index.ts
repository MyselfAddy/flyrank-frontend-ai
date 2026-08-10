import React from 'react';

/**
 * Modal Component Props Interface
 */
export interface ModalProps {
  /** Controls whether the modal dialog is visible */
  isOpen: boolean;
  /** Callback fired when the user requests closing the modal (Escape, backdrop, close button) */
  onClose: () => void;
  /** Accessible title for the modal dialog (used by aria-labelledby) */
  title: string;
  /** Optional accessible description for the modal dialog (used by aria-describedby) */
  description?: string;
  /** Content rendered inside the modal body */
  children: React.ReactNode;
  /** Whether clicking the dark backdrop closes the modal (defaults to true) */
  closeOnBackdropClick?: boolean;
  /** Optional reference to an element inside the modal that should receive focus on open */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Custom class names for styling wrapper */
  className?: string;
}

/**
 * Tab Item definition for Tabs component
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Tab button label / content */
  label: React.ReactNode;
  /** Tab panel content */
  content: React.ReactNode;
  /** Whether the tab is disabled and unselectable */
  disabled?: boolean;
  /** Optional badge or counter display */
  badge?: string | number;
}

/**
 * Tabs Component Props Interface
 */
export interface TabsProps {
  /** List of tabs and their corresponding panel contents */
  items: TabItem[];
  /** Initially selected tab ID (uncontrolled) */
  defaultTabId?: string;
  /** Currently selected tab ID (controlled) */
  activeTabId?: string;
  /** Callback fired when tab selection changes */
  onTabChange?: (tabId: string) => void;
  /** Accessible label for the tablist group */
  ariaLabel: string;
  /** Automatic activation (focus selects tab) vs Manual (focus requires Enter/Space to select) */
  activationMode?: 'automatic' | 'manual';
  /** Visual & navigation orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Additional custom class names */
  className?: string;
}

/**
 * Disclosure Component Props Interface
 */
export interface DisclosureProps {
  /** The clickable title/header of the disclosure toggle button */
  title: React.ReactNode;
  /** The collapsible panel content */
  children: React.ReactNode;
  /** Default open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Controlled open state */
  isOpen?: boolean;
  /** Callback when expansion state toggles */
  onToggle?: (isOpen: boolean) => void;
  /** Optional static base ID for ARIA linking */
  id?: string;
  /** Additional container styling */
  className?: string;
  /** Optional subtitle or metadata */
  subtitle?: React.ReactNode;
}

/**
 * Focus Event Log Entry for Playground Testing
 */
export interface FocusLogEntry {
  id: string;
  timestamp: string;
  component: 'Modal' | 'Tabs' | 'Disclosure' | 'shadcn-Dialog' | 'shadcn-Tabs';
  eventType: 'focus' | 'keydown' | 'open' | 'close' | 'toggle' | 'select';
  target: string;
  details: string;
}
