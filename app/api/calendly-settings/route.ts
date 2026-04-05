import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { checkDashboardSecret } from '@/app/lib/auth'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkAuth(req: NextRequest): boolean {
  return checkDashboardSecret(req)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .eq('key', 'calendly_url')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { value } = await req.json()
  const supabase = getSupabase()
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'calendly_url', value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
