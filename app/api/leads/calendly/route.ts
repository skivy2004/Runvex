import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'
import { checkDashboardSecret } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`calendly:${getIp(req)}`, 10, 60 * 1000)) return tooManyRequests()
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

  if (leadErr || !lead) {
    return NextResponse.json({ error: 'Lead niet gevonden' }, { status: 404 })
  }

  // Read Calendly URL from settings
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .eq('key', 'calendly_url')

  const calendlyUrl = settings?.find((s: { key: string; value: string }) => s.key === 'calendly_url')?.value

  if (!calendlyUrl) {
    return NextResponse.json({ error: 'Geen Calendly URL geconfigureerd — ga naar Instellingen → Calendly' }, { status: 400 })
  }

  const voornaam = lead.naam.split(' ')[0]

  // Send invite email via Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.BEDRIJF_EMAIL ?? 'noreply@runvex.app',
        to: lead.email,
        subject: `Plan een gratis kennismaking, ${voornaam}`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#0A0B0F;color:#ffffff;font-family:system-ui,sans-serif;margin:0;padding:0;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:32px;height:32px;background:linear-gradient(135deg,#5B6EF5,#3B4FD5);border-radius:8px;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-weight:bold;font-size:13px;">R</span>
      </div>
      <span style="font-weight:700;font-size:16px;">Runvex</span>
    </div>

    <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.02em;margin:0 0 12px;">Hoi ${voornaam},</h1>
    <p style="color:#8A8FA8;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Bedankt voor je interesse in Runvex! We helpen je graag om te zien hoe we jouw leadproces kunnen automatiseren.
    </p>
    <p style="color:#8A8FA8;font-size:15px;line-height:1.6;margin:0 0 32px;">
      Plan via onderstaande knop een gratis kennismakingsgesprek in — 20 minuten, geen verplichtingen.
    </p>

    <a href="${calendlyUrl}" style="display:block;background:#5B6EF5;color:white;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px;">
      Plan een gratis kennismaking →
    </a>

    <p style="color:#5A5E82;font-size:13px;line-height:1.6;margin:0;">
      Of kopieer deze link: <a href="${calendlyUrl}" style="color:#5B6EF5;">${calendlyUrl}</a>
    </p>

    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #1e2030;">
      <p style="color:#5A5E82;font-size:12px;margin:0;">
        Je ontvangt dit bericht omdat je contact hebt opgenomen via runvex.app.
      </p>
    </div>
  </div>
</body>
</html>`,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[calendly] Resend error:', res.status, text)
      return NextResponse.json({ error: 'E-mail verzenden mislukt — probeer het later opnieuw' }, { status: 500 })
    }
  } catch (err) {
    console.error('[calendly] Unexpected error:', err)
    return NextResponse.json({ error: 'Er ging iets mis — probeer het later opnieuw' }, { status: 500 })
  }

  // Mark lead as 'uitgenodigd'
  const { error: updateErr } = await supabase
    .from('leads')
    .update({ status: 'uitgenodigd' })
    .eq('id', leadId)

  if (updateErr) {
    console.error('[calendly] Supabase update error:', updateErr)
    return NextResponse.json({ error: 'Opslaan mislukt — probeer het later opnieuw' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
