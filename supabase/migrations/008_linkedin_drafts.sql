CREATE TABLE IF NOT EXISTS linkedin_drafts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_tekst text NOT NULL,
  hook text,
  onderwerp text,
  gebaseerd_op_url text,
  gebaseerd_op_likes integer,
  status text DEFAULT 'concept',
  aangemaakt_op timestamptz DEFAULT now(),
  geplaatst_op timestamptz
);

ALTER TABLE linkedin_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON linkedin_drafts
  USING (true)
  WITH CHECK (true);
