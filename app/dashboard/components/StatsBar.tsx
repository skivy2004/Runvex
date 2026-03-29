import type { Lead } from '../page'

export default function StatsBar({ leads }: { leads: Lead[] }) {
  const total = leads.length
  const hoog = leads.filter(l => l.ai_score === 'hoog').length
  const followUp = leads.filter(l => l.follow_up_verstuurd).length
  const avgPrio = total > 0
    ? (leads.reduce((s, l) => s + (l.ai_prioriteit || 0), 0) / total).toFixed(1)
    : '—'

  const stats = [
    { label: 'Totaal leads', value: total },
    { label: 'Hoge prioriteit', value: hoog },
    { label: 'Follow-up verstuurd', value: followUp },
    { label: 'Gem. prioriteit', value: avgPrio },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{s.label}</p>
          <p className="text-3xl font-bold text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  )
}
