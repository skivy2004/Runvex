'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: 'var(--text-2)' }}>
          {label}
        </span>
        <span className="text-sm font-semibold text-white tabular-nums">{format(value)}</span>
      </div>
      <div className="relative h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${pct}%`, background: 'var(--purple)' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white"
          style={{ left: `calc(${pct}% - 8px)`, background: 'var(--purple)' }}
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: boolean
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{
        background: accent ? 'rgba(91,110,245,0.12)' : 'var(--bg-2)',
        border: accent ? '1px solid rgba(91,110,245,0.3)' : '1px solid var(--border)',
      }}
    >
      <div
        className="text-2xl font-bricolage font-extrabold"
        style={{ color: accent ? '#5B6EF5' : 'white', letterSpacing: '-0.02em' }}
      >
        {value}
      </div>
      <div className="text-sm font-medium text-white">{label}</div>
      <div className="text-xs" style={{ color: 'var(--text-3)' }}>
        {sub}
      </div>
    </div>
  )
}

export default function ROICalculator() {
  const [leads, setLeads] = useState(50)
  const [minPerLead, setMinPerLead] = useState(20)
  const [uurtarief, setUurtarief] = useState(75)

  const stats = useMemo(() => {
    // Runvex automates ~85% of manual follow-up time
    const savedMinutes = leads * minPerLead * 0.85
    const savedHours = savedMinutes / 60
    const savedMoney = savedHours * uurtarief
    // Conservative 15% conversion uplift from faster follow-up
    const extraLeads = Math.round(leads * 0.15)

    return {
      savedHours: savedHours.toFixed(1),
      savedMoney: Math.round(savedMoney),
      extraLeads,
      savedMinutes: Math.round(savedMinutes),
    }
  }, [leads, minPerLead, uurtarief])

  return (
    <section id="roi" className="py-14 md:py-20" style={{ background: '#0A0B0F' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
              color: '#5B6EF5',
            }}
          >
            ROI Calculator
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Hoeveel bespaar jij?
          </h2>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--text-2)' }}>
            Vul in hoe jouw huidige situatie eruitziet en zie direct wat Runvex voor jou betekent.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Left — sliders */}
          <div
            className="rounded-2xl p-6 md:p-8 space-y-8"
            style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--text-3)' }}>
                Jouw situatie
              </div>
              <div className="space-y-8">
                <Slider
                  label="Leads per maand"
                  value={leads}
                  min={5}
                  max={500}
                  step={5}
                  format={(v) => `${v} leads`}
                  onChange={setLeads}
                />
                <Slider
                  label="Tijd per lead (handmatig)"
                  value={minPerLead}
                  min={5}
                  max={60}
                  step={5}
                  format={(v) => `${v} min`}
                  onChange={setMinPerLead}
                />
                <Slider
                  label="Jouw uurtarief"
                  value={uurtarief}
                  min={25}
                  max={200}
                  step={5}
                  format={(v) => `€${v}`}
                  onChange={setUurtarief}
                />
              </div>
            </div>

            <div
              className="rounded-lg p-4 text-xs"
              style={{
                background: 'rgba(91,110,245,0.06)',
                border: '1px solid rgba(91,110,245,0.15)',
                color: 'var(--text-3)',
              }}
            >
              Berekening: Runvex automatiseert gemiddeld 85% van het handmatige opvolgwerk en verhoogt conversie met 15% door snellere reactietijd.
            </div>
          </div>

          {/* Right — results */}
          <div className="flex flex-col gap-4">
            <StatCard
              label="Tijd bespaard per maand"
              value={`${stats.savedHours} uur`}
              sub={`${stats.savedMinutes} minuten minder handmatig werk`}
              accent
            />
            <StatCard
              label="Geld bespaard per maand"
              value={`€${stats.savedMoney.toLocaleString('nl-NL')}`}
              sub={`Op basis van €${uurtarief}/uur uurtarief`}
            />
            <StatCard
              label="Extra conversies per maand"
              value={`+${stats.extraLeads} leads`}
              sub="Door snellere opvolging mis je minder kansen"
            />

            <Link
              href="/contact"
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold text-white transition-all duration-150"
              style={{ background: 'var(--purple)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#6B5FF8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--purple)')}
            >
              Start gratis — zie het zelf
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5.25 3.5L8.75 7L5.25 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
