# navlands — Harness Extension Plan (`HARNESS.md`)

> The complete catalog of **every way you can extend/configure the agent harness**
> (Claude Code + Codex), followed by the **right-sized loadout for navlands** — staged,
> so we add each piece only when it starts paying rent.
>
> **Prime directive — "not more, not less":** a rule earns its place only when the
> agent got something wrong (or asked you something) **twice**. One-off mistakes get a
> chat correction; repeated ones get a rule. Stale rules get deleted. Config you add
> before the code exists is guesswork — stage it.

---

## Part 1 — The full catalog (10 extension types)

Mapped to the 9 harness components (§ = which component it feeds).

### E1 · Instruction files — § 07 system prompt

**What:** durable house rules injected into the model's briefing every turn.

- Codex: `AGENTS.md` (repo root, auto-loaded; can nest per folder in monorepos).
- Claude Code: `CLAUDE.md` (repo root; supports `@file` imports; can nest per folder).
- Personal (all repos): `~/.claude/CLAUDE.md` / `~/.codex/AGENTS.md`.
  **Dual-tool trick:** keep `AGENTS.md` as source of truth; `CLAUDE.md` contains just `@AGENTS.md`.
  **Right size:** ≤ ~150 lines. Commands, layout, conventions, do-nots, self-check. No prose.

### E2 · Subagents — § 04

**What:** named specialists with their own system prompt, tool list, model, and turn budget.

- Claude Code: `.claude/agents/<name>.md` (YAML frontmatter: `name, description, tools, disallowedTools, model, permissionMode, maxTurns, memory`).
- Codex: `.codex/agents/<name>.toml`.
  **Use when:** a role repeats and deserves different powers than the main agent
  (e.g. a read-only reviewer). The `description` decides when it's auto-delegated to.
  **Right size:** 2–4 project subagents max. More = delegation confusion.

### E3 · Skills — § 03 / § 05

