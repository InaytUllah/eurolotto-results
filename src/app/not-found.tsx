import Link from 'next/link';

const lotteryGames = [
  { name: 'EuroMillions', slug: 'euromillions', flag: '\u{1F1EA}\u{1F1FA}' },
  { name: 'EuroJackpot', slug: 'eurojackpot', flag: '\u{1F1EA}\u{1F1FA}' },
  { name: 'UK Lotto', slug: 'uk-lotto', flag: '\u{1F1EC}\u{1F1E7}' },
  { name: 'Thunderball', slug: 'thunderball', flag: '\u{1F1EC}\u{1F1E7}' },
  { name: 'Set for Life', slug: 'set-for-life', flag: '\u{1F1EC}\u{1F1E7}' },
  { name: 'Irish Lotto', slug: 'irish-lotto', flag: '\u{1F1EE}\u{1F1EA}' },
  { name: 'French Loto', slug: 'french-loto', flag: '\u{1F1EB}\u{1F1F7}' },
  { name: 'La Primitiva', slug: 'spanish-lottery', flag: '\u{1F1EA}\u{1F1F8}' },
  { name: 'Lotto 6aus49', slug: 'german-lotto', flag: '\u{1F1E9}\u{1F1EA}' },
  { name: 'SuperEnalotto', slug: 'italian-superenalotto', flag: '\u{1F1EE}\u{1F1F9}' },
];

const tools = [
  { name: 'Number Generator', href: '/number-generator', description: 'Generate random lottery numbers' },
  { name: 'Results Checker', href: '/results-checker', description: 'Check your numbers against recent draws' },
  { name: 'Hot & Cold Numbers', href: '/hot-cold-numbers', description: 'Analyse number frequency data' },
  { name: 'Statistics', href: '/statistics', description: 'Comprehensive lottery statistics and analysis' },
  { name: 'Predictions', href: '/predictions', description: 'Statistical predictions for upcoming draws' },
  { name: 'Jackpot Tracker', href: '/jackpot-tracker', description: 'Track jackpots across all lotteries' },
];

export default function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black text-blue-900 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Sorry, the page you are looking for does not exist or has been moved. Euro Lotto Results is your
          source for the latest European lottery results, number analysis tools, and jackpot information.
          Use the links below to find what you need.
        </p>
        <Link href="/" className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
          Go to Homepage
        </Link>
      </div>

      {/* Lottery Results */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Lottery Results</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {lotteryGames.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all"
            >
              <span aria-hidden="true">{game.flag}</span>
              <span className="truncate">{game.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Lottery Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all"
            >
              <p className="font-medium text-gray-900 dark:text-white">{tool.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Other helpful links */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">More Pages</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/blog" className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
            Blog
          </Link>
          <Link href="/faq" className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
            FAQ
          </Link>
          <Link href="/responsible-gaming" className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
            Responsible Gaming
          </Link>
          <Link href="/about" className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
            About Us
          </Link>
        </div>
      </section>

      {/* SEO Text */}
      <div className="prose dark:prose-invert max-w-none text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Euro Lotto Results provides the latest winning numbers, draw results, and jackpot information for
          all major European lotteries including EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life,
          Irish Lotto, French Loto, La Primitiva, Lotto 6aus49, and SuperEnalotto. Use our free tools to
          generate random numbers, view hot and cold number statistics, check predictions, and track jackpots
          across every game.
        </p>
      </div>
    </div>
  );
}
