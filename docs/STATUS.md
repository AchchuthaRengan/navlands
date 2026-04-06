# STATUS

## 2026-04-06

### Current State

- Repo root verified at `D:\navlands\code`
- Active development branch is `codex/bootstrap-clean`
- Git metadata exists and bootstrap work now lives on a clean dev branch
- The Next.js App Router scaffold is now runnable with `pnpm` on the dev branch
- Canonical planning docs have been restored under `docs/STATUS.md` and `docs/DECISIONS.md`
- `.env.example` has been restored as a placeholder-only file
- Hosted-dev-first Supabase helpers and folders now exist in the repo
- Auth foundation is limited to email/password + Google + GitHub
- Phone OTP remains deferred to M2
- Mock AI mode remains the required M1 default

### Completed This Checkpoint

- Verified repo root and git status
- Restored canonical docs and `.env.example`
- Rebuilt the missing root `package.json`, TypeScript, Next.js, Tailwind, ESLint, and Prettier config layer
- Added stable package scripts required by M1
- Added the root app layout and global design-token CSS
- Replaced default create-next-app landing content with Wayframe bootstrap routes
- Added hosted-dev-first Supabase client helpers and repo folders
- Added auth foundation pages, callback route, actions, and middleware gating for `/app` and `/admin`
- Added placeholder e2e and RLS verification harnesses for the bootstrap checkpoint
- Passed `pnpm verify` on the clean dev branch

### Active Blockers

- No committed schema or generated Supabase DB types exist yet beyond the bootstrap placeholder type
- `ADMIN_EMAILS` is still unavailable, so admin route validation remains fixture-based
- Runtime AI provider keys are still unavailable, so live provider validation remains blocked and mock mode stays mandatory
- Resend domain is still unavailable, so email deliverability is not part of this checkpoint
- `D:\navlands\code` still points at the old local `main` worktree until the clean dev branch is moved back there

### Next Actions

1. Move the clean dev branch back onto `D:\navlands\code` so `pnpm` commands run from the canonical repo path
2. Start Phase 3 Supabase schema, migrations, triggers, RPCs, and RLS
3. Replace the placeholder DB type with generated types from the hosted dev schema
4. Add shared contracts and validation for AI and node metadata
5. Add the mock AI abstraction and token-budget/logging tables using canonical names
6. Prepare the first Claude review once the bootstrap checkpoint is committed and stable

### Validation Status

- Preflight/bootstrap validation completed for this checkpoint
- Commands run successfully:
  - `pnpm verify`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm test:e2e`
  - `pnpm test:rls`
  - `pnpm build`
