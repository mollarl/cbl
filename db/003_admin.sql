BEGIN;

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (email = lower(btrim(email))),
  password_hash TEXT,
  activation_hash TEXT,
  activation_expires_at TIMESTAMPTZ,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  login_attempts INTEGER NOT NULL DEFAULT 0,
  login_window_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions (expires_at);

INSERT INTO admin_users (email)
VALUES ('mariapia.delafuente@gmail.com')
ON CONFLICT (email) DO NOTHING;

COMMIT;
