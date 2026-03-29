'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const links: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'Oplossing', href: '/#hoe-het-werkt' },
    { label: 'Prijzen', href: '/#pricing' },
    { label: 'Over', href: '/#testimonials' },
    { label: 'Demo', href: '/contact' },
    { label: 'Blog', href: '/#blog' },
  ]

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: scrolled
            ? 'rgba(10,11,15,0.97)'
            : 'rgba(10,11,15,0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid rgba(255,255,255,${scrolled ? 0.12 : 0})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--purple), var(--purple-2))',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 3h4.5a3.5 3.5 0 0 1 0 7H7l4 3M4 3v10"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="font-bricolage text-base font-semibold text-white"
              style={{ letterSpacing: '-0.01em' }}
            >
              runvex
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-150"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = 'var(--text)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = 'var(--text-2)')
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-150"
              style={{ background: 'var(--purple)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--purple-2)'
                e.currentTarget.style.transform = 'translateX(1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--purple)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              Log in
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-150"
              >
                <path
                  d="M5.25 3.5L8.75 7L5.25 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span
                className="block w-5 h-[1.5px] rounded-full bg-white transition-all duration-200"
                style={{
                  transform: mobileOpen
                    ? 'rotate(45deg) translateY(4.5px)'
                    : 'none',
                }}
              />
              <span
                className="block w-5 h-[1.5px] rounded-full bg-white transition-all duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-[1.5px] rounded-full bg-white transition-all duration-200"
                style={{
                  transform: mobileOpen
                    ? 'rotate(-45deg) translateY(-4.5px)'
                    : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 pt-16"
          style={{
            background: 'rgba(10,11,15,0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex flex-col items-center gap-6 py-12">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-medium"
                style={{ color: 'var(--text-2)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="mt-4 px-6 py-3 rounded-lg text-sm font-medium text-white"
              style={{ background: 'var(--purple)' }}
              onClick={() => setMobileOpen(false)}
            >
              Log in →
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
