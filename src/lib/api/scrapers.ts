/**
 * Lottery result scrapers for each data source.
 * Each scraper fetches results from a specific public source and returns
 * normalised LotteryResult[] objects.
 */

import type { LotteryResult } from '../types';

// ---------------------------------------------------------------------------
// UK National Lottery CSV / XML endpoints
// Covers: EuroMillions, UK Lotto, Thunderball, Set for Life
// ---------------------------------------------------------------------------

interface NLDrawRow {
  drawNumber: string;
  drawDate: string;
  balls: number[];
  bonusBalls: number[];
  jackpotAmount?: string;
}

function parseNationalLotteryXml(
  xml: string,
  config: {
    gameName: string;
    gameSlug: string;
    mainCount: number;
    bonusBallName?: string;
    bonusCount: number;
  }
): LotteryResult[] {
  const results: LotteryResult[] = [];
  const drawMap = new Map<string, NLDrawRow>();

  // The NL endpoint returns XML with <draw> elements
  // Each draw has multiple rows (one per prize tier)
  // We only need unique draw dates with their numbers

  // Extract draw data using regex (lightweight, no XML parser needed)
  const drawDateRegex = /<DrawDate>([^<]+)<\/DrawDate>/g;
  const ballRegex = /<Ball(\d+)>(\d+)<\/Ball\d+>/g;
  const bonusRegex = /<(?:BonusBall|LuckyStar|LifeBall|ThunderBall)(\d*)>(\d+)<\/(?:BonusBall|LuckyStar|LifeBall|ThunderBall)\d*>/gi;
  const jackpotRegex = /<DrawNumber>(\d+)<\/DrawNumber>/g;

  // Split by draw sections
  const drawSections = xml.split(/<\/Draw>/i);

  for (const section of drawSections) {
    const dateMatch = /<DrawDate>([^<]+)<\/DrawDate>/i.exec(section);
    if (!dateMatch) continue;

    const rawDate = dateMatch[1].trim();
    // Parse date - NL uses DD-MMM-YYYY or YYYY-MM-DD format
    let drawDate: string;
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) continue;
      drawDate = d.toISOString().split('T')[0];
    } catch {
      continue;
    }

    if (drawMap.has(drawDate)) continue;

    // Extract main balls
    const balls: number[] = [];
    let ballMatch;
    const ballRegexLocal = /Ball(\d+)>(\d+)/gi;
    while ((ballMatch = ballRegexLocal.exec(section)) !== null) {
      const idx = parseInt(ballMatch[1], 10);
      const val = parseInt(ballMatch[2], 10);
      if (idx <= config.mainCount && !isNaN(val)) {
        balls[idx - 1] = val;
      }
    }

    // Extract bonus balls
    const bonusBalls: number[] = [];
    const bonusPatterns = [
      /BonusBall>(\d+)/gi,
      /LuckyStar(\d*)>(\d+)/gi,
      /LifeBall>(\d+)/gi,
      /ThunderBall>(\d+)/gi,
    ];

    for (const pattern of bonusPatterns) {
      let bMatch;
      while ((bMatch = pattern.exec(section)) !== null) {
        const val = parseInt(bMatch[bMatch.length - 1], 10);
        if (!isNaN(val) && !bonusBalls.includes(val)) {
          bonusBalls.push(val);
        }
      }
    }

    // Extract jackpot (top tier prize)
    const jackpotMatch = /TopValAmount>([^<]+)/i.exec(section) ||
      /Tier1Value>([^<]+)/i.exec(section);

    const validBalls = balls.filter((b) => b !== undefined && !isNaN(b));

    if (validBalls.length >= config.mainCount) {
      drawMap.set(drawDate, {
        drawNumber: '',
        drawDate,
        balls: validBalls.slice(0, config.mainCount),
        bonusBalls: bonusBalls.slice(0, config.bonusCount),
        jackpotAmount: jackpotMatch?.[1],
      });
    }
  }

  // Convert map to results, sorted by date descending
  const sortedDates = Array.from(drawMap.keys()).sort((a, b) => b.localeCompare(a));

  for (const date of sortedDates.slice(0, 20)) {
    const row = drawMap.get(date)!;
    results.push({
      game: config.gameName,
      gameSlug: config.gameSlug,
      drawDate: row.drawDate,
      numbers: row.balls,
      bonusBalls: row.bonusBalls.length > 0 ? row.bonusBalls : undefined,
      bonusBallName: config.bonusBallName,
      jackpot: row.jackpotAmount ? formatJackpot(row.jackpotAmount, config.gameSlug) : undefined,
    });
  }

  return results;
}

