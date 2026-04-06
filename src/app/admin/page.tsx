import { requireAdminUser } from "@/lib/auth/session";

export default async function AdminPage() {
  const user = await requireAdminUser();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16">
      <section className="glass-panel space-y-4 p-8">
        <p className="font-accent text-2xl text-terracotta">Admin foundation</p>
        <h1 className="font-heading text-4xl text-ink">
          Allowlist-gated admin placeholder
        </h1>
        <p className="text-sm leading-6 text-charcoal">
          Middleware and server-side auth helpers both gate this route. Admin
          actions stay auditable and service-role-only in M1.
        </p>
        <p className="text-sm leading-6 text-charcoal">
          Current admin session:{" "}
          <span className="font-medium">{user.email}</span>
        </p>
      </section>
    </main>
  );
}
