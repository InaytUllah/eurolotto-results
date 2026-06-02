// Submit every URL in the built sitemap.xml to Google Indexing API.
// Runs in CI after the static export build, daily.
// Uses google-auth-library + direct REST call (no googleapis dep needed).

import { readFile } from 'node:fs/promises';
import { GoogleAuth } from 'google-auth-library';

const SITEMAP_PATH = './out/sitemap.xml';
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 500;
const INDEXING_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

async function loadServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('GOOGLE_SERVICE_ACCOUNT_JSON not set — skipping notify-google.');
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON:', err.message);
    return null;
  }
}

async function loadSitemapUrls() {
  const xml = await readFile(SITEMAP_PATH, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function getAccessToken(sa) {
  const auth = new GoogleAuth({
    credentials: sa,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

async function submitOne(token, url) {
  try {
    const res = await fetch(INDEXING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, type: 'URL_UPDATED' }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { url, ok: false, err: `HTTP ${res.status}: ${body.slice(0, 200)}` };
    }
    return { url, ok: true };
  } catch (err) {
    return { url, ok: false, err: err.message };
  }
}

async function main() {
  const sa = await loadServiceAccount();
  if (!sa) process.exit(0);

  const urls = await loadSitemapUrls();
  console.log(`Submitting ${urls.length} URLs to Google Indexing API...`);

  const token = await getAccessToken(sa);
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((u) => submitOne(token, u)));
    for (const r of results) {
      if (r.ok) ok++;
      else {
        fail++;
        console.error(`  fail ${r.url}: ${r.err}`);
      }
    }
    if (i + BATCH_SIZE < urls.length) {
      await new Promise((res) => setTimeout(res, BATCH_DELAY_MS));
    }
  }
  console.log(`Done: ${ok} submitted, ${fail} failed.`);
}

main().catch((err) => {
  console.error('notify-google failed:', err);
  process.exit(1);
});
