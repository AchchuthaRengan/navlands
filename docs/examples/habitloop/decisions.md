<!-- EXAMPLE — sample app "Habitloop". A dated log of decisions and WHY, so nobody
     (human or agent) re-argues settled choices. Newest on top. -->

# Habitloop — `decisions.md` (decision log)  · EXAMPLE

## ADR-005 · 2026-02-10 · Skips are neutral to streaks
- **Decision:** A `skip` neither advances nor breaks a streak.
- **Why:** Rest days shouldn't punish users; punishing them increases churn.
- **Alternatives:** skip breaks streak (too harsh); skip counts as done (dishonest).

## ADR-004 · 2026-02-08 · Local-first, sync later
- **Decision:** v1 stores everything on-device (MMKV); Supabase sync is post-v1.
- **Why:** Fastest path to a working MVP; app must work offline anyway.
- **Trade-off:** No multi-device in v1.

## ADR-003 · 2026-02-07 · Supabase for the (later) backend
- **Decision:** Use Supabase (Postgres + Apple auth) when we add sync.
- **Why:** Managed Postgres + auth in one; generous free tier; solo-friendly.
- **Alternatives:** Firebase (NoSQL, less SQL control); custom (too much for solo).

## ADR-002 · 2026-02-06 · Expo + React Native
- **Decision:** Build with Expo.
- **Why:** Fast iteration, OTA updates, easy notifications; cross-platform later.
- **Alternatives:** Swift/native (slower solo, iOS-locked); Flutter (smaller RN skill match).

## ADR-001 · 2026-02-05 · iOS-only for v1
- **Decision:** Ship iOS first.
- **Why:** Focus; target users skew iPhone; cuts scope in half.
- **Revisit:** after 30% D7 retention is hit.
