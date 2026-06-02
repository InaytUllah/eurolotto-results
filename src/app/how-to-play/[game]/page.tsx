import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_GAMES, getGameBySlug, getAllGameSlugs } from '@/lib/data/games';

type Props = { params: Promise<{ game: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: 'How to Play' };
  return {
    title: `How to Play ${game.name} - Rules, Odds & Tips | Euro Lotto Results`,
    description: `Learn how to play ${game.name}. Complete guide covering rules, number selection, odds, prize tiers, and tips for playing ${game.name}.`,
  };
}

export async function generateStaticParams() {
  return getAllGameSlugs().map((game) => ({ game }));
}

export default async function HowToPlayPage({ params }: Props) {
  const { game: slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to Play ${game.name}`,
    'description': `Step-by-step guide to playing ${game.name}`,
    'step': game.howToPlay.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'text': step,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/${game.slug}`} className="hover:text-blue-600">{game.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">How to Play</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        How to Play {game.name}
      </h1>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0 mb-3">Game Overview</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{game.description}</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Main Numbers</p>
              <p className="font-bold">{game.mainNumbers.count} from 1-{game.mainNumbers.max}</p>
            </div>
            {game.bonusBalls && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">{game.bonusBalls.name}</p>
                <p className="font-bold">{game.bonusBalls.count} from 1-{game.bonusBalls.max}</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Draw Days</p>
              <p className="font-bold">{game.drawDays.join(', ')}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Draw Time</p>
              <p className="font-bold">{game.drawTime} ({game.timezone.split('/')[1]})</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Step-by-Step Guide</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">1</span>
              <span><strong className="text-gray-900 dark:text-white">Choose your main numbers:</strong> Select {game.mainNumbers.count} numbers from 1 to {game.mainNumbers.max}.</span>
            </li>
            {game.bonusBalls && (
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">2</span>
                <span><strong className="text-gray-900 dark:text-white">Choose your {game.bonusBalls.name}:</strong> Select {game.bonusBalls.count} additional number{game.bonusBalls.count > 1 ? 's' : ''} from 1 to {game.bonusBalls.max}.</span>
              </li>
            )}
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">{game.bonusBalls ? '3' : '2'}</span>
              <span><strong className="text-gray-900 dark:text-white">Purchase your ticket:</strong> Buy your ticket from an authorised retailer or online through the official {game.name} website.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">{game.bonusBalls ? '4' : '3'}</span>
              <span><strong className="text-gray-900 dark:text-white">Wait for the draw:</strong> Draws take place on {game.drawDays.join(' and ')} at {game.drawTime}.</span>
            </li>
            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-bold shrink-0 mt-0.5">{game.bonusBalls ? '5' : '4'}</span>
              <span><strong className="text-gray-900 dark:text-white">Check your results:</strong> Visit our <Link href={`/${game.slug}`} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">{game.name} results page</Link> to see if you have won.</span>
            </li>
          </ol>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Odds of Winning</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">The overall odds of winning the <strong className="text-gray-900 dark:text-white">{game.name}</strong> jackpot are approximately <strong className="text-gray-900 dark:text-white">{game.odds}</strong>. There are multiple prize tiers available, giving you more chances to win smaller prizes.</p>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tips for Playing</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Set a budget and stick to it — only play what you can afford to lose</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Consider using our <Link href={`/number-generator?game=${game.slug}`} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">number generator</Link> for random selections</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Check our <Link href={`/hot-cold-numbers?game=${game.slug}`} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">hot and cold numbers</Link> for frequency analysis</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Join a syndicate to increase your chances without spending more</span>
            </li>
            <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
              <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <span>Always check official results to verify any wins</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Other Games */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Play Other Lotteries</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_GAMES.filter((g) => g.slug !== game.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/how-to-play/${g.slug}`}
              className="text-center p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
