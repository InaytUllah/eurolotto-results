import type { LotteryResult, NumberFrequency, NumberStats, PredictionSet } from '../types';
import { getGameBySlug } from './games';

// ---------------------------------------------------------------------------
// Load results from persistent JSON storage (written by cron job)
// Uses dynamic import of 'fs' to avoid webpack errors on the client side.
// Falls back to hardcoded seed data below if no JSON files exist.
// ---------------------------------------------------------------------------

function loadStoredResults(): LotteryResult[] {
  if (typeof window !== 'undefined') return []; // Client-side: skip fs

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pathMod = require('path');
    const dataDir = pathMod.join(process.cwd(), 'data', 'results');
    const files: string[] = fs.readdirSync(dataDir).filter((f: string) => f.endsWith('.json') && f !== 'update-log.json');
    const results: LotteryResult[] = [];
    for (const file of files) {
      try {
        const data = fs.readFileSync(pathMod.join(dataDir, file), 'utf-8');
        const parsed: LotteryResult[] = JSON.parse(data);
        results.push(...parsed);
      } catch {
        // Skip invalid files
      }
    }
    return results;
  } catch {
    return [];
  }
}

const storedResults = loadStoredResults();

const seedResults: LotteryResult[] = [
  // ============================================================
  // EuroMillions - 10 draws (Tue/Fri), Dec 2024 to Mar 2025
  // ============================================================
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-03-14', numbers: [6, 11, 17, 37, 43], bonusBalls: [1, 9], bonusBallName: 'Lucky Stars', jackpot: '\u20AC61,000,000', nextJackpot: '\u20AC72,000,000', nextDrawDate: '2025-03-18' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-03-11', numbers: [3, 25, 27, 38, 50], bonusBalls: [6, 11], bonusBallName: 'Lucky Stars', jackpot: '\u20AC50,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-03-07', numbers: [8, 14, 22, 35, 48], bonusBalls: [2, 7], bonusBallName: 'Lucky Stars', jackpot: '\u20AC39,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-03-04', numbers: [1, 19, 23, 41, 44], bonusBalls: [4, 10], bonusBallName: 'Lucky Stars', jackpot: '\u20AC29,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-02-28', numbers: [5, 12, 30, 36, 47], bonusBalls: [3, 8], bonusBallName: 'Lucky Stars', jackpot: '\u20AC17,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-02-25', numbers: [9, 16, 28, 33, 49], bonusBalls: [5, 12], bonusBallName: 'Lucky Stars', jackpot: '\u20AC130,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-02-21', numbers: [2, 20, 31, 39, 46], bonusBalls: [1, 11], bonusBallName: 'Lucky Stars', jackpot: '\u20AC119,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-02-18', numbers: [7, 13, 24, 40, 42], bonusBalls: [3, 9], bonusBallName: 'Lucky Stars', jackpot: '\u20AC108,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-02-14', numbers: [10, 18, 26, 34, 50], bonusBalls: [2, 6], bonusBallName: 'Lucky Stars', jackpot: '\u20AC97,000,000' },
  { game: 'EuroMillions', gameSlug: 'euromillions', drawDate: '2025-02-11', numbers: [4, 15, 29, 37, 45], bonusBalls: [7, 10], bonusBallName: 'Lucky Stars', jackpot: '\u20AC85,000,000' },

  // ============================================================
  // EuroJackpot - 10 draws (Tue/Fri), Dec 2024 to Mar 2025
  // ============================================================
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-03-14', numbers: [4, 16, 23, 38, 47], bonusBalls: [3, 8], bonusBallName: 'Euro Numbers', jackpot: '\u20AC62,000,000', nextJackpot: '\u20AC73,000,000', nextDrawDate: '2025-03-18' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-03-11', numbers: [8, 19, 27, 34, 45], bonusBalls: [5, 11], bonusBallName: 'Euro Numbers', jackpot: '\u20AC50,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-03-07', numbers: [2, 12, 30, 41, 49], bonusBalls: [1, 9], bonusBallName: 'Euro Numbers', jackpot: '\u20AC38,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-03-04', numbers: [6, 15, 25, 36, 50], bonusBalls: [4, 10], bonusBallName: 'Euro Numbers', jackpot: '\u20AC27,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-02-28', numbers: [11, 22, 33, 39, 44], bonusBalls: [2, 7], bonusBallName: 'Euro Numbers', jackpot: '\u20AC17,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-02-25', numbers: [3, 18, 28, 35, 48], bonusBalls: [6, 12], bonusBallName: 'Euro Numbers', jackpot: '\u20AC10,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-02-21', numbers: [7, 14, 31, 42, 46], bonusBalls: [1, 8], bonusBallName: 'Euro Numbers', jackpot: '\u20AC95,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-02-18', numbers: [1, 20, 26, 37, 43], bonusBalls: [3, 11], bonusBallName: 'Euro Numbers', jackpot: '\u20AC82,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-02-14', numbers: [9, 17, 24, 40, 50], bonusBalls: [5, 9], bonusBallName: 'Euro Numbers', jackpot: '\u20AC70,000,000' },
  { game: 'EuroJackpot', gameSlug: 'eurojackpot', drawDate: '2025-02-11', numbers: [5, 13, 29, 32, 47], bonusBalls: [2, 10], bonusBallName: 'Euro Numbers', jackpot: '\u20AC58,000,000' },

  // ============================================================
  // UK Lotto - 10 draws (Wed/Sat), Jan to Mar 2025
  // ============================================================
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-03-15', numbers: [3, 14, 22, 35, 41, 57], bonusBalls: [19], bonusBallName: 'Bonus Ball', jackpot: '\u00A37,500,000', nextJackpot: '\u00A39,000,000', nextDrawDate: '2025-03-19' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-03-12', numbers: [8, 17, 26, 33, 44, 51], bonusBalls: [29], bonusBallName: 'Bonus Ball', jackpot: '\u00A35,800,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-03-08', numbers: [1, 11, 24, 38, 46, 55], bonusBalls: [7], bonusBallName: 'Bonus Ball', jackpot: '\u00A34,200,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-03-05', numbers: [5, 19, 28, 36, 49, 58], bonusBalls: [13], bonusBallName: 'Bonus Ball', jackpot: '\u00A32,000,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-03-01', numbers: [12, 21, 30, 42, 50, 53], bonusBalls: [37], bonusBallName: 'Bonus Ball', jackpot: '\u00A315,600,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-02-26', numbers: [6, 15, 23, 39, 47, 56], bonusBalls: [10], bonusBallName: 'Bonus Ball', jackpot: '\u00A313,200,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-02-22', numbers: [2, 18, 27, 34, 43, 59], bonusBalls: [31], bonusBallName: 'Bonus Ball', jackpot: '\u00A310,800,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-02-19', numbers: [9, 16, 25, 37, 48, 52], bonusBalls: [4], bonusBallName: 'Bonus Ball', jackpot: '\u00A38,400,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-02-15', numbers: [7, 13, 20, 31, 45, 54], bonusBalls: [40], bonusBallName: 'Bonus Ball', jackpot: '\u00A36,000,000' },
  { game: 'UK Lotto', gameSlug: 'uk-lotto', drawDate: '2025-02-12', numbers: [4, 10, 29, 36, 41, 50], bonusBalls: [22], bonusBallName: 'Bonus Ball', jackpot: '\u00A33,800,000' },

  // ============================================================
  // Thunderball - 10 draws (Tue-Sat), Feb to Mar 2025
  // ============================================================
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-15', numbers: [3, 11, 22, 29, 37], bonusBalls: [9], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000', nextDrawDate: '2025-03-18' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-14', numbers: [7, 14, 19, 25, 38], bonusBalls: [5], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-13', numbers: [1, 10, 20, 31, 35], bonusBalls: [12], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-12', numbers: [5, 16, 24, 33, 39], bonusBalls: [2], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-11', numbers: [8, 13, 26, 30, 36], bonusBalls: [7], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-08', numbers: [2, 18, 21, 28, 34], bonusBalls: [11], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-07', numbers: [4, 15, 23, 32, 38], bonusBalls: [3], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-06', numbers: [9, 12, 27, 35, 37], bonusBalls: [14], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-05', numbers: [6, 17, 20, 29, 33], bonusBalls: [8], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },
  { game: 'Thunderball', gameSlug: 'thunderball', drawDate: '2025-03-04', numbers: [3, 10, 25, 31, 39], bonusBalls: [1], bonusBallName: 'Thunderball', jackpot: '\u00A3500,000' },

  // ============================================================
  // Set for Life - 10 draws (Mon/Thu), Jan to Mar 2025
  // ============================================================
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-03-13', numbers: [5, 12, 22, 35, 44], bonusBalls: [7], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years', nextDrawDate: '2025-03-17' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-03-10', numbers: [2, 18, 27, 33, 41], bonusBalls: [4], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-03-06', numbers: [8, 15, 23, 38, 46], bonusBalls: [9], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-03-03', numbers: [1, 11, 29, 36, 42], bonusBalls: [3], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-02-27', numbers: [7, 19, 24, 31, 45], bonusBalls: [6], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-02-24', numbers: [3, 14, 26, 37, 43], bonusBalls: [10], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-02-20', numbers: [6, 16, 21, 34, 47], bonusBalls: [2], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-02-17', numbers: [10, 13, 28, 39, 40], bonusBalls: [8], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-02-13', numbers: [4, 20, 25, 32, 46], bonusBalls: [5], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },
  { game: 'Set for Life', gameSlug: 'set-for-life', drawDate: '2025-02-10', numbers: [9, 17, 30, 36, 44], bonusBalls: [1], bonusBallName: 'Life Ball', jackpot: '\u00A310,000/month for 30 years' },

  // ============================================================
  // Irish Lotto - 10 draws (Wed/Sat), Jan to Mar 2025
  // ============================================================
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-03-15', numbers: [4, 11, 19, 28, 35, 44], bonusBalls: [22], bonusBallName: 'Bonus', jackpot: '\u20AC5,500,000', nextJackpot: '\u20AC6,000,000', nextDrawDate: '2025-03-19' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-03-12', numbers: [7, 15, 23, 31, 39, 47], bonusBalls: [18], bonusBallName: 'Bonus', jackpot: '\u20AC5,000,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-03-08', numbers: [2, 13, 26, 34, 40, 45], bonusBalls: [9], bonusBallName: 'Bonus', jackpot: '\u20AC4,500,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-03-05', numbers: [6, 17, 21, 30, 37, 43], bonusBalls: [14], bonusBallName: 'Bonus', jackpot: '\u20AC4,000,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-03-01', numbers: [1, 10, 24, 33, 41, 46], bonusBalls: [38], bonusBallName: 'Bonus', jackpot: '\u20AC3,500,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-02-26', numbers: [8, 14, 20, 29, 36, 42], bonusBalls: [5], bonusBallName: 'Bonus', jackpot: '\u20AC3,000,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-02-22', numbers: [3, 16, 25, 32, 38, 47], bonusBalls: [11], bonusBallName: 'Bonus', jackpot: '\u20AC2,500,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-02-19', numbers: [5, 12, 27, 35, 43, 44], bonusBalls: [7], bonusBallName: 'Bonus', jackpot: '\u20AC2,000,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-02-15', numbers: [9, 18, 22, 31, 40, 46], bonusBalls: [27], bonusBallName: 'Bonus', jackpot: '\u20AC7,200,000' },
  { game: 'Irish Lotto', gameSlug: 'irish-lotto', drawDate: '2025-02-12', numbers: [2, 11, 28, 34, 39, 45], bonusBalls: [16], bonusBallName: 'Bonus', jackpot: '\u20AC6,800,000' },

  // ============================================================
  // French Loto - 10 draws (Mon/Wed/Sat), Feb to Mar 2025
  // ============================================================
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-15', numbers: [6, 14, 25, 33, 48], bonusBalls: [7], bonusBallName: 'Chance Number', jackpot: '\u20AC13,000,000', nextJackpot: '\u20AC15,000,000', nextDrawDate: '2025-03-17' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-12', numbers: [3, 11, 22, 38, 45], bonusBalls: [4], bonusBallName: 'Chance Number', jackpot: '\u20AC11,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-10', numbers: [8, 19, 27, 36, 49], bonusBalls: [2], bonusBallName: 'Chance Number', jackpot: '\u20AC9,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-08', numbers: [1, 15, 30, 41, 44], bonusBalls: [9], bonusBallName: 'Chance Number', jackpot: '\u20AC7,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-05', numbers: [10, 18, 24, 35, 47], bonusBalls: [6], bonusBallName: 'Chance Number', jackpot: '\u20AC5,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-03', numbers: [4, 13, 29, 37, 42], bonusBalls: [1], bonusBallName: 'Chance Number', jackpot: '\u20AC3,500,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-03-01', numbers: [7, 16, 23, 34, 46], bonusBalls: [8], bonusBallName: 'Chance Number', jackpot: '\u20AC2,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-02-26', numbers: [2, 20, 28, 39, 43], bonusBalls: [3], bonusBallName: 'Chance Number', jackpot: '\u20AC16,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-02-24', numbers: [5, 12, 31, 40, 48], bonusBalls: [10], bonusBallName: 'Chance Number', jackpot: '\u20AC14,000,000' },
  { game: 'French Loto', gameSlug: 'french-loto', drawDate: '2025-02-22', numbers: [9, 17, 26, 32, 44], bonusBalls: [5], bonusBallName: 'Chance Number', jackpot: '\u20AC12,000,000' },

  // ============================================================
  // La Primitiva (Spanish) - 10 draws (Thu/Sat), Jan to Mar 2025
  // ============================================================
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-03-15', numbers: [5, 12, 24, 33, 41, 48], bonusBalls: [3], bonusBallName: 'Reintegro', jackpot: '\u20AC8,200,000', nextJackpot: '\u20AC10,000,000', nextDrawDate: '2025-03-20' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-03-13', numbers: [2, 18, 27, 35, 39, 46], bonusBalls: [7], bonusBallName: 'Reintegro', jackpot: '\u20AC6,500,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-03-08', numbers: [9, 14, 22, 30, 44, 49], bonusBalls: [1], bonusBallName: 'Reintegro', jackpot: '\u20AC5,000,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-03-06', numbers: [3, 16, 21, 28, 37, 43], bonusBalls: [5], bonusBallName: 'Reintegro', jackpot: '\u20AC3,800,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-03-01', numbers: [7, 11, 25, 34, 40, 47], bonusBalls: [9], bonusBallName: 'Reintegro', jackpot: '\u20AC2,500,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-02-27', numbers: [1, 13, 19, 31, 38, 45], bonusBalls: [2], bonusBallName: 'Reintegro', jackpot: '\u20AC12,400,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-02-22', numbers: [6, 15, 23, 29, 42, 48], bonusBalls: [8], bonusBallName: 'Reintegro', jackpot: '\u20AC10,800,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-02-20', numbers: [4, 10, 26, 36, 41, 49], bonusBalls: [6], bonusBallName: 'Reintegro', jackpot: '\u20AC9,200,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-02-15', numbers: [8, 17, 20, 32, 44, 46], bonusBalls: [4], bonusBallName: 'Reintegro', jackpot: '\u20AC7,600,000' },
  { game: 'La Primitiva', gameSlug: 'spanish-lottery', drawDate: '2025-02-13', numbers: [2, 14, 28, 33, 39, 47], bonusBalls: [0], bonusBallName: 'Reintegro', jackpot: '\u20AC6,000,000' },

  // ============================================================
  // German Lotto 6aus49 - 10 draws (Wed/Sat), Jan to Mar 2025
  // ============================================================
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-03-15', numbers: [3, 11, 22, 29, 38, 45], bonusBalls: [6], bonusBallName: 'Superzahl', jackpot: '\u20AC12,000,000', nextJackpot: '\u20AC14,000,000', nextDrawDate: '2025-03-19' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-03-12', numbers: [7, 16, 25, 33, 41, 48], bonusBalls: [4], bonusBallName: 'Superzahl', jackpot: '\u20AC10,000,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-03-08', numbers: [1, 14, 20, 36, 43, 49], bonusBalls: [8], bonusBallName: 'Superzahl', jackpot: '\u20AC8,000,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-03-05', numbers: [5, 18, 27, 31, 39, 46], bonusBalls: [2], bonusBallName: 'Superzahl', jackpot: '\u20AC6,000,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-03-01', numbers: [9, 12, 23, 34, 42, 47], bonusBalls: [0], bonusBallName: 'Superzahl', jackpot: '\u20AC4,200,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-02-26', numbers: [2, 15, 21, 30, 37, 44], bonusBalls: [5], bonusBallName: 'Superzahl', jackpot: '\u20AC2,800,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-02-22', numbers: [6, 10, 28, 35, 40, 49], bonusBalls: [3], bonusBallName: 'Superzahl', jackpot: '\u20AC1,000,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-02-19', numbers: [4, 13, 19, 26, 38, 43], bonusBalls: [7], bonusBallName: 'Superzahl', jackpot: '\u20AC18,000,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-02-15', numbers: [8, 17, 24, 32, 41, 46], bonusBalls: [1], bonusBallName: 'Superzahl', jackpot: '\u20AC15,500,000' },
  { game: 'German Lotto 6aus49', gameSlug: 'german-lotto', drawDate: '2025-02-12', numbers: [3, 11, 22, 29, 36, 48], bonusBalls: [9], bonusBallName: 'Superzahl', jackpot: '\u20AC13,000,000' },

  // ============================================================
  // Italian SuperEnalotto - 10 draws (Tue/Thu/Sat), Feb to Mar 2025
  // ============================================================
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-15', numbers: [12, 27, 44, 56, 71, 88], bonusBalls: [33], bonusBallName: 'Jolly', jackpot: '\u20AC45,200,000', nextJackpot: '\u20AC47,500,000', nextDrawDate: '2025-03-18' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-13', numbers: [5, 18, 36, 49, 67, 82], bonusBalls: [23], bonusBallName: 'Jolly', jackpot: '\u20AC42,800,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-11', numbers: [8, 22, 41, 53, 74, 90], bonusBalls: [15], bonusBallName: 'Jolly', jackpot: '\u20AC40,100,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-08', numbers: [3, 15, 29, 58, 69, 85], bonusBalls: [42], bonusBallName: 'Jolly', jackpot: '\u20AC37,500,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-06', numbers: [11, 24, 38, 51, 76, 87], bonusBalls: [60], bonusBallName: 'Jolly', jackpot: '\u20AC35,000,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-04', numbers: [7, 19, 33, 46, 62, 79], bonusBalls: [14], bonusBallName: 'Jolly', jackpot: '\u20AC32,600,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-03-01', numbers: [2, 16, 35, 50, 68, 84], bonusBalls: [27], bonusBallName: 'Jolly', jackpot: '\u20AC30,200,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-02-27', numbers: [10, 21, 43, 55, 73, 89], bonusBalls: [6], bonusBallName: 'Jolly', jackpot: '\u20AC27,800,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-02-25', numbers: [4, 14, 30, 47, 65, 81], bonusBalls: [52], bonusBallName: 'Jolly', jackpot: '\u20AC25,400,000' },
  { game: 'Italian SuperEnalotto', gameSlug: 'italian-superenalotto', drawDate: '2025-02-22', numbers: [9, 26, 37, 54, 70, 86], bonusBalls: [19], bonusBallName: 'Jolly', jackpot: '\u20AC23,000,000' },
];

