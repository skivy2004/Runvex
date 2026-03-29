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
        <div
          key={s.label}
          className="rounded-xl p-5"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="text-sm mb-1" style={{ color: '#8A8FA8' }}>{s.label}</p>
          <p className="text-3xl font-bold text-white">{s.value}</p>
        </div>
      ))}
    </div>
  )
}
