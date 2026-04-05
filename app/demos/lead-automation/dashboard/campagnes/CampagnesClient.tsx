'use client'

import { useState, useEffect } from 'react'

type Stap = {
  dag: number
  onderwerp: string
  body: string
}

type Campagne = {
  id: string
  naam: string
  stappen: Stap[]
  actief: boolean
  aangemaakt_op: string
}

const VARIABELEN = ['{naam}', '{bedrijf}', '{email}']

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
  'x-dashboard-secret': process.env.NEXT_PUBLIC_DASHBOARD_SECRET ?? '',
}

const DEFAULT_STAPPEN: Stap[] = [
  { dag: 0, onderwerp: 'Welkom bij Runvex, {naam}!', body: 'Hoi {naam},\n\nBedankt voor je bericht. We nemen zo snel mogelijk contact met je op.\n\nMet vriendelijke groet,\nHet Runvex team' },
  { dag: 3, onderwerp: 'Heb je nog vragen, {naam}?', body: 'Hoi {naam},\n\nWe wilden even checken of je al de informatie hebt die je nodig hebt.\n\nLaat het ons weten!\n\nMet vriendelijke groet,\nHet Runvex team' },
  { dag: 7, onderwerp: 'Laatste herinnering — Runvex voor {bedrijf}', body: 'Hoi {naam},\n\nDit is onze laatste herinnering. We helpen je graag om je leadproces te automatiseren.\n\nBoek een gratis demo via onze website!\n\nMet vriendelijke groet,\nHet Runvex team' },
]

