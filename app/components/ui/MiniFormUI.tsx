export default function MiniFormUI() {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="space-y-2">
        <div>
          <div
            className="text-[10px] mb-1 font-medium"
            style={{ color: 'var(--text-3)' }}
          >
            Naam
          </div>
          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-2)',
            }}
          >
            Jan de Vries
          </div>
        </div>
        <div>
          <div
            className="text-[10px] mb-1 font-medium"
            style={{ color: 'var(--text-3)' }}
          >
            Email
          </div>
          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-2)',
            }}
          >
            jan@devries.nl
          </div>
        </div>
        <div>
          <div
            className="text-[10px] mb-1 font-medium"
            style={{ color: 'var(--text-3)' }}
          >
            Bericht
          </div>
          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'var(--text-2)',
              minHeight: 48,
            }}
          >
            Ik ben geïnteresseerd in jullie AI-tool...
          </div>
        </div>
      </div>
      <div
        className="rounded-lg px-3 py-2 text-xs font-medium text-center text-white"
        style={{ background: 'var(--purple)' }}
      >
        Verzenden
      </div>
    </div>
  )
}
