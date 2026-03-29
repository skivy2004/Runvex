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
  const [behandeld, setBehandeld] = useState(false)

  async function sendFollowup() {
    setFollowupLoading(true)
    const res = await fetch('/api/leads/followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id }),
    })
    if (res.ok) { setFollowupDone(true); router.refresh() }
    setFollowupLoading(false)
  }

  async function markBehandeld() {
    setBehandeldLoading(true)
    const res = await fetch('/api/leads/behandeld', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId: lead.id }),
    })
    if (res.ok) { setBehandeld(true); router.refresh() }
    setBehandeldLoading(false)
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Slide-over */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{lead.naam} {lead.bedrijf ? `— ${lead.bedrijf}` : ''}</h2>
            <div className="flex gap-4 mt-1 text-sm text-gray-500">
              <span>{lead.email}</span>
              {lead.telefoon && <span>{lead.telefoon}</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Badges */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500">Score:</span>
              <ScoreBadge score={lead.ai_score} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500">Prioriteit:</span>
              <span className="text-sm font-semibold">{lead.ai_prioriteit ?? '—'}/10</span>
            </div>
            {lead.ai_sector && (
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-500">Sector:</span>
                <span className="text-sm font-semibold">{lead.ai_sector}</span>
              </div>
            )}
          </div>

          {lead.ai_samenvatting && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">AI Samenvatting</h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{lead.ai_samenvatting}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Origineel bericht</h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{lead.bericht}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {lead.bron && (
              <div><span className="text-gray-500">Bron:</span> <span className="font-medium">{lead.bron}</span></div>
            )}
            <div>
              <span className="text-gray-500">Ontvangen:</span>{' '}
              <span className="font-medium">{new Date(lead.aangemaakt_op).toLocaleString('nl-NL')}</span>
            </div>
            <div>
              <span className="text-gray-500">Follow-up:</span>{' '}
              <span className={`font-medium ${lead.follow_up_verstuurd ? 'text-green-600' : 'text-gray-400'}`}>
                {lead.follow_up_verstuurd ? 'Verstuurd' : 'Nog niet verstuurd'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={sendFollowup} disabled={followupLoading || followupDone}
              className="flex-1 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors">
              {followupLoading ? 'Verzenden...' : followupDone ? '✓ Follow-up verstuurd' : 'Stuur nu follow-up'}
            </button>
            <button onClick={markBehandeld} disabled={behandeldLoading || behandeld}
              className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors">
              {behandeldLoading ? 'Opslaan...' : behandeld ? '✓ Behandeld' : 'Markeer als behandeld'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
