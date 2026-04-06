import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'
import { checkDashboardSecret } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`sync-crm:${getIp(req)}`, 20, 60 * 1000)) return tooManyRequests()
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
    .select('*')
    .eq('id', leadId)
    .single()
  if (leadErr || !lead) return NextResponse.json({ error: 'Lead niet gevonden' }, { status: 404 })

  // Read CRM config
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['crm_type', 'crm_api_key'])

  const config: Record<string, string> = {}
  for (const s of settings ?? []) config[s.key] = s.value

  const crmType = config['crm_type']
  const apiKey = config['crm_api_key']

  if (!crmType || !apiKey) {
    return NextResponse.json({ error: 'CRM niet geconfigureerd — ga naar Instellingen → CRM' }, { status: 400 })
  }

  if (crmType === 'hubspot') {
    // HubSpot Contact API v3
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          email: lead.email,
          firstname: lead.naam.split(' ')[0],
          lastname: lead.naam.split(' ').slice(1).join(' ') || '',
          company: lead.bedrijf ?? '',
          phone: lead.telefoon ?? '',
          message: lead.bericht ?? '',
          hs_lead_status: 'NEW',
        },
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[sync-crm] HubSpot error:', res.status, text)
      return NextResponse.json({ error: 'CRM synchronisatie mislukt — probeer het later opnieuw' }, { status: 500 })
    }
  } else if (crmType === 'pipedrive') {
    // Pipedrive Person API
    const res = await fetch('https://api.pipedrive.com/v1/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        name: lead.naam,
        email: [{ value: lead.email, primary: true }],
        phone: lead.telefoon ? [{ value: lead.telefoon, primary: true }] : [],
        org_id: null,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[sync-crm] Pipedrive error:', res.status, text)
      return NextResponse.json({ error: 'CRM synchronisatie mislukt — probeer het later opnieuw' }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: `Onbekend CRM type: ${crmType}` }, { status: 400 })
  }

  // Mark as synchronized
  await supabase
    .from('leads')
    .update({ crm_gesynchroniseerd: true, crm_type: crmType })
    .eq('id', leadId)

  return NextResponse.json({ ok: true, crm: crmType })
}
