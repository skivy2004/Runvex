'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/dashboard/auth', { method: 'DELETE' })
    router.push('/demos/lead-automation/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      title="Uitloggen"
    >
      <svg width="16" height="16" fill="none" stroke="#8A8FA8" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  )
}
