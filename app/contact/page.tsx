'use client'
import { useState, useRef } from 'react'

const RANDOM_DATA = [
  { naam: 'Sophie van den Berg', email: 'jeremycordes31@gmail.com', telefoon: '06-12345678', bedrijf: 'TechStartup BV', bron: 'LinkedIn', bericht: 'We zijn op zoek naar een automatiseringsoplossing voor ons salesproces. Kunnen jullie ons helpen?' },
  { naam: 'Lars Bakker', email: 'jeremycordes31@gmail.com', telefoon: '06-87654321', bedrijf: 'Bakker Bouw', bron: 'Google / Zoekmachine', bericht: 'Ik wil graag weten wat jullie kunnen betekenen voor mijn bouwbedrijf op het gebied van offerte automatisering.' },
  { naam: 'Emma de Groot', email: 'jeremycordes31@gmail.com', telefoon: '', bedrijf: 'De Groot Marketing', bron: 'Aanbeveling', bericht: 'Een collega heeft jullie aanbevolen. We zoeken iemand die onze lead opvolging kan automatiseren.' },
  { naam: 'Tim Visser', email: 'jeremycordes31@gmail.com', telefoon: '06-11223344', bedrijf: '', bron: 'Social media', bericht: 'Ik heb jullie gevonden via Instagram. Ik run een webshop en wil graag automatisch follow-up emails sturen naar verlaten winkelwagens.' },
  { naam: 'Noa Jansen', email: 'jeremycordes31@gmail.com', telefoon: '06-99887766', bedrijf: 'Jansen Consultancy', bron: 'Anders', bericht: 'We zijn een groeiend consultancybedrijf en willen onze CRM processen stroomlijnen. Kunnen we een gesprek inplannen?' },
]

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
      <div className="min-h-screen flex items-center justify-center p-4 text-gray-900">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Bericht ontvangen!</h2>
          <p className="text-gray-500">Bedankt voor je bericht. Je ontvangt een bevestiging per e-mail.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-gray-900">
      <div className="fixed top-4 right-4 z-50">
        <a href="/dashboard" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors">
          Dashboard →
        </a>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-lg w-full">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Neem contact op</h1>
            <p className="text-gray-500 text-sm">Vul het formulier in en we nemen zo snel mogelijk contact met je op.</p>
          </div>
          <button type="button" onClick={fillRandom}
            className="shrink-0 px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            🎲 Random
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naam <span className="text-red-500">*</span></label>
            <input name="naam" type="text" placeholder="Jan de Vries" autoComplete="name"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white ${errors.naam ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.naam && <p className="text-red-500 text-xs mt-1">{errors.naam}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mailadres <span className="text-red-500">*</span></label>
            <input name="email" type="email" placeholder="jan@bedrijf.nl" autoComplete="email"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white ${errors.email ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
            <input name="telefoon" type="tel" placeholder="+31 6 12345678" autoComplete="tel"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijf</label>
            <input name="bedrijf" type="text" placeholder="Bedrijf B.V." autoComplete="organization"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hoe heeft u ons gevonden? <span className="text-red-500">*</span></label>
            <select name="bron" defaultValue=""
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white ${errors.bron ? 'border-red-400' : 'border-gray-200'}`}>
              <option value="" disabled>Selecteer een optie</option>
              <option>Google / Zoekmachine</option>
              <option>LinkedIn</option>
              <option>Aanbeveling</option>
              <option>Social media</option>
              <option>Anders</option>
            </select>
            {errors.bron && <p className="text-red-500 text-xs mt-1">{errors.bron}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bericht <span className="text-red-500">*</span></label>
            <textarea name="bericht" rows={4} placeholder="Hoe kunnen we je helpen?"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-y ${errors.bericht ? 'border-red-400' : 'border-gray-200'}`} />
            {errors.bericht && <p className="text-red-500 text-xs mt-1">{errors.bericht}</p>}
          </div>

          {/* Honeypot */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              <strong className="block font-medium">Er ging iets mis.</strong>
              {errorMsg}
            </div>
          )}

          <button type="submit" disabled={status === 'loading'}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
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
