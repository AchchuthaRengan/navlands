import { requireAuthenticatedUser } from "@/lib/auth/session";
import { getServerEnv } from "@/lib/env/server";
import { ExplorationOverview } from "@/components/app/exploration-overview";

export default async function AppHomePage() {
  const user = await requireAuthenticatedUser();
  const serverEnv = getServerEnv();

  return (
    <ExplorationOverview
      userEmail={user.email ?? "Unknown user"}
      providerMode={serverEnv.AI_PROVIDER_MODE}
    />
  );
}
