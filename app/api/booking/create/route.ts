import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`booking:${getIp(req)}`, 3, 60 * 60 * 1000)) return tooManyRequests()

  try {
    const raw = await req.json()
    // Whitelist allowed fields — never forward arbitrary user input to n8n
    const naam  = typeof raw.naam  === 'string' ? raw.naam.trim().slice(0, 200)  : ''
    const email = typeof raw.email === 'string' ? raw.email.trim().slice(0, 200) : ''
    const datum = typeof raw.datum === 'string' ? raw.datum.trim().slice(0, 50)  : ''

    if (!naam || !email || !datum) {
      return NextResponse.json({ error: 'naam, email en datum zijn verplicht' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    const body = {
      naam,
      email,
      datum,
      tijdslot:   typeof raw.tijdslot  === 'string' ? raw.tijdslot.trim().slice(0, 50)   : undefined,
      telefoon:   typeof raw.telefoon  === 'string' ? raw.telefoon.trim().slice(0, 50)   : undefined,
      bedrijf:    typeof raw.bedrijf   === 'string' ? raw.bedrijf.trim().slice(0, 200)   : undefined,
      bericht:    typeof raw.bericht   === 'string' ? raw.bericht.trim().slice(0, 2000)  : undefined,
      form_token: process.env.FORM_TOKEN,
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
