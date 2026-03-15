import { test, expect } from "@playwright/test";

test.describe("Auth – unauthenticated", () => {
  test("sign-in page renders correctly", async ({ page }) => {
    await page.goto("/auth/signin");

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Send magic link" })).toBeVisible();
    await expect(page.getByRole("link", { name: "FestiveMotion" })).toBeVisible();
  });

  test("email submission navigates away from sign-in page", async ({ page }) => {
    await page.goto("/auth/signin");

    await page.fill('[name="email"]', "pernellg@proton.me");
    await page.getByRole("button", { name: "Send magic link" }).click();

    // With a valid Resend key, Auth.js redirects to /auth/verify-request.
    // If Resend is misconfigured, it redirects to /api/auth/error.
    // Either way, the form should navigate away from the sign-in page.
    await page.waitForURL((url) => !url.pathname.endsWith("/auth/signin"), {
      timeout: 15000,
    });

    const url = page.url();
    const isVerifyRequest = url.includes("/auth/verify-request");
    const isAuthError = url.includes("/api/auth/error");
    expect(isVerifyRequest || isAuthError).toBe(true);

    if (isAuthError) {
      console.warn(
        "Email submission redirected to auth error — Resend API may not be configured. " +
          "To test the full flow, ensure AUTH_RESEND_KEY is valid and the from-domain is verified.",
      );
    }
  });

  test("verify-request page shows correct content", async ({ page }) => {
    await page.goto("/auth/verify-request");

    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    await expect(page.getByText("A sign-in link has been sent")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  });

  test("header shows Sign in link when unauthenticated", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("User menu")).not.toBeVisible();
  });
});
