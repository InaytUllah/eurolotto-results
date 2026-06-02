import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultDateSEO } from '@/lib/data/seo';
import { SET_FOR_LIFE } from '@/lib/data/games';
import { getResultByDate, getRecentDates } from '@/lib/data/draws';
import GameResultPage from '@/components/GameResultPage';

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const result = getResultByDate('set-for-life', date);
  const seo = getResultDateSEO(SET_FOR_LIFE.name, date, result?.numbers);
  return { title: seo.title, description: seo.description };
}

export async function generateStaticParams() {
  return getRecentDates('set-for-life').map((date) => ({ date }));
}

export default async function SetForLifeResultPage({ params }: Props) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const result = getResultByDate('set-for-life', date);
  return <GameResultPage game={SET_FOR_LIFE} result={result} date={date} />;
}
