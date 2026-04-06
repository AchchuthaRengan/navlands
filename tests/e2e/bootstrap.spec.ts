import { expect, test } from "@playwright/test";

test("marketing page renders bootstrap setup guidance", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Wayframe foundation is live." }),
  ).toBeVisible();
  await expect(
    page.getByText("Copy .env.example to .env.local", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Review auth setup" }),
  ).toBeVisible();
});

test("auth routes stay in setup mode when public Supabase env is missing", async ({
  page,
}) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: "Sign in to Wayframe" }),
  ).toBeVisible();
  await expect(
    page.getByText("Phone OTP remains deferred to M2.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Supabase setup required" }),
  ).toBeDisabled();

  await page.goto("/signup");

  await expect(
    page.getByRole("heading", { name: "Create your Wayframe account" }),
  ).toBeVisible();
  await expect(
    page.getByText("phone OTP all remain out of scope", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Auth disabled" }),
  ).toBeDisabled();
});

test("protected routes redirect to setup guidance when Supabase env is missing", async ({
  page,
}) => {
  await page.goto("/app");

  await expect(page).toHaveURL(/\/\?setup=supabase$/);
  await expect(
    page.getByText("Copy .env.example to .env.local", { exact: false }),
  ).toBeVisible();

  await page.goto("/admin");

  await expect(page).toHaveURL(/\/\?setup=supabase$/);
  await expect(
    page.getByRole("link", { name: "Open auth setup" }),
  ).toBeVisible();
});
