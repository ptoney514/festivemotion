import { test, expect } from "@playwright/test";
import { seedTestSession, injectSession, cleanupTestSession } from "./helpers/auth";

test.describe.serial("Auth – authenticated session", () => {
  let token: string;

  test.beforeAll(async () => {
    const result = await seedTestSession();
    token = result.token;
  });

  test.afterAll(async () => {
    await cleanupTestSession();
  });

  test("header shows avatar when authenticated", async ({ page }) => {
    await injectSession(page, token);
    await page.goto("/");

    await expect(page.getByLabel("User menu")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: "Sign in" })).not.toBeVisible();
    await expect(page.getByLabel("User menu")).toContainText("T");
  });

  test("dropdown shows user info", async ({ page }) => {
    await injectSession(page, token);
    await page.goto("/");

    await page.getByLabel("User menu").click();

    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByText("pernellg@proton.me")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });

  test("checkout form pre-fills from session", async ({ page }) => {
    await injectSession(page, token);

    // Seed cart in localStorage before navigating to checkout
    await page.goto("/products");
    await page.evaluate(() => {
      const cart = {
        version: 1,
        items: [
          {
            id: "test-item-1",
            kind: "configured",
            productSlug: "skulltronix-skullkin",
            productName: "SkullTronix Skullkin",
            productImageUrl: "/placeholder.jpg",
            selections: { base: "wood-block" },
            selectedOptions: [{ group: "Base", labels: ["Wood Block"] }],
            totalCents: 154500,
          },
        ],
      };
      localStorage.setItem("festivemotion-cart", JSON.stringify(cart));
    });

    await page.goto("/checkout");
    await expect(page.locator("h1")).toContainText("Checkout", { timeout: 5000 });

    await expect(page.locator('[name="name"]')).toHaveValue("Test User", { timeout: 5000 });
    await expect(page.locator('[name="email"]')).toHaveValue("pernellg@proton.me", { timeout: 5000 });
  });

  // Sign-out must run last — it deletes the DB session
  test("sign out returns to unauthenticated state", async ({ page }) => {
    await injectSession(page, token);
    await page.goto("/");

    await page.getByLabel("User menu").click();
    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel("User menu")).not.toBeVisible();
  });
});
