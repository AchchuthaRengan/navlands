import { afterEach, describe, expect, it } from "vitest";

import {
  getPublicEnv,
  getPublicSupabaseSetupMessage,
  getRequiredPublicSupabaseEnv,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";

const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
const originalSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const originalSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

afterEach(() => {
  if (originalAppUrl) {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  } else {
    delete process.env.NEXT_PUBLIC_APP_URL;
  }

  if (originalSupabaseUrl) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalSupabaseUrl;
  } else {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  if (originalSupabaseAnonKey) {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalSupabaseAnonKey;
  } else {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
});

describe("public env", () => {
  it("allows bootstrap mode without public Supabase variables", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(getPublicEnv().NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(hasPublicSupabaseEnvConfigured()).toBe(false);
    expect(getPublicSupabaseSetupMessage()).toContain(
      "NEXT_PUBLIC_SUPABASE_URL",
    );
    expect(getPublicSupabaseSetupMessage()).toContain(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  });

  it("returns required values when public Supabase env is configured", () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    expect(hasPublicSupabaseEnvConfigured()).toBe(true);
    expect(getPublicSupabaseSetupMessage()).toBeNull();
    expect(getRequiredPublicSupabaseEnv()).toEqual({
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    });
  });
});
