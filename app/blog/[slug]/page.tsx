import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { posts, getPost } from '../posts'
import Footer from '../../components/layout/Footer'

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Runvex Blog`,
    description: post.description,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Simple markdown-like renderer (headings, bold, lists, horizontal rules)
function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={key++}
          className="font-bricolage font-bold text-2xl text-white mt-10 mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="font-bricolage font-semibold text-lg text-white mt-6 mb-2">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('---')) {
      elements.push(<hr key={key++} className="my-8" style={{ borderColor: 'var(--border)' }} />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Collect all list items
      const items: string[] = []
      let j = i
      while (j < lines.length && (lines[j].startsWith('- ') || lines[j].startsWith('* '))) {
        items.push(lines[j].slice(2))
        j++
      }
      elements.push(
        <ul key={key++} className="my-4 space-y-2 pl-0">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-2)' }}>
              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#5B6EF5]" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
      i = j - 1
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={key++}
          className="my-6 pl-5 py-1 italic text-sm"
          style={{
            borderLeft: '3px solid rgba(91,110,245,0.5)',
            color: 'var(--text-2)',
          }}
        >
          {line.slice(2)}
        </blockquote>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2" />)
    } else {
      elements.push(
        <p
          key={key++}
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-2)' }}
        >
          {renderInline(line)}
        </p>
      )
    }
  }
  return elements
}

function renderInline(text: string): React.ReactNode[] {
  // Split text into tokens: bold (**...**), italic (*...*), code (`...`), and plain text
  const tokens: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index))
    }

    if (match[1] !== undefined) {
      // Bold: **text**
      tokens.push(
        <strong key={key++} style={{ color: 'white', fontWeight: 600 }}>
          {match[1]}
        </strong>
      )
    } else if (match[2] !== undefined) {
      // Italic: *text*
      tokens.push(<em key={key++}>{match[2]}</em>)
    } else if (match[3] !== undefined) {
      // Code: `text`
      tokens.push(
        <code
          key={key++}
          style={{
            background: 'rgba(91,110,245,0.15)',
            color: '#5B6EF5',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.85em',
          }}
        >
          {match[3]}
        </code>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex))
  }

  return tokens
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const otherPosts = posts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      <main style={{ background: '#0A0B0F', minHeight: '100vh' }}>
        <div className="max-w-2xl mx-auto px-6 pt-24 pb-20">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-10 transition-colors"
            style={{ color: 'var(--text-3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Terug naar blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(91,110,245,0.1)', color: '#5B6EF5' }}
            >
              {post.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-3)' }}>
              {post.readTime} lezen · {formatDate(post.date)}
            </span>
          </div>

          <h1
            className="font-bricolage font-extrabold text-3xl md:text-4xl text-white mb-6"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            {post.title}
          </h1>
          <p className="text-base mb-10 pb-10" style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--border)' }}>
            {post.description}
          </p>

          {/* Content */}
          <div className="space-y-1">{renderContent(post.content)}</div>

          {/* CTA */}
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(91,110,245,0.12) 0%, rgba(91,110,245,0.04) 100%)',
              border: '1px solid rgba(91,110,245,0.25)',
            }}
          >
            <div className="text-sm font-semibold text-white mb-2">Klaar om het zelf uit te proberen?</div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
              Runvex automatiseert je volledige leadproces — scoring, follow-ups en dashboard.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'var(--purple)' }}
            >
              Start gratis
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* More posts */}
        {otherPosts.length > 0 && (
          <div className="max-w-2xl mx-auto px-6 pb-24">
            <div className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: 'var(--text-3)' }}>
              Meer lezen
            </div>
            <div className="grid gap-4">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="flex items-center justify-between rounded-xl p-4 transition-colors bg-[var(--bg-2)] border border-[var(--border)] hover:border-[rgba(91,110,245,0.3)]"
                >
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{p.title}</div>
                    <div className="text-xs" style={{ color: 'var(--text-3)' }}>
                      {p.readTime} lezen · {p.category}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: '#5B6EF5' }}>
                    <path d="M6 3.5L10 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
