export function productUnitPrice(product = {}) {
  const list = Number(product.price) || 0;
  const pct = Number(product.discountPercentage) || 0;
  const sale = Number((list * (1 - pct / 100)).toFixed(2));
  return { list, sale, pct };
}

export function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}
