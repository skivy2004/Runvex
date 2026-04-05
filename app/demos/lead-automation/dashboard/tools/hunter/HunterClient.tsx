'use client'

import { useState, useEffect } from 'react'

export default function HunterClient() {
  const [apiKey, setApiKey]   = useState('')
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/hunter-settings')
        const d = await r.json()
        const entry = Array.isArray(d) ? d.find((s: { key: string; value: string }) => s.key === 'hunter_api_key') : null
        if (entry) setApiKey(entry.value)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    await fetch('/api/hunter-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: apiKey }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const card = { background: '#12141A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }
  const input = { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', padding: '10px 14px', width: '100%', fontSize: 13, outline: 'none', fontFamily: 'monospace' }
  const label = { fontSize: 11, color: '#5A5E82', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }

  if (loading) return <div style={{ color: '#5A5E82', fontSize: 13 }}>Laden…</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
          Hunter.io Verrijking
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
          Verrijk leads automatisch met bedrijfsdata op basis van e-maildomein
        </p>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5" style={{
        background: apiKey ? 'rgba(62,207,142,0.08)' : 'rgba(236,178,46,0.08)',
        border: `1px solid ${apiKey ? 'rgba(62,207,142,0.2)' : 'rgba(236,178,46,0.2)'}`,
      }}>
        <span style={{ fontSize: 18 }}>{apiKey ? '✓' : '⚠'}</span>
        <div>
          <div className="text-sm font-semibold" style={{ color: apiKey ? '#3ECF8E' : '#ECB22E' }}>
            {apiKey ? 'Hunter.io integratie actief' : 'Nog niet geconfigureerd'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>
            {apiKey ? 'Klik op "Verrijk lead" in een lead-kaart om bedrijfsdata op te halen' : 'Voer je Hunter.io API key in om te starten'}
          </div>
        </div>
      </div>

      {/* API key config */}
      <div style={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">API key instellen</h2>
            <p className="text-xs" style={{ color: '#5A5E82' }}>
              Gratis account geeft 25 verzoeken per maand
            </p>
          </div>
          <a
            href="https://hunter.io/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.2)', textDecoration: 'none' }}
          >
            Hunter.io ↗
          </a>
        </div>

        <div className="mb-5">
          <label style={label}>Hunter.io API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            style={input}
          />
          <p className="text-xs mt-1.5" style={{ color: '#5A5E82' }}>
            Hunter.io → Dashboard → API → Kopieer jouw API key
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

      {/* What it returns */}
      <div style={card}>
        <h2 className="text-sm font-semibold text-white mb-3">Welke data wordt opgehaald?</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Bedrijfsnaam', icon: '🏢' },
            { label: 'Sector / industrie', icon: '📊' },
            { label: 'Bedrijfsgrootte', icon: '👥' },
            { label: 'Land', icon: '🌍' },
            { label: 'LinkedIn URL', icon: '🔗' },
            { label: 'Twitter / X', icon: '🐦' },
          ].map(({ label: l, icon }) => (
            <div key={l} className="flex items-center gap-2 text-sm" style={{ color: '#8A8FA8' }}>
              <span>{icon}</span>
              <span>{l}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: '#5A5E82' }}>
          Data wordt opgehaald via de Hunter.io domain-search API op basis van het e-maildomein van de lead.
        </p>
      </div>
    </div>
  )
}
