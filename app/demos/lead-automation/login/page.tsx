'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLogin() {
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [laden, setLaden] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFout('')
    setLaden(true)

    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wachtwoord }),
      })

      if (res.ok) {
        router.push('/demos/lead-automation/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setFout(data.error || 'Inloggen mislukt')
      }
    } catch {
      setFout('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLaden(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0A0B0F' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: '#12141A',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}
          >
            R
          </div>
          <h1
            className="text-xl font-bold text-white font-bricolage"
            style={{ letterSpacing: '-0.02em' }}
          >
            Dashboard Login
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5A5E82' }}>
            Voer het wachtwoord in om toegang te krijgen
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="wachtwoord"
            className="block text-xs uppercase tracking-widest mb-2"
            style={{ color: '#5A5E82' }}
          >
            Wachtwoord
          </label>
          <input
            id="wachtwoord"
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = 'rgba(91,110,245,0.5)')
            }
            onBlur={(e) =>
              (e.target.style.borderColor = 'rgba(255,255,255,0.1)')
            }
            placeholder="••••••••"
          />

          {fout && (
            <p className="text-sm mt-3" style={{ color: '#ef4444' }}>
              {fout}
            </p>
          )}

          <button
            type="submit"
            disabled={laden}
            className="w-full mt-6 rounded-lg py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: '#5B6EF5' }}
          >
            {laden ? 'Bezig...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  )
}
