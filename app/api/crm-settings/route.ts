import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['crm_type', 'crm_api_key', 'crm_min_score'])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { crm_type, crm_api_key, crm_min_score } = await req.json()
  const supabase = getSupabase()

  const upserts = [
    { key: 'crm_type', value: crm_type ?? '' },
    { key: 'crm_api_key', value: crm_api_key ?? '' },
    { key: 'crm_min_score', value: String(crm_min_score ?? 0) },
  ].map(item => ({ ...item, updated_at: new Date().toISOString() }))

  const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
