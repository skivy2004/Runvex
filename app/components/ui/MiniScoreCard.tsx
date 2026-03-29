export default function MiniScoreCard() {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Jan de Vries</div>
          <div className="text-[11px]" style={{ color: 'var(--text-3)' }}>
            jan@devries.nl
          </div>
        </div>
        <div
          className="px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{
            background: 'rgba(91,79,232,0.2)',
            color: '#A99FF5',
            border: '1px solid rgba(91,79,232,0.3)',
          }}
        >
          9/10
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="px-2 py-0.5 rounded-md text-[10px] font-medium"
          style={{
            background: 'rgba(91,79,232,0.15)',
            color: 'var(--purple-2)',
          }}
        >
          Hoog
        </div>
        <div
          className="px-2 py-0.5 rounded-md text-[10px] font-medium"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-2)',
          }}
        >
          IT &amp; Software
        </div>
      </div>

      <div className="text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
        Ervaren tech lead zoekt AI-automatisering voor sales pipeline.
        Hoge urgentie, direct inzetbaar.
      </div>

      {/* Score bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span style={{ color: 'var(--text-3)' }}>Prioriteit</span>
          <span style={{ color: 'var(--purple-2)' }}>Hoog</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: '90%',
              background: 'linear-gradient(90deg, var(--purple), var(--purple-2))',
            }}
          />
        </div>
      </div>
    </div>
  )
}
