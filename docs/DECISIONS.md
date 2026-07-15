# DECISIONS

## 2026-04-06

### D11. Missing canonical docs were treated as a bootstrap defect

- Context: The repo had a live scaffold but no `docs/STATUS.md` or `docs/DECISIONS.md`, which violated the operating contract.
- Decision: Restore both canonical docs before deeper implementation work.
- Impact: Bootstrap progress and blockers are recorded from this checkpoint forward.

### D12. Missing `.env.example` was treated as a security and onboarding defect

- Context: The repo no longer had `.env.example`, so there was no safe tracked template for required configuration.
- Decision: Recreate `.env.example` with placeholders only and preserve the earlier rule that any previously committed real values must be rotated outside the repo.
- Impact: Future environment setup can proceed without reintroducing secrets into version control.

### D13. Bootstrap keeps the `src/`-based Next.js structure

- Context: The user scaffolded a `src/app` Next.js App Router project rather than a top-level `app/` directory.
- Decision: Keep the `src/` layout because it is already present and compatible with the architecture, while still mirroring the expected subsystem folders under `src/`.
- Impact: Imports use the existing `@/* -> ./src/*` alias. No zero-value relocation is performed during bootstrap.

### D14. Auth foundation stops at email/password + Google + GitHub

- Context: M1 must provide auth foundations without silently pulling phone OTP forward.
- Decision: Add login/signup pages, OAuth entry points, callback handling, and middleware only for email/password, Google, and GitHub.
- Impact: Phone OTP remains absent from the UI, actions, and validation in this checkpoint.

### D15. Mock AI mode remains the only valid M1 default

- Context: Provider runtime keys are still unavailable.
- Decision: Server env helpers default `AI_PROVIDER_MODE` to `mock` and do not treat live keys as required for bootstrap.
- Impact: Supabase/auth/bootstrap work can proceed without pretending live AI integration is complete.

### D16. Hosted-dev-first Supabase wiring starts with helpers and repo shape, not schema guesses

- Context: This checkpoint is limited to preflight/bootstrap only.
- Decision: Add Supabase client helpers, environment wiring, and repo-managed `supabase/` directories now; defer schema, migrations, RLS, and generated types to the next checkpoint.
- Impact: The architecture boundary is in place without widening scope into Phase 3 early.

### D17. Phase 1 is not complete until the root manifest and config layer exists

- Context: The earlier bootstrap checkpoint restored routes, helpers, and docs, but the clean branch still lacked `package.json`, `tsconfig.json`, Tailwind/PostCSS config, and the root app layout. That left `pnpm dev` unusable.
- Decision: Treat bootstrap as incomplete until the branch contains a runnable `pnpm`/Next.js manifest and passes the full `pnpm verify` checkpoint.
- Impact: Future checkpoint claims must be validated against the actual file tree, not inferred from partial scaffolding.

### D18. Bootstrap type checking uses `tsconfig.typecheck.json`

- Context: The bootstrap branch needs a stable standalone `pnpm typecheck` command even when Next.js later injects `.next/types` behavior into the base config.
- Decision: Keep `tsconfig.json` as the Next.js app config and run `pnpm typecheck` against `tsconfig.typecheck.json`.
- Impact: `pnpm typecheck` stays deterministic during bootstrap while `pnpm build` continues to validate the full Next.js app.

### D19. `codex/bootstrap-clean` remains the authoritative M1 execution branch until main is intentionally updated

- Context: Local `main` still carries older local-only history and is not the branch we want to advance for M1.
- Decision: Continue M1 execution on `codex/bootstrap-clean` and only move changes to `main` after a deliberate later milestone update.
- Impact: All current M1 validation and implementation results should be judged from the clean branch, not the old local `main` worktree.

### D20. `D:\navlands\code` now tracks the active M1 dev branch

- Context: `pnpm dev` was failing in the canonical repo path because it still pointed at the older local `main` worktree instead of the clean M1 branch.
- Decision: Repoint `D:\navlands\code` to `codex/bootstrap-clean` so all standard repo commands run from the expected local path.
- Impact: Future M1 work should use `D:\navlands\code` directly without relying on an auxiliary worktree path.

