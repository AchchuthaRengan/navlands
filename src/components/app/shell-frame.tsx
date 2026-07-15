import Link from "next/link";

import { signOutAction } from "@/app/(auth)/actions";

type ShellFrameProps = {
  userEmail: string;
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Explore",
    description: "Home lane for generation, cards, and what-if.",
    href: "/app",
  },
  {
    label: "Proof",
    description: "Reserved for proof-backed moves and validation signals.",
    href: "/app",
  },
  {
    label: "Admin",
    description: "Existing allowlist-gated placeholder remains separate.",
    href: "/admin",
  },
];

export function ShellFrame({ userEmail, children }: ShellFrameProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,102,72,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(109,143,112,0.16),transparent_22%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col gap-6 px-4 py-4 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="glass-panel flex flex-col gap-6 p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-mist"
            >
              <span className="font-accent text-2xl text-terracotta">
                Wayframe
              </span>
              <span className="uppercase tracking-[0.24em]">M2</span>
            </Link>
            <div>
              <p className="font-heading text-4xl leading-none text-ink">
                Explore paths before you commit.
              </p>
              <p className="mt-3 text-sm leading-6 text-charcoal">
                The shell is now optimized for testing directions, comparing
                moves, and keeping trust visible on every AI-derived surface.
              </p>
            </div>
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-glass border border-sand/70 bg-cream/70 px-4 py-4 transition hover:border-terracotta/40"
              >
                <p className="font-heading text-2xl text-ink">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-charcoal">
                  {item.description}
                </p>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4 rounded-glass border border-sand/70 bg-parchment/75 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-mist">
                Active session
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-charcoal">
                {userEmail}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-sand px-4 py-2 text-sm font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
              >
                Marketing
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
