/**
 * In-memory sliding window rate limiter.
 * Works per warm serverless instance only — not shared across Vercel instances.
 *
 * TODO: upgrade to Upstash Redis for cross-instance rate limiting when scaling:
 *   1. npm install @upstash/ratelimit @upstash/redis
 *   2. Add the following env vars to .env and Vercel dashboard:
 *        UPSTASH_REDIS_URL=https://<your-db>.upstash.io
 *        UPSTASH_REDIS_TOKEN=<your-token>
 *      (Also accepted by @upstash/redis: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
 *   3. Replace this file with:
 *        import { Ratelimit } from '@upstash/ratelimit'
 *        import { Redis } from '@upstash/redis'
 *        const redis = new Redis({
 *          url: process.env.UPSTASH_REDIS_URL!,
 *          token: process.env.UPSTASH_REDIS_TOKEN!,
 *        })
 *        const ratelimit = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m') })
 *        export async function rateLimit(key: string, limit: number, windowMs: number) {
 *          return (await ratelimit.limit(key)).success
 *        }
 *
 * UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN are currently NOT set — using in-memory fallback.
 */

const store = new Map<string, number[]>()

// Periodically clean up old entries to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, timestamps] of store.entries()) {
      const recent = timestamps.filter(t => now - t < 60 * 60 * 1000)
      if (recent.length === 0) store.delete(key)
      else store.set(key, recent)
    }
  }, 5 * 60 * 1000)
}

/**
 * Returns true if the request is allowed, false if rate limited.
 * @param key     Unique key (e.g. "contact:1.2.3.4")
 * @param limit   Max number of requests in the window
 * @param windowMs Window size in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = store.get(key) ?? []
  const recent = timestamps.filter(t => now - t < windowMs)
  if (recent.length >= limit) return false
  recent.push(now)
  store.set(key, recent)
  return true
}

export function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export function tooManyRequests() {
  return new Response(
    JSON.stringify({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }),
    { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
  )
}
