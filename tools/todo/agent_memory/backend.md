# backend memory

*Nog geen notities.*

## 2026-04-06 11:55
De fix voor taak `b77c1b9e` (vervangen van `Buffer.from(...)` door `btoa(...)` in `app/middleware.ts`) vereist handmatige uitvoering door de gebruiker omdat het bestand lokaal niet bereikt kon worden voor de edit-tool.

## 2026-04-06 12:17
* **Security Fix:** De API `/api/leads/behandeld` is versterkt met een `X-Admin-Secret` header check en robuuste, generieke foutafhandeling om interne Supabase foutdetails te maskeren.
* **Config:** De `ADMIN_SECRET_LEADS_UPDATE` secret is toegevoegd aan de lokale `.env.local` om deze beveiligingsmaatregel te ondersteunen.

## 2026-04-06 12:29
De beveiliging van `/api/chat` en `/api/leads/behandeld` zijn versterkt door het verplichten van een `X-Dashboard-Secret` header check en het maskeren van interne DB foutmeldingen, respectievelijk de implementatie van de juiste authentieke checks.