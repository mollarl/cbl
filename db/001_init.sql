-- Community Builders LATAM / Neon PostgreSQL
-- Ejecutar una vez en el SQL Editor de Neon antes de publicar en Vercel.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  linkedin_url TEXT,
  whatsapp TEXT NOT NULL,
  role TEXT,
  community_experience TEXT,
  community_type TEXT,
  community_age TEXT,
  participant_count TEXT,
  work_mode TEXT,
  previous_experience TEXT,
  main_challenge TEXT,
  motivation TEXT,
  contribution TEXT,
  expectations TEXT,
  topics TEXT,
  image_consent BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS candidates_created_at_idx ON candidates (created_at DESC);
CREATE INDEX IF NOT EXISTS candidates_status_idx ON candidates (status);
CREATE UNIQUE INDEX IF NOT EXISTS candidates_email_unique_idx ON candidates (LOWER(email));
