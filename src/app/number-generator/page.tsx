'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ALL_GAMES } from '@/lib/data/games';
import LotteryBalls from '@/components/LotteryBalls';

function generateNumbers(count: number, max: number): number[] {
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

export default function NumberGeneratorPage() {
  const [selectedGame, setSelectedGame] = useState(ALL_GAMES[0].slug);
  const [mainNums, setMainNums] = useState<number[]>([]);
  const [bonusNums, setBonusNums] = useState<number[]>([]);
  const [history, setHistory] = useState<Array<{ main: number[]; bonus: number[] }>>([]);

  const game = ALL_GAMES.find((g) => g.slug === selectedGame) || ALL_GAMES[0];

  function generate() {
    const main = generateNumbers(game.mainNumbers.count, game.mainNumbers.max);
    const bonus = game.bonusBalls ? generateNumbers(game.bonusBalls.count, game.bonusBalls.max) : [];
    setMainNums(main);
    setBonusNums(bonus);
    setHistory((prev) => [{ main, bonus }, ...prev].slice(0, 10));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Lottery Number Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Generate random numbers for any European lottery game
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Game
          </label>
          <select
            value={selectedGame}
            onChange={(e) => { setSelectedGame(e.target.value); setMainNums([]); setBonusNums([]); }}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
          >
            {ALL_GAMES.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name} ({g.mainNumbers.count} from {g.mainNumbers.max}
                {g.bonusBalls ? ` + ${g.bonusBalls.count} from ${g.bonusBalls.max}` : ''})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generate}
          className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: game.color }}
        >
          Generate Numbers
        </button>

        {mainNums.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your {game.name} Numbers</p>
            <div className="flex justify-center">
              <LotteryBalls
                numbers={mainNums}
                bonusBalls={bonusNums.length > 0 ? bonusNums : undefined}
                bonusBallName={game.bonusBalls?.name}
                size="lg"
                gameColor={game.color}
                animated
              />
            </div>
          </div>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generation History</h2>
          <div className="space-y-3">
            {history.slice(1).map((entry, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <LotteryBalls
                  numbers={entry.main}
                  bonusBalls={entry.bonus.length > 0 ? entry.bonus : undefined}
                  bonusBallName={game.bonusBalls?.name}
                  size="sm"
                  gameColor={game.color}
                  animated={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About the Number Generator</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Our <strong className="text-gray-900 dark:text-white">lottery number generator</strong> creates truly random numbers for all major European lottery games. Each generation uses a cryptographically-inspired random algorithm to ensure fair and unbiased results. Remember, lottery draws are random events and no generator can predict winning numbers.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Want a More Informed Selection?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Hot &amp; Cold Numbers</Link> — View number frequency data and analysis</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Predictions</Link> — Statistically-generated number sets</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Explore More */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <Link href="/hot-cold-numbers" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Hot & Cold Numbers
          </Link>
          <Link href="/predictions" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Predictions
          </Link>
          <Link href="/jackpot-tracker" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
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

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Use the Lottery Number Generator',
            description:
              'Generate random lottery numbers for any major European lottery game using our free number generator.',
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Select your lottery game',
                text: 'Choose from any major European lottery game including EuroMillions, EuroJackpot, UK Lotto, Thunderball, and more using the dropdown menu.',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Choose your numbers or use quick pick',
                text: 'Click the "Generate Numbers" button to instantly generate a random set of numbers for your chosen game.',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Review your generated numbers',
                text: 'Your randomly generated numbers will be displayed on screen. You can generate multiple sets and review them in the generation history.',
              },
            ],
          }),
        }}
      />
    </div>
  );
}
