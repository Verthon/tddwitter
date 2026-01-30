-- Up Migration
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_accounts_email ON accounts(email);
COMMENT ON TABLE accounts IS 'Authentication only - no profile data';

-- Down Migration
DROP TABLE IF EXISTS accounts;