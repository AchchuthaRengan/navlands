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
