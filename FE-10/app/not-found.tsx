import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#0b0f19] text-center">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">404 - Page Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested interface could not be found.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors"
        >
          Return to Motion Showcase
        </Link>
      </div>
    </div>
  );
}
