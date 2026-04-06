import { requireAuthenticatedUser } from "@/lib/auth/session";
import { ShellFrame } from "@/components/app/shell-frame";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuthenticatedUser();

  return (
    <ShellFrame userEmail={user.email ?? "Unknown user"}>{children}</ShellFrame>
  );
}
