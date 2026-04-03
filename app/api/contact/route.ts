import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function GET() {
  return NextResponse.json({ status: 'ok', method: 'GET' })
}

export async function POST(req: NextRequest) {
  if (!rateLimit(`contact:${getIp(req)}`, 5, 15 * 60 * 1000)) return tooManyRequests()

  const webhookUrl = process.env.N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Webhook URL niet geconfigureerd' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    return NextResponse.json({ error: 'Webhook niet bereikbaar', details: message }, { status: 502 })
  }
}
