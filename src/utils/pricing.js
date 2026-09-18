export function productUnitPrice(product = {}) {
  const list = Number(product.price) || 0;
  const pct = Number(product.discountPercentage) || 0;
  const sale = Number((list * (1 - pct / 100)).toFixed(2));
  return { list, sale, pct };
}

export function formatMoney(value) {
  return Number(value || 0).toFixed(2);
}

export function cartTotals(items = []) {
  let mrp = 0;
  let sale = 0;
  let quantity = 0;

  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    const unitSale = Number(item.price) || 0;
    const unitList = Number(item.listPrice) || unitSale;
    mrp += unitList * qty;
    sale += unitSale * qty;
    quantity += qty;
  }

  const discount = Math.max(0, mrp - sale);
  const vat = Number((sale * 0.12).toFixed(2));
  const shipping = Number((sale * 0.15).toFixed(2));
  const total = Number((sale + vat + shipping).toFixed(2));

  return {
    quantity,
    mrp: Number(mrp.toFixed(2)),
    sale: Number(sale.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    vat,
    shipping,
    total,
  };
}
