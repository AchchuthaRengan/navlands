<!-- EXAMPLE — sample app "Habitloop". This is the agent's house-rules file.
     In a real project it lives at the REPO ROOT (not in docs/) so Codex auto-loads it. -->

# AGENTS.md — Habitloop  · EXAMPLE

## Project overview
Habitloop is an iOS-first, local-first daily habit tracker built with Expo + React
Native + TypeScript. See `docs/goal.md`, `docs/design.md`, `docs/task.md` for what & why.

## Repo layout
```
src/
  screens/      one file per screen (Today.tsx, HabitDetail.tsx, …)
  components/   reusable UI (HabitRow, StreakBadge, CheckButton, …)
  store/        Zustand stores
  lib/          pure logic (streak.ts, db.ts, notifications.ts)
  theme/        tokens (colors, type, spacing)
tests/          unit tests (mirrors src/)
```

## Commands
- Install: `npm install`
- Run: `npx expo start`
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`   ·   Format: `npm run format`
- Test: `npm test`  (Jest)

## Conventions
- **TypeScript strict**; no `any`. Functional components + hooks only.
- Business logic lives in `src/lib/` as **pure, tested functions** — never in components.
- State via Zustand; never store derived values (compute streaks on read).
- Styling via theme tokens only — no hardcoded colors/sizes.
- File names: components `PascalCase.tsx`, logic `camelCase.ts`.

## Git & PRs
- Branch per task: `feat/T-05-today-screen`.
- Conventional commits: `feat:`, `fix:`, `chore:`.
- One task = one PR. PR description links the task ID and its "Done-when".

## Security & privacy
- No PII in analytics. Habit data stays on-device until the user opts into sync.
- Never commit secrets; read keys from `app.config.ts` env. Apple sign-in tokens via SecureStore.

## Do NOT
- ❌ Add packages without need (keep the dependency list tiny).
- ❌ Build non-goals (social, Android, points) — see `docs/goal.md`.
- ❌ Refactor unrelated files inside a task PR.

## Done / self-check before finishing a task
1. `tsc --noEmit`, `lint`, and `test` all pass.
2. New logic has unit tests.
3. The task's "Done-when" is demonstrably true (note how you verified it).