export default function CampagnesClient() {
  const [campagnes, setCampagnes]     = useState<Campagne[]>([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState<Campagne | null>(null)
  const [isNew, setIsNew]             = useState(false)
  const [naam, setNaam]               = useState('')
  const [stappen, setStappen]         = useState<Stap[]>(DEFAULT_STAPPEN)
  const [saving, setSaving]           = useState(false)
  const [previewStap, setPreviewStap] = useState<number | null>(null)

  async function load() {
    try {
      const r = await fetch('/api/campagnes', { headers: AUTH_HEADERS })
      const d = await r.json()
      if (Array.isArray(d)) setCampagnes(d)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setNaam('Nieuwe campagne')
    setStappen(DEFAULT_STAPPEN)
    setSelected(null)
    setIsNew(true)
  }

  function openEdit(c: Campagne) {
    setNaam(c.naam)
    setStappen(c.stappen.length > 0 ? c.stappen : DEFAULT_STAPPEN)
    setSelected(c)
    setIsNew(false)
  }

  function closeEditor() {
    setSelected(null)
    setIsNew(false)
    setPreviewStap(null)
  }

  async function save() {
    setSaving(true)
    try {
      if (isNew) {
        await fetch('/api/campagnes', {
          method: 'POST',
          headers: AUTH_HEADERS,
          body: JSON.stringify({ naam, stappen }),
        })
      } else if (selected) {
        await fetch(`/api/campagnes/${selected.id}`, {
          method: 'PUT',
          headers: AUTH_HEADERS,
          body: JSON.stringify({ naam, stappen }),
        })
      }
      await load()
      closeEditor()
    } catch {}
    setSaving(false)
  }

  async function toggleActief(c: Campagne) {
    await fetch(`/api/campagnes/${c.id}`, {
      method: 'PUT',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ actief: !c.actief }),
    })
    await load()
  }

  async function verwijder(c: Campagne) {
    if (!confirm(`Weet je zeker dat je "${c.naam}" wilt verwijderen?`)) return
    await fetch(`/api/campagnes/${c.id}`, { method: 'DELETE', headers: AUTH_HEADERS })
    await load()
  }

  function addStap() {
    const maxDag = stappen.reduce((m, s) => Math.max(m, s.dag), 0)
    setStappen([...stappen, { dag: maxDag + 3, onderwerp: 'Onderwerp…', body: 'Hoi {naam},\n\n' }])
  }

  function removeStap(i: number) {
    setStappen(stappen.filter((_, idx) => idx !== i))
  }

  function updateStap(i: number, field: keyof Stap, value: string | number) {
    setStappen(stappen.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  function insertVar(stapIdx: number, field: 'onderwerp' | 'body', varName: string) {
    const s = stappen[stapIdx]
    updateStap(stapIdx, field, (s[field] as string) + varName)
  }

  const previewText = (text: string) =>
    text.replace('{naam}', 'Jan de Vries').replace('{bedrijf}', 'Testbedrijf BV').replace('{email}', 'jan@test.nl')

  const card = { background: '#12141A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }

  if (loading) return <div style={{ color: '#5A5E82', fontSize: 13 }}>Laden…</div>

  // --- Editor view ---
  if (isNew || selected) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={closeEditor} className="text-sm px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8A8FA8' }}>
            ← Terug
          </button>
          <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>
            {isNew ? 'Nieuwe campagne' : 'Campagne bewerken'}
          </h1>
        </div>

        {/* Campaign name */}
        <div style={{ ...card }}>
          <label className="block text-xs font-semibold mb-2" style={{ color: '#5A5E82', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Campagnenaam</label>
          <input
            value={naam}
            onChange={e => setNaam(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', padding: '10px 14px', width: '100%', fontSize: 14, outline: 'none' }}
          />
        </div>

        {/* Steps */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Stappen ({stappen.length})</h2>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#5A5E82' }}>
              <span>Variabelen:</span>
              {VARIABELEN.map(v => (
                <span key={v} className="px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.2)' }}>{v}</span>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            {stappen.length > 1 && (
              <div className="absolute left-[19px] top-8 bottom-8 w-px" style={{ background: 'rgba(91,110,245,0.2)' }} />
            )}

            <div className="space-y-3">
              {stappen.map((stap, i) => (
                <div key={i} className="relative">
                  {/* Step bubble */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'rgba(91,110,245,0.15)', border: '2px solid rgba(91,110,245,0.3)', color: '#5B6EF5', zIndex: 1, position: 'relative' }}
                      >
                        {i + 1}
                      </div>
                    </div>

                    <div className="flex-1 rounded-xl p-4" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: '#5A5E82' }}>Dag</span>
                          <input
                            type="number"
                            min={0}
                            value={stap.dag}
                            onChange={e => updateStap(i, 'dag', parseInt(e.target.value) || 0)}
                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'white', padding: '4px 8px', width: 60, fontSize: 13, outline: 'none', textAlign: 'center' }}
                          />
                        </div>
                        <div className="flex gap-1.5 ml-auto">
                          <button
                            onClick={() => setPreviewStap(previewStap === i ? null : i)}
                            className="text-xs px-2.5 py-1 rounded-lg"
                            style={{ background: previewStap === i ? 'rgba(91,110,245,0.15)' : 'rgba(255,255,255,0.04)', color: previewStap === i ? '#5B6EF5' : '#5A5E82', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            {previewStap === i ? '✕ Preview' : '👁 Preview'}
                          </button>
                          {stappen.length > 1 && (
                            <button onClick={() => removeStap(i)} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(232,80,122,0.08)', color: '#E8507A', border: '1px solid rgba(232,80,122,0.15)' }}>
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {previewStap === i ? (
                        <div className="rounded-lg p-3 text-xs space-y-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div><span style={{ color: '#5A5E82' }}>Van: </span><span className="text-white">noreply@runvex.app</span></div>
                          <div><span style={{ color: '#5A5E82' }}>Aan: </span><span className="text-white">jan@testbedrijf.nl</span></div>
                          <div><span style={{ color: '#5A5E82' }}>Onderwerp: </span><span className="text-white">{previewText(stap.onderwerp)}</span></div>
                          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <pre className="whitespace-pre-wrap text-xs" style={{ color: '#8A8FA8', fontFamily: 'inherit' }}>{previewText(stap.body)}</pre>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs" style={{ color: '#5A5E82' }}>Onderwerp</label>
                              <div className="flex gap-1">
                                {VARIABELEN.map(v => (
                                  <button key={v} onClick={() => insertVar(i, 'onderwerp', v)} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(91,110,245,0.08)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.15)' }}>{v}</button>
                                ))}
                              </div>
                            </div>
                            <input
                              value={stap.onderwerp}
                              onChange={e => updateStap(i, 'onderwerp', e.target.value)}
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'white', padding: '8px 12px', width: '100%', fontSize: 13, outline: 'none' }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs" style={{ color: '#5A5E82' }}>E-mailtekst</label>
                              <div className="flex gap-1">
                                {VARIABELEN.map(v => (
                                  <button key={v} onClick={() => insertVar(i, 'body', v)} className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(91,110,245,0.08)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.15)' }}>{v}</button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              value={stap.body}
                              onChange={e => updateStap(i, 'body', e.target.value)}
                              rows={5}
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'white', padding: '8px 12px', width: '100%', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={addStap}
            className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: 'rgba(91,110,245,0.06)', border: '1.5px dashed rgba(91,110,245,0.25)', color: '#5B6EF5' }}
          >
            + Stap toevoegen
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={closeEditor} className="px-4 py-2 text-sm rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#8A8FA8' }}>
            Annuleer
          </button>
          <button
            onClick={save}
            disabled={saving || !naam.trim()}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg"
            style={{ background: '#5B6EF5', opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Opslaan…' : 'Campagne opslaan'}
          </button>
        </div>
      </div>
    )
  }

  // --- List view ---
  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
            E-mail Campagnes
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
            Stel automatische drip-sequenties in voor nieuwe leads
          </p>
        </div>
        <button
          onClick={openNew}
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white shrink-0"
          style={{ background: '#5B6EF5' }}
        >
          + Nieuwe campagne
        </button>
      </div>

      {campagnes.length === 0 ? (
        <div style={card}>
          <div className="text-center py-10">
            <div className="text-3xl mb-3">📧</div>
            <div className="text-sm font-semibold text-white mb-1">Nog geen campagnes</div>
            <div className="text-xs mb-4" style={{ color: '#5A5E82' }}>Maak je eerste e-mail sequentie aan</div>
            <button
              onClick={openNew}
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
              style={{ background: '#5B6EF5' }}
            >
              + Nieuwe campagne
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {campagnes.map(c => (
            <div key={c.id} className="rounded-xl p-4" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{c.naam}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: c.actief ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.05)',
                        color: c.actief ? '#3ECF8E' : '#5A5E82',
                        border: `1px solid ${c.actief ? 'rgba(62,207,142,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {c.actief ? 'Actief' : 'Inactief'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#5A5E82' }}>
                    <span>{c.stappen.length} stappen</span>
                    <span>·</span>
                    <span>
                      Dag {c.stappen.map(s => s.dag).join(' → ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActief(c)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{
                      background: c.actief ? 'rgba(232,80,122,0.08)' : 'rgba(62,207,142,0.08)',
                      color: c.actief ? '#E8507A' : '#3ECF8E',
                      border: `1px solid ${c.actief ? 'rgba(232,80,122,0.15)' : 'rgba(62,207,142,0.15)'}`,
                    }}
                  >
                    {c.actief ? 'Deactiveer' : 'Activeer'}
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'rgba(91,110,245,0.08)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.15)' }}
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => verwijder(c)}
                    className="text-xs px-2 py-1.5 rounded-lg"
                    style={{ background: 'rgba(232,80,122,0.06)', color: '#E8507A', border: '1px solid rgba(232,80,122,0.1)' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* n8n integration note */}
      <div className="mt-5 rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#5A5E82' }}>n8n koppeling — voeg toe aan je lead-flow:</p>
        <code className="text-xs" style={{ color: '#5B6EF5' }}>
          GET https://runvex.app/api/campagnes → lees actieve campagne → verwerk stappen via Schedule + Resend
        </code>
      </div>
    </div>
  )
}
