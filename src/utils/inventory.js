export const ORDER_QTY_CAP = 5;

export function quantityBounds(product = {}, reserved = 0) {
  const stock = Math.max(0, Number(product.stock) || 0);
  const outOfStock =
    stock === 0 || product.availabilityStatus === "Out of Stock";
  if (outOfStock) {
    return { stock, min: 0, max: 0, outOfStock: true, canBuy: false };
  }
  const cap = Math.min(ORDER_QTY_CAP, stock);
  const max = Math.max(0, cap - Math.max(0, Number(reserved) || 0));
  if (max < 1) {
    return { stock, min: 0, max: 0, outOfStock: false, canBuy: false };
  }
  return { stock, min: 1, max, outOfStock: false, canBuy: true };
}

export function quantityForCart(quantity, bounds) {
  if (!bounds?.canBuy) {
    return 0;
  }
  const wanted = Number(quantity) || 1;
  return Math.min(bounds.max, Math.max(1, wanted));
}

export function clampCartItems(items = []) {
  if (!Array.isArray(items) || !items.length) {
    return { items: [], changed: false };
  }
  const used = {};
  let changed = false;
  const next = [];
  items.forEach((item) => {
    const key = String(item.id);
    const reserved = used[key] || 0;
    const bounds = quantityBounds(item, reserved);
    if (!bounds.canBuy) {
      changed = true;
      return;
    }
    const qty = quantityForCart(item.quantity, bounds);
    if (qty !== Number(item.quantity)) {
      changed = true;
    }
    used[key] = reserved + qty;
    next.push({
      ...item,
      quantity: qty,
      cartPrice: Number((Number(item.price) * qty).toFixed(2)),
    });
  });
  return { items: next, changed };
}

export function isNewProduct(product, days = 45) {
  const created = product?.meta?.createdAt;
  if (!created) {
    return false;
  }
  const time = new Date(created).getTime();
  if (Number.isNaN(time)) {
    return false;
  }
  return Date.now() - time <= Number(days) * 86400000;
}

export function applyStockMap(product, stockMap = {}) {
  if (!product || product.id == null) {
    return product;
  }
  if (!Object.hasOwn(stockMap, String(product.id))) {
    return product;
  }
  const stock = Math.max(0, Number(stockMap[String(product.id)]) || 0);
  return {
    ...product,
    stock,
    availabilityStatus:
      stock === 0 ? "Out of Stock" : product.availabilityStatus,
  };
}
