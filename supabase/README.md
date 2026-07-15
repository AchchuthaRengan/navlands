# Hosted-Dev-First Supabase

Wayframe uses a hosted Supabase development project first. Local schema truth
still lives in the repo:

- `supabase/migrations/` for schema changes
- `supabase/policies/` for RLS policy assets and notes
- `supabase/functions/` for Edge Function code when later milestones need it
- `supabase/seeds/` for repeatable bootstrap data

M1 bootstrap rules:

1. Apply schema and policy changes to the hosted dev project first.
2. Check migrations into this repo immediately.
3. Generate DB types from the hosted dev schema; do not hand-maintain them.
4. Do not introduce local-only schema drift.
