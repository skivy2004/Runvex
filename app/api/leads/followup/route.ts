import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { leadId } = await req.json()

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: 'Lead niet gevonden' }, { status: 404 })
  }

  // Probeer follow-up email te sturen (niet fataal als het mislukt)
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.BEDRIJF_EMAIL,
        to: lead.email,
        subject: 'Heb je nog vragen?',
        text: `Hoi ${lead.naam.split(' ')[0]},\n\nWe wilden even checken of je nog vragen hebt naar aanleiding van je eerdere bericht.\n\nLaat het ons weten, we helpen je graag verder!\n\nMet vriendelijke groet,\nHet Runvex team`,
      }),
    })
  } catch {
    // Email versturen mislukt — we updaten de DB toch
  }

  // Altijd de DB updaten
  const { error: updateError } = await supabase
    .from('leads')
    .update({ follow_up_verstuurd: true, status: 'follow_up_verstuurd' })
    .eq('id', leadId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
