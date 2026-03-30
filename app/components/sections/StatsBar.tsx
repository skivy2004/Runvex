'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function Counter({ value, prefix, suffix }: { value: number; prefix?: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(eased * value)
      setCount(start)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <span ref={ref} className="font-bricolage font-extrabold text-4xl md:text-5xl text-white">
      {prefix && <span style={{ color: 'var(--purple-2)' }}>{prefix}</span>}
      {count}
      <span style={{ color: 'var(--purple-2)' }}>{suffix}</span>
    </span>
  )
}

const stats = [
  { value: 500, suffix: '+', label: 'Leads verwerkt' },
  { value: 94, suffix: '%', label: 'AI score accuraatheid' },
  { value: 10, prefix: '< ', suffix: ' min', label: 'Gemiddelde setup' },
]

export default function StatsBar() {
  return (
    <section
      className="py-12 md:py-16"
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0"
          initial={{ opacity: 0.15, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center ${
                i < stats.length - 1
                  ? 'md:border-r'
                  : ''
              }`}
              style={{
                borderColor: 'var(--border)',
              }}
            >
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <div className="mt-2 text-sm" style={{ color: 'var(--text-2)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
