'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import BookingFlow from '../booking/BookingFlow'

const STEPS = [
  { number: 1 as const, label: 'Jouw gegevens' },
  { number: 2 as const, label: 'Kies een moment' },
  { number: 3 as const, label: 'Bevestiging' },
]

export default function BookingSection() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  return (
    <section
      id="booking"
      className="py-20 md:py-28"
      style={{ background: '#0A0B0F' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1.5 rounded-full"
            style={{
              color: '#5B6EF5',
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
            }}
          >
            Gratis kennismaken
          </span>

          <h2
            className="font-bricolage font-extrabold text-white text-2xl md:text-4xl mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Plan een gratis discovery call
          </h2>

          <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: '#8A8FA8' }}>
            Vertel ons over je project en kies een moment dat jou uitkomt. Geen verplichtingen — gewoon een open gesprek.
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          className="flex items-center justify-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex items-center">
              {/* Bubble + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                  style={{
                    background:
                      currentStep > s.number
                        ? '#3ECF8E'
                        : currentStep === s.number
                        ? '#5B6EF5'
                        : 'rgba(255,255,255,0.06)',
                    color: currentStep >= s.number ? '#ffffff' : '#5A5E82',
                    border:
                      currentStep === s.number
                        ? '2px solid rgba(91,110,245,0.5)'
                        : currentStep > s.number
                        ? '2px solid rgba(62,207,142,0.4)'
                        : '2px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {currentStep > s.number ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </div>
                <span
                  className="text-xs font-medium hidden sm:block"
                  style={{
                    color: currentStep === s.number ? '#ffffff' : '#5A5E82',
                    transition: 'color 0.3s',
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div
                  className="w-16 sm:w-24 h-px mx-2 mb-5 transition-all duration-300"
                  style={{
                    background:
                      currentStep > s.number
                        ? 'rgba(62,207,142,0.4)'
                        : 'rgba(255,255,255,0.08)',
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Card containing the multi-step flow */}
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: '#12141A',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            }}
          >
            <BookingFlow onStepChange={setCurrentStep} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
