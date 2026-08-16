import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FE-07 Streaming AI Chat with Tool Calling',
  description: 'Production-grade streaming AI chat with real-time tool calling and website audit analysis powered by Google Gemini and Vercel AI SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full bg-slate-50 text-slate-900 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
