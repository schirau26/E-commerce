export async function searchQuery(param, enabledCategories = []) {
  if (param === undefined || param === null || String(param).trim() === "") {
    return [];
  }

  const needle = String(param).trim().toLowerCase();
  const query = encodeURIComponent(String(param).trim());
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${query}`,
  );
  if (!response.ok) {
    throw new Error("Failed to search products");
  }
  const data = await response.json();
  const products = Array.isArray(data.products) ? data.products : [];
  const allowed = new Set(
    (enabledCategories || []).map((item) => String(item).toLowerCase()),
  );

  return products.filter((item) => {
    if (
      allowed.size &&
      !allowed.has(String(item.category || "").toLowerCase())
    ) {
      return false;
    }
    const tags = Array.isArray(item.tags) ? item.tags.join(" ") : "";
    const haystack =
      `${item.title || ""} ${item.category || ""} ${item.brand || ""} ${tags}`.toLowerCase();
    return haystack.includes(needle);
  });
}
