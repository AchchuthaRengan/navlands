import Link from "next/link";

import { signOutAction } from "@/app/(auth)/actions";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { getPublicSupabaseSetupMessage } from "@/lib/env/public";
import { getServerEnv } from "@/lib/env/server";

export default async function AppHomePage() {
  const user = await requireAuthenticatedUser();
  const serverEnv = getServerEnv();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <section className="glass-panel space-y-5 p-8">
        <div className="space-y-2">
          <p className="font-accent text-2xl text-terracotta">M1 app shell</p>
          <h1 className="font-heading text-4xl text-ink">
            Auth foundation is wired.
          </h1>
          <p className="text-sm leading-6 text-charcoal">
            This route is protected by middleware and Supabase session refresh.
            Deeper product features start in later M1 phases.
          </p>
          <p className="text-sm leading-6 text-charcoal">
            {getPublicSupabaseSetupMessage() ??
              "Hosted Supabase is configured for the current environment."}
          </p>
        </div>

        <dl className="grid gap-4 text-sm text-charcoal sm:grid-cols-3">
          <div className="rounded-glass border border-sand bg-cream/80 p-4">
            <dt className="text-mist">Signed in as</dt>
            <dd className="mt-1 font-medium text-ink">
              {user?.email ?? "Unknown user"}
            </dd>
          </div>
          <div className="rounded-glass border border-sand bg-cream/80 p-4">
            <dt className="text-mist">AI provider mode</dt>
            <dd className="mt-1 font-medium text-ink">
              {serverEnv.AI_PROVIDER_MODE}
            </dd>
          </div>
          <div className="rounded-glass border border-sand bg-cream/80 p-4">
            <dt className="text-mist">Phone OTP</dt>
            <dd className="mt-1 font-medium text-ink">Deferred to M2</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full border border-sand px-5 py-3 font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
          >
            Back to marketing
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-sand px-5 py-3 font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
          >
            Admin placeholder
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full bg-terracotta px-5 py-3 font-medium text-cream transition hover:opacity-90"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
