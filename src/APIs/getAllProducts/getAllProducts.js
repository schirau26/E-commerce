import { getCategory } from "../getCategory/getCategory.js";

//categories to get

export async function allShopProducts(categories) {
  if (!categories) {
    throw new Error("Invalid parameter `categories`");
  }
  const selectedProducts = [];

  for (const item of categories) {
    const categoryProducts = await getCategory(item);

    if (!Array.isArray(categoryProducts)) {
      continue;
    }
    for (const product of categoryProducts) {
      selectedProducts.push(product);
    }
  }

  // returns [{product one},{product two},{product three} ,{product one},{product two},{product three}]

  return selectedProducts;
}