// ---------------------------------------------------------------------------
// Merge stored results (from cron) with seed data.
// Stored results take priority (they're newer). Deduplicate by game+date.
// ---------------------------------------------------------------------------

function mergeResults(): LotteryResult[] {
  const combined = [...storedResults, ...seedResults];
  const seen = new Set<string>();
  const deduped: LotteryResult[] = [];
  for (const r of combined) {
    const key = `${r.gameSlug}:${r.drawDate}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }
  return deduped.sort((a, b) => b.drawDate.localeCompare(a.drawDate));
}

const allResults = mergeResults();

// ---------------------------------------------------------------------------
// Query functions
// ---------------------------------------------------------------------------

export function getLatestResults(): LotteryResult[] {
  const latestByGame = new Map<string, LotteryResult>();
  const sorted = [...allResults].sort((a, b) => b.drawDate.localeCompare(a.drawDate));
  for (const result of sorted) {
    if (!latestByGame.has(result.gameSlug)) {
      latestByGame.set(result.gameSlug, result);
    }
  }
  return Array.from(latestByGame.values()).sort((a, b) => b.drawDate.localeCompare(a.drawDate));
}

export function getLatestResultByGame(slug: string): LotteryResult | undefined {
  return allResults
    .filter((r) => r.gameSlug === slug)
    .sort((a, b) => b.drawDate.localeCompare(a.drawDate))[0];
}

export function getResultsByGame(slug: string, limit = 20): LotteryResult[] {
  return allResults
    .filter((r) => r.gameSlug === slug)
    .sort((a, b) => b.drawDate.localeCompare(a.drawDate))
    .slice(0, limit);
}

export function getResultByDate(slug: string, date: string): LotteryResult | undefined {
  return allResults.find((r) => r.gameSlug === slug && r.drawDate === date);
}

export function getRecentDates(slug: string): string[] {
  return allResults
    .filter((r) => r.gameSlug === slug)
    .sort((a, b) => b.drawDate.localeCompare(a.drawDate))
    .map((r) => r.drawDate);
}

// ---------------------------------------------------------------------------
// Frequency and statistical analysis
// ---------------------------------------------------------------------------

export function calculateFrequency(slug: string): NumberFrequency[] {
  const results = allResults.filter((r) => r.gameSlug === slug);
  const freq: Record<number, { count: number; lastDrawn: string }> = {};

  for (const r of results) {
    for (const n of r.numbers) {
      if (!freq[n]) {
        freq[n] = { count: 0, lastDrawn: r.drawDate };
      }
      freq[n].count++;
      if (r.drawDate > freq[n].lastDrawn) {
        freq[n].lastDrawn = r.drawDate;
      }
    }
  }

  const totalDraws = results.length;
  const entries = Object.entries(freq).map(([num, data]) => ({
    number: parseInt(num, 10),
    count: data.count,
    percentage: totalDraws > 0 ? Math.round((data.count / totalDraws) * 100) : 0,
    lastDrawn: data.lastDrawn,
  }));

  entries.sort((a, b) => b.count - a.count);

  const hotThreshold = Math.ceil(entries.length * 0.2);
  const coldThreshold = entries.length - Math.ceil(entries.length * 0.2);

  return entries.map((e, idx) => ({
    ...e,
    isHot: idx < hotThreshold,
    isCold: idx >= coldThreshold,
  }));
}

export function getHotNumbers(slug: string, count = 10): NumberFrequency[] {
  return calculateFrequency(slug)
    .filter((f) => f.isHot)
    .slice(0, count);
}

export function getColdNumbers(slug: string, count = 10): NumberFrequency[] {
  return calculateFrequency(slug)
    .filter((f) => f.isCold)
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Detailed number statistics
// ---------------------------------------------------------------------------

export function getNumberStats(slug: string, num: number): NumberStats | null {
  const results = allResults
    .filter((r) => r.gameSlug === slug)
    .sort((a, b) => b.drawDate.localeCompare(a.drawDate));

  if (results.length === 0) return null;

  const totalDraws = results.length;
  let frequency = 0;
  let lastDrawn = '';
  const pairingMap: Record<number, number> = {};

  for (const r of results) {
    if (r.numbers.includes(num)) {
      frequency++;
      if (!lastDrawn) lastDrawn = r.drawDate;
      for (const companion of r.numbers) {
        if (companion !== num) {
          pairingMap[companion] = (pairingMap[companion] || 0) + 1;
        }
      }
    }
  }

  if (frequency === 0) {
    return {
      number: num,
      totalDraws,
      frequency: 0,
      percentage: 0,
      lastDrawn: 'Never',
      rank: 0,
      status: 'cold',
      pairings: [],
    };
  }

  const percentage = Math.round((frequency / totalDraws) * 100);

  // Determine rank among all numbers
  const allFreqs = calculateFrequency(slug);
  const rank = allFreqs.findIndex((f) => f.number === num) + 1;

  // Determine status based on rank percentile
  const percentile = rank / allFreqs.length;
  let status: NumberStats['status'];
  if (percentile <= 0.2) status = 'hot';
  else if (percentile <= 0.4) status = 'warm';
  else if (percentile <= 0.6) status = 'neutral';
  else if (percentile <= 0.8) status = 'cool';
  else status = 'cold';

  const pairings = Object.entries(pairingMap)
    .map(([n, count]) => ({ number: parseInt(n, 10), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    number: num,
    totalDraws,
    frequency,
    percentage,
    lastDrawn,
    rank,
    status,
    pairings,
  };
}

// ---------------------------------------------------------------------------
// Prediction generation (hot number analysis)
// ---------------------------------------------------------------------------

export function generatePredictions(slug: string): PredictionSet[] {
  const game = getGameBySlug(slug);
  if (!game) return [];

  const freqs = calculateFrequency(slug);
  const mainCount = game.mainNumbers.count;
  const mainMax = game.mainNumbers.max;
  const bonusCount = game.bonusBalls?.count || 0;
  const bonusMax = game.bonusBalls?.max || 0;

  // Helper: pick N unique numbers from a sorted frequency list
  function pickNumbers(pool: NumberFrequency[], count: number, max: number): number[] {
    const selected: number[] = [];
    for (const f of pool) {
      if (f.number >= 1 && f.number <= max && !selected.includes(f.number)) {
        selected.push(f.number);
      }
      if (selected.length >= count) break;
    }
    // If not enough from frequency data, fill with random numbers
    while (selected.length < count) {
      const n = Math.floor(Math.random() * max) + 1;
      if (!selected.includes(n)) selected.push(n);
    }
    return selected.sort((a, b) => a - b);
  }

  // Compute bonus ball frequencies separately
  function bonusBallFrequencies(): NumberFrequency[] {
    const results = allResults.filter((r) => r.gameSlug === slug);
    const freq: Record<number, number> = {};
    for (const r of results) {
      if (r.bonusBalls) {
        for (const b of r.bonusBalls) {
          freq[b] = (freq[b] || 0) + 1;
        }
      }
    }
    return Object.entries(freq)
      .map(([num, count]) => ({
        number: parseInt(num, 10),
        count,
        percentage: results.length > 0 ? Math.round((count / results.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  const bonusFreqs = bonusBallFrequencies();

  // Method 1: Hot Numbers -- pick from the most frequently drawn numbers
  const hotMainNumbers = pickNumbers(freqs, mainCount, mainMax);
  const hotBonusNumbers = bonusCount > 0 ? pickNumbers(bonusFreqs, bonusCount, bonusMax) : undefined;

  // Method 2: Balanced Mix -- alternate between hot and cold numbers
  const coldFreqs = [...freqs].reverse();
  const mixedPool: NumberFrequency[] = [];
  for (let i = 0; i < Math.max(freqs.length, coldFreqs.length); i++) {
    if (i < freqs.length) mixedPool.push(freqs[i]);
    if (i < coldFreqs.length && coldFreqs[i].number !== freqs[i]?.number) {
      mixedPool.push(coldFreqs[i]);
    }
  }
  const balancedMainNumbers = pickNumbers(mixedPool, mainCount, mainMax);
  const balancedBonusNumbers = bonusCount > 0
    ? pickNumbers([...bonusFreqs].reverse(), bonusCount, bonusMax)
    : undefined;

  // Method 3: Overdue Numbers -- pick from the least recently drawn
  const overduePool = [...freqs].sort((a, b) => {
    const aDate = a.lastDrawn || '0000-00-00';
    const bDate = b.lastDrawn || '0000-00-00';
    return aDate.localeCompare(bDate);
  });
  const overdueMainNumbers = pickNumbers(overduePool, mainCount, mainMax);
  const overdueBonusNumbers = bonusCount > 0
    ? pickNumbers([...bonusFreqs].sort((a, b) => a.count - b.count), bonusCount, bonusMax)
    : undefined;

  return [
    {
      numbers: hotMainNumbers,
      bonusBalls: hotBonusNumbers,
      method: 'Hot Numbers - Based on the most frequently drawn numbers in recent draws',
    },
    {
      numbers: balancedMainNumbers,
      bonusBalls: balancedBonusNumbers,
      method: 'Balanced Mix - A combination of frequently drawn and overdue numbers',
    },
    {
      numbers: overdueMainNumbers,
      bonusBalls: overdueBonusNumbers,
      method: 'Overdue Numbers - Numbers that have not appeared in recent draws and may be due',
    },
  ];
}
