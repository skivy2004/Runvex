import type { Lead } from '../page'

const COLORS = ['#5B6EF5', '#3ECF8E', '#ECB22E', '#E8507A', '#7B6FF0']

function DonutChart({ segments }: { segments: { pct: number; color: string }[] }) {
  const R = 40
  const stroke = 10
  const cx = 55
  const cy = 55
  const circumference = 2 * Math.PI * R

  let offset = 0
  const arcs = segments.map(({ pct, color }) => {
    const len = (pct / 100) * circumference
    const arc = { offset, len, color }
    offset += len
    return arc
  })

  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={arc.color}
          strokeWidth={stroke}
          strokeDasharray={`${arc.len} ${circumference - arc.len}`}
          strokeDashoffset={circumference / 4 - arc.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  )
}

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

  const segments = sorted.map(([, count], i) => ({
    pct: Math.round((count / total) * 100),
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div
      className="rounded-xl p-5 flex flex-col h-full"
      style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Lead Source</h2>
          <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>Herkomst van je leads</p>
        </div>
        <button style={{ color: '#5A5E82' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01" />
          </svg>
        </button>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm" style={{ color: '#5A5E82' }}>Nog geen leads</p>
        </div>
      ) : (
        <>
          {/* Donut + legend side by side */}
          <div className="flex items-center gap-4 mb-4">
            <div className="shrink-0 relative">
              <DonutChart segments={segments} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-bricolage font-bold text-white text-lg">{total}</span>
                <span className="text-xs" style={{ color: '#5A5E82' }}>totaal</span>
              </div>
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              {sorted.map(([label, count], i) => {
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-xs truncate" style={{ color: '#8A8FA8' }}>{label}</span>
                    </div>
                    <span className="text-xs font-semibold shrink-0" style={{ color: '#5A5E82' }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
