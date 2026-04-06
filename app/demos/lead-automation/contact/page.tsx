'use client'

import { useState } from 'react'
import Link from 'next/link'

const RANDOM_DATA = [
  { naam: 'Sophie van den Berg', email: 'jeremycordes31@gmail.com', telefoon: '06-12345678', bedrijf: 'TechStartup BV', bericht: 'We zijn op zoek naar een automatiseringsoplossing voor ons salesproces. Kunnen jullie ons helpen?' },
  { naam: 'Lars Bakker', email: 'jeremycordes31@gmail.com', telefoon: '06-87654321', bedrijf: 'Bakker Bouw', bericht: 'Ik wil graag weten wat jullie kunnen betekenen voor mijn bouwbedrijf op het gebied van offerte automatisering.' },
  { naam: 'Emma de Groot', email: 'jeremycordes31@gmail.com', telefoon: '', bedrijf: 'De Groot Marketing', bericht: 'Een collega heeft jullie aanbevolen. We zoeken iemand die onze lead opvolging kan automatiseren.' },
  { naam: 'Tim Visser', email: 'jeremycordes31@gmail.com', telefoon: '06-11223344', bedrijf: '', bericht: 'Ik heb jullie gevonden via Instagram. Ik run een webshop en wil graag automatisch follow-up emails sturen.' },
  { naam: 'Noa Jansen', email: 'jeremycordes31@gmail.com', telefoon: '06-99887766', bedrijf: 'Jansen Consultancy', bericht: 'We zijn een groeiend consultancybedrijf en willen onze CRM processen stroomlijnen. Kunnen we een gesprek inplannen?' },
]

const DIENSTEN = [
  'Lead Automatisering',
  'E-mail Opvolging',
  'AI Lead Scoring',
  'CRM Koppeling',
  'Slack Integraties',
  'Andere',
]

