import { describe, expect, it } from "vitest";

import { createMemoryAnonymousAiRateLimiter } from "@/lib/server/rate-limit";

describe("anonymous ai rate limiter", () => {
  it("trips on the third request when the limit is two", async () => {
    let now = 1_000;
    const limiter = createMemoryAnonymousAiRateLimiter({
      limit: 2,
      windowSeconds: 60,
      now: () => now,
    });

    await expect(limiter.limit("anon:user")).resolves.toMatchObject({
      success: true,
      remaining: 1,
    });
    await expect(limiter.limit("anon:user")).resolves.toMatchObject({
      success: true,
      remaining: 0,
    });
    await expect(limiter.limit("anon:user")).resolves.toMatchObject({
      success: false,
      remaining: 0,
    });

    now += 61_000;

    await expect(limiter.limit("anon:user")).resolves.toMatchObject({
      success: true,
      remaining: 1,
    });
  });
});
