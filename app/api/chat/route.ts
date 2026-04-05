import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getIp, tooManyRequests } from '@/app/lib/rate-limit'

export const dynamic = 'force-dynamic'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Je bent een vriendelijke salesassistent voor Runvex, een AI-gedreven lead automation platform.

Je doel is bezoekers te helpen ontdekken of Runvex bij hen past. Stel maximaal 3-4 gerichte vragen en leid ze dan naar het contactformulier.

Gedraag je als volgt:
- Begin altijd met: "Hoeveel leads krijg jij per maand?"
- Stel korte, concrete vragen over: aantal leads/maand, tijd die ze kwijt zijn aan opvolging, hun sector
- Geef na 2-3 antwoorden een kort persoonlijk advies over hoe Runvex kan helpen
- Sluit af met: "Wil je een gratis demo? Ik kan het formulier alvast voor je invullen."
- Als ze ja zeggen, vraag naam + email en stuur: ACTION:FILL_FORM:naam=...,email=...

Houd antwoorden kort (max 2 zinnen). Spreek Nederlands. Wees warm en direct, niet salesy.`

export async function POST(req: NextRequest) {
  if (!rateLimit(`chat:${getIp(req)}`, 20, 60 * 1000)) return tooManyRequests()

  const { messages } = await req.json()
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 })
  }
  if (messages.length > 50) {
    return NextResponse.json({ error: 'Te veel berichten' }, { status: 400 })
  }

  // Validate roles at runtime to prevent prompt injection
  const VALID_ROLES = new Set(['user', 'assistant'])
  const safeMessages = messages
    .filter((m: unknown) => {
      if (!m || typeof m !== 'object') return false
      const msg = m as Record<string, unknown>
      return VALID_ROLES.has(msg.role as string) && typeof msg.content === 'string'
    })
    .map((m: Record<string, unknown>) => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content).slice(0, 2000),
    }))

  if (safeMessages.length === 0) {
    return NextResponse.json({ error: 'Geen geldige berichten' }, { status: 400 })
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: safeMessages,
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ message: text })
}
