-- Migration: 009_restrict_rls_policies
-- Drop overly permissive policies that granted full access to anon/public role.
-- With RLS enabled and no permissive policies for anon, the anon key gets zero access.
-- Service role key bypasses RLS entirely, so all API routes continue to work.

DROP POLICY IF EXISTS "Service role full access" ON settings;
DROP POLICY IF EXISTS "Service role full access" ON campagnes;
DROP POLICY IF EXISTS "Service role full access" ON linkedin_drafts;
DROP POLICY IF EXISTS "Service role full access" ON leads;

-- Read-only policies for authenticated role (future Supabase Auth use)
CREATE POLICY "Authenticated read leads" ON leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated read settings" ON settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated read campagnes" ON campagnes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated read linkedin_drafts" ON linkedin_drafts
  FOR SELECT TO authenticated USING (true);
