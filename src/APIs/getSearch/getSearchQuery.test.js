import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { searchQuery } from "../getSearch/getSearchQuery";

describe("Get Search Query", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("Test the searching functionality", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          { title: "Playstation Console", category: "Gaming" },
          { title: "Xbox Console", category: "Gaming" },
          { title: "Iphone 15", category: "smartphones" },
          { title: "Iphone 17", category: "smartphones" },
          { title: "Thinkpad Lenovo", category: "Computers" },
          { title: "Acer Aspire", category: "Computers" },
        ],
      }),
    });

    const data = await searchQuery("le", ["Gaming", "Computers", "smartphones"]);
    expect(data).toEqual([
      { title: "Playstation Console", category: "Gaming" },
      { title: "Xbox Console", category: "Gaming" },
      { title: "Thinkpad Lenovo", category: "Computers" },
    ]);
    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=le",
    );
  });

  it("escapes special regex characters in the query", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [{ title: "C++ Guide", category: "books" }],
      }),
    });

    const data = await searchQuery("C++", ["books"]);
    expect(data).toEqual([{ title: "C++ Guide", category: "books" }]);
    expect(fetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=C%2B%2B",
    );
  });

  it("keeps results in enabled categories and matches tags", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [
          { title: "Serum", category: "beauty", tags: ["glow"] },
          { title: "Hammer", category: "home-decoration", tags: ["glow"] },
        ],
      }),
    });

    const data = await searchQuery("glow", ["beauty"]);
    expect(data).toEqual([
      { title: "Serum", category: "beauty", tags: ["glow"] },
    ]);
  });
});
