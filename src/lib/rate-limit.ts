/**
 * In-memory rate limiter for AI API calls.
 * Tracks per-IP daily usage. Resets at midnight UTC.
 *
 * Works correctly for single-instance deployments (Vercel hobby, Railway, etc.).
 * For multi-instance production scale, replace with a Redis or Firestore counter.
 */

interface UsageBucket {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

const DAILY_LIMIT = 50;
const buckets = new Map<string, UsageBucket>();

function getOrCreateBucket(key: string): UsageBucket {
  const now = Date.now();
  const existing = buckets.get(key);

  if (existing && existing.resetAt > now) {
    return existing;
  }

  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);

  const bucket: UsageBucket = { count: 0, resetAt: tomorrow.getTime() };
  buckets.set(key, bucket);
  return bucket;
}

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
} {
  const bucket = getOrCreateBucket(identifier);
  const remaining = Math.max(0, DAILY_LIMIT - bucket.count);
  return { allowed: bucket.count < DAILY_LIMIT, remaining, limit: DAILY_LIMIT, resetAt: bucket.resetAt };
}

export function consumeRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  limit: number;
} {
  const bucket = getOrCreateBucket(identifier);

  if (bucket.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0, limit: DAILY_LIMIT };
  }

  bucket.count++;
  return { allowed: true, remaining: DAILY_LIMIT - bucket.count, limit: DAILY_LIMIT };
}

export function refundRateLimit(identifier: string): void {
  const bucket = buckets.get(identifier);
  if (bucket && bucket.count > 0) {
    bucket.count--;
  }
}

// Cleanup stale buckets every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, 10 * 60 * 1000);
}
