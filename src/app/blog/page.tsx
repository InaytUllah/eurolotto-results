import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogSEO } from '@/lib/data/seo';
import { ALL_GAMES } from '@/lib/data/games';
import { getLatestResultByGame } from '@/lib/data/draws';

const seo = getBlogSEO();
export const metadata: Metadata = { title: seo.title, description: seo.description };

export default function BlogPage() {
  const latestResults = ALL_GAMES.map((game) => ({
    game,
    result: getLatestResultByGame(game.slug),
  })).filter((item) => item.result);

  const blogPosts = latestResults.map(({ game, result }) => ({
    slug: `${game.slug}-results-${result!.drawDate}`,
    title: `${game.name} Results for ${new Date(result!.drawDate + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
    excerpt: `The latest ${game.name} draw took place with winning numbers ${result!.numbers.join(', ')}${result!.bonusBalls ? ` and ${game.bonusBalls?.name || 'bonus'} ${result!.bonusBalls.join(', ')}` : ''}. ${result!.jackpot ? `The jackpot was ${result!.jackpot}.` : ''}`,
    date: result!.drawDate,
    category: game.name,
    color: game.color,
    gameSlug: game.slug,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Lottery News & Results Blog
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Latest European lottery draw results and analysis
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.gameSlug}/results/${post.date}`}
            className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-2" style={{ backgroundColor: post.color }} />
            <div className="p-5">
              <span
                className="inline-block text-xs font-medium px-2 py-1 rounded-full text-white mb-3"
                style={{ backgroundColor: post.color }}
              >
                {post.category}
              </span>
              <h2 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{post.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(post.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Internal Links - Tools */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lottery Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/number-generator" className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow">
            Number Generator
          </Link>
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
      </div>

      {/* Internal Links - Game Pages */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Lottery Results</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ALL_GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center text-sm font-medium hover:shadow-md transition-shadow"
            >
              {game.flag} {game.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About Our Blog</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Stay up to date with the latest European lottery results, jackpot news, and draw analysis.
            We cover all major EU lotteries including <strong className="text-gray-900 dark:text-white">EuroMillions</strong>, <strong className="text-gray-900 dark:text-white">EuroJackpot</strong>, <strong className="text-gray-900 dark:text-white">Thunderball</strong>, <strong className="text-gray-900 dark:text-white">Set for Life</strong>,
            <strong className="text-gray-900 dark:text-white"> Irish Lotto</strong>, <strong className="text-gray-900 dark:text-white">French Loto</strong>, <strong className="text-gray-900 dark:text-white">La Primitiva</strong>, and <strong className="text-gray-900 dark:text-white">German Lotto 6aus49</strong>.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explore Our Tools</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/number-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Number Generator</Link> — Generate random picks for any European lottery</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/hot-cold-numbers" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Hot &amp; Cold Numbers</Link> — View number frequency data and analysis</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span><Link href="/predictions" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Predictions</Link> — Statistical number predictions based on draw history</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
