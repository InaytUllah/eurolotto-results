import { Metadata } from 'next';
import Link from 'next/link';
import { getHomeSEO } from '@/lib/data/seo';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import { ALL_GAMES } from '@/lib/data/games';
import ResultCard from '@/components/ResultCard';
import Countdown from '@/components/Countdown';

const seo = getHomeSEO();
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
};


export default async function HomePage() {
  // Fetch latest results for all games in parallel
  const allResults = await Promise.all(
    ALL_GAMES.map(async (game) => {
      const results = await fetchLotteryResults(game.slug);
      return { game, result: results[0] || null };
    })
  );

  const euroMillionsResult = allResults.find((r) => r.game.slug === 'euromillions')?.result;
  const euroJackpotResult = allResults.find((r) => r.game.slug === 'eurojackpot')?.result;

  const allLatest = allResults.filter((item) => item.result);

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
                item: process.env.NEXT_PUBLIC_SITE_URL || 'https://euromillionsresults.co.uk',
              },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              European Lottery Results
            </h1>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Check the latest EuroMillions, EuroJackpot, Thunderball, and all major European lottery results in one place.
            </p>
          </div>

          {/* Featured Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {euroMillionsResult && (
              <ResultCard
                result={euroMillionsResult}
                gameConfig={ALL_GAMES.find((g) => g.slug === 'euromillions')}
                featured
              />
            )}
            {euroJackpotResult && (
              <ResultCard
                result={euroJackpotResult}
                gameConfig={ALL_GAMES.find((g) => g.slug === 'eurojackpot')}
                featured
              />
            )}
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Countdown
            drawTime="20:45"
            timezone="Europe/Paris"
            label="Next EuroMillions"
            color="#1E3A8A"
          />
          <Countdown
            drawTime="21:00"
            timezone="Europe/Helsinki"
            label="Next EuroJackpot"
            color="#B45309"
          />
          <Countdown
            drawTime="20:15"
            timezone="Europe/London"
            label="Next Thunderball"
            color="#DC2626"
          />
          <Countdown
            drawTime="20:00"
            timezone="Europe/London"
            label="Next Set for Life"
            color="#059669"
          />
        </div>
      </section>

      {/* All Lottery Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Latest Results from All Lotteries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allLatest.map(({ game, result }) =>
            result ? (
              <ResultCard key={game.slug} result={result} gameConfig={game} />
            ) : null
          )}
        </div>
      </section>

      {/* Lottery Games Overview */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            European Lotteries We Cover
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_GAMES.map((game) => (
              <Link
                key={game.slug}
                href={`/${game.slug}`}
                className="group block rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: game.color }}
                  >
                    {game.shortName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-xs text-gray-500">{game.country}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{game.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Draws: {game.drawDays.join(', ')} at {game.drawTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lottery Comparison Table */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Compare European Lotteries at a Glance
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-8">
            Not sure which European lottery to play? Compare jackpot sizes, ticket prices, odds, and draw schedules for all 10 major European lotteries side by side to find the game that suits you best.
          </p>
          <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Game</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Numbers Format</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Draw Days</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Jackpot Odds</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Min Jackpot</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Max Jackpot</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Ticket Price</th>
                </tr>
              </thead>
              <tbody>
                {ALL_GAMES.map((game, index) => {
                  const format = game.bonusBalls
                    ? `${game.mainNumbers.count}/${game.mainNumbers.max} + ${game.bonusBalls.count}/${game.bonusBalls.max}`
                    : `${game.mainNumbers.count}/${game.mainNumbers.max}`;
                  return (
                    <tr
                      key={game.slug}
                      className={`${
                        index % 2 === 0
                          ? 'bg-white dark:bg-gray-900'
                          : 'bg-gray-50 dark:bg-gray-800'
                      } hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap border-l-4" style={{ borderLeftColor: game.color }}>
                        <Link
                          href={`/${game.slug}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {game.flag} {game.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 font-mono text-xs">
                        {format}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {game.drawDays.join(', ')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {game.odds}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {game.minJackpot}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700 dark:text-gray-300 font-semibold">
                        {game.maxJackpot}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {game.ticketPrice}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Lottery Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/number-generator"
            className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 hover:shadow-xl transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-2">Number Generator</h3>
            <p className="text-blue-100 text-sm">Generate random numbers for any European lottery game.</p>
          </Link>
          <Link
            href="/results-checker"
            className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-6 hover:shadow-xl transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-2">Results Checker</h3>
            <p className="text-indigo-100 text-sm">Check your numbers against recent draws to see if you have won.</p>
          </Link>
          <Link
            href="/hot-cold-numbers"
            className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 hover:shadow-xl transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-2">Hot & Cold Numbers</h3>
            <p className="text-amber-100 text-sm">Analyze number frequency and find the hottest and coldest numbers.</p>
          </Link>
          <Link
            href="/statistics"
            className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 hover:shadow-xl transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-2">Statistics & Analysis</h3>
            <p className="text-purple-100 text-sm">Comprehensive lottery statistics and number frequency analysis.</p>
          </Link>
          <Link
            href="/predictions"
            className="rounded-xl bg-gradient-to-br from-rose-500 to-red-700 text-white p-6 hover:shadow-xl transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-2">Predictions</h3>
            <p className="text-rose-100 text-sm">Data-driven number predictions based on frequency analysis.</p>
          </Link>
          <Link
            href="/jackpot-tracker"
            className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 text-white p-6 hover:shadow-xl transition-all duration-200"
          >
            <h3 className="text-xl font-bold mb-2">Jackpot Tracker</h3>
            <p className="text-emerald-100 text-sm">Track all European lottery jackpots in one place.</p>
          </Link>
        </div>
      </section>

      {/* Quick Answers Section (AEO-optimized) */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Quick Answers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What are tonight&apos;s EuroMillions results?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Visit our{' '}
                <Link href="/euromillions" className="text-blue-600 dark:text-blue-400 underline">
                  EuroMillions results page
                </Link>{' '}
                for the latest winning numbers, updated within minutes of every draw.
              </p>
            </article>
            <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What is the biggest EuroMillions jackpot?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The biggest EuroMillions jackpot is capped at <strong>&euro;240 million</strong>, which is the maximum allowed under current rules.
              </p>
            </article>
            <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                When is the next EuroMillions draw?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                EuroMillions draws are held every <strong>Tuesday and Friday at 8:45 PM CET</strong>. Check our countdown timers above for the exact time remaining.
              </p>
            </article>
            <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How many numbers do you pick in EuroMillions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You pick <strong>5 main numbers from 1 to 50</strong> and <strong>2 Lucky Stars from 1 to 12</strong>.
              </p>
            </article>
            <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What are the odds of winning EuroMillions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The odds of winning the EuroMillions jackpot are <strong>1 in 139,838,160</strong>. There are 13 prize tiers with better odds for smaller prizes.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SEO Content / FAQ Section */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What time are EuroMillions draws?</h3>
              <p className="text-gray-600 dark:text-gray-400">EuroMillions draws take place every Tuesday and Friday at 8:45 PM CET (Central European Time). Results are usually available within minutes of the draw.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Which countries can play EuroMillions?</h3>
              <p className="text-gray-600 dark:text-gray-400">EuroMillions is played in nine European countries: UK, France, Spain, Ireland, Portugal, Belgium, Austria, Luxembourg, and Switzerland.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What is the difference between EuroMillions and EuroJackpot?</h3>
              <p className="text-gray-600 dark:text-gray-400">Both are transnational European lotteries, but they are operated by different organisations and played in different countries. EuroMillions covers 9 Western European countries while EuroJackpot covers 18 mostly Northern and Eastern European countries.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How do I check my lottery results?</h3>
              <p className="text-gray-600 dark:text-gray-400">Simply visit our site after each draw to see the latest winning numbers. We update results within minutes of each draw for all major European lotteries.</p>
            </div>
          </div>

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'What time are EuroMillions draws?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'EuroMillions draws take place every Tuesday and Friday at 8:45 PM CET.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Which countries can play EuroMillions?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'EuroMillions is played in nine European countries: UK, France, Spain, Ireland, Portugal, Belgium, Austria, Luxembourg, and Switzerland.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the difference between EuroMillions and EuroJackpot?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Both are transnational European lotteries operated by different organisations and played in different countries.',
                    },
                  },
                ],
                speakable: {
                  '@type': 'SpeakableSpecification',
                  cssSelector: [
                    '.space-y-6 h3',
                    '.space-y-6 p',
                  ],
                },
              }),
            }}
          />
        </div>
      </section>
    </>
  );
}
