import Link from 'next/link'

export default function Footer() {
  const productLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Lead scoring', href: '/#hoe-het-werkt' },
    { label: 'Demo\'s', href: '/#demos' },
    { label: 'Prijzen', href: '/#pricing' },
  ]
  const companyLinks = [
    { label: 'Demo proberen', href: '/#demos' },
    { label: 'Contact', href: '/contact' },
    { label: 'Dashboard', href: '/dashboard' },
  ]
  const legalLinks = [
    { label: 'Privacybeleid', href: '#' },
    { label: 'Gebruiksvoorwaarden', href: '#' },
    { label: 'Cookie instellingen', href: '#' },
  ]

  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Column 1: Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
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
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-2)' }}>
              AI-gedreven lead management voor ambitieuze ondernemers.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                    fill="var(--text-3)"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                aria-label="X"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.87l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
                    fill="var(--text-3)"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-4 text-white">
              Product
            </div>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-4 text-white">
              Bedrijf
            </div>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-4 text-white">
              Juridisch
            </div>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: 'var(--text-3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-6 py-5"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p className="text-xs text-center" style={{ color: 'var(--text-3)' }}>
          © {new Date().getFullYear()} Runvex B.V. · Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  )
}
