'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Lars van den Berg',
    initials: 'LB',
    role: 'Growth Manager',
    company: 'TechFlow B.V.',
    avatarBg: 'linear-gradient(135deg, #5B6EF5, #3B4FD5)',
    quote:
      'Runvex heeft ons leadproces volledig getransformeerd. We besparen nu 8 uur per week en onze opvolging is 3x sneller.',
    stars: 5,
    highlight: true,
  },
  {
    name: 'Sanne Dijkstra',
    initials: 'SD',
    role: 'Directeur',
    company: 'MarketPro Amsterdam',
    avatarBg: 'linear-gradient(135deg, #3ECF8E, #27A870)',
    quote:
      'De AI scoring is ongelooflijk accuraat. We focussen nu alleen op leads met een hoge score en onze conversie is met 40% gestegen.',
    stars: 5,
    highlight: false,
  },
  {
    name: 'Daan Vermeer',
    initials: 'DV',
    role: 'Sales Lead',
    company: 'Groei.io',
    avatarBg: 'linear-gradient(135deg, #F5A623, #E08000)',
    quote:
      'Setup was klaar in 5 minuten. Geen gedoe, gewoon werken. Runvex is de beste investering die we dit jaar hebben gedaan.',
    stars: 5,
    highlight: false,
  },
]

// Split into two columns for masonry
const col1 = testimonials.filter((_, i) => i % 2 === 0)
const col2 = testimonials.filter((_, i) => i % 2 === 1)

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F5A623">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({
  t,
  index,
}: {
  t: (typeof testimonials)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0.15, y: 20 }}
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
      <Stars count={t.stars} />

      {/* Quote */}
      <p
        className="text-sm leading-relaxed mb-5"
        style={{ color: 'var(--text-2)' }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
            style={{ background: t.avatarBg }}
          >
            {t.initials}
          </div>
          {/* Verified badge */}
          <div
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: '#5B6EF5', border: '1.5px solid var(--bg-2)' }}
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{t.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-3)' }}>
            {t.role} · <span style={{ color: 'var(--text-2)' }}>{t.company}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
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
