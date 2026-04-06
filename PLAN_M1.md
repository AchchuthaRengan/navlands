# M1 Plan: Foundation Bootstrap (Zero-to-One)

## Summary

M1 now starts from a runnable Next.js workspace that satisfies the preflight and bootstrap checkpoint on the `codex/bootstrap-clean` development branch. The goal remains to finish the repository, project scaffold, schema, auth, AI abstraction, rate limiting, and verification foundation without starting M2 or feature implementation work.

## Current Workspace Baseline (2026-04-06)

- Canonical repo root is `D:\navlands\code`
- Active M1 development branch is `codex/bootstrap-clean`, checked out at the canonical repo root
- Current clean branch contents now include:
  - Next.js App Router scaffold under `src/`
  - `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, and `tsconfig.typecheck.json`
  - Next/Tailwind/PostCSS/ESLint/Prettier config
  - placeholder-safe `.env.example`
  - bootstrap auth and hosted-dev-first Supabase helper foundations
- Git metadata had been missing during the earlier planning pass and is now present locally
- `.env.example` now exists as a placeholder-only file; any previously committed real values must still be rotated outside the repo before reuse

## Locked Decisions

- Package manager: `pnpm`
- Deploy target: Vercel
- Supabase workflow: hosted-dev-first
- M1 auth scope: email/password + Google + GitHub
- Phone OTP is deferred to M2
- Mock AI mode is required in M1
- Explicit Claude review checkpoints remain required
- Canonical M1 AI/accounting names are `ai_call_log`, `ai_daily_budget`, and `resume_parses`
- Legacy `ai_token_usage` is not used in M1

## Milestone Goal

By the end of M1, a fresh engineer can clone the initialized repo, configure placeholder-safe env files, run the app locally with `pnpm`, authenticate through the supported M1 flows, apply migrations to the hosted Supabase development project, validate RLS, and exercise the shared AI abstraction in mock mode.

## Explicitly In Scope

1. Repo/bootstrap preflight and security hygiene
2. Next.js App Router scaffold with `pnpm` scripts
3. Tailwind, fonts, and design-token foundation
4. Hosted-dev-first Supabase repo setup, migrations, triggers, RPCs, policies, and generated DB types
5. Product contracts and shared validation schemas
6. Auth helpers, middleware, and basic auth route placeholders
7. Shared AI abstraction with mock mode, logging, budget hooks, retry/fallback structure, and eval hooks
8. Upstash anonymous rate limiting
9. Baseline tests and `pnpm verify`
10. Required documentation updates and Claude review checkpoints

## Explicitly Out of Scope

- Onboarding flow UI
- Phone OTP implementation
- Canvas, prompt bar, suggestion cards, and what-if UI
- Parent dashboard UI
- Social/feed/admin UI beyond route placeholders and access control scaffolding
- Live email deliverability claims
- Any M2 work

## Execution Rules

- Stop immediately if the workspace is not `D:\navlands\code`
- If `.git` is missing, record it as a blocker and initialize or restore git before scaffold work
- Replace `.env.example` with placeholders only before any scaffold work continues
- Keep diffs scoped to M1 foundation only
- Update `docs/STATUS.md` and `docs/DECISIONS.md` after every major checkpoint
- If lower-precedence docs conflict with higher-precedence truth, record the resolution in `docs/DECISIONS.md` instead of improvising
- Use `pnpm` commands only
- Keep hosted-dev-first Supabase as the default development workflow
- Do not start M2 or feature implementation while executing this plan

## Phase Plan

### Phase 0: Preflight Hygiene

- Confirm `D:\navlands\code` is the intended root
- Initialize or restore git metadata
- Normalize canonical doc filenames to `docs/STATUS.md` and `docs/DECISIONS.md`
- Scrub `.env.example` to placeholders only and note external credential rotation requirements
- Add `.gitignore` and ensure secrets stay untracked

### Phase 1: Project Bootstrap

- Create `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, Next/Tailwind/PostCSS/ESLint/Prettier configs
- Add stable scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `test:rls`, `format:check`, `verify`
- Create baseline folders: `app/`, `components/`, `lib/ai/`, `lib/auth/`, `lib/db/`, `lib/server/`, `lib/validation/`, `store/`, `types/`, `supabase/`, `tests/`, `scripts/`
- Add placeholder route groups for marketing, auth, app, and admin
- Status: completed and validated on `codex/bootstrap-clean`

