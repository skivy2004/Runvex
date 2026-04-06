import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export const dynamic = 'force-dynamic'

async function checkSupabase() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error } = await supabase.from('leads').select('id').limit(1)
    return error ? 'degraded' : 'operational'
  } catch {
    return 'down'
  }
}

async function checkResend() {
  try {
    if (!process.env.RESEND_API_KEY) return 'unknown'
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    })
    return res.ok ? 'operational' : 'degraded'
  } catch {
    return 'degraded'
  }
}

export async function GET(req: NextRequest) {
  const ip = getIp(req)
  const allowed = await rateLimit(`health:${ip}`, 10, 60_000)
  if (!allowed) return tooManyRequests()

  const [db, email] = await Promise.all([checkSupabase(), checkResend()])

  const services = [
    { name: 'API', status: 'operational' },
    { name: 'Database (Supabase)', status: db },
    { name: 'E-mail (Resend)', status: email },
    { name: 'Webhook intake', status: 'operational' },
  ]

  const overall = services.some(s => s.status === 'down')
    ? 'down'
    : services.some(s => s.status === 'degraded')
    ? 'degraded'
    : 'operational'

  return NextResponse.json({
    status: overall,
    services,
    checkedAt: new Date().toISOString(),
  })
}
