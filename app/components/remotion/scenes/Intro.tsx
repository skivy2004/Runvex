import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export function Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 }, from: 0.5, to: 1 })
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const textOpacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' })
  const subOpacity = interpolate(frame, [55, 85], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(frame, [90, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        opacity: fadeOut,
      }}
    >
      {/* Logo */}
      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #5B6EF5, #3B4FD5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(91,110,245,0.5)',
          }}
        >
          <svg width="44" height="44" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 3h4.5a3.5 3.5 0 0 1 0 7H7l4 3M4 3v10"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div style={{ opacity: textOpacity, textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          runvex
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: subOpacity,
          fontFamily: 'system-ui, sans-serif',
          fontSize: 24,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '-0.01em',
        }}
      >
        Van lead tot follow-up in &lt; 60 seconden
      </div>
    </div>
  )
}
