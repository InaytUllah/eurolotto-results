import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { EUROMILLIONS } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(EUROMILLIONS.name, EUROMILLIONS.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function EuroMillionsPage() {
  const results = await fetchLotteryResults('euromillions');
  return (
    <GamePage
      game={EUROMILLIONS}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
