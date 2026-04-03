import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

const ANALYSIS_LINES = [
  { label: 'Sector', value: 'IT / SaaS', delay: 30 },
  { label: 'Prioriteit', value: 'Hoog', delay: 55, color: '#F5A623' },
  { label: 'Budget indicatie', value: '€5.000 – €15.000', delay: 80 },
  { label: 'Samenvatting', value: 'Groeiend IT-bedrijf met concrete behoefte aan lead automatisering. Hoge conversiekans.', delay: 105, wrap: true },
]

export function ScoringScene({ relativeFrame }: { relativeFrame: number }) {
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(relativeFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(relativeFrame, [330, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Score counter
  const targetScore = 87
  const scoreProgress = interpolate(relativeFrame, [20, 140], [0, targetScore], { extrapolateRight: 'clamp' })
  const score = Math.round(scoreProgress)

  // Score ring
  const ringProgress = interpolate(relativeFrame, [20, 140], [0, targetScore / 100], { extrapolateRight: 'clamp' })
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - ringProgress)

  // "Analyseren" pulse
  const pulseOpacity = interpolate(relativeFrame % 40, [0, 20, 40], [0.4, 1, 0.4])
  const analyzingVisible = relativeFrame < 30

  // Panel slide
  const panelSlide = spring({ frame: relativeFrame, fps, config: { damping: 18, stiffness: 90 }, from: 40, to: 0 })

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48, opacity: sceneOpacity * fadeOut }}>

      {/* Left: Score ring */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, transform: `translateY(${panelSlide}px)` }}>
        <div
          style={{
            width: 48,
            height: 24,
            borderRadius: 12,
            background: 'rgba(91,110,245,0.12)',
            border: '1px solid rgba(91,110,245,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            color: '#5B6EF5',
            letterSpacing: '0.05em',
          }}
        >
          AI
        </div>

        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle
              cx="70" cy="70" r="54"
              fill="none"
              stroke={score >= 80 ? '#5B6EF5' : score >= 60 ? '#F5A623' : '#EF4444'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 40, fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.03em' }}>{score}</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>/ 100</div>
          </div>
        </div>

        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.5, maxWidth: 180 }}>
          Lead score
          <br />
          <span style={{ color: score >= 80 ? '#5B6EF5' : '#F5A623', fontWeight: 600 }}>
            {score >= 80 ? 'Hoge prioriteit' : score >= 60 ? 'Gemiddeld' : 'Laag'}
          </span>
        </div>

        {/* Analysing indicator */}
        {analyzingVisible && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: pulseOpacity }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B6EF5' }} />
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Claude analyseert...</span>
          </div>
        )}
      </div>

      {/* Right: Analysis card */}
      <div style={{ width: 520, background: '#12141E', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: 32, display: 'flex', flexDirection: 'column', gap: 0, transform: `translateY(${panelSlide}px)`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(91,110,245,0.12)', border: '1px solid rgba(91,110,245,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B6EF5" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4l3 3"/></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 15, fontWeight: 700, color: 'white' }}>AI Analyse — Lars van den Berg</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Claude · zojuist</div>
          </div>
        </div>

        {/* Analysis fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ANALYSIS_LINES.map((line, i) => {
            const lineOpacity = interpolate(relativeFrame, [line.delay, line.delay + 20], [0, 1], { extrapolateRight: 'clamp' })
            const lineSlide = interpolate(relativeFrame, [line.delay, line.delay + 20], [10, 0], { extrapolateRight: 'clamp' })
            return (
              <div
                key={line.label}
                style={{
                  opacity: lineOpacity,
                  transform: `translateY(${lineSlide}px)`,
                  padding: '12px 0',
                  borderBottom: i < ANALYSIS_LINES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  display: 'flex',
                  alignItems: line.wrap ? 'flex-start' : 'center',
                  gap: 16,
                }}
              >
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500, width: 120, flexShrink: 0 }}>{line.label}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: line.color || 'rgba(255,255,255,0.8)', fontWeight: line.color ? 600 : 400, lineHeight: line.wrap ? 1.5 : 1 }}>{line.value}</div>
              </div>
            )
          })}
        </div>

        {/* Footer badge */}
        <div style={{ marginTop: 20, opacity: interpolate(relativeFrame, [140, 170], [0, 1], { extrapolateRight: 'clamp' }), background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.2)', borderRadius: 10, padding: '10px 16px', fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#5B6EF5', fontWeight: 500 }}>
          ✓ Follow-up e-mail wordt automatisch verstuurd...
        </div>
      </div>
    </div>
  )
}
