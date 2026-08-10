import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 mb-4">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        The requested page does not exist in the FE-04 Capstone Skeleton.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Return to Home
      </Link>
    </div>
  );
}
