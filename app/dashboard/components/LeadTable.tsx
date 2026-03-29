'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Lead } from '../page'
import ScoreBadge from './ScoreBadge'
import LeadDetail from './LeadDetail'

type SortKey = 'ai_prioriteit' | 'aangemaakt_op' | 'naam'

function PriorityBadge({ value }: { value: number | null }) {
  const v = value ?? 0
  const color = v >= 8 ? 'bg-red-100 text-red-700' : v >= 5 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'
  return <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${color}`}>{v}</span>
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
    if (sortKey !== k) return <span className="text-gray-300 ml-1">↕</span>
    return <span className="text-indigo-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Zoeken op naam, email, bedrijf..."
          className="flex-1 min-w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <select value={scoreFilter} onChange={e => setScoreFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Alle scores</option>
          <option value="hoog">Hoog</option>
          <option value="middel">Middel</option>
          <option value="laag">Laag</option>
        </select>
        <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Alle sectoren</option>
          {sectors.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
          <span>Bijgewerkt: {minutes === 0 ? 'zojuist' : `${minutes} min geleden`}</span>
          <button onClick={() => router.refresh()}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors">
            ↺ Vernieuwen
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500 cursor-pointer select-none w-16" onClick={() => toggleSort('ai_prioriteit')}>
                  Prio <Arrow k="ai_prioriteit" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('naam')}>
                  Naam <Arrow k="naam" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Bedrijf</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Sector</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Score</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Samenvatting</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 cursor-pointer select-none" onClick={() => toggleSort('aangemaakt_op')}>
                  Datum <Arrow k="aangemaakt_op" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">FU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    {leads.length === 0 ? 'Nog geen leads ontvangen' : 'Geen leads gevonden voor deze filters'}
                  </td>
                </tr>
              ) : filtered.map(lead => (
                <tr key={lead.id} onClick={() => setSelected(lead)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3"><PriorityBadge value={lead.ai_prioriteit} /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{lead.naam}</div>
                    <div className="text-gray-400 text-xs">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.bedrijf || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{lead.ai_sector || '—'}</td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.ai_score} /></td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell max-w-xs">
                    {lead.ai_samenvatting ? lead.ai_samenvatting.slice(0, 80) + (lead.ai_samenvatting.length > 80 ? '…' : '') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(lead.aangemaakt_op).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {lead.follow_up_verstuurd
                      ? <span className="text-green-500">✓</span>
                      : <span className="text-gray-300">✗</span>}
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
