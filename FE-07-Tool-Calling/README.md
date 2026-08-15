# FE-06 Streaming AI Chat Interface

A production-grade real-time streaming AI chat application built with **Next.js App Router**, **Vercel AI SDK**, and **Google Gemini AI**.

---

## Purpose & Overview

This project satisfies the **FE-06 Capstone** assignment by providing a clean, accessible, and responsive streaming chat interface with server-side AI model integration.

> **Provider Note**: Google Gemini (`gemini-3.6-flash`) is intentionally used as the primary model provider via `@ai-sdk/google` instead of Anthropic/Claude to eliminate paid API key requirements and leverage free tier access.

---

## Core Architecture

```
FE-06-Streaming-AI-Chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # Server streaming API route handler
│   ├── layout.tsx             # Root HTML layout & global CSS
│   ├── page.tsx               # Main page rendering <Chat />
│   ├── globals.css            # Tailwind CSS styles
│   ├── error.tsx              # Error boundary component
│   └── not-found.tsx          # 404 handler
├── components/
│   └── Chat.tsx               # Main streaming chat interface
├── lib/
│   └── ai.ts                  # Centralized Gemini provider, model & system prompt config
├── .env.example               # Template for environment variables
├── next.config.ts             # Next.js configuration
├── package.json               # NPM scripts & dependencies
└── tsconfig.json              # TypeScript configuration
```

### Centralized AI Configuration (`lib/ai.ts`)
- Configures the Gemini provider via `@ai-sdk/google`.
- Defines the active model ID (`gemini-3.6-flash`).
- Houses the centralized system prompt for assistant persona.
- Ensures the `GEMINI_API_KEY` is strictly accessed server-side and never exposed to the client.

### Server Route Handler (`app/api/chat/route.ts`)
- Handles `POST` requests containing message arrays.
- Invokes `streamText()` from `ai` using the centralized model configuration.
- Returns `result.toDataStreamResponse()` for Server-Sent Events (SSE) streaming.

### Client Component (`components/Chat.tsx`)
- Uses `useChat()` from `@ai-sdk/react`.
- Shows a thinking/loading indicator before the first token arrives.
- Renders streamed assistant text progressively without breaking partial markdown.
- Features a working **Stop** button during active streaming that:
  - Aborts stream generation.
  - Keeps partial response text intact.
  - Re-enables input immediately for subsequent turns.
- Auto-scrolls when user is near bottom, pauses auto-scroll when user scrolls up, and provides a **"Jump to latest"** control.
- Fully responsive from 375px mobile viewports to 1280px+ desktop screens.

---

## Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

*(Note: Never commit `.env.local` or real API keys to source control.)*

---

## Local Development Commands

Install dependencies:
```bash
npm install
```

Start dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

Run linter / type check:
```bash
npm run lint
```

---

## Key Verification Requirements

1. **Streaming**: Server route streams tokens progressively using `streamText`.
2. **Thinking Indicator**: Loading state visible before first token arrives.
3. **Stop Button**: Clicking Stop halts stream, retains partial text, re-enables input, and supports multi-turn continuation.
4. **Auto-Scroll**: Automatically follows bottom on streaming; manual scroll up stops auto-scroll; "Jump to latest" button returns to stream.
5. **Responsiveness**: Smooth layout at both 375px mobile and 1280px desktop.
