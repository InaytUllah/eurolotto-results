import type { SEOData } from '../types';

export const SITE_NAME = 'Euro Lotto Results';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://euromillionsresults.co.uk';
export const SITE_DESCRIPTION =
  'Check the latest EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto, La Primitiva, German Lotto 6aus49, and Italian SuperEnalotto results. View winning numbers, jackpot amounts, number frequency statistics, hot and cold number analysis, and complete draw history for all major European lottery games.';

export function getHomeSEO(): SEOData {
  return {
    title: 'Euro Lotto Results - EuroMillions, EuroJackpot & European Lottery Results Today',
    description: 'Latest European lottery results updated after every draw. Check EuroMillions, EuroJackpot, UK Lotto, Thunderball and more winning numbers, jackpots and statistics.',
    keywords: [
      'euromillions results',
      'euromillions results today',
      'eurojackpot results',
      'european lottery results',
      'uk lotto results',
      'thunderball results',
      'set for life results',
      'irish lotto results',
      'french loto results',
      'german lotto results',
      'superenalotto results',
      'la primitiva results',
      'lottery winning numbers',
      'lottery jackpot',
      'lottery number checker',
    ],
  };
}

export function getGameSEO(gameName: string, gameSlug: string): SEOData {
  return {
    title: `${gameName} Results Today - Latest Winning Numbers & Jackpot | ${SITE_NAME}`,
    description: `Check the latest ${gameName} results and winning numbers updated live. View jackpot amounts, past draws, number frequency and hot/cold analysis.`,
    keywords: [
      `${gameName.toLowerCase()} results`,
      `${gameName.toLowerCase()} results today`,
      `${gameName.toLowerCase()} winning numbers`,
      `${gameName.toLowerCase()} numbers`,
      `${gameName.toLowerCase()} jackpot`,
      `${gameName.toLowerCase()} draw`,
      `${gameName.toLowerCase()} checker`,
      `${gameName.toLowerCase()} statistics`,
      `${gameName.toLowerCase()} hot numbers`,
      `${gameName.toLowerCase()} results history`,
    ],
    canonical: `${SITE_URL}/${gameSlug}`,
  };
}

export function getResultDateSEO(gameName: string, date: string, numbers?: number[]): SEOData {
  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const numbersStr = numbers ? ` - Winning Numbers: ${numbers.join(', ')}` : '';
  return {
    title: `${gameName} Results ${formattedDate}${numbersStr} | ${SITE_NAME}`,
    description: `${gameName} winning numbers for ${formattedDate}. Full draw breakdown, prize tiers and jackpot details for this draw.`,
    keywords: [
      `${gameName.toLowerCase()} results ${date}`,
      `${gameName.toLowerCase()} ${formattedDate.toLowerCase()}`,
      `${gameName.toLowerCase()} winning numbers ${date}`,
      `${gameName.toLowerCase()} draw results`,
    ],
  };
}

export function getToolSEO(toolName: string, description: string): SEOData {
  return {
    title: `${toolName} | ${SITE_NAME}`,
    description,
    keywords: [
      'lottery tools',
      'number generator',
      'lottery statistics',
      'hot cold numbers',
      'number frequency',
      toolName.toLowerCase(),
    ],
  };
}

export function getBlogSEO(): SEOData {
  return {
    title: `Lottery News, Analysis & Predictions | ${SITE_NAME}`,
    description: 'Latest European lottery news, draw result breakdowns, winning number analysis, prediction insights, and tips for EuroMillions, EuroJackpot and other EU lotteries.',
    keywords: [
      'lottery news',
      'euromillions news',
      'eurojackpot news',
      'lottery analysis',
      'lottery predictions',
      'lottery tips',
      'lottery blog',
      'european lottery news',
      'winning numbers analysis',
    ],
  };
}

export function getFaqSEO(): SEOData {
  return {
    title: `Frequently Asked Questions - European Lottery FAQ | ${SITE_NAME}`,
    description: 'Find answers to common questions about EuroMillions, EuroJackpot, UK Lotto and other European lotteries including how to play, odds, prizes and claiming winnings.',
    keywords: [
      'lottery faq',
      'euromillions faq',
      'how to play euromillions',
      'lottery odds explained',
      'how to claim lottery prize',
      'european lottery questions',
      'lottery help',
    ],
  };
}

export function getNumberPageSEO(gameName: string, number: number): SEOData {
  return {
    title: `Number ${number} Statistics for ${gameName} - Frequency & Analysis | ${SITE_NAME}`,
    description: `Detailed statistics for number ${number} in ${gameName} draws. View draw frequency, last drawn date, common pairings and whether it is currently hot or cold.`,
    keywords: [
      `${gameName.toLowerCase()} number ${number}`,
      `${gameName.toLowerCase()} number statistics`,
      `${gameName.toLowerCase()} number frequency`,
      `${gameName.toLowerCase()} hot numbers`,
      `${gameName.toLowerCase()} cold numbers`,
      `lottery number ${number} analysis`,
    ],
  };
}

export function getPredictionsSEO(): SEOData {
  return {
    title: `Lottery Number Predictions & Smart Picks | ${SITE_NAME}`,
    description: 'Data-driven lottery number predictions for EuroMillions, EuroJackpot and all major European lotteries using hot number analysis, balanced mixes and overdue patterns.',
    keywords: [
      'lottery predictions',
      'euromillions predictions',
      'eurojackpot predictions',
      'lottery number generator',
      'smart pick numbers',
      'hot number predictions',
      'lottery number analysis',
      'predicted lottery numbers',
      'next draw predictions',
    ],
  };
}
