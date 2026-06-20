# navlands — Doc Playbook (structure + exact questions/prompts)

> For **each** `.md` file: what sections it contains, the **exact questions to answer**,
> and a **copy-paste prompt for Claude** to generate it. See a fully worked version of
> every doc in [`examples/habitloop/`](./examples/habitloop/).
>
> **The flow:** fill `mother.md` (via the interview) → then for each child doc, paste its
> prompt below. Each prompt tells Claude to use `mother.md` as the source of truth, so the
> docs stay consistent. Keep every doc lean: *short + accurate beats long + vague*.

---

## 0. `mother.md` — the master spec
- **Purpose:** the single source of truth; everything else is generated from it.
- **Structure:** §1 Vision · §2 Users · §3 Features/Scope · §4 Screens · §5 Look & feel · §6 Data & logic · §7 Accounts · §8 Tech · §9 Integrations · §10 Success/risks (+ appendices).
- **Questions to answer:** the whole interview — see [`INTERVIEW.md`](./INTERVIEW.md).
- **Prompt for Claude:**
  > "Interview me section by section to fill `docs/mother.md`. Ask one round at a time,
  > suggest answers where you can, and write my answers into the template. Flag anything
  > vague before moving on."
- **Done when:** every `> ✍️ FILL` block is answered and there are no `_TBD_`s left that block building.

---

## 1. `goal.md` — the why (north star)
- **Structure:** Problem · What it is · Who it's for · Core scenario · Definition of done · Success metrics · Non-goals.
- **Questions to answer:**
  1. What problem does this solve, in 2 sentences?
  2. One-sentence description of the product?
  3. Who exactly is the primary user?
  4. Tell the core scenario as a short story.
  5. What must be true for v1 to "work"? (product-level done)
  6. The 1–3 numbers that mean success?
  7. What are we deliberately NOT doing in v1?
- **Prompt for Claude:**
  > "Using `docs/mother.md` as the source of truth, write `docs/goal.md`. Sections:
  > Problem, What it is, Who it's for, Core scenario, Definition of done, Success metrics,
  > Non-goals. Keep it to ~1 page, plain language."
- **Done when:** a stranger reads it and can repeat what you're building, for whom, and how you'll know it worked.

---

## 2. `design.md` — look & structure
- **Structure:** Screen inventory (table) · Navigation & flows · Look & feel (color/type/spacing/components/states/a11y) · Data model · Architecture sketch.
- **Questions to answer:**
  1. List every screen and, for each: purpose / what the user can do / what it shows.
  2. How do users move between screens (tabs? stack? modal?)?
  3. What's the first-run/onboarding flow?
  4. 3 adjectives for the vibe + reference apps you like?
  5. Colors, fonts, light/dark, accessibility needs?
  6. What are the main objects (data), their fields, and relationships?
  7. Any derived/computed values or important rules?
  8. Rough architecture: client, backend, integrations?
- **Prompt for Claude:**
  > "Using `docs/mother.md`, write `docs/design.md` with: a screen-inventory table,
  > navigation & key flows, a look-&-feel section (color/type/spacing/components/states/
  > a11y), the data model (objects, fields, relationships, derived values), and an
  > architecture sketch. Use a couple of concrete examples over long prose."
- **Done when:** a designer could mock the screens and an engineer could model the data from this alone.

---

## 3. `task.md` — the build plan
- **Structure:** Milestones, each containing tasks. Every task = ID & title · Goal · Context · Done-when · Depends-on.
- **Questions to answer:**
  1. What's the riskiest/most foundational thing to build first?
  2. What are the natural milestones (foundation → data → screens → polish → ship)?
  3. For each feature, what is the explicit "done when" (testable)?
  4. What depends on what?
- **Prompt for Claude:**
  > "Using `docs/mother.md` and `docs/design.md`, write `docs/task.md`: break the build
  > into small, testable, single-PR tasks (~1–4h each), grouped into milestones. For each
  > task give ID & title, Goal, Context (files/areas), Done-when (checkable criteria), and
  > Depends-on. Order them so each builds on the last."
- **Done when:** you could hand any single task to an agent with no extra explanation.

---

