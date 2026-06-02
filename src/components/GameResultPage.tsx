import Link from 'next/link';
import { GameConfig, LotteryResult } from '@/lib/types';
import LotteryBalls from './LotteryBalls';
import Breadcrumb from './Breadcrumb';

interface GameResultPageProps {
  game: GameConfig;
  result?: LotteryResult;
  date: string;
}

export default function GameResultPage({ game, result, date }: GameResultPageProps) {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shortDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: game.name, href: `/${game.slug}` },
    { label: `Results ${shortDate}` },
  ];

  // Schema.org structured data for the result
  const resultJsonLd = result
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: `${game.name} Draw - ${formattedDate}`,
        description: `${game.name} lottery draw results for ${formattedDate}. Winning numbers: ${result.numbers.join(', ')}${result.bonusBalls ? `. ${result.bonusBallName}: ${result.bonusBalls.join(', ')}` : ''}.${result.jackpot ? ` Jackpot: ${result.jackpot}.` : ''}`,
        startDate: date,
        endDate: date,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: game.country,
          address: {
            '@type': 'PostalAddress',
            addressCountry: game.country,
          },
        },
        organizer: {
          '@type': 'Organization',
          name: game.name,
          url: game.website,
        },
      }
    : null;

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {game.flag} {game.name} Results - {formattedDate}
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Results for this date are not available yet. The draw may not have taken place, or results are
            still being processed. Please check back shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${game.slug}`}
              className="inline-block px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: game.color }}
            >
              View Latest {game.name} Results
            </Link>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
            >
              All Lottery Results
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {resultJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(resultJsonLd) }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Main Result Card */}
        <article className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-10 text-center" style={{ borderTop: `4px solid ${game.color}` }}>
            <div className="mb-2">
              <span className="text-3xl" aria-hidden="true">{game.flag}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {game.name} Results
            </h1>
            <p className="text-gray-500 text-lg mb-8">{formattedDate}</p>

            {/* Winning Numbers */}
            <div className="flex justify-center mb-6">
              <LotteryBalls
                numbers={result.numbers}
                bonusBalls={result.bonusBalls}
                bonusBallName={result.bonusBallName}
                size="lg"
                gameColor={game.color}
                animated
              />
            </div>

            {result.bonusBallName && result.bonusBalls && (
              <p className="text-sm text-gray-500 mb-6">
                {result.bonusBallName}: {result.bonusBalls.join(', ')}
              </p>
            )}

            {/* Jackpot Display */}
            {result.jackpot && (
              <div className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-8 py-5 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Jackpot</p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{result.jackpot}</p>
              </div>
            )}
          </div>

          {/* Game Info Grid */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
              <div>
                <p className="text-gray-500 mb-1">Game</p>
                <p className="font-semibold text-gray-900">{game.flag} {game.name}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Draw Date</p>
                <p className="font-semibold text-gray-900">{formattedDate}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Jackpot Odds</p>
                <p className="font-semibold text-gray-900">{game.odds}</p>
              </div>
            </div>
          </div>

          {/* Next Draw Info */}
          {(result.nextDrawDate || result.nextJackpot) && (
            <div className="border-t border-gray-200 p-6 bg-blue-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Next Draw</p>
                  {result.nextDrawDate && (
                    <p className="text-blue-900 font-semibold">
                      {new Date(result.nextDrawDate + 'T00:00:00').toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
                {result.nextJackpot && (
                  <div className="text-right">
                    <p className="text-sm text-blue-700 font-medium">Estimated Jackpot</p>
                    <p className="text-xl font-bold text-blue-900">{result.nextJackpot}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </article>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href={`/${game.slug}`}
            className="px-6 py-3 rounded-lg text-white font-medium text-center transition-opacity hover:opacity-90"
            style={{ backgroundColor: game.color }}
          >
            All {game.name} Results
          </Link>
          <Link
            href={`/number-generator?game=${game.slug}`}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 font-medium text-center hover:bg-gray-300 transition-colors"
          >
            Generate {game.name} Numbers
          </Link>
          <Link
            href={`/hot-cold-numbers?game=${game.slug}`}
            className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 font-medium text-center hover:bg-gray-300 transition-colors"
          >
            Hot & Cold Numbers
          </Link>
        </div>

        {/* SEO Content Section */}
        <section className="bg-gray-50 rounded-2xl p-6 sm:p-10 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            {game.name} Results for {formattedDate}
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              The {game.name} draw took place on {formattedDate}, with the winning numbers being{' '}
              {result.numbers.join(', ')}
              {result.bonusBalls
                ? ` and the ${result.bonusBallName} ${result.bonusBalls.length === 1 ? 'was' : 'were'} ${result.bonusBalls.join(' and ')}`
                : ''}
              .{result.jackpot ? ` The jackpot for this draw was ${result.jackpot}.` : ''}
            </p>
            <p>
              {game.name} is drawn on {game.drawDays.join(' and ')} at {game.drawTime} ({game.timezone.split('/')[1]?.replace('_', ' ')} time),
              giving players {game.drawDays.length === 1 ? 'one chance' : `${game.drawDays.length} chances`} every week to
              win life-changing prizes. The game requires players to select {game.mainNumbers.count} main numbers from 1 to{' '}
              {game.mainNumbers.max}
              {game.bonusBalls
                ? `, plus ${game.bonusBalls.count} ${game.bonusBalls.name} from 1 to ${game.bonusBalls.max}`
                : ''}
              . The overall odds of winning the top prize stand at {game.odds}, although there are multiple prize
              tiers offering various levels of rewards for partial matches.
            </p>
            <p>
              Players are encouraged to verify their tickets against the official results published by the{' '}
              {game.name} operator. While we strive to provide accurate and timely results, the official lottery
              website at{' '}
              <a href={game.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {game.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>{' '}
              remains the definitive source for all draw results and prize information. Claims must be made
              in accordance with the rules and within the timeframe specified by the lottery operator.
            </p>
            <p>
              If you are interested in exploring historical trends, our{' '}
              <Link href={`/hot-cold-numbers?game=${game.slug}`} className="text-blue-600 hover:underline">
                hot and cold numbers tool
              </Link>{' '}
              provides statistical analysis of the most and least frequently drawn numbers. You can also use our{' '}
              <Link href={`/number-generator?game=${game.slug}`} className="text-blue-600 hover:underline">
                number generator
              </Link>{' '}
              to create random selections for your next ticket, or visit the{' '}
              <Link href={`/${game.slug}`} className="text-blue-600 hover:underline">
                {game.name} results page
              </Link>{' '}
              to browse the full archive of past draws.
            </p>
            <p>
              Remember that lottery games are a form of entertainment and should always be played
              responsibly. Set a budget for your lottery spending, never spend more than you can afford to
              lose, and if you feel that gambling is becoming a problem, please contact{' '}
              <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                BeGambleAware
              </a>{' '}
              or{' '}
              <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                GamCare
              </a>{' '}
              for free, confidential support and advice. Players must be 18 years of age or older to
              participate in lottery games.
            </p>
          </div>
        </section>

        {/* Related Results / Other Games */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Check Other Lottery Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { name: 'EuroMillions', slug: 'euromillions', flag: '\ud83c\uddea\ud83c\uddfa', color: '#1E3A8A' },
              { name: 'EuroJackpot', slug: 'eurojackpot', flag: '\ud83c\uddea\ud83c\uddfa', color: '#B45309' },
              { name: 'UK Lotto', slug: 'uk-lotto', flag: '\ud83c\uddec\ud83c\udde7', color: '#7C3AED' },
              { name: 'Thunderball', slug: 'thunderball', flag: '\ud83c\uddec\ud83c\udde7', color: '#DC2626' },
              { name: 'Set for Life', slug: 'set-for-life', flag: '\ud83c\uddec\ud83c\udde7', color: '#059669' },
              { name: 'Irish Lotto', slug: 'irish-lotto', flag: '\ud83c\uddee\ud83c\uddea', color: '#16A34A' },
              { name: 'French Loto', slug: 'french-loto', flag: '\ud83c\uddeb\ud83c\uddf7', color: '#2563EB' },
              { name: 'La Primitiva', slug: 'spanish-lottery', flag: '\ud83c\uddea\ud83c\uddf8', color: '#EA580C' },
              { name: 'Lotto 6aus49', slug: 'german-lotto', flag: '\ud83c\udde9\ud83c\uddea', color: '#CA8A04' },
              { name: 'SuperEnalotto', slug: 'italian-superenalotto', flag: '\ud83c\uddee\ud83c\uddf9', color: '#4F46E5' },
            ]
              .filter((l) => l.slug !== game.slug)
              .map((lottery) => (
                <Link
                  key={lottery.slug}
                  href={`/${lottery.slug}`}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all text-center"
                  aria-label={`View ${lottery.name} results`}
                >
                  <span className="text-2xl" aria-hidden="true">{lottery.flag}</span>
                  <span className="text-xs font-medium text-gray-700">{lottery.name}</span>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
