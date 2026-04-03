'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Load Remotion Player client-side only (no SSR)
const RemotionDemoPlayer = dynamic(() => import('../remotion/DemoPlayer'), {
  ssr: false,
  loading: () => (
    <div
      style={{ aspectRatio: '16/9', background: '#0C0E1B', borderRadius: 16, border: '1px solid rgba(91,110,245,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(91,110,245,0.3)', borderTopColor: '#5B6EF5', animation: 'spin 0.8s linear infinite' }} />
    </div>
  ),
})

const steps = [
  { num: '01', label: 'Lead komt binnen via formulier' },
  { num: '02', label: 'Claude AI scoort en analyseert de lead' },
  { num: '03', label: 'Follow-up e-mail verstuurd in < 60 sec' },
]

export default function DemoVideo() {
  return (
    <section id="demo-video" className="py-14 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
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
            Zie het in actie
          </div>
          <h2
            className="font-bricolage font-extrabold text-3xl md:text-5xl text-white mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Van lead tot follow-up
            <br />
            in 60 seconden
          </h2>
          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: 'var(--text-2)' }}>
            Bekijk hoe een binnenkomende lead automatisch door Claude AI wordt gescoord en een gepersonaliseerde follow-up ontvangt.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <RemotionDemoPlayer />
        </motion.div>

        {/* Steps below video */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-8"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center gap-2">
              <div
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(91,110,245,0.12)',
                  border: '1px solid rgba(91,110,245,0.25)',
                  color: '#5B6EF5',
                }}
              >
                {step.num}
              </div>
              <p className="text-xs md:text-sm" style={{ color: 'var(--text-2)' }}>
                {step.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
