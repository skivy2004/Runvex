'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Lead } from '../page'
import ScoreBadge from './ScoreBadge'
import LeadDetail from './LeadDetail'

type SortKey = 'ai_prioriteit' | 'aangemaakt_op' | 'naam'

function PriorityBadge({ value }: { value: number | null }) {
  const v = value ?? 0
  let bg = 'rgba(255,255,255,0.06)'
  let color = '#5A5E82'
  if (v >= 8) { bg = 'rgba(91,110,245,0.18)'; color = '#A99FF5' }
  else if (v >= 5) { bg = 'rgba(236,178,46,0.12)'; color = '#ECB22E' }
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
      style={{ background: bg, color }}
    >
      {v}
    </span>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#1A1C24',
  color: '#FFFFFF',
  fontSize: 14,
  outline: 'none',
}

export default function LeadTable({ leads, lastUpdated }: { leads: Lead[]; lastUpdated: Date }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [scoreFilter, setScoreFilter] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('ai_prioriteit')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Lead | null>(null)

  const sectors = useMemo(() => [...new Set(leads.map(l => l.ai_sector).filter(Boolean))].sort() as string[], [leads])

  const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads
      .filter(l => {
        if (q && !`${l.naam} ${l.email} ${l.bedrijf}`.toLowerCase().includes(q)) return false
        if (scoreFilter && l.ai_score !== scoreFilter) return false
        if (sectorFilter && l.ai_sector !== sectorFilter) return false
        return true
      })
      .sort((a, b) => {
        let va: string | number = a[sortKey] ?? ''
        let vb: string | number = b[sortKey] ?? ''
        if (sortKey === 'ai_prioriteit') { va = Number(va); vb = Number(vb) }
        const r = va < vb ? -1 : va > vb ? 1 : 0
        return sortDir === 'asc' ? r : -r
      })
  }, [leads, search, scoreFilter, sectorFilter, sortKey, sortDir])

  function Arrow({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="ml-1" style={{ color: 'rgba(255,255,255,0.2)' }}>↕</span>
    return <span className="ml-1" style={{ color: '#5B6EF5' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Zoeken op naam, email, bedrijf..."
          style={{ ...inputStyle, minWidth: 192, flex: 1 }}
        />
        <select
          value={scoreFilter}
          onChange={e => setScoreFilter(e.target.value)}
          style={{ ...inputStyle, appearance: 'auto' }}
        >
          <option value="" style={{ background: '#1A1C24' }}>Alle scores</option>
          <option value="hoog" style={{ background: '#1A1C24' }}>Hoog</option>
          <option value="middel" style={{ background: '#1A1C24' }}>Middel</option>
          <option value="laag" style={{ background: '#1A1C24' }}>Laag</option>
        </select>
        <select
          value={sectorFilter}
          onChange={e => setSectorFilter(e.target.value)}
          style={{ ...inputStyle, appearance: 'auto' }}
        >
          <option value="" style={{ background: '#1A1C24' }}>Alle sectoren</option>
          {sectors.map(s => <option key={s} style={{ background: '#1A1C24' }}>{s}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: '#5A5E82' }}>
          <span>Bijgewerkt: {minutes === 0 ? 'zojuist' : `${minutes} min geleden`}</span>
          <button
            onClick={() => router.refresh()}
            className="px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#8A8FA8',
            }}
          >
            ↺ Vernieuwen
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: '#12141A',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none w-16"
                  style={{ color: '#5A5E82' }}
                  onClick={() => toggleSort('ai_prioriteit')}
                >
                  Prio <Arrow k="ai_prioriteit" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                  style={{ color: '#5A5E82' }}
                  onClick={() => toggleSort('naam')}
                >
                  Naam <Arrow k="naam" />
                </th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: '#5A5E82' }}>Bedrijf</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#5A5E82' }}>Sector</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: '#5A5E82' }}>Score</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: '#5A5E82' }}>Samenvatting</th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                  style={{ color: '#5A5E82' }}
                  onClick={() => toggleSort('aangemaakt_op')}
                >
                  Datum <Arrow k="aangemaakt_op" />
                </th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: '#5A5E82' }}>FU</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12" style={{ color: '#5A5E82' }}>
                    {leads.length === 0 ? 'Nog geen leads ontvangen' : 'Geen leads gevonden voor deze filters'}
                  </td>
                </tr>
              ) : filtered.map((lead, i) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="cursor-pointer transition-colors"
                  style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3"><PriorityBadge value={lead.ai_prioriteit} /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{lead.naam}</div>
                    <div className="text-xs" style={{ color: '#5A5E82' }}>{lead.email}</div>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#8A8FA8' }}>{lead.bedrijf || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#8A8FA8' }}>{lead.ai_sector || '—'}</td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.ai_score} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell max-w-xs" style={{ color: '#5A5E82' }}>
                    {lead.ai_samenvatting ? lead.ai_samenvatting.slice(0, 80) + (lead.ai_samenvatting.length > 80 ? '…' : '') : '—'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8A8FA8' }}>
                    {new Date(lead.aangemaakt_op).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lead.follow_up_verstuurd
                      ? <span style={{ color: '#3ECF8E' }}>✓</span>
                      : <span style={{ color: 'rgba(255,255,255,0.15)' }}>✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
