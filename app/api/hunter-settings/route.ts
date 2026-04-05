import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function checkAuth(req: NextRequest): boolean {
  const secret = req.headers.get('x-dashboard-secret')
  return !!process.env.DASHBOARD_SECRET && secret === process.env.DASHBOARD_SECRET
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .eq('key', 'hunter_api_key')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mask the API key — only indicate whether it is set, never return the plaintext value
  const masked = (data ?? []).map((row: { key: string; value: string }) => ({
    key: row.key,
    value: row.value ? '••••••••' : '',
    is_set: !!row.value,
  }))
  return NextResponse.json(masked)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { value } = await req.json()
  const supabase = getSupabase()
  const { error } = await supabase
    .from('settings')
    .upsert({ key: 'hunter_api_key', value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
