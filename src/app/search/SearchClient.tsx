'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ALL_GAMES } from '@/lib/data/games';

// All searchable static pages.
const PAGES = [
  { title: 'Number Generator', description: 'Generate random lottery numbers for any European lottery game', href: '/number-generator', keywords: ['generator', 'random', 'numbers', 'pick'] },
  { title: 'Results Checker', description: 'Check your lottery numbers against recent draw results', href: '/results-checker', keywords: ['check', 'checker', 'verify', 'results', 'ticket'] },
  { title: 'Hot & Cold Numbers', description: 'View the most and least frequently drawn lottery numbers', href: '/hot-cold-numbers', keywords: ['hot', 'cold', 'frequency', 'statistics', 'common'] },
  { title: 'Statistics', description: 'Comprehensive lottery statistics and number analysis', href: '/statistics', keywords: ['statistics', 'stats', 'analysis', 'data'] },
  { title: 'Predictions', description: 'AI-powered lottery number predictions based on statistical analysis', href: '/predictions', keywords: ['predictions', 'predict', 'forecast', 'ai'] },
  { title: 'Jackpot Tracker', description: 'Track current jackpot amounts across all European lotteries', href: '/jackpot-tracker', keywords: ['jackpot', 'tracker', 'prize', 'amount', 'money'] },
  { title: 'Blog', description: 'Latest lottery news, analysis, and tips', href: '/blog', keywords: ['blog', 'news', 'articles', 'tips'] },
  { title: 'FAQ', description: 'Frequently asked questions about European lotteries', href: '/faq', keywords: ['faq', 'questions', 'help', 'how'] },
  { title: 'About Us', description: 'Learn about Euro Lotto Results', href: '/about', keywords: ['about', 'who', 'team'] },
  { title: 'Contact', description: 'Get in touch with us', href: '/contact', keywords: ['contact', 'email', 'support', 'help'] },
  { title: 'Privacy Policy', description: 'Our privacy policy and data handling practices', href: '/privacy-policy', keywords: ['privacy', 'data', 'policy', 'gdpr'] },
  { title: 'Responsible Gaming', description: 'Information about responsible gambling practices', href: '/responsible-gaming', keywords: ['responsible', 'gambling', 'gaming', 'help', 'addiction'] },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const query = q.toLowerCase().trim();

  const gameResults = query
    ? ALL_GAMES.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.slug.includes(query) ||
          game.country.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query)
      ).map((game) => ({
        title: `${game.flag} ${game.name} Results`,
        description: game.description,
        href: `/${game.slug}`,
        type: 'lottery' as const,
      }))
    : [];

  const pageResults = query
    ? PAGES.filter(
        (page) =>
          page.title.toLowerCase().includes(query) ||
          page.description.toLowerCase().includes(query) ||
          page.keywords.some((kw) => kw.includes(query))
      ).map((page) => ({
        ...page,
        type: 'page' as const,
      }))
    : [];

  const howToPlayResults = query && (query.includes('how') || query.includes('play') || query.includes('rules'))
    ? ALL_GAMES.map((game) => ({
        title: `How to Play ${game.name}`,
        description: `Learn the rules and how to play ${game.name}`,
        href: `/how-to-play/${game.slug}`,
        type: 'guide' as const,
      }))
    : [];

  const allResults = [...gameResults, ...pageResults, ...howToPlayResults];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Search Results</h1>
        {query && (
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            {allResults.length} result{allResults.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
          </p>
        )}

        {!query && (
          <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Enter a search term to find lottery results, games, tools, and information.
            </p>
            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Popular Searches</h2>
              <div className="flex flex-wrap gap-2">
                {['EuroMillions', 'EuroJackpot', 'UK Lotto', 'predictions', 'hot numbers', 'jackpot'].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {query && allResults.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-800">
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
              No results found for &ldquo;{q}&rdquo;
            </p>
            <p className="mb-6 text-gray-500 dark:text-gray-500">
              Try searching for a lottery name, tool, or topic.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Go to Homepage
            </Link>
          </div>
        )}

        {allResults.length > 0 && (
          <div className="space-y-4">
            {allResults.map((result) => (
              <Link
                key={result.href}
                href={result.href}
                className="block rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {result.type === 'lottery' ? 'Lottery' : result.type === 'guide' ? 'Guide' : 'Tool'}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {result.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{result.description}</p>
                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      euromillionsresults.co.uk{result.href}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Internal linking section */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Lotteries</h3>
              <ul className="space-y-1">
                {ALL_GAMES.slice(0, 5).map((game) => (
                  <li key={game.slug}>
                    <Link href={`/${game.slug}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                      {game.flag} {game.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-white">More Lotteries</h3>
              <ul className="space-y-1">
                {ALL_GAMES.slice(5).map((game) => (
                  <li key={game.slug}>
                    <Link href={`/${game.slug}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                      {game.flag} {game.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Tools & Resources</h3>
              <ul className="space-y-1">
                {PAGES.slice(0, 6).map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
