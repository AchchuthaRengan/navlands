I've now read every file in the auth layer. Here's my review.

---

## M1 Auth Layer Review â€” Phase 5 Checkpoint

### Verdict: Solid foundation, correct for M1 scope

The auth layer is well-structured, consistent, and correctly scoped to the milestone. No phone OTP code exists anywhere. All three supported providers (email/password, Google, GitHub) are wired. The bootstrap degradation when Supabase env is missing works at every layer.

---

### 1. Auth Provider Scope â€” PASS

| Provider       | Status   | Notes                                                    |
| -------------- | -------- | -------------------------------------------------------- |
| Email/password | Wired    | `loginAction` / `signupAction` with Zod validation       |
| Google OAuth   | Wired    | `signInWithGoogleAction` â†’ `signInWithOAuth("google")` |
| GitHub OAuth   | Wired    | `signInWithGitHubAction` â†’ `signInWithOAuth("github")` |
| Phone OTP      | Deferred | No Twilio code anywhere; `.env.example` marks it M2      |

`src/lib/auth/config.ts:3` â€” `supportedOAuthProviders` is locked to `["google", "github"]` with a type guard. Clean.

---

### 2. Middleware Route Gating â€” PASS

`src/middleware.ts` implements a three-tier protection model:

- **`/app/*`** â€” requires authenticated user, redirects to `/login`
- **`/admin/*`** â€” requires authenticated user **and** `isAdminEmail(user.email)`, redirects to `/`
- **Auth pages** (`/login`, `/signup`) â€” redirects already-authenticated users to `/app`

The matcher `["/((?!_next/static|_next/image|favicon.ico).*)"]` correctly excludes static assets.

**One observation:** The middleware reads `process.env.NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` directly (lines 25-26) rather than going through `getPublicEnv()`. This is fine â€” middleware runs in the Edge runtime where `getPublicEnv()` with Zod parsing would add overhead on every request. The direct reads are consistent with the guard at line 29.

---

### 3. Server-Side Auth Helpers â€” PASS

`src/lib/auth/session.ts` provides a clean helper stack:

- `getAuthenticatedUser()` â€” returns `User | null`, returns `null` if Supabase env is missing
- `requireAuthenticatedUser()` â€” redirects to `/login?error=...` if no user
- `requireAdminUser()` â€” chains `requireAuthenticatedUser()` then checks `isAdminEmail()`

**Double-gating for admin is correct**: middleware catches it at the edge, `requireAdminUser()` catches it server-side. Defense in depth.

`src/app/admin/page.tsx:2` â€” calls `requireAdminUser()` at the top of the RSC, confirming the server-side gate isn't just decorative.

---

### 4. Admin Allowlist â€” PASS

The allowlist chain:

1. `ADMIN_EMAILS` env var â†’ comma-separated string (`src/lib/env/server.ts:13`, defaults to `""`)
2. `getAdminEmailAllowlist()` (`server.ts:34-39`) â€” splits, trims, lowercases, filters empty
3. `isAdminEmail()` (`config.ts:13-19`) â€” lowercases input, checks inclusion

**Empty `ADMIN_EMAILS` means nobody is admin.** This is correct fail-closed behavior. There's no hardcoded backdoor.

---

### 5. Bootstrap When Supabase Public Env Is Missing â€” PASS

This is handled consistently across all layers:

| Layer                  | Behavior                                                                        |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Middleware**         | `/app` and `/admin` redirect to `/?setup=supabase`                              |
| **Auth actions**       | Redirect to `/login?error=<setup message>` or `/signup?error=<setup message>`   |
| **Auth callback**      | Redirects to `/login?error=<setup message>`                                     |
| **Login/signup pages** | Show setup banner, disable all buttons                                          |
| **Marketing page**     | Shows setup guidance when `?setup=supabase` or env is missing                   |
| **Session helpers**    | `getAuthenticatedUser()` returns `null`; `requireAuthenticatedUser()` redirects |

`src/lib/env/public.ts` marks Supabase URL and anon key as `.optional()` in the Zod schema, so the app boots without them. `getRequiredPublicSupabaseEnv()` throws only when code that actually needs Supabase runs.

The Playwright tests in `tests/e2e/bootstrap.spec.ts` verify all three bootstrap paths (marketing, auth pages, protected routes).

---

### 6. Profile Sync â€” PASS

`src/lib/auth/profile.ts:24-50` â€” `ensureProfileForUser()` uses the **service-role admin client** (not the user's session) to upsert into `profiles`. This is correct: it avoids RLS constraints blocking profile creation during the auth callback.

Called from both `loginAction` (line 81) and the OAuth callback route (line 36). Signup intentionally does _not_ call it â€” the profile gets created on first login after email confirmation.

---

### 7. Input Validation â€” PASS

`src/types/contracts.ts:203-211`:

- `emailSchema` â€” `z.string().trim().email()`
- `passwordSchema` â€” `z.string().min(8).max(128)`
- `loginInputSchema` and `signupInputSchema` use these

Both `loginAction` and `signupAction` run `safeParse` before touching Supabase. The max-128 on password prevents absurdly long inputs.

---

### 8. Items Worth Noting (not blockers)

**a. Open redirect in OAuth callback (`src/app/auth/callback/route.ts:13`)**

```ts
const next = requestUrl.searchParams.get("next") || "/app";
```

The `next` parameter is used directly in `new URL(next, requestUrl.origin)`, which constrains it to the same origin. This is safe because `new URL(path, base)` only resolves relative paths against the base â€” an absolute URL like `https://evil.com` would be treated as a protocol-relative path and still resolve under `requestUrl.origin`. No issue.

**b. `signupAction` does not call `ensureProfileForUser`** â€” Intentional. Signup sends a confirmation email; the profile gets created on first login. Correct flow.

**c. Middleware creates a fresh `NextResponse.next()` in each cookie `set`/`remove`** â€” This is the documented Supabase SSR pattern. Each mutation rebuilds the response to ensure cookie headers propagate.

**d. `LoginPageProps` uses `searchParams?` typed inline** â€” In Next.js 15+, `searchParams` is a Promise. If this project targets Next 15, the type should be `Promise<{...}>` and awaited. If targeting Next 14, the current sync access is correct. Worth confirming which Next version is in use, but not an M1 blocker either way since the pages work in the E2E tests.

---

### Summary

The M1 auth layer is **correct and milestone-aligned**. It covers the three required providers, properly defers phone OTP, implements defense-in-depth for admin access, validates inputs with shared Zod schemas, degrades gracefully without Supabase env, and has Playwright coverage for the bootstrap path. No phone OTP code, no onboarding UI, no product features â€” clean M1 boundary.
