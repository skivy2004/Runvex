import { createClient } from '@supabase/supabase-js'
import StatsBar from './components/StatsBar'
import LeadTable from './components/LeadTable'

export const revalidate = 60

export type Lead = {
  id: string
  naam: string
  email: string
  bedrijf: string | null
  telefoon: string | null
  bericht: string
  bron: string | null
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
  let fetchError: string | null = null

  try {
    leads = await getLeads()
  } catch {
    leads = []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">{leads.length} leads totaal</p>
          </div>
          <a href="/" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            ← Contactformulier
          </a>
        </div>

        <StatsBar leads={leads} />
        <LeadTable leads={leads} lastUpdated={new Date()} />
      </div>
    </div>
  )
}
