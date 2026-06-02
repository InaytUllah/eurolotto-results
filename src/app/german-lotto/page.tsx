import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { GERMAN_LOTTO } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(GERMAN_LOTTO.name, GERMAN_LOTTO.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function GermanLottoPage() {
  const results = await fetchLotteryResults('german-lotto');
  return (
    <GamePage
      game={GERMAN_LOTTO}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
