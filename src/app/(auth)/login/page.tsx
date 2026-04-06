import Link from "next/link";

import {
  loginAction,
  signInWithGitHubAction,
  signInWithGoogleAction,
} from "@/app/(auth)/actions";
import {
  getPublicSupabaseSetupMessage,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";

type LoginPageProps = {
  searchParams?: {
    error?: string;
    message?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const authReady = hasPublicSupabaseEnvConfigured();
  const setupMessage = getPublicSupabaseSetupMessage();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-16">
      <section className="glass-panel space-y-6 p-8">
        <div className="space-y-2">
          <p className="font-accent text-2xl text-terracotta">Welcome back</p>
          <h1 className="font-heading text-4xl text-ink">
            Sign in to Wayframe
          </h1>
          <p className="text-sm leading-6 text-charcoal">
            M1 auth foundation supports email/password, Google, and GitHub only.
            Phone OTP remains deferred to M2.
          </p>
        </div>

        {searchParams?.error ? (
          <p className="rounded-glass border border-ember/20 bg-cream/80 px-4 py-3 text-sm text-ember">
            {searchParams.error}
          </p>
        ) : null}

        {searchParams?.message ? (
          <p className="rounded-glass border border-sage/20 bg-cream/80 px-4 py-3 text-sm text-sage">
            {searchParams.message}
          </p>
        ) : null}

        {!authReady && setupMessage ? (
          <p className="rounded-glass border border-ember/20 bg-cream/80 px-4 py-3 text-sm text-ember">
            {setupMessage}
          </p>
        ) : null}

        {authReady ? (
          <>
            <form action={loginAction} className="space-y-4">
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
                  className="w-full rounded-glass border border-sand bg-cream/90 px-4 py-3 text-ink outline-none transition focus:border-terracotta"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-terracotta px-5 py-3 font-medium text-cream transition hover:opacity-90"
              >
                Sign in with email
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
          Need an account?{" "}
          <Link href="/signup" className="font-medium text-terracotta">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
