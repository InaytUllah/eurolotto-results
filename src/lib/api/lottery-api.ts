import type { LotteryResult } from '../types';
import { getResultsByGame } from '../data/draws';
import { getGameBySlug } from '../data/games';

// ---------------------------------------------------------------------------
// Cache layer - 5 minute TTL
// ---------------------------------------------------------------------------

interface CacheEntry {
  data: LotteryResult[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): LotteryResult[] | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: LotteryResult[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// ---------------------------------------------------------------------------
// Date formatting helpers
// ---------------------------------------------------------------------------

export function formatDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// National Lottery CSV/XML parser
// Works for: EuroMillions, UK Lotto, Thunderball, Set for Life
// ---------------------------------------------------------------------------

interface NLGameConfig {
  gameName: string;
  gameSlug: string;
  mainCount: number;
  bonusBallName: string;
  bonusCount: number;
  currency: string;
}

function parseNationalLotteryResponse(
  text: string,
  config: NLGameConfig
): LotteryResult[] {
  const results: LotteryResult[] = [];
  const seenDates = new Set<string>();

  // The NL endpoint can return CSV or XML. Handle both formats.

  // Try CSV format first (comma-separated values)
  const lines = text.split('\n').filter((l) => l.trim().length > 0);

  for (const line of lines) {
    const parts = line.split(',').map((p) => p.trim());

    // Need at least: drawNumber, date, machine, N balls, M bonus balls
    // Minimum columns: 3 + mainCount + bonusCount
    if (parts.length < 3 + config.mainCount + config.bonusCount) continue;

    // Try to parse date from second column (YYYY-MM-DD format)
    const dateStr = parts[1];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;

    // Skip if we've already seen this date (multiple tier rows per draw)
    if (seenDates.has(dateStr)) continue;
    seenDates.add(dateStr);

    // Extract main balls (columns after machine name)
    const ballStartIdx = 3; // After drawNumber, date, machine
    const mainBalls: number[] = [];
    for (let i = ballStartIdx; i < ballStartIdx + config.mainCount; i++) {
      const num = parseInt(parts[i], 10);
      if (!isNaN(num) && num > 0) mainBalls.push(num);
    }

    // Extract bonus balls
    const bonusStartIdx = ballStartIdx + config.mainCount;
    const bonusBalls: number[] = [];
    for (let i = bonusStartIdx; i < bonusStartIdx + config.bonusCount; i++) {
      const num = parseInt(parts[i], 10);
      if (!isNaN(num) && num >= 0) bonusBalls.push(num);
    }

    if (mainBalls.length === config.mainCount) {
      // Try to find jackpot amount in remaining columns
      let jackpot: string | undefined;
      // Look for a large number that could be the jackpot (tier 1 value)
      // Tier layout: after bonus balls, there's tier number, winners count, prize value
      const tierIdx = bonusStartIdx + config.bonusCount;
      if (parts.length > tierIdx + 2) {
        const tierNum = parseInt(parts[tierIdx], 10);
        const tierValue = parseFloat(parts[tierIdx + 2]);
        if (tierNum === 1 && tierValue > 0) {
          jackpot = formatJackpotAmount(tierValue, config.currency);
        }
      }

      results.push({
        game: config.gameName,
        gameSlug: config.gameSlug,
        drawDate: dateStr,
        numbers: mainBalls,
        bonusBalls: bonusBalls.length > 0 ? bonusBalls : undefined,
        bonusBallName: config.bonusBallName,
        jackpot,
      });
    }
  }

  // If CSV parsing didn't work, try XML format
  if (results.length === 0) {
    return parseNationalLotteryXml(text, config);
  }

  return results.slice(0, 20);
}

function parseNationalLotteryXml(
  xml: string,
  config: NLGameConfig
): LotteryResult[] {
  const results: LotteryResult[] = [];
  const seenDates = new Set<string>();

  // Actual NL XML format (confirmed):
  // <draw-date>2026-03-17</draw-date>
  // <ball number="1">5</ball>
  // <bonus-ball type="luckystar" number="1">3</bonus-ball>
  // <bonus-ball>19</bonus-ball> (for UK Lotto)

  // Find all draw-date occurrences and extract surrounding context
  const dateRegex = /<draw-date>(\d{4}-\d{2}-\d{2})<\/draw-date>/gi;
  let dateMatch;

  while ((dateMatch = dateRegex.exec(xml)) !== null) {
    const drawDate = dateMatch[1];
    if (seenDates.has(drawDate)) continue;
    seenDates.add(drawDate);

    // Get a large section around this date to find balls and prizes
    const startPos = Math.max(0, dateMatch.index - 200);
    const endPos = Math.min(xml.length, dateMatch.index + 5000);
    const section = xml.substring(startPos, endPos);

    // Extract main balls: <ball number="1">5</ball>
    const mainBalls: number[] = [];
    const ballRegex = /<ball\s+number="(\d+)">(\d+)<\/ball>/gi;
    let ballMatch;
    while ((ballMatch = ballRegex.exec(section)) !== null) {
      const idx = parseInt(ballMatch[1], 10);
      const val = parseInt(ballMatch[2], 10);
      if (idx >= 1 && idx <= config.mainCount && !isNaN(val)) {
        mainBalls[idx - 1] = val;
      }
    }

    // Extract bonus balls: <bonus-ball type="luckystar" number="1">3</bonus-ball>
    // or: <bonus-ball>19</bonus-ball>
    const bonusBalls: number[] = [];
    const bonusRegex = /<bonus-ball[^>]*>(\d+)<\/bonus-ball>/gi;
    let bonusMatch;
    while ((bonusMatch = bonusRegex.exec(section)) !== null) {
      const val = parseInt(bonusMatch[1], 10);
      if (!isNaN(val) && bonusBalls.length < config.bonusCount) {
        bonusBalls.push(val);
      }
    }

    // Extract jackpot from prize tier 1
    let jackpot: string | undefined;
    // Look for prize tier level 1 with a win value
    const tierMatch = /prize-tier\s+level="1"[^>]*>[\s\S]*?<number-of-winners>(\d+)<\/number-of-winners>[\s\S]*?<\/prize-tier>/i.exec(section);
    // Also look for top-prize or jackpot tags
    const jpAmountMatch = /<top-prize[^>]*>([^<]+)<\/top-prize>/i.exec(section) ||
      /<jackpot[^>]*>([^<]+)<\/jackpot>/i.exec(section);
    if (jpAmountMatch) {
      const val = parseFloat(jpAmountMatch[1].replace(/[^0-9.]/g, ''));
      if (val > 0) jackpot = formatJackpotAmount(val, config.currency);
    }

    // Filter out any undefined entries from mainBalls
    const validBalls = mainBalls.filter((b) => b !== undefined && !isNaN(b));

    if (validBalls.length === config.mainCount) {
      results.push({
        game: config.gameName,
        gameSlug: config.gameSlug,
        drawDate,
        numbers: validBalls,
        bonusBalls: bonusBalls.length > 0 ? bonusBalls : undefined,
        bonusBallName: config.bonusBallName,
        jackpot,
      });
    }
  }

  // Sort by date descending
  results.sort((a, b) => b.drawDate.localeCompare(a.drawDate));
  return results.slice(0, 20);
}

function formatJackpotAmount(amount: number, currency: string): string {
  if (amount >= 1_000_000) {
    const millions = Math.round(amount / 1_000_000);
    return `${currency}${millions},000,000`;
  }
  if (amount >= 1000) {
    return `${currency}${amount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
  }
  return `${currency}${amount}`;
}

// ---------------------------------------------------------------------------
// HTML page parsers for lottery result websites
// ---------------------------------------------------------------------------

interface HtmlParserConfig {
  gameName: string;
  gameSlug: string;
  mainCount: number;
  bonusCount: number;
  bonusBallName: string;
}

/**
 * Parser for euro-millions.com pages (EuroJackpot, EuroMillions backup).
 * Structure: dates as headings like "Tuesday 17th March 2026",
 * numbers in <li> elements within <ul> lists near each date.
 */
function parseEuroMillionsComPage(html: string, config: HtmlParserConfig): LotteryResult[] {
  const results: LotteryResult[] = [];

  // Match dates like "Tuesday 17th March 2026" or "Friday 13th March 2026"
  const dateRegex = /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2})(?:st|nd|rd|th)\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;

  let dateMatch;
  while ((dateMatch = dateRegex.exec(html)) !== null) {
    const day = parseInt(dateMatch[1], 10);
    const monthStr = dateMatch[2];
    const year = parseInt(dateMatch[3], 10);
    const d = new Date(`${monthStr} ${day}, ${year}`);
    if (isNaN(d.getTime())) continue;
    const drawDate = d.toISOString().split('T')[0];

    // Get section after this date to find numbers
    const sectionStart = dateMatch.index + dateMatch[0].length;
    const sectionEnd = Math.min(html.length, sectionStart + 3000);
    const section = html.substring(sectionStart, sectionEnd);

    // Extract numbers from <li> elements
    const nums: number[] = [];
    const liRegex = /<li[^>]*>\s*(\d+)\s*<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(section)) !== null) {
      nums.push(parseInt(liMatch[1], 10));
      if (nums.length >= config.mainCount + config.bonusCount) break;
    }

    if (nums.length >= config.mainCount + config.bonusCount) {
      results.push({
        game: config.gameName,
        gameSlug: config.gameSlug,
        drawDate,
        numbers: nums.slice(0, config.mainCount),
        bonusBalls: nums.slice(config.mainCount, config.mainCount + config.bonusCount),
        bonusBallName: config.bonusBallName,
      });
    }

    if (results.length >= 20) break;
  }

  return results;
}

/**
 * Parser for lotto.net pages (Irish Lotto, German Lotto).
 * Confirmed HTML structure:
 *   <div class="date">Wednesday <span>18 March 2026</span></div>
 *   <ul class="balls">
 *     <li class="ball ball"><span>16</span><div></div></li>
 *     <li class="ball bonus-ball"><span>43</span><div>Bonus </div></li>
 *     <li class="ball super-ball"><span>0</span><div>Super </div></li>
 *   </ul>
 *   <div class="jackpot"><div class="elem1">Jackpot <span>€3,711,847</span></div></div>
 */
function parseLottoNetPage(html: string, config: HtmlParserConfig): LotteryResult[] {
  const results: LotteryResult[] = [];

  // Find all date divs: <div class="date">Wednesday <span>18 March 2026</span></div>
  const dateRegex = /<div\s+class="date">[^<]*<span>(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})<\/span>/gi;

  let dateMatch;
  while ((dateMatch = dateRegex.exec(html)) !== null) {
    const day = parseInt(dateMatch[1], 10);
    const monthStr = dateMatch[2];
    const year = parseInt(dateMatch[3], 10);
    const d = new Date(`${monthStr} ${day}, ${year}`);
    if (isNaN(d.getTime())) continue;
    const drawDate = d.toISOString().split('T')[0];

    // Get section after this date (up to 2000 chars covers the balls and jackpot)
    const sectionStart = dateMatch.index;
    const sectionEnd = Math.min(html.length, sectionStart + 2000);
    const section = html.substring(sectionStart, sectionEnd);

    // Extract main ball numbers: <li class="ball ball"><span>NUMBER</span>
    const mainNums: number[] = [];
    const mainBallRegex = /<li\s+class="ball ball"[^>]*><span>(\d+)<\/span>/gi;
    let bm;
    while ((bm = mainBallRegex.exec(section)) !== null) {
      mainNums.push(parseInt(bm[1], 10));
    }

    // Extract bonus ball: <li class="ball bonus-ball"><span>NUMBER</span>
    // or super ball: <li class="ball super-ball"><span>NUMBER</span>
    const bonusNums: number[] = [];
    const bonusBallRegex = /<li\s+class="ball (?:bonus-ball|super-ball)"[^>]*><span>(\d+)<\/span>/gi;
    let bbm;
    while ((bbm = bonusBallRegex.exec(section)) !== null) {
      bonusNums.push(parseInt(bbm[1], 10));
    }

    // Extract jackpot: <span>€3,711,847</span> inside jackpot div
    let jackpot: string | undefined;
    const jpMatch = /class="jackpot"[^>]*>[\s\S]*?<span>([^<]+)<\/span>/i.exec(section);
    if (jpMatch) {
      jackpot = jpMatch[1].trim();
    }

    if (mainNums.length >= config.mainCount) {
      results.push({
        game: config.gameName,
        gameSlug: config.gameSlug,
        drawDate,
        numbers: mainNums.slice(0, config.mainCount),
        bonusBalls: bonusNums.length > 0 ? bonusNums.slice(0, config.bonusCount) : undefined,
        bonusBallName: config.bonusBallName,
        jackpot,
      });
    }

    if (results.length >= 20) break;
  }

  return results;
}

/**
 * Parser for superenalotto.net/en/results page.
 * Confirmed HTML structure:
 *   <td class="date">Thursday</span> 19<sup>th</sup> March</td>  (year in separate context)
 *   <td class="ballCell"><ul class="balls"><li>3</li><li>11</li>...</ul></td>
 *   <td class="ballCell"><ul class="balls"><li class="jolly">88</li></ul></td>
 *   <td class="ballCell"><ul class="balls"><li class="superstar">43</li></ul></td>
 *
 * The page shows results in table rows. Dates use ordinal suffixes (1st, 2nd, 3rd, 4th, etc.)
 */
function parseSuperEnalottoPage(html: string): LotteryResult[] {
  const results: LotteryResult[] = [];

  // Match dates: "Thursday</span> 19<sup>th</sup> March" or plain "Thursday 19th March 2026"
  // The year may or may not be present in the immediate date element
  const dateRegex = /(?:<span>)?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)<\/span>\s*(\d{1,2})<sup>[a-z]{2}<\/sup>\s*(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s*(\d{4}))?/gi;

  // Also try plain text dates
  const plainDateRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2})(?:st|nd|rd|th)\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(\d{4}))?/gi;

  // Collect all date positions
  const datePositions: { date: string; pos: number }[] = [];

  for (const regex of [dateRegex, plainDateRegex]) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      const day = parseInt(match[2], 10);
      const monthStr = match[3];
      // Year might not be present - default to current year
      const year = match[4] ? parseInt(match[4], 10) : new Date().getFullYear();
      const d = new Date(`${monthStr} ${day}, ${year}`);
      if (isNaN(d.getTime())) continue;
      const drawDate = d.toISOString().split('T')[0];
      datePositions.push({ date: drawDate, pos: match.index });
    }
  }

  // Deduplicate
  const seenDates = new Set<string>();
  const uniqueDates = datePositions.filter((dp) => {
    if (seenDates.has(dp.date)) return false;
    seenDates.add(dp.date);
    return true;
  });

  for (const dp of uniqueDates) {
    const sectionStart = dp.pos;
    const sectionEnd = Math.min(html.length, sectionStart + 2000);
    const section = html.substring(sectionStart, sectionEnd);

    // Extract main numbers: plain <li> without class inside ballCell
    const mainNums: number[] = [];
    // Match <li> that does NOT have a class attribute (main numbers)
    const mainRegex = /<li>(\d+)<\/li>/gi;
    let mm;
    while ((mm = mainRegex.exec(section)) !== null) {
      const n = parseInt(mm[1], 10);
      if (n >= 1 && n <= 90) {
        mainNums.push(n);
      }
      if (mainNums.length >= 6) break;
    }

    // Extract Jolly: <li class="jolly">NUMBER</li>
    let jollyNum: number | undefined;
    const jollyMatch = /<li\s+class="jolly">(\d+)<\/li>/i.exec(section);
    if (jollyMatch) {
      jollyNum = parseInt(jollyMatch[1], 10);
    }

    if (mainNums.length === 6) {
      results.push({
        game: 'Italian SuperEnalotto',
        gameSlug: 'italian-superenalotto',
        drawDate: dp.date,
        numbers: mainNums,
        bonusBalls: jollyNum ? [jollyNum] : undefined,
        bonusBallName: 'Jolly',
      });
    }

    if (results.length >= 20) break;
  }

  return results;
}

// ---------------------------------------------------------------------------
// Fetcher configurations per game
// ---------------------------------------------------------------------------

interface GameFetcher {
  url: string;
  parse: (text: string) => LotteryResult[];
}

const GAME_FETCHERS: Record<string, GameFetcher[]> = {
  euromillions: [
    {
      url: 'https://www.national-lottery.co.uk/results/euromillions/draw-history/csv',
      parse: (text) => parseNationalLotteryResponse(text, {
        gameName: 'EuroMillions',
        gameSlug: 'euromillions',
        mainCount: 5,
        bonusBallName: 'Lucky Stars',
        bonusCount: 2,
        currency: '€',
      }),
    },
  ],
  'uk-lotto': [
    {
      url: 'https://www.national-lottery.co.uk/results/lotto/draw-history/csv',
      parse: (text) => parseNationalLotteryResponse(text, {
        gameName: 'UK Lotto',
        gameSlug: 'uk-lotto',
        mainCount: 6,
        bonusBallName: 'Bonus Ball',
        bonusCount: 1,
        currency: '£',
      }),
    },
  ],
  thunderball: [
    {
      url: 'https://www.national-lottery.co.uk/results/thunderball/draw-history/csv',
      parse: (text) => parseNationalLotteryResponse(text, {
        gameName: 'Thunderball',
        gameSlug: 'thunderball',
        mainCount: 5,
        bonusBallName: 'Thunderball',
        bonusCount: 1,
        currency: '£',
      }),
    },
  ],
  'set-for-life': [
    {
      url: 'https://www.national-lottery.co.uk/results/set-for-life/draw-history/csv',
      parse: (text) => parseNationalLotteryResponse(text, {
        gameName: 'Set for Life',
        gameSlug: 'set-for-life',
        mainCount: 5,
        bonusBallName: 'Life Ball',
        bonusCount: 1,
        currency: '£',
      }),
    },
  ],
  eurojackpot: [
    {
      url: 'https://www.euro-millions.com/eurojackpot-results',
      parse: (html) => parseEuroMillionsComPage(html, {
        gameName: 'EuroJackpot',
        gameSlug: 'eurojackpot',
        mainCount: 5,
        bonusCount: 2,
        bonusBallName: 'Euro Numbers',
      }),
    },
  ],
  'irish-lotto': [
    {
      url: 'https://www.lotto.net/irish-lotto/results',
      parse: (html) => parseLottoNetPage(html, {
        gameName: 'Irish Lotto',
        gameSlug: 'irish-lotto',
        mainCount: 6,
        bonusCount: 1,
        bonusBallName: 'Bonus Ball',
      }),
    },
  ],
  'french-loto': [
    {
      url: 'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/resultats-loto-2019-a-aujourd-hui@agrall/records?limit=20&order_by=date_de_tirage+desc',
      parse: (text) => {
        const json = JSON.parse(text);
        const records: Array<{
          date_de_tirage: string;
          boule_1: number;
          boule_2: number;
          boule_3: number;
          boule_4: number;
          boule_5: number;
          numero_chance: number;
        }> = json.results || [];
        return records.map((r) => ({
          game: 'French Loto',
          gameSlug: 'french-loto' as const,
          drawDate: r.date_de_tirage.slice(0, 10),
          numbers: [r.boule_1, r.boule_2, r.boule_3, r.boule_4, r.boule_5],
          bonusBalls: [r.numero_chance],
          bonusBallName: 'Chance Number',
        }));
      },
    },
  ],
  'spanish-lottery': [], // No free scrapeable source found - all official sites return 403
  'german-lotto': [
    {
      url: 'https://www.lotto.net/german-lotto/results',
      parse: (html) => parseLottoNetPage(html, {
        gameName: 'German Lotto 6aus49',
        gameSlug: 'german-lotto',
        mainCount: 6,
        bonusCount: 1,
        bonusBallName: 'Superzahl',
      }),
    },
  ],
  'italian-superenalotto': [
    {
      url: 'https://www.superenalotto.net/en/results',
      parse: (html) => parseSuperEnalottoPage(html),
    },
  ],
};

// ---------------------------------------------------------------------------
// Main fetch function with multi-source fallback
// ---------------------------------------------------------------------------

export async function fetchLotteryResults(gameSlug: string): Promise<LotteryResult[]> {
  // 1. Check cache first
  const cached = getCached(gameSlug);
  if (cached) return cached;

  const game = getGameBySlug(gameSlug);
  if (!game) return [];

  const fetchers = GAME_FETCHERS[gameSlug] || [];

  // 2. Try each fetcher in order
  for (const fetcher of fetchers) {
    try {
      const response = await fetch(fetcher.url, {
        headers: {
          Accept: '*/*',
          'User-Agent': 'Mozilla/5.0 (compatible; EuroLottoResults/1.0)',
        },
        signal: AbortSignal.timeout(15000),
        next: { revalidate: 300 },
      } as RequestInit);

      if (response.ok) {
        const text = await response.text();
        const results = fetcher.parse(text);

        const validResults = results.filter(
          (r) => r.drawDate && r.numbers.length > 0 && r.numbers.every((n) => n > 0)
        );

        if (validResults.length > 0) {
          setCache(gameSlug, validResults);
          return validResults;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[lottery-api] Failed to fetch ${gameSlug} from ${fetcher.url}:`,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }
  }

  // 3. Graceful fallback to stored/seed data
  const storedResults = getResultsByGame(gameSlug, 10);
  if (storedResults.length > 0) {
    setCache(gameSlug, storedResults);
    return storedResults;
  }

  return [];
}

// ---------------------------------------------------------------------------
// Batch fetch all games
// ---------------------------------------------------------------------------

export async function fetchAllLatestResults(): Promise<Record<string, LotteryResult>> {
  const slugs = Object.keys(GAME_FETCHERS);
  const results: Record<string, LotteryResult> = {};

  const promises = slugs.map(async (slug) => {
    try {
      const gameResults = await fetchLotteryResults(slug);
      if (gameResults.length > 0) {
        results[slug] = gameResults[0];
      }
    } catch {
      // Silently skip failed fetches; fallback data is already handled
    }
  });

  await Promise.allSettled(promises);
  return results;
}

// ---------------------------------------------------------------------------
// Cache management
// ---------------------------------------------------------------------------

export function clearCache(): void {
  cache.clear();
}

export function clearGameCache(gameSlug: string): void {
  cache.delete(gameSlug);
}

export function getCacheStatus(): { slug: string; age: number; expired: boolean }[] {
  const now = Date.now();
  return Array.from(cache.entries()).map(([slug, entry]) => ({
    slug,
    age: Math.round((now - entry.timestamp) / 1000),
    expired: now - entry.timestamp >= CACHE_TTL,
  }));
}
