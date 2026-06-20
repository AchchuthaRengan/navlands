<!-- EXAMPLE — sample app "Habitloop". Shared vocabulary so everyone (and the agent)
     uses the same words for the same things. -->

# Habitloop — `glossary.md`  · EXAMPLE

- **Habit** — a thing the user wants to do daily (e.g. "Read 10 pages"). Has a name, icon, color, and optional reminder.
- **Check-in** — the user's record for a habit on a given day: `done` or `skip`. Max one per habit per day.
- **Done** — the user completed the habit that day. Counts toward the streak.
- **Skip** — the user intentionally skipped (e.g. rest day). Neutral — does **not** break the streak.
- **Missed** — no check-in for a past day. **Breaks** the streak.
- **Streak** — number of consecutive days ending today that are `done` (skips neutral, misses break). *Derived, never stored.*
- **Reminder** — a local notification fired at the habit's `reminderTime`.
- **Today screen** — the home screen listing the habits due today.
- **Local-first** — all data lives on-device and works offline; cloud sync is optional/later.
- **Guest** — a user with no account; data stays on-device only.
