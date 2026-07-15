import { getAdminEmailAllowlist } from "@/lib/env/server";

export const supportedOAuthProviders = ["google", "github"] as const;

export type SupportedOAuthProvider = (typeof supportedOAuthProviders)[number];

export function isSupportedOAuthProvider(
  value: string,
): value is SupportedOAuthProvider {
  return supportedOAuthProviders.includes(value as SupportedOAuthProvider);
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return getAdminEmailAllowlist().includes(email.toLowerCase());
}
