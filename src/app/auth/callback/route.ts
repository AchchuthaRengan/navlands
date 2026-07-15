import { NextResponse } from "next/server";

import { ensureProfileForUser } from "@/lib/auth/profile";
import {
  getPublicSupabaseSetupMessage,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/app";

  if (!hasPublicSupabaseEnvConfigured()) {
    const loginUrl = new URL("/login", requestUrl.origin);
    loginUrl.searchParams.set(
      "error",
      getPublicSupabaseSetupMessage() ??
        "Supabase auth is not configured for this environment.",
    );
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = new URL("/login", requestUrl.origin);
      loginUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(loginUrl);
    }

    if (data.user) {
      await ensureProfileForUser(data.user);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
