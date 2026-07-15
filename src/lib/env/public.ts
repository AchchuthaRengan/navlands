import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

export function getPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  });
}

function getMissingPublicSupabaseEnvKeys(env: PublicEnv) {
  const missing: string[] = [];

  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}

export function hasPublicSupabaseEnvConfigured(
  env: PublicEnv = getPublicEnv(),
) {
  return getMissingPublicSupabaseEnvKeys(env).length === 0;
}

export function getPublicSupabaseSetupMessage(env: PublicEnv = getPublicEnv()) {
  const missing = getMissingPublicSupabaseEnvKeys(env);

  if (missing.length === 0) {
    return null;
  }

  return `Missing ${missing.join(" and ")}. Copy .env.example to .env.local and set your hosted Supabase public values before using auth or protected routes.`;
}

export function getRequiredPublicSupabaseEnv() {
  const env = getPublicEnv();
  const setupMessage = getPublicSupabaseSetupMessage(env);

  if (setupMessage) {
    throw new Error(setupMessage);
  }

  return {
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}
