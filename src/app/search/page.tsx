import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search for European lottery results, games, tools, and information.',
};

// Static export: the page is a server-rendered shell; SearchClient (client
// component) reads ?q= via useSearchParams() and runs the filter in the
// browser. No server-side searchParams reading — incompatible with export.
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchClient />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Search Results</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading…</p>
      </div>
    </div>
  );
}
