import { test, expect, request } from "@playwright/test";

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

test.describe("Api product test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });
  test("GET /products/{id}", async ({ page, request }) => {
    const searchUrl = "https://api.practicesoftwaretesting.com/products/search";
    const searchResponse = await request.get(
      searchUrl + "?q=Combination%20Pliers"
    );
    const searchJson = await searchResponse.json();
    const productId = searchJson.data[0].id;
    console.log(productId);

    const apiUrl = "https://api.practicesoftwaretesting.com";
    const response = await request.get(apiUrl + `/products/${productId}`);
    expect(response.ok).toBeTruthy();
    const body = await response.json();
    expect(body.in_stock).toBe(true);
    expect(body.price).toBe(14.15);
    expect(body.name).toBe("Combination Pliers");
  });
});
