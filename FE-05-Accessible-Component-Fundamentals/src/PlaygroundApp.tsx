import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Keyboard,
  Info,
  Layers,
  Code2,
  Sparkles,
  Terminal,
  FileText,
  AlertTriangle,
  ArrowRightLeft,
  Eye,
  Settings2,
  BookOpen
} from 'lucide-react';

// Import Manual Components
import { Modal, Tabs, Disclosure } from './playground';
import { TabItem, FocusLogEntry } from './types';

// Import shadcn Components
import {
  ShadcnDialog,
  ShadcnDialogTrigger,
  ShadcnDialogContent,
  ShadcnDialogHeader,
  ShadcnDialogTitle,
  ShadcnDialogDescription,
  ShadcnDialogFooter,
  ShadcnDialogClose,
} from './components/ui/dialog';

import {
  ShadcnTabs,
  ShadcnTabsList,
  ShadcnTabsTrigger,
  ShadcnTabsContent,
} from './components/ui/tabs';

export default function PlaygroundApp() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'playground' | 'comparison' | 'inspector' | 'notes'>('playground');

  // Modal Playground State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closeOnBackdrop, setCloseOnBackdrop] = useState(true);
  const [useInitialFocus, setUseInitialFocus] = useState(false);
  const inputInModalRef = useRef<HTMLInputElement>(null);

  // Tabs Playground State
  const [activeTab, setActiveTab] = useState('profile');
  const [tabOrientation, setTabOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [tabActivationMode, setTabActivationMode] = useState<'automatic' | 'manual'>('automatic');

  // Disclosure Playground State
  const [isDisclosure1Open, setIsDisclosure1Open] = useState(false);
  const [isDisclosure2Open, setIsDisclosure2Open] = useState(true);

  // Focus Inspector & Event Logging State
  const [logs, setLogs] = useState<FocusLogEntry[]>([]);
  const [currentActiveElement, setCurrentActiveElement] = useState<string>('None');

  // Log event helper
  const addLog = (
    component: FocusLogEntry['component'],
    eventType: FocusLogEntry['eventType'],
    target: string,
    details: string
  ) => {
    const newEntry: FocusLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      component,
      eventType,
      target,
      details,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  // Monitor document.activeElement focus changes
  useEffect(() => {
    const handleFocusChange = () => {
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase();
        const id = activeEl.id ? `#${activeEl.id}` : '';
        const role = activeEl.getAttribute('role') ? `[role="${activeEl.getAttribute('role')}"]` : '';
        const label = activeEl.textContent?.substring(0, 20).trim() || '';
        const desc = `${tag}${id}${role}${label ? ` ("${label}")` : ''}`;
        setCurrentActiveElement(desc);
      }
    };

    window.addEventListener('focusin', handleFocusChange);
    return () => window.removeEventListener('focusin', handleFocusChange);
  }, []);

  // Monitor Global Keydown for Live Keyboard Testing Verification
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (['tab', 'escape', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'enter', ' '].includes(e.key.toLowerCase())) {
        addLog(
          'Modal',
          'keydown',
          activeTag || 'body',
          `Pressed Key: "${e.key}" (Shift: ${e.shiftKey})`
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Header Navigation Tabs Items
  const mainNavTabItems: TabItem[] = [
    {
      id: 'playground',
      label: (
        <span className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Manual Playground
        </span>
      ),
      content: null,
    },
    {
      id: 'comparison',
      label: (
        <span className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          shadcn Comparison
        </span>
      ),
      content: null,
    },
    {
      id: 'inspector',
      label: (
        <span className="flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          Focus Inspector
        </span>
      ),
      content: null,
    },
    {
      id: 'notes',
      label: (
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          NOTES.md
        </span>
      ),
      content: null,
    },
  ];

  // Sample Tab Items for Manual Tabs
  const tabItems: TabItem[] = [
    {
      id: 'profile',
      label: 'User Profile',
      badge: 'Active',
      content: (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            User Account Settings
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This tab panel is linked via <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono text-xs">aria-labelledby</code> to its triggering tab button. Try pressing <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-xs rounded border">Tab</kbd> to focus inside this panel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Alex Johnson"
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="alex.johnson@example.com"
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'accessibility',
      label: 'Accessibility Preferences',
      badge: 'W3C',
      content: (
        <div className="space-y-3">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
            Accessibility & ARIA Verification
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Roving tabindex ensures only the selected tab button receives initial focus (<code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-emerald-600 dark:text-emerald-400">tabIndex=0</code>), while all inactive tabs have <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-amber-600 dark:text-amber-400">tabIndex=-1</code>.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              High Contrast Focus Indicators
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              Screen Reader Live Announcements
            </label>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      badge: 3,
      content: (
        <div className="space-y-2">
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
            System Alerts & Messages
          </h4>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-sm rounded-lg border border-blue-200 dark:border-blue-900">
            3 unread security alerts pending review.
          </div>
        </div>
      ),
    },
    {
      id: 'disabled-tab',
      label: 'Disabled Tab',
      disabled: true,
      content: <div>Disabled Tab Content</div>,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md">
                FE-05
              </span>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Accessible Component Fundamentals
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              W3C ARIA Authoring Practices (APG) manual implementations vs. Radix/shadcn UI
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="w-full md:w-auto">
            <Tabs
              items={mainNavTabItems}
              activeTabId={activeView}
              onTabChange={(id) => {
                setActiveView(id as 'playground' | 'comparison' | 'inspector' | 'notes');
                addLog('Tabs', 'select', `View #${id}`, `Navigated header view to ${id}`);
              }}
              ariaLabel="Main Application View Tabs"
              activationMode="automatic"
              orientation="horizontal"
            />
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* VIEW 1: MANUAL PLAYGROUND */}
        {activeView === 'playground' && (
          <div className="space-y-10">
            {/* Banner Overview */}
            <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-slate-950/40 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-xl shadow-md shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    FE-05 Manual Accessible Components Playground
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Test the three manually implemented accessible components built strictly from scratch according to W3C ARIA Authoring Practices patterns without third-party component libraries.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> No Component Library
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> W3C APG Compliant
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Strict TypeScript Types (No <code className="font-mono text-xs">any</code>)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* COMPONENT 1: MODAL DIALOG */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                      1. Modal Dialog
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Accessible Modal Dialog
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Features portal rendering, focus trapping, initial focus targeting, focus restoration, and Escape dismissal.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                      addLog('Modal', 'open', 'Trigger Button', 'Opened manual modal dialog');
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  >
                    Open Manual Modal
                  </button>
                </div>
              </div>

              {/* Modal Configuration Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-slate-400" /> Close on Backdrop Click
                  </span>
                  <button
                    type="button"
                    onClick={() => setCloseOnBackdrop(!closeOnBackdrop)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      closeOnBackdrop
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {closeOnBackdrop ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-400" /> Focus Custom Input on Open
                  </span>
                  <button
                    type="button"
                    onClick={() => setUseInitialFocus(!useInitialFocus)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      useInitialFocus
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {useInitialFocus ? 'Target Ref' : 'First Element'}
                  </button>
                </div>
              </div>

              {/* Keyboard Verification Checklist */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4" /> Modal Accessibility Checklist & Keyboard Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border font-mono">Escape</kbd>
                    <span>Closes Modal</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border font-mono">Tab</kbd>
                    <span>Trapped Inside</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                    <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border font-mono">Shift+Tab</kbd>
                    <span>Reverse Trapped</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Restore</span>
                    <span>Focus on Trigger</span>
                  </div>
                </div>
              </div>

              {/* The Manual Modal Component Instance */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  addLog('Modal', 'close', 'Modal Close Event', 'Closed manual modal dialog');
                }}
                title="W3C ARIA Accessible Modal Dialog"
                description="This dialog implements focus trapping, Escape dismissal, and focus restoration to the triggering button."
                closeOnBackdropClick={closeOnBackdrop}
                initialFocusRef={useInitialFocus ? inputInModalRef : undefined}
              >
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Try pressing <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border">Tab</kbd> repeatedly. Notice how focus wraps from the last button back to the close button without escaping to the background web page.
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2 border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Interactive Text Input
                    </label>
                    <input
                      ref={inputInModalRef}
                      type="text"
                      placeholder="Focus target when Initial Focus Ref is enabled..."
                      className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2 border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Secondary Input Element
                    </label>
                    <input
                      type="text"
                      placeholder="Second focusable element in loop..."
                      className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        addLog('Modal', 'close', 'Confirm Button', 'Confirmed action in modal');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      Save & Close
                    </button>
                  </div>
                </div>
              </Modal>
            </section>

            {/* COMPONENT 2: MANUAL TABS */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-mono font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                      2. Tabs Pattern
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Accessible Tabs Component
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Features roving tabindex, keyboard navigation (ArrowLeft, ArrowRight, Home, End), and W3C tab panel relationship bindings.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="text-slate-500 dark:text-slate-400">Orientation:</span>
                  <button
                    type="button"
                    onClick={() => setTabOrientation('horizontal')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      tabOrientation === 'horizontal'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Horizontal
                  </button>
                  <button
                    type="button"
                    onClick={() => setTabOrientation('vertical')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      tabOrientation === 'vertical'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Vertical
                  </button>

                  <span className="text-slate-500 dark:text-slate-400 ml-3">Activation:</span>
                  <button
                    type="button"
                    onClick={() => setTabActivationMode('automatic')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      tabActivationMode === 'automatic'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Automatic
                  </button>
                  <button
                    type="button"
                    onClick={() => setTabActivationMode('manual')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      tabActivationMode === 'manual'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Manual (Enter/Space)
                  </button>
                </div>
              </div>

              {/* Keyboard Instruction Banner */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Tabs Keyboard Controls:</strong> Focus any tab button and use <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">←</kbd> and <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">→</kbd> (or <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">↓</kbd> in vertical mode) to navigate between tabs. Use <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">Home</kbd> / <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded font-mono">End</kbd> to jump to the first/last tab. Disabled tabs are skipped automatically.
                </div>
              </div>

              {/* The Manual Tabs Component Instance */}
              <Tabs
                items={tabItems}
                activeTabId={activeTab}
                onTabChange={(id) => {
                  setActiveTab(id);
                  addLog('Tabs', 'select', `Tab #${id}`, `Switched active tab to ${id}`);
                }}
                ariaLabel="User Settings Categories"
                orientation={tabOrientation}
                activationMode={tabActivationMode}
              />
            </section>

            {/* COMPONENT 3: DISCLOSURE / ACCORDION */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-mono font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                    3. Disclosure Pattern
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Accessible Disclosure Component
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Button-based toggle with aria-expanded state and aria-controls linking.
                </p>
              </div>

              <div className="space-y-4">
                <Disclosure
                  title="W3C ARIA Disclosure Specification Summary"
                  subtitle="Click or press Space/Enter to expand specifications"
                  isOpen={isDisclosure1Open}
                  onToggle={(open) => {
                    setIsDisclosure1Open(open);
                    addLog('Disclosure', 'toggle', 'Disclosure #1', `Toggled open=${open}`);
                  }}
                >
                  <div className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      A disclosure is a button that controls the visibility of a section of content.
                    </p>
                    <ul className="list-disc list-inside space-y-1 font-mono text-slate-700 dark:text-slate-300">
                      <li>Trigger is a native <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">&lt;button&gt;</code> element</li>
                      <li>Contains <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">aria-expanded="true|false"</code></li>
                      <li>Contains <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">aria-controls="panel-id"</code> matching panel element <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">id="panel-id"</code></li>
                      <li>Native keyboard support: <kbd className="px-1 bg-white dark:bg-slate-800 border rounded">Enter</kbd> or <kbd className="px-1 bg-white dark:bg-slate-800 border rounded">Space</kbd> toggles expansion</li>
                    </ul>
                  </div>
                </Disclosure>

                <Disclosure
                  title="Keyboard Testing Instructions for Disclosure"
                  subtitle="Detailed keyboard navigation rules"
                  isOpen={isDisclosure2Open}
                  onToggle={(open) => {
                    setIsDisclosure2Open(open);
                    addLog('Disclosure', 'toggle', 'Disclosure #2', `Toggled open=${open}`);
                  }}
                >
                  <div className="space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded border">Tab</kbd> to focus the button above. The browser will render a visible focus ring around the button header. Pressing <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded border">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded border">Enter</kbd> toggles the collapsible region immediately.
                    </p>
                  </div>
                </Disclosure>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SHADCN SIDE-BY-SIDE COMPARISON */}
        {activeView === 'comparison' && (
          <div className="space-y-8">
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold">Manual APG Implementation vs. Radix / shadcn UI</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Side-by-side comparison showcasing how our manual component implementation behaves alongside the industry-standard shadcn UI primitives built on Radix UI.
                  </p>
                </div>
              </div>
            </div>

            {/* DIALOG COMPARISON GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* MANUAL MODAL COLUMN */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded">
                    MANUAL IMPLEMENTATION
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Modal.tsx</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Manual ARIA Modal Dialog
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Built from scratch with React hooks (<code className="font-mono">useRef</code>, <code className="font-mono">useEffect</code>, <code className="font-mono">useId</code>) and <code className="font-mono">createPortal</code>.
                </p>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-lg shadow-xs transition-colors"
                >
                  Test Manual Modal Dialog
                </button>

                <div className="text-xs space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Implementation Highlights:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Explicit DOM queries for focusable elements</li>
                    <li>Manual event listener for Tab key wrap-around</li>
                    <li>Stored ref to activeElement for focus restoration</li>
                  </ul>
                </div>
              </div>

              {/* SHADCN DIALOG COLUMN */}
              <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded">
                    SHADCN / RADIX UI
                  </span>
                  <span className="text-xs text-slate-500 font-mono">dialog.tsx</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  shadcn/ui Dialog Component
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Powered by <code className="font-mono">@radix-ui/react-dialog</code> with built-in FocusScope and FocusGuards.
                </p>

                <ShadcnDialog>
                  <ShadcnDialogTrigger asChild>
                    <button
                      type="button"
                      onClick={() => addLog('shadcn-Dialog', 'open', 'Trigger', 'Opened shadcn dialog')}
                      className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                    >
                      Test shadcn/ui Dialog
                    </button>
                  </ShadcnDialogTrigger>
                  <ShadcnDialogContent>
                    <ShadcnDialogHeader>
                      <ShadcnDialogTitle>shadcn/ui Radix Dialog</ShadcnDialogTitle>
                      <ShadcnDialogDescription>
                        This component utilizes Radix UI primitives with automated screen reader focus guards, scroll locking compensation, and focus boundary protection.
                      </ShadcnDialogDescription>
                    </ShadcnDialogHeader>
                    <div className="py-2 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Radix UI automatically inserts invisible focus guard elements before and after portal content to catch browser tabbing before focus escapes to the address bar.
                      </p>
                      <input
                        type="text"
                        placeholder="Radix Dialog text input..."
                        className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <ShadcnDialogFooter>
                      <ShadcnDialogClose asChild>
                        <button
                          type="button"
                          className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg"
                        >
                          Close shadcn Dialog
                        </button>
                      </ShadcnDialogClose>
                    </ShadcnDialogFooter>
                  </ShadcnDialogContent>
                </ShadcnDialog>

                <div className="text-xs space-y-2 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900">
                  <div className="font-semibold text-blue-900 dark:text-blue-300">Radix Architecture Advantage:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Synthetic FocusGuard DOM nodes to prevent address bar escape</li>
                    <li>Automatic scrollbar width compensation (`react-remove-scroll`)</li>
                    <li>Unmounted trigger safe restoration via internal context stack</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* TABS COMPARISON GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* MANUAL TABS COLUMN */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded">
                    MANUAL IMPLEMENTATION
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Tabs.tsx</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Manual Tabs Component
                </h3>

                <Tabs
                  items={[
                    { id: 'm1', label: 'Overview', content: <div className="text-xs text-slate-600 dark:text-slate-300">Manual Overview Panel Content</div> },
                    { id: 'm2', label: 'Details', content: <div className="text-xs text-slate-600 dark:text-slate-300">Manual Details Panel Content</div> },
                  ]}
                  ariaLabel="Manual Comparison Tabs"
                />
              </div>

              {/* SHADCN TABS COLUMN */}
              <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded">
                    SHADCN / RADIX UI
                  </span>
                  <span className="text-xs text-slate-500 font-mono">tabs.tsx</span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  shadcn/ui Tabs Component
                </h3>

                <ShadcnTabs defaultValue="s1" className="w-full">
                  <ShadcnTabsList className="w-full grid grid-cols-2">
                    <ShadcnTabsTrigger value="s1">Overview</ShadcnTabsTrigger>
                    <ShadcnTabsTrigger value="s2">Details</ShadcnTabsTrigger>
                  </ShadcnTabsList>
                  <ShadcnTabsContent value="s1" className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                    shadcn Overview Panel Content
                  </ShadcnTabsContent>
                  <ShadcnTabsContent value="s2" className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                    shadcn Details Panel Content
                  </ShadcnTabsContent>
                </ShadcnTabs>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FOCUS INSPECTOR & LIVE LOGS */}
        {activeView === 'inspector' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-600" />
                  Live Focus & Keyboard Interaction Inspector
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Monitors active focus targets, keyboard events, and component state changes in real time.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setLogs([])}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Clear Log History
              </button>
            </div>

            {/* Currently Active Element Status Bar */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400">Currently Focused Element:</span>
              <span className="text-emerald-400 font-bold bg-slate-800 px-3 py-1 rounded border border-slate-700">
                {currentActiveElement}
              </span>
            </div>

            {/* Live Log Terminal Output */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 border border-slate-800 font-mono text-xs h-[400px] overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <div className="text-slate-500 text-center py-20 italic">
                  No interaction events logged yet. Interact with components or press Tab/Escape/Arrows to see live telemetry.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-900/60 hover:bg-slate-900/40 px-2 rounded">
                    <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                      log.component.startsWith('shadcn')
                        ? 'bg-purple-900/80 text-purple-200'
                        : 'bg-blue-900/80 text-blue-200'
                    }`}>
                      {log.component}
                    </span>
                    <span className="text-amber-400 font-semibold shrink-0">{log.eventType}</span>
                    <span className="text-slate-300 shrink-0">[{log.target}]</span>
                    <span className="text-slate-400 truncate">{log.details}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: NOTES.MD DOCUMENTATION VIEWER */}
        {activeView === 'notes' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    FE-05 Assignment Notes (NOTES.md)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Architectural comparison of accessibility gaps between manual implementations and Radix/shadcn UI.
                  </p>
                </div>
              </div>

              {/* GAP 1 */}
              <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <h3 className="text-base font-bold text-amber-900 dark:text-amber-300">
                    Gap 1: Advanced Focus Trapping, FocusGuards, and Browser Address Bar Escapes
                  </h3>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Manual Implementation Limitation:</strong> Our manual modal traps focus using a <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">KeyDown</code> event listener on the <kbd className="px-1 bg-white dark:bg-slate-800 border rounded">Tab</kbd> key. When the user tabs past the last focusable element, we call <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">event.preventDefault()</code> and focus the first element. However, if focus is unexpectedly shifted outside the modal via mouse drag, browser DevTools, or iframe switching, the manual listener can miss the blur event, causing focus to escape.
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>How Radix/shadcn Solves This:</strong> Radix UI renders synthetic, invisible guard elements (<code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">&lt;span tabIndex={0} aria-hidden="true" /&gt;</code>) immediately before and after the modal dialog tree. When a user tabs past the end of the dialog, browser focus hits the FocusGuard element first, triggering its <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">onFocus</code> callback and safely refocusing inside the dialog <em>before</em> focus can ever escape to the browser's native address bar or outside document.
                </p>
              </div>

              {/* GAP 2 */}
              <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <h3 className="text-base font-bold text-blue-900 dark:text-blue-300">
                    Gap 2: Background Inertness, Screen Reader Tree Hiding, and Scroll Lock Shift
                  </h3>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Manual Implementation Limitation:</strong> While our manual modal sets <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">document.body.style.overflow = 'hidden'</code> to lock scrolling, background DOM elements outside the modal dialog remain visible to screen readers unless each individual sibling node is manually flagged with <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">aria-hidden="true"</code>. Furthermore, hiding the body scrollbar causes layout reflows (scrollbar shift).
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>How Radix/shadcn Solves This:</strong> Radix UI uses <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">aria-hidden</code> tree mutation observers (via <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">aria-hidden</code> package) to automatically mark all sibling DOM trees as inert, ensuring screen reader virtual cursor navigation is completely constrained to the modal dialog. Additionally, it uses <code className="font-mono text-xs bg-slate-200 dark:bg-slate-800 px-1 rounded">react-remove-scroll</code> to inject a padding compensation matching the exact measured scrollbar width to eliminate page layout jump.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
