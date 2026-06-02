import { MetadataRoute } from 'next';
import { ALL_GAMES } from '@/lib/data/games';
import { getRecentDates } from '@/lib/data/draws';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://euromillionsresults.co.uk';

// Required under output: 'export' so sitemap.xml is emitted as a static file.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/predictions`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/number-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/hot-cold-numbers`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/jackpot-tracker`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/responsible-gaming`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/results-checker`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/statistics`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const gamePages: MetadataRoute.Sitemap = ALL_GAMES.flatMap((game) => {
    const dates = getRecentDates(game.slug);
    const hubPages: MetadataRoute.Sitemap = [
      { url: `${SITE_URL}/${game.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
      { url: `${SITE_URL}/how-to-play/${game.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ];
    const resultPages: MetadataRoute.Sitemap = dates.map((date) => ({
      url: `${SITE_URL}/${game.slug}/results/${date}`,
      lastModified: new Date(date + 'T00:00:00'),
      changeFrequency: 'never' as const,
      priority: 0.6,
    }));
    const numberPages: MetadataRoute.Sitemap = Array.from(
      { length: game.mainNumbers.max },
      (_, i) => ({
        url: `${SITE_URL}/${game.slug}/number/${i + 1}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.4,
      })
    );
    return [...hubPages, ...resultPages, ...numberPages];
  });

  return [...staticPages, ...gamePages];
}
