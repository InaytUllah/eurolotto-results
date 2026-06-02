import { Metadata } from 'next';
import Link from 'next/link';
import { getToolSEO } from '@/lib/data/seo';
import { ALL_GAMES } from '@/lib/data/games';
import { getLatestResultByGame } from '@/lib/data/draws';

const seo = getToolSEO('Jackpot Tracker', 'Track all European lottery jackpots in one place. Compare EuroMillions, EuroJackpot, and other EU lottery jackpot amounts.');
export const metadata: Metadata = { title: seo.title, description: seo.description };

export default function JackpotTrackerPage() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://euromillionsresults.co.uk';

  const jackpots = ALL_GAMES.map((game) => {
    const result = getLatestResultByGame(game.slug);
    return {
      game,
      jackpot: result?.nextJackpot || result?.jackpot || 'TBA',
      nextDraw: result?.nextDrawDate || 'TBA',
      lastResult: result,
    };
  }).sort((a, b) => {
    const aVal = parseInt((a.jackpot).replace(/[^0-9]/g, '')) || 0;
    const bVal = parseInt((b.jackpot).replace(/[^0-9]/g, '')) || 0;
    return bVal - aVal;
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': SITE_URL,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Jackpot Tracker',
        'item': `${SITE_URL}/jackpot-tracker`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'European Lottery Jackpots',
    'itemListElement': jackpots.map(({ game, jackpot }, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': game.name,
      'url': `${SITE_URL}/${game.slug}`,
      'description': `${game.name} jackpot: ${jackpot}`,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        European Jackpot Tracker
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        All European lottery jackpots at a glance — sorted by prize amount
      </p>

      <div className="space-y-4">
        {jackpots.map(({ game, jackpot, nextDraw }) => (
          <Link
            key={game.slug}
            href={`/${game.slug}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{ backgroundColor: game.color }}
              >
                {game.shortName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">{game.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{game.country}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{jackpot}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Next Draw: {nextDraw !== 'TBA' ? new Date(nextDraw + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBA'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">About the Jackpot Tracker</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Our jackpot tracker shows estimated jackpot amounts for all major European lotteries.
          Jackpot values are updated after each draw. The amounts shown are estimates and may change
          based on ticket sales. Always check official lottery websites for confirmed jackpot amounts.
        </p>
      </div>
    </div>
  );
}
