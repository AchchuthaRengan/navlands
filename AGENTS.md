# AGENTS.md — navlands

## Overview
navlands ("Wayframe") is a visual-first career exploration web app: AI-generated
career paths rendered as nodes/edges with trust labels, suggestion cards, and what-if
simulations. Next.js App Router + TypeScript + Tailwind + Supabase (hosted-dev-first)
+ mock-first AI gateway. Currently executing `PLAN_M2.md` (exploration experience).

## Doc precedence
1. `docs/mother.md` — product source of truth (intent)
2. `PLAN_M2.md` — current milestone execution contract (scope; do not exceed it)
3. `docs/STATUS.md` + `docs/DECISIONS.md` — update after every meaningful checkpoint
4. Conflicts between docs: stop, record in `docs/DECISIONS.md`, then continue

## Layout
```
src/app/          routes: (marketing) /, (auth) /login /signup + callback,
                  (app) /app signed-in shell, /admin allowlist-gated
src/components/   UI (app/shell-frame, app/exploration-overview, …)
src/lib/          ai/ (gateway, repository) · auth/ · supabase/ · env/ ·
                  server/ (rate-limit) · validation/ (zod contracts)
src/types/        contracts.ts (canonical shapes) · db/supabase.ts (generated)
supabase/         migrations/ (append-only) · policies · seeds
tests/            unit/ · e2e/ (Playwright) · rls/
```
Imports use the `@/* -> ./src/*` alias. Keep the `src/` layout (D13).

## Commands (pnpm only)
- `pnpm dev` · `pnpm build`
- `pnpm lint` · `pnpm typecheck` · `pnpm format:check`
- `pnpm test` (unit) · `pnpm test:e2e` · `pnpm test:rls`
- `pnpm db:push:m1` · `pnpm db:types:m1` (hosted-dev Supabase; no local Docker)
- **`pnpm verify` = the done-state.** Nothing is "complete" until it passes.

## Hard rules
- **All AI calls go through `src/lib/ai/gateway.ts`.** Mock mode (`AI_PROVIDER_MODE=mock`)
  is the required default until live keys are intentionally introduced (D15).
- **All writes go through server-side boundaries** (server actions/route handlers).
  Never call Supabase writes from client components.
- **Contracts first:** shapes live in `src/types/contracts.ts` with zod validation.
  No ad-hoc shapes; no parallel abstractions when an M1 contract/table/gateway
  method exists (D35).
- **RLS is mandatory** on user-owned data; schema changes are new append-only
  migrations — never rewrite applied history (D27).
- **Trust labels, validation, authorization, and usage logging are non-negotiable**
  on every AI-derived surface.
- Generated `src/types/db/supabase.ts` is never hand-edited.
- Zustand only for minimal client state; no parallel persisted state.

## Scope guards (current milestone)
Do NOT build: parent dashboard UI · feed/social UI · admin expansion · phone OTP ·
live-provider default · speculative schema. (PLAN_M2 locked direction.)

## Security
- Never commit secrets. `.env.example` carries placeholders only (D12).
- Missing env is a setup state, not a crash: public pages show setup guidance,
  protected routes redirect (D21).
- `record_ai_call` RPC is service-role only; budget writes never trusted to clients.
- Admin = `ADMIN_EMAILS` allowlist; admin actions get audit-logged.

## Done checklist (before claiming any task complete)
1. `pnpm verify` passes.
2. New logic has tests (unit; e2e/RLS where user data or routes are touched).
3. `docs/STATUS.md` (checkpoint) and `docs/DECISIONS.md` (any decision) updated.
4. Diff stays inside the milestone scope; the task's Done-when is demonstrably true.
