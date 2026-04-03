import Link from 'next/link'
import { Metadata } from 'next'
import { posts } from './posts'
import Footer from '../components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog — Runvex',
  description:
    'Praktische artikelen over lead opvolging, AI automatisering en groei voor MKB. Leer hoe je meer haalt uit elke lead.',
}

const categoryColors: Record<string, string> = {
  Strategie: 'rgba(62,207,142,0.12)',
  'AI & Technologie': 'rgba(91,110,245,0.12)',
  Groei: 'rgba(245,166,35,0.12)',
}
const categoryText: Record<string, string> = {
  Strategie: '#3ECF8E',
  'AI & Technologie': '#5B6EF5',
  Groei: '#F5A623',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
            style={{ color: 'var(--text-3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug naar home
          </Link>

          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{
              background: 'rgba(91,110,245,0.1)',
              border: '1px solid rgba(91,110,245,0.2)',
              color: '#5B6EF5',
            }}
          >
            Blog & Kennisbank
          </div>
          <h1
            className="font-bricolage font-extrabold text-4xl md:text-5xl text-white mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Meer halen uit elke lead
          </h1>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-2)', maxWidth: 520 }}>
            Praktische artikelen over lead opvolging, AI automatisering en slimmer groeien als MKB.
          </p>
        </div>

        {/* Posts grid */}
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-2 gap-6">
            {sorted.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl p-6 transition-all duration-200 bg-[var(--bg-2)] border border-[var(--border)] hover:bg-[rgba(91,110,245,0.04)] hover:border-[rgba(91,110,245,0.35)]"
              >
                {/* Category + read time */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: categoryColors[post.category] ?? 'rgba(91,110,245,0.1)',
                      color: categoryText[post.category] ?? '#5B6EF5',
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                    {post.readTime} lezen
                  </span>
                </div>

                <h2
                  className="font-bricolage font-bold text-lg text-white mb-3 group-hover:text-[#5B6EF5] transition-colors"
                  style={{ letterSpacing: '-0.01em', lineHeight: 1.3 }}
                >
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-2)' }}>
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                    {formatDate(post.date)}
                  </span>
                  <span
                    className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ color: '#5B6EF5' }}
                  >
                    Lees verder
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
