export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16">
      <section className="glass-panel space-y-4 p-8">
        <p className="font-accent text-2xl text-terracotta">Admin foundation</p>
        <h1 className="font-heading text-4xl text-ink">
          Allowlist-gated admin placeholder
        </h1>
        <p className="text-sm leading-6 text-charcoal">
          Middleware protects this route using `ADMIN_EMAILS`. If the allowlist
          is empty, this route remains effectively blocked to non-fixture users
          until real admin emails are supplied.
        </p>
      </section>
    </main>
  );
}