## 4. `AGENTS.md` — the agent's house rules  *(lives at REPO ROOT, uppercase)*
- **Structure:** Project overview · Repo layout · Commands (install/run/typecheck/lint/test) · Conventions · Git & PRs · Security & privacy · Do-NOT list · Self-check before finishing.
- **Questions to answer:**
  1. What's the stack and how do you run/test/lint it?
  2. How is the repo organized (folders)?
  3. Coding conventions (language strictness, components, where logic lives, styling, naming)?
  4. Git/branch/commit/PR rules?
  5. Security & secrets handling?
  6. What should the agent NEVER do?
  7. How should the agent verify its own work before finishing?
- **Prompt for Claude:**
  > "Using `docs/mother.md`, write a root `AGENTS.md` following the open AGENTS.md
  > standard: project overview, repo layout, build/run/test/lint commands, conventions,
  > git/PR rules, security, an explicit Do-NOT list, and a self-check checklist. Keep it
  > short and accurate."
- **Done when:** a brand-new agent could set up, build, follow your conventions, and verify its work without asking.

---

## 5. `glossary.md` — shared vocabulary
- **Structure:** alphabetical (or grouped) term → one-line definition.
- **Questions to answer:** What domain words appear in your app, and what does each mean *exactly*? Any words people commonly confuse?
- **Prompt for Claude:**
  > "From `docs/mother.md` and `docs/design.md`, extract every domain term and define each
  > in one precise line in `docs/glossary.md`. Note any that are easily confused."
- **Done when:** there's exactly one definition per term and the docs use those words consistently.

---

## 6. `decisions.md` — decision log (ADRs)
- **Structure:** newest-first entries: ID · date · title · Decision · Why · Alternatives/Trade-off.
- **Questions to answer:** For each meaningful choice — what did you decide, why, and what did you reject?
- **Prompt for Claude:**
  > "Create `docs/decisions.md` as a dated, newest-first decision log. For each key choice
  > in `docs/mother.md` (platform, stack, auth, scope cuts), write an ADR with Decision,
  > Why, and Alternatives/Trade-offs."
- **Done when:** every non-obvious choice has a recorded reason so nobody re-argues it.

---

## 7. `roadmap.md` — the timeline
- **Structure:** Now (MVP) → Next → Later → Future, each with a theme + gate/goal.
- **Questions to answer:** What ships in v1? What's the gate to move on? What's v1.x and v2? What's "maybe"?
- **Prompt for Claude:**
  > "From `docs/mother.md` §3 and §10, write `docs/roadmap.md` as phases (Now/Next/Later/
  > Future) with a one-line theme and a success gate for each. Mark uncommitted items."
- **Done when:** anyone can see what's in v1 vs later and what triggers the next phase.

---

## 8. Optional docs (Tier 3) — structure + key question
Create only when that area gets real; otherwise keep as a section inside a core doc.

| File | Structure (brief) | Key question to answer |
|---|---|---|
| `architecture.md` | system diagram · components · data flow · key tech decisions | How do the pieces fit and talk to each other? |
| `data-model.md` | each object: fields, types, relationships, constraints | What are the things, and how do they relate? |
| `api.md` | per endpoint: method, path, input, output, errors, auth | What can the client call, and what comes back? |
| `content.md` | UI copy by screen · tone of voice · empty/error strings | What words appear on screen, in what voice? |
| `brand.md` | logo, color, type, spacing, iconography, do/don'ts | What's the visual identity? |
| `metrics.md` | events to log · funnels · success KPIs · dashboards | What do we measure and why? |
| `security.md` | authn/authz · data handling · secrets · threat notes | How is user data kept safe? |
| `testing.md` | what to test · unit/integration/e2e · coverage bar | How do we know it works? |
| `personas.md` | 1–3 personas: goals, frustrations, context | Who are we really designing for? |
| `competitors.md` | rivals · strengths/weaknesses · our wedge | Why us, not them? |
| `open-questions.md` | running list of unknowns, assumptions, risks | What don't we know yet? |
| `prompts.md` | reusable, named prompts for Codex/Claude | What prompts do we run repeatedly? |

**Generic prompt for any optional doc:**
> "Using `docs/mother.md` as the source of truth, write `docs/<name>.md` with these
> sections: <structure from the table>. Keep it lean and use concrete examples."