function formatJackpot(amount: string, gameSlug: string): string {
  const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num === 0) return '';

  const currency = gameSlug === 'euromillions' ? '€' : '£';

  if (num >= 1_000_000) {
    return `${currency}${(num / 1_000_000).toFixed(0)} Million`;
  }
  return `${currency}${num.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Individual game scrapers using NL endpoints

export async function scrapeEuroMillionsNL(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.national-lottery.co.uk/results/euromillions/draw-history/csv', {
      headers: { Accept: '*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseNationalLotteryXml(text, {
      gameName: 'EuroMillions',
      gameSlug: 'euromillions',
      mainCount: 5,
      bonusBallName: 'Lucky Stars',
      bonusCount: 2,
    });
  } catch {
    return [];
  }
}

export async function scrapeUkLottoNL(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.national-lottery.co.uk/results/lotto/draw-history/csv', {
      headers: { Accept: '*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseNationalLotteryXml(text, {
      gameName: 'UK Lotto',
      gameSlug: 'uk-lotto',
      mainCount: 6,
      bonusBallName: 'Bonus Ball',
      bonusCount: 1,
    });
  } catch {
    return [];
  }
}

export async function scrapeThunderballNL(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.national-lottery.co.uk/results/thunderball/draw-history/csv', {
      headers: { Accept: '*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseNationalLotteryXml(text, {
      gameName: 'Thunderball',
      gameSlug: 'thunderball',
      mainCount: 5,
      bonusBallName: 'Thunderball',
      bonusCount: 1,
    });
  } catch {
    return [];
  }
}

export async function scrapeSetForLifeNL(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.national-lottery.co.uk/results/set-for-life/draw-history/csv', {
      headers: { Accept: '*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseNationalLotteryXml(text, {
      gameName: 'Set for Life',
      gameSlug: 'set-for-life',
      mainCount: 5,
      bonusBallName: 'Life Ball',
      bonusCount: 1,
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// euro-millions.com HTML scraping
// Covers: EuroMillions (backup), EuroJackpot
// ---------------------------------------------------------------------------

function extractNumbersFromHtml(html: string, cssClassOrPattern: RegExp): number[] {
  const numbers: number[] = [];
  let match;
  while ((match = cssClassOrPattern.exec(html)) !== null) {
    const num = parseInt(match[1], 10);
    if (!isNaN(num)) numbers.push(num);
  }
  return numbers;
}

export async function scrapeEuroMillionsWeb(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.euro-millions.com/results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EuroLottoResults/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    // Extract results from the HTML
    // The page typically has results in structured elements
    const results: LotteryResult[] = [];

    // Look for result blocks with dates and numbers
    // Pattern: date followed by ball numbers
    const datePattern = /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;
    const ballPattern = /class="[^"]*ball[^"]*"[^>]*>(\d+)</gi;

    // Simple extraction - look for the latest result section
    const mainBallPattern = /(?:main|result).*?(?:(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+))/i;
    const starsPattern = /(?:star|lucky).*?(?:(\d+)\s*,?\s*(\d+))/i;

    let dateMatch;
    while ((dateMatch = datePattern.exec(html)) !== null) {
      const day = dateMatch[1];
      const month = dateMatch[2];
      const year = dateMatch[3];
      const dateStr = new Date(`${day} ${month} ${year}`);
      if (isNaN(dateStr.getTime())) continue;

      const drawDate = dateStr.toISOString().split('T')[0];

      // Look for numbers near this date in the HTML
      const pos = dateMatch.index;
      const section = html.substring(pos, pos + 2000);

      const nums = extractNumbersFromHtml(section, /class="[^"]*ball[^"]*"[^>]*>\s*(\d+)/gi);

      if (nums.length >= 7) {
        results.push({
          game: 'EuroMillions',
          gameSlug: 'euromillions',
          drawDate,
          numbers: nums.slice(0, 5),
          bonusBalls: nums.slice(5, 7),
          bonusBallName: 'Lucky Stars',
        });
      }

      if (results.length >= 10) break;
    }

    return results;
  } catch {
    return [];
  }
}

export async function scrapeEuroJackpotWeb(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.euro-millions.com/eurojackpot-results', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EuroLottoResults/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const results: LotteryResult[] = [];
    const datePattern = /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;

    let dateMatch;
    while ((dateMatch = datePattern.exec(html)) !== null) {
      const dateStr = new Date(`${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`);
      if (isNaN(dateStr.getTime())) continue;

      const drawDate = dateStr.toISOString().split('T')[0];
      const pos = dateMatch.index;
      const section = html.substring(pos, pos + 2000);

      const nums = extractNumbersFromHtml(section, /class="[^"]*ball[^"]*"[^>]*>\s*(\d+)/gi);

      if (nums.length >= 7) {
        results.push({
          game: 'EuroJackpot',
          gameSlug: 'eurojackpot',
          drawDate,
          numbers: nums.slice(0, 5),
          bonusBalls: nums.slice(5, 7),
          bonusBallName: 'Euro Numbers',
        });
      }

      if (results.length >= 10) break;
    }

    return results;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// FDJ (French Loto) scraping
// ---------------------------------------------------------------------------

export async function scrapeFrenchLoto(): Promise<LotteryResult[]> {
  try {
    const res = await fetch('https://www.fdj.fr/jeux-de-tirage/loto/resultats', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EuroLottoResults/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const html = await res.text();

    const results: LotteryResult[] = [];

    // FDJ page has structured result data
    // Look for draw dates and ball numbers
    const datePattern = /(\d{2})\/(\d{2})\/(\d{4})/g;

    let dateMatch;
    while ((dateMatch = datePattern.exec(html)) !== null) {
      const drawDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
      const d = new Date(drawDate);
      if (isNaN(d.getTime())) continue;

      const pos = dateMatch.index;
      const section = html.substring(Math.max(0, pos - 500), pos + 2000);

      const nums = extractNumbersFromHtml(section, /class="[^"]*(?:ball|numero|boule)[^"]*"[^>]*>\s*(\d+)/gi);

      if (nums.length >= 6) {
        results.push({
          game: 'French Loto',
          gameSlug: 'french-loto',
          drawDate,
          numbers: nums.slice(0, 5),
          bonusBalls: [nums[5]],
          bonusBallName: 'Chance Number',
        });
      }

      if (results.length >= 10) break;
    }

    return results;
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Master fetch function - tries all sources per game
// ---------------------------------------------------------------------------

export type ScraperFunction = () => Promise<LotteryResult[]>;

export const GAME_SCRAPERS: Record<string, ScraperFunction[]> = {
  euromillions: [scrapeEuroMillionsNL, scrapeEuroMillionsWeb],
  eurojackpot: [scrapeEuroJackpotWeb],
  'uk-lotto': [scrapeUkLottoNL],
  thunderball: [scrapeThunderballNL],
  'set-for-life': [scrapeSetForLifeNL],
  'irish-lotto': [], // No reliable free source found - uses stored data
  'french-loto': [scrapeFrenchLoto],
  'spanish-lottery': [], // No reliable free source found - uses stored data
  'german-lotto': [], // Dynamic JS rendering blocks scraping - uses stored data
  'italian-superenalotto': [], // 403 blocked - uses stored data
};

export async function scrapeGameResults(gameSlug: string): Promise<LotteryResult[]> {
  const scrapers = GAME_SCRAPERS[gameSlug] || [];

  for (const scraper of scrapers) {
    try {
      const results = await scraper();
      if (results.length > 0) {
        // Validate results
        const valid = results.filter(
          (r) => r.drawDate && r.numbers.length > 0 && r.numbers.every((n) => n > 0)
        );
        if (valid.length > 0) return valid;
      }
    } catch {
      // Try next scraper
    }
  }

  return [];
}
