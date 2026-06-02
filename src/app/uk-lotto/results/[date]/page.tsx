import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultDateSEO } from '@/lib/data/seo';
import { UK_LOTTO } from '@/lib/data/games';
import { getResultByDate, getRecentDates } from '@/lib/data/draws';
import GameResultPage from '@/components/GameResultPage';

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const result = getResultByDate('uk-lotto', date);
  const seo = getResultDateSEO(UK_LOTTO.name, date, result?.numbers);
  return { title: seo.title, description: seo.description };
}

export async function generateStaticParams() {
  return getRecentDates('uk-lotto').map((date) => ({ date }));
}

export default async function UKLottoResultPage({ params }: Props) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const result = getResultByDate('uk-lotto', date);
  return <GameResultPage game={UK_LOTTO} result={result} date={date} />;
}
