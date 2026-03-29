'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Thomas K.',
    role: 'Freelance developer',
    quote:
      'Dit bespaart me minstens 2 uur per dag aan handmatig opvolgen. De AI-scoring is verrassend accuraat — ik focus nu alleen nog op de hoge prioriteit leads.',
    highlight: true,
  },
  {
    name: 'Sarah M.',
    role: 'Marketing consultant',
    quote:
      'De gepersonaliseerde emails worden door klanten altijd als authentiek ervaren. Niemand heeft ooit gemerkt dat ze AI-gegenereerd zijn.',
    highlight: false,
  },
  {
    name: 'Jeroen V.',
    role: 'Ondernemer',
    quote: 'Setup duurde 10 minuten. Het werkt feilloos.',
    short: true,
    highlight: false,
  },
  {
    name: 'Lisa B.',
    role: 'Sales manager',
    quote:
      'Het dashboard is het eerste wat ik elke ochtend open. Eindelijk alles op één plek, zonder ruis.',
    highlight: false,
  },
  {
    name: 'Mark T.',
    role: 'Directeur',
    quote:
      'De wekelijkse AI-rapportage geeft me precies het overzicht dat ik nodig heb voor mijn teamgesprekken. Concrete data, geen vaag gedoe.',
    highlight: true,
  },
  {
    name: 'Anna R.',
    role: 'Freelance designer',
    quote:
      'Ik had altijd moeite met opvolgen. Nu gaat het gewoon automatisch.',
    short: true,
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
