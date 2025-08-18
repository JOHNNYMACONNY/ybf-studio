// utils/rate-limiting.ts
// Lightweight in-memory rate limiter (suitable for dev and low-volume server runtimes)
// For production, consider a durable store (Upstash Redis, Vercel KV, etc.).

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds
  reason?: string;
}

type Bucket = {
  timestamps: number[]; // unix ms
};

// Module-level store (note: not durable across serverless invocations)
const store = new Map<string, Bucket>();

export function checkRateLimit(
  identifier: string,
  options?: { windowMs?: number; max?: number }
): RateLimitResult {
  const windowMs = options?.windowMs ?? 60_000; // 1 minute
  const max = options?.max ?? 5; // 5 requests per window

  const now = Date.now();
  const windowStart = now - windowMs;
  const bucket = store.get(identifier) ?? { timestamps: [] };
  // prune
  bucket.timestamps = bucket.timestamps.filter(ts => ts > windowStart);

  if (bucket.timestamps.length >= max) {
    const oldest = bucket.timestamps[0];
    const retryAfterMs = windowMs - (now - oldest);
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil(retryAfterMs / 1000)),
      reason: 'Too many requests, please slow down.',
    };
  }

  bucket.timestamps.push(now);
  store.set(identifier, bucket);
  return { allowed: true };
}