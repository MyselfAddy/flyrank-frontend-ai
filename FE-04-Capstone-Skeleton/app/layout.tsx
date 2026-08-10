import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'FlyRank Capstone Skeleton — FE-04',
  description: 'Clean, minimal, production-ready Next.js capstone skeleton for FlyRank Frontend AI Engineering.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <Navigation />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>FlyRank Frontend AI Engineering — Phase: Foundations</span>
            <span>FE-04 Capstone Skeleton</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
