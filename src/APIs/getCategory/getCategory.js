import { categories as boutiqueCategories } from "../../data/category_data.js";

export async function getCategory(category, options = {}) {
  if (!category || !String(category).trim()) {
    throw new Error("Enter a valid category");
  }

  const categoryFormatted = String(category).toLowerCase();
  const params = new URLSearchParams();
  if (options.select) {
    params.set("select", options.select);
  }
  const query = params.toString();
  const url = `https://dummyjson.com/products/category/${categoryFormatted}${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(url);
    if (response.ok === false) {
      throw new Error("Failed to load category");
    }
    const responseData = await response.json();
    return Array.isArray(responseData.products) ? responseData.products : [];
  } catch (err) {
    console.error(err, "something went wrong");
    throw err;
  }
}

export { boutiqueCategories };
