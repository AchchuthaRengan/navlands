# navlands — Documentation Index

> The map of every `.md` file in this project. **Status key:** ✅ exists · 🏠 exists
> only on the founder's machine (not committed) · ⬜ planned · ➕ optional.
>
> ⚠️ **Lean beats bloat.** AI agents work better with a _small set of high-signal
> docs_ than a pile of half-empty ones. Don't create a file until it earns its place.
>
> **Companions:** [`PLAYBOOK.md`](./PLAYBOOK.md) — how to create each doc + exact
> prompts · [`examples/habitloop/`](./examples/habitloop/) — every core doc filled in
> for a sample app.

---

## The picture

```
navlands/
├── README.md                 ✅ Human front door — what it is + links + how to run
├── AGENTS.md                 ✅ House rules for coding agents (root, auto-loaded)
├── CLAUDE.md                 ✅ One line: imports AGENTS.md for Claude Code
├── PLAN_M1.md                ✅ M1 execution contract (complete) — the "task.md" layer
├── PLAN_M2.md                ✅ M2 execution contract (in progress)
├── claude_insights.md        ✅ Claude's M1 Supabase/RLS review findings
├── docs/
│   ├── INDEX.md              ✅ This file — the map
│   ├── mother.md             ✅ MASTER product spec (code-grounded; ❓ gaps open)
│   ├── INTERVIEW.md          ✅ Q&A guide used to fill mother.md
│   ├── PLAYBOOK.md           ✅ Per-doc structure + exact prompts for Claude
│   ├── HARNESS.md            ✅ All harness extensions + staged navlands loadout
│   ├── STATUS.md             ✅ Checkpoint log — the "progress.md" layer
│   ├── DECISIONS.md          ✅ Decision log (D11…) — the "decisions.md" layer
│   ├── reviews/              ✅ Recorded Claude review checkpoints (M1)
│   ├── goal.md               ⬜ 1-page why/who/success — generate after interview
│   ├── design.md             ⬜ Screens/flows/tokens/data model — after interview
│   ├── glossary.md           ⬜ Path/node/edge/trust-label vocabulary (needed soon)
│   └── examples/habitloop/   ✅ Worked example of every core doc (sample app)
├── evals/README.md           ✅ Eval fixtures for the AI gateway
├── supabase/README.md        ✅ Database workflow notes
└── scripts/claude/*.md       ✅ Reusable Claude review prompts (a prompt library)
```

## Not committed yet — the original governing docs 🏠

`.prettierignore` references governing docs that existed in the worktree but were
never committed (recorded missing in D32): `wayframe-master-spec.md`,
`wayframe-data-model.md`, `wayframe-ai-boundaries.md`, `wayframe-milestones.md`,
`wayframe-parent-dashboard-memo.md`, `wayframe-spec-amendments.md`,
`ARCHITECTURE.md`, `LEARNINGS.md`, `CODEX_NEXT_STEPS.md`, `README_INIT.md`,
`IMPLEMENTATION_INITIALIZATION_CHECKLIST.md`.

**If these still exist on the founder's machine, commit or share them** — then
reconcile with `docs/mother.md` and record any conflicts in `docs/DECISIONS.md`
(per D32/D37). `wayframe-master-spec.md` is almost certainly the original
"mother" document.

## How the layers map

| This system says | In this repo it is                         |
| ---------------- | ------------------------------------------ |
| `mother.md`      | `docs/mother.md` (+ 🏠 `wayframe-*.md`)    |
| `goal.md`        | ⬜ to generate after the founder interview |
| `design.md`      | ⬜ to generate after the founder interview |
| `task.md`        | `PLAN_M1.md`, `PLAN_M2.md` (per milestone) |
| `AGENTS.md`      | root `AGENTS.md` (+ `CLAUDE.md` import)    |
| `decisions.md`   | `docs/DECISIONS.md`                        |
| `progress.md`    | `docs/STATUS.md`                           |
| `prompts.md`     | `scripts/claude/*.md`                      |

## Still optional (add only when the area gets real)

`roadmap.md` (M3+ sequencing), `architecture.md`, `data-model.md` (schema is in
`supabase/migrations/` + generated types for now), `api.md`, `content.md`,
`brand.md`, `metrics.md`, `security.md` (currently a section of `AGENTS.md`),
`testing.md`, `personas.md`, `competitors.md`, `open-questions.md` (currently the
❓ list inside `mother.md`), plus repo hygiene (`CHANGELOG.md`, `CONTRIBUTING.md`,
`.github/` templates) when the project goes public or multi-contributor.
