import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FE-AA1: Buttons with a Brain | Motion & State Micro-interactions',
  description: 'Production-grade accessible AI Send button with state machine micro-interactions (idle, loading, success, error, retry, disabled) and compositor-optimized animations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body className="h-full bg-[#0b0f19] text-slate-100 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
