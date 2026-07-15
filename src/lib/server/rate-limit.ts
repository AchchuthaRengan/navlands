import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getServerEnv } from "@/lib/env/server";

const DEFAULT_LIMIT = 2;
const DEFAULT_WINDOW_SECONDS = 60;

export type AnonymousRateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  source: "upstash" | "memory" | "disabled";
};

export interface AnonymousAiRateLimiter {
  limit(identifier: string): Promise<AnonymousRateLimitResult>;
}

type MemoryLimiterState = {
  count: number;
  reset: number;
};

type AnonymousAiRateLimiterOptions = {
  limit?: number;
  windowSeconds?: number;
  mode?: "auto" | "memory" | "disabled";
  now?: () => number;
};

const memoryStore = new Map<string, MemoryLimiterState>();

function createDisabledLimiter(limit: number): AnonymousAiRateLimiter {
  return {
    async limit() {
      return {
        success: true,
        limit,
        remaining: limit,
        reset: Date.now() + DEFAULT_WINDOW_SECONDS * 1000,
        source: "disabled",
      };
    },
  };
}

export function createMemoryAnonymousAiRateLimiter(
  options: AnonymousAiRateLimiterOptions = {},
): AnonymousAiRateLimiter {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowSeconds = options.windowSeconds ?? DEFAULT_WINDOW_SECONDS;
  const now = options.now ?? Date.now;

  return {
    async limit(identifier) {
      const currentTime = now();
      const current = memoryStore.get(identifier);

      if (!current || current.reset <= currentTime) {
        memoryStore.set(identifier, {
          count: 1,
          reset: currentTime + windowSeconds * 1000,
        });

        return {
          success: true,
          limit,
          remaining: limit - 1,
          reset: currentTime + windowSeconds * 1000,
          source: "memory",
        };
      }

      current.count += 1;
      memoryStore.set(identifier, current);

      return {
        success: current.count <= limit,
        limit,
        remaining: Math.max(limit - current.count, 0),
        reset: current.reset,
        source: "memory",
      };
    },
  };
}

export function createAnonymousAiRateLimiter(
  options: AnonymousAiRateLimiterOptions = {},
): AnonymousAiRateLimiter {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const windowSeconds = options.windowSeconds ?? DEFAULT_WINDOW_SECONDS;

  if (options.mode === "disabled") {
    return createDisabledLimiter(limit);
  }

  if (options.mode === "memory") {
    return createMemoryAnonymousAiRateLimiter(options);
  }

  const env = getServerEnv();

  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return createMemoryAnonymousAiRateLimiter(options);
  }

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(limit, `${windowSeconds} s`),
    analytics: false,
    prefix: "wayframe:m1:anon-ai",
  });

  return {
    async limit(identifier) {
      const result = await ratelimit.limit(identifier);

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
        source: "upstash",
      };
    },
  };
}

export class RateLimitExceededError extends Error {
  constructor(public readonly result: AnonymousRateLimitResult) {
    super("Anonymous AI rate limit exceeded.");
    this.name = "RateLimitExceededError";
  }
}
