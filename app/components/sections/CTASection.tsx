'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="relative rounded-3xl overflow-hidden text-center mx-auto"
          style={{
            maxWidth: 700,
            background:
              'linear-gradient(135deg, rgba(91,110,245,0.15) 0%, rgba(91,110,245,0.05) 100%)',
            border: '1px solid rgba(91,110,245,0.25)',
            padding: 'clamp(40px, 6vw, 64px)',
          }}
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Bottom glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(91,110,245,0.2) 0%, transparent 70%)',
            }}
          />

          {/* Logo icon */}
          <div className="relative z-10 mb-6 flex justify-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--purple), var(--purple-2))',
                boxShadow: '0 8px 24px rgba(91,110,245,0.3)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 3h4.5a3.5 3.5 0 0 1 0 7H7l4 3M4 3v10"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="relative z-10">
            <h2
              className="font-bricolage font-extrabold text-2xl md:text-4xl text-white mb-4"
              style={{ letterSpacing: '-0.02em' }}
            >
              Ervaar Runvex.
              <br />
              Start vandaag gratis.
            </h2>
            <p className="text-sm md:text-base mb-8" style={{ color: 'var(--text-2)' }}>
              Geen creditcard. Geen setup kosten. Binnen 10 minuten live.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-150"
                style={{ background: 'var(--purple)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#6B5FF8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--purple)')}
              >
                Start gratis
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform duration-150 group-hover:translate-x-[3px]"
                >
                  <path
                    d="M5.25 3.5L8.75 7L5.25 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="/#booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white transition-all duration-150"
                style={{ border: '1px solid rgba(255,255,255,0.18)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')
                }
              >
                Boek een call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
