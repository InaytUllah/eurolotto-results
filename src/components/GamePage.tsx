import Link from 'next/link';
import { GameConfig, LotteryResult } from '@/lib/types';
import LotteryBalls from './LotteryBalls';
import Countdown from './Countdown';

interface GamePageProps {
  game: GameConfig;
  latestResult?: LotteryResult;
  pastResults: LotteryResult[];
}

export default function GamePage({ game, latestResult, pastResults }: GamePageProps) {
  const faqItems = [
    {
      question: `What days is ${game.name} drawn?`,
      answer: `${game.name} draws take place on ${game.drawDays.join(' and ')} at ${game.drawTime} (${game.timezone.split('/')[1]?.replace('_', ' ') || game.timezone} time). Results are typically available on this site within minutes of each draw.`,
    },
    {
      question: `What are the odds of winning the ${game.name} jackpot?`,
      answer: `The odds of winning the ${game.name} jackpot are ${game.odds}. While the top prize is difficult to win, there are multiple prize tiers with better odds, giving players more chances to win smaller prizes in every draw.`,
    },
    {
      question: `How much does a ${game.name} ticket cost?`,
      answer: `A standard ${game.name} ticket costs ${game.ticketPrice}. The jackpot starts at ${game.minJackpot} and can roll over to a maximum of ${game.maxJackpot}. Additional options or add-on games may be available for an extra cost depending on your country.`,
    },
    {
      question: `How do I check my ${game.name} results?`,
      answer: `You can check your ${game.name} results right here on Euro Lotto Results. We update the winning numbers shortly after each draw. You can also compare your numbers against past results in our archive, or use our number checker tool to verify your ticket.`,
    },
    {
      question: `Can I play ${game.name} from another country?`,
      answer: `${game.name} is primarily available in ${game.country}. However, some authorized online lottery services allow players from other countries to participate. Always ensure you are using a licensed and reputable service, and check the legality of online lottery purchases in your jurisdiction.`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const speakableJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${game.name} Results Today`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.aeo-answer', '.latest-result-summary', '.game-description'],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />

      {/* Hero Section */}
      <section
        className="text-white py-10 sm:py-16"
        style={{ background: game.gradient || `linear-gradient(135deg, ${game.color}, ${game.color}CC)` }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3" aria-hidden="true">{game.flag}</div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
              {game.name} Results
            </h1>
            <p className="game-description text-lg opacity-90 max-w-2xl mx-auto">
              {game.country} &middot; Draws {game.drawDays.join(' & ')} at {game.drawTime} &middot; Jackpots from {game.minJackpot}
            </p>
          </div>

          {latestResult && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto text-center">
              <p className="latest-result-summary text-sm opacity-80 mb-3">
                Latest Draw &middot;{' '}
                {new Date(latestResult.drawDate + 'T00:00:00').toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <div className="flex justify-center mb-4">
                <LotteryBalls
                  numbers={latestResult.numbers}
                  bonusBalls={latestResult.bonusBalls}
                  bonusBallName={latestResult.bonusBallName}
                  size="lg"
                  gameColor="#FFFFFF"
                  animated
                />
              </div>
              {latestResult.jackpot && (
                <div className="mt-4">
                  <p className="text-sm opacity-80">Jackpot</p>
                  <p className="text-2xl sm:text-3xl font-bold">{latestResult.jackpot}</p>
                </div>
              )}
              {latestResult.nextJackpot && (
                <p className="text-sm opacity-80 mt-2">
                  Next Estimated Jackpot: <span className="font-semibold">{latestResult.nextJackpot}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Countdown */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <Countdown
          drawTime={game.drawTime}
          timezone={game.timezone}
          label={`Next ${game.name} Draw`}
          color={game.color}
          targetDate={latestResult?.nextDrawDate}
        />
      </div>

      {/* AEO Quick Answers Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Answers About {game.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <article className="aeo-answer bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">What are the latest {game.name} results?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {latestResult ? (
                <>
                  The latest {game.name} draw took place on{' '}
                  {new Date(latestResult.drawDate + 'T00:00:00').toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  . The winning numbers were{' '}
                  {latestResult.numbers.join(', ')}
                  {latestResult.bonusBalls && latestResult.bonusBalls.length > 0
                    ? ` with ${latestResult.bonusBallName || 'bonus'} number${latestResult.bonusBalls.length > 1 ? 's' : ''} ${latestResult.bonusBalls.join(', ')}`
                    : ''}
                  .
                  {latestResult.jackpot && ` The jackpot was ${latestResult.jackpot}.`}
                </>
              ) : (
                <>Check back after the next {game.name} draw for the latest winning numbers. Draws take place on {game.drawDays.join(' and ')} at {game.drawTime}.</>
              )}
            </p>
          </article>
          <article className="aeo-answer bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">What are the odds of winning {game.name}?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The odds of winning the {game.name} jackpot are {game.odds}. While the top prize is the hardest to win, there are multiple prize tiers with significantly better odds, giving players more chances to win a prize in every draw.
            </p>
          </article>
          <article className="aeo-answer bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">When is the next {game.name} draw?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {game.name} draws take place every {game.drawDays.join(' and ')} at {game.drawTime} ({game.timezone.split('/')[1]?.replace('_', ' ') || game.timezone} time). Results are typically published on this site within minutes of each draw.
            </p>
          </article>
          <article className="aeo-answer bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">How much does a {game.name} ticket cost?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A standard {game.name} ticket costs {game.ticketPrice}. The jackpot starts at {game.minJackpot} and can roll over up to a maximum of {game.maxJackpot}. Additional options or add-on games may be available at extra cost depending on your country.
            </p>
          </article>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Past Results - Main Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Past {game.name} Results
            </h2>
            <div className="space-y-3">
              {pastResults.map((result) => (
                <Link
                  key={result.drawDate}
                  href={`/${game.slug}/results/${result.drawDate}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
                  aria-label={`${game.name} results for ${new Date(result.drawDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`}
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(result.drawDate + 'T00:00:00').toLocaleDateString('en-GB', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <LotteryBalls
                      numbers={result.numbers}
                      bonusBalls={result.bonusBalls}
                      bonusBallName={result.bonusBallName}
                      size="sm"
                      gameColor={game.color}
                      animated={false}
                    />
                  </div>
                  {result.jackpot && (
                    <span className="text-sm font-semibold text-gray-700 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
                      {result.jackpot}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {pastResults.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">No past results available yet. Check back after the next draw.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6" aria-label="Game information sidebar">
            {/* Game Information Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Game Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Main Numbers:</span>
                  <span className="font-medium text-gray-900">{game.mainNumbers.count} from 1-{game.mainNumbers.max}</span>
                </li>
                {game.bonusBalls && (
                  <li className="flex justify-between">
                    <span>{game.bonusBalls.name}:</span>
                    <span className="font-medium text-gray-900">{game.bonusBalls.count} from 1-{game.bonusBalls.max}</span>
                  </li>
                )}
                <li className="flex justify-between">
                  <span>Draw Days:</span>
                  <span className="font-medium text-gray-900">{game.drawDays.join(', ')}</span>
                </li>
                <li className="flex justify-between">
                  <span>Draw Time:</span>
                  <span className="font-medium text-gray-900">{game.drawTime}</span>
                </li>
                <li className="flex justify-between">
                  <span>Jackpot Odds:</span>
                  <span className="font-medium text-gray-900">{game.odds}</span>
                </li>
                <li className="flex justify-between">
                  <span>Ticket Price:</span>
                  <span className="font-medium text-gray-900">{game.ticketPrice}</span>
                </li>
                <li className="flex justify-between">
                  <span>Country:</span>
                  <span className="font-medium text-gray-900">{game.flag} {game.country}</span>
                </li>
              </ul>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/hot-cold-numbers?game=${game.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    {game.name} Hot & Cold Numbers
                  </Link>
                </li>
                <li>
                  <Link href={`/number-generator?game=${game.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    {game.name} Number Generator
                  </Link>
                </li>
                <li>
                  <Link href={`/predictions?game=${game.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    {game.name} Predictions
                  </Link>
                </li>
                <li>
                  <Link href="/jackpot-tracker" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    Jackpot Tracker
                  </Link>
                </li>
                <li>
                  <Link href={`/how-to-play/${game.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    How to Play {game.name}
                  </Link>
                </li>
                <li>
                  <Link href={game.website} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
                    Official {game.name} Website
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Game Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">About {game.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{game.description}</p>
              <Link
                href="#about-section"
                className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Read more about {game.name}
              </Link>
            </div>

            {/* Other Lotteries */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Other Lotteries</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { name: 'EuroMillions', slug: 'euromillions', flag: '\ud83c\uddea\ud83c\uddfa' },
                  { name: 'EuroJackpot', slug: 'eurojackpot', flag: '\ud83c\uddea\ud83c\uddfa' },
                  { name: 'UK Lotto', slug: 'uk-lotto', flag: '\ud83c\uddec\ud83c\udde7' },
                  { name: 'Thunderball', slug: 'thunderball', flag: '\ud83c\uddec\ud83c\udde7' },
                  { name: 'Set for Life', slug: 'set-for-life', flag: '\ud83c\uddec\ud83c\udde7' },
                  { name: 'Irish Lotto', slug: 'irish-lotto', flag: '\ud83c\uddee\ud83c\uddea' },
                  { name: 'French Loto', slug: 'french-loto', flag: '\ud83c\uddeb\ud83c\uddf7' },
                  { name: 'La Primitiva', slug: 'spanish-lottery', flag: '\ud83c\uddea\ud83c\uddf8' },
                  { name: 'Lotto 6aus49', slug: 'german-lotto', flag: '\ud83c\udde9\ud83c\uddea' },
                  { name: 'SuperEnalotto', slug: 'italian-superenalotto', flag: '\ud83c\uddee\ud83c\uddf9' },
                ]
                  .filter((l) => l.slug !== game.slug)
                  .slice(0, 5)
                  .map((lottery) => (
                    <li key={lottery.slug}>
                      <Link
                        href={`/${lottery.slug}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        <span aria-hidden="true">{lottery.flag}</span> {lottery.name} Results
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="bg-gray-50 py-12 sm:py-16" id="about-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About the Game */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              About {game.name}
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>{game.longDescription}</p>
              <p>
                {game.name} is one of the most popular lottery games in {game.country}, attracting millions of
                players who dream of landing the life-changing jackpot. The game has built a reputation for
                creating instant millionaires and delivering substantial prizes across multiple tiers. Each draw
                generates enormous excitement as players eagerly await the announcement of the winning numbers.
              </p>
              <p>
                The lottery operates under strict regulatory oversight to ensure fairness and transparency. All
                draws are conducted using certified random number generators or traditional ball-drawing machines,
                and results are independently verified before publication. Players can purchase tickets through
                authorized retailers or official online platforms in participating jurisdictions.
              </p>
              <p>
                With jackpots starting at {game.minJackpot} and the potential to roll over to {game.maxJackpot},
                {game.name} offers some of the largest prizes available in European lotteries. The rollover
                mechanism means that when no one matches all the required numbers, the jackpot grows for the
                next draw, sometimes reaching record-breaking amounts that make international headlines.
              </p>
            </div>
          </div>

          {/* How to Play */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              How to Play {game.name}
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <ol className="space-y-4">
                {game.howToPlay.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: game.color }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>
                    <p className="text-gray-600 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Prize Tiers */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {game.name} Prize Tiers
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: game.color }}>
                    <th className="text-left px-4 sm:px-6 py-3 text-sm font-semibold text-white">Match</th>
                    <th className="text-right px-4 sm:px-6 py-3 text-sm font-semibold text-white">Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {game.prizeTiers.map((tier, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-700">{tier.match}</td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-900 font-medium text-right">{tier.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Prize amounts may vary based on ticket sales and the number of winners in each tier.
              The jackpot is a pari-mutuel prize shared among all winners at that tier.
            </p>
          </div>

          {/* Tips for Playing */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Tips for Playing {game.name}
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </span>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Set a budget and stick to it.</strong> Only spend what you can
                    comfortably afford to lose. Lottery games are a form of entertainment, not an investment strategy.
                    Never chase losses or spend money earmarked for essential expenses.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </span>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Consider joining a syndicate.</strong> Playing as part of a group
                    allows you to buy more tickets and cover more number combinations without increasing your individual
                    spend. Many large prizes have been won by lottery syndicates.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </span>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Check your numbers promptly.</strong> Always verify your ticket
                    against the official results after each draw. Prizes have expiry dates and unclaimed prizes revert
                    to the lottery operator or good causes fund after a set period.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </span>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Understand the odds and prize tiers.</strong> Familiarise yourself
                    with the different ways you can win. While the jackpot odds of {game.odds} are long, lower prize
                    tiers offer much better chances and can still deliver meaningful rewards.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-500 shrink-0 mt-0.5" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </span>
                  <p className="text-gray-600">
                    <strong className="text-gray-900">Play responsibly and seek help if needed.</strong> If gambling
                    stops being fun, it is time to stop. Organisations like BeGambleAware and GamCare offer free,
                    confidential support to anyone affected by problem gambling. You must be 18 or older to play.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 group"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-gray-900 font-medium hover:text-blue-700 transition-colors list-none">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related Questions (People Also Ask) */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              People Also Ask
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <Link href={`/how-to-play/${game.slug}`} className="block">
                  <h3 className="font-semibold text-blue-700 mb-1 hover:underline">
                    How do you play {game.name}?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Learn the rules, number format, and how to buy tickets for {game.name}.
                  </p>
                </Link>
              </article>
              <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <Link href={`/hot-cold-numbers?game=${game.slug}`} className="block">
                  <h3 className="font-semibold text-blue-700 mb-1 hover:underline">
                    What are the hot numbers for {game.name}?
                  </h3>
                  <p className="text-sm text-gray-600">
                    See which numbers have been drawn most and least frequently in recent {game.name} draws.
                  </p>
                </Link>
              </article>
              <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <Link href={`/predictions?game=${game.slug}`} className="block">
                  <h3 className="font-semibold text-blue-700 mb-1 hover:underline">
                    What are the {game.name} predictions for today?
                  </h3>
                  <p className="text-sm text-gray-600">
                    View data-driven number predictions based on historical frequency analysis for {game.name}.
                  </p>
                </Link>
              </article>
              <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <Link href={`/number-generator?game=${game.slug}`} className="block">
                  <h3 className="font-semibold text-blue-700 mb-1 hover:underline">
                    Can I generate random {game.name} numbers?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use our free number generator to create random number combinations for {game.name}.
                  </p>
                </Link>
              </article>
              <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <Link href="/jackpot-tracker" className="block">
                  <h3 className="font-semibold text-blue-700 mb-1 hover:underline">
                    Which European lottery has the biggest jackpot right now?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Compare current jackpot sizes across all major European lotteries in real time.
                  </p>
                </Link>
              </article>
              <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <Link href={`/results-checker`} className="block">
                  <h3 className="font-semibold text-blue-700 mb-1 hover:underline">
                    How do I check if my {game.name} ticket has won?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your numbers into our results checker to see if you have won a prize.
                  </p>
                </Link>
              </article>
            </div>
          </div>

          {/* Internal Links */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href={`/number-generator?game=${game.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Number Generator</p>
                  <p className="text-xs text-gray-500">Generate random {game.name} numbers</p>
                </div>
              </Link>
              <Link
                href={`/hot-cold-numbers?game=${game.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Hot & Cold Numbers</p>
                  <p className="text-xs text-gray-500">Analyse {game.name} number frequency</p>
                </div>
              </Link>
              <Link
                href={`/predictions?game=${game.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Predictions</p>
                  <p className="text-xs text-gray-500">AI-powered {game.name} predictions</p>
                </div>
              </Link>
              <Link
                href="/jackpot-tracker"
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Jackpot Tracker</p>
                  <p className="text-xs text-gray-500">Track all European lottery jackpots</p>
                </div>
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lottery Blog</p>
                  <p className="text-xs text-gray-500">News, tips, and analysis</p>
                </div>
              </Link>
              <Link
                href="/faq"
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">FAQ</p>
                  <p className="text-xs text-gray-500">Common lottery questions answered</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
