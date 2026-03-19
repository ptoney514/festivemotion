import { test, expect } from "@playwright/test";

test.describe("Mobile horizontal overflow", () => {
  const routes = [
    "/products/skulltronix-skull",
    "/products/skulltronix-skullkin",
    "/products/skulltronix-dancing-pumpkin",
  ];

  for (const route of routes) {
    test(`no horizontal scroll on ${route} at 375px`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
      });

      expect(overflow).toBe(true);
    });
  }
});
