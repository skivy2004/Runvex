'use client'

import { useState, useEffect, useCallback } from 'react'

type Draft = {
  id: string
  draft_tekst: string
  hook: string | null
  onderwerp: string | null
  gebaseerd_op_url: string | null
  gebaseerd_op_likes: number | null
  status: 'concept' | 'goedgekeurd' | 'geplaatst'
  aangemaakt_op: string
  geplaatst_op: string | null
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  concept:     { label: 'Concept',     color: '#8A8FA8', bg: 'rgba(255,255,255,0.05)',      border: 'rgba(255,255,255,0.08)' },
  goedgekeurd: { label: 'Goedgekeurd', color: '#3ECF8E', bg: 'rgba(62,207,142,0.1)',         border: 'rgba(62,207,142,0.2)' },
  geplaatst:   { label: 'Geplaatst',   color: '#A99FF5', bg: 'rgba(91,110,245,0.12)',        border: 'rgba(91,110,245,0.2)' },
}

const AUTH_HEADERS = {
  'Content-Type': 'application/json',
}

export default function ContentClient() {
  const [drafts, setDrafts]             = useState<Draft[]>([])
  const [loading, setLoading]           = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [copied, setCopied]             = useState<string | null>(null)
  const [expanded, setExpanded]         = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const url = statusFilter ? `/api/linkedin-drafts?status=${statusFilter}` : '/api/linkedin-drafts'
      const r = await fetch(url, { headers: AUTH_HEADERS })
      const d = await r.json()
      if (Array.isArray(d)) setDrafts(d)
    } catch {}
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: string) {
    const body: Record<string, string> = { status }
    if (status === 'geplaatst') body.geplaatst_op = new Date().toISOString()
    await fetch(`/api/linkedin-drafts/${id}`, {
      method: 'PUT',
      headers: AUTH_HEADERS,
      body: JSON.stringify(body),
    })
    await load()
  }

  async function verwijder(id: string) {
    await fetch(`/api/linkedin-drafts/${id}`, { method: 'DELETE', headers: AUTH_HEADERS })
    await load()
  }

  function copy(id: string, tekst: string) {
    navigator.clipboard.writeText(tekst)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const totaal = drafts.length
  const goedgekeurd = drafts.filter(d => d.status === 'goedgekeurd').length
  const geplaatst = drafts.filter(d => d.status === 'geplaatst').length

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-bricolage font-extrabold text-white" style={{ fontSize: 26, letterSpacing: '-0.02em' }}>
            LinkedIn Content
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
            AI-gegenereerde LinkedIn posts op basis van trending content
          </p>
        </div>
        <a
          href="#n8n"
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white shrink-0"
          style={{ background: '#5B6EF5' }}
          onClick={e => { e.preventDefault(); window.open('https://n8n.io', '_blank') }}
        >
          ⚡ Genereer via n8n
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Drafts totaal', value: totaal, color: '#8A8FA8' },
          { label: 'Goedgekeurd', value: goedgekeurd, color: '#3ECF8E' },
          { label: 'Geplaatst', value: geplaatst, color: '#A99FF5' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-xs" style={{ color: '#5A5E82' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['', 'concept', 'goedgekeurd', 'geplaatst'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{
              background: statusFilter === s ? 'rgba(91,110,245,0.15)' : 'rgba(255,255,255,0.04)',
              color: statusFilter === s ? '#5B6EF5' : '#5A5E82',
              border: `1px solid ${statusFilter === s ? 'rgba(91,110,245,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            {s === '' ? 'Alles' : STATUS_LABELS[s]?.label ?? s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#5A5E82', fontSize: 13 }}>Laden…</div>
      ) : drafts.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-3xl mb-3">✍️</div>
          <div className="text-sm font-semibold text-white mb-1">Nog geen drafts</div>
          <div className="text-xs mb-4" style={{ color: '#5A5E82' }}>
            Verbind n8n met de Apify LinkedIn scraper en Claude AI om automatisch posts te genereren
          </div>
          <div className="rounded-lg px-4 py-3 text-left" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#5A5E82' }}>n8n → voeg HTTP Request toe na Claude stap:</p>
            <code className="text-xs" style={{ color: '#5B6EF5' }}>
              POST https://runvex.app/api/linkedin-drafts<br />
              {'Body: { draft_tekst, hook, onderwerp, gebaseerd_op_url, gebaseerd_op_likes }'}
            </code>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map(draft => {
            const statusInfo = STATUS_LABELS[draft.status] ?? STATUS_LABELS.concept
            const isExpanded = expanded === draft.id
            const preview = draft.draft_tekst.slice(0, 200)
            const isLong = draft.draft_tekst.length > 200

            return (
              <div key={draft.id} className="rounded-xl p-4" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    {draft.hook && (
                      <p className="text-sm font-semibold text-white mb-1 truncate">{draft.hook}</p>
                    )}
                    {draft.onderwerp && (
                      <p className="text-xs mb-1" style={{ color: '#5A5E82' }}>#{draft.onderwerp}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#3A3D50' }}>
                      <span>{new Date(draft.aangemaakt_op).toLocaleDateString('nl-NL')}</span>
                      {draft.gebaseerd_op_likes && <span>· {draft.gebaseerd_op_likes.toLocaleString()} likes bron</span>}
                    </div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                    style={{ background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.border}` }}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Draft text */}
                <div
                  className="rounded-lg p-3 mb-3 text-sm cursor-pointer"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.04)', color: '#8A8FA8', whiteSpace: 'pre-wrap' }}
                  onClick={() => setExpanded(isExpanded ? null : draft.id)}
                >
                  {isExpanded ? draft.draft_tekst : preview}
                  {isLong && !isExpanded && '…'}
                  {isLong && (
                    <span className="ml-1 text-xs" style={{ color: '#5B6EF5' }}>
                      {isExpanded ? ' ↑ Inklappen' : ' ↓ Toon alles'}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => copy(draft.id, draft.draft_tekst)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: copied === draft.id ? '#3ECF8E' : '#8A8FA8' }}
                  >
                    {copied === draft.id ? '✓ Gekopieerd' : '⎘ Kopieer'}
                  </button>

                  {draft.status === 'concept' && (
                    <button
                      onClick={() => updateStatus(draft.id, 'goedgekeurd')}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: 'rgba(62,207,142,0.08)', border: '1px solid rgba(62,207,142,0.15)', color: '#3ECF8E' }}
                    >
                      ✓ Goedkeuren
                    </button>
                  )}

                  {draft.status === 'goedgekeurd' && (
                    <>
                      <button
                        onClick={() => updateStatus(draft.id, 'concept')}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#5A5E82' }}
                      >
                        ↩ Concept
                      </button>
                      <button
                        onClick={() => updateStatus(draft.id, 'geplaatst')}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium"
                        style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)', color: '#A99FF5' }}
                      >
                        🚀 Markeer geplaatst
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => verwijder(draft.id)}
                    className="text-xs px-2.5 py-1.5 rounded-lg ml-auto"
                    style={{ background: 'rgba(232,80,122,0.06)', border: '1px solid rgba(232,80,122,0.1)', color: '#E8507A' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* n8n integration info */}
      <div className="mt-5 rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#5A5E82' }}>n8n workflow: Apify → Claude AI → Dashboard</p>
        <code className="text-xs" style={{ color: '#5B6EF5' }}>
          Apify LinkedIn Scraper → Filter trending posts → Claude prompt → POST /api/linkedin-drafts
        </code>
      </div>
    </div>
  )
}
