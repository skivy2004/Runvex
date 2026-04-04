import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

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
  const { messages } = await req.json()
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 })
  }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ message: text })
}
