import { randomUUID } from "node:crypto";

import { afterAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/db/supabase";

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const shouldRun =
  !!publicUrl &&
  !!anonKey &&
  !!serviceRoleKey &&
  !publicUrl.includes("your-project-ref") &&
  !anonKey.includes("your-supabase-anon-key");

const adminClient = shouldRun
  ? createClient<Database>(publicUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

const cleanupUserIds: string[] = [];

afterAll(async () => {
  if (!adminClient) {
    return;
  }

  for (const userId of cleanupUserIds) {
    await adminClient.auth.admin.deleteUser(userId);
  }
});

describe.runIf(shouldRun)("ai governance", () => {
  it("blocks anon RPC access to record_ai_call", async () => {
    const anonClient = createClient<Database>(publicUrl!, anonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const result = await anonClient.rpc("record_ai_call", {
      p_operation: "generatePath",
      p_provider: "mock",
      p_provider_mode: "mock",
      p_status: "success",
      p_input_tokens: 1,
      p_output_tokens: 1,
      p_total_tokens: 2,
    });

    expect(result.error).not.toBeNull();
  });

  it("rejects invalid resume parse statuses", async () => {
    const email = `wayframe-resume-${randomUUID()}@example.com`;
    const password = `Wayframe!${randomUUID()}`;
    const created = await adminClient!.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (created.error || !created.data.user) {
      throw new Error(created.error?.message ?? "Could not create test user.");
    }

    cleanupUserIds.push(created.data.user.id);

    const userClient = createClient<Database>(publicUrl!, anonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const signIn = await userClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signIn.error) {
      throw new Error(signIn.error.message);
    }

    const insertResult = await userClient.from("resume_parses").insert({
      user_id: created.data.user.id,
      parse_status: "queued",
      raw_text: "Example resume text",
    });

    expect(insertResult.error).not.toBeNull();
  });
});
