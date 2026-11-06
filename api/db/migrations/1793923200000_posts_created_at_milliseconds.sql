-- Up Migration
ALTER TABLE posts
  ALTER COLUMN created_at TYPE TIMESTAMPTZ(3);

-- Down Migration
ALTER TABLE posts
  ALTER COLUMN created_at TYPE TIMESTAMPTZ;
