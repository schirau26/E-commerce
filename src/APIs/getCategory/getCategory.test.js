import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { getCategory } from "./getCategory";
import { categories } from "../../data/category_data";

describe("Get Category", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const cases = categories.map((category) => {
    return [category, [`Objects of ${category} category`]];
  });

  it.each(cases)(
    "Testing against all category items",
    async (input, expected) => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: [`Objects of ${input} category`],
          total: "20",
        }),
      });
      expect(await getCategory(input)).toStrictEqual(expected);
      expect(fetch).toHaveBeenCalled();
    },
  );

  it("Testing for Capitalised Parameter", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [`Objects of products category`],
        total: "20",
      }),
    });
    expect(await getCategory(categories[0].toUpperCase())).toStrictEqual([
      `Objects of products category`,
    ]);
    expect(fetch).toHaveBeenCalled();
  });

  it("Throw an Error for invalid parameter", async () => {
    await expect(getCategory("")).rejects.toThrow("Enter a valid category");
    expect(fetch).not.toHaveBeenCalled();
  });
});
