import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

const COOKIE_NAME = 'dashboard_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 dagen

function signToken(secret: string): string {
  const expires = Date.now() + SESSION_MAX_AGE * 1000
  const payload = `dashboard:${expires}`
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function verifyToken(token: string, secret: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, sig] = parts
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  const expires = parseInt(payload.split(':')[1], 10)
  return Date.now() < expires
}

// POST — login
export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const allowed = await rateLimit(`dashboard-auth:${ip}`, 5, 15 * 60 * 1000)
  if (!allowed) return tooManyRequests()

  const secret = process.env.DASHBOARD_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server configuratie ontbreekt' }, { status: 500 })
  }

  let body: { wachtwoord?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 })
  }

  const { wachtwoord } = body
  if (!wachtwoord || typeof wachtwoord !== 'string') {
    return NextResponse.json({ error: 'Wachtwoord is verplicht' }, { status: 400 })
  }

  const inputHash = crypto.createHash('sha256').update(wachtwoord).digest('hex')
  const secretHash = crypto.createHash('sha256').update(secret).digest('hex')
  const match = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(secretHash))

  if (!match) {
    return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 })
  }

  const token = signToken(secret)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  return res
}

// DELETE — logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}

export { verifyToken, COOKIE_NAME }
