"use server";

import { redirect } from "next/navigation";

import { ensureProfileForUser } from "@/lib/auth/profile";
import {
  getPublicSupabaseSetupMessage,
  getRequiredPublicSupabaseEnv,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginInputSchema, signupInputSchema } from "@/types/contracts";

function toMessageUrl(path: string, key: "error" | "message", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

function getAuthSetupMessage() {
  return (
    getPublicSupabaseSetupMessage() ??
    "Supabase auth is not configured for this environment."
  );
}

async function signInWithOAuth(provider: "google" | "github") {
  if (!hasPublicSupabaseEnvConfigured()) {
    redirect(toMessageUrl("/login", "error", getAuthSetupMessage()));
  }

  const supabase = createServerSupabaseClient();
  const env = getRequiredPublicSupabaseEnv();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: new URL("/auth/callback", env.NEXT_PUBLIC_APP_URL).toString(),
    },
  });

  if (error || !data.url) {
    redirect(
      toMessageUrl(
        "/login",
        "error",
        error?.message ?? `Could not start ${provider} sign-in.`,
      ),
    );
  }

  redirect(data.url);
}

export async function loginAction(formData: FormData) {
  if (!hasPublicSupabaseEnvConfigured()) {
    redirect(toMessageUrl("/login", "error", getAuthSetupMessage()));
  }

  const parsed = loginInputSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    redirect(
      toMessageUrl(
        "/login",
        "error",
        parsed.error.issues[0]?.message ?? "Email and password are required.",
      ),
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect(toMessageUrl("/login", "error", error.message));
  }

  if (data.user) {
    await ensureProfileForUser(data.user);
  }

  redirect("/app");
}

export async function signupAction(formData: FormData) {
  if (!hasPublicSupabaseEnvConfigured()) {
    redirect(toMessageUrl("/signup", "error", getAuthSetupMessage()));
  }

  const parsed = signupInputSchema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    redirect(
      toMessageUrl(
        "/signup",
        "error",
        parsed.error.issues[0]?.message ?? "Email and password are required.",
      ),
    );
  }

  const supabase = createServerSupabaseClient();
  const env = getRequiredPublicSupabaseEnv();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: new URL(
        "/auth/callback",
        env.NEXT_PUBLIC_APP_URL,
      ).toString(),
    },
  });

  if (error) {
    redirect(toMessageUrl("/signup", "error", error.message));
  }

  redirect(
    toMessageUrl(
      "/login",
      "message",
      "Check your email to confirm your account, then sign in.",
    ),
  );
}

export async function signInWithGoogleAction() {
  await signInWithOAuth("google");
}

export async function signInWithGitHubAction() {
  await signInWithOAuth("github");
}

export async function signOutAction() {
  if (!hasPublicSupabaseEnvConfigured()) {
    redirect("/");
  }

  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
