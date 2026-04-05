import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`booking:${getIp(req)}`, 3, 60 * 60 * 1000)) return tooManyRequests()

  try {
    const raw = await req.json()
    // Whitelist allowed fields — never forward arbitrary user input to n8n
    const body = {
      naam:       typeof raw.naam === 'string'       ? raw.naam.slice(0, 200)       : undefined,
      email:      typeof raw.email === 'string'      ? raw.email.slice(0, 200)      : undefined,
      bedrijf:    typeof raw.bedrijf === 'string'    ? raw.bedrijf.slice(0, 200)    : undefined,
      telefoon:   typeof raw.telefoon === 'string'   ? raw.telefoon.slice(0, 50)    : undefined,
      bericht:    typeof raw.bericht === 'string'    ? raw.bericht.slice(0, 2000)   : undefined,
      datum:      typeof raw.datum === 'string'      ? raw.datum.slice(0, 50)       : undefined,
      form_token: typeof raw.form_token === 'string' ? raw.form_token.slice(0, 100) : undefined,
    }
    const res = await fetch(process.env.N8N_BOOKING_CREATE_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: 'Boeking aanmaken mislukt', details: message }, { status: 500 })
  }
}
