import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { checkDashboardSecret } from '@/app/lib/auth'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await rateLimit(`linkedin-drafts:${getIp(req)}`, 30, 60_000)) return tooManyRequests()
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const update: Record<string, unknown> = {}
  if (typeof body.draft_tekst === 'string') update.draft_tekst = body.draft_tekst.trim().slice(0, 10000)
  if (typeof body.hook === 'string') update.hook = body.hook.trim().slice(0, 500)
  if (typeof body.onderwerp === 'string') update.onderwerp = body.onderwerp.trim().slice(0, 200)
  if (typeof body.gebaseerd_op_url === 'string') update.gebaseerd_op_url = body.gebaseerd_op_url.trim().slice(0, 2000)
  if (typeof body.gebaseerd_op_likes === 'number') update.gebaseerd_op_likes = Math.max(0, Math.floor(body.gebaseerd_op_likes))
  if (typeof body.status === 'string') update.status = body.status.trim().slice(0, 50)
  if (body.geplaatst_op !== undefined) update.geplaatst_op = body.geplaatst_op
  if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Geen geldige velden om bij te werken' }, { status: 400 })
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('linkedin_drafts')
    .update(update)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await rateLimit(`linkedin-drafts:${getIp(_req)}`, 30, 60_000)) return tooManyRequests()
  if (!checkAuth(_req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const supabase = getSupabase()
  const { error } = await supabase.from('linkedin_drafts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
