'use client';

import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate?: string;
  drawTime: string;
  timezone: string;
  label: string;
  color: string;
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function getNextDraw(drawTime: string, _timezone: string): Date {
  const now = new Date();
  const [hours, minutes] = drawTime.split(':').map(Number);

  for (let i = 0; i < 14; i++) {
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + i);
    candidate.setHours(hours, minutes, 0, 0);
    if (candidate > now) return candidate;
  }

  const fallback = new Date(now);
  fallback.setDate(fallback.getDate() + 1);
  fallback.setHours(hours, minutes, 0, 0);
  return fallback;
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3.5rem]"
        aria-label={`${value} ${label}`}
      >
        <span className="text-2xl sm:text-3xl font-bold tabular-nums motion-reduce:transition-none">
          {value}
        </span>
      </div>
      <p className="text-xs mt-1 opacity-80">{label}</p>
    </div>
  );
}

export default function Countdown({ targetDate, drawTime, timezone, label, color }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = targetDate
      ? new Date(targetDate + `T${drawTime}:00`)
      : getNextDraw(drawTime, timezone);

    function updateCountdown() {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate, drawTime, timezone]);

  const gradientBg = `linear-gradient(135deg, ${color}, ${adjustColor(color, -30)})`;

  const renderBlocks = (values: { value: string; label: string }[]) => (
    <div className="flex justify-center gap-3 mt-3">
      {values.map((item, i) => (
        <TimeBlock key={i} value={item.value} label={item.label} />
      ))}
    </div>
  );

  const placeholder = [
    { value: '--', label: 'Days' },
    { value: '--', label: 'Hrs' },
    { value: '--', label: 'Min' },
    { value: '--', label: 'Sec' },
  ];

  if (!mounted) {
    return (
      <div
        className="rounded-xl p-5 text-white text-center shadow-lg"
        style={{ background: gradientBg }}
        role="timer"
        aria-label={label}
      >
        <p className="text-sm font-medium opacity-90">{label}</p>
        {renderBlocks(placeholder)}
      </div>
    );
  }

  const values = [
    { value: String(timeLeft.days).padStart(2, '0'), label: 'Days' },
    { value: String(timeLeft.hours).padStart(2, '0'), label: 'Hrs' },
    { value: String(timeLeft.minutes).padStart(2, '0'), label: 'Min' },
    { value: String(timeLeft.seconds).padStart(2, '0'), label: 'Sec' },
  ];

  return (
    <div
      className="rounded-xl p-5 text-white text-center shadow-lg"
      style={{ background: gradientBg }}
      role="timer"
      aria-label={label}
      aria-live="polite"
    >
      <p className="text-sm font-medium opacity-90">{label}</p>
      {renderBlocks(values)}
    </div>
  );
}
