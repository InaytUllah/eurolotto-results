'use client';

interface LotteryBallsProps {
  numbers: number[];
  bonusBalls?: number[];
  bonusBallName?: string;
  size?: 'sm' | 'md' | 'lg';
  gameColor?: string;
  animated?: boolean;
}

function getBallColor(num: number, gameColor?: string): string {
  if (gameColor) return gameColor;
  if (num <= 10) return '#3B82F6';
  if (num <= 20) return '#8B5CF6';
  if (num <= 30) return '#EC4899';
  if (num <= 40) return '#F97316';
  return '#10B981';
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const sizeConfig = {
  sm: { classes: 'w-9 h-9 text-sm', shadow: '0 2px 4px' },
  md: { classes: 'w-12 h-12 text-base', shadow: '0 3px 6px' },
  lg: { classes: 'w-16 h-16 text-xl', shadow: '0 4px 8px' },
};

export default function LotteryBalls({
  numbers,
  bonusBalls,
  bonusBallName = 'Bonus Ball',
  size = 'md',
  gameColor,
  animated = true,
}: LotteryBallsProps) {
  const config = sizeConfig[size];

  return (
    <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Drawn numbers">
      {numbers.map((num, i) => {
        const color = getBallColor(num, gameColor);
        return (
          <div
            key={`main-${i}`}
            role="listitem"
            aria-label={`Number ${num}`}
            className={`${config.classes} rounded-full flex items-center justify-center font-bold text-white motion-reduce:animate-none ${animated ? 'animate-[ballPop_0.4s_ease-out_forwards]' : ''}`}
            style={{
              background: `linear-gradient(145deg, ${adjustColor(color, 50)}, ${color}, ${adjustColor(color, -50)})`,
              boxShadow: `${config.shadow} ${adjustColor(color, -60)}80, inset 0 1px 2px ${adjustColor(color, 60)}40`,
              animationDelay: animated ? `${i * 0.08}s` : undefined,
              opacity: animated ? 0 : 1,
              animationFillMode: animated ? 'forwards' : undefined,
            }}
          >
            {num}
          </div>
        );
      })}

      {bonusBalls && bonusBalls.length > 0 && (
        <>
          <div className="mx-1 text-gray-400 font-bold" aria-hidden="true">+</div>
          {bonusBalls.map((num, i) => (
            <div
              key={`bonus-${i}`}
              role="listitem"
              aria-label={`${bonusBallName} ${num}`}
              className={`${config.classes} rounded-full flex items-center justify-center font-bold text-white motion-reduce:animate-none ${animated ? 'animate-[ballPop_0.4s_ease-out_forwards]' : ''}`}
              style={{
                background: 'linear-gradient(145deg, #FCD34D, #F59E0B, #D97706)',
                boxShadow: `${config.shadow} #92400E80, inset 0 1px 2px #FDE68A40`,
                animationDelay: animated ? `${(numbers.length + i) * 0.08}s` : undefined,
                opacity: animated ? 0 : 1,
                animationFillMode: animated ? 'forwards' : undefined,
              }}
            >
              {num}
            </div>
          ))}
        </>
      )}

      {/* Keyframe injection for ball pop animation */}
      {animated && (
        <style jsx>{`
          @keyframes ballPop {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            60% {
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes ballPop {
              0% {
                opacity: 1;
                transform: scale(1);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
          }
        `}</style>
      )}
    </div>
  );
}
