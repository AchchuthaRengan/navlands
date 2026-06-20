# navlands — Master Spec (`mother.md`)

> **What this is.** This is the single **source of truth** for the navlands app — the
> "mother" document. Everything we know about the product lives here. An AI coding
> agent (e.g. OpenAI Codex) reads this file and splits it into four working
> documents: `goal.md`, `design.md`, `task.md`, and `agents.md`.
>
> **Rule:** when something about the product changes, change it **here first**, then
> regenerate the child docs.
>
> **Status:** 🚧 Draft — being filled in via interview.
> **Last updated:** 2026-06-20.

---

## 0. How the documents relate (read me first)

Think of building an app like building a house:

| Document | Plain-English job | Answers | Built from |
|---|---|---|---|
| **`mother.md`** (this) | The full blueprint — the whole story | *Everything* | You |
| **`goal.md`** | Why we're building it + what "success" looks like | *Why? For whom? Done?* | §1–§2 |
| **`design.md`** | What it looks like + how it's put together | *How it looks / flows / data* | §4–§7 |
| **`task.md`** | The build broken into small, ordered jobs | *Do what, in what order?* | §3 + all |
| **`agents.md`** | House rules for the builders (the coding agent) | *How to build it / conventions* | §8–§10 |

These four map onto **Codex's "four elements of a good prompt"**:
**Goal** → `goal.md`, **Context** → `design.md`, **Constraints** → `agents.md`,
**Done-when** → acceptance criteria in `task.md`.

> ✍️ Sections below are the interview. Replace every `> ✍️ FILL:` block with your
> answers in plain language. It's fine to leave `_TBD_` where you're unsure — we'll
> circle back. Short and accurate beats long and vague.

---

## 1. Vision & Problem  →  feeds `goal.md`

**1.1 One-sentence pitch.**
> ✍️ FILL: "navlands is a ____ that helps ____ do ____."

**1.2 The problem.** What is annoying / broken / missing today, without navlands?
> ✍️ FILL:

**1.3 The magic moment.** The single thing that makes someone go "I need this."
> ✍️ FILL:

**1.4 Why now / why you.** Why hasn't this been done well already?
> ✍️ FILL:

**1.5 What success looks like** in 6–12 months (a number if you can — users, usage, revenue).
> ✍️ FILL:

---

## 2. Users & Market  →  feeds `goal.md`

**2.1 Primary user.** Who are they? (age, context, how tech-savvy, what device)
> ✍️ FILL:

**2.2 Other roles?** Is this two-sided or multi-role? (e.g. buyers + sellers, admins)
> ✍️ FILL:

**2.3 A real scenario** — tell a short story of one person using navlands start to finish.
> ✍️ FILL:

**2.4 Where & when** they use it (on the go / at home, mobile / desktop, how often).
> ✍️ FILL:

**2.5 Closest alternatives / competitors** and how navlands is different or better.
> ✍️ FILL:

---

## 3. Features & Scope  →  feeds `task.md` priorities

**3.1 Everything a user can do** (list the verbs — "search…", "post…", "book…").
> ✍️ FILL:

