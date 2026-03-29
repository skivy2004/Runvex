-- Nieuwe velden voor AI scoring en extra formuliervelden
ALTER TABLE leads ADD COLUMN IF NOT EXISTS bron        TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS telefoon    TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score    TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_sector   TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_samenvatting TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_prioriteit  INTEGER;
