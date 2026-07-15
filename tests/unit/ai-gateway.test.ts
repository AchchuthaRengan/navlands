import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { createAiGateway } from "@/lib/ai/gateway";
import { InMemoryAiUsageRepository } from "@/lib/ai/repository";
import { createMemoryAnonymousAiRateLimiter } from "@/lib/server/rate-limit";
import { pathGenerationOutputSchema } from "@/types/contracts";

describe("ai gateway", () => {
  it("returns schema-valid mock output and records budget usage", async () => {
    const usageRepository = new InMemoryAiUsageRepository();
    const gateway = createAiGateway({
      usageRepository,
      anonymousRateLimiter: createMemoryAnonymousAiRateLimiter({
        limit: 2,
        windowSeconds: 60,
      }),
    });

    const fixture = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "evals", "mock", "generate-path-input.json"),
        "utf8",
      ),
    );

    const result = await gateway.generatePath(fixture, {
      anonymousKey: "fixture-user",
    });

    expect(pathGenerationOutputSchema.parse(result.output).nodes.length).toBe(
      3,
    );
    expect(result.provider).toBe("mock");

    const budget = await usageRepository.getDailyBudget(
      "mock",
      new Date().toISOString().slice(0, 10),
    );

    expect(budget?.request_count).toBe(1);
    expect(result.usageLogId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
