import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getResultsByGame, calculateFrequency } from '@/lib/data/draws';
import NumberPageContent from '@/components/NumberPageContent';

const GAME_NAME = 'Thunderball';
const GAME_SLUG = 'thunderball';
const GAME_COLOR = '#DC2626';
const GAME_FLAG = '🇬🇧';
const MAX_NUM = 39;

type Props = { params: Promise<{ num: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { num } = await params;
  return {
    title: `${GAME_NAME} Number ${num} — Frequency Statistics & Analysis`,
    description: `Detailed statistical analysis of number ${num} in ${GAME_NAME}. View draw frequency, rank, last appearance, and historical patterns for number ${num}.`,
  };
}

export async function generateStaticParams() {
  return Array.from({ length: MAX_NUM }, (_, i) => ({ num: String(i + 1) }));
}

export default async function NumberPage({ params }: Props) {
  const { num } = await params;
  const n = parseInt(num);
  if (isNaN(n) || n < 1 || n > MAX_NUM) notFound();

  const results = getResultsByGame(GAME_SLUG, 100);
  const freq = calculateFrequency(GAME_SLUG);
  const numFreq = freq.find((f) => f.number === n);
  const totalDraws = results.length;
  const frequency = numFreq?.count || 0;
  const percentage = totalDraws > 0 ? Math.round((frequency / totalDraws) * 100) : 0;
  const rank = freq.findIndex((f) => f.number === n) + 1 || MAX_NUM;
  const avgFreq = totalDraws > 0 ? freq.reduce((sum, f) => sum + f.count, 0) / freq.length : 0;
  const ratio = avgFreq > 0 ? frequency / avgFreq : 1;
  const status = ratio >= 1.3 ? 'hot' : ratio >= 1.1 ? 'warm' : ratio <= 0.7 ? 'cold' : ratio <= 0.9 ? 'cool' : 'neutral';
  const lastDrawn = numFreq?.lastDrawn || '';
  const recentAppearances = results
    .filter((r) => r.numbers.includes(n))
    .slice(0, 5)
    .map((r) => ({ date: r.drawDate, numbers: r.numbers }));

  return (
    <NumberPageContent
      gameName={GAME_NAME} gameSlug={GAME_SLUG} gameColor={GAME_COLOR}
      flag={GAME_FLAG} number={n} maxNumber={MAX_NUM}
      totalDraws={totalDraws} frequency={frequency} percentage={percentage}
      rank={rank} status={status as 'hot'|'warm'|'neutral'|'cool'|'cold'}
      lastDrawn={lastDrawn} recentAppearances={recentAppearances}
    />
  );
}
