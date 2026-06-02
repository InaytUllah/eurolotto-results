import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultDateSEO } from '@/lib/data/seo';
import { SPANISH_LOTTERY } from '@/lib/data/games';
import { getResultByDate, getRecentDates } from '@/lib/data/draws';
import GameResultPage from '@/components/GameResultPage';

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const result = getResultByDate('spanish-lottery', date);
  const seo = getResultDateSEO(SPANISH_LOTTERY.name, date, result?.numbers);
  return { title: seo.title, description: seo.description };
}

export async function generateStaticParams() {
  return getRecentDates('spanish-lottery').map((date) => ({ date }));
}

export default async function SpanishLotteryResultPage({ params }: Props) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const result = getResultByDate('spanish-lottery', date);
  return <GameResultPage game={SPANISH_LOTTERY} result={result} date={date} />;
}
