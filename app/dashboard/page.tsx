import { createClient } from '@supabase/supabase-js'
import StatsBar from './components/StatsBar'
import LeadTable from './components/LeadTable'
import LeadSourceCard from './components/LeadSourceCard'
import ActivityFeed from './components/ActivityFeed'

export const revalidate = 60

export type Lead = {
  id: string
  naam: string
  email: string
  bedrijf: string | null
  telefoon: string | null
  bericht: string
  bron: string | null
  status: string | null
  ai_score: string | null
  ai_sector: string | null
  ai_samenvatting: string | null
  ai_prioriteit: number | null
  follow_up_verstuurd: boolean
  aangemaakt_op: string
}

async function getLeads(): Promise<Lead[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('form_token', process.env.NEXT_PUBLIC_FORM_TOKEN || process.env.FORM_TOKEN)
    .order('ai_prioriteit', { ascending: false })
    .order('aangemaakt_op', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Lead[]
}

export default async function DashboardPage() {
  let leads: Lead[] = []

  try {
    leads = await getLeads()
  } catch {
    leads = []
  }

  const today = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className="font-bricolage font-extrabold text-white"
            style={{ fontSize: 26, letterSpacing: '-0.02em' }}
          >
            Leads overzicht
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8A8FA8' }}
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {today}
            </span>
          </div>
        </div>
        <a
          href="/contact"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0 transition-colors"
          style={{
            border: '1.5px dashed rgba(91,110,245,0.4)',
            background: 'rgba(91,110,245,0.06)',
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Formulier bekijken
        </a>
      </div>

      {/* Stats */}
      <StatsBar leads={leads} />

      {/* Middle row: Lead source + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-2">
          <LeadSourceCard leads={leads} />
        </div>
        <div className="lg:col-span-3">
          <ActivityFeed leads={leads} />
        </div>
      </div>

      {/* Lead table */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Alle leads</h2>
            <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>{leads.length} leads totaal</p>
          </div>
        </div>
        <LeadTable leads={leads} lastUpdated={new Date()} />
      </div>
    </div>
  )
}
