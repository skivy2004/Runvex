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
  const status = req.nextUrl.searchParams.get('status')
  const supabase = getSupabase()
  let query = supabase.from('linkedin_drafts').select('*').order('aangemaakt_op', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const draft_tekst = typeof body.draft_tekst === 'string' ? body.draft_tekst.trim().slice(0, 10000) : undefined
  if (!draft_tekst) return NextResponse.json({ error: 'draft_tekst is verplicht' }, { status: 400 })
  const insert: Record<string, unknown> = {
    draft_tekst,
    hook: typeof body.hook === 'string' ? body.hook.trim().slice(0, 500) : null,
    onderwerp: typeof body.onderwerp === 'string' ? body.onderwerp.trim().slice(0, 200) : null,
    gebaseerd_op_url: typeof body.gebaseerd_op_url === 'string' ? body.gebaseerd_op_url.trim().slice(0, 2000) : null,
    gebaseerd_op_likes: typeof body.gebaseerd_op_likes === 'number' ? Math.max(0, Math.floor(body.gebaseerd_op_likes)) : null,
    status: typeof body.status === 'string' ? body.status.trim().slice(0, 50) : 'concept',
  }
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('linkedin_drafts')
    .insert(insert)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
