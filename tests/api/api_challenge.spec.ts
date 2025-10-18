import { test, expect, request } from "@playwright/test";



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
