/**
 * Rate limiter with Upstash Redis support.
 *
 * Uses Upstash Redis when UPSTASH_REDIS_URL + UPSTASH_REDIS_TOKEN are set
 * (cross-instance, production-safe). Falls back to in-memory sliding window.
 *
 * Setup Upstash:
 *   1. Create a Redis DB at console.upstash.com
 *   2. Add to .env + Vercel dashboard:
 *        UPSTASH_REDIS_URL=https://<your-db>.upstash.io
 *        UPSTASH_REDIS_TOKEN=<your-token>
 */

// ── Upstash path ─────────────────────────────────────────────────────────────

let upstashReady: boolean | null = null

async function upstashRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Ratelimit } = require('@upstash/ratelimit')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require('@upstash/redis')

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  })

  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
    prefix: 'rl',
  })

  const { success } = await rl.limit(key)
  return success
}

// ── In-memory fallback ────────────────────────────────────────────────────────

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

function inMemoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = store.get(key) ?? []
  const recent = timestamps.filter(t => now - t < windowMs)
  if (recent.length >= limit) return false
  recent.push(now)
  store.set(key, recent)
  return true
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns true if the request is allowed, false if rate limited.
 * @param key     Unique key (e.g. "contact:1.2.3.4")
 * @param limit   Max number of requests in the window
 * @param windowMs Window size in milliseconds
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (upstashReady !== false && process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    try {
      const result = await upstashRateLimit(key, limit, windowMs)
      upstashReady = true
      return result
    } catch {
      upstashReady = false // disable for remaining lifetime of this instance
    }
  }
  return inMemoryRateLimit(key, limit, windowMs)
}

// Basic pattern that matches IPv4 and IPv6 addresses (no path/port injection).
const IP_PATTERN = /^[\d.a-fA-F:]+$/

/**
 * Extracts the client IP from the request headers.
 *
 * Trust assumption: this app runs behind Vercel's edge network, which
 * overwrites x-forwarded-for with the real client IP before the request
 * reaches the serverless function. Spoofing by end-users is therefore not
 * possible in production. In local/non-Vercel environments the header can
 * be forged, so we validate the value looks like an IP before using it.
 */
export function getIp(req: Request): string {
  const candidates = [
    req.headers.get('x-forwarded-for')?.split(',')[0].trim(),
    req.headers.get('x-real-ip'),
  ]

  for (const candidate of candidates) {
    if (candidate && IP_PATTERN.test(candidate)) {
      return candidate
    }
  }

  return 'unknown'
}

export function tooManyRequests() {
  return new Response(
    JSON.stringify({ error: 'Te veel verzoeken. Probeer het later opnieuw.' }),
    { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
  )
}
