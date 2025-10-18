import { test, expect } from "@playwright/test";

test.describe("Checkout test", () => {
  test.use({ storageState: ".auth/customer01.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("checkout test", async ({ page }) => {
    await page.getByText("Combination Pliers").click();
    await page.getByTestId("add-to-cart").click();
    await expect(page.getByTestId("cart-quantity")).toHaveText("1");
    await page.getByTestId("nav-cart").click();
    await page.getByTestId("proceed-1").click();
    await page.getByTestId("proceed-2").click();
    await page.getByTestId("state").fill("oslo");
    await page.getByTestId("postal_code").fill("12345");
    await page.getByTestId("proceed-3").click();
    await expect(page.getByTestId("finish")).toBeDisabled();
    const dropdownOptions = page.getByTestId("payment-method");
    await dropdownOptions.selectOption("buy-now-pay-later");
    await page.getByTestId("monthly_installments").selectOption("3");
    await expect(page.getByTestId("finish")).toBeEnabled();
    await page.getByTestId("finish").click();
    await expect(page.getByTestId("payment-success-message")).toBeVisible();
  });
});
