import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

const EMAIL_BODY = `Hoi Lars,

Bedankt voor je aanvraag! Op basis van jouw bericht zien we veel potentie voor samenwerking.

Jouw lead score is 87/100 — dit betekent dat je aanvraag hoge prioriteit heeft.

Ik kom graag deze week nog met je in contact om te bespreken hoe Runvex jou kan helpen met het automatiseren van jullie lead opvolging.

Plan direct een kennismakingsgesprek via de link hieronder:

→ runvex.app/boek-een-call

Met vriendelijke groet,
Het Runvex team`

function TypedText({ text, frame, startF, speed = 1.5 }: { text: string; frame: number; startF: number; speed?: number }) {
  const elapsed = Math.max(0, frame - startF)
  const chars = Math.floor(elapsed * speed)
  return <span style={{ whiteSpace: 'pre-wrap' }}>{text.slice(0, chars)}</span>
}

export function EmailScene({ relativeFrame }: { relativeFrame: number }) {
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(relativeFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(relativeFrame, [270, 300], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const cardSlide = spring({ frame: relativeFrame, fps, config: { damping: 18, stiffness: 90 }, from: 40, to: 0 })

  // Sent state
  const sentVisible = relativeFrame > 230
  const sentOpacity = interpolate(relativeFrame, [230, 255], [0, 1], { extrapolateRight: 'clamp' })
  const sentScale = spring({ frame: Math.max(0, relativeFrame - 230), fps, config: { damping: 14, stiffness: 200 }, from: 0.7, to: 1 })

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sceneOpacity * fadeOut }}>
      <div style={{ width: 740, transform: `translateY(${cardSlide}px)` }}>
        {/* Email client */}
        <div style={{ background: '#12141E', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
          {/* Email header bar */}
          <div style={{ background: '#0C0E1B', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ marginLeft: 12, fontFamily: 'system-ui, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Follow-up e-mail — automatisch gegenereerd door Runvex</div>
          </div>

          {/* Email metadata */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Aan', value: 'lars@techflow.nl' },
              { label: 'Van', value: 'noreply@runvex.app' },
              { label: 'Onderwerp', value: 'Lars, jouw lead score is 87/100 — we nemen contact op' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', width: 72, flexShrink: 0, paddingTop: 2 }}>{row.label}</div>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: row.label === 'Onderwerp' ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: row.label === 'Onderwerp' ? 600 : 400 }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* Email body */}
          <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, minHeight: 260 }}>
            <TypedText text={EMAIL_BODY} frame={relativeFrame} startF={20} speed={2.5} />
          </div>

          {/* Send button */}
          <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#5B6EF5', borderRadius: 8, padding: '10px 24px', fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: 600, color: 'white', opacity: sentVisible ? 0.4 : 1, transition: 'opacity 0.3s' }}>
              Versturen
            </div>
            {/* Sent badge */}
            <div style={{ opacity: sentOpacity, transform: `scale(${sentScale})`, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(62,207,142,0.12)', border: '1px solid rgba(62,207,142,0.35)', borderRadius: 8, padding: '8px 16px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#3ECF8E' }}>Verzonden</span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div style={{ textAlign: 'center', marginTop: 16, fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', opacity: interpolate(relativeFrame, [235, 260], [0, 1], { extrapolateRight: 'clamp' }) }}>
          E-mail verstuurd via Resend · {new Date().toLocaleDateString('nl-NL')} · automatisch door Runvex
        </div>
      </div>
    </div>
  )
}
