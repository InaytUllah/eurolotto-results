/**
 * Google Indexing API helper.
 *
 * Authenticates via a Google Service Account (JWT) stored in the
 * GOOGLE_SERVICE_ACCOUNT_JSON environment variable, then sends
 * URL_UPDATED notifications to the Indexing API.
 *
 * Features:
 * - Batches requests 10 at a time with 500ms delays
 * - Stops immediately on 429 (quota exceeded) to avoid wasting requests
 * - Rotating daily batch system so ALL pages get submitted over time
 */

import { GoogleAuth } from 'google-auth-library';

const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function getAuth(): GoogleAuth | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.warn('[google-indexing] GOOGLE_SERVICE_ACCOUNT_JSON env variable not set — skipping');
    return null;
  }

  try {
    const credentials = JSON.parse(raw);
    return new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
  } catch (error) {
    console.error('[google-indexing] Failed to parse service account JSON:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Notify a single URL
// ---------------------------------------------------------------------------

async function notifySingleUrl(
  url: string,
  accessToken: string
): Promise<{ url: string; success: boolean; status: number; error?: string }> {
  try {
    const res = await fetch(INDEXING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type: 'URL_UPDATED',
      }),
    });

    if (res.ok) {
      return { url, success: true, status: res.status };
    }

    const errorBody = await res.text().catch(() => '');
    return { url, success: false, status: res.status, error: errorBody.slice(0, 200) };
  } catch (error) {
    return {
      url,
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ---------------------------------------------------------------------------
// Batch notify — stops on 429 quota exceeded
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface IndexingResult {
  total: number;
  succeeded: number;
  failed: number;
  quotaHit: boolean;
  skipped: boolean;
  results: { url: string; success: boolean; status: number; error?: string }[];
}

/**
 * Notify Google Indexing API about updated URLs.
 * Batches requests BATCH_SIZE at a time with BATCH_DELAY_MS between batches.
 * Stops immediately if a 429 quota error is received.
 */
export async function notifyGoogleIndexing(urls: string[]): Promise<IndexingResult> {
  if (urls.length === 0) {
    return { total: 0, succeeded: 0, failed: 0, quotaHit: false, skipped: true, results: [] };
  }

  const auth = getAuth();
  if (!auth) {
    return { total: urls.length, succeeded: 0, failed: 0, quotaHit: false, skipped: true, results: [] };
  }

  // Get access token
  let accessToken: string;
  try {
    const client = await auth.getClient();
    const tokenRes = await client.getAccessToken();
    accessToken = tokenRes.token || '';
    if (!accessToken) {
      return {
        total: urls.length,
        succeeded: 0,
        failed: urls.length,
        quotaHit: false,
        skipped: false,
        results: [{ url: 'auth', success: false, status: 0, error: 'Empty access token' }],
      };
    }
  } catch (error) {
    return {
      total: urls.length,
      succeeded: 0,
      failed: urls.length,
      quotaHit: false,
      skipped: false,
      results: [{
        url: 'auth',
        success: false,
        status: 0,
        error: `Auth failed: ${error instanceof Error ? error.message : 'unknown'}`,
      }],
    };
  }

  // De-duplicate URLs
  const uniqueUrls = [...new Set(urls)];

  const allResults: IndexingResult['results'] = [];
  let succeeded = 0;
  let failed = 0;
  let quotaHit = false;

  // Process in batches — stop on 429
  for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map((url) => notifySingleUrl(url, accessToken))
    );

    for (const r of batchResults) {
      allResults.push(r);
      if (r.success) {
        succeeded++;
      } else {
        failed++;
        // Stop immediately on quota exceeded
        if (r.status === 429) {
          quotaHit = true;
        }
      }
    }

    // If quota hit, stop sending — don't waste remaining requests
    if (quotaHit) {
      break;
    }

    // Delay between batches (skip after last batch)
    if (i + BATCH_SIZE < uniqueUrls.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  return {
    total: uniqueUrls.length,
    succeeded,
    failed,
    quotaHit,
    skipped: false,
    results: allResults,
  };
}

// ---------------------------------------------------------------------------
// URL builders
// ---------------------------------------------------------------------------

/**
 * Build the FULL set of all site URLs for bulk submission.
 */
export function buildAllSiteUrls(
  siteUrl: string,
  gameSlugs: string[],
  gameMaxNumbers: Record<string, number>,
  resultDates: Record<string, string[]>
): string[] {
  const urls: string[] = [];

  // Static pages
  const staticPaths = [
    '', '/predictions', '/number-generator', '/hot-cold-numbers',
    '/jackpot-tracker', '/blog', '/faq', '/about', '/contact',
    '/privacy-policy', '/terms', '/disclaimer', '/responsible-gaming',
    '/results-checker', '/statistics', '/search',
  ];
  for (const p of staticPaths) {
    urls.push(`${siteUrl}${p}`);
  }

  // Per-game pages
  for (const slug of gameSlugs) {
    urls.push(`${siteUrl}/${slug}`);
    urls.push(`${siteUrl}/how-to-play/${slug}`);

    // Result date pages
    const dates = resultDates[slug] || [];
    for (const date of dates) {
      urls.push(`${siteUrl}/${slug}/results/${date}`);
    }

    // Number pages
    const max = gameMaxNumbers[slug] || 50;
    for (let i = 1; i <= max; i++) {
      urls.push(`${siteUrl}/${slug}/number/${i}`);
    }
  }

  return [...new Set(urls)];
}

/**
 * Get today's rotating batch from the full URL list.
 * Uses day-of-year to rotate through pages so every page
 * gets submitted within a few days.
 *
 * @param allUrls - Complete list of all site URLs
 * @param batchSize - How many URLs per daily batch (default 190, under 200/day quota)
 * @returns The URLs for today's batch
 */
export function getDailyBatch(allUrls: string[], batchSize = 190): string[] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const totalBatches = Math.ceil(allUrls.length / batchSize);
  const batchIndex = dayOfYear % totalBatches;
  const start = batchIndex * batchSize;
  return allUrls.slice(start, start + batchSize);
}

/**
 * Build priority URLs for the cron job — these always get submitted first.
 * Includes homepage, game hubs, tool pages, fresh result pages, blog.
 */
export function buildPriorityUrls(
  siteUrl: string,
  gameSlugs: string[],
  fetchedDates: Record<string, string>
): string[] {
  const urls: string[] = [];

  // Static high-priority pages
  urls.push(siteUrl);
  urls.push(`${siteUrl}/predictions`);
  urls.push(`${siteUrl}/hot-cold-numbers`);
  urls.push(`${siteUrl}/jackpot-tracker`);
  urls.push(`${siteUrl}/results-checker`);
  urls.push(`${siteUrl}/statistics`);
  urls.push(`${siteUrl}/number-generator`);
  urls.push(`${siteUrl}/blog`);

  // Game hub pages
  for (const slug of gameSlugs) {
    urls.push(`${siteUrl}/${slug}`);
  }

  // Fresh result pages from latest draw dates
  for (const slug of gameSlugs) {
    const latestDate = fetchedDates[slug];
    if (latestDate) {
      urls.push(`${siteUrl}/${slug}/results/${latestDate}`);
    }
  }

  // Today and yesterday result pages
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  for (const slug of gameSlugs) {
    urls.push(`${siteUrl}/${slug}/results/${today}`);
    urls.push(`${siteUrl}/${slug}/results/${yesterday}`);
  }

  return [...new Set(urls)];
}
