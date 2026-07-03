# TaskForge Landing Page — Supabase Backend Setup

## Current Status

⚠️ The only Supabase project found in this workspace (`oltlnbxchdnavocpqgyc` — RaceIntel) is **paused** due to free tier inactivity. DNS returns NXDOMAIN for both the API and database endpoints.

## Migration File

✅ Created: `supabase/migrations/001_create_waitlist.sql`

Creates:
- `waitlist` table (id, name, email, source, created_at)
- RLS enabled
- Policy: anyone can INSERT (for public waitlist form)
- Policy: only service_role can SELECT (read protection)

## Options to Proceed

### Option A: Restore RaceIntel Project (Recommended if you want to reuse)

1. Go to: https://supabase.com/dashboard/project/oltlnbxchdnavocpqgyc
2. Click "Restore project" (Free tier projects auto-pause after 7 days of inactivity)
3. Get the database password from Settings → Database
4. Update `SUPABASE_DB_PASSWORD` in `.env.local`
5. Run: `./scripts/setup.sh` to apply the migration

### Option B: Create a New Supabase Project

```bash
# 1. Login to Supabase
supabase login

# 2. Create a new project (or use the dashboard)
supabase projects create taskforge-landing --org-id <your-org-id> --db-password <password>

# 3. Link your local project to the remote
cd /Users/joergpeetz/workspace/taskforge-landing
supabase link --project-ref <new-project-ref> --password <db-password>

# 4. Push the migration
supabase db push

# 5. Update .env.local with new credentials
#    Get them from: supabase projects list
```

### Option C: Use Supabase Local Development

```bash
# Start local Supabase
cd /Users/joergpeetz/workspace/taskforge-landing
supabase start

# Apply migration locally
supabase db push --local

# .env.local will have local URLs automatically
```

## After Setup

The waitlist table will be ready. Test with:

```bash
# Insert a test entry (using anon key)
curl -X POST "NEXT_PUBLIC_SUPABASE_URL/rest/v1/waitlist" \
  -H "apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Read entries (using service_role key)
curl "NEXT_PUBLIC_SUPABASE_URL/rest/v1/waitlist" \
  -H "apikey: SUPABASE_SERVICE_ROLE_KEY"
```

## Files

| File | Purpose |
|------|---------|
| `supabase/migrations/001_create_waitlist.sql` | SQL migration |
| `.env.local` | Environment variables |
| `scripts/setup.sh` | Automated setup script |
| `scripts/run_migration.js` | Node.js migration runner |
