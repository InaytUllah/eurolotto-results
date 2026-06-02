import { Metadata } from 'next';
import Link from 'next/link';
import { ALL_GAMES } from '@/lib/data/games';
import { getResultsByGame } from '@/lib/data/draws';
import CheckerTool from '@/components/CheckerTool';
import type { LotteryResult } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Check Your Lottery Numbers | Euro Lotto Results',
  description:
    'Check your lottery numbers against the latest EuroMillions, EuroJackpot, UK Lotto, Thunderball, and other European lottery draw results. See how many numbers you matched instantly.',
  keywords: [
    'lottery results checker',
    'check lottery numbers',
    'euromillions checker',
    'eurojackpot checker',
    'uk lotto checker',
    'lottery number checker',
    'check winning numbers',
    'did i win the lottery',
    'lottery results check',
    'european lottery checker',
  ],
};


export default function ResultsCheckerPage() {
  // Pre-fetch results for all games on the server
  const resultsByGame: Record<string, LotteryResult[]> = {};
  for (const game of ALL_GAMES) {
    resultsByGame[game.slug] = getResultsByGame(game.slug, 10);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Lottery Results Checker
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Enter your numbers and instantly check them against recent draws
      </p>

      <CheckerTool games={ALL_GAMES} resultsByGame={resultsByGame} />

      {/* SEO Content Section */}
      <div className="mt-12 prose dark:prose-invert max-w-none">
        <h2>How to Use the Lottery Results Checker</h2>
        <p>
          Our free lottery results checker makes it simple to find out whether your ticket is a winner.
          Instead of manually comparing your numbers against each draw, our tool does the hard work for
          you in seconds. Simply select the lottery game you played, enter the numbers from your ticket,
          and hit the check button. The tool will compare your numbers against the last ten draws and
          clearly highlight any matches in green, so you can see at a glance how close you came to a prize.
        </p>

        <h3>Supported Lottery Games</h3>
        <p>
          The results checker supports all ten major European lottery games tracked on our site, including
          EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto,
          La Primitiva, German Lotto 6aus49, and Italian SuperEnalotto. Each game has different rules for
          main numbers and bonus balls, and our checker automatically adjusts the input fields to match
          the format of your chosen game. For instance, EuroMillions requires five main numbers from 1 to
          50 plus two Lucky Stars from 1 to 12, while UK Lotto asks for six numbers from 1 to 59.
        </p>

        <h3>Understanding Your Results</h3>
        <p>
          After checking, each draw is displayed with your matched main numbers shown in green and any
          matched bonus balls highlighted too. A summary badge tells you exactly how many numbers you
          matched in each draw. You can click on any draw date to visit the full results page for that
          specific draw, where you will find detailed prize tier breakdowns and jackpot information.
        </p>

        <h3>Tips for Getting the Most From This Tool</h3>
        <p>
          If you play the same numbers regularly, bookmark this page so you can quickly check after every
          draw. Pair the results checker with our other free tools to build a more informed playing
          strategy. Use the{' '}
          <Link href="/number-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
            Number Generator
          </Link>{' '}
          to create random quick-pick selections, review the{' '}
          <Link href="/hot-cold-numbers" className="text-blue-600 dark:text-blue-400 hover:underline">
            Hot &amp; Cold Numbers
          </Link>{' '}
          page to see which numbers have been drawn most and least frequently, or browse our{' '}
          <Link href="/predictions" className="text-blue-600 dark:text-blue-400 hover:underline">
            Predictions
          </Link>{' '}
          page for data-driven number suggestions based on historical frequency analysis.
        </p>

        <h3>Responsible Play</h3>
        <p>
          Remember that all lottery games are games of chance and no tool can guarantee a win. Always play
          responsibly and within your means. Our checker is designed purely as a convenience tool to help
          you verify your tickets quickly. If you believe you have won a significant prize, always verify
          your results through the official lottery operator for your country before making any claims.
        </p>
      </div>

      {/* Explore More */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <Link
            href="/number-generator"
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
          >
            Number Generator
          </Link>
          <Link
            href="/hot-cold-numbers"
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
          >
            Hot &amp; Cold Numbers
          </Link>
          <Link
            href="/predictions"
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
          >
            Predictions
          </Link>
          <Link
            href="/jackpot-tracker"
            className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
          >
            Jackpot Tracker
          </Link>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Game Results</h2>
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

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Check Your Lottery Numbers',
            description:
              'Use our free lottery results checker to compare your ticket numbers against recent European lottery draws and see if you have won.',
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Select your lottery game',
                text: 'Choose the lottery game you played from the dropdown menu. We support EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto, La Primitiva, German Lotto, and SuperEnalotto.',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Enter your ticket numbers',
                text: 'Type your main numbers and any bonus ball numbers into the input fields. The form automatically adjusts to the correct format for your chosen game.',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Check your numbers',
                text: 'Click the "Check Numbers" button to compare your numbers against the last 10 draws. Matched numbers will be highlighted in green, and a summary shows how many numbers you matched in each draw.',
              },
            ],
          }),
        }}
      />
    </div>
  );
}
