import Link from "next/link";

import {
  getPublicSupabaseSetupMessage,
  hasPublicSupabaseEnvConfigured,
} from "@/lib/env/public";

type MarketingPageProps = {
  searchParams?: {
    error?: string;
    setup?: string;
  };
};

export default function MarketingPage({ searchParams }: MarketingPageProps) {
  const authReady = hasPublicSupabaseEnvConfigured();
  const setupMessage = getPublicSupabaseSetupMessage();
  const shouldShowSetup = !authReady || searchParams?.setup === "supabase";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16">
      <section className="glass-panel grid gap-10 p-8 md:grid-cols-[1.4fr_0.9fr] md:p-12">
        <div className="space-y-6">
          <p className="font-accent text-3xl text-terracotta">
            Visual-first career exploration
          </p>
          {searchParams?.error ? (
            <p className="rounded-glass border border-ember/20 bg-cream/80 px-4 py-3 text-sm text-ember">
              {searchParams.error}
            </p>
          ) : null}
          {shouldShowSetup && setupMessage ? (
            <p className="rounded-glass border border-ember/20 bg-cream/80 px-4 py-3 text-sm text-ember">
              {setupMessage}
            </p>
          ) : null}
          <div className="space-y-4">
            <h1 className="font-heading text-5xl leading-none text-ink md:text-7xl">
              Wayframe foundation is live.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-charcoal">
              M1 is focused on trustworthy infrastructure: hosted-dev-first
              Supabase, auth foundations, mock AI mode, and the contracts that
              later milestones will build on.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-terracotta px-5 py-3 font-medium text-cream transition hover:opacity-90"
            >
              {authReady ? "Create account" : "Review auth setup"}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-sand px-5 py-3 font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
            >
              {authReady ? "Sign in" : "Open auth setup"}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 self-start rounded-glass border border-sand/80 bg-parchment/80 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-mist">
              M1 bootstrap scope
            </p>
            <h2 className="mt-2 font-heading text-3xl text-ink">
              Preflight and foundations
            </h2>
          </div>
          <ul className="space-y-3 text-sm leading-7 text-charcoal">
            <li>Hosted-dev-first Supabase configuration</li>
            <li>Email/password, Google, and GitHub auth only</li>
            <li>Phone OTP deferred to M2</li>
            <li>
              Mock AI mode remains required until runtime provider keys exist
            </li>
          </ul>
          <p className="rounded-glass border border-terracotta/20 bg-cream/80 px-4 py-3 font-accent text-xl text-terracotta">
            The exploration engine stays sacred. This pass only builds its
            foundation.
          </p>
        </div>
      </section>
    </main>
  );
}
