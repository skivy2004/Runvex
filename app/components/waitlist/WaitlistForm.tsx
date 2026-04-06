'use client'

import React, { useState } from 'react'

interface WaitlistFormData {
  email: string
  naam: string
}

export function WaitlistForm() {
  const [form, setForm] = useState<WaitlistFormData>({ email: '', naam: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const canSubmit =
    form.naam.trim() !== '' &&
    form.email.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSuccess('Bedankt! We houden u op de hoogte.')
      setForm({ email: '', naam: '' })
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)', color: '#FF6B6B' }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{ background: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.25)', color: '#3ECF8E' }}
        >
          {success}
        </div>
      )}

      <div>
        <label htmlFor="naam" className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
          Naam *
        </label>
        <input
          id="naam"
          type="text"
          value={form.naam}
          onChange={(e) => setForm((f) => ({ ...f, naam: e.target.value }))}
          placeholder="Je naam"
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none"
          style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: '#8A8FA8' }}>
          E-mailadres *
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="naam@bedrijf.nl"
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-[#5A5E82] outline-none"
          style={{ background: '#12141A', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit || isLoading}
        className="w-full bg-[#5B6EF5] hover:bg-[#4B5EE5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isLoading ? 'Registreren...' : 'Aanmelden'}
      </button>
    </form>
  )
}