-- Migration: Create hackers_club table
-- Date: 2026-06-23
-- Description: Email signup table for The Hackers Club — loyalty/community
-- membership for the "other 90%" of golfers.

CREATE TABLE IF NOT EXISTS hackers_club (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) NOT NULL,
  source varchar(100) NOT NULL DEFAULT 'homepage',
  member_number integer NOT NULL,
  discount_code varchar(20) NOT NULL DEFAULT 'HACKERS10',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint on email (prevents duplicate signups)
CREATE UNIQUE INDEX idx_hackers_club_email ON hackers_club(email);

-- Index for counting / ordering by member number
CREATE INDEX idx_hackers_club_member_number ON hackers_club(member_number);

-- Enable Row Level Security (default secure)
ALTER TABLE hackers_club ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (the signup form is public)
CREATE POLICY anon_insert ON hackers_club
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous selects (used for count endpoint)
CREATE POLICY anon_select ON hackers_club
  FOR SELECT
  TO anon
  USING (true);
