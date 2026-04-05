'use client'

import { useState, useEffect } from 'react'

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
}

export default function CrmClient() {
  const [crmType, setCrmType]     = useState('hubspot')
  const [apiKey, setApiKey]       = useState('')
  const [minScore, setMinScore]   = useState(0)
  const [saved, setSaved]         = useState(false)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/crm-settings', { headers: AUTH_HEADERS })
        const d = await r.json()
        if (!Array.isArray(d)) return
        const get = (key: string) => d.find((s: { key: string; value: string }) => s.key === key)?.value ?? ''
        const t = get('crm_type')
        if (t) setCrmType(t)
        setApiKey(get('crm_api_key'))
        const ms = get('crm_min_score')
        if (ms) setMinScore(parseInt(ms, 10))
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    await fetch('/api/crm-settings', {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ crm_type: crmType, crm_api_key: apiKey, crm_min_score: minScore }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const card = { background: '#12141A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }
  const input = { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', padding: '10px 14px', width: '100%', fontSize: 13, outline: 'none' }
  const label = { fontSize: 11, color: '#5A5E82', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }

  if (loading) return <div style={{ color: '#5A5E82', fontSize: 13 }}>Laden…</div>

  const isConfigured = apiKey.length > 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
          CRM Integratie
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
          Synchroniseer leads automatisch naar HubSpot of Pipedrive
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5" style={{
        background: isConfigured ? 'rgba(62,207,142,0.08)' : 'rgba(236,178,46,0.08)',
        border: `1px solid ${isConfigured ? 'rgba(62,207,142,0.2)' : 'rgba(236,178,46,0.2)'}`,
      }}>
        <span style={{ fontSize: 18 }}>{isConfigured ? '✓' : '⚠'}</span>
        <div>
          <div className="text-sm font-semibold" style={{ color: isConfigured ? '#3ECF8E' : '#ECB22E' }}>
            {isConfigured ? `${crmType === 'hubspot' ? 'HubSpot' : 'Pipedrive'} integratie actief` : 'Nog niet geconfigureerd'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>
            {isConfigured ? 'Klik op "Sync naar CRM" in een lead-kaart om te synchroniseren' : 'Kies een CRM en voer je API key in'}
          </div>
        </div>
      </div>

      {/* Config */}
      <div style={card}>
        <h2 className="text-sm font-semibold text-white mb-4">CRM configuratie</h2>

        <div className="space-y-4">
          {/* CRM selector */}
          <div>
            <label style={label}>CRM systeem</label>
            <div className="flex gap-3">
              {[
                { value: 'hubspot', label: 'HubSpot', desc: 'Gratis CRM, breed gebruikt' },
                { value: 'pipedrive', label: 'Pipedrive', desc: 'Sales-focused CRM' },
              ].map(({ value, label: l, desc }) => (
                <button
                  key={value}
                  onClick={() => setCrmType(value)}
                  className="flex-1 px-4 py-3 rounded-lg text-left transition-colors"
                  style={{
                    background: crmType === value ? 'rgba(91,110,245,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${crmType === value ? 'rgba(91,110,245,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: crmType === value ? '#fff' : '#5A5E82',
                  }}
                >
                  <div className="text-sm font-semibold mb-0.5">{l}</div>
                  <div className="text-xs" style={{ color: '#5A5E82' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* API key */}
          <div>
            <label style={label}>{crmType === 'hubspot' ? 'HubSpot Private App Token' : 'Pipedrive API Token'}</label>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={crmType === 'hubspot' ? 'pat-eu1-xxxxxxxx-...' : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}
              style={{ ...input, fontFamily: 'monospace' }}
            />
            <p className="text-xs mt-1.5" style={{ color: '#5A5E82' }}>
              {crmType === 'hubspot'
                ? 'HubSpot → Settings → Integrations → Private Apps → Create a private app'
                : 'Pipedrive → Settings → Personal Preferences → API → Kopieer token'}
            </p>
          </div>

          {/* Min score */}
          <div>
            <label style={label}>Minimale AI score voor auto-sync</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#5B6EF5' }}
              />
              <div className="text-lg font-bold w-14 text-right" style={{ color: '#5B6EF5' }}>
                {minScore === 0 ? 'Alles' : minScore}
              </div>
            </div>
            <p className="text-xs mt-1" style={{ color: '#5A5E82' }}>
              {minScore === 0 ? 'Alle leads worden gesynchroniseerd via n8n' : `Alleen leads met score ≥ ${minScore} worden gesynchroniseerd`}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={save}
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white"
            style={{ background: saved ? 'rgba(62,207,142,0.2)' : '#5B6EF5', color: saved ? '#3ECF8E' : 'white' }}
          >
            {saved ? '✓ Opgeslagen' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* How it works */}
      <div style={card}>
        <h2 className="text-sm font-semibold text-white mb-3">Hoe werkt het?</h2>
        <div className="space-y-2.5">
          {[
            { icon: '⚙️', text: 'Sla hier je CRM-type en API key op' },
            { icon: '📋', text: 'Open een lead-kaart in het dashboard' },
            { icon: '🔄', text: 'Klik op "Sync naar CRM" — lead wordt aangemaakt als contact' },
            { icon: '✓', text: 'Lead is gemarkeerd als gesynchroniseerd in Runvex' },
          ].map(({ icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-base">{icon}</span>
              <span className="text-sm" style={{ color: '#8A8FA8' }}>{text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#5A5E82' }}>n8n auto-sync — voeg toe na AI scoring:</p>
          <code className="text-xs" style={{ color: '#5B6EF5' }}>
            POST https://runvex.app/api/leads/sync-crm · {'Body: { leadId }'}
          </code>
        </div>
      </div>
    </div>
  )
}
