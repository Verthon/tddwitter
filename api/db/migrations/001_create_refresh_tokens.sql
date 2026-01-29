CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_account_id ON refresh_tokens(account_id);

COMMENT ON TABLE refresh_tokens IS 'Active 30-day sessions - single session per account';