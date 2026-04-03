'use client'

import { motion } from 'framer-motion'
import MiniFormUI from '../ui/MiniFormUI'
import MiniScoreCard from '../ui/MiniScoreCard'
import MiniEmailCard from '../ui/MiniEmailCard'

const steps = [
  {
    number: '01',
    title: 'Lead vult het formulier in',
    desc: 'Op je contactpagina vult een lead naam, email, bedrijf en bericht in.',
    visual: <MiniFormUI />,
  },
  {
    number: '02',
    title: 'Claude analyseert & scoort',
    desc: 'Binnen 2 seconden geeft Claude een prioriteit, sector en samenvatting.',
    visual: <MiniScoreCard />,
  },
  {
    number: '03',
    title: 'Automatische opvolging',
    desc: 'Bevestigingsmail verstuurd, jij krijgt notificatie, follow-up ingepland.',
    visual: <MiniEmailCard />,
  },
]

export default function HowItWorks() {
  return (
    <section
      id="hoe-het-werkt"
      className="py-14 md:py-20 relative"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(91,110,245,0.12) 0%, transparent 70%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'var(--text-3)' }}
          >
            Hoe het werkt
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Drie stappen. Nul gedoe.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div
            className="hidden lg:block absolute top-1/2 left-[16%] right-[16%] h-px -translate-y-1/2"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(91,110,245,0.3) 0, rgba(91,110,245,0.3) 8px, transparent 8px, transparent 16px)',
            }}
          />

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0.15, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                {/* Large background number */}
                <div
                  className="absolute -top-6 left-0 font-bricolage font-extrabold select-none pointer-events-none"
                  style={{
                    fontSize: '120px',
                    lineHeight: 1,
                    color: 'rgba(91,110,245,0.05)',
                  }}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: 'var(--purple-2)' }}
                  >
                    Stap {step.number}
                  </div>
                  <h3
                    className="font-bricolage font-bold text-xl text-white mb-2"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: 'var(--text-2)' }}
                  >
                    {step.desc}
                  </p>

                  {/* Visual */}
                  <div className="max-w-xs">{step.visual}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
