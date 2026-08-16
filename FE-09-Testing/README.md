# FE-09 Streaming AI Chat with Tool Calling

A production-grade streaming AI chat application with tool calling, website audit analysis, comprehensive edge-case handling, and resilient recovery built with **Next.js App Router**, **Vercel AI SDK**, and **Google Gemini AI**.

---

## Purpose & Overview

This project implements the **FE-09** specification:
- Real-time token streaming with Gemini.
- Server-side tool execution with structured typed returns.
- Full 4-state tool calling lifecycle visualization.
- Production error resilience and recovery (FE-08 edge-case handling, Stop/Retry, rate limits, 500s, and mid-stream failure recovery).
- Strongly typed without TypeScript `any` escapes.

> **Provider Configuration**: Google Gemini (`gemini-3.5-flash`) is used as the primary model provider via `@ai-sdk/google` with server-side API key protection.

---

## FE-09 Tool Contract

### Tool: `analyzeWebsite`

Analyzes the supplied website URL using the application's structured analysis tool to calculate domain security metrics, estimated SEO benchmarks, accessibility scores, and an executive summary.

#### Input:
```json
{
  "url": "string"
}
```

#### Validation:
- Validated via Zod schema (`analyzeWebsiteInputSchema`) and runtime URL parsing.
- Requires valid `http://` or `https://` protocol.
- Gracefully handles and reports invalid or malformed URL inputs.

#### Return Shape:
```json
{
  "url": "string",
  "domain": "string",
  "title": "string",
  "description": "string",
  "https": true,
  "seoScore": 86,
  "accessibilityScore": 82,
  "summary": "string"
}
```

#### Execution & Safety:
- **Server-Side Execution**: Runs exclusively in Node.js server environment; no client credentials or secrets are exposed.
- **Structured Typed Data**: Outputs strongly typed `WebsiteAnalysisOutput` (`WebsiteAnalysisResult` or `WebsiteAnalysisError`).
- **Resilience**: Tool errors do not crash the route handler or application session.
- **Client Rendering**: Transitions across 4 distinct lifecycle states without displaying raw JSON or stack traces.

---

## Four Tool Lifecycle UI States

1. **Input Streaming (`partial-call`)**: Displayed when the model is constructing tool arguments. Shows an animated "Preparing website analysis" indicator.
2. **Input Available (`call`)**: Displayed when input parameters are validated and the server-side audit is executing. Displays target URL and active "Analyzing" badge.
3. **Output Available (`result`)**: Rendered as a dedicated, fully styled `WebsiteAnalysisCard` component with visual score progress meters (clamped 0–100), HTTPS security badge, metadata tags, and an executive summary.
4. **Output Error (`result` with error)**: Dedicated calm failure card ("Website analysis couldn't be completed") with actionable advice, preserving conversation continuity.

---

## Core Architecture

```
FE-07-Streaming-AI-Chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts              # Server streaming API route handler with tool calling
│   ├── layout.tsx                    # Root HTML layout & global CSS
│   ├── page.tsx                      # Main page rendering <Chat />
│   ├── globals.css                   # Tailwind CSS styles
│   ├── error.tsx                     # Error boundary component
│   └── not-found.tsx                 # 404 handler
├── components/
│   ├── Chat.tsx                      # Main chat component (streaming, auto-scroll, Stop/Retry)
│   ├── ToolInvocationView.tsx        # 4-state lifecycle renderer for tool invocations
│   └── WebsiteAnalysisCard.tsx       # Dedicated structured audit result component
├── lib/
│   ├── ai.ts                         # Centralized Gemini provider, model & system prompt config
│   └── tools/
│       └── analyzeWebsite.ts         # Server-side analyzeWebsite tool & Zod schema
├── .env.example                      # Template for environment variables
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & build scripts
└── tsconfig.json                     # TypeScript configuration
```

---

## Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

*(Note: `GEMINI_API_KEY` is server-only. Never expose it with `NEXT_PUBLIC_` or commit real keys to source control.)*

---

## Local Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production build
npm run start
```
