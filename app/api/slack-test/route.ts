import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST /api/slack-test
// Proxy voor de test-knop in het dashboard — voegt het DASHBOARD_SECRET header
// server-side toe zodat het nooit in de browser-bundle zit.
export async function POST(req: NextRequest) {
  const body = await req.json()

  const secret = process.env.DASHBOARD_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'DASHBOARD_SECRET niet geconfigureerd' }, { status: 500 })
  }

  const origin = req.headers.get('origin') ?? `https://${req.headers.get('host')}`

  const res = await fetch(`${origin}/api/slack-alert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-dashboard-secret': secret,
    },
    body: JSON.stringify({ ...body, test: true }),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
