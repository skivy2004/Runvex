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

// POST /api/slack-alert
// Called by n8n after lead scoring, or via test button
// Body: { lead_id?, naam, bedrijf, ai_prioriteit, ai_score, bericht, email }
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const supabase = getSupabase()

  // Load Slack config from settings
  const { data: settings } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['slack_webhook_url', 'slack_min_score'])

  const config: Record<string, string> = {}
  for (const s of settings ?? []) config[s.key] = s.value

  const webhookUrl = config['slack_webhook_url']
  const minScore   = parseInt(config['slack_min_score'] ?? '70', 10)

  if (!webhookUrl) {
    return NextResponse.json({ error: 'Geen Slack webhook geconfigureerd' }, { status: 400 })
  }

  const prioriteit = body.ai_prioriteit ?? 0

  // Score check (skip for test calls)
  if (!body.test && prioriteit < minScore) {
    return NextResponse.json({ skipped: true, reason: `Score ${prioriteit} < min ${minScore}` })
  }

  const scoreColor = prioriteit >= 80 ? '#ECB22E' : prioriteit >= 60 ? '#5B6EF5' : '#3A3D50'
  const scoreEmoji = prioriteit >= 80 ? '🔥' : prioriteit >= 60 ? '⭐' : '📋'

  const slackMessage = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${scoreEmoji} Nieuwe lead — ${body.naam ?? 'Onbekend'}` },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Bedrijf*\n${body.bedrijf || '—'}` },
          { type: 'mrkdwn', text: `*AI Score*\n${prioriteit}/100` },
          { type: 'mrkdwn', text: `*E-mail*\n${body.email || '—'}` },
          { type: 'mrkdwn', text: `*Prioriteit*\n${body.ai_score || '—'}` },
        ],
      },
      ...(body.bericht ? [{
        type: 'section',
        text: { type: 'mrkdwn', text: `*Bericht*\n>${String(body.bericht).slice(0, 300)}` },
      }] : []),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '→ Bekijk in dashboard' },
            url: 'https://runvex.app/demos/lead-automation/dashboard',
            style: 'primary',
          },
        ],
      },
    ],
    attachments: [{ color: scoreColor }],
  }

  const slackRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slackMessage),
  })

  if (!slackRes.ok) {
    const text = await slackRes.text()
    return NextResponse.json({ error: `Slack fout: ${text}` }, { status: 500 })
  }

  return NextResponse.json({ success: true, sent: true })
}
