'use client'

import { useState } from 'react'

type ChartPoint = { day: string; label: string; count: number; hoog: number }

function buildPath(points: ChartPoint[], key: 'count' | 'hoog', W: number, H: number, pad: { l: number; r: number; t: number; b: number }) {
  const n = points.length
  if (n === 0) return ''
  const pw = W - pad.l - pad.r
  const ph = H - pad.t - pad.b
  const maxVal = Math.max(...points.map(p => p[key]), 1)
  const xs = points.map((_, i) => pad.l + (i / (n - 1)) * pw)
  const ys = points.map(p => pad.t + ph - (p[key] / maxVal) * ph)

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < n; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return d
}

function buildArea(points: ChartPoint[], key: 'count' | 'hoog', W: number, H: number, pad: { l: number; r: number; t: number; b: number }) {
  const path = buildPath(points, key, W, H, pad)
  if (!path) return ''
  const n = points.length
  const pw = W - pad.l - pad.r
  const lastX = pad.l + pw
  const baseY = H - pad.b
  return `${path} L ${lastX} ${baseY} L ${pad.l} ${baseY} Z`
}

export default function LeadChart({ data }: { data: ChartPoint[] }) {
  const [hovered, setHovered] = useState<ChartPoint | null>(null)
  const [hoverX, setHoverX] = useState(0)

  const W = 700
  const H = 180
  const pad = { l: 36, r: 16, t: 16, b: 32 }
  const pw = W - pad.l - pad.r

  const maxVal = Math.max(...data.map(p => p.count), 1)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(f * maxVal))

  const countPath = buildPath(data, 'count', W, H, pad)
  const hoogPath = buildPath(data, 'hoog', W, H, pad)
  const countArea = buildArea(data, 'count', W, H, pad)

  // X positions
  const xs = data.map((_, i) => pad.l + (i / Math.max(data.length - 1, 1)) * pw)

  // Show every 7th label
  const labelIndices = data.map((_, i) => i).filter(i => i % 7 === 0 || i === data.length - 1)

  return (
    <div className="relative w-full" style={{ userSelect: 'none' }}>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 px-5">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 rounded-full" style={{ background: '#5B6EF5' }} />
          <span className="text-xs" style={{ color: '#8A8FA8' }}>Alle leads</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 rounded-full" style={{ background: '#ECB22E' }} />
          <span className="text-xs" style={{ color: '#8A8FA8' }}>Hoge prioriteit</span>
        </div>
      </div>

      {/* SVG chart */}
      <div className="relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 180, display: 'block' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const relX = ((e.clientX - rect.left) / rect.width) * W
            const idx = Math.round(((relX - pad.l) / pw) * (data.length - 1))
            const clamped = Math.max(0, Math.min(data.length - 1, idx))
            setHovered(data[clamped])
            setHoverX(xs[clamped])
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Grid lines */}
          {gridLines.map((v) => {
            const y = v === 0
              ? pad.t + (H - pad.t - pad.b)
              : pad.t + (H - pad.t - pad.b) - (v / maxVal) * (H - pad.t - pad.b)
            return (
              <g key={v}>
                <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                {v > 0 && (
                  <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.2)">{v}</text>
                )}
              </g>
            )
          })}

          {/* Area fill */}
          {countArea && (
            <path d={countArea} fill="url(#areaGrad)" opacity="0.4" />
          )}

          {/* Lines */}
          {countPath && <path d={countPath} fill="none" stroke="#5B6EF5" strokeWidth="2" strokeLinecap="round" />}
          {hoogPath && <path d={hoogPath} fill="none" stroke="#ECB22E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />}

          {/* X axis labels */}
          {labelIndices.map((i) => (
            <text key={i} x={xs[i]} y={H - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">
              {data[i]?.label}
            </text>
          ))}

          {/* Hover line */}
          {hovered && (
            <line x1={hoverX} y1={pad.t} x2={hoverX} y2={H - pad.b} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          )}

          {/* Gradient */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B6EF5" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5B6EF5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute top-3 pointer-events-none px-3 py-2 rounded-lg text-xs"
            style={{
              left: Math.min(hoverX / W * 100, 70) + '%',
              background: '#1A1C2E',
              border: '1px solid rgba(91,110,245,0.3)',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            <p style={{ color: '#5A5E82' }} className="mb-1">{hovered.day}</p>
            <p><span style={{ color: '#5B6EF5' }}>●</span> {hovered.count} leads</p>
            <p><span style={{ color: '#ECB22E' }}>●</span> {hovered.hoog} hoog</p>
          </div>
        )}
      </div>
    </div>
  )
}
