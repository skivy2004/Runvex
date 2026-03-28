# Lead Opvolging Automatisering

Een volledig geautomatiseerd lead-opvolgingssysteem gebouwd met n8n, Supabase en Resend.

**Flow:**
1. Lead vult contactformulier in
2. Lead ontvangt direct een bevestigingsmail
3. Jij ontvangt een notificatie met de leadgegevens
4. Na 3 dagen: automatische follow-up mail als de lead nog niet gereageerd heeft

---

## Vereisten

- [n8n](https://n8n.io) — lokaal geïnstalleerd en draaiend
- [Supabase](https://supabase.com) — account + project aangemaakt
- [Resend](https://resend.com) — account + geverifieerd domein
- Een tekstverwerker en browser

---

## Stap 1 — Supabase tabel aanmaken

1. Ga naar [supabase.com](https://supabase.com) en open jouw project
2. Ga naar **SQL Editor** in het linker menu
3. Plak de inhoud van `supabase/migrations/001_leads.sql` in de editor
4. Klik op **Run**

Je ziet nu een `leads` tabel onder **Table Editor**.

> **Tip:** Noteer je **Project URL** en **anon key** — te vinden onder
> *Project Settings → API*. Je hebt ze nodig in stap 3.

---

## Stap 2 — n8n workflow importeren

1. Open n8n in je browser (standaard: `http://localhost:5678`)
2. Klik op **Workflows** → **Add workflow** → **Import from file**
3. Selecteer `n8n/lead-flow.json`
4. De workflow wordt geladen met alle nodes

---

## Stap 3 — Environment variabelen invullen

### In de n8n nodes

Open elke HTTP Request node en vervang de placeholders:

| Placeholder | Waarde |
|---|---|
| `SUPABASE_URL` | jouw Supabase project URL |
| `SUPABASE_ANON_KEY` | jouw Supabase anon key |
| `RESEND_API_KEY` | jouw Resend API key |
| `EIGENAAR_EMAIL` | jouw e-mailadres voor notificaties |
| `BEDRIJF_EMAIL` | het geverifieerde "from" adres in Resend |

> **Tip voor productie:** Gebruik in n8n de ingebouwde **Credentials** om API-sleutels veilig op te slaan in plaats van ze hardcoded in te vullen.

### In het contactformulier

Open `frontend/index.html` en vervang op regel ~116:

```js
const WEBHOOK_URL = 'N8N_WEBHOOK_URL';
```

door de **Production URL** van de Webhook node in n8n, bijvoorbeeld:

```js
const WEBHOOK_URL = 'http://localhost:5678/webhook/lead-intake';
```

---

## Stap 4 — Workflow activeren

1. Klik in n8n op de **toggle** rechtsbovenin de workflow (van "Inactive" naar "Active")
2. De webhook luistert nu op `POST /webhook/lead-intake`

---

## Stap 5 — Formulier live zetten

Open `frontend/index.html` direct in je browser:

```bash
open frontend/index.html
```

Of serveer het via een lokale server:

```bash
# Python 3
python3 -m http.server 3000 --directory frontend

# Node.js (npx)
npx serve frontend
```

Ga naar `http://localhost:3000`.

---

## Stap 6 — Testen

1. Vul het contactformulier in met een e-mailadres dat jij controleert
2. Klik op **Verzenden** — je ziet de succesmelding
3. Check in Supabase → **Table Editor → leads** of de rij is aangemaakt
4. Check je inbox: je ontvangt de bevestigingsmail (lead) en de notificatie (eigenaar)
5. In n8n → **Executions** zie je de workflow run

**Follow-up testen (zonder 3 dagen te wachten):**

1. Open de workflow in n8n
2. Klik op de **Wacht: 3 Dagen** node → verander tijdelijk naar **1 minuut**
3. Stuur een testformulier in
4. Zet de wait weer terug naar 3 dagen na de test

---

## Projectstructuur

```
lead-automation/
├── supabase/
│   └── migrations/
│       └── 001_leads.sql        # SQL migratie voor de leads tabel
├── n8n/
│   └── lead-flow.json           # Importeerbare n8n workflow
├── frontend/
│   └── index.html               # Contactformulier (HTML/CSS/JS)
├── .env.example                 # Voorbeeld environment variabelen
└── README.md
```

---

## Veiligheid

- Commit nooit je `.env` of API-sleutels naar git
- Voeg `.env` toe aan je `.gitignore`
- Gebruik in productie n8n Credentials in plaats van hardcoded waarden
- Overweeg rate limiting op de webhook toe te voegen voor spam-bescherming
