'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('exit-popup-dismissed')) return
    if (localStorage.getItem('exit-popup-disabled')) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setVisible(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [dismissed])

  const dismiss = () => {
    setVisible(false)
    setDismissed(true)
    sessionStorage.setItem('exit-popup-dismissed', '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit-intent' }),
      })
    } catch {}
    setSubmitted(true)
    setTimeout(dismiss, 2000)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="relative w-full max-w-md rounded-2xl p-8" style={{ background: '#12141E', border: '1px solid rgba(91,110,245,0.25)' }}>
        <button onClick={dismiss} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors" style={{ color: 'var(--text-3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">✓</div>
            <div className="font-bricolage font-bold text-white text-lg">Checklist onderweg!</div>
            <p className="text-sm mt-2" style={{ color: 'var(--text-2)' }}>Check je inbox.</p>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(91,110,245,0.1)', color: '#5B6EF5' }}>
              Gratis download
            </div>
            <h2 className="font-bricolage font-extrabold text-2xl text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              De ultieme checklist voor snellere lead opvolging
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
              7 stappen die de beste MKB-bedrijven gebruiken om leads 3x sneller op te volgen. Gratis, direct in je inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="jouw@email.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#8A8FA8] focus:outline-none transition-colors"
                style={{ background: '#0A0B0F', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(91,110,245,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold text-white hover:bg-[#6B5FF8] transition-colors" style={{ background: 'var(--purple)' }}>
                Stuur mij de checklist →
              </button>
            </form>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>Geen spam. Uitschrijven kan altijd.</p>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('exit-popup-disabled', '1')
                  dismiss()
                }}
                className="text-xs underline underline-offset-2 transition-colors"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8A8FA8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
              >
                Niet meer tonen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
