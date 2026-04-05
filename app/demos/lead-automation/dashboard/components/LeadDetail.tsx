'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lead } from '../page'
import ScoreBadge from './ScoreBadge'

const DASHBOARD_HEADERS = {
  'Content-Type': 'application/json',
  'x-dashboard-secret': process.env.NEXT_PUBLIC_DASHBOARD_SECRET ?? '',
}

export default function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const router = useRouter()
  const [followupLoading, setFollowupLoading] = useState(false)
  const [behandeldLoading, setBehandeldLoading] = useState(false)
  const [enrichLoading, setEnrichLoading]     = useState(false)
  const [verrijking, setVerrijking]           = useState(lead.verrijking)
  const [crmLoading, setCrmLoading]           = useState(false)
  const [crmSynced, setCrmSynced]             = useState(!!lead.crm_gesynchroniseerd)
  const [calendlyLoading, setCalendlyLoading] = useState(false)
  const [followupDone, setFollowupDone] = useState(lead.follow_up_verstuurd)
  const [behandeld, setBehandeld] = useState(lead.status === 'behandeld')
  const [uitgenodigd, setUitgenodigd] = useState(lead.status === 'uitgenodigd')
  const [error, setError] = useState<string | null>(null)

  async function sendFollowup() {
    setFollowupLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/followup', {
        method: 'POST',
        headers: DASHBOARD_HEADERS,
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

  async function enrichLead() {
    setEnrichLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/enrich', {
        method: 'POST',
        headers: DASHBOARD_HEADERS,
        body: JSON.stringify({ leadId: lead.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setVerrijking(data.verrijking)
        router.refresh()
      } else {
        setError(data.error || 'Verrijking mislukt')
      }
    } catch {
      setError('Verbindingsfout — probeer opnieuw')
    }
    setEnrichLoading(false)
  }

  async function syncCrm() {
    setCrmLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/sync-crm', {
        method: 'POST',
        headers: DASHBOARD_HEADERS,
        body: JSON.stringify({ leadId: lead.id }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setCrmSynced(true)
        router.refresh()
      } else {
        setError(data.error || 'CRM sync mislukt')
      }
    } catch {
      setError('Verbindingsfout — probeer opnieuw')
    }
    setCrmLoading(false)
  }

  async function sendCalendlyInvite() {
    setCalendlyLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/calendly', {
        method: 'POST',
        headers: DASHBOARD_HEADERS,
        body: JSON.stringify({ leadId: lead.id }),
      })
      if (res.ok) {
        setUitgenodigd(true)
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Uitnodiging versturen mislukt')
      }
    } catch {
      setError('Verbindingsfout — probeer opnieuw')
    }
    setCalendlyLoading(false)
  }

  async function markBehandeld() {
    setBehandeldLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leads/behandeld', {
        method: 'POST',
        headers: DASHBOARD_HEADERS,
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

          {/* Bedrijfsinfo (Hunter.io verrijking) */}
          {verrijking ? (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#8A8FA8' }}>Bedrijfsinfo</h3>
              <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#1A1C24', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'Bedrijf', value: verrijking.bedrijfsnaam },
                  { label: 'Sector', value: verrijking.sector },
                  { label: 'Grootte', value: verrijking.grootte },
                  { label: 'Land', value: verrijking.land },
                ].filter(r => r.value).map(({ label: l, value }) => (
                  <div key={l} className="flex gap-2 text-xs">
                    <span className="w-16 shrink-0" style={{ color: '#5A5E82' }}>{l}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
                {verrijking.linkedin && (
                  <a href={verrijking.linkedin} target="_blank" rel="noopener noreferrer" className="flex gap-2 text-xs" style={{ color: '#5B6EF5' }}>
                    <span className="w-16 shrink-0" style={{ color: '#5A5E82' }}>LinkedIn</span>
                    <span>Bekijk profiel ↗</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={enrichLead}
              disabled={enrichLoading}
              className="w-full py-2 text-xs font-medium rounded-lg transition-opacity"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#5A5E82',
                opacity: enrichLoading ? 0.6 : 1,
              }}
            >
              {enrichLoading ? 'Bedrijfsdata ophalen…' : '🔍 Verrijk lead met Hunter.io'}
            </button>
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

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-3">
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
            <div className="flex gap-2">
              <button
                onClick={sendCalendlyInvite}
                disabled={calendlyLoading || uitgenodigd}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-opacity"
                style={{
                  background: uitgenodigd ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${uitgenodigd ? 'rgba(62,207,142,0.3)' : 'rgba(91,110,245,0.2)'}`,
                  color: uitgenodigd ? '#3ECF8E' : '#5B6EF5',
                  opacity: calendlyLoading ? 0.6 : 1,
                  cursor: uitgenodigd ? 'default' : 'pointer',
                }}
              >
                {calendlyLoading ? 'Versturen…' : uitgenodigd ? '✓ Meeting verstuurd' : '📅 Meeting uitnodiging'}
              </button>
              <button
                onClick={syncCrm}
                disabled={crmLoading || crmSynced}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-opacity"
                style={{
                  background: crmSynced ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${crmSynced ? 'rgba(62,207,142,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: crmSynced ? '#3ECF8E' : '#8A8FA8',
                  opacity: crmLoading ? 0.6 : 1,
                  cursor: crmSynced ? 'default' : 'pointer',
                }}
              >
                {crmLoading ? 'Syncing…' : crmSynced ? `✓ ${lead.crm_type ?? 'CRM'} synced` : '🔄 Sync naar CRM'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
