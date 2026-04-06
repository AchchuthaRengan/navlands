import Link from "next/link";

import {
  signInWithGitHubAction,
  signInWithGoogleAction,
  signupAction,
} from "@/app/(auth)/actions";
import {
  getPublicSupabaseSetupMessage,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";

type SignupPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function SignupPage({ searchParams }: SignupPageProps) {
  const authReady = hasPublicSupabaseEnvConfigured();
  const setupMessage = getPublicSupabaseSetupMessage();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <section className="glass-panel space-y-6 p-8">
        <div className="space-y-2">
          <p className="font-accent text-2xl text-terracotta">First step</p>
          <h1 className="font-heading text-4xl text-ink">
            Create your Wayframe account
          </h1>
          <p className="text-sm leading-6 text-charcoal">
            This is M1 auth scaffolding only. Persona onboarding, age-gate UX,
            and phone OTP all remain out of scope for this pass.
          </p>
        </div>

        {searchParams?.error ? (
          <p className="rounded-glass border border-ember/20 bg-cream/80 px-4 py-3 text-sm text-ember">
            {searchParams.error}
          </p>
        ) : null}

        {!authReady && setupMessage ? (
          <p className="rounded-glass border border-ember/20 bg-cream/80 px-4 py-3 text-sm text-ember">
            {setupMessage}
          </p>
        ) : null}

        {authReady ? (
          <>
            <form action={signupAction} className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-glass border border-sand bg-cream/90 px-4 py-3 text-ink outline-none transition focus:border-terracotta"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-ink">Password</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-glass border border-sand bg-cream/90 px-4 py-3 text-ink outline-none transition focus:border-terracotta"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-terracotta px-5 py-3 font-medium text-cream transition hover:opacity-90"
              >
                Create account with email
              </button>
            </form>

            <div className="grid gap-3 sm:grid-cols-2">
              <form action={signInWithGoogleAction}>
                <button
                  type="submit"
                  className="w-full rounded-full border border-sand px-5 py-3 font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
                >
                  Continue with Google
                </button>
              </form>

              <form action={signInWithGitHubAction}>
                <button
                  type="submit"
                  className="w-full rounded-full border border-sand px-5 py-3 font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
                >
                  Continue with GitHub
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled
              className="w-full rounded-full border border-sand px-5 py-3 font-medium text-mist opacity-70"
            >
              Supabase setup required
            </button>
            <button
              type="button"
              disabled
              className="w-full rounded-full border border-sand px-5 py-3 font-medium text-mist opacity-70"
            >
              Auth disabled
            </button>
          </div>
        )}

        <p className="text-sm text-charcoal">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-terracotta">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
