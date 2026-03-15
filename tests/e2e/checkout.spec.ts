import { test, expect } from "@playwright/test";

test.describe("Checkout flow", () => {
  test("configure product, add to cart, fill checkout form, and complete purchase", async ({
    page,
  }) => {
    // Use a wide viewport so desktop layout is shown
    await page.setViewportSize({ width: 1400, height: 900 });

    // 1. Go to the product configurator page
    await page.goto("/products/skulltronix-skullkin");
    await expect(page.locator("h1")).toContainText("SkullTronix");

    // 2. Wait for the "Add to Cart" button to be enabled (pricing must finish syncing)
    const addToCartBtn = page.locator('aside button:has-text("Add to Cart")');
    await expect(addToCartBtn).toBeEnabled({ timeout: 10000 });

    // 3. Click "Add to Cart"
    await addToCartBtn.click();

    // 4. Cart drawer should open — wait for "Proceed to Checkout" button
    const checkoutBtn = page.getByRole("button", { name: /Proceed to Checkout/i });
    await expect(checkoutBtn).toBeVisible({ timeout: 5000 });
    await checkoutBtn.click();

    // 5. Verify we're on the checkout page
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator("h1")).toContainText("Checkout");

    // Verify order summary shows the product (use the visible desktop summary)
    await expect(
      page.locator('.lg\\:block >> text=SkullTronix Skullkin'),
    ).toBeVisible();

    // 6. Fill in the checkout form
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="phone"]', "555-123-4567");
    await page.fill('[name="street"]', "123 Test Street");
    await page.fill('[name="apt"]', "Suite 4");
    await page.fill('[name="city"]', "Omaha");
    await page.selectOption('[name="state"]', "NE");
    await page.fill('[name="zip"]', "68101");

    // 7. Click "Continue to Payment"
    const submitBtn = page.getByRole("button", { name: /Continue to Payment/i }).first();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 8. Wait for the redirect to success page (mock checkout without Stripe key)
    await expect(page).toHaveURL(/\/success\?session_id=/, { timeout: 15000 });

    // 9. Verify success page content
    await expect(page.getByRole("heading", { name: /order is confirmed/i })).toBeVisible({
      timeout: 10000,
    });

    // 10. Verify cart is cleared — badge should not be visible
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toBeHidden({ timeout: 5000 });
  });

  test("shows validation errors on empty form submission", async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });

    // First go to a neutral page to set up localStorage with correct cart format
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

    // Now navigate to checkout
    await page.goto("/checkout");
    await expect(page.locator("h1")).toContainText("Checkout", { timeout: 5000 });

    // Submit with empty fields
    const submitBtn = page.getByRole("button", { name: /Continue to Payment/i }).first();
    await submitBtn.click();

    // Verify validation errors appear
    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Street address is required")).toBeVisible();
    await expect(page.getByText("City is required")).toBeVisible();
    await expect(page.getByText("Please select a state")).toBeVisible();
    await expect(page.getByText("ZIP code is required")).toBeVisible();
  });
});
