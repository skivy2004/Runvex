import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion'

export function LeadScene({ relativeFrame }: { relativeFrame: number }) {
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(relativeFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(relativeFrame, [150, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Toast notification
  const toastX = spring({ frame: relativeFrame, fps, config: { damping: 18, stiffness: 160 }, from: 60, to: 0 })
  const toastOpacity = interpolate(relativeFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const toastFade = interpolate(relativeFrame, [110, 140], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Lead row slide in
  const rowSlide = spring({ frame: Math.max(0, relativeFrame - 20), fps, config: { damping: 20, stiffness: 100 }, from: -30, to: 0 })
  const rowOpacity = interpolate(relativeFrame, [20, 45], [0, 1], { extrapolateRight: 'clamp' })

  // Ping animation on new badge
  const pingScale = interpolate(relativeFrame % 60, [0, 30, 60], [1, 1.4, 1])
  const pingOpacity = interpolate(relativeFrame % 60, [0, 15, 30], [0.8, 0, 0])

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: sceneOpacity * fadeOut }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#0C0E1B', borderRight: '1px solid rgba(255,255,255,0.06)', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#5B6EF5,#3B4FD5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 3h4.5a3.5 3.5 0 0 1 0 7H7l4 3M4 3v10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: 16, color: 'white' }}>runvex</span>
        </div>
        {[
          { label: 'Overzicht', active: false },
          { label: 'Leads', active: true, badge: '1 nieuw' },
          { label: 'AI Insights', active: false },
          { label: 'Instellingen', active: false },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: item.active ? 'rgba(91,110,245,0.15)' : 'transparent', color: item.active ? '#5B6EF5' : 'rgba(255,255,255,0.4)', fontFamily: 'system-ui, sans-serif', fontSize: 14, fontWeight: item.active ? 600 : 400 }}>
            {item.label}
            {item.badge && (
              <span style={{ background: '#5B6EF5', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>{item.badge}</span>
            )}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Leads</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.3)', borderRadius: 8, padding: '6px 14px', fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#3ECF8E', fontWeight: 600 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3ECF8E' }} />
            Live
          </div>
        </div>

        {/* Lead table header */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['Naam', 'Bedrijf', 'Score', 'Status'].map(h => (
              <div key={h} style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {/* Existing leads */}
          {[
            { name: 'Sanne Dijkstra', company: 'MarketPro', score: 72, status: 'Behandeld', color: '#8A8FA8' },
            { name: 'Daan Vermeer', company: 'Groei.io', score: 65, status: 'Behandeld', color: '#8A8FA8' },
          ].map(lead => (
            <div key={lead.name} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{lead.name}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{lead.company}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: lead.score >= 70 ? '#3ECF8E' : '#F5A623', fontWeight: 600 }}>{lead.score}</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{lead.status}</div>
            </div>
          ))}

          {/* New lead row */}
          <div style={{ transform: `translateY(${rowSlide}px)`, opacity: rowOpacity, display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', padding: '14px 20px', background: 'rgba(91,110,245,0.08)', borderTop: '1px solid rgba(91,110,245,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5B6EF5' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#5B6EF5', transform: `scale(${pingScale})`, opacity: pingOpacity }} />
              </div>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'white', fontWeight: 600 }}>Lars van den Berg</span>
            </div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>TechFlow B.V.</div>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>—</div>
            <div style={{ background: 'rgba(91,110,245,0.2)', border: '1px solid rgba(91,110,245,0.4)', borderRadius: 6, padding: '3px 10px', fontFamily: 'system-ui, sans-serif', fontSize: 11, color: '#5B6EF5', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>Nieuw</div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div style={{ position: 'absolute', top: 24, right: 24, transform: `translateX(${toastX}px)`, opacity: toastOpacity * toastFade, background: '#12141E', border: '1px solid rgba(91,110,245,0.35)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(91,110,245,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B6EF5" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
        <div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>Nieuwe lead ontvangen</div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Lars van den Berg · TechFlow B.V.</div>
        </div>
      </div>
    </div>
  )
}
