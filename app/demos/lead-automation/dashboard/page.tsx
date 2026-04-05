import StatsBar from './components/StatsBar'
import LeadTable from './components/LeadTable'
import LeadSourceCard from './components/LeadSourceCard'
import ActivityFeed from './components/ActivityFeed'
import LeadChart from './components/LeadChart'
import OnboardingWizard from './components/OnboardingWizard'
import { DEMO_LEADS } from './demo-data'

export const revalidate = 0

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
  crm_gesynchroniseerd: boolean | null
  crm_type: string | null
  verrijking: {
    bedrijfsnaam?: string | null
    sector?: string | null
    grootte?: string | null
    land?: string | null
    linkedin?: string | null
    twitter?: string | null
    beschrijving?: string | null
    website?: string | null
    bijgewerkt_op?: string | null
  } | null
}

async function getLeads(): Promise<Lead[]> {
  // Demo pagina gebruikt fixture data — geen echte persoonsgegevens publiek toegankelijk
  return DEMO_LEADS
}

function buildChartData(leads: Lead[]) {
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (27 - i))
    return d.toISOString().split('T')[0]
  })

  const leadsByDay: Record<string, { count: number; hoog: number }> = {}
  for (const lead of leads) {
    const day = lead.aangemaakt_op.split('T')[0]
    if (!leadsByDay[day]) leadsByDay[day] = { count: 0, hoog: 0 }
    leadsByDay[day].count++
    if (lead.ai_score === 'hoog') leadsByDay[day].hoog++
  }

  return days.map(day => {
    const d = new Date(day)
    const label = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
    return {
      day: d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }),
      label,
      count: leadsByDay[day]?.count || 0,
      hoog: leadsByDay[day]?.hoog || 0,
    }
  })
}

export default async function DashboardPage() {
  let leads: Lead[] = []

  try {
    leads = await getLeads()
  } catch {
    leads = []
  }

  const chartData = buildChartData(leads)

  const today = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const openLeads = leads.filter(l => l.status !== 'behandeld').slice(0, 5)

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className="font-bricolage font-extrabold text-white"
            style={{ fontSize: 26, letterSpacing: '-0.02em' }}
          >
            Lead Dashboard
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
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.2)', color: '#3ECF8E' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>
        <a
          href="/demos/lead-automation/contact"
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

      {/* Onboarding wizard — toon alleen als er nog geen leads zijn */}
      {leads.length === 0 && <OnboardingWizard />}

      {/* Stats */}
      <StatsBar leads={leads} />

      {/* Chart */}
      <div
        className="rounded-xl mb-4 overflow-hidden"
        style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Lead activiteit</h2>
            <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>Afgelopen 28 dagen</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: '#5A5E82' }}>
            {leads.length} leads totaal
          </span>
        </div>
        <LeadChart data={chartData} />
      </div>

      {/* Middle row: Source donut | Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-2">
          <LeadSourceCard leads={leads} />
        </div>
        <div className="lg:col-span-3">
          <ActivityFeed leads={leads} />
        </div>
      </div>

      {/* Open leads — follow-up needed */}
      {openLeads.length > 0 && (
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Opvolging vereist</h2>
              <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>Leads die nog niet behandeld zijn</p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ background: 'rgba(236,178,46,0.1)', border: '1px solid rgba(236,178,46,0.2)', color: '#ECB22E' }}
            >
              {leads.filter(l => l.status !== 'behandeld').length} open
            </span>
          </div>
          <div className="space-y-2">
            {openLeads.map(lead => (
              <div
                key={lead.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: lead.ai_score === 'hoog' ? '#ECB22E' : lead.ai_score === 'middel' ? '#5B6EF5' : '#3A3D50' }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white truncate block">{lead.naam}</span>
                  <span className="text-xs truncate block" style={{ color: '#5A5E82' }}>
                    {lead.bedrijf || lead.email} · {lead.bron || 'Onbekend'}
                  </span>
                </div>
                <span className="text-xs shrink-0" style={{ color: '#3A3D50' }}>
                  {new Date(lead.aangemaakt_op).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-md shrink-0"
                  style={{
                    background: lead.ai_score === 'hoog' ? 'rgba(236,178,46,0.1)' : 'rgba(255,255,255,0.05)',
                    color: lead.ai_score === 'hoog' ? '#ECB22E' : '#5A5E82',
                  }}
                >
                  {lead.ai_score || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
