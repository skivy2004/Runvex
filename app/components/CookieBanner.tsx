'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  const accept = (value: string) => {
    localStorage.setItem('cookie-consent', value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div
        className="max-w-2xl mx-auto rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{
          background: '#12141A',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
        }}
      >
        <p className="text-[#8A8FA8] text-sm flex-1">
          Wij gebruiken cookies om de website te verbeteren. Lees ons{' '}
          <a href="/privacybeleid" className="text-[#5B6EF5] hover:underline">
            privacybeleid
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => accept('necessary')}
            className="text-sm text-[#8A8FA8] hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            Alleen noodzakelijk
          </button>
          <button
            onClick={() => accept('all')}
            className="text-sm text-white font-semibold px-4 py-1.5 rounded-lg bg-[#5B6EF5] hover:bg-[#4B5EE5] transition-colors"
          >
            Accepteren
          </button>
        </div>
      </div>
    </div>
  )
}
