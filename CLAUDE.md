# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
```

No lint or test scripts are configured.

## Architecture

This is a **Next.js App Router** project (not Pages Router). The app serves two purposes:
1. **Marketing site** — landing page with lead capture form (`/contact`)
2. **Lead management dashboard** — internal tool (`/dashboard`)

### Request Flow

```
Contact form → POST /api/contact → N8N_WEBHOOK_URL (n8n webhook)
                                         ↓
                                   n8n workflow:
                                   - Saves to Supabase (leads table)
                                   - Sends confirmation email (Resend)
                                   - Notifies owner (EIGENAAR_EMAIL)
                                   - 3-day auto follow-up
```

The Next.js API routes are thin proxies/wrappers — the core automation logic lives in n8n (`n8n/lead-flow.json`).

### Key Routes & Their Role

| Route | Type | Description |
|-------|------|-------------|
| `/` | `'use client'` | Marketing landing page with GSAP + Framer Motion animations |
| `/contact` | `'use client'` | Lead capture form — posts to `/api/contact` |
| `/dashboard` | Server component (60s revalidation) | Internal lead management UI |
| `/api/contact` | API route | Proxy to `N8N_WEBHOOK_URL` |
| `/api/leads/behandeld` | API route | Mark lead as handled (updates Supabase) |
| `/api/leads/followup` | API route | Trigger follow-up email via Resend |

### Database (Supabase)

Table: `leads` — schema in `supabase/migrations/001_leads.sql`

Key columns: `naam`, `email`, `bedrijf`, `bericht`, `telefoon`, `bron`, `status`, `form_token`, `ai_score`, `ai_sector`, `ai_samenvatting`, `ai_prioriteit`, `follow_up_verstuurd`, `aangemaakt_op`

- API routes that write use `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- Dashboard filters leads by `NEXT_PUBLIC_FORM_TOKEN` to scope by form instance
- RLS is enabled; service role bypasses it

### Environment Variables

See `.env.example`. Key ones:
- `N8N_WEBHOOK_URL` — required for `/api/contact` to work
- `SUPABASE_SERVICE_ROLE_KEY` — used server-side in API routes (never expose client-side)
- `NEXT_PUBLIC_FORM_TOKEN` — scopes dashboard to a specific form instance
- `RESEND_API_KEY` + `BEDRIJF_EMAIL` + `EIGENAAR_EMAIL` — email delivery

### Design System

Dark theme. Custom Tailwind colors defined in `tailwind.config.js`:
- Background: `#07071A` / `#0C0C28` / `#111130`
- Accent: `#5B4FE8` (purple)
- Body text: `#8B8FB3`

Fonts: Bricolage Grotesque (display headings) + DM Sans (body), loaded via `app/layout.tsx`.

UI components live in `app/components/ui/`, page sections in `app/components/sections/`.

### Language

UI copy and variable names are in **Dutch** (`naam` = name, `bedrijf` = company, `bericht` = message, `behandeld` = handled, `nieuw` = new, etc.). Keep this convention when adding new fields or copy.
