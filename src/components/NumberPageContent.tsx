import Link from 'next/link';

interface NumberPageContentProps {
  gameName: string;
  gameSlug: string;
  gameColor: string;
  flag: string;
  number: number;
  maxNumber: number;
  totalDraws: number;
  frequency: number;
  percentage: number;
  rank: number;
  status: 'hot' | 'warm' | 'neutral' | 'cool' | 'cold';
  lastDrawn: string;
  recentAppearances: { date: string; numbers: number[] }[];
}

const statusConfig = {
  hot: { label: 'Hot', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', desc: 'frequently drawn' },
  warm: { label: 'Warm', color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400', desc: 'drawn often' },
  neutral: { label: 'Neutral', color: 'bg-gray-500', textColor: 'text-gray-600 dark:text-gray-400', desc: 'average frequency' },
  cool: { label: 'Cool', color: 'bg-blue-400', textColor: 'text-blue-600 dark:text-blue-400', desc: 'drawn less often' },
  cold: { label: 'Cold', color: 'bg-blue-600', textColor: 'text-blue-700 dark:text-blue-300', desc: 'rarely drawn' },
};

export default function NumberPageContent({
  gameName, gameSlug, gameColor, flag, number, maxNumber,
  totalDraws, frequency, percentage, rank, status, lastDrawn, recentAppearances,
}: NumberPageContentProps) {
  const cfg = statusConfig[status];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>/</li>
          <li><Link href={`/${gameSlug}`} className="hover:text-blue-600">{gameName}</Link></li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white">Number {number}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 shadow-xl"
          style={{ backgroundColor: gameColor }}
          aria-label={`${gameName} number ${number}`}
        >
          {number}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {flag} {gameName} Number {number}
        </h1>
        <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${cfg.color}`}>
          {cfg.label} Number — {cfg.desc}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Times Drawn</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{frequency}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Draws</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDraws}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Frequency</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">#{rank}</p>
          <p className="text-xs text-gray-400">of {maxNumber}</p>
        </div>
      </div>

      {/* Frequency Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Frequency Overview</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Draw Frequency</span>
              <span className={`font-medium ${cfg.textColor}`}>{percentage}%</span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: gameColor }}
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Last drawn: {lastDrawn ? new Date(lastDrawn + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
        </p>
      </div>

      {/* Recent Appearances */}
      {recentAppearances.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Appearances</h2>
          <div className="space-y-3">
            {recentAppearances.slice(0, 5).map((app) => (
              <Link
                key={app.date}
                href={`/${gameSlug}/results/${app.date}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(app.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <div className="flex gap-1.5">
                  {app.numbers.map((n, i) => (
                    <span
                      key={i}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${n === number ? 'text-white' : 'text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600'}`}
                      style={n === number ? { backgroundColor: gameColor } : undefined}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Internal Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link href={`/${gameSlug}`} className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
          {gameName} Results
        </Link>
        <Link href="/hot-cold-numbers" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
          Hot &amp; Cold Numbers
        </Link>
        <Link href="/predictions" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
          Predictions
        </Link>
        <Link href="/number-generator" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
          Number Generator
        </Link>
      </div>

      {/* SEO Content */}
      <div className="prose dark:prose-dark max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          About Number {number} in {gameName}
        </h2>
        <p>
          Number {number} is currently ranked #{rank} out of {maxNumber} numbers in the {gameName} draw pool, making it a {status} number based on its historical draw frequency.
          In our recorded draws, number {number} has appeared {frequency} times out of {totalDraws} total draws, giving it a frequency rate of {percentage}%.
          {status === 'hot' && ` As a hot number, ${number} has been drawn more frequently than average in recent ${gameName} draws. Some players like to include hot numbers in their selections, while others prefer to avoid them.`}
          {status === 'cold' && ` As a cold number, ${number} has appeared less frequently than average. Some players believe cold numbers are "due" to appear, while others prefer to stick with hot numbers. Remember that each draw is independent.`}
          {(status === 'neutral' || status === 'warm' || status === 'cool') && ` This means number ${number} has appeared at roughly the expected rate based on random probability across ${gameName} draws.`}
        </p>
        <p>
          It is important to understand that lottery draws are completely random events and every number has an equal chance of being drawn in each individual draw. Historical frequency data cannot predict future outcomes. The classification of numbers as hot, cold, or neutral is based purely on past data and should not be used as a basis for financial decisions. For more information on responsible play, please visit our <Link href="/responsible-gaming" className="text-blue-600 dark:text-blue-400 hover:underline">Responsible Gaming</Link> page.
        </p>
      </div>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${gameName} Number ${number} — Frequency Statistics and Analysis`,
            description: `Statistical analysis of number ${number} in ${gameName}. Drawn ${frequency} times with a ${percentage}% frequency rate. Currently ranked #${rank}.`,
          }),
        }}
      />
    </div>
  );
}
