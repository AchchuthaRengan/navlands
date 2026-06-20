# navlands — Documentation Index

> The map of every `.md` file in this project. This is the table of contents for the
> whole doc system. **Status key:** ✅ exists · ⬜ planned (create soon) · ➕ optional
> (only when you actually need it).
>
> ⚠️ **Lean beats bloat.** AI agents work better with a *small set of high-signal
> docs* than a pile of half-empty ones. Don't create a file until it earns its place.
> Many items below are fine as a **section inside another doc** instead of a new file.

**Two companions:** [`PLAYBOOK.md`](./PLAYBOOK.md) — how to create each doc + the exact
prompts for Claude · [`examples/habitloop/`](./examples/habitloop/) — every core doc fully
filled in for a sample app, so you can see what "good" looks like.

---

## The picture

```
navlands/
├── README.md                 ✅ Human front door — what it is + how to run it
├── AGENTS.md                 ⬜ House rules for the AI agent (ROOT, auto-loaded)
├── CHANGELOG.md              ➕ Notable changes per version
├── CONTRIBUTING.md           ➕ How humans contribute
├── SECURITY.md               ➕ How to report a vulnerability (GitHub convention)
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md   ➕ Checklist shown on every PR
│   └── ISSUE_TEMPLATE/bug.md      ➕ Bug-report template
└── docs/
    ├── INDEX.md              ✅ This file — the map
    ├── mother.md             ✅ MASTER source of truth (the blueprint)
    ├── INTERVIEW.md          ✅ Q&A guide used to fill mother.md
    ├── PLAYBOOK.md           ✅ Per-doc structure + exact prompts for Claude
    ├── goal.md               ⬜ Why we build it + what success means
    ├── design.md             ⬜ Screens, flows, look & feel, data model
    ├── task.md               ⬜ The build, in small ordered jobs
    ├── glossary.md           ⬜ Shared vocabulary (domain terms)
    ├── decisions.md          ⬜ Decision log — "we chose X over Y because…"
    ├── roadmap.md            ➕ High-level phases over time (v1 → v2 → v3)
    ├── architecture.md       ➕ Technical structure (split from design.md if big)
    ├── data-model.md         ➕ Objects / fields / relationships
    ├── api.md                ➕ Endpoint contracts (if there's a backend)
    ├── content.md            ➕ UI copy / microcopy / tone of voice
    ├── brand.md              ➕ Colors, type, logo (if not inside design.md)
    ├── metrics.md            ➕ Analytics events & success metrics
    ├── security.md           ➕ Security & privacy requirements
    ├── testing.md            ➕ Test / QA strategy
    ├── personas.md           ➕ User personas (if not inside goal.md)
    ├── competitors.md        ➕ Market / competitive analysis
    ├── open-questions.md     ➕ Running list of unknowns & assumptions
    ├── prompts.md            ➕ Reusable Codex prompts (prompt library)
    └── examples/
        └── habitloop/        ✅ Full worked example of every core doc
```

---

## Tier 1 — Core (create these)

| File | What it contains | Status |
|---|---|---|
| `README.md` | For **humans**: one-liner, what it is, how to run it. Not for the agent. | ✅ |
| `docs/mother.md` | The **master** spec — everything. Source of truth. | ✅ |
| `AGENTS.md` *(root)* | The agent's house rules: repo layout, build/test/lint commands, code style, git/PR rules, security, **what NOT to do**. Open standard — Codex loads it **automatically** because it sits at the repo root. | ⬜ |
| `docs/goal.md` | Why we build it, who for, the core scenario, success metrics, **non-goals**. ~1 page. | ⬜ |
| `docs/design.md` | Screen list + what each does, navigation/flows, look & feel, data model. | ⬜ |
| `docs/task.md` | The build broken into small, testable, single-PR jobs with "Done when…" criteria. | ⬜ |

## Tier 2 — Strongly recommended (high value, low bloat)

| File | What it contains | Status |
|---|---|---|
| `docs/glossary.md` | Every domain word defined once, so you + the agent use language consistently. | ⬜ |
| `docs/decisions.md` | A dated log of choices and *why* (so nobody re-argues them later). | ⬜ |
| `docs/roadmap.md` | The big-picture phases (v1, v2, v3). `task.md` is granular; this is the timeline. | ➕ |

## Tier 3 — Add only when relevant

`architecture.md`, `data-model.md`, `api.md`, `content.md`, `brand.md`, `metrics.md`,
`security.md`, `testing.md`, `personas.md`, `competitors.md`, `open-questions.md`,
`prompts.md` — each is great **once that area gets real**. Until then, keep it as a
heading inside `mother.md` / `design.md` / `goal.md`.

## Tier 4 — Repo hygiene (standard, mostly templated)

`CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/PULL_REQUEST_TEMPLATE.md`,
`.github/ISSUE_TEMPLATE/*.md`. Nice for an open or team project; skip for a solo MVP.

---

## Two things people miss

1. **`AGENTS.md` goes at the repo ROOT and is spelled uppercase.** That's where Codex,
   Cursor, Jules, etc. automatically look. (In a monorepo you can also nest one per
   subfolder — agents read the nearest one.) Don't bury it in `docs/`.
2. **Most "extra" docs are sections, not files.** Personas live in `goal.md`; brand
   lives in `design.md`; security lives in `AGENTS.md` — until they grow big enough to
   deserve their own page.

## How it maps to Codex's 4 prompt elements

**Goal** → `goal.md` · **Context** → `design.md` · **Constraints** → `AGENTS.md` ·
**Done-when** → acceptance criteria in `task.md`.