### Phase 2: Design-System Foundation

- Add Romantic Glassmorphism tokens to global CSS and Tailwind config
- Load Instrument Serif, Caveat, DM Sans, and JetBrains Mono
- Set up light/dark CSS variables
- Create only minimal themed primitives needed to prove the foundation

### Phase 3: Supabase Foundation

- Initialize repo-managed Supabase assets while keeping the hosted-dev-first workflow
- Add migrations, helper functions, triggers, indexes, and RLS for:
  - `profiles`
  - `paths`
  - `path_nodes`
  - `node_edges`
  - `proof_items`
  - `votes`
  - `mentor_interests`
  - `notifications`
  - `ai_call_log`
  - `ai_daily_budget`
  - `whatif_cache`
  - `parent_dashboard_cache`
  - `feature_flags`
  - `content_flags`
  - `admin_audit_log`
  - `resume_parses`
- Generate DB types from the hosted dev schema and check them into the repo
- Do not add `prompt_cache`, `journey_cache`, or legacy `ai_token_usage` in M1
- Status: completed, validated against the hosted dev database, and tightened by the recorded phase-3 Claude review fixes

### Phase 4: Contracts and Validation

- Create the Amendment A2 node metadata discriminated union
- Create the Amendment A1 `SuggestionCard` type
- Create the Amendment A3 path-generation output types
- Add shared validation schemas for AI outputs and action inputs
- Ensure DB-derived types and product contracts do not duplicate or drift
- Status: completed and validated

### Phase 5: Auth and Server Boundaries

- Wire Supabase SSR and browser clients
- Add email/password, Google, and GitHub auth flows
- Add basic auth pages and placeholders only
- Add admin allowlist middleware for `/admin`
- Add DOB-aware profile field plumbing for later age-gate enforcement
- Keep phone OTP deferred to M2
- Status: completed, reviewed by Claude, and accepted for M1; Google/GitHub remain code-wired and fixture-validated, while phone OTP stays deferred to M2

### Phase 6: AI Abstraction and Mock Mode

- Implement a single AI gateway with provider adapters, retry/timeout handling, and fallback structure
- Default to `mock` provider mode in M1
- Provide at least `generatePath()`, `parseResume()`, `simulateWhatIf()`, `explainRecommendation()`, and `moderateContent()`
- Log usage to `ai_call_log`
- Read and update `ai_daily_budget`
- Add contract-check hooks that use `evals/`
- Status: completed, reviewed by Claude, and validated in mock mode

### Phase 7: Rate Limiting and Verification

- Add Upstash-based anonymous AI rate limiting
- Add unit, integration, RLS, and Playwright smoke scaffolds
- Make `pnpm verify` the default done-state command
- Document manual smoke checks for auth, RLS, mock AI, and admin gating
- Status: completed and validated; Claude checkpoint outputs are recorded for Phase 3, Phase 5, Phase 6, and milestone close-out

## Required Claude Review Checkpoints

1. After Phase 1 project bootstrap is complete and the repo scaffold builds locally
2. After Phase 3 Supabase schema, triggers, RPCs, and RLS are in place
3. After Phase 5 auth, session wiring, and admin route gating are implemented
4. After Phase 6 AI abstraction, mock mode, logging, and budget hooks are implemented
5. After final verification before the milestone is considered complete

If Claude review is required and unavailable, stop and report it.

## Done Means Done

- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm build` passes
- `pnpm test` passes
- `pnpm verify` passes
- Hosted-dev-first migrations apply cleanly
- RLS proof exists for private-path isolation
- Email/password auth works
- Google and GitHub wiring is validated or clearly marked fixture-only
- Mock AI mode returns schema-valid output through the shared abstraction
- `ai_call_log` and `ai_daily_budget` are exercised in verification
- Anonymous Upstash limits are testable
- `docs/STATUS.md`, `docs/DECISIONS.md`, and this file include validation notes
- Claude review results are recorded

## Checkpoint Log

- Checkpoint 1: Preflight hygiene
  - Root verified
  - Git initialized
  - Canonical planning docs restored under `docs/STATUS.md` and `docs/DECISIONS.md`
  - `.env.example` restored as a placeholder-only file
- Checkpoint 2: Project bootstrap
  - Root Next.js and `pnpm` manifest/config files restored on the clean dev branch
  - Stable scripts added to `package.json`
  - Root layout, global CSS tokens, and Tailwind theme now support the Wayframe bootstrap routes
  - Default scaffold routes replaced with Wayframe bootstrap routes
  - Hosted-dev-first Supabase helpers and folders added
  - Auth foundation added for email/password + Google + GitHub
  - Validation passed for `pnpm verify`
- Checkpoint 3: Supabase foundation
  - Hosted-dev migration `20260406120000_m1_foundation.sql` added and applied to the hosted dev database
  - RLS enabled for all M1 tables
  - `record_ai_call` RPC added for `ai_call_log` and `ai_daily_budget`
  - DB types regenerated from the hosted dev schema using repo-local introspection
  - Phase-3 Claude review recorded under `docs/reviews/claude-phase-3-review-2026-04-06.md`
  - Corrective migration `20260406143000_m1_phase3_review_fixes.sql` applied to revoke direct client execution of `record_ai_call` and normalize `resume_parses.parse_status`
- Checkpoint 4: Contracts and auth
  - Shared schemas added for suggestion cards, node metadata, path generation, resume parsing, what-if simulation, recommendation explanation, moderation, auth inputs, and profile upserts
  - Auth actions now validate input and degrade gracefully when Supabase public env is missing
  - Profile sync now runs server-side through the service-role client after successful auth
  - Phase-5 Claude auth review recorded under `docs/reviews/claude-phase-5-review-2026-04-06.md` with no M1-blocking findings
- Checkpoint 5: AI gateway and verification
  - Shared AI gateway added with mandatory mock mode, fallback structure, usage logging, and budget tracking
  - Anonymous AI rate limiting added with Upstash integration plus in-memory fallback for deterministic tests
  - Real Playwright smoke coverage now verifies the marketing page, setup-mode auth routes, and protected-route redirects without Supabase public env
  - Unit tests, Playwright smoke, live RLS validation, eval fixtures, and `pnpm verify` all pass
  - Phase-6 Claude AI review recorded under `docs/reviews/claude-phase-6-review-2026-04-06.md`
  - Final Claude close-out review recorded under `docs/reviews/claude-final-review-2026-04-06.md`

## Blocker Policy

- Missing `.git` is a blocker until resolved
- Committed credential-like values are a blocker for safe bootstrap until scrubbed and rotated externally if previously used
- Missing runtime AI keys, `ADMIN_EMAILS`, or Resend domain are not blockers for M1 if mock mode, fixtures, and clear non-live validation are used

## AI Validation Results

- `generatePath()` returns schema-valid output in mock mode and records usage
- `parseResume()` returns schema-valid output in mock mode
- `simulateWhatIf()` returns schema-valid output in mock mode
- `explainRecommendation()` returns schema-valid output in mock mode
- `moderateContent()` returns schema-valid output in mock mode
- Anonymous rate limiting trips at 2 requests in unit tests
- `ai_call_log` and `ai_daily_budget` are exercised through the repository and RPC path
- Direct anon RPC access to `record_ai_call` is blocked in live RLS verification
- Invalid `resume_parses.parse_status` values are rejected in live RLS verification
- Claude review checkpoints are recorded for Phase 3, Phase 5, Phase 6, and final close-out

## User Validation Suggestions

- Review `.env.example` for placeholders only before using any credential
- Run `pnpm verify`
- Confirm non-admin access is blocked from `/admin`
- Confirm private-path RLS isolation with two test users
- Confirm mock AI mode produces schema-valid output
