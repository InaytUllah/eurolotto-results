import Link from 'next/link';
import { LotteryResult, GameConfig } from '@/lib/types';
import LotteryBalls from './LotteryBalls';

interface ResultCardProps {
  result: LotteryResult;
  gameConfig?: GameConfig;
  showLink?: boolean;
  featured?: boolean;
}

export default function ResultCard({
  result,
  gameConfig,
  showLink = true,
  featured = false,
}: ResultCardProps) {
  const formattedDate = new Date(result.drawDate + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const resultUrl = `/${result.gameSlug}/results/${result.drawDate}`;

  const cardContent = (
    <div
      className={`rounded-xl border transition-all duration-200 bg-white ${
        featured
          ? 'border-transparent shadow-xl p-6 sm:p-8'
          : 'border-gray-200 shadow-md hover:shadow-lg p-4 sm:p-5'
      }`}
      style={featured && gameConfig ? { borderTop: `4px solid ${gameConfig.color}` } : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`font-bold ${featured ? 'text-xl' : 'text-lg'} text-gray-900`}>
            {gameConfig?.flag && (
              <span className="mr-2" aria-hidden="true">{gameConfig.flag}</span>
            )}
            {result.game}
          </h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        {result.jackpot && (
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full text-white shrink-0"
            style={{ backgroundColor: gameConfig?.color || '#1E3A8A' }}
            aria-label={`Jackpot: ${result.jackpot}`}
          >
            {result.jackpot}
          </span>
        )}
      </div>

      <LotteryBalls
        numbers={result.numbers}
        bonusBalls={result.bonusBalls}
        bonusBallName={result.bonusBallName}
        size={featured ? 'lg' : 'md'}
        gameColor={gameConfig?.color}
        animated={featured}
      />

      {result.bonusBallName && result.bonusBalls && (
        <p className="text-xs text-gray-500 mt-2">
          {result.bonusBallName}: {result.bonusBalls.join(', ')}
        </p>
      )}

      {result.nextJackpot && (
        <p className="text-sm text-gray-600 mt-3">
          Next Jackpot: <span className="font-semibold">{result.nextJackpot}</span>
        </p>
      )}
    </div>
  );

  if (showLink) {
    return (
      <Link
        href={resultUrl}
        className="block group"
        aria-label={`View ${result.game} results for ${formattedDate}${result.jackpot ? `, jackpot ${result.jackpot}` : ''}`}
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
