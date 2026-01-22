-- Migration: 001_create_posts_table
-- Description: Creates the posts table for storing user posts/tweets

CREATE TABLE IF NOT EXISTS posts (
  id            bigserial PRIMARY KEY,
  public_id     text NOT NULL UNIQUE,
  username      text NOT NULL,
  content       text NOT NULL,
  avatar_url    text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
