import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function escapeHtml(str: string | null | undefined): string {
  if (str == null) return '—'
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Trigger via cron of n8n: POST /api/weekly-report
// Optioneel: voeg een secret toe via Authorization header

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-report-secret')
  if (!secret || secret !== process.env.REPORT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .gte('aangemaakt_op', weekAgo.toISOString())
    .neq('bron', 'waitlist')
    .order('ai_prioriteit', { ascending: false })

  if (!leads) return NextResponse.json({ error: 'Geen data' }, { status: 500 })

  const totaal = leads.length
  const hoog = leads.filter(l => l.ai_score === 'hoog').length
  const followUp = leads.filter(l => l.follow_up_verstuurd).length
  const behandeld = leads.filter(l => l.status === 'behandeld').length
  const top3 = leads.slice(0, 3)

  const topLeadsHtml = top3.map(l => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1e2030;">${escapeHtml(l.naam)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e2030;">${escapeHtml(l.bedrijf)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e2030;color:#5B6EF5;font-weight:600;">${l.ai_prioriteit != null ? Number(l.ai_prioriteit) : '—'}/100</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e2030;">${escapeHtml(l.ai_sector)}</td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="background:#0A0B0F;color:#ffffff;font-family:system-ui,sans-serif;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#5B6EF5,#3B4FD5);border-radius:9px;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-weight:bold;font-size:14px;">R</span>
      </div>
      <span style="font-weight:700;font-size:18px;">runvex</span>
    </div>

    <h1 style="font-size:28px;font-weight:800;letter-spacing:-0.02em;margin:0 0 8px;">Jouw weekrapport</h1>
    <p style="color:#8A8FA8;margin:0 0 32px;">${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px;">
      ${[
        { label: 'Leads ontvangen', value: totaal, color: '#5B6EF5' },
        { label: 'Hoge prioriteit', value: hoog, color: '#F5A623' },
        { label: 'Follow-up verstuurd', value: followUp, color: '#3ECF8E' },
        { label: 'Behandeld', value: behandeld, color: '#8A8FA8' },
      ].map(s => `
        <div style="background:#12141A;border:1px solid #1e2030;border-radius:12px;padding:16px;">
          <div style="font-size:28px;font-weight:800;color:${s.color};margin-bottom:4px;">${s.value}</div>
          <div style="font-size:12px;color:#8A8FA8;">${s.label}</div>
        </div>
      `).join('')}
    </div>

    ${top3.length > 0 ? `
    <h2 style="font-size:14px;font-weight:600;margin:0 0 12px;color:#8A8FA8;text-transform:uppercase;letter-spacing:0.05em;">Top 3 leads deze week</h2>
    <table style="width:100%;border-collapse:collapse;background:#12141A;border-radius:12px;overflow:hidden;border:1px solid #1e2030;margin-bottom:32px;">
      <thead>
        <tr style="background:#0C0E1B;">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#5A5E82;font-weight:600;">Naam</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#5A5E82;font-weight:600;">Bedrijf</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#5A5E82;font-weight:600;">Score</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:#5A5E82;font-weight:600;">Sector</th>
        </tr>
      </thead>
      <tbody>${topLeadsHtml}</tbody>
    </table>
    ` : ''}

    <a href="https://runvex.app/demos/lead-automation/dashboard" style="display:block;background:#5B6EF5;color:white;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;margin-bottom:24px;">
      Bekijk dashboard →
    </a>

    <p style="color:#5A5E82;font-size:12px;text-align:center;">
      Je ontvangt dit rapport elke maandag. <a href="https://runvex.app/contact" style="color:#5B6EF5;">Uitschrijven</a>
    </p>
  </div>
</body>
</html>`

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: process.env.BEDRIJF_EMAIL ?? 'noreply@runvex.app',
      to: process.env.EIGENAAR_EMAIL ?? '',
      subject: `Runvex weekrapport — ${totaal} leads, ${hoog} hoge prioriteit`,
      html,
    })
    if (error) throw error
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }

  return NextResponse.json({ success: true, totaal, hoog, followUp, behandeld })
}
