-- ─────────────────────────────────────────────────────────────
-- MIGRATION 001: Extensions & Migration Tracking
-- ─────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
