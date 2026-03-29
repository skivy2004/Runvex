'use client'

import { motion } from 'framer-motion'
import { GlowCard } from '../ui/spotlight-card'

const demos = [
  {
    title: 'Lead Automatisering',
    description:
      'Leg leads vast, laat Claude AI ze scoren en verstuur automatisch gepersonaliseerde follow-ups — zonder handmatige tussenkomst.',
    href: '/demos/lead-automation/contact',
    live: true,
    badge: 'Live demo',
    gradient: 'radial-gradient(ellipse 120% 80% at 10% 110%, rgba(91,110,245,0.18) 0%, transparent 70%)',
    badgeBg: 'rgba(91,110,245,0.15)',
    badgeColor: '#A99FF5',
    dot: '#5B6EF5',
    glowColor: 'purple' as const,
    icons: [
      <svg key="a" width="18" height="18" fill="none" stroke="#5B6EF5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
      <svg key="b" width="18" height="18" fill="none" stroke="#A99FF5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>,
    ],
  },
  {
    title: 'E-mail Campagnes',
    description:
      'Stuur gerichte campagnes op basis van klantgedrag. Volledig geautomatiseerd met AI-gegenereerde content per doelgroep.',
    href: null,
    live: false,
    badge: 'Binnenkort',
    gradient: 'radial-gradient(ellipse 120% 80% at 10% 110%, rgba(62,207,142,0.12) 0%, transparent 70%)',
    badgeBg: 'rgba(62,207,142,0.1)',
    badgeColor: '#3ECF8E',
    dot: '#3ECF8E',
    glowColor: 'green' as const,
    icons: [
      <svg key="a" width="18" height="18" fill="none" stroke="#3ECF8E" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      <svg key="b" width="18" height="18" fill="none" stroke="#5A7A6E" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>,
    ],
  },
  {
    title: 'CRM Integratie',
    description:
      'Synchroniseer contacten, deals en activiteiten automatisch met jouw CRM — realtime, zonder copy-paste of handmatig invoeren.',
    href: null,
    live: false,
    badge: 'Binnenkort',
    gradient: 'radial-gradient(ellipse 120% 80% at 10% 110%, rgba(236,178,46,0.12) 0%, transparent 70%)',
    badgeBg: 'rgba(236,178,46,0.1)',
    badgeColor: '#ECB22E',
    dot: '#ECB22E',
    glowColor: 'orange' as const,
    icons: [
      <svg key="a" width="18" height="18" fill="none" stroke="#ECB22E" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
      <svg key="b" width="18" height="18" fill="none" stroke="#7A6B3E" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>,
    ],
  },
]

export default function DemoCards() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#5B6EF5' }}>
            Demo's
          </p>
          <h2 className="font-bricolage font-extrabold text-white text-2xl md:text-4xl" style={{ letterSpacing: '-0.02em' }}>
            Probeer het zelf uit
          </h2>
          <p className="mt-3 text-sm md:text-base max-w-lg mx-auto" style={{ color: '#8A8FA8' }}>
            Elke demo toont een live workflow — van binnenkomende data tot automatische opvolging.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={demo.live ? { y: -4 } : {}}
              style={{ opacity: demo.live ? 1 : 0.65 }}
            >
              <GlowCard
                glowColor={demo.glowColor}
                customSize
                className="h-full p-6"
              >
                {/* Link overlay for live card */}
                {demo.live && (
                  <a href={demo.href!} className="absolute inset-0 z-20" aria-label={demo.title} />
                )}

                {/* Gradient glow */}
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{ background: demo.gradient }} />
                {demo.live && (
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: demo.gradient.replace('0.18', '0.32').replace('0.12', '0.24') }} />
                )}

                {/* Top row: icons + indicator */}
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div className="flex items-center gap-2">
                    {demo.icons.map((icon, j) => (
                      <div key={j}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                  {demo.live ? (
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
                      style={{ background: demo.badgeBg }}
                    >
                      <svg width="13" height="13" fill="none" stroke={demo.badgeColor} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <svg width="13" height="13" fill="none" stroke="#5A5E82" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1">
                  <h3 className="font-bricolage font-bold text-white text-xl mb-2" style={{ letterSpacing: '-0.01em' }}>
                    {demo.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5A5E82' }}>
                    {demo.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center justify-between mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: demo.badgeBg, color: demo.badgeColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: demo.dot }} />
                    {demo.badge}
                  </span>
                  {demo.live ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 group-hover:gap-2 relative z-20 pointer-events-none"
                      style={{ background: demo.badgeBg, color: demo.badgeColor }}
                    >
                      Probeer nu
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform duration-200 group-hover:translate-x-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: '#3A3D50' }}>Binnenkort beschikbaar</span>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
