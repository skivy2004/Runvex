import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function GET() {
  return NextResponse.json({ status: 'ok', method: 'GET' })
}

export async function POST(req: NextRequest) {
  if (!await rateLimit(`contact:${getIp(req)}`, 5, 15 * 60 * 1000)) return tooManyRequests()

  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Webhook URL niet geconfigureerd' },
      { status: 500 }
    )
  }

  try {
    const raw = await req.json()

    // Whitelist fields — never forward arbitrary keys to n8n
    const { naam, email, bedrijf, telefoon, bericht } = raw
    if (!naam || typeof naam !== 'string' || naam.trim().length === 0) {
      return NextResponse.json({ error: 'naam is verplicht' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
    }
    if (!bericht || typeof bericht !== 'string' || bericht.trim().length === 0) {
      return NextResponse.json({ error: 'bericht is verplicht' }, { status: 400 })
    }

    const safeBody = {
      naam: naam.trim().slice(0, 200),
      email: email.trim().slice(0, 254),
      bedrijf: typeof bedrijf === 'string' ? bedrijf.trim().slice(0, 200) : '',
      telefoon: typeof telefoon === 'string' ? telefoon.trim().slice(0, 20) : '',
      bericht: bericht.trim().slice(0, 2000),
      form_token: process.env.FORM_TOKEN,
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeBody),
      signal: AbortSignal.timeout(10_000),
    })

    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      data = { message: text }
    }

    return NextResponse.json(data, { status: response.status })
  } catch (err: unknown) {
    console.error('[api/contact] webhook error:', err)
    return NextResponse.json({ error: 'Webhook niet bereikbaar' }, { status: 502 })
  }
}
