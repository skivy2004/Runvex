import Link from 'next/link'
import Sidebar from './components/Sidebar'
import LogoutButton from './components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0A0B0F' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 shrink-0"
          style={{
            height: 56,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: '#0A0B0F',
          }}
        >
          <p className="text-sm" style={{ color: '#5A5E82' }}>
            Dashboard{' '}
            <span style={{ color: '#2D3047' }}>/ </span>
            <span style={{ color: '#8A8FA8' }}>Overzicht</span>
          </p>

          <div className="flex items-center gap-2">
            {/* Bell */}
            <button
              className="relative w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <svg width="16" height="16" fill="none" stroke="#8A8FA8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold text-white"
                style={{ background: '#5B6EF5', fontSize: 9 }}
              >2</span>
            </button>

            {/* User chip → homepage */}
            <Link
              href="/"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}
              >R</div>
              <div className="hidden sm:block leading-none">
                <p className="text-xs font-medium text-white">Runvex</p>
                <p className="text-xs mt-0.5" style={{ color: '#5A5E82' }}>admin</p>
              </div>
            </Link>

            <LogoutButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
