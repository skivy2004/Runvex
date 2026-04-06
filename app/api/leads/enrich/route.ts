import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'
import { checkDashboardSecret } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`enrich:${getIp(req)}`, 20, 60 * 1000)) return tooManyRequests()
  if (!checkDashboardSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { leadId } = await req.json()
  if (!leadId) return NextResponse.json({ error: 'leadId vereist' }, { status: 400 })

  // Fetch lead
  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .select('id, email, verrijking')
    .eq('id', leadId)
    .single()

  if (leadErr || !lead) return NextResponse.json({ error: 'Lead niet gevonden' }, { status: 404 })

  // Read Hunter.io API key from settings
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .eq('key', 'hunter_api_key')

  const apiKey = settings?.find((s: { key: string; value: string }) => s.key === 'hunter_api_key')?.value
  if (!apiKey) return NextResponse.json({ error: 'Geen Hunter.io API key geconfigureerd' }, { status: 400 })

  // Extract domain from email
  const domain = lead.email.split('@')[1]
  if (!domain) return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })

  // Call Hunter.io company enrichment API
  // API key via Basic Auth header (not query string) to avoid leaking in server/proxy logs
  const hunterRes = await fetch(
    `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&limit=1`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
      },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 0 },
    }
  )

  if (!hunterRes.ok) {
    const text = await hunterRes.text()
    console.error('[enrich] Hunter.io error:', hunterRes.status, text)
    return NextResponse.json({ error: 'Verrijking mislukt — probeer het later opnieuw' }, { status: 500 })
  }

  const hunterData = await hunterRes.json()
  const org = hunterData.data ?? {}

  const verrijking = {
    bedrijfsnaam: org.organization ?? null,
    sector: org.industry ?? null,
    grootte: org.size ?? null,
    land: org.country ?? null,
    linkedin: org.linkedin ?? null,
    twitter: org.twitter ?? null,
    beschrijving: org.description ?? null,
    website: domain,
    bijgewerkt_op: new Date().toISOString(),
  }

  // Save enrichment to lead
  const { error: updateErr } = await supabase
    .from('leads')
    .update({ verrijking })
    .eq('id', leadId)

  if (updateErr) {
    console.error('[enrich] Supabase update error:', updateErr)
    return NextResponse.json({ error: 'Opslaan mislukt — probeer het later opnieuw' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, verrijking })
}
