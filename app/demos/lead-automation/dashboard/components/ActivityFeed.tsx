import type { Lead } from '../page'
import ScoreBadge from './ScoreBadge'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'zojuist'
  if (m < 60) return `${m}m geleden`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}u geleden`
  const d = Math.floor(h / 24)
  return `${d}d geleden`
}

function Initials({ naam }: { naam: string }) {
  const parts = naam.trim().split(' ')
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : naam.slice(0, 2)

  const colors = ['#5B6EF5', '#3ECF8E', '#ECB22E', '#E8507A', '#7B6FF0']
  const color = colors[naam.charCodeAt(0) % colors.length]

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shrink-0"
      style={{ background: color }}
    >
      {initials.toUpperCase()}
    </div>
  )
}

export default function ActivityFeed({ leads }: { leads: Lead[] }) {
  const recent = [...leads]
    .sort((a, b) => new Date(b.aangemaakt_op).getTime() - new Date(a.aangemaakt_op).getTime())
    .slice(0, 6)

  return (
    <div
      className="rounded-xl p-5 flex flex-col h-full"
      style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Recente activiteit</h2>
        <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>Laatste leads binnengekomen</p>
      </div>

      {recent.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <p className="text-sm" style={{ color: '#5A5E82' }}>Nog geen activiteit</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {recent.map((lead, i) => (
            <li
              key={lead.id}
              className="flex items-start gap-3"
              style={{
                paddingBottom: i < recent.length - 1 ? 12 : 0,
                borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
              }}
            >
              <Initials naam={lead.naam} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-white truncate">{lead.naam}</span>
                  <ScoreBadge score={lead.ai_score} />
                </div>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#5A5E82' }}>
                  {lead.bedrijf ? `${lead.bedrijf} · ` : ''}{lead.bron || 'Onbekend'}
                </p>
              </div>
              <span className="text-xs shrink-0 mt-0.5" style={{ color: '#3A3D50' }}>
                {timeAgo(lead.aangemaakt_op)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
