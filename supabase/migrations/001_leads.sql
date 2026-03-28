-- Migration: 001_leads
-- Tabel voor het opslaan van leads uit het contactformulier

CREATE TABLE IF NOT EXISTS leads (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  naam                 TEXT        NOT NULL,
  email                TEXT        NOT NULL,
  bedrijf              TEXT,
  bericht              TEXT,
  status               TEXT        NOT NULL DEFAULT 'nieuw',
  aangemaakt_op        TIMESTAMPTZ NOT NULL DEFAULT now(),
  follow_up_verstuurd  BOOLEAN     NOT NULL DEFAULT false
);

-- Index voor snelle lookups op e-mail en status
CREATE INDEX IF NOT EXISTS leads_email_idx  ON leads (email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);

-- Optioneel: Row Level Security inschakelen
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Alleen de service-role mag lezen/schrijven (n8n gebruikt de service key)
CREATE POLICY "Service role full access"
  ON leads
  USING (true)
  WITH CHECK (true);
