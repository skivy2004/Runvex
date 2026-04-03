# Architecture & Design Decisions

## Dashboard — no auth
The demo dashboard at `/demos/lead-automation/dashboard` is intentionally public.
**Why:** It's a sales demo for prospects, not a real internal tool.

## Lead filtering — bron != 'waitlist' (not form_token)
Dashboard query uses `.neq('bron', 'waitlist')` instead of `.eq('form_token', token)`.
**Why:** All leads have `form_token = null` because `NEXT_PUBLIC_FORM_TOKEN` was never set in Vercel. Token-based filtering showed zero leads.

## revalidate = 0 on dashboard
`export const revalidate = 0` — no ISR caching.
**Why:** `revalidate = 60` caused Vercel to serve stale pages for 60s after deployments, hiding visual changes during development.

## n8n as automation layer (not Next.js API)
Business logic (AI scoring, email, follow-up) lives in n8n, not in Next.js API routes.
**Why:** Visual workflow editor, easier to change without deploys, built-in scheduling.

## AI scoring via Code node prep + Claude
n8n lead scoring uses a Code node to extract webhook data into simple vars before calling Claude.
**Why:** Complex `JSON.stringify()` expressions with `$('Node').first().json.body.X` references fail silently in n8n, causing all leads to get identical fallback scores.

## Follow-up API — DB update regardless of email
`/api/leads/followup` marks `follow_up_verstuurd: true` even if Resend fails.
**Why:** `BEDRIJF_EMAIL` uses `onboarding@resend.dev` (Resend test domain) which can't send to arbitrary addresses. Failing the DB update silently broke the button.

## Demo contact page — controlled state (useState)
All form fields use `useState` not uncontrolled DOM refs.
**Why:** Checkbox toggle groups and character counters require controlled state.

## Demos are fully isolated
Each demo lives at `app/demos/<name>/` and is self-contained.
**Why:** Multiple client demos can coexist without coupling.

## SVG charts — preserveAspectRatio="none"
LeadChart uses `preserveAspectRatio="none"` to fill card width.
**Why:** With a fixed viewBox (700×180) and both width+height set, SVG would letterbox and not fill the container.

## Donut chart — R=80, stroke=16, size=196
**Why:** Smaller values (R=40) were barely visible; the donut is the focal point of the Lead Source card.
