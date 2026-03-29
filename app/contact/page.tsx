'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'

const RANDOM_DATA = [
  { naam: 'Sophie van den Berg', email: 'jeremycordes31@gmail.com', telefoon: '06-12345678', bedrijf: 'TechStartup BV', bron: 'LinkedIn', bericht: 'We zijn op zoek naar een automatiseringsoplossing voor ons salesproces. Kunnen jullie ons helpen?' },
  { naam: 'Lars Bakker', email: 'jeremycordes31@gmail.com', telefoon: '06-87654321', bedrijf: 'Bakker Bouw', bron: 'Google / Zoekmachine', bericht: 'Ik wil graag weten wat jullie kunnen betekenen voor mijn bouwbedrijf op het gebied van offerte automatisering.' },
  { naam: 'Emma de Groot', email: 'jeremycordes31@gmail.com', telefoon: '', bedrijf: 'De Groot Marketing', bron: 'Aanbeveling', bericht: 'Een collega heeft jullie aanbevolen. We zoeken iemand die onze lead opvolging kan automatiseren.' },
  { naam: 'Tim Visser', email: 'jeremycordes31@gmail.com', telefoon: '06-11223344', bedrijf: '', bron: 'Social media', bericht: 'Ik heb jullie gevonden via Instagram. Ik run een webshop en wil graag automatisch follow-up emails sturen naar verlaten winkelwagens.' },
  { naam: 'Noa Jansen', email: 'jeremycordes31@gmail.com', telefoon: '06-99887766', bedrijf: 'Jansen Consultancy', bron: 'Anders', bericht: 'We zijn een groeiend consultancybedrijf en willen onze CRM processen stroomlijnen. Kunnen we een gesprek inplannen?' },
]

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.08)',
  background: '#1A1C24',
  color: '#FFFFFF',
  fontSize: 14,
  outline: 'none',
}

const inputErrorStyle = {
  ...inputStyle,
  border: '1px solid rgba(239,68,68,0.5)',
}

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  function fillRandom() {
    const d = RANDOM_DATA[Math.floor(Math.random() * RANDOM_DATA.length)]
    const form = formRef.current
    if (!form) return
    ;(form.elements.namedItem('naam') as HTMLInputElement).value = d.naam
    ;(form.elements.namedItem('email') as HTMLInputElement).value = d.email
    ;(form.elements.namedItem('telefoon') as HTMLInputElement).value = d.telefoon
    ;(form.elements.namedItem('bedrijf') as HTMLInputElement).value = d.bedrijf
    ;(form.elements.namedItem('bron') as HTMLSelectElement).value = d.bron
    ;(form.elements.namedItem('bericht') as HTMLTextAreaElement).value = d.bericht
    setErrors({})
  }

  function validate(data: Record<string, string>) {
    const e: Record<string, string> = {}
    if (data.naam.length < 2) e.naam = 'Vul je naam in.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Vul een geldig e-mailadres in.'
    if (!data.bron) e.bron = 'Selecteer hoe u ons heeft gevonden.'
    if (data.bericht.length < 5) e.bericht = 'Schrijf een kort bericht.'
    return e
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>

    if (data.website) return // honeypot

    const validationErrors = validate(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const last = parseInt(localStorage.getItem('last_submit') || '0')
    const now = Date.now()
    if (now - last < 60000) {
      const s = Math.ceil((60000 - (now - last)) / 1000)
      setErrorMsg(`Wacht nog ${s} seconden voor je opnieuw verstuurt.`)
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, form_token: process.env.NEXT_PUBLIC_FORM_TOKEN, timestamp: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error(`Server antwoordde met status ${res.status}`)
      localStorage.setItem('last_submit', Date.now().toString())
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Onbekende fout')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0A0B0F' }}>
        <div
          className="rounded-2xl p-12 max-w-md w-full text-center"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(91,110,245,0.15)' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="#5B6EF5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bericht ontvangen!</h2>
          <p style={{ color: '#8A8FA8' }}>Bedankt voor je bericht. Je ontvangt een bevestiging per e-mail.</p>
          <Link
            href="/"
            className="inline-block mt-6 px-5 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ background: '#5B6EF5' }}
          >
            ← Terug naar home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0A0B0F' }}>
      {/* Dashboard link */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/dashboard"
          className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
          style={{ background: '#5B6EF5' }}
        >
          Dashboard →
        </Link>
      </div>

      <div
        className="rounded-2xl p-10 max-w-lg w-full"
        style={{
          background: '#12141A',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 80px rgba(91,110,245,0.08)',
        }}
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: '#5B6EF5' }}
            >
              Demo aanvragen
            </div>
            <h1
              className="font-bricolage font-extrabold text-2xl text-white mb-1"
              style={{ letterSpacing: '-0.02em' }}
            >
              Neem contact op
            </h1>
            <p className="text-sm" style={{ color: '#8A8FA8' }}>
              Vul het formulier in en we nemen zo snel mogelijk contact met je op.
            </p>
          </div>
          <button
            type="button"
            onClick={fillRandom}
            className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            style={{
              color: '#8A8FA8',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
            }}
          >
            🎲 Random
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Naam */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
              Naam <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              name="naam"
              type="text"
              placeholder="Jan de Vries"
              autoComplete="name"
              style={errors.naam ? inputErrorStyle : inputStyle}
            />
            {errors.naam && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.naam}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
              E-mailadres <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="jan@bedrijf.nl"
              autoComplete="email"
              style={errors.email ? inputErrorStyle : inputStyle}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
          </div>

          {/* Telefoon */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
              Telefoonnummer
            </label>
            <input
              name="telefoon"
              type="tel"
              placeholder="+31 6 12345678"
              autoComplete="tel"
              style={inputStyle}
            />
          </div>

          {/* Bedrijf */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
              Bedrijf
            </label>
            <input
              name="bedrijf"
              type="text"
              placeholder="Bedrijf B.V."
              autoComplete="organization"
              style={inputStyle}
            />
          </div>

          {/* Bron */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
              Hoe heeft u ons gevonden? <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              name="bron"
              defaultValue=""
              style={errors.bron ? { ...inputErrorStyle, appearance: 'auto' } : { ...inputStyle, appearance: 'auto' }}
            >
              <option value="" disabled style={{ background: '#1A1C24' }}>Selecteer een optie</option>
              <option style={{ background: '#1A1C24' }}>Google / Zoekmachine</option>
              <option style={{ background: '#1A1C24' }}>LinkedIn</option>
              <option style={{ background: '#1A1C24' }}>Aanbeveling</option>
              <option style={{ background: '#1A1C24' }}>Social media</option>
              <option style={{ background: '#1A1C24' }}>Anders</option>
            </select>
            {errors.bron && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.bron}</p>}
          </div>

          {/* Bericht */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
              Bericht <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              name="bericht"
              rows={4}
              placeholder="Hoe kunnen we je helpen?"
              style={{
                ...(errors.bericht ? inputErrorStyle : inputStyle),
                resize: 'vertical',
              }}
            />
            {errors.bericht && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.bericht}</p>}
          </div>

          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {/* Error */}
          {status === 'error' && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#FCA5A5',
              }}
            >
              <strong className="block font-medium">Er ging iets mis.</strong>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            style={{
              background: status === 'loading' ? 'rgba(91,110,245,0.5)' : '#5B6EF5',
              borderRadius: 8,
            }}
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verzenden...
              </>
            ) : 'Verzenden'}
          </button>
        </form>
      </div>
    </div>
  )
}
