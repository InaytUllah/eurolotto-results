export interface LotteryResult {
  game: string;
  gameSlug: string;
  drawDate: string;
  numbers: number[];
  bonusBalls?: number[];
  bonusBallName?: string;
  jackpot?: string;
  nextJackpot?: string;
  nextDrawDate?: string;
}

export interface GameConfig {
  name: string;
  slug: string;
  shortName: string;
  mainNumbers: { count: number; max: number };
  bonusBalls?: { count: number; max: number; name: string };
  drawDays: string[];
  drawTime: string;
  timezone: string;
  color: string;
  gradient: string;
  country: string;
  flag: string;
  currency: string;
  description: string;
  longDescription: string;
  howToPlay: string[];
  odds: string;
  minJackpot: string;
  maxJackpot: string;
  ticketPrice: string;
  website: string;
  prizeTiers: { match: string; prize: string }[];
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
  lastDrawn?: string;
  isHot?: boolean;
  isCold?: boolean;
}

export interface NumberStats {
  number: number;
  totalDraws: number;
  frequency: number;
  percentage: number;
  lastDrawn: string;
  rank: number;
  status: 'hot' | 'warm' | 'neutral' | 'cool' | 'cold';
  pairings: { number: number; count: number }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  gameSlug: string;
  type: 'results' | 'predictions' | 'analysis';
  readTime: string;
  tags: string[];
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PredictionSet {
  numbers: number[];
  bonusBalls?: number[];
  method: string;
}
