import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultDateSEO } from '@/lib/data/seo';
import { THUNDERBALL } from '@/lib/data/games';
import { getResultByDate, getRecentDates } from '@/lib/data/draws';
import GameResultPage from '@/components/GameResultPage';

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const result = getResultByDate('thunderball', date);
  const seo = getResultDateSEO(THUNDERBALL.name, date, result?.numbers);
  return { title: seo.title, description: seo.description };
}

export async function generateStaticParams() {
  return getRecentDates('thunderball').map((date) => ({ date }));
}

export default async function ThunderballResultPage({ params }: Props) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const result = getResultByDate('thunderball', date);
  return <GameResultPage game={THUNDERBALL} result={result} date={date} />;
}
