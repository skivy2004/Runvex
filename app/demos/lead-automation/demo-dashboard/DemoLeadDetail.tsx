'use client'
import { useState } from 'react'
import type { Lead } from '../dashboard/page'
import ScoreBadge from '../dashboard/components/ScoreBadge'

export default function DemoLeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [toast, setToast] = useState(false)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  const followupDone = lead.follow_up_verstuurd
  const behandeld = lead.status === 'behandeld'
  const uitgenodigd = lead.status === 'uitgenodigd'
  const crmSynced = !!lead.crm_gesynchroniseerd

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
          {/* Demo notice */}
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-medium"
            style={{ background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.2)', color: '#A5B4FF' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Demo modus — dit zijn voorbeeldleads. Acties zijn uitgeschakeld.
          </div>

          {/* Badges */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-sm" style={{ color: '#8A8FA8' }}>Score:</span>
              <ScoreBadge score={lead.ai_score} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm" style={{ color: '#8A8FA8' }}>Prioriteit:</span>
              <span className="text-sm font-semibold text-white">{lead.ai_prioriteit ?? '—'}/100</span>
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
              <p className="text-sm rounded-lg p-3" style={{ background: '#1A1C24', color: '#8A8FA8', border: '1px solid rgba(255,255,255,0.06)' }}>
                {lead.ai_samenvatting}
              </p>
            </div>
          )}

          {/* Bedrijfsinfo */}
          {lead.verrijking ? (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#8A8FA8' }}>Bedrijfsinfo</h3>
              <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#1A1C24', border: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'Bedrijf', value: lead.verrijking.bedrijfsnaam },
                  { label: 'Sector', value: lead.verrijking.sector },
                  { label: 'Grootte', value: lead.verrijking.grootte },
                  { label: 'Land', value: lead.verrijking.land },
                ].filter(r => r.value).map(({ label: l, value }) => (
                  <div key={l} className="flex gap-2 text-xs">
                    <span className="w-16 shrink-0" style={{ color: '#5A5E82' }}>{l}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
                {lead.verrijking.linkedin && (
                  <div className="flex gap-2 text-xs">
                    <span className="w-16 shrink-0" style={{ color: '#5A5E82' }}>LinkedIn</span>
                    <span style={{ color: '#5B6EF5' }}>Bekijk profiel ↗</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={showToast}
              className="w-full py-2 text-xs font-medium rounded-lg transition-opacity"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#5A5E82' }}
            >
              🔍 Verrijk lead met Hunter.io
            </button>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: '#8A8FA8' }}>Origineel bericht</h3>
            <p className="text-sm rounded-lg p-3 whitespace-pre-wrap" style={{ background: '#1A1C24', color: '#8A8FA8', border: '1px solid rgba(255,255,255,0.06)' }}>
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
              <span className="font-medium text-white">{new Date(lead.aangemaakt_op).toLocaleString('nl-NL')}</span>
            </div>
            <div>
              <span style={{ color: '#8A8FA8' }}>Follow-up: </span>
              <span className="font-medium" style={{ color: followupDone ? '#3ECF8E' : '#5A5E82' }}>
                {followupDone ? 'Verstuurd' : 'Nog niet verstuurd'}
              </span>
            </div>
            <div>
              <span style={{ color: '#8A8FA8' }}>Status: </span>
              <span className="font-medium" style={{ color: behandeld ? '#3ECF8E' : '#5A5E82' }}>
                {behandeld ? 'Behandeld' : lead.status || 'Nieuw'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-3">
              <button
                onClick={showToast}
                className="flex-1 py-2.5 text-white text-sm font-medium rounded-lg transition-opacity"
                style={{ background: followupDone ? 'rgba(91,110,245,0.3)' : '#5B6EF5', cursor: followupDone ? 'default' : 'pointer' }}
              >
                {followupDone ? '✓ Follow-up verstuurd' : 'Stuur follow-up'}
              </button>
              <button
                onClick={showToast}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg"
                style={{
                  background: behandeld ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${behandeld ? 'rgba(62,207,142,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: behandeld ? '#3ECF8E' : '#8A8FA8',
                }}
              >
                {behandeld ? '✓ Behandeld' : 'Markeer behandeld'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={showToast}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg"
                style={{
                  background: uitgenodigd ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${uitgenodigd ? 'rgba(62,207,142,0.3)' : 'rgba(91,110,245,0.2)'}`,
                  color: uitgenodigd ? '#3ECF8E' : '#5B6EF5',
                }}
              >
                {uitgenodigd ? '✓ Meeting verstuurd' : '📅 Meeting uitnodiging'}
              </button>
              <button
                onClick={showToast}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg"
                style={{
                  background: crmSynced ? 'rgba(62,207,142,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${crmSynced ? 'rgba(62,207,142,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: crmSynced ? '#3ECF8E' : '#8A8FA8',
                }}
              >
                {crmSynced ? `✓ ${lead.crm_type ?? 'CRM'} synced` : '🔄 Sync naar CRM'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl text-sm font-medium shadow-xl"
          style={{ background: '#1A1C24', border: '1px solid rgba(91,110,245,0.3)', color: '#A5B4FF' }}
        >
          Dit is een demo — acties zijn uitgeschakeld
        </div>
      )}
    </>
  )
}
