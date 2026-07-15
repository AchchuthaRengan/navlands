import { describe, expect, it } from "vitest";

import { isSupportedOAuthProvider } from "@/lib/auth/config";

describe("auth config", () => {
  it("accepts the M1 OAuth providers only", () => {
    expect(isSupportedOAuthProvider("google")).toBe(true);
    expect(isSupportedOAuthProvider("github")).toBe(true);
    expect(isSupportedOAuthProvider("phone")).toBe(false);
  });
});
