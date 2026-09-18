import { categories } from "../../data/category_data.js";

export async function getCategory(category) {
  const categoryFormatted = category.toLowerCase();

  if (!categories.includes(categoryFormatted)) {
    throw new Error("Enter a valid category");
  }
  try {
    const response = await fetch(
      `https://dummyjson.com/products/category/${categoryFormatted}`,
    );
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
