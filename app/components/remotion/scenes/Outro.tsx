import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

const STATS = [
  { value: '< 60 sec', label: 'Reactietijd' },
  { value: '87 / 100', label: 'AI Score' },
  { value: '100%', label: 'Automatisch' },
]

export function Outro({ relativeFrame }: { relativeFrame: number }) {
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(relativeFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })

  const logoScale = spring({ frame: relativeFrame, fps, config: { damping: 14, stiffness: 100 }, from: 0.8, to: 1 })

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, opacity: sceneOpacity }}>
      {/* Glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,110,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24 }}>
        {STATS.map((s, i) => {
          const delay = i * 30
          const opacity = interpolate(relativeFrame, [delay, delay + 30], [0, 1], { extrapolateRight: 'clamp' })
          const slide = interpolate(relativeFrame, [delay, delay + 30], [20, 0], { extrapolateRight: 'clamp' })
          return (
            <div key={s.label} style={{ opacity, transform: `translateY(${slide}px)`, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 36px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Logo + tagline */}
      <div style={{ opacity: interpolate(relativeFrame, [60, 90], [0, 1], { extrapolateRight: 'clamp' }), transform: `scale(${logoScale})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#5B6EF5,#3B4FD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(91,110,245,0.4)' }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><path d="M4 3h4.5a3.5 3.5 0 0 1 0 7H7l4 3M4 3v10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>runvex</span>
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 18, color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.01em' }}>
          Start gratis op runvex.app
        </div>
      </div>
    </div>
  )
}
