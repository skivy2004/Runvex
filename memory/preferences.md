# Preferences & Conventions

## Deployment
- "push to Vercel" = `git add` → `git commit` → `git push origin main`
- Vercel auto-deploys from GitHub `skivy2004/Runvex`, main branch
- No manual `vercel deploy` needed

## Code style
- TypeScript, Next.js App Router (never Pages Router)
- Inline styles preferred over new Tailwind classes for one-off values
- Dark theme only — no light sections anywhere
- Dutch variable names + UI copy throughout

## Design system (exact values to use)
```
Background:  #0A0B0F (page), #12141A (cards), #1A1C24 (elevated)
Accent:      #5B6EF5 (purple CTA), rgba(91,110,245,X) for alpha variants
Text:        #FFFFFF (primary), #8A8FA8 (muted), #5A5E82 (very muted/labels)
Border:      rgba(255,255,255,0.06) normal, rgba(255,255,255,0.12) hover
Success:     #3ECF8E
Warning:     #ECB22E
Error:       #E8507A
```
- Headlines: `font-bricolage font-extrabold`, `letterSpacing: '-0.02em'`
- Cards: `background: #12141A`, `border: 1px solid rgba(255,255,255,0.06)`, `rounded-xl`
- Primary button: `background: #5B6EF5`, white text
- Ghost button: `border: 1px solid rgba(255,255,255,0.15)`, transparent bg

## Path aliases
- `@/*` maps to `./` (root) — so imports are `@/app/...` not `@/...`

## n8n quirks (hardcoded, always apply)
- `responseMode: "responseNode"` not `"lastNode"` for Respond to Webhook
- POST body sits in `.body`: `$input.first().json.body || $input.first().json`
- `$env.XYZ` is unreliable — prefer a Code node to extract data first
- Use `"primary"` as Google Calendar ID
- Two webhooks in one workflow → "Unused Respond to Webhook" error → split into separate workflows

## Rate limiting
- All API routes have in-memory sliding window limits (see `app/lib/rate-limit.ts`)
- Serverless caveat: per warm instance; use Upstash Redis for true multi-instance limiting

## What NOT to do
- Never add `form_token` filter to dashboard queries (all leads have null token)
- Never use `revalidate = 60` on the dashboard (causes ISR caching that hides changes)
- Never add docstrings/comments to code that wasn't changed
- Never create files that aren't strictly necessary
