import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { THUNDERBALL } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(THUNDERBALL.name, THUNDERBALL.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function ThunderballPage() {
  const results = await fetchLotteryResults('thunderball');
  return (
    <GamePage
      game={THUNDERBALL}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
