import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
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
