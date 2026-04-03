'use client'

import { motion } from 'framer-motion'
import MiniScoreCard from '../ui/MiniScoreCard'
import MiniEmailCard from '../ui/MiniEmailCard'

/* Custom SVG Icons */
function DashboardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="var(--purple-2)" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="4" rx="1.5" stroke="var(--purple-2)" strokeWidth="1.5"/>
      <rect x="14" y="11" width="7" height="10" rx="1.5" stroke="var(--purple-2)" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="var(--purple-2)" strokeWidth="1.5"/>
    </svg>
  )
}
function SlackAlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 17H9l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8v3M12 14h.01" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function EnrichIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="var(--purple-2)" strokeWidth="1.5"/>
      <path d="M21 21l-4.35-4.35" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 8v6M8 11h6" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
function ReportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6M9 13h6M9 17h4" stroke="var(--purple-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const tiles = [
  { icon: <DashboardIcon />, title: 'Realtime dashboard', desc: 'Gesorteerd op prioriteit, filterbaar op sector en score.' },
  { icon: <SlackAlertIcon />, title: 'Directe Slack alerts', desc: 'Hoge prioriteit leads melden zich direct in je kanaal.' },
  { icon: <EnrichIcon />, title: 'Bedrijfsdata verrijking', desc: 'Automatisch bedrijfsinfo ophalen via Hunter.io.' },
  { icon: <ReportIcon />, title: 'Wekelijkse AI rapportage', desc: 'Elke maandag: alle leads, trends en top prioriteiten.' },
]

const fadeUp = {
  initial: { opacity: 0.15, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.5 },
}

export default function WhyRunvex() {
  return (
    <section id="features" className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'var(--text-3)' }}
          >
            Waarom Runvex
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Alles wat je nodig hebt.
            <br />
            Niets wat je niet nodig hebt.
          </h2>
        </motion.div>

        {/* Two big cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Card 1 — AI Lead Scoring */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-250"
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
            }}
            whileHover={{
              y: -2,
              borderColor: 'rgba(91,110,245,0.3)',
              boxShadow: '0 0 0 1px rgba(91,110,245,0.15), 0 20px 60px rgba(91,110,245,0.08)',
            }}
          >
            <div className="mb-6">
              <h3
                className="font-bricolage font-bold text-xl md:text-2xl text-white mb-3"
                style={{ letterSpacing: '-0.01em' }}
              >
                Claude AI scoort elke lead automatisch
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Elk nieuw contactformulier wordt direct geanalyseerd. Claude kijkt
                naar naam, bedrijf, bericht en bron — en geeft een prioriteitsscore
                van 1-10 met sector en samenvatting.
              </p>
            </div>
            <MiniScoreCard />
          </motion.div>

          {/* Card 2 — Automatische opvolging */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-250"
            style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
            }}
            whileHover={{
              y: -2,
              borderColor: 'rgba(91,110,245,0.3)',
              boxShadow: '0 0 0 1px rgba(91,110,245,0.15), 0 20px 60px rgba(91,110,245,0.08)',
            }}
          >
            <div className="mb-6">
              <h3
                className="font-bricolage font-bold text-xl md:text-2xl text-white mb-3"
                style={{ letterSpacing: '-0.01em' }}
              >
                Nooit meer handmatig opvolgen
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Bevestigingsmails en follow-ups schrijft Claude uniek voor elke
                lead. Na 3 dagen automatisch een opvolgmail als er geen reactie is.
              </p>
            </div>
            <MiniEmailCard />
          </motion.div>
        </div>

        {/* Four smaller tiles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0.15, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl p-6 transition-all duration-200 cursor-default"
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
              }}
              whileHover={{
                borderColor: 'var(--border-2)',
                background: 'var(--bg-3)',
              }}
            >
              <div className="mb-3">{tile.icon}</div>
              <h4 className="font-bricolage font-semibold text-sm text-white mb-1.5">
                {tile.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {tile.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
