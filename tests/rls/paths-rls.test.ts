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

describe.runIf(shouldRun)("rls paths", () => {
  it("blocks one user from reading another user's private path", async () => {
    const password = `Wayframe!${randomUUID()}`;
    const userAEmail = `wayframe-a-${randomUUID()}@example.com`;
    const userBEmail = `wayframe-b-${randomUUID()}@example.com`;

    const createdA = await adminClient!.auth.admin.createUser({
      email: userAEmail,
      password,
      email_confirm: true,
    });
    const createdB = await adminClient!.auth.admin.createUser({
      email: userBEmail,
      password,
      email_confirm: true,
    });

    if (
      createdA.error ||
      createdB.error ||
      !createdA.data.user ||
      !createdB.data.user
    ) {
      throw new Error(
        createdA.error?.message ??
          createdB.error?.message ??
          "Could not create test users.",
      );
    }

    cleanupUserIds.push(createdA.data.user.id, createdB.data.user.id);

    const userAClient = createClient<Database>(publicUrl!, anonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const userBClient = createClient<Database>(publicUrl!, anonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    await userAClient.auth.signInWithPassword({
      email: userAEmail,
      password,
    });
    await userBClient.auth.signInWithPassword({
      email: userBEmail,
      password,
    });

    await userAClient.from("profiles").upsert({
      user_id: createdA.data.user.id,
      email: userAEmail,
      preferences: {},
    });
    await userBClient.from("profiles").upsert({
      user_id: createdB.data.user.id,
      email: userBEmail,
      preferences: {},
    });

    const insertedPath = await userAClient
      .from("paths")
      .insert({
        owner_user_id: createdA.data.user.id,
        title: "Private test path",
        summary: "RLS smoke test path",
        source_label: "ai_suggested",
        is_public: false,
      })
      .select("*")
      .single();

    if (insertedPath.error) {
      throw new Error(insertedPath.error.message);
    }

    const ownRead = await userAClient
      .from("paths")
      .select("*")
      .eq("id", insertedPath.data.id);

    const foreignRead = await userBClient
      .from("paths")
      .select("*")
      .eq("id", insertedPath.data.id);

    expect(ownRead.error).toBeNull();
    expect(ownRead.data).toHaveLength(1);
    expect(foreignRead.error).toBeNull();
    expect(foreignRead.data).toHaveLength(0);
  });
});
