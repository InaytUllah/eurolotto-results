import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { UK_LOTTO } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(UK_LOTTO.name, UK_LOTTO.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function UKLottoPage() {
  const results = await fetchLotteryResults('uk-lotto');
  return (
    <GamePage
      game={UK_LOTTO}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
