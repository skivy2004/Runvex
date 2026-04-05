'use client'

import { useState, useEffect } from 'react'

export default function CalendlyClient() {
  const [calendlyUrl, setCalendlyUrl] = useState('')
  const [saved, setSaved]             = useState(false)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/calendly-settings')
        const d = await r.json()
        const entry = Array.isArray(d) ? d.find((s: { key: string; value: string }) => s.key === 'calendly_url') : null
        if (entry) setCalendlyUrl(entry.value)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    await fetch('/api/calendly-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: calendlyUrl }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const card = { background: '#12141A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }
  const input = { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', padding: '10px 14px', width: '100%', fontSize: 13, outline: 'none' }
  const label = { fontSize: 11, color: '#5A5E82', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }

  if (loading) return <div style={{ color: '#5A5E82', fontSize: 13 }}>Laden…</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
          Calendly Integratie
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
          Stuur automatisch een meeting-uitnodiging naar leads vanuit de lead-kaart
        </p>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5" style={{
        background: calendlyUrl ? 'rgba(62,207,142,0.08)' : 'rgba(236,178,46,0.08)',
        border: `1px solid ${calendlyUrl ? 'rgba(62,207,142,0.2)' : 'rgba(236,178,46,0.2)'}`,
      }}>
        <span style={{ fontSize: 18 }}>{calendlyUrl ? '✓' : '⚠'}</span>
        <div>
          <div className="text-sm font-semibold" style={{ color: calendlyUrl ? '#3ECF8E' : '#ECB22E' }}>
            {calendlyUrl ? 'Calendly integratie actief' : 'Nog niet geconfigureerd'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>
            {calendlyUrl ? 'Je kunt nu meeting-uitnodigingen sturen vanuit elke lead-kaart' : 'Voer je Calendly link in om te starten'}
          </div>
        </div>
      </div>

      {/* Config */}
      <div style={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Calendly link instellen</h2>
            <p className="text-xs" style={{ color: '#5A5E82' }}>
              Kopieer je persoonlijke Calendly link en plak hem hier
            </p>
          </div>
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.2)', textDecoration: 'none' }}
          >
            Calendly ↗
          </a>
        </div>

        <div className="mb-5">
          <label style={label}>Calendly URL</label>
          <input
            type="url"
            value={calendlyUrl}
            onChange={e => setCalendlyUrl(e.target.value)}
            placeholder="https://calendly.com/jouw-naam/kennismaking"
            style={input}
          />
          <p className="text-xs mt-1.5" style={{ color: '#5A5E82' }}>
            Calendly → Home → Kopieer link van jouw event
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={save}
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-colors"
            style={{ background: saved ? 'rgba(62,207,142,0.2)' : '#5B6EF5', color: saved ? '#3ECF8E' : 'white' }}
          >
            {saved ? '✓ Opgeslagen' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div style={card}>
        <h2 className="text-sm font-semibold text-white mb-3">Hoe werkt het?</h2>
        <div className="space-y-3">
          {[
            { icon: '⚙️', text: 'Sla hier je Calendly link op' },
            { icon: '👆', text: 'Open een lead-kaart in het dashboard' },
            { icon: '📅', text: 'Klik op "Stuur meeting uitnodiging"' },
            { icon: '📧', text: 'Lead ontvangt automatisch een e-mail met jouw Calendly link' },
            { icon: '✓', text: 'Lead wordt gemarkeerd als "uitgenodigd" in het systeem' },
          ].map(({ icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-base">{icon}</span>
              <span className="text-sm" style={{ color: '#8A8FA8' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
