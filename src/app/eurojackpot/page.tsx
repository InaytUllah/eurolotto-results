import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { EUROJACKPOT } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(EUROJACKPOT.name, EUROJACKPOT.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function EuroJackpotPage() {
  const results = await fetchLotteryResults('eurojackpot');
  return (
    <GamePage
      game={EUROJACKPOT}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
