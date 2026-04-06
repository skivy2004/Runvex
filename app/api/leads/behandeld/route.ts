// Authentication Check: Voeg een geheime header toe om alleen geautoriseerde services toegang te geven.
const requiredSecret = process.env.ADMIN_SECRET_LEADS_UPDATE;
if (!request.headers.get('X-Admin-Secret') || request.headers.get('X-Admin-Secret') !== requiredSecret) {
    return NextResponse.json({ message: "Unauthorized access." }, { status: 401 });
}

try {
    // 1. Body Parsen (assumptie: body bevat minstens een lead_id)
    const { lead_id } = await request.json();
    if (!lead_id) {
        return NextResponse.json({ message: "Missing required parameter: lead_id." }, { status: 400 });
    }

    // 2. Supabase DB Update (Genereer een transactie om zowel status als andere velden te updaten)
    const { data, error } = await supabase
        .from('leads')
        .update({ status: 'behandeld', behandeld_op: new Date().toISOString(), behandeld_door_user_id: request.headers.get('X-User-Id') || 'system')
        .eq('id', lead_id)
        .select();

    if (error) {
        // SECURITY FIX: Vang de DB error op en retourneer een generieke 500 foutmelding,
        // zonder de technische error details te lekken.
        console.error("Database error during lead update:", error);
        return NextResponse.json(
            { message: "We are unable to update the lead status due to a system error. Please try again later." },
            { status: 500 }
        );
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ message: `Lead with ID ${lead_id} not found.` }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead status successfully updated to 'behandeld'." }, { status: 200 });

} catch (error) {
    // Algemene catch voor onvoorziene fouten (bijv. malformed JSON body)
    console.error("Unexpected error in /api/leads/behandeld:", error);
    return NextResponse.json(
        { message: "An unexpected server error occurred while processing your request." },
        { status: 500 }
    );
}import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'
import { checkDashboardSecret } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  if (!await rateLimit(`behandeld:${getIp(req)}`, 30, 60 * 1000)) return tooManyRequests()
  if (!checkDashboardSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { leadId } = await req.json()

  const { error } = await supabase
    .from('leads')
    .update({ status: 'behandeld' })
    .eq('id', leadId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
