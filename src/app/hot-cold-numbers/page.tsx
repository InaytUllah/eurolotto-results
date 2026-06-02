'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ALL_GAMES } from '@/lib/data/games';
import { getHotNumbers, getColdNumbers, calculateFrequency } from '@/lib/data/draws';

export default function HotColdNumbersPage() {
  const [selectedGame, setSelectedGame] = useState(ALL_GAMES[0].slug);

  const game = ALL_GAMES.find((g) => g.slug === selectedGame) || ALL_GAMES[0];
  const hot = getHotNumbers(selectedGame, 10);
  const cold = getColdNumbers(selectedGame, 10);
  const allFreq = calculateFrequency(selectedGame);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Hot & Cold Numbers
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Analyze number frequency across European lottery draws
      </p>

      <div className="mb-8">
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full max-w-md mx-auto block rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
        >
          {ALL_GAMES.map((g) => (
            <option key={g.slug} value={g.slug}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Hot Numbers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span> Hot Numbers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Most frequently drawn numbers</p>
          <div className="space-y-3">
            {hot.map((freq) => (
              <div key={freq.number} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: game.color }}
                >
                  {freq.number}
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(freq.percentage, 10)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16 text-right">
                  {freq.count}x ({freq.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold Numbers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
            <span className="text-2xl">❄️</span> Cold Numbers
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Least frequently drawn numbers</p>
          <div className="space-y-3">
            {cold.map((freq) => (
              <div key={freq.number} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-500"
                >
                  {freq.number}
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(freq.percentage, 5)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16 text-right">
                  {freq.count}x ({freq.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Frequency Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Frequency Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">Number</th>
                <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">Frequency</th>
                <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">Percentage</th>
                <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400">Last Drawn</th>
              </tr>
            </thead>
            <tbody>
              {allFreq.map((freq) => (
                <tr key={freq.number} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-2 px-3 font-bold">{freq.number}</td>
                  <td className="py-2 px-3">{freq.count}</td>
                  <td className="py-2 px-3">{freq.percentage}%</td>
                  <td className="py-2 px-3 text-gray-500">{freq.lastDrawn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Understanding Hot and Cold Numbers</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-white">Hot numbers</strong> are those that have been drawn most frequently in recent draws, while <strong className="text-gray-900 dark:text-white">cold numbers</strong> are those that appear less often. While past frequency does not predict future draws, many players find this analysis helpful when selecting their numbers.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Related Tools</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Number Generator</Link> — Generate random picks for any European lottery</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Predictions</Link> — Statistically-informed number suggestions</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Explore More */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Link href="/number-generator" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Number Generator
          </Link>
          <Link href="/predictions" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Predictions
          </Link>
          <Link href="/jackpot-tracker" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Jackpot Tracker
          </Link>
          <Link href="/blog" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Lottery Blog
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
  );
}