### D21. Missing public Supabase env is a setup state, not a render-time crash

- Context: The bootstrap auth routes were throwing a raw parser error when `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` was absent.
- Decision: Treat missing public Supabase values as an expected bootstrap setup state. Public pages render setup guidance, protected routes redirect away, and Supabase helpers throw only when code explicitly tries to use them.
- Impact: `pnpm dev` can run safely before `.env.local` is fully configured without pretending auth works.

### D22. Hosted dev types are generated through direct Postgres introspection on this machine

- Context: `pnpm dlx supabase gen types` required Docker Desktop locally, which is unavailable in this environment.
- Decision: Keep hosted-dev-first as the database workflow, but generate `src/types/db/supabase.ts` through the repo-local `scripts/hosted-dev-supabase.mjs` introspection path instead of the Docker-dependent CLI generator.
- Impact: DB types still come from the live hosted schema, and the repo avoids hand-maintained drift without requiring local Docker.

### D23. AI usage logging is centralized through `record_ai_call`

- Context: M1 requires explicit validation, logging, and budget tracking for the shared AI abstraction.
- Decision: The hosted dev schema includes the `record_ai_call` RPC, and the server-side AI repository uses it to write `ai_call_log` and upsert `ai_daily_budget`.
- Impact: Mock AI mode and future live-provider runs share one explicit accounting path with canonical M1 table names.

### D24. Auth completeness includes server-side profile sync and fixture-only admin validation

- Context: M1 needs auth completeness without widening into onboarding or M2 work, and `ADMIN_EMAILS` is still unavailable.
- Decision: Successful auth now upserts a `profiles` row through the service-role client, while `/admin` remains code-complete but fixture-validated until the real allowlist is available.
- Impact: Auth foundations satisfy M1 boundaries without silently pulling admin operations or onboarding UX forward.

### D25. Claude review remains a hard completion blocker

- Context: `PLAN_M1.md` still requires explicit Claude review checkpoints, and they cannot be skipped without violating the execution contract.
- Decision: Prepare the prompt files under `scripts/claude/` now and keep Claude review as an explicit blocker rather than silently dropping the requirement.
- Impact: The implementation can be validated and stabilized, but M1 is not truly complete until the Claude checkpoints run and their outcomes are recorded.

### D26. The local Claude binary is installed but not authenticated for non-interactive review runs

- Context: `C:\Users\Achchutha Rengan\.local\bin\claude.exe --version` works from the repo root, but `claude -p` review execution returns `Not logged in - Please run /login`.
- Decision: Treat the blocker as shell authentication state, not installation. Continue invoking the discovered absolute Claude path for future review runs once authentication is restored.
- Impact: M1 stays blocked at the mandatory review checkpoint until the repo shell can execute non-interactive Claude review commands successfully.

### D27. Phase-3 Claude review fixes land as a follow-up migration instead of rewriting applied history

- Context: The phase-3 Claude review surfaced one high-risk RPC permission gap and two schema normalization issues after the baseline M1 migration had already been applied to hosted dev.
- Decision: Preserve the original baseline migration and add `20260406143000_m1_phase3_review_fixes.sql` to revoke direct client execution of `record_ai_call`, grant execution only to `service_role`, constrain `resume_parses.parse_status`, and add the supporting status index.
- Impact: Hosted dev remains migration-driven, budget integrity is protected, and resume-parse worker states are normalized without rewriting applied migration history.

### D28. Playwright smoke runs in forced bootstrap mode on a dedicated local port

- Context: The canonical repo path may contain a real `.env.local`, which would make auth/setup smoke coverage nondeterministic if Playwright reused ambient environment values or an already-running dev server.
- Decision: The Playwright web server starts its own Next.js dev instance on `127.0.0.1:3100` with blank public Supabase and admin env overrides and `AI_PROVIDER_MODE=mock`.
- Impact: M1 smoke coverage now deterministically validates the marketing page, setup-mode auth routes, and protected-route redirects without leaking live local configuration into the result.

### D29. Low-risk phase-3 review suggestions stay documented but out of scope for this checkpoint

