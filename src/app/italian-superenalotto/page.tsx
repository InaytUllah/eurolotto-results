import { Metadata } from 'next';
import { getGameSEO } from '@/lib/data/seo';
import { ITALIAN_SUPERENALOTTO } from '@/lib/data/games';
import { fetchLotteryResults } from '@/lib/api/lottery-api';
import GamePage from '@/components/GamePage';

const seo = getGameSEO(ITALIAN_SUPERENALOTTO.name, ITALIAN_SUPERENALOTTO.slug);
export const metadata: Metadata = { title: seo.title, description: seo.description, keywords: seo.keywords };

export default async function ItalianSuperEnalottoPage() {
  const results = await fetchLotteryResults('italian-superenalotto');
  return (
    <GamePage
      game={ITALIAN_SUPERENALOTTO}
      latestResult={results[0]}
      pastResults={results}
    />
  );
}