**What:** on-demand "how we do X here" playbooks the agent loads only when relevant
(cheap: they don't sit in context permanently, unlike E1).

- Claude Code: `.claude/skills/<name>/SKILL.md` (folder may bundle scripts/templates).
- Codex: skills via `skills.config`.
  **Use when:** a multi-step procedure recurs: "add a screen", "add an API endpoint",
  "regenerate child docs from mother.md".

### E4 · Slash commands — § 03

**What:** reusable prompts you trigger by hand: `.claude/commands/<name>.md` → `/name`.
**Use when:** you keep typing the same request. Thinner than a skill (no bundled files).
Examples: `/new-task T-xx`, `/sync-docs`, `/review-screen`.

### E5 · Hooks — § 08

**What:** deterministic scripts at lifecycle points (`PreToolUse`, `PostToolUse`,
`SessionStart`, `Stop`…), configured in `.claude/settings.json`. Unlike instructions,
hooks **always** run — use them for MUST-happen rules, not SHOULD-happen ones.
Examples: auto-run lint/typecheck after every file edit; block edits to `docs/examples/**`;
run tests when the agent claims it's done.
**Right size:** 2–3. Every hook adds latency to every matching action.

### E6 · Permissions & sandbox — § 09

**What:** the one true **override**. `allow` / `ask` / `deny` rules
(`deny > ask > allow`; scopes: managed > CLI > local > project > user) in
`.claude/settings.json`; Codex: `sandbox_mode` + approval policy in `config.toml`.
**Right size:** deny secrets + destructive ops; allow the boring loop (test/lint/read);
ask for the irreversible (push, deploy, install).

### E7 · MCP servers (external tools) — § 03

**What:** plug real services in as tools: `.mcp.json` (Claude Code) / `mcp_servers`
(Codex `config.toml`). For navlands: **Figma** (your screens!), **GitHub**, a database
(e.g. Supabase/Postgres), **Playwright** (agent sees the running app).
**Right size:** every connected server's tool list eats context — connect only what the
current phase uses.

### E8 · Settings & profiles — § whole harness

**What:** `.claude/settings.json` (team, committed) vs `settings.local.json`
(personal, gitignored) vs `~/.claude/settings.json`; env vars; model choice.
Codex: `config.toml` + named profiles (e.g. a locked-down "ci" profile).

### E9 · Memory & progress artifacts — § 06 persistence

**What:** files the agent reads/writes to survive across sessions — you already own this:
`docs/task.md` checklists, `docs/decisions.md`, git history, plus a lightweight
`docs/progress.md` ("done / in-flight / next"), and per-subagent `memory` dirs.
**Rule:** the repo, not the chat, is the memory. If it matters, it's in a file.

### E10 · CI / cloud-level agents — outside the local loop

**What:** agents that run without you: GitHub Actions (`@claude` mentions,
auto PR review), Codex cloud tasks, PR-watch/auto-fix sessions.
**Use when:** PRs are flowing. The pattern: local agent builds → cloud agent reviews →
CI hook-checks. Not before there's code.

_(Also exists, rarely needed: plugins — bundles of E2+E3+E4+E7 shared across repos;
output styles; statusline. Skip until navlands is a team.)_

---

## Part 2 — The navlands loadout, staged

### Phase 0 · NOW (docs phase — before any code)

Goal: specs get written; nothing else earns rent yet.

| Add                                                  | Contents                                                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AGENTS.md` (root) + `CLAUDE.md` = `@AGENTS.md` (E1) | doc system map; "mother.md is source of truth — edit it first, then regenerate children"; do-nots: don't touch `docs/examples/**`, don't invent product facts not in mother.md |
| Minimal permissions (E6)                             | `deny`: `Read(./.env*)`, `Bash(rm -rf *)` · `ask`: `Bash(git push *)`                                                                                                          |
| `/sync-docs` command (E4)                            | "Regenerate goal/design/task from mother.md; list what changed"                                                                                                                |

**That's all.** No subagents, no hooks, no MCP — nothing repeats yet.

### Phase 1 · Interview done, stack chosen (first code)

| Add                                               | Why now                                                     |
| ------------------------------------------------- | ----------------------------------------------------------- |
| Real commands + conventions into `AGENTS.md` (E1) | install/run/test/lint exist now                             |
| Permissions widen (E6)                            | `allow`: test/lint/typecheck/read · `ask`: package installs |
| Hook: lint+typecheck on every edit (E5)           | catches drift deterministically                             |
| MCP: **Figma** (E7)                               | pull your screen designs straight into design.md / code     |
| Skill: `add-screen` (E3)                          | the moment you build screen #2 the same way as #1           |

### Phase 2 · Building through task.md

| Add                             | Why now                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Subagent `screen-builder` (E2)  | builds ONE screen from design.md; `tools: Read, Write, Edit, Grep`; can't run bash |
| Subagent `reviewer` (E2)        | read-only (`Read, Grep, Glob`); checks a PR against the task's Done-when           |
| Hook: run tests on Stop (E5)    | blocks "done" claims that don't pass                                               |
| `docs/progress.md` (E9)         | agent updates it each task; sessions become resumable                              |
| MCP: database + Playwright (E7) | once a backend/running app exists                                                  |

### Phase 3 · PRs flowing → ship

| Add                                    | Why now                                 |
| -------------------------------------- | --------------------------------------- |
| GitHub Action: auto-review on PR (E10) | second pair of eyes on every PR         |
| PR watch/auto-fix session (E10)        | babysits CI to green                    |
| Codex `config.toml` profiles (E8)      | a strict "ci" profile vs your local one |

### Deliberately NEVER (for solo-MVP navlands)

- ❌ >4 subagents, plugin packaging, output styles/statusline, nested AGENTS.md
  (not a monorepo), hooks for style preferences (that's what lint configs are for),
  and any rule restating what the linter/typechecker already enforces.

---

## Part 3 — Keeping it "perfect level"

1. **The two-strikes test:** wrong twice → rule. Never pre-write rules for imagined failures.
2. **Right tool for the rule:** MUST-happen → hook (deterministic). SHOULD-happen → AGENTS.md. HOW-to-do-X → skill (loads on demand). WHO-does-X → subagent. MAY-it-happen → permissions.
3. **Monthly prune:** any AGENTS.md line that hasn't prevented a mistake lately gets cut. Context is rent; every line pays or leaves.
4. **One source of truth per fact:** product facts live in mother.md; process rules in AGENTS.md; never both.
