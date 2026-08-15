import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">404 - Page Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          The requested route or interface could not be found.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-2.5 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Return to Streaming Chat
        </Link>
      </div>
    </div>
  );
}
