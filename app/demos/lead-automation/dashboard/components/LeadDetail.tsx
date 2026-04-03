'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lead } from '../page'
import ScoreBadge from './ScoreBadge'

export default function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const router = useRouter()
  const [followupLoading, setFollowupLoading] = useState(false)
  const [behandeldLoading, setBehandeldLoading] = useState(false)
  const [followupDone, setFollowupDone] = useState(lead.follow_up_verstuurd)
  const [behandeld, setBehandeld] = useState(lead.status === 'behandeld')
  const [error, setError] = useState<string | null>(null)

  async function sendFollowup() {
    setFollowupLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      })
      if (res.ok) {
        setFollowupDone(true)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Follow-up versturen mislukt')
      }
    } catch {
      setError('Verbindingsfout — probeer opnieuw')
    }
    setFollowupLoading(false)
  }

  async function markBehandeld() {
    setBehandeldLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/behandeld', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      })
      if (res.ok) {
        setBehandeld(true)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Opslaan mislukt')
      }
    } catch {
      setError('Verbindingsfout — probeer opnieuw')
    }
    setBehandeldLoading(false)
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />

      {/* Slide-over */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-lg z-50 overflow-y-auto"
        style={{ background: '#12141A', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-start justify-between sticky top-0"
          style={{ background: '#12141A', borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 1 }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              {lead.naam}{lead.bedrijf ? ` — ${lead.bedrijf}` : ''}
            </h2>
            <div className="flex gap-4 mt-1 text-sm" style={{ color: '#8A8FA8' }}>
              <span>{lead.email}</span>
              {lead.telefoon && <span>{lead.telefoon}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition-colors"
            style={{ color: '#5A5E82' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5A5E82')}
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Badges */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-sm" style={{ color: '#8A8FA8' }}>Score:</span>
              <ScoreBadge score={lead.ai_score} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm" style={{ color: '#8A8FA8' }}>Prioriteit:</span>
              <span className="text-sm font-semibold text-white">{lead.ai_prioriteit ?? '—'}/10</span>
            </div>
            {lead.ai_sector && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm" style={{ color: '#8A8FA8' }}>Sector:</span>
                <span className="text-sm font-semibold text-white">{lead.ai_sector}</span>
              </div>
            )}
          </div>

          {lead.ai_samenvatting && (
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#8A8FA8' }}>AI Samenvatting</h3>
              <p
                className="text-sm rounded-lg p-3"
                style={{ background: '#1A1C24', color: '#8A8FA8', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {lead.ai_samenvatting}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#8A8FA8' }}>Origineel bericht</h3>
            <p
              className="text-sm rounded-lg p-3 whitespace-pre-wrap"
              style={{ background: '#1A1C24', color: '#8A8FA8', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {lead.bericht}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {lead.bron && (
              <div>
                <span style={{ color: '#8A8FA8' }}>Bron: </span>
                <span className="font-medium text-white">{lead.bron}</span>
              </div>
            )}
            <div>
              <span style={{ color: '#8A8FA8' }}>Ontvangen: </span>
              <span className="font-medium text-white">
                {new Date(lead.aangemaakt_op).toLocaleString('nl-NL')}
              </span>
            </div>
            <div>
              <span style={{ color: '#8A8FA8' }}>Follow-up: </span>
              <span
                className="font-medium"
                style={{ color: followupDone ? '#3ECF8E' : '#5A5E82' }}
              >
                {followupDone ? 'Verstuurd' : 'Nog niet verstuurd'}
              </span>
            </div>
            <div>
              <span style={{ color: '#8A8FA8' }}>Status: </span>
              <span
                className="font-medium"
                style={{ color: behandeld ? '#3ECF8E' : '#5A5E82' }}
              >
                {behandeld ? 'Behandeld' : lead.status || 'Nieuw'}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: 'rgba(232,80,122,0.1)', border: '1px solid rgba(232,80,122,0.2)', color: '#E8507A' }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={sendFollowup}
              disabled={followupLoading || followupDone}
              className="flex-1 py-2.5 text-white text-sm font-medium rounded-lg transition-opacity"
              style={{
                background: followupDone ? 'rgba(91,110,245,0.3)' : '#5B6EF5',
                opacity: followupLoading ? 0.6 : 1,
                cursor: followupDone ? 'default' : 'pointer',
              }}
            >
              {followupLoading ? 'Verzenden…' : followupDone ? '✓ Follow-up verstuurd' : 'Stuur follow-up'}
            </button>
            <button
              onClick={markBehandeld}
              disabled={behandeldLoading || behandeld}
              className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-opacity"
              style={{
                background: behandeld ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${behandeld ? 'rgba(62,207,142,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: behandeld ? '#3ECF8E' : '#8A8FA8',
                opacity: behandeldLoading ? 0.6 : 1,
                cursor: behandeld ? 'default' : 'pointer',
              }}
            >
              {behandeldLoading ? 'Opslaan…' : behandeld ? '✓ Behandeld' : 'Markeer behandeld'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
