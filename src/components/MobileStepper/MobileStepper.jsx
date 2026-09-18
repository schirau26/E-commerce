import { useContext, useEffect } from "react";
import { CartContext } from "../../App";
import Quantity from "../Quantity/Quantity";
import { quantityBounds } from "../../utils/inventory";

export default function MobileStepper({ item = {} }) {
  const { editCart, cartProducts } = useContext(CartContext);
  const reserved = (cartProducts || [])
    .filter((line) => line.id === item.id && line.cartId !== item.cartId)
    .reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const bounds = quantityBounds(item, reserved);
  const current = item.quantity || 1;
  const min = 1;
  const max = bounds.canBuy ? bounds.max : 1;

  function onChange(quantity) {
    editCart({
      ...item,
      quantity,
      cartPrice: Number((item.price * quantity).toFixed(2)),
    });
  }

  useEffect(() => {
    if (!bounds.canBuy) {
      return;
    }
    const next = Math.min(max, Math.max(min, current));
    if (next !== current) {
      onChange(next);
    }
  }, [min, max, current, bounds.canBuy]);

  return (
    <Quantity
      value={current}
      min={min}
      max={max}
      onChange={onChange}
      variant="compact"
    />
  );
}
