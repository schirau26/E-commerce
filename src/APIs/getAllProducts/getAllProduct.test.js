import { describe, expect, it, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { allShopProducts } from "./getAllProducts";
import * as categoryFunction from "../getCategory/getCategory";

describe("Get All Products", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it("Returns all the API products", async () => {
    vi.spyOn(categoryFunction, "getCategory").mockResolvedValue([
      { items: "" },
      { items: "" },
      { items: "" },
    ]);
    const products = await allShopProducts(["beauty", "tops"]);

    //test for a nested structure array
    expect(products).toEqual([
      { items: "" },
      { items: "" },
      { items: "" },
      { items: "" },
      { items: "" },
      { items: "" },
    ]);
  });
  it("Missing parameter throws an error", async () => {
    await expect(allShopProducts()).rejects.throw(
      "Invalid parameter `categories",
    );
  });

  it("throws when every category fetch fails", async () => {
    vi.spyOn(categoryFunction, "getCategory").mockRejectedValue(
      new Error("offline"),
    );
    await expect(allShopProducts(["beauty", "tops"])).rejects.toThrow(
      "Failed to load catalog",
    );
  });

  it("returns products from categories that succeed", async () => {
    vi.spyOn(categoryFunction, "getCategory").mockImplementation((name) => {
      if (name === "beauty") {
        return Promise.reject(new Error("offline"));
      }
      return Promise.resolve([{ id: 1, title: "Shirt" }]);
    });
    const products = await allShopProducts(["beauty", "tops"]);
    expect(products).toEqual([{ id: 1, title: "Shirt" }]);
  });
});
