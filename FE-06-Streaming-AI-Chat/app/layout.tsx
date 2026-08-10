import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Streaming AI Chat - FE-06',
  description: 'Real-time streaming AI chat interface powered by Google Gemini and Vercel AI SDK',
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
