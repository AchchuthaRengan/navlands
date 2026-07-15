import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { isAdminEmail } from "@/lib/auth/config";
import {
  getPublicSupabaseSetupMessage,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function toLoginErrorUrl(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

export async function getAuthenticatedUser() {
  if (!hasPublicSupabaseEnvConfigured()) {
    return null;
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuthenticatedUser(): Promise<User> {
  if (!hasPublicSupabaseEnvConfigured()) {
    redirect(
      toLoginErrorUrl(
        getPublicSupabaseSetupMessage() ??
          "Supabase auth is not configured for this environment.",
      ),
    );
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(toLoginErrorUrl("Sign in to continue."));
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireAuthenticatedUser();

  if (!isAdminEmail(user.email)) {
    redirect(
      `/?error=${encodeURIComponent(
        "Admin access is blocked until ADMIN_EMAILS includes your account.",
      )}`,
    );
  }

  return user;
}
