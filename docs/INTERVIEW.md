# navlands — Interview Guide

This is the full list of what we'll cover to fill in `mother.md`. You don't have to
answer it all at once. **Start with Round 1** (the foundations); everything else we
deep-dive section by section. Answer in plain language — bullet points are fine.

---

## ⭐ Round 1 — Foundations (answer these first)

1. **What is navlands, in one sentence?** `navlands is a ... that helps ... do ...`
2. **The problem.** What's annoying/broken/missing today that navlands fixes?
3. **Primary user.** Who is it for, and on what device (phone? web?)?
4. **Top 3–5 things a user can do** in the app.
5. **MVP vs later.** Of those, which are must-haves for the very first version?
6. **Platform.** iOS, Android, Web, or all? Any tech preference, or should the agent choose?
7. **The screens you're designing.** Just list their names.

That's enough to draft `goal.md` and the skeleton of the others. Then:

---

## Round 2 — Product depth

- The "magic moment" that makes someone go "I need this."
- A short real-life story of one person using it end to end (the happy path).
- Other user roles (is it two-sided? admins?).
- Closest competitors / alternatives and how navlands is different.
- Explicit **non-goals** — what is deliberately NOT in v1.
- What success looks like in 6–12 months (a number if possible).

## Round 3 — Design depth

- Per-screen detail: purpose, what the user can do, what data shows.
- Navigation model (tabs / stack / drawer / map-first) and first-run/onboarding.
- Vibe in 3 adjectives; reference apps you love.
- Brand basics: colors, fonts, logo (decided or TBD?); light/dark; accessibility.
- Do you have Figma/Canva designs? (I can pull them in.)
- Edge states: empty / loading / error / offline.

## Round 4 — Data, logic & accounts

- The main "things" (objects) and how they relate.
- Key rules/logic: pricing, matching, ranking, search/filter, permissions.
- Special capabilities: maps/location, payments, chat, media, AI, search.
- Where data comes from (user-entered / external APIs / seeded).
- Login method and roles; any sensitive/regulated data.

## Round 5 — Build, constraints & launch

- Stack preferences or "agent decides"; greenfield vs existing code.
- Third-party services & required APIs (maps, Stripe, auth, push, analytics…).
- Team & timeline; offline support.
- Success metrics; hard constraints (deadline, budget, compliance, store rules).
- Biggest risks/unknowns; the v1 launch goal.

---

_As you answer, I fill `mother.md`. When it's complete, Codex splits it into
`goal.md`, `design.md`, `task.md`, and `agents.md`._
