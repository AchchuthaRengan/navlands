# STATUS

## 2026-07-15

### Current State

- The docs system and the M1/M2 codebase now live together on `claude/busy-hamilton-l2u41r` (PR #1), created by merging `codex/bootstrap-clean`
- `docs/mother.md` is the governing product spec, pre-filled from the codebase with founder-interview gaps marked as open questions
- Root `AGENTS.md` (imported by `CLAUDE.md`) records the repo house rules for coding agents
- The docs map lives in `docs/INDEX.md`, doc-creation prompts in `docs/PLAYBOOK.md`, and the harness extension plan in `docs/HARNESS.md`
- M2 execution state is unchanged: Phase 1 complete, Phase 2 (minimal exploration onboarding) is next

### Completed This Checkpoint

- Merged `codex/bootstrap-clean` into `claude/busy-hamilton-l2u41r`
- Rewrote `docs/mother.md` from a blank template into a code-grounded product spec with confirmed facts and open questions marked
- Added root `AGENTS.md` and `CLAUDE.md`
- Updated `docs/INDEX.md` to map existing project docs (`PLAN_Mx.md`, `docs/STATUS.md`, `docs/DECISIONS.md`, `docs/reviews/`, `claude_insights.md`) into the documentation system
- Recorded D37 in `docs/DECISIONS.md`

### Next Actions

1. Founder interview to close the open questions in `docs/mother.md` (pitch, users, trust-label semantics, public-v1 scope, brand, metrics)
2. If the original local `wayframe-*.md` governing docs still exist on the founder's machine, commit or share them and reconcile with `docs/mother.md`, recording conflicts per D32/D37
3. Continue `PLAN_M2.md` Phase 2 (minimal exploration onboarding)

## 2026-04-06

### Current State

- Repo root verified at `D:\navlands\code`
- Active development branch is `codex/bootstrap-clean`, checked out at the canonical repo root
- Git metadata exists and current M1 work lives on the clean dev branch
- The Next.js App Router scaffold is runnable with `pnpm`
- Canonical planning docs have been restored under `docs/STATUS.md` and `docs/DECISIONS.md`
- Hosted-dev-first Supabase migration baseline is applied to the hosted dev database
- Generated DB types now reflect the hosted dev schema
- Shared contracts, auth helpers, mock AI gateway, eval fixtures, and anonymous rate limiting are present in the repo
- Auth scope remains email/password + Google + GitHub only
- Phone OTP remains deferred to M2
- Mock AI mode remains the required M1 default
- M1 foundation is complete at the code, test, and required-review level
- `PLAN_M2.md` now exists as the next execution contract for the core exploration experience
- `/app` now renders the first M2 exploration shell instead of the old M1 placeholder

### Completed This Checkpoint

- Applied `supabase/migrations/20260406120000_m1_foundation.sql` to the hosted dev database
- Generated `src/types/db/supabase.ts` from the hosted dev schema using the repo-local hosted-dev script
- Added shared contracts and validation for suggestion cards, node metadata, path generation, resume parsing, what-if simulation, recommendation explanation, moderation, and auth inputs
- Completed the M1 auth foundation with service-role profile sync, server-side auth helpers, and graceful missing-env handling
- Added the shared AI gateway with mandatory mock mode, fallback structure, usage logging, and budget reads/writes
- Added anonymous AI rate limiting with Upstash integration and deterministic in-memory test coverage
- Recorded the phase-3 Claude review and applied the follow-up Supabase hardening migration
- Recorded the phase-5 and phase-6 Claude reviews
- Replaced the skipped Playwright placeholder with real bootstrap smoke coverage
- Recorded the final Claude close-out review outcome and resolved its documentation blockers
- Added eval fixtures plus unit, Playwright, and live RLS verification
- Passed `pnpm verify`
- Created `PLAN_M2.md` to start the next milestone from an explicit repo-grounded contract
- Completed M2 Phase 1 by replacing the signed-in placeholder route with the first exploration shell

### Open Constraints

- `ADMIN_EMAILS` is still unavailable, so admin route validation remains fixture-based
- Mock AI mode is complete, but live provider validation remains intentionally out of scope for M1 done-state
- Resend domain is still unavailable, so email deliverability is not part of this checkpoint
- Claude usage limits prevented an immediate clean rerun of the final review after the review-file cleanup, but the earlier close-out review and its resolved blockers are now recorded
- Higher-precedence M2 product and milestone docs are still missing from this worktree, so `PLAN_M2.md` is derived from current repo state and the M1 out-of-scope list

### Next Actions

1. Start Phase 2 of `PLAN_M2.md` with minimal exploration onboarding on top of the new shell
2. Implement Phase 3 path-generation actions and reads against the existing M1 schema and gateway
3. Run final manual OAuth/admin smoke checks later if live allowlist credentials become available

### Validation Status

- M1 implementation and required review validation are complete for the current code checkpoint
- Commands run successfully:
  - `pnpm db:push:m1`
  - `pnpm db:types:m1`
  - `pnpm format:check`
  - `pnpm test:e2e`
  - `pnpm test:rls`
  - `pnpm test`
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm verify`
