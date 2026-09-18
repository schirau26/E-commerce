import { allShopProducts } from "../getAllProducts/getAllProducts.js";
import { categories } from "../../data/category_data.js";

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchQuery(param) {
  if (param === undefined || param === null || String(param).trim() === "") {
    return [];
  }

  const shopItems = await allShopProducts(categories);
  const regex = new RegExp(`\\s*${escapeRegExp(String(param))}\\s*`, "i");

  return shopItems.filter((item) => {
    return regex.test(item.category) || regex.test(item.title);
  });
}
