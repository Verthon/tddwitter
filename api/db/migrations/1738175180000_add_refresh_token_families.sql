-- Up Migration
ALTER TABLE refresh_tokens
  ADD COLUMN family_id UUID NOT NULL,
  ADD COLUMN rotated_at TIMESTAMPTZ NULL;
CREATE INDEX idx_refresh_tokens_family_id ON refresh_tokens(family_id);
COMMENT ON TABLE refresh_tokens IS '30-day refresh tokens - one family per login, rotated with reuse detection';

-- Down Migration
DROP INDEX IF EXISTS idx_refresh_tokens_family_id;
ALTER TABLE refresh_tokens
  DROP COLUMN IF EXISTS rotated_at,
  DROP COLUMN IF EXISTS family_id;
COMMENT ON TABLE refresh_tokens IS 'Active 30-day sessions - single session per account';
