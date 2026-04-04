'use client'

import { useState } from 'react'
import Link from 'next/link'

const WEBHOOK_PLACEHOLDER = 'https://runvex.app/api/contact'

const steps = [
  {
    num: 1,
    title: 'Kopieer je webhook URL',
    desc: 'Voeg deze URL toe aan je contactformulier als POST endpoint. Ondersteunt elk formulier dat webhooks ondersteunt.',
    action: 'copy' as const,
  },
  {
    num: 2,
    title: 'Stuur een testlead',
    desc: 'Vul je eigen formulier in met een testnaam en e-mailadres. De lead verschijnt binnen 10 seconden in dit dashboard.',
    action: 'link' as const,
    href: '/demos/lead-automation/contact',
  },
  {
    num: 3,
    title: 'Bekijk de AI analyse',
    desc: 'Claude analyseert de lead en geeft een score (0–100), sector en prioriteit. De follow-up e-mail wordt automatisch verstuurd.',
    action: 'done' as const,
  },
]

export default function OnboardingWizard() {
  const [copied, setCopied] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(WEBHOOK_PLACEHOLDER)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setActiveStep(2)
    }, 1500)
  }

  return (
    <div className="rounded-xl mb-4 overflow-hidden" style={{ background: '#12141A', border: '1px solid rgba(91,110,245,0.2)' }}>
      <div className="px-5 pt-5 pb-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <h2 className="text-sm font-semibold text-white">Aan de slag met Runvex</h2>
          <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>3 stappen om live te gaan</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#5A5E82', border: '1px solid rgba(255,255,255,0.06)' }}>
          Verberg
        </button>
      </div>

      <div className="p-5 grid md:grid-cols-3 gap-3">
        {steps.map((step) => {
          const isActive = activeStep === step.num
          const isDone = activeStep > step.num
          return (
            <div key={step.num} className="rounded-xl p-4"
              style={{ background: isActive ? 'rgba(91,110,245,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isActive ? 'rgba(91,110,245,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: isDone ? 'rgba(62,207,142,0.15)' : isActive ? 'rgba(91,110,245,0.2)' : 'rgba(255,255,255,0.05)', color: isDone ? '#3ECF8E' : isActive ? '#5B6EF5' : '#5A5E82' }}>
                  {isDone ? '✓' : step.num}
                </div>
                <div className="text-xs font-semibold" style={{ color: isActive ? 'white' : '#5A5E82' }}>{step.title}</div>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#5A5E82' }}>{step.desc}</p>

              {isActive && step.action === 'copy' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono rounded-lg px-3 py-2 truncate"
                    style={{ background: 'rgba(0,0,0,0.3)', color: '#5B6EF5', border: '1px solid rgba(91,110,245,0.2)' }}>
                    {WEBHOOK_PLACEHOLDER}
                  </div>
                  <button onClick={handleCopy} className="w-full text-xs font-semibold py-2 rounded-lg text-white transition-colors"
                    style={{ background: copied ? 'rgba(62,207,142,0.2)' : 'var(--purple)', color: copied ? '#3ECF8E' : 'white' }}>
                    {copied ? '✓ Gekopieerd!' : 'Kopieer URL'}
                  </button>
                </div>
              )}

              {isActive && step.action === 'link' && (
                <Link href={step.href!} className="w-full block text-center text-xs font-semibold py-2 rounded-lg text-white"
                  style={{ background: 'var(--purple)' }} onClick={() => setActiveStep(3)}>
                  Open testformulier →
                </Link>
              )}

              {isActive && step.action === 'done' && (
                <button onClick={() => setDismissed(true)} className="w-full text-xs font-semibold py-2 rounded-lg"
                  style={{ background: 'rgba(62,207,142,0.12)', color: '#3ECF8E', border: '1px solid rgba(62,207,142,0.2)' }}>
                  ✓ Setup voltooid
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
