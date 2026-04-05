import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function GET(req: NextRequest) {
  if (!await rateLimit(`availability:${getIp(req)}`, 20, 60 * 1000)) return tooManyRequests()
  try {
    const res = await fetch(process.env.N8N_BOOKING_AVAILABILITY_URL!, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: 'Beschikbaarheid ophalen mislukt', details: message }, { status: 500 })
  }
}
