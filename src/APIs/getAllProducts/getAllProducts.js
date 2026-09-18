import { getCategory } from "../getCategory/getCategory.js";

export async function allShopProducts(categoryList, options = {}) {
  if (!categoryList) {
    throw new Error("Invalid parameter `categories`");
  }

  const results = await Promise.all(
    categoryList.map(async (item) => {
      try {
        const categoryProducts = await getCategory(item, options);
        return {
          ok: true,
          products: Array.isArray(categoryProducts) ? categoryProducts : [],
        };
      } catch {
        return { ok: false, products: [] };
      }
    }),
  );

  if (
    categoryList.length > 0 &&
    results.every((result) => result.ok === false)
  ) {
    throw new Error("Failed to load catalog");
  }

  return results.flatMap((result) => result.products);
}