**3.2 MVP — the must-haves for v1** (the 3–6 things, without which it's pointless).
> ✍️ FILL:

**3.3 Later** (nice-to-haves, v2+).
> ✍️ FILL:

**3.4 NON-goals — explicitly NOT in v1.** (Very important: stops the agent over-building.)
> ✍️ FILL:

**3.5 The happy path** — the single most important journey, end to end.
> ✍️ FILL:

---

## 4. Screens & Flows  →  feeds `design.md`

**4.1 Screen list.** Name every screen you're designing.
> ✍️ FILL: (e.g. Splash, Onboarding, Home/Map, Search, Detail, Profile, Settings…)

**4.2 Per-screen detail.** For each screen: its purpose, what the user can do, what shows.
> ✍️ FILL:

**4.3 Navigation model.** How do users move around? (bottom tabs / stack / drawer / map-first)
> ✍️ FILL:

**4.4 First-run experience.** Onboarding, sign-up, permissions (location? notifications?).
> ✍️ FILL:

**4.5 Edge states.** Any thoughts on empty / loading / error / offline screens.
> ✍️ FILL:

---

## 5. Look & Feel  →  feeds `design.md`

**5.1 Vibe in 3 adjectives** (e.g. calm, trustworthy, playful).
> ✍️ FILL:

**5.2 Reference apps** whose design you love (and what specifically).
> ✍️ FILL:

**5.3 Brand basics.** Colors, fonts, logo — decided or _TBD_?
> ✍️ FILL:

**5.4 Light/dark mode? Accessibility needs?**
> ✍️ FILL:

**5.5 Designs.** Do you have Figma/Canva files? (I can pull them in to detail this.)
> ✍️ FILL:

---

## 6. Data & Logic  →  feeds `design.md`

**6.1 Main "things" (objects).** e.g. User, Place, Listing, Booking, Message…
> ✍️ FILL:

**6.2 What each holds + how they relate** (e.g. "a User has many Bookings").
> ✍️ FILL:

**6.3 Key rules/logic.** Pricing, matching, ranking, search/filter, permissions.
> ✍️ FILL:

**6.4 Special capabilities needed?** Maps/location, payments, chat, media upload, AI, search.
> ✍️ FILL:

**6.5 Where does data come from?** Users enter it / external APIs / scraped / seeded.
> ✍️ FILL:

---

## 7. Accounts & Permissions  →  feeds `design.md` + `agents.md`

**7.1 Do users log in?** How? (email+password, Google, Apple, phone OTP, guest mode)
> ✍️ FILL:

**7.2 Roles & powers.** Who can do/see what?
> ✍️ FILL:

**7.3 Sensitive data.** Location, payments, personal info, anything regulated?
> ✍️ FILL:

---

## 8. Tech & Platform  →  feeds `agents.md`

**8.1 Platforms.** iOS / Android / Web / all? Native or cross-platform?
> ✍️ FILL:

**8.2 Stack preferences or "agent decides".** Language, framework, backend, database, hosting.
> ✍️ FILL:

**8.3 Greenfield or existing code?**
> ✍️ FILL:

**8.4 Team & timeline.** Just you? A deadline? A launch event?
> ✍️ FILL:

**8.5 Offline support needed?**
> ✍️ FILL:

---

## 9. Integrations & Services  →  feeds `agents.md`

**9.1 Third-party services.** Maps, payments (Stripe?), auth, push, analytics, email/SMS.
> ✍️ FILL:

**9.2 Required external APIs** you must integrate with.
> ✍️ FILL:

---

## 10. Success, Constraints & Risks  →  feeds `goal.md` + `agents.md`

**10.1 Success metrics.** The 1–3 numbers you'll watch.
> ✍️ FILL:

**10.2 Hard constraints.** Deadline, budget, compliance (GDPR/etc.), app-store rules.
> ✍️ FILL:

**10.3 Biggest risks / unknowns.**
> ✍️ FILL:

**10.4 v1 launch goal.** TestFlight / public store / web demo / investor demo.
> ✍️ FILL:

---

## Appendix A — Spec for each child document (for Codex)

> Instructions to the coding agent on **how to split this file**. Keep each child doc
> short, accurate, and at the right "altitude": specific enough to guide, flexible
> enough not to be brittle. Prefer a few canonical examples over exhaustive rules.

### `goal.md` — the *why* (north star)
- Problem statement (from §1.2) and one-sentence pitch (§1.1).
- Target users and the core scenario (§2).
- The outcome / definition of done for the **product** (not the code).
- Success metrics and explicit non-goals (§3.4, §10.1).
- Keep to ~1 page. This is the thing every other doc serves.

### `design.md` — the *how it looks & is structured*
- Screen inventory + per-screen purpose and actions (§4).
- Navigation map / user flows (happy path diagram) (§3.5, §4.3).
- Visual language: colors, type, spacing, components, states (§5).
- Data model: objects, fields, relationships (§6.1–6.2).
- Architecture sketch: client, backend, integrations (§6.4, §8, §9).

### `task.md` — the *build plan*
- Work broken into **small, testable, isolated tasks** (aim ~1–4 hours each,
  scoped to a single pull request).
- Logical order with dependencies noted; group into milestones.
- Each task uses this shape:
  - **ID & title** — `T-012: Build the Place detail screen`
  - **Goal** — one line.
  - **Context** — which screens/objects/files it touches.
  - **Done when** — explicit, checkable acceptance criteria (tests pass, screen
    matches design, behavior works).
  - **Depends on** — prior task IDs.

### `agents.md` — the *house rules* (follows the open AGENTS.md standard)
- Project overview (1 paragraph) + repo layout.
- Build / run / test / lint commands.
- Tech stack and conventions: naming, folder structure, state management, styling.
- Git & PR conventions; how to verify work before finishing.
- Security rules and **prohibited actions** (what NOT to do).
- Completion criteria / how the agent checks itself.
- Principle: *a short, accurate `agents.md` beats a long file of vague rules.*

---

## Appendix B — Sources / method

Framework grounded in: the open **AGENTS.md** standard; **OpenAI Codex** best
practices (Goal / Context / Constraints / Done-when); **Anthropic** guidance on
context engineering (right "altitude", smallest set of high-signal tokens,
canonical examples); and **spec-driven development** (small, testable, single-PR
tasks; validate the spec before coding). Links provided in chat.
