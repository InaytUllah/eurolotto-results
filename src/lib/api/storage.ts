/**
 * Persistent storage layer for lottery results.
 *
 * On Vercel, we use the /tmp directory for temporary file storage.
 * This works within a single function invocation but doesn't persist
 * across cold starts. For true persistence, we also use Vercel KV
 * or fall back to the hardcoded data in draws.ts.
 *
 * Strategy:
 * 1. Try to read from Vercel Blob/KV if configured
 * 2. Fall back to /tmp JSON files (survives warm function instances)
 * 3. Fall back to hardcoded data in draws.ts
 */

import type { LotteryResult } from '../types';
import { promises as fs } from 'fs';
import path from 'path';

// Use the project's data directory for persistent JSON storage
// This gets deployed with the app and can be updated by the cron job
const DATA_DIR = path.join(process.cwd(), 'data', 'results');

// In-memory cache that persists for the lifetime of the serverless function
const memoryCache = new Map<string, { results: LotteryResult[]; timestamp: number }>();
const MEMORY_TTL = 10 * 60 * 1000; // 10 minutes

// ---------------------------------------------------------------------------
// Read stored results
// ---------------------------------------------------------------------------

export async function getStoredResults(gameSlug: string): Promise<LotteryResult[]> {
  // 1. Check in-memory cache first
  const cached = memoryCache.get(gameSlug);
  if (cached && Date.now() - cached.timestamp < MEMORY_TTL) {
    return cached.results;
  }

  // 2. Try reading from JSON file
  try {
    const filePath = path.join(DATA_DIR, `${gameSlug}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const results: LotteryResult[] = JSON.parse(data);
    if (results.length > 0) {
      memoryCache.set(gameSlug, { results, timestamp: Date.now() });
      return results;
    }
  } catch {
    // File doesn't exist or is invalid - fall through
  }

  return [];
}

// ---------------------------------------------------------------------------
// Write results to persistent storage
// ---------------------------------------------------------------------------

export async function storeResults(gameSlug: string, results: LotteryResult[]): Promise<boolean> {
  if (results.length === 0) return false;

  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Read existing results to merge
    let existing: LotteryResult[] = [];
    try {
      const filePath = path.join(DATA_DIR, `${gameSlug}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      existing = JSON.parse(data);
    } catch {
      // No existing file
    }

    // Merge: add new results, deduplicate by date, keep most recent 50
    const allResults = [...results, ...existing];
    const seen = new Set<string>();
    const deduped = allResults.filter((r) => {
      if (seen.has(r.drawDate)) return false;
      seen.add(r.drawDate);
      return true;
    });

    // Sort by date descending and keep latest 50
    deduped.sort((a, b) => b.drawDate.localeCompare(a.drawDate));
    const final = deduped.slice(0, 50);

    // Write to file
    const filePath = path.join(DATA_DIR, `${gameSlug}.json`);
    await fs.writeFile(filePath, JSON.stringify(final, null, 2), 'utf-8');

    // Update memory cache
    memoryCache.set(gameSlug, { results: final, timestamp: Date.now() });

    return true;
  } catch (error) {
    console.error(`[storage] Failed to store results for ${gameSlug}:`, error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Get the timestamp of the last update
// ---------------------------------------------------------------------------

export async function getLastUpdateTime(gameSlug: string): Promise<Date | null> {
  try {
    const filePath = path.join(DATA_DIR, `${gameSlug}.json`);
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Write update log
// ---------------------------------------------------------------------------

export async function logUpdate(gameSlug: string, resultCount: number, source: string): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const logPath = path.join(DATA_DIR, 'update-log.json');

    let log: Record<string, { lastUpdate: string; resultCount: number; source: string }> = {};
    try {
      const data = await fs.readFile(logPath, 'utf-8');
      log = JSON.parse(data);
    } catch {
      // Fresh log
    }

    log[gameSlug] = {
      lastUpdate: new Date().toISOString(),
      resultCount,
      source,
    };

    await fs.writeFile(logPath, JSON.stringify(log, null, 2), 'utf-8');
  } catch {
    // Non-critical, ignore
  }
}
