import type { Lead } from '../page'

const COLORS = [
  '#5B6EF5',
  '#3ECF8E',
  '#ECB22E',
  '#E8507A',
  '#7B6FF0',
]

export default function LeadSourceCard({ leads }: { leads: Lead[] }) {
  const total = leads.length

  const counts: Record<string, number> = {}
  for (const lead of leads) {
    const key = lead.bron || 'Onbekend'
    counts[key] = (counts[key] || 0) + 1
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div
      className="rounded-xl p-5 flex flex-col h-full"
      style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-1">
        <h2 className="text-sm font-semibold text-white">Leadbron</h2>
        <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>Herkomst van je leads</p>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: '#5A5E82' }}>Nog geen leads</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {sorted.map(([label, count], i) => {
            const pct = Math.round((count / total) * 100)
            const color = COLORS[i % COLORS.length]
            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-xs font-medium" style={{ color: '#8A8FA8' }}>{label}</span>
                  </div>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#8A8FA8' }}
                  >{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
