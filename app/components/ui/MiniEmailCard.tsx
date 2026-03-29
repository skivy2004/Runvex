export default function MiniEmailCard() {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Email header */}
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, var(--purple), var(--purple-2))',
          }}
        >
          R
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white">Runvex</div>
          <div className="text-[10px] truncate" style={{ color: 'var(--text-3)' }}>
            noreply@runvex.nl
          </div>
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          2 min
        </div>
      </div>

      {/* Subject */}
      <div>
        <div className="text-xs font-semibold text-white mb-1">
          Re: Jouw vraag over Runvex
        </div>
        <div
          className="text-[11px] leading-relaxed"
          style={{ color: 'var(--text-2)' }}
        >
          Hoi Jan, bedankt voor je interesse in Runvex! Op basis van je vraag
          over AI-automatisering heb ik een persoonlijk overzicht voor je
          samengesteld...
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 pt-1">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#28C840' }}
        />
        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
          Verzonden · 14:32
        </span>
      </div>
    </div>
  )
}
