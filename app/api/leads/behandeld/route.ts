import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

function checkDashboardSecret(req: NextRequest): boolean {
  const secret = req.headers.get('x-dashboard-secret')
  return !!process.env.DASHBOARD_SECRET && secret === process.env.DASHBOARD_SECRET
}

export async function POST(req: NextRequest) {
  if (!await rateLimit(`behandeld:${getIp(req)}`, 30, 60 * 1000)) return tooManyRequests()
  if (!checkDashboardSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { leadId } = await req.json()

  const { error } = await supabase
    .from('leads')
    .update({ status: 'behandeld' })
    .eq('id', leadId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
