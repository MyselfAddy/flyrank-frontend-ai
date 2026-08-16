'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Send,
  Square,
  ArrowDown,
  Sparkles,
  User,
  Bot,
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Bug,
  ChevronDown,
  ChevronUp,
  Globe,
  Zap,
  Terminal,
  Layers,
  Search,
} from 'lucide-react';
import ToolInvocationView from './ToolInvocationView';

export default function Chat() {
  const [inputWarning, setInputWarning] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [showDevTools, setShowDevTools] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error,
    setMessages,
    append,
  } = useChat({
    api: '/api/chat',
    onError: (err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Chat Stream Notice]:', err?.message || err);
      }
    },
  });

  // Keep inputValue in sync with useChat's input
  const currentInput = input || inputValue;

  // Reference for the scrollable chat container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // State to track if auto-scroll should follow new messages/tokens
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  // Clear warning when input changes
  const onInputChangeWrapper = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (inputWarning) {
      setInputWarning(null);
    }
    setInputValue(e.target.value);
    handleInputChange(e);
    setInput(e.target.value);
  };

  // Safe submit wrapper validating empty/whitespace-only input
  const handleSafeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textToSend = currentInput.trim();
    if (!textToSend) {
      setInputWarning('Please enter a message before sending.');
      return;
    }
    setInputWarning(null);
    setIsAtBottom(true);
    if (append) {
      append({
        role: 'user',
        content: textToSend,
      });
      setInput('');
      setInputValue('');
    } else {
      handleSubmit(e);
    }
  };

  // Safe retry handler to prevent duplicate triggers
  const handleRetry = useCallback(async () => {
    if (isLoading || isRetrying) return;
    setIsRetrying(true);
    setIsAtBottom(true);
    try {
      await reload();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Chat Retry Notice]:', err);
      }
    } finally {
      setIsRetrying(false);
    }
  }, [isLoading, isRetrying, reload]);

  // Function to handle scroll events in the message container
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Threshold of 80px from bottom to consider "at bottom"
    const threshold = 80;
    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const nearBottom = distanceToBottom <= threshold;
    setIsAtBottom(nearBottom);
  }, []);

  // Function to jump to the latest message
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
      setIsAtBottom(true);
    }
  }, []);

  // Auto-scroll when messages update or streaming tokens arrive, if user is at bottom
  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, isAtBottom]);

  // Determine if assistant is generating and we are waiting for the first token
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken =
    isLoading &&
    (!lastMessage ||
      lastMessage.role !== 'assistant' ||
      (lastMessage.content.trim() === '' &&
        (!lastMessage.toolInvocations || lastMessage.toolInvocations.length === 0)));

  // Mid-stream failure detection: error occurred while last message was a non-empty assistant response
  const isMidStreamFailure =
    Boolean(error) &&
    lastMessage?.role === 'assistant' &&
    lastMessage.content.trim().length > 0;

  // Rate-limit detection
  const isRateLimit =
    Boolean(error) &&
    (error?.message?.includes('429') ||
      error?.message?.toLowerCase().includes('rate limit') ||
      error?.message?.toLowerCase().includes('quota') ||
      error?.message?.includes('RESOURCE_EXHAUSTED') ||
      error?.message?.toLowerCase().includes('busy'));

  // Reset conversation handler
  const handleClearChat = useCallback(() => {
    setMessages([]);
    setInputWarning(null);
    setIsAtBottom(true);
  }, [setMessages]);

  return (
    <div
      className="flex flex-col h-[100dvh] w-full max-w-5xl mx-auto bg-slate-50/90 text-slate-900 overflow-hidden shadow-xl border-x border-slate-200/80 backdrop-blur-xs font-sans"
      suppressHydrationWarning
    >
      {/* Sleek App Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/90 z-10 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                FE-09 Streaming AI Chat
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <Globe className="w-2.5 h-2.5" />
                Tool Calling Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 mt-0.5">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                gemini-3.5-flash
              </span>
              <span className="text-slate-300">•</span>
              <span className="truncate">{messages.length} messages</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Dev Test Scenario Toggle (Only visible in development) */}
          {process.env.NODE_ENV !== 'production' && (
            <button
              type="button"
              onClick={() => setShowDevTools((prev) => !prev)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-xl border border-amber-200/90 transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              title="Toggle Dev Error Simulator"
              aria-label="Toggle Development Error Simulators"
            >
              <Bug className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dev Tests</span>
              {showDevTools ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              title="Clear conversation"
              aria-label="Clear chat conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* Dev Testing Simulation Bar (Development Only) */}
      {process.env.NODE_ENV !== 'production' && showDevTools && (
        <div
          role="region"
          aria-label="Development testing tools"
          className="bg-amber-50/95 border-b border-amber-200 px-3.5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 z-10 shrink-0 animate-in fade-in"
        >
          <div className="flex items-center gap-1.5 font-semibold">
            <Bug className="w-4 h-4 text-amber-600" />
            <span>Dev Test Harness:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={isLoading || isRetrying}
              onClick={() => {
                setIsAtBottom(true);
                append(
                  { role: 'user', content: 'Test generic 500 error response' },
                  { body: { devSimulateError: 'generic' } }
                );
              }}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-md font-medium text-amber-800 disabled:opacity-50 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Trigger 500
            </button>
            <button
              type="button"
              disabled={isLoading || isRetrying}
              onClick={() => {
                setIsAtBottom(true);
                append(
                  { role: 'user', content: 'Test 429 rate-limit response' },
                  { body: { devSimulateError: 'rate_limit' } }
                );
              }}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-md font-medium text-amber-800 disabled:opacity-50 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Trigger 429
            </button>
            <button
              type="button"
              disabled={isLoading || isRetrying}
              onClick={() => {
                setIsAtBottom(true);
                append(
                  { role: 'user', content: 'Test mid-stream failure simulation' },
                  { body: { devSimulateError: 'mid_stream' } }
                );
              }}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-md font-medium text-amber-800 disabled:opacity-50 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Mid-Stream Drop
            </button>
            <button
              type="button"
              disabled={isLoading || isRetrying}
              onClick={() => {
                setIsAtBottom(true);
                append({
                  role: 'user',
                  content: 'Analyze https://example.com and provide an audit summary.',
                });
              }}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-md font-medium text-indigo-800 disabled:opacity-50 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Test Tool Calling
            </button>
            <button
              type="button"
              disabled={isLoading || isRetrying}
              onClick={() => {
                setIsAtBottom(true);
                append({
                  role: 'user',
                  content: 'Analyze not-a-valid-url-test',
                });
              }}
              className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 rounded-md font-medium text-rose-800 disabled:opacity-50 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              Test Tool Error
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Stream Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 scroll-smooth min-h-0"
      >
        {messages.length === 0 ? (
          /* Empty / Onboarding State */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
            <div className="relative mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-indigo-500 to-violet-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Streaming Chat with Tool Calling
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md leading-relaxed">
              Real-time token streaming with Google Gemini, full multi-step tool execution (<code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">analyzeWebsite</code>), and resilient error recovery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
              {[
                {
                  tag: 'Tool Calling',
                  icon: Globe,
                  color: 'indigo',
                  title: 'Audit Website URL',
                  desc: 'Analyze https://example.com and inspect metadata, SEO & security.',
                },
                {
                  tag: 'Domain Security',
                  icon: Zap,
                  color: 'violet',
                  title: 'Security & Protocol',
                  desc: 'Analyze https://github.com to evaluate HTTPS compliance.',
                },
                {
                  tag: 'Web Architecture',
                  icon: Terminal,
                  color: 'emerald',
                  title: 'Server-Sent Events',
                  desc: 'Explain how streaming Server-Sent Events (SSE) work.',
                },
                {
                  tag: 'React Deep-Dive',
                  icon: Layers,
                  color: 'amber',
                  title: 'RSC vs Client',
                  desc: 'Compare React Server Components with Client Components.',
                },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsAtBottom(true);
                      append({
                        role: 'user',
                        content: item.desc,
                      });
                    }}
                    className="p-3.5 bg-white hover:bg-indigo-50/40 active:bg-indigo-100/50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label={`Prompt example: ${item.title}`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <IconComponent className="w-3 h-3" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-indigo-600">
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform text-xs">
                        →
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700 mb-0.5">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed [overflow-wrap:anywhere]">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message List */
          messages.map((message, index) => {
            const isUser = message.role === 'user';
            const isAssistant = message.role === 'assistant';
            const isLastMessage = index === messages.length - 1;
            const hasToolInvocations = Boolean(
              message.toolInvocations && message.toolInvocations.length > 0
            );
            const hasContent = message.content.trim().length > 0;

            // Skip rendering assistant placeholder if it has neither content nor tool invocations
            if (isAssistant && !hasContent && !hasToolInvocations && isLoading) {
              return null;
            }

            return (
              <div
                key={message.id || `msg-${index}`}
                className={`flex gap-2.5 sm:gap-3.5 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                    isUser
                      ? 'bg-gradient-to-tr from-indigo-600 to-violet-600'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                  aria-hidden="true"
                >
                  {isUser ? (
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-400" />
                  )}
                </div>

                {/* Message Content & Tool Invocations */}
                <div className="flex flex-col max-w-[92%] sm:max-w-[85%] min-w-0 space-y-2">
                  <div
                    className={`flex items-center gap-2 mb-0.5 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-700">
                      {isUser ? 'You' : 'Gemini AI Assistant'}
                    </span>
                  </div>

                  {/* Render Tool Invocations (Lifecycle States 1, 2, 3, 4) */}
                  {isAssistant && hasToolInvocations && (
                    <div className="space-y-2.5 w-full">
                      {message.toolInvocations!.map((invocation) => (
                        <ToolInvocationView
                          key={invocation.toolCallId}
                          invocation={invocation}
                        />
                      ))}
                    </div>
                  )}

                  {/* Message Content Bubble (when text content exists) */}
                  {hasContent && (
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-xs shadow-indigo-600/10'
                          : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs shadow-slate-200/50'
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-sans">
                        {message.content}
                      </div>

                      {/* Mid-stream Failure Notice attached to the partial assistant bubble */}
                      {isAssistant && isLastMessage && isMidStreamFailure && (
                        <div
                          role="alert"
                          className="mt-3 pt-2.5 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-800"
                        >
                          <div className="flex items-center gap-1.5 font-medium min-w-0">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>
                              <strong className="font-semibold">Stream interrupted.</strong>{' '}
                              <span>Partial response preserved.</span>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRetry}
                            disabled={isLoading || isRetrying}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0"
                            aria-label="Retry generating interrupted response"
                          >
                            <RotateCcw className={`w-3 h-3 ${isRetrying ? 'animate-spin motion-reduce:animate-none' : ''}`} />
                            <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Thinking / First-Token Loading Indicator */}
        {isWaitingForFirstToken && (
          <div
            role="status"
            aria-live="polite"
            className="flex gap-2.5 sm:gap-3.5 max-w-3xl mr-auto"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 text-white shadow-2xs border border-slate-800">
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-400 animate-pulse motion-reduce:animate-none" />
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 mb-1 px-1">
                Gemini AI Assistant
              </span>
              <div className="bg-white text-slate-700 border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm flex items-center gap-2.5 shadow-2xs">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin motion-reduce:animate-none shrink-0" />
                <span className="text-slate-600 font-medium text-xs">
                  Thinking... preparing stream
                </span>
              </div>
            </div>
          </div>
        )}

        {/* API Error Notification Banner */}
        {error && !isMidStreamFailure && (
          <div
            role="alert"
            className={`p-4 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs border ${
              isRateLimit
                ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                : 'bg-rose-50/90 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              {isRateLimit ? (
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
              )}
              <div className="min-w-0">
                <strong className="font-semibold block sm:inline">
                  {isRateLimit
                    ? 'Service temporarily busy'
                    : 'Something went wrong'}
                </strong>{' '}
                <span className="break-words">
                  {isRateLimit
                    ? 'The AI service is temporarily rate-limited. Please wait a moment and try again.'
                    : "We couldn't generate a response right now. Please try again."}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              disabled={isLoading || isRetrying}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs focus-visible:outline-none focus-visible:ring-2 ${
                isRateLimit
                  ? 'bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500'
                  : 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500'
              }`}
              aria-label="Retry response generation"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin motion-reduce:animate-none' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
            </button>
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Floating "Jump to Latest" Button */}
      {!isAtBottom && (
        <div className="relative z-20 flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={() => scrollToBottom('smooth')}
            className="absolute -top-12 pointer-events-auto flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-slate-900/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Jump to latest message"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Jump to latest</span>
          </button>
        </div>
      )}

      {/* Input Form & Composer */}
      <footer className="p-3.5 sm:p-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-10 shrink-0">
        <form onSubmit={handleSafeSubmit} className="relative max-w-4xl mx-auto">
          {/* Quick Tool Shortcut Chips */}
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Quick Actions:
            </span>
            <button
              type="button"
              onClick={() => {
                const val = 'Analyze https://example.com and check SEO score.';
                setInput(val);
                setInputValue(val);
                setInputWarning(null);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer"
            >
              <Search className="w-3 h-3" />
              <span>Audit example.com</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const val = 'Analyze https://github.com';
                setInput(val);
                setInputValue(val);
                setInputWarning(null);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>Audit github.com</span>
            </button>
          </div>

          {/* Accessible validation message for empty inputs */}
          {inputWarning && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-2 text-xs font-medium text-rose-600 flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{inputWarning}</span>
            </div>
          )}

          <div className="relative flex items-end bg-slate-50/90 border border-slate-300/90 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white rounded-2xl transition-all shadow-2xs">
            <textarea
              id="chat-prompt-input"
              name="prompt"
              value={currentInput}
              onChange={onInputChangeWrapper}
              onInput={(e) => {
                const val = e.currentTarget.value;
                setInputValue(val);
                setInput(val);
                if (inputWarning) setInputWarning(null);
              }}
              aria-label="Chat prompt message"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!currentInput.trim()) {
                    setInputWarning('Please enter a message before sending.');
                    return;
                  }
                  if (!isLoading) {
                    const form = e.currentTarget.form;
                    if (form) form.requestSubmit();
                  }
                }
              }}
              placeholder="Ask anything or request a website audit... (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="w-full py-3.5 pl-4 pr-18 sm:pr-24 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none min-h-[48px] max-h-32 leading-relaxed font-sans"
            />

            {/* Action Buttons: Send or Stop */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  title="Stop generating response"
                  aria-label="Stop generating response"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!currentInput.trim()}
                  className="p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl transition-all shadow-2xs disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 px-1 text-[10px] sm:text-[11px] text-slate-500">
            <span className="truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              <span>FE-07 Streaming Tool Calling Engine</span>
            </span>
            <span className="hidden sm:inline shrink-0">Shift + Enter for newline</span>
          </div>
        </form>
      </footer>
    </div>
  );
}
