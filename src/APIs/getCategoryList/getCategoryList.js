export async function getCategoryList() {
  const response = await fetch("https://dummyjson.com/products/category-list");
  if (!response.ok) {
    throw new Error("Failed to load category list");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
