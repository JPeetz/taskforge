#!/bin/bash
# TaskForge Landing Page — Supabase Setup Script
# Usage: ./scripts/setup.sh
# Prerequisites: supabase CLI logged in, .env.local configured

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "=========================================="
echo " TaskForge Landing Page — Supabase Setup"
echo "=========================================="

# Load env vars
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs)
fi

PROJECT_REF="${NEXT_PUBLIC_SUPABASE_URL#https://}"
PROJECT_REF="${PROJECT_REF%.supabase.co}"

echo ""
echo "Project Ref: $PROJECT_REF"
echo ""

# Option 1: If DB password is provided, use it
if [ -n "$SUPABASE_DB_PASSWORD" ] && [ "$SUPABASE_DB_PASSWORD" != "YOUR_DB_PASSWORD_HERE" ]; then
  echo "✅ Database password found in .env.local"
  
  # Check if project is accessible
  echo "🔍 Checking project status..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$NEXT_PUBLIC_SUPABASE_URL" 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" = "000" ]; then
    echo "⚠️  Project $PROJECT_REF is not reachable (paused?)"
    echo "   Go to: https://supabase.com/dashboard/project/$PROJECT_REF"
    echo "   Click 'Restore project' if paused, then re-run this script."
    exit 1
  fi
  
  echo "✅ Project is reachable (HTTP $HTTP_CODE)"
  
  # Try linking and pushing
  echo "🔗 Linking project..."
  supabase link --project-ref "$PROJECT_REF" --password "$SUPABASE_DB_PASSWORD"
  
  echo "📤 Pushing migration..."
  supabase db push
  
  echo ""
  echo "✅ Setup complete! Waitlist table is ready."
  exit 0
fi

# Option 2: Try local Supabase
echo "⚠️  No database password configured."
echo ""
echo "Choose an option:"
echo "  1) Use local Supabase (supabase start)"
echo "  2) Enter DB password for remote project"
echo "  3) Exit"
read -p "Choice [1-3]: " choice

case $choice in
  1)
    echo "🚀 Starting local Supabase..."
    supabase start
    supabase db push --local
    echo ""
    echo "✅ Local Supabase running!"
    echo "   Update .env.local with local URLs (shown by 'supabase status')"
    ;;
  2)
    read -sp "Enter DB password: " dbpass
    echo ""
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$NEXT_PUBLIC_SUPABASE_URL" 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "000" ]; then
      echo "⚠️  Project $PROJECT_REF is not reachable. Restore it first:"
      echo "   https://supabase.com/dashboard/project/$PROJECT_REF"
      exit 1
    fi
    
    supabase link --project-ref "$PROJECT_REF" --password "$dbpass"
    supabase db push
    echo ""
    echo "✅ Migration applied!"
    ;;
  3)
    echo "Exiting."
    exit 0
    ;;
  *)
    echo "Invalid choice."
    exit 1
    ;;
esac
