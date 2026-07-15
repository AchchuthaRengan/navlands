# M2 Plan: Core Exploration Experience

## Summary

M2 starts from a completed M1 foundation on `codex/bootstrap-clean`. The goal is to turn the current authenticated placeholder shell into the first real Wayframe exploration flow: signed-in users can enter through a lightweight onboarding step, generate and view a path, inspect structured nodes and suggestion cards with trust labels, and run basic what-if simulations using the existing hosted-dev-first Supabase schema and mock-first AI gateway.

## Current Workspace Baseline (2026-04-06)

- Canonical repo root is `D:\navlands\code`
- Active branch remains `codex/bootstrap-clean`
- M1 is complete:
  - hosted-dev-first Supabase baseline and RLS are applied
  - auth foundation exists for email/password + Google + GitHub
  - shared contracts and validation are in place
  - mock AI gateway and anonymous rate limiting are implemented
  - unit, e2e, RLS, build, and `pnpm verify` are green
- Current app surfaces are still placeholders:
  - `/` marketing bootstrap page
  - `/login` and `/signup` auth foundation pages
  - `/app` M1 placeholder shell
  - `/admin` allowlist-gated placeholder
- No higher-precedence milestone/spec files for M2 are present in this worktree (`wayframe-*.md`, `ARCHITECTURE.md`, `LEARNINGS.md`, or `PLAN_M2.md` were not found at kickoff)

## Planning Assumption

Because the higher-precedence milestone docs are absent from this worktree, M2 scope is derived from:

1. repo non-negotiables already in force
2. the M1 out-of-scope list
3. the current codebase shape

If the missing governing docs are restored later and they conflict with this plan, record the conflict in `docs/DECISIONS.md` before implementation continues.

## Locked M2 Direction

- Prioritize the exploration engine before parent/social/admin expansion
- Keep hosted-dev-first Supabase
- Keep `pnpm` and Vercel assumptions unchanged
- Keep email/password + Google + GitHub auth as the active auth surface
- Do not start parent dashboard UI, feed/social UI, or admin tooling expansion in this milestone
- Keep mock AI mode as the default done-state unless live provider credentials are intentionally introduced
- Keep trust labels, structured contracts, validation, authorization, and logging mandatory

## Milestone Goal

By the end of M2, a signed-in user can:

1. enter the app through a minimal exploration-oriented onboarding/profile step
2. submit a prompt or structured exploration input
3. generate a schema-valid path through the shared AI abstraction in mock mode
4. view the returned path in a visual-first app shell with nodes, edges, and trust labels
5. inspect suggestion cards and proof-oriented next steps
6. run a basic what-if simulation against the current path

## In Scope

1. Signed-in app information architecture beyond the current placeholder
2. Lightweight onboarding/profile completion needed to start exploration
3. Shared server actions and reads for path generation and retrieval
4. Visual path view using existing `paths`, `path_nodes`, `node_edges`, and `proof_items`
5. Suggestion card display using the Amendment-aligned contract already in `src/types/contracts.ts`
6. What-if interaction using the existing AI gateway method
7. Minimal client state where needed via Zustand, without introducing parallel persisted state
8. Route-level and component-level graceful degradation when env/config is incomplete
9. Verification, docs updates, and Claude checkpoints for the new work

## Explicitly Out of Scope

- Parent dashboard UI
- Feed/social/community UI
- Admin feature expansion beyond existing access-control scaffolding
- Phone OTP unless a later M2 sub-plan explicitly pulls it in
- Live provider rollout as the default path
- Resend/live deliverability work
- Any speculative schema expansion not justified by the current contracts and existing tables

## Execution Rules

- Treat this file as the M2 execution contract
- Keep diffs scoped to the exploration experience only
- Prefer existing M1 contracts, tables, and gateway methods over inventing new parallel abstractions
- All writes still go through server-side boundaries
- Continue updating `docs/STATUS.md` and `docs/DECISIONS.md` after each meaningful checkpoint
- Run validation after each major phase and fix failures before moving on
- If restored governing docs disagree with this plan, stop and record the conflict before continuing

## Phase Plan

### Phase 0: Preflight And Gap Closure

- Audit the current `/app` placeholder against the M2 goal
- Confirm the missing high-precedence spec docs are still absent
- Tighten any repo docs needed to make M2 execution unambiguous
- Status: completed; `PLAN_M2.md` now anchors the next milestone and records the missing-doc assumption explicitly

### Phase 1: Exploration App Shell

- Replace the `/app` placeholder with a real signed-in shell
- Establish the primary exploration layout, navigation framing, and empty states
- Preserve the current visual system and M1 trust-first messaging
- Status: completed; the signed-in route now renders the first M2 exploration shell with contract-aligned suggestion previews and visual path empty states

### Phase 2: Minimal Onboarding For Exploration

- Add only the profile/persona inputs required to start generating a path
- Reuse the existing `profiles` table and shared validation
- Avoid full persona wizard sprawl; keep this milestone focused on entering exploration

### Phase 3: Path Generation Actions And Reads

- Add server actions/loaders that:
  - validate exploration input
  - call `generatePath()`
  - persist `paths`, `path_nodes`, and `node_edges`
  - read the latest user path safely through the existing auth boundaries
- Keep all AI calls behind the shared gateway

### Phase 4: Visual Path Surface

- Render nodes and edges in a visual-first layout
- Expose trust labels and source semantics clearly
- Show timeline, rationale, next steps, and proof-oriented cues without collapsing into a text dump

### Phase 5: Suggestion Cards And What-If

- Render `SuggestionCard` data directly from the shared contract
- Add a basic what-if interaction flow using `simulateWhatIf()`
- Keep the interaction deterministic and mock-friendly for M2 validation

### Phase 6: Verification And Review

- Add or expand unit, e2e, and integration coverage for the exploration flow
- Keep RLS-sensitive checks where user-owned path data is involved
- Run `pnpm verify`
- Record Claude review outputs for the major M2 checkpoints

## Required Claude Review Checkpoints

1. After Phase 3 path generation persistence and reads are implemented
2. After Phase 5 suggestion cards and what-if interactions are implemented
3. After final M2 verification before the milestone is considered complete

## Done Means Done

- Signed-in exploration entry flow exists and is usable
- A user can generate and view a path end-to-end in mock mode
- Suggestion cards render from the shared contract without ad hoc shape drift
- What-if interaction is wired through the shared AI gateway
- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm test` passes
- `pnpm test:e2e` passes
- `pnpm build` passes
- `pnpm verify` passes
- `docs/STATUS.md`, `docs/DECISIONS.md`, and this file are current
- Claude checkpoint outputs are recorded

## Open Constraints

- `ADMIN_EMAILS` is still unavailable, so admin remains fixture-validated only
- Live provider keys are still unavailable for app runtime; mock mode remains the default validation path
- Resend domain is still unavailable
- Higher-precedence M2 product docs are missing from this worktree at kickoff

## Checkpoint Log

- Checkpoint 1: M2 kickoff and shell
  - `PLAN_M2.md` created from the current repo state and M1 out-of-scope list
  - Missing higher-precedence M2 docs confirmed and recorded as a planning assumption
  - `/app` placeholder replaced with the first signed-in exploration shell
  - Shell validation passed through `pnpm verify`
