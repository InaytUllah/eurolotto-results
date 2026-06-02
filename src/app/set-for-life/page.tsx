import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { SET_FOR_LIFE } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(SET_FOR_LIFE.name, SET_FOR_LIFE.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function SetForLifePage() {
  const results = await fetchLotteryResults('set-for-life');
  return (
    <GamePage
      game={SET_FOR_LIFE}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
