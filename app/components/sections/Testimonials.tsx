'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Lars van den Berg',
    role: 'Growth Manager bij TechFlow B.V.',
    quote:
      'Runvex heeft ons leadproces volledig getransformeerd. We besparen nu 8 uur per week en onze opvolging is 3x sneller.',
    highlight: true,
  },
  {
    name: 'Sanne Dijkstra',
    role: 'Directeur bij MarketPro Amsterdam',
    quote:
      'De AI scoring is ongelooflijk accuraat. We focussen nu alleen op leads met een hoge score en onze conversie is met 40% gestegen.',
    highlight: false,
  },
  {
    name: 'Daan Vermeer',
    role: 'Sales Lead bij Groei.io',
    quote:
      'Setup was klaar in 5 minuten. Geen gedoe, gewoon werken. Runvex is de beste investering die we dit jaar hebben gedaan.',
    highlight: false,
  },
]

// Split into two columns for masonry
const col1 = testimonials.filter((_, i) => i % 2 === 0)
const col2 = testimonials.filter((_, i) => i % 2 === 1)

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl p-6 mb-4"
      style={{
        background: 'var(--bg-2)',
        border: t.highlight
          ? '1px solid rgba(91,110,245,0.35)'
          : '1px solid var(--border)',
        boxShadow: t.highlight
          ? '0 0 0 1px rgba(91,110,245,0.1)'
          : 'none',
      }}
    >
      {/* Quote */}
      <p
        className="text-sm leading-relaxed mb-5"
        style={{ color: 'var(--text-2)' }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #5B6EF5, #7B8FF8)',
          }}
        >
          {t.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{t.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-3)' }}>
            {t.role}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
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
            Klantervaring
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Wat onze gebruikers zeggen
          </h2>
        </motion.div>

        {/* Masonry 2 columns */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            {col1.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>
          <div className="md:mt-8">
            {col2.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
