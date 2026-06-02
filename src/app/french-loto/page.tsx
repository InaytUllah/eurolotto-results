import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { FRENCH_LOTO } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(FRENCH_LOTO.name, FRENCH_LOTO.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function FrenchLotoPage() {
  const results = await fetchLotteryResults('french-loto');
  return (
    <GamePage
      game={FRENCH_LOTO}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
