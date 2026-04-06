"use server";

import { redirect } from "next/navigation";

import { getPublicEnv } from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function toMessageUrl(path: string, key: "error" | "message", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

async function signInWithOAuth(provider: "google" | "github") {
  const supabase = createServerSupabaseClient();
  const env = getPublicEnv();

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
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(
      toMessageUrl("/login", "error", "Email and password are required."),
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(toMessageUrl("/login", "error", error.message));
  }

  redirect("/app");
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(
      toMessageUrl("/signup", "error", "Email and password are required."),
    );
  }

  const supabase = createServerSupabaseClient();
  const env = getPublicEnv();
  const { error } = await supabase.auth.signUp({
    email,
    password,
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
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
