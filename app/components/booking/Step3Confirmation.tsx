'use client'

import { FormData } from './BookingFlow'

interface Step3ConfirmationProps {
  formData: FormData
}

const DUTCH_MONTHS_GEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

function formatDutchDate(dateStr: string, time: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  return d.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }) + ` om ${time}`
}

export default function Step3Confirmation({ formData }: Step3ConfirmationProps) {
  const formattedDate = formatDutchDate(formData.date, formData.time)

  return (
    <div className="text-center space-y-6">
      {/* Checkmark */}
      <div className="flex justify-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(62,207,142,0.12)', border: '2px solid rgba(62,207,142,0.3)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <div>
        <h3 className="font-bricolage font-bold text-white text-2xl mb-2" style={{ letterSpacing: '-0.02em' }}>
          Jouw call is ingepland!
        </h3>
        <p className="text-sm" style={{ color: '#8A8FA8' }}>
          We sturen je een bevestigingsmail naar{' '}
          <span className="text-white">{formData.email}</span>.
        </p>
      </div>

      {/* Summary card */}
      <div
        className="rounded-xl p-5 text-left space-y-3"
        style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(91,110,245,0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B6EF5" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: '#5A5E82' }}>Naam</p>
            <p className="text-sm text-white">{formData.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(91,110,245,0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B6EF5" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: '#5A5E82' }}>E-mail</p>
            <p className="text-sm text-white">{formData.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(91,110,245,0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B6EF5" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: '#5A5E82' }}>Bedrijf</p>
            <p className="text-sm text-white">{formData.company}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(91,110,245,0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B6EF5" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{ color: '#5A5E82' }}>Dienst</p>
            <p className="text-sm text-white">{formData.service}</p>
          </div>
        </div>

        <div
          className="pt-3 mt-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(62,207,142,0.12)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3ECF8E" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: '#5A5E82' }}>Datum & tijd</p>
              <p className="text-sm text-white capitalize">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <a
        href="/"
        className="block w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors text-center"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#8A8FA8',
        }}
      >
        Terug naar homepage
      </a>
    </div>
  )
}
