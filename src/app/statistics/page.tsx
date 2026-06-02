import { Metadata } from 'next';
import Link from 'next/link';
import { ALL_GAMES } from '@/lib/data/games';
import { getHotNumbers, getColdNumbers, calculateFrequency, getResultsByGame } from '@/lib/data/draws';
import { SITE_URL } from '@/lib/data/seo';

export const metadata: Metadata = {
  title: 'Lottery Statistics & Analysis | Euro Lotto Results',
  description:
    'Comprehensive lottery statistics and number frequency analysis for all major European lotteries. View hot and cold numbers, frequency data, and historical trends for EuroMillions, EuroJackpot, UK Lotto, and more.',
  keywords: [
    'lottery statistics',
    'lottery number frequency',
    'euromillions statistics',
    'eurojackpot statistics',
    'hot numbers',
    'cold numbers',
    'lottery analysis',
    'number frequency',
    'lottery trends',
    'european lottery statistics',
  ],
};


export default function StatisticsPage() {
  // Gather stats for each game
  const gameStats = ALL_GAMES.map((game) => {
    const hot = getHotNumbers(game.slug, 5);
    const cold = getColdNumbers(game.slug, 5);
    const draws = getResultsByGame(game.slug, 100);
    return { game, hot, cold, totalDraws: draws.length };
  });

  // Overall stats
  const totalDrawsTracked = gameStats.reduce((sum, gs) => sum + gs.totalDraws, 0);
  const totalGames = ALL_GAMES.length;

  // Find the most common numbers across all games (aggregate frequency)
  const globalFreqMap: Record<number, number> = {};
  for (const game of ALL_GAMES) {
    const freqs = calculateFrequency(game.slug);
    for (const f of freqs) {
      globalFreqMap[f.number] = (globalFreqMap[f.number] || 0) + f.count;
    }
  }
  const globalTopNumbers = Object.entries(globalFreqMap)
    .map(([num, count]) => ({ number: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // FAQ data for schema
  const faqs = [
    {
      question: 'What are hot and cold numbers in lottery statistics?',
      answer:
        'Hot numbers are those that have been drawn most frequently in recent lottery draws, while cold numbers are those that appear less often than expected. Tracking these patterns can help players make informed choices, although every draw is an independent random event.',
    },
    {
      question: 'Can lottery statistics help me win?',
      answer:
        'Lottery statistics provide insight into historical patterns and number frequency, but they cannot predict future draws. Each lottery draw is a completely random event, and past results do not influence upcoming draws. Statistics are best used for entertainment and informed number selection rather than as a guaranteed strategy.',
    },
    {
      question: 'How often are the statistics updated?',
      answer:
        'Our statistics are updated after every draw for all 10 European lotteries we cover. This means frequency data, hot and cold number lists, and trend analysis reflect the most recent draw results available.',
    },
    {
      question: 'Which European lottery has the best odds of winning?',
      answer:
        'Among the major European lotteries, Thunderball offers some of the best odds for the top prize at approximately 1 in 8 million, compared to EuroMillions at 1 in 139 million or SuperEnalotto at 1 in 622 million. However, the odds vary by prize tier and each game offers different prize structures.',
    },
  ];

  return (
    <>
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Statistics',
                item: `${SITE_URL}/statistics`,
              },
            ],
          }),
        }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Lottery Statistics & Analysis
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto mb-8">
            Explore number frequency data, hot and cold numbers, and historical trends across all major European lotteries.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{totalGames}</p>
              <p className="text-sm text-purple-200">Lotteries Tracked</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">{totalDrawsTracked}</p>
              <p className="text-sm text-purple-200">Total Draws</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold">{Object.keys(globalFreqMap).length}</p>
              <p className="text-sm text-purple-200">Numbers Analysed</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Game Statistics Cards */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Statistics by Game
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {gameStats.map(({ game, hot, cold, totalDraws }) => (
            <div
              key={game.slug}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: game.color }}
                >
                  {game.shortName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                    {game.flag} {game.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {totalDraws} draws analysed &middot; {game.country}
                  </p>
                </div>
              </div>

              {/* Hot Numbers */}
              <div className="mb-3">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                  <span>🔥</span> Hot Numbers
                </p>
                <div className="flex flex-wrap gap-2">
                  {hot.map((freq) => (
                    <div
                      key={freq.number}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: game.color }}
                      title={`Drawn ${freq.count} times (${freq.percentage}%)`}
                    >
                      {freq.number}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cold Numbers */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
                  <span>❄️</span> Cold Numbers
                </p>
                <div className="flex flex-wrap gap-2">
                  {cold.map((freq) => (
                    <div
                      key={freq.number}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-500"
                      title={`Drawn ${freq.count} times (${freq.percentage}%)`}
                    >
                      {freq.number}
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href={`/${game.slug}`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: game.color }}
                >
                  View Results →
                </Link>
                <Link
                  href="/hot-cold-numbers"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:underline"
                >
                  Full Analysis →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Overall Statistics — Most Common Numbers Across All Games
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            These numbers appear most frequently when combining draw data from all {totalGames} European lotteries we track, spanning {totalDrawsTracked} total draws.
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {globalTopNumbers.map((entry, i) => (
              <div key={entry.number} className="text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    i < 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}
                >
                  {entry.number}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{entry.count}x</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Understanding Lottery Statistics and Number Frequency Analysis</h2>
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Lottery statistics provide a fascinating window into the patterns and distributions that emerge across thousands of draws. While every lottery draw is an independent random event governed by probability, analysing historical data can reveal interesting trends in number frequency, distribution patterns, and the relative &ldquo;temperature&rdquo; of individual numbers. At <strong className="text-gray-900 dark:text-white">Euro Lotto Results</strong>, we track and analyse draw data from ten major European lotteries, giving players a comprehensive overview of how numbers have performed over time.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Number frequency analysis</strong> is one of the most popular statistical tools used by lottery enthusiasts. By counting how often each number appears across a series of draws, we can identify hot numbers (those drawn more frequently than average) and cold numbers (those appearing less often). For example, in a standard 5-from-50 game like <strong className="text-gray-900 dark:text-white">EuroMillions</strong>, pure probability suggests each number should appear with roughly equal frequency over a large sample. However, in shorter sample windows of 10 to 50 draws, natural variance creates noticeable deviations that players find useful for inspiration when selecting their numbers.
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How Probability Works in European Lotteries</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Each European lottery operates under strict regulatory oversight with certified random number generators or mechanical ball machines. The odds of winning the jackpot vary significantly between games:
              </p>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Lottery</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">Jackpot Odds</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr><td className="px-4 py-2 text-gray-700 dark:text-gray-300">EuroMillions</td><td className="px-4 py-2 text-gray-600 dark:text-gray-400">1 in 139.8 million</td></tr>
                    <tr><td className="px-4 py-2 text-gray-700 dark:text-gray-300">EuroJackpot</td><td className="px-4 py-2 text-gray-600 dark:text-gray-400">1 in 95.3 million</td></tr>
                    <tr><td className="px-4 py-2 text-gray-700 dark:text-gray-300">UK Lotto</td><td className="px-4 py-2 text-gray-600 dark:text-gray-400">1 in 45 million</td></tr>
                    <tr><td className="px-4 py-2 text-gray-700 dark:text-gray-300">Thunderball</td><td className="px-4 py-2 text-gray-600 dark:text-gray-400">1 in 8 million</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                It is important to remember that the law of large numbers governs lottery outcomes. Over millions of draws, every number will converge toward an equal share of appearances. Short-term streaks, whether hot or cold, are a natural and expected feature of randomness rather than predictive signals. Responsible use of statistics means treating the data as an interesting perspective rather than a winning formula.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Using Our Statistics Tools</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span><Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Hot &amp; Cold Numbers</Link> — Detailed frequency breakdowns for each game with bar charts showing draw counts and last-drawn dates</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span><Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Predictions</Link> — Three statistically-informed number sets: hot-numbers, balanced mix, and overdue-numbers</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span><Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Number Generator</Link> — Truly random number combinations for any of the ten lotteries</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span><Link href="/jackpot-tracker" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Jackpot Tracker</Link> — Compare current jackpot sizes across all games at a glance</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">Responsible Gaming Reminder</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                While lottery statistics and analysis tools are entertaining and informative, they should never be treated as a guarantee of winning. All lottery games are forms of gambling, and players should only spend what they can afford to lose. If you feel that your lottery play is becoming problematic, please seek help from organisations such as GamCare or BeGambleAware. Play responsibly and enjoy the excitement of the draw without letting it become a financial burden.
              </p>
            </div>
          </div>
        </div>

        {/* Internal Links Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Link
              href="/hot-cold-numbers"
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
            >
              Hot & Cold Numbers
            </Link>
            <Link
              href="/predictions"
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
            >
              Predictions
            </Link>
            <Link
              href="/number-generator"
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
            >
              Number Generator
            </Link>
            <Link
              href="/jackpot-tracker"
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
            >
              Jackpot Tracker
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ALL_GAMES.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-xs font-medium hover:shadow-md transition-shadow"
              >
                {g.flag} {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
