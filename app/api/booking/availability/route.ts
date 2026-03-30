import { NextResponse } from 'next/server'

export async function GET() {
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
