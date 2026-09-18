import { describe, expect, it } from "vitest";
import { clampCartItems, ORDER_QTY_CAP } from "./inventory";

describe("clampCartItems", () => {
  it("caps quantity at ORDER_QTY_CAP", () => {
    const { items, changed } = clampCartItems([
      {
        id: 1,
        price: 10,
        quantity: 9,
        stock: 40,
        cartPrice: 90,
      },
    ]);
    expect(changed).toBe(true);
    expect(items[0].quantity).toBe(ORDER_QTY_CAP);
    expect(items[0].cartPrice).toBe(50);
  });

  it("drops unbuyable lines", () => {
    const { items, changed } = clampCartItems([
      { id: 2, price: 5, quantity: 1, stock: 0, cartPrice: 5 },
    ]);
    expect(changed).toBe(true);
    expect(items).toEqual([]);
  });
});
