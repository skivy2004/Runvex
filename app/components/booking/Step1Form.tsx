'use client'

import { FormData } from './BookingFlow'

interface Step1FormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
}

const inputClass =
  'w-full bg-[#12141A] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-[#8A8FA8] focus:outline-none focus:border-[#5B6EF5] transition-colors text-sm'

const labelClass = 'block text-sm font-medium text-white/70 mb-1.5'

const services = [
  'Lead Automatisering',
  'E-mail Marketing Automatisering',
  'CRM Integratie',
  'AI-gestuurde Workflows',
  'Anders',
]

const testData = {
  name: 'Jeremy Cordes',
  email: 'jeremycordes31@gmail.com',
  phone: '+31 6 12345678',
  company: 'Runvex',
  service: 'Lead Automatisering',
  message: 'Ik wil graag een discovery call inplannen om de mogelijkheden van lead automatisering te bespreken.',
}

export default function Step1Form({ formData, onChange, onNext }: Step1FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onChange(testData)}
          className="text-xs text-[#8A8FA8] hover:text-[#5B6EF5] transition-colors px-2 py-1 rounded border border-white/[0.06] hover:border-[#5B6EF5]/40"
        >
          Testdata invullen
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Naam *</label>
          <input
            type="text"
            required
            placeholder="Jan de Vries"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>E-mail *</label>
          <input
            type="email"
            required
            placeholder="jan@bedrijf.nl"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Telefoonnummer</label>
          <input
            type="tel"
            placeholder="+31 6 12345678"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Bedrijfsnaam *</label>
          <input
            type="text"
            required
            placeholder="Jouw Bedrijf B.V."
            value={formData.company}
            onChange={(e) => onChange({ company: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Dienst *</label>
        <select
          required
          value={formData.service}
          onChange={(e) => onChange({ service: e.target.value })}
          className={`${inputClass} appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8FA8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px center',
            paddingRight: '40px',
          }}
        >
          <option value="" disabled>Selecteer een dienst...</option>
          {services.map((s) => (
            <option key={s} value={s} style={{ background: '#12141A' }}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Jouw vraag of project *</label>
        <textarea
          required
          rows={4}
          placeholder="Vertel ons kort over jouw project of vraag..."
          value={formData.message}
          onChange={(e) => onChange({ message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#5B6EF5] hover:bg-[#4B5EE5] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Kies een tijdstip
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  )
}
