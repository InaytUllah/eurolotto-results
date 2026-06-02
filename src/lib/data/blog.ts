import type { BlogPost, LotteryResult, GameConfig, PredictionSet } from '../types';
import { ALL_GAMES } from './games';
import { getResultsByGame, calculateFrequency, generatePredictions } from './draws';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateLong(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// ---------------------------------------------------------------------------
// Result post generation
// ---------------------------------------------------------------------------

export function generateResultPost(result: LotteryResult, game: GameConfig): BlogPost {
  const formattedDate = formatDateLong(result.drawDate);
  const shortDate = formatDateShort(result.drawDate);
  const numbersStr = result.numbers.join(', ');
  const bonusStr = result.bonusBalls ? result.bonusBalls.join(', ') : '';
  const bonusLabel = result.bonusBallName || game.bonusBalls?.name || 'Bonus';

  const freqs = calculateFrequency(game.slug);
  const hotNums = freqs.slice(0, 5).map((f) => f.number);
  const coldNums = freqs.slice(-5).map((f) => f.number);

  const appearedHot = result.numbers.filter((n) => hotNums.includes(n));
  const appearedCold = result.numbers.filter((n) => coldNums.includes(n));

  const content = [
    `## ${game.name} Results for ${formattedDate}`,
    '',
    `The ${game.name} draw took place on ${formattedDate} with the following winning numbers:`,
    '',
    `**Main Numbers:** ${numbersStr}`,
    bonusStr ? `**${bonusLabel}:** ${bonusStr}` : '',
    result.jackpot ? `**Jackpot:** ${result.jackpot}` : '',
    result.nextJackpot ? `**Next Jackpot (estimated):** ${result.nextJackpot}` : '',
    result.nextDrawDate ? `**Next Draw:** ${formatDateLong(result.nextDrawDate)}` : '',
    '',
    '### Draw Analysis',
    '',
    `Looking at the numbers drawn in this ${game.name} draw, there are several interesting patterns worth noting.`,
    '',
    appearedHot.length > 0
      ? `The numbers ${appearedHot.join(', ')} have been among the most frequently drawn numbers in recent ${game.name} history, confirming their "hot" status.`
      : `Interestingly, none of the current hot numbers appeared in this draw, which is a relatively uncommon occurrence.`,
    '',
    appearedCold.length > 0
      ? `Meanwhile, ${appearedCold.join(', ')} ${appearedCold.length === 1 ? 'is' : 'are'} considered "cold" ${appearedCold.length === 1 ? 'number' : 'numbers'} that ${appearedCold.length === 1 ? 'has' : 'have'} not been drawn frequently in recent weeks, making ${appearedCold.length === 1 ? 'its' : 'their'} appearance noteworthy.`
      : 'No cold numbers appeared in this draw, which aligns with typical probability expectations.',
    '',
    `The sum of the main numbers drawn is ${result.numbers.reduce((a, b) => a + b, 0)}, which ${result.numbers.reduce((a, b) => a + b, 0) > (game.mainNumbers.max * game.mainNumbers.count) / 2 ? 'is above' : 'falls below'} the average expected sum for a ${game.name} draw.`,
    '',
    '### Current Hot and Cold Numbers',
    '',
    `**Hot Numbers (most frequent):** ${hotNums.join(', ')}`,
    `**Cold Numbers (least frequent):** ${coldNums.join(', ')}`,
    '',
    '### What Next?',
    '',
    result.nextDrawDate
      ? `The next ${game.name} draw is scheduled for ${formatDateLong(result.nextDrawDate)}${result.nextJackpot ? ` with an estimated jackpot of ${result.nextJackpot}` : ''}. Check back here for the latest results as soon as the draw takes place.`
      : `Check back here for the latest ${game.name} results as soon as the next draw takes place.`,
    '',
    `*Disclaimer: Past results do not influence future draws. Each ${game.name} draw is an independent random event. Please play responsibly.*`,
  ]
    .filter(Boolean)
    .join('\n');

  const slug = slugify(`${game.slug}-results-${result.drawDate}`);
  const excerpt = `${game.name} winning numbers for ${shortDate}: ${numbersStr}${bonusStr ? ` | ${bonusLabel}: ${bonusStr}` : ''}${result.jackpot ? ` | Jackpot: ${result.jackpot}` : ''}.`;

  return {
    slug,
    title: `${game.name} Results for ${formattedDate} - Winning Numbers ${numbersStr}`,
    excerpt,
    content,
    date: result.drawDate,
    category: game.name,
    gameSlug: game.slug,
    type: 'results',
    readTime: estimateReadTime(content),
    tags: [
      game.slug,
      'results',
      'winning numbers',
      game.country.toLowerCase(),
      result.drawDate,
    ],
  };
}

// ---------------------------------------------------------------------------
// Prediction post generation
// ---------------------------------------------------------------------------

export function generatePredictionPost(game: GameConfig, predictions: PredictionSet[]): BlogPost {
  const today = new Date().toISOString().split('T')[0];
  const formattedToday = formatDateLong(today);

  const predictionBlocks = predictions
    .map((pred, idx) => {
      const nums = pred.numbers.join(', ');
      const bonus = pred.bonusBalls ? ` | ${game.bonusBalls?.name || 'Bonus'}: ${pred.bonusBalls.join(', ')}` : '';
      return [
        `### Prediction Set ${idx + 1}: ${pred.method.split(' - ')[0]}`,
        '',
        `**Numbers:** ${nums}${bonus}`,
        '',
        `*Method:* ${pred.method}`,
        '',
      ].join('\n');
    })
    .join('\n');

  const freqs = calculateFrequency(game.slug);
  const hotNums = freqs.slice(0, 5).map((f) => `${f.number} (${f.percentage}%)`);

  const content = [
    `## ${game.name} Number Predictions - ${formattedToday}`,
    '',
    `Here are our data-driven number predictions for the next ${game.name} draw, generated using statistical analysis of recent draw results.`,
    '',
    predictionBlocks,
    '### How These Predictions Are Generated',
    '',
    `Our prediction engine analyses the frequency of all numbers drawn across recent ${game.name} draws. We look at which numbers appear most often (hot numbers), which are overdue (cold numbers), and how numbers tend to pair together. Three distinct methods produce three different sets of suggested numbers, giving you a range of statistically informed choices.`,
    '',
    '### Current Hottest Numbers',
    '',
    `The five most frequently drawn numbers in recent ${game.name} draws are: ${hotNums.join(', ')}.`,
    '',
    '### Important Reminder',
    '',
    `These predictions are for entertainment and informational purposes only. Every ${game.name} draw is a completely independent random event, and no prediction method can guarantee a win. The odds of winning the ${game.name} jackpot are ${game.odds}. Always play within your means and gamble responsibly.`,
  ].join('\n');

  const slug = slugify(`${game.slug}-predictions-${today}`);
  const excerpt = `Data-driven number predictions for the next ${game.name} draw using hot number analysis, balanced mix, and overdue number methods.`;

  return {
    slug,
    title: `${game.name} Predictions for Next Draw - Smart Number Picks`,
    excerpt,
    content,
    date: today,
    category: game.name,
    gameSlug: game.slug,
    type: 'predictions',
    readTime: estimateReadTime(content),
    tags: [
      game.slug,
      'predictions',
      'number analysis',
      'smart picks',
      game.country.toLowerCase(),
    ],
  };
}

// ---------------------------------------------------------------------------
// Aggregate blog post functions
// ---------------------------------------------------------------------------

export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const game of ALL_GAMES) {
    // Generate result posts for the 5 most recent draws per game
    const results = getResultsByGame(game.slug, 5);
    for (const result of results) {
      posts.push(generateResultPost(result, game));
    }

    // Generate one prediction post per game
    const predictions = generatePredictions(game.slug);
    if (predictions.length > 0) {
      posts.push(generatePredictionPost(game, predictions));
    }
  }

  // Sort by date descending, then by game name for same-date entries
  posts.sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    if (dateDiff !== 0) return dateDiff;
    return a.category.localeCompare(b.category);
  });

  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export function getBlogPostsByGame(gameSlug: string): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.gameSlug === gameSlug);
}

export function getBlogPostsByType(type: BlogPost['type']): BlogPost[] {
  return getAllBlogPosts().filter((post) => post.type === type);
}
