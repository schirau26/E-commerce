import { describe, expect, it, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import * as getAll from "../getAllProducts/getAllProducts";
import { searchQuery } from "../getSearch/getSearchQuery";

describe("Get Search Query", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Test the searching functionality", async () => {
    vi.spyOn(getAll, "allShopProducts").mockResolvedValueOnce([
      { title: "Playstation Console", category: "Gaming" },
      { title: "Xbox Console", category: "Gaming" },
      { title: "Iphone 15", category: "smartphones" },
      { title: "Iphone 17", category: "smartphones" },
      { title: "Thinkpad Lenovo", category: "Computers" },
      { title: "Acer Aspire", category: "Computers" },
    ]);

    const data = await searchQuery("le");
    expect(data).toEqual([
      { title: "Playstation Console", category: "Gaming" },
      { title: "Xbox Console", category: "Gaming" },
      { title: "Thinkpad Lenovo", category: "Computers" },
    ]);
  });

  it("escapes special regex characters in the query", async () => {
    vi.spyOn(getAll, "allShopProducts").mockResolvedValueOnce([
      { title: "C++ Guide", category: "books" },
    ]);

    const data = await searchQuery("C++");
    expect(data).toEqual([{ title: "C++ Guide", category: "books" }]);
  });
});
