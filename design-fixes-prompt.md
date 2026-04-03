# Claude Code Prompt — Runvex.app Design Fixes

Kopieer onderstaande prompt en plak hem direct in Claude Code vanuit de root van het project.

---

## PROMPT

Ik wil een aantal design- en UX-problemen oplossen op de Runvex landing page (`/`). Analyseer eerst de relevante bestanden in `app/` voordat je wijzigingen maakt. Hieronder staan de issues op prioriteit, met concrete instructies per fix.

---

### 🔴 KRITIEK — Fix direct

**1. Stats-counters tonen "0+" / "0%" / "< 0 min"**

De animerende counters in de stats-sectie laden niet correct in productie. Dit staat direct onder de hero en ondermijnt het vertrouwen, zeker omdat de marquee-balk eronder wél echte getallen toont ("142+ leads verwerkt").

- Zoek de counter-animatie component (waarschijnlijk een `useEffect` met een `IntersectionObserver` of een counting library).
- Voeg een hardcoded fallback-waarde toe die getoond wordt zolang de animatie niet actief is (`142+`, `94%`, `< 3 min`).
- Zorg dat de counters op de juiste eindwaarden uitkomen en deze waarden consistent zijn met de marquee-balk eronder.

---

### 🟡 MATIG — Tweede prioriteit

**2. Hero-afbeelding: landschap vervangen door product-context**

De tilted kaart in de hero toont momenteel een generieke landschapsfoto (bergen/bomen). Dit heeft geen visuele relatie met lead automation.

- Vervang de `<img>` of `background-image` in de hero-card door een screenshot of mockup van het Runvex dashboard.
- Als er geen dashboardafbeelding beschikbaar is, gebruik dan een placeholder met `bg-gradient-to-br from-[#5B4FE8] to-[#0C0C28]` en een icoon, totdat een echte screenshot beschikbaar is.
- Zorg dat de tilt-/perspectief-animatie behouden blijft.

**3. Rode statustekst rechtsbovenin de hero**

De tekst "LEADS VERWERKT: =" en "RESPONSE TIME: < 3 SEC" zijn gestyled in rood/oranje, wat een foutmelding suggereert.

- Verander de kleur naar `text-[#5B4FE8]` (paars, de bestaande accentkleur) of `text-white/60`.
- Zorg dat de waarde naast "LEADS VERWERKT:" de echte of hardcoded waarde toont (bijv. `142`) in plaats van `=`.

**4. "JC" placeholder in de About-sectie**

De oprichterfoto is een donkere card met enkel de initialen "JC". Dit verzwakt het persoonlijke verhaal van "gebouwd door een ondernemer, voor ondernemers."

- Voeg een `<img>` toe met een echte oprichterfoto zodra die beschikbaar is.
- Maak de card in de tussentijd visueel sterker: voeg een subtiele paarse border toe (`border border-[#5B4FE8]/40`) en vergroot de initialen met een `text-5xl font-bold text-[#5B4FE8]`.

---

### 🟢 LICHT — Derde prioriteit

**5. Tekstcontrast in feature-cards**

De beschrijvende tekst in de kleine feature-tiles ("Realtime dashboard", "Directe Slack alerts", etc.) heeft een te lage contrast-ratio op de donkere achtergrond.

- Verhoog de tekstkleur van body-tekst in deze cards van de huidige grijstint naar minimaal `text-white/70` om WCAG AA te benaderen.
- Controleer ook de beschrijvende tekst in de twee grote feature-blokken ("Claude AI scoort elke lead automatisch" en "Nooit meer handmatig opvolgen").

**6. Zwevende "Probeer demo's" knop**

Deze sticky knop rechtsonder concurreert met de hero-CTA's, wat keuzestress geeft boven de fold.

- Verberg de knop totdat de gebruiker voorbij de hero-sectie heeft gescrolld (gebruik een `IntersectionObserver` op de hero of een scroll-y threshold van bijv. `window.scrollY > 600`).
- Voeg een `transition-opacity duration-300` toe voor een vloeiende fade-in.

---

### Technische context

- Dit is een **Next.js App Router** project. De landing page staat in `app/page.tsx` (of vergelijkbaar). Componenten zitten in `app/components/`.
- Het kleurpalet: achtergrond `#07071A` / `#0C0C28`, accent `#5B4FE8`, bodytekst `#8B8FB3`.
- Gebruik geen externe libraries die nog niet in `package.json` staan.
- Test lokaal met `npm run dev` na elke wijziging.
- Maak geen wijzigingen aan API-routes, database-logica of de n8n-integratie.
