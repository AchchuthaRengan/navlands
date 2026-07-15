# M1 Supabase Baseline Review

### `ai_call_log`

**Risk: `record_ai_call` has no EXECUTE restriction.**
The function is `security definer` but there is no `REVOKE EXECUTE ON FUNCTION public.record_ai_call FROM anon, authenticated` in the migration. Any authenticated (or anon) client can call it via PostgREST and inject arbitrary token counts into `ai_daily_budget`. This is the highest-risk item.

```sql
-- missing from migration
revoke execute on function public.record_ai_call from anon, authenticated;
```

**Minor: `record_ai_call` sets `updated_at` explicitly in the ON CONFLICT clause AND the `ai_daily_budget_set_updated_at` trigger will also fire. Redundant, harmless.**

**RLS SELECT policy on `ai_call_log` uses `auth.uid() = user_id`.** Since `user_id` is nullable (ON DELETE SET NULL), deleted-user records match `NULL = NULL` → false, making them permanently invisible except to service role. This is correct behavior but should be a conscious decision, not an accident.

---

### `ai_daily_budget`

**RLS is enabled with zero policies.** All access is blocked for `anon`/`authenticated`. Writes only succeed via `record_ai_call` (security definer bypasses RLS). This is probably intentional (admin-only read), but there is no documented evidence — and no admin SELECT policy either. Admin tools will need service role to read budget data.

**Missing: compound index `(budget_date desc, provider)`.** The unique constraint covers point lookups but not range scans like "last 30 days across all providers."

---

### `resume_parses`

**`parse_status` is unconstrained freeform text.** Background workers polling for `pending` items could silently drift if status values aren't normalized. Add a CHECK constraint:

```sql
constraint resume_parses_parse_status_check
  check (parse_status in ('pending', 'processing', 'done', 'error'))
```

**Missing: index on `(parse_status)` or `(user_id, parse_status)`.** The existing `resume_parses_user_id_idx` helps per-user reads but not background worker queries like `WHERE parse_status = 'pending'`.

**RLS is complete (select/insert/update scoped to `user_id`).** No DELETE policy — fine for audit trail intent.

---

### Other RLS gaps

| Table             | Missing policy    | Intent                                                             |
| ----------------- | ----------------- | ------------------------------------------------------------------ |
| `admin_audit_log` | All (no policies) | Service role only — correct, but zero coverage                     |
| `content_flags`   | SELECT            | Reporters cannot see their own submitted flags                     |
| `notifications`   | DELETE            | Users cannot dismiss/delete their own notifications                |
| `paths`           | —                 | Status field is unconstrained text (same issue as `resume_parses`) |

---

### Missing indexes summary

| Index                                      | Rationale                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------------- |
| `ai_call_log (user_id, created_at desc)`   | Paginated call history queries — current separate indexes won't combine well |
| `resume_parses (parse_status)`             | Background worker polling for `pending` items                                |
| `votes (path_id)`, `votes (proof_item_id)` | Aggregate vote count queries — partial unique indexes don't serve these      |
| `notifications (user_id, read_at)`         | Unread count queries (`WHERE read_at IS NULL`)                               |

---

### No schema drift or structural hazards

The migration is fully idempotent (`IF NOT EXISTS`, `CREATE OR REPLACE`, `DROP ... IF EXISTS` on triggers/policies). The `can_read_path`/`can_write_path` helpers are security-invoker (correct — paths RLS applies transitively). No circular dependency issues.

---

**Priority fixes before M1 lands:**

1. Revoke direct execute on `record_ai_call` (budget integrity risk)
2. Add CHECK on `resume_parses.parse_status`
3. Add `(parse_status)` index on `resume_parses`

The rest are low-risk gaps for M1 scope.
