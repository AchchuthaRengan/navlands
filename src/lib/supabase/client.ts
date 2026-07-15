import { createBrowserClient } from "@supabase/ssr";

import { getRequiredPublicSupabaseEnv } from "@/lib/env/public";
import type { Database } from "@/types/db/supabase";

export function createBrowserSupabaseClient() {
  const env = getRequiredPublicSupabaseEnv();

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
