import type { Lead } from '../page'

const ACCENT = '#5B6EF5'

function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
}: {
  label: string
  value: string | number
  sub: string
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm mb-1" style={{ color: '#5A5E82' }}>{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs mt-1" style={{ color: '#5A5E82' }}>{sub}</p>
      </div>
    </div>
  )
}

export default function StatsBar({ leads }: { leads: Lead[] }) {
  const total = leads.length
  const hoog = leads.filter(l => l.ai_score === 'hoog').length
  const followUp = leads.filter(l => l.follow_up_verstuurd).length
  const behandeld = leads.filter(l => (l as any).status === 'behandeld').length

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Totaal leads"
        value={total}
        sub={total === 0 ? 'Nog geen leads' : `${hoog} hoge prioriteit`}
        iconBg="rgba(91,110,245,0.15)"
        icon={
          <svg width="18" height="18" fill="none" stroke={ACCENT} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
      <StatCard
        label="Hoge prioriteit"
        value={hoog}
        sub={total > 0 ? `${Math.round((hoog / total) * 100)}% van alle leads` : '—'}
        iconBg="rgba(236,178,46,0.12)"
        icon={
          <svg width="18" height="18" fill="none" stroke="#ECB22E" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        }
      />
      <StatCard
        label="Follow-up verstuurd"
        value={followUp}
        sub={total > 0 ? `${Math.round((followUp / total) * 100)}% bereikt` : '—'}
        iconBg="rgba(62,207,142,0.1)"
        icon={
          <svg width="18" height="18" fill="none" stroke="#3ECF8E" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        }
      />
      <StatCard
        label="Behandeld"
        value={behandeld}
        sub={total > 0 ? `${Math.round((behandeld / total) * 100)}% afgehandeld` : '—'}
        iconBg="rgba(255,255,255,0.06)"
        icon={
          <svg width="18" height="18" fill="none" stroke="#8A8FA8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  )
}
