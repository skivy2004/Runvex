import { NextRequest, NextResponse } from 'next/server'
import nodeCrypto from 'crypto'

const DASHBOARD_PATH = '/demos/lead-automation/dashboard'
const LOGIN_PATH = '/demos/lead-automation/login'
const COOKIE_NAME = 'dashboard_session'

function verifyDashboardToken(token: string, secret: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, sig] = parts
  const expected = nodeCrypto.createHmac('sha256', secret).update(payload).digest('hex')
  if (sig.length !== expected.length) return false
  try {
    if (!nodeCrypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  } catch {
    return false
  }
  const expires = parseInt(payload.split(':')[1], 10)
  return Date.now() < expires
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Dashboard auth check — redirect to login if no valid session
  if (pathname.startsWith(DASHBOARD_PATH)) {
    const secret = process.env.DASHBOARD_SECRET
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!secret || !token || !verifyDashboardToken(token, secret)) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = LOGIN_PATH
      return NextResponse.redirect(loginUrl)
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' propagates trust to dynamically created scripts (CrispChat, etc.)
    // Host-based allowlist kept as fallback for older browsers that don't support strict-dynamic
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://client.crisp.chat https://cdn.crisp.chat`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://client.crisp.chat",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https://*.supabase.co https://api.resend.com https://api.anthropic.com https://hooks.slack.com https://client.crisp.chat wss://client.relay.crisp.chat",
    "frame-src 'self' https://calendly.com https://www.youtube.com",
    "frame-ancestors 'none'",
  ].join('; ')

  // Pass nonce to the request so Server Components can read it via headers()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  // Inject dashboard secret server-side so it never reaches the client bundle
  if (request.nextUrl.pathname.startsWith('/api/') && process.env.DASHBOARD_SECRET) {
    requestHeaders.set('x-dashboard-secret', process.env.DASHBOARD_SECRET)
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  // Exclude static assets — they don't need a nonce and benefit from caching
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
