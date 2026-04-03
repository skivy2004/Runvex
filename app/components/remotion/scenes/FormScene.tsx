import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

const FIELDS = [
  { label: 'Naam', value: 'Lars van den Berg', startF: 0 },
  { label: 'E-mail', value: 'lars@techflow.nl', startF: 50 },
  { label: 'Bedrijf', value: 'TechFlow B.V.', startF: 100 },
  { label: 'Bericht', value: 'Wij zoeken een oplossing voor snellere lead opvolging. Ons team groeit snel en we lopen te veel kansen mis.', startF: 150, multiline: true },
]

function TypedText({ text, frame, startF, speed = 3 }: { text: string; frame: number; startF: number; speed?: number }) {
  const elapsed = Math.max(0, frame - startF)
  const chars = Math.floor(elapsed / speed)
  return <span>{text.slice(0, chars)}<span style={{ opacity: chars < text.length ? 1 : 0, borderRight: '2px solid #5B6EF5' }}>&nbsp;</span></span>
}

export function FormScene({ relativeFrame }: { relativeFrame: number }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(relativeFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(relativeFrame, [240, 280], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const browserSlide = spring({ frame: relativeFrame, fps, config: { damping: 18, stiffness: 100 }, from: 60, to: 0 })

  // Button state
  const lastFieldDone = relativeFrame > 230
  const btnPulse = lastFieldDone ? interpolate((relativeFrame - 230) % 40, [0, 20, 40], [1, 1.03, 1]) : 1

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sceneOpacity * fadeOut }}>
      {/* Browser chrome */}
      <div style={{ transform: `translateY(${browserSlide}px)`, width: 820, background: '#12141E', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>
        {/* Browser bar */}
        <div style={{ height: 44, background: '#0C0E1B', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, marginLeft: 12, height: 26, background: 'rgba(255,255,255,0.05)', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>runvex.app/contact</span>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: 40 }}>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>Contact opnemen</div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Vul het formulier in en we nemen binnen 24 uur contact op.</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {FIELDS.slice(0, 2).map((f, i) => (
              <div key={f.label}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>{f.label}</div>
                <div style={{ background: '#0A0B14', border: `1px solid ${relativeFrame > f.startF ? 'rgba(91,110,245,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '10px 14px', fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.85)', minHeight: 40, transition: 'border-color 0.2s' }}>
                  <TypedText text={f.value} frame={relativeFrame} startF={f.startF} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>Bedrijf</div>
            <div style={{ background: '#0A0B14', border: `1px solid ${relativeFrame > FIELDS[2].startF ? 'rgba(91,110,245,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '10px 14px', fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.85)', minHeight: 40 }}>
              <TypedText text={FIELDS[2].value} frame={relativeFrame} startF={FIELDS[2].startF} />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 500 }}>Bericht</div>
            <div style={{ background: '#0A0B14', border: `1px solid ${relativeFrame > FIELDS[3].startF ? 'rgba(91,110,245,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '10px 14px', fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.85)', minHeight: 80, lineHeight: 1.5 }}>
              <TypedText text={FIELDS[3].value} frame={relativeFrame} startF={FIELDS[3].startF} speed={2} />
            </div>
          </div>

          <div
            style={{
              background: lastFieldDone ? '#5B6EF5' : 'rgba(91,110,245,0.3)',
              borderRadius: 10,
              padding: '14px 0',
              textAlign: 'center',
              fontFamily: 'system-ui, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              color: 'white',
              transform: `scale(${btnPulse})`,
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            {lastFieldDone ? '✓ Versturen' : 'Versturen →'}
          </div>
        </div>
      </div>
    </div>
  )
}
