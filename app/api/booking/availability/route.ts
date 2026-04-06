import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function GET(req: NextRequest) {
  if (!await rateLimit(`availability:${getIp(req)}`, 20, 60 * 1000)) return tooManyRequests()

  const apiUrl = process.env.N8N_BOOKING_AVAILABILITY_URL;

  if (!apiUrl) {
    console.error('N8N_BOOKING_AVAILABILITY_URL is NIET ingesteld in de environment variables.');
    return NextResponse.json({ 
      error: 'Service Configuration Error', 
      message: 'De API URL voor booking beschikbaarheidscheck is niet gevonden in de omgeving. Gelieve N8N_BOOKING_AVAILABILITY_URL in te stellen.' 
    }, { status: 500 })
  }


  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
        // Behandel HTTP foutcodes van de externe API (bv. 404, 503)
        const errorBody = await res.text();
        return NextResponse.json({ 
            error: `Externe API fout (${res.status})`, 
            details: `De oproep naar de N8N webhook is mislukt. Status: ${res.status}. Reactie van de service: ${errorBody.substring(0, 200)}` 
        }, { status: res.status })
    }
    
    const data = await res.json()
    return NextResponse.json(data, { status: 200 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Onbekende fout'
    console.error("Error fetching booking availability:", err);
    // Deze catch vangt fouten op van de fetch-aanroep zelf (bv. netwerkproblemen, bad URL format)
    return NextResponse.json({ 
        error: 'Beschikbaarheid ophalen mislukt door een runtime fout.', 
        details: message 
    }, { status: 500 })
  }
}
