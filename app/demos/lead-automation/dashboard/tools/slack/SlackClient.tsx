'use client'

import { useState, useEffect } from 'react'

export default function SlackClient() {
  const [webhookUrl, setWebhookUrl]     = useState('')
  const [minScore, setMinScore]         = useState(70)
  const [saved, setSaved]               = useState(false)
  const [testing, setTesting]           = useState(false)
  const [testResult, setTestResult]     = useState<'ok' | 'error' | null>(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch('/api/settings?key=slack_webhook_url')
        const d = await r.json()
        const wh = d.find((s: { key: string; value: string }) => s.key === 'slack_webhook_url')
        if (wh) setWebhookUrl(wh.value)

        const r2 = await fetch('/api/settings?key=slack_min_score')
        const d2 = await r2.json()
        const ms = d2.find((s: { key: string; value: string }) => s.key === 'slack_min_score')
        if (ms) setMinScore(parseInt(ms.value, 10))
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    await Promise.all([
      fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'slack_webhook_url', value: webhookUrl }) }),
      fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'slack_min_score', value: String(minScore) }) }),
    ])
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sendTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const r = await fetch('/api/slack-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          naam: 'Jan de Vries (test)',
          bedrijf: 'Testbedrijf BV',
          email: 'jan@testbedrijf.nl',
          ai_prioriteit: 85,
          ai_score: 'hoog',
          bericht: 'Dit is een testbericht van het Runvex dashboard. Als je dit ziet werkt de Slack integratie!',
        }),
      })
      setTestResult(r.ok ? 'ok' : 'error')
    } catch {
      setTestResult('error')
    }
    setTesting(false)
  }

  const card = { background: '#12141A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }
  const input = { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', padding: '10px 14px', width: '100%', fontSize: 13, outline: 'none' }
  const label = { fontSize: 11, color: '#5A5E82', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }

  if (loading) return <div style={{ color: '#5A5E82', fontSize: 13 }}>Laden…</div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
          Slack Alerts
        </h1>
        <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
          Ontvang direct een Slack-bericht bij elke hoge-prioriteit lead
        </p>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5" style={{
        background: webhookUrl ? 'rgba(62,207,142,0.08)' : 'rgba(236,178,46,0.08)',
        border: `1px solid ${webhookUrl ? 'rgba(62,207,142,0.2)' : 'rgba(236,178,46,0.2)'}`,
      }}>
        <span style={{ fontSize: 18 }}>{webhookUrl ? '✓' : '⚠'}</span>
        <div>
          <div className="text-sm font-semibold" style={{ color: webhookUrl ? '#3ECF8E' : '#ECB22E' }}>
            {webhookUrl ? 'Slack integratie actief' : 'Nog niet geconfigureerd'}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>
            {webhookUrl ? `Alerts voor leads met score ≥ ${minScore}` : 'Voer een webhook URL in om te starten'}
          </div>
        </div>
      </div>

      {/* Webhook config */}
      <div style={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Webhook configuratie</h2>
            <p className="text-xs" style={{ color: '#5A5E82' }}>
              Maak een Incoming Webhook aan in je Slack workspace
            </p>
          </div>
          <a
            href="https://api.slack.com/messaging/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.2)', textDecoration: 'none' }}
          >
            Slack docs ↗
          </a>
        </div>

        <div className="space-y-4">
          <div>
            <label style={label}>Webhook URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXX"
              style={input}
            />
            <p className="text-xs mt-1.5" style={{ color: '#5A5E82' }}>
              Slack → je workspace → Apps → Incoming Webhooks → Add New Webhook
            </p>
          </div>

          <div>
            <label style={label}>Minimale AI score voor alert</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#5B6EF5' }}
              />
              <div className="text-lg font-bold w-14 text-right" style={{
                color: minScore >= 80 ? '#ECB22E' : minScore >= 60 ? '#5B6EF5' : '#3ECF8E',
              }}>
                {minScore}
              </div>
            </div>
            <p className="text-xs mt-1" style={{ color: '#5A5E82' }}>
              Alleen leads met score ≥ {minScore} sturen een Slack alert
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={sendTest}
            disabled={!webhookUrl || testing}
            className="text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: testResult === 'ok' ? '#3ECF8E' : testResult === 'error' ? '#E8507A' : '#8A8FA8',
              border: '1px solid rgba(255,255,255,0.08)',
              opacity: !webhookUrl ? 0.4 : 1,
              cursor: !webhookUrl ? 'not-allowed' : 'pointer',
            }}
          >
            {testing ? '⏳ Sturen…' : testResult === 'ok' ? '✓ Testbericht verstuurd' : testResult === 'error' ? '✕ Fout — check URL' : '↗ Stuur testbericht'}
          </button>
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
            { step: '1', text: 'Een lead vult het contactformulier in', icon: '📝' },
            { step: '2', text: 'Claude AI scoort de lead (0–100) in n8n', icon: '🤖' },
            { step: '3', text: `n8n roept POST /api/slack-alert aan als score ≥ ${minScore}`, icon: '⚡' },
            { step: '4', text: 'Jij ontvangt een Slack-bericht met naam, bedrijf, score en bericht-preview', icon: '💬' },
          ].map(({ step, text, icon }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="text-base">{icon}</span>
              <span className="text-sm" style={{ color: '#8A8FA8' }}>{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: '#5A5E82' }}>n8n HTTP Request node — voeg toe na AI scoring stap:</p>
          <code className="text-xs" style={{ color: '#5B6EF5' }}>
            POST https://runvex.app/api/slack-alert<br />
            {'Body: { naam, bedrijf, email, ai_prioriteit, ai_score, bericht }'}
          </code>
        </div>
      </div>
    </div>
  )
}
