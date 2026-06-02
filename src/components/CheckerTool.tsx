'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GameConfig, LotteryResult } from '@/lib/types';

interface CheckerToolProps {
  games: GameConfig[];
  resultsByGame: Record<string, LotteryResult[]>;
}

interface MatchResult {
  draw: LotteryResult;
  matchedMain: number[];
  matchedBonus: number[];
  totalMatches: number;
}

export default function CheckerTool({ games, resultsByGame }: CheckerToolProps) {
  const [selectedGame, setSelectedGame] = useState(games[0].slug);
  const [mainInputs, setMainInputs] = useState<string[]>([]);
  const [bonusInputs, setBonusInputs] = useState<string[]>([]);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState('');

  const game = games.find((g) => g.slug === selectedGame) || games[0];

  function handleGameChange(slug: string) {
    setSelectedGame(slug);
    setMainInputs([]);
    setBonusInputs([]);
    setResults(null);
    setError('');
  }

  function initInputs() {
    if (mainInputs.length !== game.mainNumbers.count) {
      setMainInputs(Array(game.mainNumbers.count).fill(''));
    }
    if (game.bonusBalls && bonusInputs.length !== game.bonusBalls.count) {
      setBonusInputs(Array(game.bonusBalls.count).fill(''));
    }
  }

  // Ensure inputs match current game config
  if (mainInputs.length !== game.mainNumbers.count) {
    initInputs();
  }

  function updateMainInput(index: number, value: string) {
    const updated = [...mainInputs];
    updated[index] = value.replace(/\D/g, '');
    setMainInputs(updated);
  }

  function updateBonusInput(index: number, value: string) {
    const updated = [...bonusInputs];
    updated[index] = value.replace(/\D/g, '');
    setBonusInputs(updated);
  }

  function checkNumbers() {
    setError('');
    setResults(null);

    // Validate main numbers
    const mainNums = mainInputs.map((v) => parseInt(v, 10));
    if (mainNums.some(isNaN)) {
      setError(`Please enter all ${game.mainNumbers.count} main numbers.`);
      return;
    }
    if (mainNums.some((n) => n < 1 || n > game.mainNumbers.max)) {
      setError(`Main numbers must be between 1 and ${game.mainNumbers.max}.`);
      return;
    }
    if (new Set(mainNums).size !== mainNums.length) {
      setError('Main numbers must not contain duplicates.');
      return;
    }

    // Validate bonus numbers
    let bonusNums: number[] = [];
    if (game.bonusBalls) {
      bonusNums = bonusInputs.map((v) => parseInt(v, 10));
      if (bonusNums.some(isNaN)) {
        setError(`Please enter all ${game.bonusBalls.count} ${game.bonusBalls.name} number(s).`);
        return;
      }
      if (bonusNums.some((n) => n < 1 || n > game.bonusBalls!.max)) {
        setError(`${game.bonusBalls.name} numbers must be between 1 and ${game.bonusBalls.max}.`);
        return;
      }
      if (new Set(bonusNums).size !== bonusNums.length) {
        setError(`${game.bonusBalls.name} numbers must not contain duplicates.`);
        return;
      }
    }

    // Compare against draws
    const draws = resultsByGame[selectedGame] || [];
    const matches: MatchResult[] = draws.map((draw) => {
      const matchedMain = mainNums.filter((n) => draw.numbers.includes(n));
      const matchedBonus = draw.bonusBalls
        ? bonusNums.filter((n) => draw.bonusBalls!.includes(n))
        : [];
      return {
        draw,
        matchedMain,
        matchedBonus,
        totalMatches: matchedMain.length + matchedBonus.length,
      };
    });

    setResults(matches);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div>
      {/* Game Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Step 1: Select Your Lottery Game
          </label>
          <select
            value={selectedGame}
            onChange={(e) => handleGameChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white"
          >
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name} ({g.mainNumbers.count} from {g.mainNumbers.max}
                {g.bonusBalls ? ` + ${g.bonusBalls.count} ${g.bonusBalls.name}` : ''})
              </option>
            ))}
          </select>
        </div>

        {/* Main Numbers Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Step 2: Enter Your Main Numbers (1-{game.mainNumbers.max})
          </label>
          <div className="flex flex-wrap gap-2">
            {mainInputs.map((val, i) => (
              <input
                key={`main-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={val}
                onChange={(e) => updateMainInput(i, e.target.value)}
                placeholder={`#${i + 1}`}
                className="w-16 h-14 text-center text-lg font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>
        </div>

        {/* Bonus Numbers Input */}
        {game.bonusBalls && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Your {game.bonusBalls.name} (1-{game.bonusBalls.max})
            </label>
            <div className="flex flex-wrap gap-2">
              {bonusInputs.map((val, i) => (
                <input
                  key={`bonus-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={val}
                  onChange={(e) => updateBonusInput(i, e.target.value)}
                  placeholder={`${game.bonusBalls!.name.charAt(0)}${i + 1}`}
                  className="w-16 h-14 text-center text-lg font-bold rounded-lg border-2 border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={checkNumbers}
          className="w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-200 hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: game.color }}
        >
          Step 3: Check Numbers
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Results from the Last {results.length} {game.name} Draws
          </h2>

          {results.every((r) => r.totalMatches === 0) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center mb-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No matches found across the last {results.length} draws. Better luck next time!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {results.map((result, i) => {
              const hasMatch = result.totalMatches > 0;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-4 transition-all ${
                    hasMatch
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 shadow-md'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/${game.slug}/${result.draw.drawDate}`}
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {formatDate(result.draw.drawDate)}
                      </Link>
                      {result.draw.jackpot && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Jackpot: {result.draw.jackpot}
                        </span>
                      )}
                    </div>
                    {hasMatch && (
                      <span className="mt-1 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                        {result.matchedMain.length} main
                        {result.matchedBonus.length > 0
                          ? ` + ${result.matchedBonus.length} ${game.bonusBalls?.name || 'bonus'}`
                          : ''}{' '}
                        matched
                      </span>
                    )}
                  </div>

                  {/* Draw Numbers */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {result.draw.numbers.map((num) => {
                      const isMatched = result.matchedMain.includes(num);
                      return (
                        <div
                          key={`m-${num}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-transform"
                          style={{
                            backgroundColor: isMatched ? '#16A34A' : game.color,
                            transform: isMatched ? 'scale(1.15)' : 'scale(1)',
                            boxShadow: isMatched ? '0 0 10px rgba(22, 163, 74, 0.5)' : 'none',
                          }}
                        >
                          {num}
                        </div>
                      );
                    })}
                    {result.draw.bonusBalls && result.draw.bonusBalls.length > 0 && (
                      <>
                        <span className="text-gray-400 mx-1">+</span>
                        {result.draw.bonusBalls.map((num) => {
                          const isMatched = result.matchedBonus.includes(num);
                          return (
                            <div
                              key={`b-${num}`}
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-transform"
                              style={{
                                backgroundColor: isMatched ? '#16A34A' : 'transparent',
                                borderColor: isMatched ? '#16A34A' : '#F59E0B',
                                color: isMatched ? '#FFFFFF' : '#F59E0B',
                                transform: isMatched ? 'scale(1.15)' : 'scale(1)',
                                boxShadow: isMatched ? '0 0 10px rgba(22, 163, 74, 0.5)' : 'none',
                              }}
                            >
                              {num}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
