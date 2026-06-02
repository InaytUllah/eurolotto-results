import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultDateSEO } from '@/lib/data/seo';
import { IRISH_LOTTO } from '@/lib/data/games';
import { getResultByDate, getRecentDates } from '@/lib/data/draws';
import GameResultPage from '@/components/GameResultPage';

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const result = getResultByDate('irish-lotto', date);
  const seo = getResultDateSEO(IRISH_LOTTO.name, date, result?.numbers);
  return { title: seo.title, description: seo.description };
}

export async function generateStaticParams() {
  return getRecentDates('irish-lotto').map((date) => ({ date }));
}

export default async function IrishLottoResultPage({ params }: Props) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const result = getResultByDate('irish-lotto', date);
  return <GameResultPage game={IRISH_LOTTO} result={result} date={date} />;
}
