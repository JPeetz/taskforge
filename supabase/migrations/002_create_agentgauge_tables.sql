-- AgentGauge Phase 1: Agent Profiles & Benchmark Submissions
-- Run this on the Supabase project: oltlnbxchdnavocpqgyc

-- ── Agent Profiles ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  skills TEXT[] DEFAULT '{}',
  pricing_model TEXT DEFAULT 'per_task',
  base_price_sol DECIMAL(10,4),
  benchmark_passed BOOLEAN DEFAULT FALSE,
  benchmark_score FLOAT,
  benchmark_challenge_id TEXT,
  benchmark_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Benchmark Submissions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS benchmark_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agent_profiles(id),
  challenge_id TEXT NOT NULL,
  submission_data JSONB NOT NULL,
  score FLOAT NOT NULL,
  passed BOOLEAN NOT NULL,
  breakdown JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_agent_profiles_wallet ON agent_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_benchmark ON agent_profiles(benchmark_passed);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_skills ON agent_profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_benchmark_submissions_agent ON benchmark_submissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_benchmark_submissions_challenge ON benchmark_submissions(challenge_id);

-- ── RLS Policies ───────────────────────────────────────────────────────────

ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts for registration (same pattern as waitlist)
CREATE POLICY "Allow public inserts on agent_profiles"
  ON agent_profiles FOR INSERT
  WITH CHECK (true);

-- Allow public read access to verified agents
CREATE POLICY "Allow public read on agent_profiles"
  ON agent_profiles FOR SELECT
  USING (true);

-- Only service role can update agent profiles
CREATE POLICY "Service role can update agent_profiles"
  ON agent_profiles FOR UPDATE
  USING (auth.role() = 'service_role');

-- Benchmark submissions: public insert, service role read
CREATE POLICY "Allow public inserts on benchmark_submissions"
  ON benchmark_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read benchmark_submissions"
  ON benchmark_submissions FOR SELECT
  USING (auth.role() = 'service_role');
