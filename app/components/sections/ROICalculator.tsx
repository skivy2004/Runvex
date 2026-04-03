'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Slider } from '@/app/components/ui/slider'

const SLIDERS = [
  {
    key: 'leads' as const,
    label: 'Leads per maand',
    min: 5,
    max: 500,
    step: 5,
    format: (v: number) => `${v} leads`,
    ticks: ['5', '250', '500'],
  },
  {
    key: 'minPerLead' as const,
    label: 'Tijd per lead (handmatig)',
    min: 5,
    max: 60,
    step: 5,
    format: (v: number) => `${v} min`,
    ticks: ['5 min', '30 min', '60 min'],
  },
  {
    key: 'uurtarief' as const,
    label: 'Jouw uurtarief',
    min: 25,
    max: 200,
    step: 5,
    format: (v: number) => `€${v}`,
    ticks: ['€25', '€100', '€200'],
  },
]

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

  const values = { leads, minPerLead, uurtarief }
  const setters = { leads: setLeads, minPerLead: setMinPerLead, uurtarief: setUurtarief }

  const stats = useMemo(() => {
    const savedMinutes = leads * minPerLead * 0.85
    const savedHours = savedMinutes / 60
    const savedMoney = savedHours * uurtarief
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
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
              Jouw situatie
            </div>

            <div className="space-y-8">
              {SLIDERS.map((s) => {
                const current = values[s.key]
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                        {s.label}
                      </span>
                      <span
                        className="text-sm font-bold tabular-nums px-2 py-0.5 rounded-md"
                        style={{ color: '#5B6EF5', background: 'rgba(91,110,245,0.1)' }}
                      >
                        {s.format(current)}
                      </span>
                    </div>
                    <Slider
                      value={[current]}
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      showTooltip
                      tooltipContent={(v) => s.format(v)}
                      onValueChange={([v]) => setters[s.key](v)}
                    />
                    <div className="flex justify-between mt-2">
                      {s.ticks.map((t) => (
                        <span key={t} className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div
              className="rounded-lg p-4 text-xs"
              style={{
                background: 'rgba(91,110,245,0.06)',
                border: '1px solid rgba(91,110,245,0.15)',
                color: 'var(--text-3)',
              }}
            >
              Runvex automatiseert 85% van handmatig opvolgwerk en verhoogt conversie met 15% door snellere reactietijd.
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
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-[#6B5FF8]"
              style={{ background: 'var(--purple)' }}
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
