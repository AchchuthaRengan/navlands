<!-- EXAMPLE FILE — sample app "Habitloop", for illustration only.
     This shows what a *filled-in* mother.md looks like. Your real navlands
     version lives at docs/mother.md. -->

# Habitloop — Master Spec (`mother.md`)  · EXAMPLE

> Single source of truth for Habitloop. Codex splits this into `goal.md`,
> `design.md`, `task.md`, and `AGENTS.md`. Status: ✅ Complete (example).

## 0. How the docs relate
Goal → `goal.md` · Context → `design.md` · Constraints → `AGENTS.md` · Done-when → `task.md`.

## 1. Vision & Problem
- **Pitch:** Habitloop is a dead-simple habit tracker that helps busy people stick to daily habits by making check-ins a one-tap, streak helps them keep going.
- **Problem:** People start habits but quit within two weeks. Existing apps are cluttered, gamified to death, and feel like work.
- **Magic moment:** Tapping a habit "done" and watching the streak tick to a new record.
- **Why now/us:** Most trackers optimize for features; we optimize for *one calm screen you actually open every morning*.
- **Success (6–12 mo):** 10k installs, 30% Day-7 retention, median user with 2 active habits.

## 2. Users & Market
- **Primary user:** A 25–40 yr old on iPhone trying to build 1–5 personal habits (water, gym, reading). Not super techy; wants speed, not config.
- **Roles:** Single role (the individual). No admins, no social in v1.
- **Scenario:** Maya opens Habitloop at breakfast, sees "Today: 3 habits," taps two as done, snoozes one. At night a reminder nudges the last. She checks her 12-day reading streak and feels good.
- **Where/when:** Phone, mornings + evenings, daily.
- **Alternatives:** Streaks, Habitica, Apple Reminders. We win on *simplicity + calm design*.

## 3. Features & Scope
- **Can do:** create habit, check in (done/skip), see streak, get daily reminder, view calendar/stats, edit/delete habit.
- **MVP (v1):** create habit · daily check-in · streak · local reminder · simple stats.
- **Later:** cloud sync, Android, widgets, weekly habits, friends/sharing.
- **NON-goals (v1):** ❌ social ❌ gamification/points ❌ Android ❌ web ❌ AI coaching.
- **Happy path:** Onboard → create first habit → check in today → see streak = 1.

## 4. Screens & Flows
- **Screens:** Onboarding, Sign-in, Home/Today, Habit Detail, Add/Edit Habit (modal), Stats, Settings.
- **Navigation:** Bottom tabs (Today · Stats · Settings); Add/Edit is a modal.
- **First run:** 3 onboarding cards → optional sign-in (or "skip, stay local") → create first habit.
- **Edge states:** empty Today ("Add your first habit"), loading skeletons, offline banner, sync-error toast.

## 5. Look & Feel
- **Vibe:** calm, encouraging, minimal.
- **References:** Streaks (simplicity), Things 3 (typography), Oak (calm).
- **Brand:** soft off-white bg, one accent (teal), rounded cards. Font: Inter. Logo: TBD.
- **Modes:** light + dark. Accessibility: Dynamic Type, 4.5:1 contrast, VoiceOver labels.

## 6. Data & Logic
- **Objects:** User, Habit, CheckIn.
- **Relationships:** User has many Habits; Habit has many CheckIns (one per day).
- **Logic:** Streak = consecutive days with status `done` up to today; `skip` does not break a streak; missing day breaks it. Reminders are local notifications at `Habit.reminderTime`.
- **Capabilities:** local notifications, local storage; cloud sync = later.
- **Data source:** user-entered.

## 7. Accounts & Permissions
- **Auth:** optional. Guest (local-only) or Sign in with Apple. Sync requires sign-in.
- **Roles:** one. **Sensitive:** none beyond personal habit names (kept on-device until sync).

## 8. Tech & Platform
- **Platform:** iOS first (iOS 16+). Cross-platform-ready (React Native).
- **Stack:** React Native + Expo, TypeScript (strict), Zustand (state), local storage (MMKV); Supabase (auth + Postgres) for later sync.
- **Code:** greenfield. **Team:** solo founder. **Offline:** required (local-first).

## 9. Integrations & Services
- Expo Notifications (reminders), Sign in with Apple, Supabase (later), TelemetryDeck (privacy-friendly analytics).

## 10. Success, Constraints & Risks
- **Metrics:** D7 retention, # habits with 7+ day streak, daily check-in rate.
- **Constraints:** App Store guidelines; ship MVP in 6 weeks; solo budget.
- **Risks:** notification fatigue; streak-loss demotivation; iOS-only reach.
- **Launch goal:** TestFlight beta → App Store v1.
