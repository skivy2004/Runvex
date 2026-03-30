'use client'

import { motion } from 'framer-motion'

const tiers = [
  {
    name: 'Gratis',
    price: '€0',
    period: '/mnd',
    badge: null,
    highlighted: false,
    features: [
      'Tot 50 leads/mnd',
      'Basis AI scoring',
      'E-mail notificaties',
      'Community support',
    ],
    cta: 'Gratis starten',
    ctaHref: '/#booking',
  },
  {
    name: 'Starter',
    price: '€49',
    period: '/mnd',
    badge: 'Meest gekozen',
    highlighted: true,
    features: [
      'Tot 500 leads/mnd',
      'Geavanceerde AI scoring',
      'CRM integraties',
      'E-mail automatisering',
      'Prioriteit support',
    ],
    cta: 'Start gratis proefperiode',
    ctaHref: '/#booking',
  },
  {
    name: 'Pro',
    price: '€149',
    period: '/mnd',
    badge: null,
    highlighted: false,
    features: [
      'Onbeperkte leads',
      'Custom AI modellen',
      'Alle integraties',
      'White-label optie',
      'Dedicated support',
    ],
    cta: 'Contact opnemen',
    ctaHref: '/contact',
  },
]

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="8" cy="8" r="8" fill="rgba(91,110,245,0.15)" />
      <path
        d="M5 8l2 2 4-4"
        stroke="#5B6EF5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
              color: '#5B6EF5',
            }}
          >
            Prijzen
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Transparante prijzen
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: 'var(--text-2)' }}>
            Begin gratis en schaal op wanneer jij er klaar voor bent. Geen verborgen kosten.
          </p>
        </motion.div>

        {/* Tiers grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl p-6 flex flex-col"
              style={{
                background: tier.highlighted ? '#12141A' : '#12141A',
                border: tier.highlighted
                  ? '1px solid rgba(91,110,245,0.4)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: tier.highlighted
                  ? '0 0 40px rgba(91,110,245,0.12), 0 0 0 1px rgba(91,110,245,0.08)'
                  : 'none',
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                  style={{ background: '#5B6EF5' }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Name + price */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-3" style={{ color: 'var(--text-2)' }}>
                  {tier.name}
                </div>
                <div className="flex items-end gap-1">
                  <span
                    className="font-bricolage font-extrabold text-4xl text-white"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {tier.price}
                  </span>
                  <span className="text-sm mb-1" style={{ color: 'var(--text-2)' }}>
                    {tier.period}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="mb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={tier.ctaHref}
                className="block text-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150"
                style={
                  tier.highlighted
                    ? {
                        background: '#5B6EF5',
                        color: '#fff',
                      }
                    : {
                        background: 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }
                }
                onMouseEnter={(e) => {
                  if (tier.highlighted) {
                    e.currentTarget.style.background = '#4A5DE4'
                  } else {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (tier.highlighted) {
                    e.currentTarget.style.background = '#5B6EF5'
                  } else {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  }
                }}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
