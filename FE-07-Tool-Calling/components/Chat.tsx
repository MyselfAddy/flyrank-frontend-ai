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
  Loader2,
} from 'lucide-react';

export default function Chat() {
  const {
    messages,
    input,
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
      console.error('Chat streaming error:', err);
    },
  });

  // Reference for the scrollable chat container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // State to track if auto-scroll should follow new messages/tokens
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

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
      lastMessage.content.trim() === '');

  // Reset conversation handler
  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-5xl mx-auto bg-slate-50 text-slate-900 overflow-hidden shadow-sm border-x border-slate-200" suppressHydrationWarning>
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
              FE-06 Streaming AI Chat
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                gemini-3.6-flash
              </span>
              <span>•</span>
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
            title="Clear conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </header>

      {/* Main Chat Stream Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 px-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Start a Streaming Conversation
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Experience real-time AI responses powered by Google Gemini and Vercel AI SDK. Type a prompt below to begin streaming.
            </p>

            <div className="grid grid-cols-1 gap-2 w-full text-left">
              {[
                'Explain how streaming server-sent events (SSE) work.',
                'Write a concise summary of Next.js App Router.',
                'Compare Client Components vs Server Components.',
              ].map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    append({
                      role: 'user',
                      content: promptText,
                    });
                  }}
                  className="p-3 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs text-slate-700 transition-all text-left shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  💡 &ldquo;{promptText}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          messages.map((message) => {
            const isUser = message.role === 'user';
            const isAssistant = message.role === 'assistant';

            // Skip rendering assistant placeholder if it's completely empty (handled by thinking indicator)
            if (isAssistant && message.content.trim() === '' && isLoading) {
              return null;
            }

            return (
              <div
                key={message.id}
                className={`flex gap-3 sm:gap-4 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                    isUser
                      ? 'bg-indigo-600'
                      : 'bg-slate-900 border border-slate-800'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  )}
                </div>

                {/* Message Content Bubble */}
                <div className="flex flex-col max-w-[85%] sm:max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {isUser ? 'You' : 'Gemini AI'}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words font-sans">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Thinking / First-Token Loading Indicator */}
        {isWaitingForFirstToken && (
          <div className="flex gap-3 sm:gap-4 max-w-3xl mr-auto">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 text-white shadow-2xs border border-slate-800">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700 mb-1 px-1">
                Gemini AI
              </span>
              <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-sm flex items-center gap-2 shadow-2xs">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-slate-500 font-medium text-xs">
                  Thinking... preparing stream
                </span>
              </div>
            </div>
          </div>
        )}

        {/* API Error Notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Streaming Error:</strong> {error.message || 'Failed to receive stream response.'}
              </span>
            </div>
            <button
              onClick={() => reload()}
              className="px-2.5 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Floating "Jump to Latest" Button */}
      {!isAtBottom && (
        <div className="relative z-20 flex justify-center pointer-events-none">
          <button
            onClick={() => scrollToBottom('smooth')}
            className="absolute -top-12 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-full shadow-lg hover:bg-indigo-600 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Jump to latest</span>
          </button>
        </div>
      )}

      {/* Input Form & Controls */}
      <footer className="p-3 sm:p-4 bg-white border-t border-slate-200 z-10">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <div className="relative flex items-end bg-slate-50 border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl transition-all shadow-2xs">
            <textarea
              name="prompt"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    const form = e.currentTarget.form;
                    if (form) form.requestSubmit();
                  }
                }
              }}
              placeholder="Ask anything... (Press Enter to send, Shift+Enter for newline)"
              rows={1}
              className="w-full py-3 pl-4 pr-14 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none min-h-[48px] max-h-32"
            />

            {/* Action Buttons: Send or Stop */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs cursor-pointer"
                  title="Stop generating response"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-all shadow-2xs disabled:cursor-not-allowed cursor-pointer"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500">
            <span>Powered by Vercel AI SDK & Gemini API</span>
            <span className="hidden sm:inline">Shift + Enter for new line</span>
          </div>
        </form>
      </footer>
    </div>
  );
}
