'use client'

import { FormData } from './BookingFlow'

interface Step1FormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
}

export default function Step1Form({ formData, onChange, onNext }: Step1FormProps) {
  const canProceed =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)

  return (
    <div className="space-y-5">
      {/* Naam */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#8A8FA8' }}
        >
          Naam *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Je volledige naam"
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none transition-colors"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#8A8FA8' }}
        >
          E-mailadres *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="naam@bedrijf.nl"
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none transition-colors"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* Telefoon */}
      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#8A8FA8' }}
        >
          Telefoonnummer
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+31 6 12345678"
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none transition-colors"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* Bedrijf */}
      <div>
        <label
          htmlFor="company"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#8A8FA8' }}
        >
          Bedrijfsnaam
        </label>
        <input
          id="company"
          type="text"
          value={formData.company}
          onChange={(e) => onChange({ company: e.target.value })}
          placeholder="Je bedrijfsnaam"
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none transition-colors"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* Dienst */}
      <div>
        <label
          htmlFor="service"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#8A8FA8' }}
        >
          Gewenste dienst
        </label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => onChange({ service: e.target.value })}
          className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-colors appearance-none"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.08)',
            color: formData.service ? '#ffffff' : '#5A5E82',
          }}
        >
          <option value="" disabled>Selecteer een dienst</option>
          <option value="lead-automation">Lead Automation</option>
          <option value="ai-scoring">AI Lead Scoring</option>
          <option value="crm-integratie">CRM Integratie</option>
          <option value="adviesgesprek">Adviesgesprek</option>
        </select>
      </div>

      {/* Bericht */}
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#8A8FA8' }}
        >
          Bericht
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => onChange({ message: e.target.value })}
          placeholder="Vertel kort waar je naar zoekt..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none transition-colors resize-none"
          style={{
            background: '#12141A',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="w-full bg-[#5B6EF5] hover:bg-[#4B5EE5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Kies een datum
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}