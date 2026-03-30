'use client'

import { useEffect, useState } from 'react'
import { FormData } from './BookingFlow'

interface Step2CalendarProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onNext: () => void
  onBack: () => void
  isSubmitting: boolean
}

interface AvailabilityData {
  dates: Record<string, string[]>
}

const DUTCH_MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

const DUTCH_DAY_HEADERS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

// Returns 0=Mon ... 6=Sun offset for first day of month
function getFirstDayOffset(year: number, month: number): number {
  const jsDay = new Date(year, month, 1).getDay() // 0=Sun
  return jsDay === 0 ? 6 : jsDay - 1
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

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

export default function Step2Calendar({
  formData,
  onChange,
  onNext,
  onBack,
  isSubmitting,
}: Step2CalendarProps) {
  const [availability, setAvailability] = useState<AvailabilityData | null>(null)
  const [loadingAvail, setLoadingAvail] = useState(true)
  const [availError, setAvailError] = useState<string | null>(null)

  const todayUtc = new Date()
  const [viewYear, setViewYear] = useState(
    parseInt(new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric' }), 10)
  )
  const [viewMonth, setViewMonth] = useState(
    parseInt(new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam', month: 'numeric' }), 10) - 1
  )

  useEffect(() => {
    setLoadingAvail(true)
    fetch('/api/booking/availability')
      .then((r) => r.json())
      .then((data: AvailabilityData) => {
        setAvailability(data)
        setLoadingAvail(false)
      })
      .catch(() => {
        setAvailError('Beschikbaarheid kon niet worden geladen.')
        setLoadingAvail(false)
      })
  }, [])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDayOffset = getFirstDayOffset(viewYear, viewMonth)

  const availableDates = new Set(availability ? Object.keys(availability.dates) : [])

  const todayStr = todayUtc.toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam' })

  const canGoPrev = !(viewYear === todayUtc.getFullYear() && viewMonth === todayUtc.getMonth())

  const handlePrevMonth = () => {
    if (!canGoPrev) return
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const handleDayClick = (dateStr: string) => {
    if (!availableDates.has(dateStr)) return
    onChange({ date: dateStr, time: '' })
  }

  const handleTimeClick = (time: string) => {
    onChange({ time })
  }

  const selectedDateSlots =
    formData.date && availability?.dates[formData.date]
      ? availability.dates[formData.date]
      : []

  const canConfirm = !!formData.date && !!formData.time

  // Build calendar grid cells (null = empty padding cell)
  const cells: (number | null)[] = [
    ...Array<null>(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div
        className="rounded-2xl p-5"
        style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-20"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="font-bricolage font-semibold text-white text-sm">
            {DUTCH_MONTHS[viewMonth]} {viewYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DUTCH_DAY_HEADERS.map((d) => (
            <div key={d} className="text-center text-xs font-medium py-1" style={{ color: '#5A5E82' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {loadingAvail ? (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              />
            ))}
          </div>
        ) : availError ? (
          <p className="text-center text-sm py-6" style={{ color: '#FF6B6B' }}>{availError}</p>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />
              }

              const dateStr = formatDateStr(viewYear, viewMonth, day)
              const isAvailable = availableDates.has(dateStr)
              const isSelected = formData.date === dateStr
              const isPast = dateStr < todayStr

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={!isAvailable || isPast}
                  onClick={() => handleDayClick(dateStr)}
                  className="aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all"
                  style={{
                    background: isSelected
                      ? '#5B6EF5'
                      : isAvailable
                      ? 'rgba(91,110,245,0.1)'
                      : 'transparent',
                    color: isSelected
                      ? '#ffffff'
                      : isAvailable
                      ? '#ffffff'
                      : isPast
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.2)',
                    border: isSelected
                      ? '1px solid #5B6EF5'
                      : isAvailable
                      ? '1px solid rgba(91,110,245,0.25)'
                      : '1px solid transparent',
                    cursor: isAvailable && !isPast ? 'pointer' : 'default',
                  }}
                >
                  {day}
                </button>
              )
            })}
          </div>
        )}

        <p className="mt-3 text-xs text-center" style={{ color: '#5A5E82' }}>
          Tijdzone: Europa/Amsterdam
        </p>
      </div>

      {/* Time slots */}
      {formData.date && (
        <div
          className="rounded-2xl p-5"
          style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-sm font-medium text-white mb-3">
            Beschikbare tijden op{' '}
            <span style={{ color: '#5B6EF5' }}>
              {new Date(formData.date + 'T12:00:00Z').toLocaleDateString('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                timeZone: 'Europe/Amsterdam',
              })}
            </span>
          </p>

          {selectedDateSlots.length === 0 ? (
            <p className="text-sm" style={{ color: '#8A8FA8' }}>
              Geen beschikbare tijden op deze dag.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {selectedDateSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleTimeClick(slot)}
                  className="py-2 px-3 rounded-lg text-sm font-medium transition-all text-center"
                  style={{
                    background:
                      formData.time === slot ? '#5B6EF5' : 'rgba(255,255,255,0.05)',
                    color: formData.time === slot ? '#ffffff' : '#8A8FA8',
                    border:
                      formData.time === slot
                        ? '1px solid #5B6EF5'
                        : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected summary */}
      {canConfirm && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.2)' }}
        >
          <span style={{ color: '#A99FF5' }}>
            Gekozen: {formatDutchDate(formData.date, formData.time)}
          </span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#8A8FA8',
          }}
        >
          ← Terug
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canConfirm || isSubmitting}
          className="flex-[2] bg-[#5B6EF5] hover:bg-[#4B5EE5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.3" />
                <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
              </svg>
              Bezig...
            </>
          ) : (
            <>
              Bevestig boeking
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
