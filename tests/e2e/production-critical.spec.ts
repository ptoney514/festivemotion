import { test, expect } from "@playwright/test";

test.describe("Production critical checks", () => {
  test("404 page is branded", async ({ page }) => {
    await page.goto("/nonexistent-page-xyz");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toContainText(/not found/i);
    const productsLink = page.getByRole("main").getByRole("link", { name: /browse products/i });
    await expect(productsLink).toBeVisible();
  });

  test("security headers are present", async ({ request }) => {
    const response = await request.get("/");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
  });

  test("footer is clean of dev content", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    const footerText = await footer.textContent();
    expect(footerText).not.toContain("UX Reference");
    expect(footerText).not.toContain("Current Site");
    expect(footerText).not.toContain("WooCommerce");
  });

  test("meta description is customer-facing", async ({ page }) => {
    await page.goto("/");
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).not.toContain("Apple-style");
    expect(description).not.toContain("microsite");
    expect(description).toContain("FestiveMotion");
  });
});