- Context: The recorded phase-3 Claude review also suggested additional policies and indexes for `notifications`, `content_flags`, `votes`, `ai_daily_budget`, and `paths.status`.
- Decision: Apply only the priority M1 fixes now and keep the lower-risk suggestions documented in `docs/reviews/claude-phase-3-review-2026-04-06.md` instead of widening the current checkpoint.
- Impact: The current pass closes the highest-risk M1 defects while preserving milestone scope discipline.

### D30. The final Claude close-out review is accepted from the pre-cleanup run because its only blockers were resolved in the same checkpoint

- Context: Claude produced a substantive final review at 12:47 IST, then hit a usage limit on the immediate rerun after the review files were cleaned up. The 12:47 review found no new M1 code or schema defects; it only flagged an empty Phase 5 review file, review-file formatting, and the missing final review artifact itself.
- Decision: Record the 12:47 close-out result under `docs/reviews/claude-final-review-2026-04-06.md`, resolve the documentation blockers in the same checkpoint, and treat the final Claude requirement as satisfied for M1.
- Impact: M1 can close without waiting for the next Claude quota reset, while the review trail still documents both the original finding and the cleanup that resolved it.

### D31. Phase-6 Claude notes are documented, not implemented, because they do not block M1

- Context: The phase-6 Claude review called out two minor issues: budget-exhaustion events are not logged before the gateway throws, and `InMemoryAiUsageRepository` ignores the injected clock when computing the budget date.
- Decision: Keep both notes documented as non-blocking M1 follow-ups instead of widening the milestone with extra hardening work.
- Impact: The shared AI abstraction remains contract-valid and safely mock-first for M1, while future cleanup work has a concrete paper trail.

### D32. M2 starts with a repo-grounded plan because no higher-precedence M2 docs are present in this worktree

- Context: At M2 kickoff, the repo contains `PLAN_M1.md` and the completed M1 codebase, but no checked-in `PLAN_M2.md`, `wayframe-*.md`, `ARCHITECTURE.md`, or `LEARNINGS.md` files to anchor the next milestone directly.
- Decision: Create `PLAN_M2.md` from the current repo state, the M1 out-of-scope list, and the repo non-negotiables, while explicitly recording that assumption in the plan itself.
- Impact: The next milestone can proceed from an explicit execution contract without pretending the missing governing docs were available.

### D33. M2 prioritizes the exploration engine over parent, social, and admin expansion

- Context: The repo non-negotiables make the exploration engine the primary product, and the current codebase still only has a placeholder `/app` shell.
- Decision: The first M2 slice focuses on exploration entry, path generation, path viewing, suggestion cards, and what-if interactions instead of parent dashboard UI, feed/social features, or deeper admin tooling.
- Impact: The next implementation phase advances the product core rather than widening into lower-priority surfaces.

### D34. Phone OTP is not part of the first M2 execution slice

- Context: Phone OTP was deliberately excluded from M1, but the current repo still lacks any governing M2 milestone doc that would justify making it the first post-M1 priority.
- Decision: Keep the active auth surface at email/password + Google + GitHub during M2 kickoff and leave phone OTP out of the initial M2 execution slice unless a later M2 sub-plan explicitly pulls it in.
- Impact: M2 starts on exploration experience work without reopening auth scope at the same time.

### D35. M2 will consume the existing M1 contracts, schema, and mock-first AI gateway rather than introducing parallel abstractions

- Context: M1 already established canonical contracts, Supabase tables, auth boundaries, and a shared AI gateway with mock-mode validation.
- Decision: `PLAN_M2.md` requires the next milestone to build on those existing boundaries instead of inventing new state systems, new provider paths, or new schema forks.
- Impact: The next milestone can move faster while preserving the architectural guarantees established in M1.

### D36. M2 Phase 1 replaces the `/app` placeholder with a visual shell before adding generation actions

- Context: The signed-in route was still an M1 placeholder, but the repo already had the contracts and visual system needed to establish the exploration shell first.
- Decision: Replace the placeholder with a signed-in exploration shell, contract-aligned suggestion previews, and path empty states before implementing onboarding and path persistence.
- Impact: M2 now has a stable visual surface to attach Phase 2 onboarding and Phase 3 generation/actions work without mixing layout churn with server-action logic.
