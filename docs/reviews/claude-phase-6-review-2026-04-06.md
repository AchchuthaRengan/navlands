Here is the full review.

---

## M1 AI Gateway Review

### 1. Mock mode as required default ï¿½ **PASS**

`server.ts:7` ï¿½ `AI_PROVIDER_MODE` defaults to `"mock"` in the Zod schema, and `server.ts:22` double-defaults with `|| "mock"`. No environment variable is required for mock mode to activate. The gateway creates real provider stubs (`createFallbackOnlyProvider`) for `openai` and `anthropic` that immediately throw, so if someone sets `AI_PROVIDER_MODE=openai` without wiring a real provider, the fallback path catches the error and falls back to mock (`gateway.ts:386-396`). Mock mode is the only mode that actually produces output in M1.

**No issue.**

---

### 2. Shared provider abstraction only ï¿½ **PASS with one note**

The `OperationPayloadMap` type (line 42) and the `ProviderInvocation<TInput, TOutput>` signature (line 78) define a single unified shape. All five operations go through `executeOperation` (line 329). No operation has a provider-specific code path.

**Note:** The `operationMap` on line 359 is hardcoded to `mockProvider.*` regardless of which provider was resolved:

```ts
const operationMap: Record<
  keyof OperationPayloadMap,
  ProviderInvocation<any, any>
> = {
  generatePath: mockProvider.generatePath,
  parseResume: mockProvider.parseResume,
  // ...
};
```

This is intentional for M1 (mock is the only real implementation), but when M2 adds real providers, this map will need to dispatch per-provider. The current structure doesn't break anything ï¿½ the non-mock providers throw before this map is reached, and the fallback path uses this same map. Just worth flagging that this is a known M1 shortcut, not an abstraction gap.

---

### 3. Logging to `ai_call_log` ï¿½ **PASS**

**Application layer:** `gateway.ts:402-415` calls `usageRepository.recordCall(...)` on every execution, capturing: userId, operation name, resolved provider, provider mode, status (`success` | `fallback` | `error`), token counts, latency, and both request/response payloads.

**Database layer:** The `record_ai_call` RPC function (migration lines 288-370) is `SECURITY DEFINER` with `SET search_path = public`, correctly inserting into `ai_call_log` with `greatest(coalesce(...), 0)` guards on token columns. RLS is enabled on `ai_call_log` with a `select self` policy (migration line 650-654), and writes go through the `SECURITY DEFINER` function, so no user-facing insert policy is needed.

**One gap:** The gateway does not log when the budget check itself fails. If `getDailyBudget` throws or the budget is exhausted (line 354), the function throws before reaching `recordCall`. This means budget-exhaustion events leave no `ai_call_log` trace. Consider whether an `error`-status log entry should be written before throwing the budget error.

---

### 4. Budget tracking via `ai_daily_budget` ï¿½ **PASS with one issue**

The `record_ai_call` RPC atomically upserts `ai_daily_budget` with `ON CONFLICT (budget_date, provider) DO UPDATE`, incrementing `request_count` and token counters. The gateway reads the budget before execution (line 345) and checks `hard_limit_tokens` (line 349-357).

**Issue ï¿½ `InMemoryAiUsageRepository.recordCall` uses its own `new Date()` instead of the injected `now()`:** The gateway passes `dependencies.now` for the budget date on line 343, but `InMemoryAiUsageRepository.recordCall` at `repository.ts:47` calls `new Date().toISOString()` independently. In tests, if a custom `now()` is injected to simulate a different date, the in-memory repository will still record under the real clock's date. This doesn't affect production (which uses the Supabase repository), but it breaks the testability contract. The gateway computes `budgetDate` but never passes it to `recordCall` ï¿½ the repository picks its own date.

---

### 5. Contract validation against shared schemas ï¿½ **PASS**

Every public gateway method validates its input through Zod `.parse()` before passing to `executeOperation`:

- `gateway.ts:433` ï¿½ `pathGenerationInputSchema.parse(input)`
- `gateway.ts:440` ï¿½ `resumeParseInputSchema.parse(input)`
- `gateway.ts:449` ï¿½ `whatIfSimulationInputSchema.parse(input)`
- `gateway.ts:458` ï¿½ `recommendationExplanationInputSchema.parse(input)`
- `gateway.ts:468` ï¿½ `contentModerationInputSchema.parse(input)`

Every mock provider method validates its output through the corresponding output schema's `.parse()` (e.g. `gateway.ts:136`, `gateway.ts:214`, etc.). The `suggestionCardSchema` is also validated inline at `gateway.ts:102`.

All schemas live in `src/types/contracts.ts` and are re-exported from `src/lib/validation/contracts.ts`. The gateway and the contracts share a single source of truth.

**No issue.** Both input and output validation run on every call, which means a schema drift will hard-fail immediately rather than silently pass invalid data.

---

### 6. Anonymous rate limiting integration ï¿½ **PASS**

`gateway.ts:334-338` ï¿½ Rate limiting fires when `context.userId` is absent and `context.anonymousKey` is present. The `RateLimitExceededError` is a proper typed error class (`rate-limit.ts:137`).

The rate limiter has three tiers:

- **Upstash Redis** when `UPSTASH_REDIS_REST_URL` + token are set (production)
- **In-memory** sliding window as automatic fallback (dev/CI)
- **Disabled** mode for tests

The default limit is 2 requests per 60 seconds for anonymous users, which is conservative and appropriate for M1.

**One subtlety:** Authenticated users (`context.userId` set) bypass rate limiting entirely. This is correct for M1 where auth users have budget limits instead, but the gateway has no per-user rate limit ï¿½ only the daily budget hard cap serves as a ceiling. This is fine for M1 scope.

---

### Summary

| Concern                    | Verdict                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| Mock mode default          | **Clean**                                                            |
| Shared abstraction         | **Clean** (M1 shortcut in `operationMap` is intentional)             |
| `ai_call_log` logging      | **Minor gap** ï¿½ budget-exhaustion throws are not logged            |
| `ai_daily_budget` tracking | **Minor gap** ï¿½ `InMemoryAiUsageRepository` ignores injected clock |
| Contract validation        | **Clean** ï¿½ input `.parse()` + output `.parse()` on every call     |
| Anonymous rate limiting    | **Clean**                                                            |

The two minor gaps are:

1. **Budget-exhaustion events are invisible.** When `hard_limit_tokens` is exceeded at `gateway.ts:354`, the throw happens before `recordCall`. An `error`-status log entry before throwing would make the exhaustion observable in `ai_call_log`.

2. **`InMemoryAiUsageRepository` clock skew.** `repository.ts:47` uses `new Date()` instead of accepting the budget date from the gateway. This makes date-sensitive unit tests unreliable if a custom `now()` is injected. The fix is to pass `budgetDate` as a parameter to `recordCall` or accept a clock in the repository constructor.

Neither gap is a safety risk for M1 ï¿½ the first is an observability improvement, the second only affects test fidelity.
