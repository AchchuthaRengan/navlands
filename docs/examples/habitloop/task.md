<!-- EXAMPLE — sample app "Habitloop". Shows what a filled task.md looks like. -->

# Habitloop — `task.md` (the build plan) · EXAMPLE

> Small, testable, single-PR jobs (~1–4h each). Each has Goal · Context · Done-when ·
> Depends-on. Build top to bottom.

## Milestone M0 — Foundation

**T-01 · Project setup**

- Goal: Expo + TS app boots on iOS simulator.
- Context: repo root, `app.json`, `tsconfig`.
- Done-when: `npx expo start` runs; `npx tsc --noEmit` and `npm run lint` pass.
- Depends-on: —

**T-02 · Design tokens & base components**

- Goal: colors/type/spacing + Button, Card, EmptyState.
- Context: `src/theme/`, `src/components/`.
- Done-when: a Storybook/preview screen renders all tokens in light + dark.
- Depends-on: T-01

## Milestone M1 — Core data

**T-03 · Data layer + store**

- Goal: Habit/CheckIn models, MMKV persistence, Zustand store with CRUD.
- Context: `src/store/`, `src/lib/db.ts`.
- Done-when: unit tests cover create/check-in/delete; data survives app restart.
- Depends-on: T-01

**T-04 · Streak logic**

- Goal: `streak(habit, checkIns)` per the rules in design.md §4.
- Context: `src/lib/streak.ts`.
- Done-when: unit tests cover done-run, skip-neutral, gap-breaks, today/not-today.
- Depends-on: T-03

## Milestone M2 — Screens

**T-05 · Today screen**

- Goal: list today's habits with one-tap done/skip.
- Context: `src/screens/Today.tsx`, uses store + StreakBadge.
- Done-when: tapping Done updates streak + persists; empty state shows when no habits.
- Depends-on: T-02, T-04

**T-06 · Add/Edit Habit modal**

- Goal: create & edit a habit (name, icon, color, reminder).
- Done-when: new habit appears on Today; edit updates it; validation blocks empty name.
- Depends-on: T-03, T-05

**T-07 · Habit Detail + calendar heatmap**

- Done-when: shows streak, completion %, and a month heatmap from real check-ins.
- Depends-on: T-04, T-05

**T-08 · Stats screen**

- Done-when: range switch (week/month) recomputes completion % and streaks.
- Depends-on: T-07

## Milestone M3 — Polish & ship

**T-09 · Local reminders**

- Goal: schedule/cancel Expo notification at `reminderTime`.
- Done-when: editing/deleting a habit reschedules/cancels correctly.
- Depends-on: T-06

**T-10 · Onboarding + optional Apple sign-in**

- Done-when: first-run shows 3 cards then create-first-habit; "skip" keeps app local.
- Depends-on: T-05

**T-11 · Settings (theme, notifications, sign out)**

- Depends-on: T-09, T-10

**T-12 · TestFlight build**

- Done-when: signed build uploaded; smoke test of happy path passes on a device.
- Depends-on: all above
