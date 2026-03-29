'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ACCENT = '#5B6EF5'

function IconGrid() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function IconSparkle() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}
function IconBolt() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
function IconCog() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

const SECTIONS = [
  {
    group: 'ALGEMEEN',
    items: [
      { label: 'Overzicht', href: '/dashboard', icon: <IconGrid /> },
      { label: 'Leads', href: '/dashboard', icon: <IconUsers /> },
    ],
  },
  {
    group: 'TOOLS',
    items: [
      { label: 'AI Insights', href: '/dashboard', icon: <IconSparkle />, badge: '2' },
      { label: 'Automatisering', href: '/dashboard', icon: <IconBolt /> },
    ],
  },
  {
    group: 'OVERIG',
    items: [
      { label: 'Contactformulier', href: '/contact', icon: <IconMail /> },
      { label: 'Instellingen', href: '/dashboard', icon: <IconCog /> },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: 240,
        background: '#0D0E16',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 shrink-0"
        style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#5B6EF5,#7B6FF0)' }}
        >R</div>
        <span className="font-bricolage font-bold text-white text-base tracking-tight">Runvex</span>
      </div>

      {/* Search */}
      <div className="px-3 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <svg width="13" height="13" fill="none" stroke="#5A5E82" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs flex-1" style={{ color: '#5A5E82' }}>Zoeken…</span>
          <span
            className="text-xs px-1 rounded"
            style={{ color: '#3A3D50', border: '1px solid rgba(255,255,255,0.08)' }}
          >/</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {SECTIONS.map(({ group, items }) => (
          <div key={group}>
            <p className="text-xs font-semibold px-3 mb-1.5 tracking-wider" style={{ color: '#3A3D50' }}>
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map(({ label, href, icon, badge }) => {
                const active = pathname === href && label !== 'Leads' && label !== 'Automatisering' && label !== 'Instellingen'
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        color: active ? '#fff' : '#5A5E82',
                        background: active ? 'rgba(91,110,245,0.12)' : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                          e.currentTarget.style.color = '#8A8FA8'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#5A5E82'
                        }
                      }}
                    >
                      <span style={{ color: active ? ACCENT : 'inherit' }}>{icon}</span>
                      <span className="flex-1">{label}</span>
                      {badge && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(91,110,245,0.18)', color: ACCENT }}
                        >{badge}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer badge */}
      <div className="p-3 shrink-0">
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(91,110,245,0.08)', border: '1px solid rgba(91,110,245,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(91,110,245,0.2)' }}
            >
              <svg width="14" height="14" fill="none" stroke={ACCENT} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white">Live automatisering</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#5A5E82' }}>
            Leads worden real-time gescoord door Claude AI.
          </p>
        </div>
      </div>
    </aside>
  )
}
