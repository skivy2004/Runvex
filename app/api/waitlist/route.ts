import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`waitlist:${getIp(req)}`, 3, 60 * 60 * 1000)) return tooManyRequests()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { email, feature } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-mail verplicht' }, { status: 400 })

  await supabase.from('leads').insert({
    email,
    bericht: `Waitlist aanmelding voor: ${feature}`,
    bron: 'waitlist',
    naam: 'Waitlist',
    form_token: process.env.FORM_TOKEN,
  })

  return NextResponse.json({ success: true })
}
