# navlands — Master Spec (`mother.md`)

> **Single source of truth for the navlands product.** Codex splits this into
> `goal.md`, `design.md`, `task.md` (⇒ today's `PLAN_Mx.md` execution contracts), and
> the root `AGENTS.md`. When the product changes, change it **here first**.
>
> **Legend:** ✅ = confirmed from the codebase (`codex/bootstrap-clean`, M1 complete /
> M2 in progress) · ❓ = needs the founder — see "Open interview questions" at the end.
> **Precedence:** this doc governs product intent; `PLAN_Mx.md` governs execution. A
> conflict must be recorded in `docs/DECISIONS.md` before implementation continues.
>
> **Status:** 🚧 Product facts pre-filled from code · vision sections pending interview.
> **Last updated:** 2026-07-15.

---

## 1. Vision & Problem

- ✅ **Working pitch (from code):** navlands (working title "Wayframe") is a
  **visual-first career exploration** app: users generate AI-assisted career **paths**,
  see them as navigable **nodes and edges with trust labels**, get **suggestion cards**
  with proof-oriented next steps, and test decisions with **what-if simulations**.
- ❓ **1.1 Founder's one-sentence pitch** (own words).
- ❓ **1.2 The problem** — what's broken about how people explore careers today?
- ❓ **1.3 The magic moment.**
- ❓ **1.4 Why now / why you.**
- ❓ **1.5 Success in 6–12 months** (a number).

## 2. Users & Market

- ✅ **Signals from schema:** `parent_dashboard_cache` + `mentor_interests` + `votes` +
  `content_flags` ⇒ the design anticipates **explorers** (primary), **parents**
  (dashboard, later), **mentors** (interest/matching, later), and **admins**
  (allowlist-gated `/admin`, audit log). Community/moderation surfaces exist in schema.
- ❓ **2.1 Primary explorer** — students choosing a direction? career changers? both?
  Age range, country, device expectations.
- ❓ **2.2 Roles at launch** vs later (are parents/mentors v1 or v2?).
- ❓ **2.3 A real end-to-end scenario** (one person, start to finish).
- ❓ **2.5 Competitors/alternatives** and the wedge.

## 3. Features & Scope

- ✅ **Built or building now (M1 done, M2 underway):**
  1. Auth: email/password + Google + GitHub (phone OTP deferred) — M1 ✅
  2. Minimal exploration onboarding/profile — M2 phase 2
  3. Generate a path from a prompt/structured input via the shared AI gateway (mock-first) — M2 phase 3
  4. Visual path view: nodes, edges, timeline, rationale, **trust labels** — M2 phase 4
  5. Suggestion cards + proof-oriented next steps — M2 phase 5
  6. Basic what-if simulation — M2 phase 5
- ✅ **In schema, explicitly deferred (post-M2):** resume parsing, votes,
  mentor interests, notifications, parent dashboard, feed/social, moderation
  (content flags), admin tooling expansion, phone OTP, live AI providers by default,
  email deliverability (Resend).
- ✅ **Current non-goals (locked in PLAN_M2):** ❌ parent dashboard UI ❌ feed/social UI
  ❌ admin expansion ❌ phone OTP ❌ live-provider default ❌ speculative schema.
- ✅ **Happy path (M2 "done means done"):** sign in → light onboarding → submit
  exploration input → schema-valid path generated (mock mode) → visual path with trust
  labels → inspect suggestion cards → run a what-if.
- ❓ **3.x Product-level v1** — which deferred features are required before _public_
  launch (e.g. is resume parsing or votes launch-blocking?), and the order of M3+.

## 4. Screens & Flows

- ✅ **Existing routes:** `/` marketing · `/login` · `/signup` · auth callback ·
  `/app` (signed-in exploration shell, M2) · `/admin` (allowlist-gated placeholder).
- ✅ **Navigation:** marketing → auth → `/app` shell (`shell-frame.tsx`,
  `exploration-overview.tsx`); protected routes redirect via `middleware.ts`; missing
  env renders setup guidance instead of crashing (D21).
- 🔜 **M2 adds:** onboarding step, path view, suggestion cards, what-if surface.
- ❓ **4.x Screens you're designing now** (list + purpose per screen) — and whether
  Figma files exist to import.

## 5. Look & Feel

- ✅ **From code:** warm editorial "glass panel" aesthetic. Tokens: `terracotta`,
  `cream`, `parchment`, `sand`, `ink`, `charcoal`, `ember`, `mist`; `font-heading`,
  `font-accent`; rounded-glass radii; light theme. Copy voice: calm, trust-first
  ("Visual-first career exploration").
- ❓ **5.1 Vibe adjectives + reference apps.**
- ❓ **5.2 Brand:** is the public name **navlands** or **Wayframe**? Logo? Dark mode?
  Accessibility bar (WCAG level)?

## 6. Data & Logic

- ✅ **Objects (16 tables, M1 migration):** `profiles`, `paths`, `path_nodes`,
  `node_edges`, `proof_items`, `votes`, `mentor_interests`, `notifications`,
  `ai_call_log`, `ai_daily_budget`, `whatif_cache`, `parent_dashboard_cache`,
  `feature_flags`, `content_flags`, `admin_audit_log`, `resume_parses`.
- ✅ **Core relations:** profile 1—N paths; path 1—N path_nodes; nodes linked by
  node_edges; proof_items attach to nodes; votes on paths/proof items; RLS scopes
  user-owned rows; `can_read_path`/`can_write_path` helpers gate transitive access.
- ✅ **AI logic:** every AI call goes through the shared gateway
  (`src/lib/ai/gateway.ts`) with **mandatory mock mode** until live keys exist;
  usage logged via `record_ai_call` RPC (service-role only) into `ai_call_log` +
  `ai_daily_budget`; anonymous rate limiting via Upstash; contracts validated with zod
  (`src/types/contracts.ts`): suggestion cards, node metadata, path generation, resume
  parsing, what-if, recommendation explanation, moderation, auth inputs.
- ❓ **6.x Path semantics** — what exactly is a node (a job? a skill? a milestone?),
  what's an edge, what do **trust labels** mean to the user, where does path knowledge
  come from when live AI is enabled (grounding sources?).

## 7. Accounts & Permissions

- ✅ Email/password + Google + GitHub; server-side session helpers; service-role
  profile sync on auth; `/admin` gated by `ADMIN_EMAILS` allowlist (fixture-validated
  until real allowlist exists); RLS on all user data; admin actions audit-logged.
- ❓ Guest/anonymous exploration before signup — allowed or not? (Anonymous rate
  limiting exists, which hints at yes.) Parent/mentor account linking model?
  Age handling (minors ⇒ COPPA/GDPR-K considerations)?

## 8. Tech & Platform

- ✅ **Web app**: Next.js App Router (`src/` layout, `@/*` alias), TypeScript, Tailwind;
  Zustand for minimal client state; Supabase **hosted-dev-first** (auth + Postgres +
  RLS; migrations in repo; types generated by `scripts/hosted-dev-supabase.mjs`);
  Vercel deploy assumption; pnpm.
- ✅ **Quality gates:** Vitest unit + RLS suites, Playwright e2e (deterministic
  bootstrap mode, port 3100), prettier, eslint, `tsconfig.typecheck.json`;
  **`pnpm verify` = the done-state** (format+lint+typecheck+unit+e2e+rls+build).
- ✅ **Workflow:** milestone execution contracts (`PLAN_Mx.md`), STATUS/DECISIONS
  updated every checkpoint, mandatory Claude review checkpoints per milestone.
- ❓ Mobile: is responsive web enough for v1, or native later?

## 9. Integrations & Services

- ✅ Supabase (auth/db) · Upstash Redis (rate limits) · AI provider(s) behind gateway
  (mock now; provider TBD) · Resend (email, deferred) · Vercel (hosting).
- ❓ Which live AI provider(s) + budget ceilings; analytics tool; payments (if any).

## 10. Success, Constraints & Risks

- ✅ **Known constraints:** `ADMIN_EMAILS` unavailable (admin fixture-tested);
  live AI keys unavailable (mock default); Resend domain unavailable; secrets never
  committed (`.env.example` placeholders, D12).
- ✅ **Known risks (from reviews):** AI budget integrity (fixed via D27), RLS
  gaps documented in `claude_insights.md` (low-risk backlog), mock→live provider
  transition.
- ❓ Success metrics, monetization, launch goal (beta list? public?), deadline.

---

## Open interview questions (the short list that remains)

The code answered the _what/how_. Only the founder can answer the _why/who/where-to_:

1. **Pitch & problem** (§1.1–1.5) — your words, the pain, the magic moment, success #.
2. **Primary user & roles at launch** (§2) — explorers = students? changers? Are
   parents/mentors v1? One end-to-end story.
3. **Node/edge/trust-label semantics** (§6.x) — what is a node, and what makes a
   suggestion "trusted"? Grounding sources for live AI.
4. **Public v1 definition** (§3.x) — which deferred features block launch; M3+ order.
5. **Brand** (§5) — navlands vs Wayframe, design references, dark mode, a11y bar.
6. **Guests & minors** (§7) — try-before-signup? under-18 users?
7. **Business** (§10) — metrics, monetization, launch goal, deadline.

## Appendix A — child-doc mapping (for Codex)

- `goal.md` ← §1, §2, §3 non-goals, §10 metrics. ~1 page.
- `design.md` ← §4, §5, §6 (+ Figma imports when provided).
- `task.md` ← §3 + `PLAN_Mx.md` pattern: milestones → phases → small tasks, each with
  Goal/Context/**Done-when** (keep `pnpm verify` + review checkpoints as the gate).
- `AGENTS.md` (root) ← §6 AI rules, §7 security, §8 commands/conventions, §10
  constraints. Keep ≤150 lines.
