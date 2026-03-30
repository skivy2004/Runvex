import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
