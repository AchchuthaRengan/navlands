<!-- EXAMPLE — sample app "Habitloop". Shows what a filled design.md looks like. -->

# Habitloop — `design.md` (look & structure) · EXAMPLE

## 1. Screen inventory

| Screen                 | Purpose               | User can                                     | Shows                           |
| ---------------------- | --------------------- | -------------------------------------------- | ------------------------------- |
| Onboarding             | Explain value         | swipe, continue                              | 3 cards                         |
| Sign-in                | Optional account      | Sign in with Apple / skip                    | auth buttons                    |
| Home / Today           | Daily driver          | check in (done/skip), open habit, add        | today's habits + streaks        |
| Habit Detail           | Review one habit      | edit, delete, see history                    | calendar heatmap, streak, stats |
| Add/Edit Habit (modal) | Create/change a habit | name, pick icon/color, set reminder          | form                            |
| Stats                  | Motivation            | switch range                                 | streaks, completion %, calendar |
| Settings               | Account & prefs       | toggle theme, manage notifications, sign out | options                         |

## 2. Navigation & flows

- **Tabs:** Today · Stats · Settings. **Add/Edit** opens as a modal from Today.
- **Happy path:** Onboarding → (skip sign-in) → Add Habit → Today shows it → tap Done → streak = 1.
- **First run:** 3 onboarding cards → optional Sign in with Apple → create first habit.

## 3. Look & feel

- **Vibe:** calm, encouraging, minimal.
- **Color:** bg `#FAFAF7`, surface `#FFFFFF`, accent `#0EA5A4` (teal), text `#1A1A1A`; dark mode mirrors.
- **Type:** Inter — Title 28/bold, Body 16/regular, Caption 13.
- **Spacing:** 4-pt grid; cards radius 16, padding 16.
- **Components:** HabitRow, StreakBadge, CheckButton, CalendarHeatmap, PrimaryButton, EmptyState.
- **States:** empty ("Add your first habit"), loading skeleton, offline banner, error toast.
- **A11y:** Dynamic Type, ≥4.5:1 contrast, VoiceOver labels on CheckButton.

## 4. Data model

```
User { id, appleId?, createdAt }
Habit { id, userId?, name, icon, color, reminderTime?, createdAt, archivedAt? }
CheckIn { id, habitId, date (YYYY-MM-DD), status: 'done' | 'skip', createdAt }
```

- User 1—N Habit; Habit 1—N CheckIn (max one per date).
- **Derived:** `streak(habit)` = consecutive days ending today where status='done'; 'skip' is neutral; a missing day breaks it.

## 5. Architecture sketch

- **Client:** React Native (Expo) + TypeScript. State in Zustand; persistence in MMKV (local-first).
- **Notifications:** Expo Notifications scheduled at `Habit.reminderTime`.
- **Backend (later):** Supabase (Apple auth + Postgres) for multi-device sync; offline writes reconcile on reconnect.
- **Analytics:** TelemetryDeck (no PII).
