import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { SPANISH_LOTTERY } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(SPANISH_LOTTERY.name, SPANISH_LOTTERY.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function SpanishLotteryPage() {
  const results = await fetchLotteryResults('spanish-lottery');
  return (
    <GamePage
      game={SPANISH_LOTTERY}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
