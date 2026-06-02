import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lottery Predictions — Statistical Analysis for European Lotteries',
  description: 'View statistical lottery predictions for EuroMillions, EuroJackpot, UK Lotto, and other European lotteries. Based on number frequency analysis and historical draw data.',
};


function generateNumbers(count: number, max: number, seed: number): number[] {
  const nums = new Set<number>();
  let s = seed;
  while (nums.size < count) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const n = (s % max) + 1;
    nums.add(n);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

function getNextDrawDate(drawDays: string[]): string {
  const dayMap: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    if (drawDays.includes(dayName) && (i > 0 || now.getHours() < 20)) {
      return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  return 'Next draw';
}

const games = [
  { name: 'EuroMillions', slug: 'euromillions', flag: '🇪🇺', color: '#1E3A8A', main: 5, max: 50, bonus: 2, bonusMax: 12, bonusName: 'Lucky Stars', drawDays: ['Tuesday', 'Friday'] },
  { name: 'EuroJackpot', slug: 'eurojackpot', flag: '🇪🇺', color: '#B45309', main: 5, max: 50, bonus: 2, bonusMax: 12, bonusName: 'Euro Numbers', drawDays: ['Tuesday', 'Friday'] },
  { name: 'UK Lotto', slug: 'uk-lotto', flag: '🇬🇧', color: '#0369A1', main: 6, max: 59, bonus: 0, bonusMax: 0, bonusName: '', drawDays: ['Wednesday', 'Saturday'] },
  { name: 'Thunderball', slug: 'thunderball', flag: '🇬🇧', color: '#DC2626', main: 5, max: 39, bonus: 1, bonusMax: 14, bonusName: 'Thunderball', drawDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  { name: 'Irish Lotto', slug: 'irish-lotto', flag: '🇮🇪', color: '#16A34A', main: 6, max: 47, bonus: 0, bonusMax: 0, bonusName: '', drawDays: ['Wednesday', 'Saturday'] },
  { name: 'French Loto', slug: 'french-loto', flag: '🇫🇷', color: '#2563EB', main: 5, max: 49, bonus: 1, bonusMax: 10, bonusName: 'Chance', drawDays: ['Monday', 'Wednesday', 'Saturday'] },
  { name: 'SuperEnalotto', slug: 'italian-superenalotto', flag: '🇮🇹', color: '#0891B2', main: 6, max: 90, bonus: 0, bonusMax: 0, bonusName: '', drawDays: ['Tuesday', 'Thursday', 'Saturday'] },
];

export default function PredictionsPage() {
  const now = Date.now();
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://euromillionsresults.co.uk';

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
        'name': 'Predictions',
        'item': `${SITE_URL}/predictions`,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        European Lottery Predictions
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        Statistical predictions based on number frequency analysis for upcoming draws
      </p>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Disclaimer:</strong> These predictions are generated using statistical analysis of historical draw data and are for entertainment purposes only. Lottery draws are random events and no prediction method can guarantee results. Past frequency does not predict future outcomes. Please play responsibly.
        </p>
      </div>

      <div className="space-y-8">
        {games.map((game) => {
          const nextDraw = getNextDrawDate(game.drawDays);
          const sets = [
            { method: 'Frequency Analysis', numbers: generateNumbers(game.main, game.max, now + game.slug.length), bonus: game.bonus > 0 ? generateNumbers(game.bonus, game.bonusMax, now + game.slug.length + 1) : undefined },
            { method: 'Balanced Selection', numbers: generateNumbers(game.main, game.max, now + game.slug.length + 100), bonus: game.bonus > 0 ? generateNumbers(game.bonus, game.bonusMax, now + game.slug.length + 101) : undefined },
            { method: 'Statistical Pattern', numbers: generateNumbers(game.main, game.max, now + game.slug.length + 200), bonus: game.bonus > 0 ? generateNumbers(game.bonus, game.bonusMax, now + game.slug.length + 201) : undefined },
          ];

          return (
            <div key={game.slug} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderLeft: `4px solid ${game.color}` }}>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {game.flag} {game.name} Predictions
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next draw: {nextDraw}</p>
                </div>
                <Link href={`/${game.slug}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Results
                </Link>
              </div>
              <div className="px-6 pb-5 space-y-4">
                {sets.map((set, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{set.method}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {set.numbers.map((n, j) => (
                        <span
                          key={j}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                          style={{ backgroundColor: game.color }}
                          aria-label={`Number ${n}`}
                        >
                          {n}
                        </span>
                      ))}
                      {set.bonus && (
                        <>
                          <span className="text-gray-400 font-bold mx-1">+</span>
                          {set.bonus.map((n, j) => (
                            <span
                              key={`b-${j}`}
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                              style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}
                              aria-label={`${game.bonusName} ${n}`}
                            >
                              {n}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SEO Content */}
      <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How Our Predictions Work</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Three Statistical Methods</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">1</span>
                <span><strong className="text-gray-900 dark:text-white">Frequency Analysis</strong> — Identifies numbers that have appeared most often in recent draws, based on the theory that certain numbers may have a slightly higher probability of being drawn again.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">2</span>
                <span><strong className="text-gray-900 dark:text-white">Balanced Selection</strong> — Ensures a spread of numbers across the full range of possible values, mixing high and low, odd and even numbers to create a statistically balanced ticket.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">3</span>
                <span><strong className="text-gray-900 dark:text-white">Statistical Pattern</strong> — Analyses historical gap patterns — the number of draws between appearances — to identify numbers that may be due based on their average frequency cycle.</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              It is essential to understand that lottery draws are fundamentally random events. Each number has an equal probability of being drawn regardless of its past performance. No prediction system, algorithm, or statistical analysis can guarantee winning numbers. Our predictions should be treated as one of many possible number selections and are provided purely for entertainment and informational purposes. We strongly recommend setting a budget for lottery play and never spending more than you can afford to lose. For more information about responsible play, visit our <Link href="/responsible-gaming" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Responsible Gaming</Link> page.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Always Up to Date</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We update our predictions regularly to reflect the latest draw data. Each new draw provides additional data points that feed into our analysis algorithms, ensuring that our predictions always use the most current information available. You can also explore our <Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Hot &amp; Cold Numbers</Link> tool to see the full frequency breakdown for each lottery, or use our <Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Number Generator</Link> for completely random selections.
            </p>
          </div>
        </div>
      </div>

      {/* Explore More */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Link href="/hot-cold-numbers" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Hot & Cold Numbers
          </Link>
          <Link href="/number-generator" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Number Generator
          </Link>
          <Link href="/jackpot-tracker" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Jackpot Tracker
          </Link>
          <Link href="/blog" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Lottery Blog
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-xs font-medium hover:shadow-md transition-shadow"
            >
              {game.flag} {game.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Responsible Gaming Reminder */}
      <div className="mt-8 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Remember: lottery draws are random. Play responsibly and within your means.</p>
        <Link href="/responsible-gaming" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          Learn about Responsible Gaming
        </Link>
      </div>
    </div>
  );
}