const MAX_BERICHT = 500

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [bedrijf, setBedrijf] = useState('')
  const [diensten, setDiensten] = useState<string[]>([])
  const [bericht, setBericht] = useState('')

  function toggleDienst(d: string) {
    setDiensten((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])
  }

  function fillRandom() {
    const d = RANDOM_DATA[Math.floor(Math.random() * RANDOM_DATA.length)]
    setNaam(d.naam)
    setEmail(d.email)
    setTelefoon(d.telefoon)
    setBedrijf(d.bedrijf)
    setBericht(d.bericht)
    setDiensten(['Lead Automatisering', 'E-mail Opvolging'])
    setErrors({})
  }

  function validate() {
    const e: Record<string, string> = {}
    if (naam.length < 2) e.naam = 'Vul je naam in.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Vul een geldig e-mailadres in.'
    if (bericht.length < 5) e.bericht = 'Schrijf een kort bericht.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationErrors = validate()
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
        body: JSON.stringify({
          naam, email, telefoon, bedrijf,
          bron: diensten.join(', ') || 'Niet opgegeven',
          bericht,
          timestamp: new Date().toISOString(),
        }),
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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0A0B0F' }}>
        <div className="rounded-2xl p-12 max-w-md w-full text-center" style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(91,110,245,0.15)' }}>
            <svg className="w-8 h-8" fill="none" stroke="#5B6EF5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-bricolage font-extrabold text-2xl text-white mb-2">Lead ontvangen! ✓</h2>
          <p className="text-sm mb-2" style={{ color: '#8A8FA8' }}>De lead is nu opgeslagen in het dashboard en wordt automatisch gescoord door Claude AI.</p>
          <p className="text-sm mb-6" style={{ color: '#5A5E82' }}>Zo werkt het voor jouw klanten — volledig automatisch.</p>
          <div className="flex flex-col gap-2">
            <Link href="/demos/lead-automation/demo-dashboard" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-white text-center" style={{ background: '#5B6EF5' }}>
              Bekijk in dashboard →
            </Link>
            <Link href="/" className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium text-center" style={{ color: '#8A8FA8' }}>
              ← Terug naar home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const inputBase = {
    width: '100%',
    padding: '11px 14px 11px 38px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#12141A',
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
  } as React.CSSProperties

  const inputError = { ...inputBase, borderColor: 'rgba(239,68,68,0.5)' }
  const inputNoIcon = { ...inputBase, paddingLeft: 14 }

  return (
    <div className="min-h-screen" style={{ background: '#0A0B0F' }}>
      {/* Dashboard link */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/demos/lead-automation/demo-dashboard"
          className="px-4 py-2 text-white text-sm font-semibold rounded-lg"
          style={{ background: '#5B6EF5' }}
        >
          Dashboard →
        </Link>
      </div>

      <div className="min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — info */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
              style={{ background: 'rgba(91,110,245,0.1)', border: '1px solid rgba(91,110,245,0.2)', color: '#5B6EF5' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B6EF5] animate-pulse" />
              Live Demo
            </div>

            {/* Headline */}
            <h1
              className="font-bricolage font-extrabold text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              Dit zien jouw<br />
              <span style={{ color: '#5B6EF5' }}>klanten.</span>
            </h1>

            {/* Description */}
            <p className="text-base leading-relaxed mb-8" style={{ color: '#8A8FA8', maxWidth: 380 }}>
              Dit is een live demo van het contactformulier dat jouw klanten invullen. Elke inzending wordt automatisch gescoord door AI, opgeslagen en opgevolgd — zonder dat jij er iets voor hoeft te doen.
            </p>

            {/* Demo uitleg */}
            <div className="space-y-3 mb-8">
              {[
                { icon: '⚡', text: 'Inzending verschijnt direct in het dashboard' },
                { icon: '🤖', text: 'Claude AI scoort de lead automatisch (1–10)' },
                { icon: '📧', text: 'Klant krijgt direct een bevestigingsmail' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-sm mt-0.5">{item.icon}</span>
                  <span className="text-sm" style={{ color: '#8A8FA8' }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <p className="text-sm" style={{ color: '#5A5E82' }}>Wil je dit voor jouw bedrijf? Bereik ons via</p>
              <a
                href="mailto:jeremycordes31@gmail.com"
                className="text-sm font-medium transition-colors"
                style={{ color: '#5B6EF5' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7B8EF5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#5B6EF5')}
              >
                jeremycordes31@gmail.com
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: '< 10 min', label: 'Setup tijd' },
                { value: '94%', label: 'Score accuraatheid' },
                { value: '24u', label: 'Reactietijd' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-bricolage font-extrabold text-xl text-white mb-0.5">{s.value}</div>
                  <div className="text-xs" style={{ color: '#5A5E82' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — form */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: '#0D0F1A',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 0 0 1px rgba(91,110,245,0.06), 0 40px 80px rgba(0,0,0,0.4)',
            }}
          >
            {/* Form header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bricolage font-bold text-white text-lg">Probeer het zelf uit</h2>
              <button
                type="button"
                onClick={fillRandom}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ color: '#8A8FA8', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}
              >
                🎲 Testdata
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Row 1: Naam + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
                    Naam <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" stroke={errors.naam ? '#EF4444' : '#5A5E82'} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    <input
                      value={naam}
                      onChange={(e) => setNaam(e.target.value)}
                      type="text"
                      placeholder="Jan de Vries"
                      autoComplete="name"
                      style={errors.naam ? inputError : inputBase}
                    />
                  </div>
                  {errors.naam && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.naam}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
                    E-mailadres <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" stroke={errors.email ? '#EF4444' : '#5A5E82'} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="jan@bedrijf.nl"
                      autoComplete="email"
                      style={errors.email ? inputError : inputBase}
                    />
                  </div>
                  {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: Telefoon + Bedrijf */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>Telefoonnummer</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" stroke="#5A5E82" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input
                      value={telefoon}
                      onChange={(e) => setTelefoon(e.target.value)}
                      type="tel"
                      placeholder="+31 6 12345678"
                      autoComplete="tel"
                      style={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>Bedrijfsnaam</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" stroke="#5A5E82" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input
                      value={bedrijf}
                      onChange={(e) => setBedrijf(e.target.value)}
                      type="text"
                      placeholder="Bedrijf B.V."
                      autoComplete="organization"
                      style={inputBase}
                    />
                  </div>
                </div>
              </div>

              {/* Diensten checkboxes */}
              <div>
                <label className="block text-xs font-medium mb-3" style={{ color: '#8A8FA8' }}>
                  Kies je interesse
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DIENSTEN.map((d) => {
                    const checked = diensten.includes(d)
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDienst(d)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all"
                        style={{
                          background: checked ? 'rgba(91,110,245,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${checked ? 'rgba(91,110,245,0.4)' : 'rgba(255,255,255,0.07)'}`,
                          color: checked ? '#A5B4FF' : '#5A5E82',
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                          style={{
                            background: checked ? '#5B6EF5' : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${checked ? '#5B6EF5' : 'rgba(255,255,255,0.12)'}`,
                          }}
                        >
                          {checked && (
                            <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bericht */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
                  Bericht <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={bericht}
                    onChange={(e) => setBericht(e.target.value.slice(0, MAX_BERICHT))}
                    rows={4}
                    placeholder="Hoe kunnen we je helpen?"
                    style={{
                      ...(errors.bericht ? inputError : inputNoIcon),
                      resize: 'none',
                      paddingBottom: 28,
                    }}
                  />
                  <span
                    className="absolute bottom-2 right-3 text-xs pointer-events-none"
                    style={{ color: '#5A5E82' }}
                  >
                    {bericht.length}/{MAX_BERICHT}
                  </span>
                </div>
                {errors.bericht && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.bericht}</p>}
              </div>

              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="rounded-lg px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
                  <strong className="block font-medium">Er ging iets mis.</strong>
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{
                  background: status === 'loading' ? 'rgba(91,110,245,0.5)' : 'linear-gradient(135deg, #5B6EF5, #7B5EF5)',
                  boxShadow: status === 'loading' ? 'none' : '0 0 20px rgba(91,110,245,0.35)',
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
                ) : (
                  <>
                    Verstuur bericht
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
