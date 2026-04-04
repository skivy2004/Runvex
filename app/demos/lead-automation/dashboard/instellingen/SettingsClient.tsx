'use client'

import { useState } from 'react'

const DEFAULT_CRITERIA = `Geef een hoge score (80-100) als:
- De lead een concreet probleem beschrijft
- Er een duidelijke tijdlijn of urgentie is
- Er een budget-indicatie is
- Het bedrijf past bij onze doelgroep (MKB, 1-50 medewerkers)

Geef een gemiddelde score (50-79) als:
- De vraag informatief is maar nog niet urgent
- Er interesse is maar geen concrete behoefte

Geef een lage score (0-49) als:
- Het een algemene vraag is zonder specifieke behoefte
- De lead waarschijnlijk niet converteert`

const DEFAULT_SEQUENCES = [
  { dag: 0, onderwerp: 'Bedankt voor je aanvraag — {{naam}}', bericht: 'Hoi {{naam}}, bedankt voor je bericht! We nemen binnen 24 uur contact op.', actief: true },
  { dag: 3, onderwerp: 'Nog even over je aanvraag', bericht: 'Hoi {{naam}}, we hebben nog niet van je gehoord. Heb je nog vragen?', actief: true },
  { dag: 7, onderwerp: 'Laatste bericht van Runvex', bericht: 'Hoi {{naam}}, dit is onze laatste herinnering. Laat ons weten als we je kunnen helpen.', actief: false },
]

export default function SettingsClient() {
  const [criteria, setCriteria] = useState(DEFAULT_CRITERIA)
  const [sequences, setSequences] = useState(DEFAULT_SEQUENCES)
  const [savedCriteria, setSavedCriteria] = useState(false)
  const [savedSeq, setSavedSeq] = useState(false)

  const saveCriteria = async () => {
    try {
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'scoring_criteria', value: criteria }) })
    } catch {}
    setSavedCriteria(true)
    setTimeout(() => setSavedCriteria(false), 2000)
  }

  const saveSequences = async () => {
    try {
      await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'email_sequences', value: JSON.stringify(sequences) }) })
    } catch {}
    setSavedSeq(true)
    setTimeout(() => setSavedSeq(false), 2000)
  }

  const card = { background: '#12141A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20, marginBottom: 16 }
  const input = { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'white', padding: '8px 12px', width: '100%', fontSize: 13 }
  const label = { fontSize: 11, color: '#5A5E82', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>Instellingen</h1>
        <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>Pas AI scoring en e-mail sequences aan</p>
      </div>

      {/* AI Scoring criteria */}
      <div style={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">AI Scoring criteria</h2>
            <p className="text-xs" style={{ color: '#5A5E82' }}>Claude gebruikt deze regels bij het scoren van elke lead</p>
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5' }}>Claude AI</div>
        </div>
        <textarea
          rows={10}
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          style={{ ...input, resize: 'vertical', lineHeight: 1.6, fontFamily: 'monospace' }}
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs" style={{ color: '#5A5E82' }}>Gebruik {'{{naam}}'}, {'{{bedrijf}}'} als variabelen</p>
          <button onClick={saveCriteria} className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
            style={{ background: savedCriteria ? 'rgba(62,207,142,0.2)' : 'var(--purple)', color: savedCriteria ? '#3ECF8E' : 'white' }}>
            {savedCriteria ? '✓ Opgeslagen' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Email sequences */}
      <div style={card}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">E-mail follow-up sequence</h2>
            <p className="text-xs" style={{ color: '#5A5E82' }}>Automatische e-mails na binnenkomst van een lead</p>
          </div>
        </div>

        <div className="space-y-4">
          {sequences.map((seq, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,110,245,0.12)', color: '#5B6EF5' }}>
                    Dag {seq.dag}
                  </span>
                  <span className="text-xs font-medium text-white">{seq.dag === 0 ? 'Direct' : `Na ${seq.dag} dagen`}</span>
                </div>
                <button
                  onClick={() => setSequences(prev => prev.map((s, idx) => idx === i ? { ...s, actief: !s.actief } : s))}
                  className="text-xs px-2.5 py-1 rounded-lg font-medium"
                  style={{ background: seq.actief ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.05)', color: seq.actief ? '#3ECF8E' : '#5A5E82', border: `1px solid ${seq.actief ? 'rgba(62,207,142,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                  {seq.actief ? 'Actief' : 'Inactief'}
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <label style={label}>Onderwerp</label>
                  <input type="text" value={seq.onderwerp} onChange={(e) => setSequences(prev => prev.map((s, idx) => idx === i ? { ...s, onderwerp: e.target.value } : s))} style={input} />
                </div>
                <div>
                  <label style={label}>Bericht</label>
                  <textarea rows={2} value={seq.bericht} onChange={(e) => setSequences(prev => prev.map((s, idx) => idx === i ? { ...s, bericht: e.target.value } : s))} style={{ ...input, resize: 'none' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={saveSequences} className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: savedSeq ? 'rgba(62,207,142,0.2)' : 'var(--purple)', color: savedSeq ? '#3ECF8E' : 'white' }}>
            {savedSeq ? '✓ Opgeslagen' : 'Sequences opslaan'}
          </button>
        </div>
      </div>
    </div>
  )
}
