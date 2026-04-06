import type { User } from "@supabase/supabase-js";

import { profileUpsertSchema } from "@/types/contracts";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/db/supabase";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

function resolveDisplayName(user: User) {
  const fullName = user.user_metadata?.full_name;
  const name = user.user_metadata?.name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  return null;
}

export async function ensureProfileForUser(user: User) {
  const payload = profileUpsertSchema.parse({
    user_id: user.id,
    email: user.email ?? null,
    display_name: resolveDisplayName(user),
    preferences: {},
  });

  const profile: ProfileInsert = {
    user_id: payload.user_id,
    email: payload.email ?? null,
    display_name: payload.display_name ?? null,
    date_of_birth: payload.date_of_birth ?? null,
    headline: payload.headline ?? null,
    persona: payload.persona ?? null,
    preferences: payload.preferences as Json,
  };

  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("profiles").upsert(profile, {
    onConflict: "user_id",
  });

  if (error) {
    throw new Error(`Could not sync profile: ${error.message}`);
  }
}
