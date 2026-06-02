import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { IRISH_LOTTO } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(IRISH_LOTTO.name, IRISH_LOTTO.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function IrishLottoPage() {
  const results = await fetchLotteryResults('irish-lotto');
  return (
    <GamePage
      game={IRISH_LOTTO}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
