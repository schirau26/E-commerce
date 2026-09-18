import { useContext } from "react";
import { CartContext } from "../../App";
import Quantity from "../Quantity/Quantity";

export default function MobileStepper({ item = {} }) {
  const { editCart } = useContext(CartContext);
  const maxQuantity = item.stock > 5 ? 5 : Math.max(1, item.stock || 1);
  const current = item.quantity || 1;

  function onChange(quantity) {
    editCart({
      ...item,
      quantity,
      cartPrice: Number((item.price * quantity).toFixed(2)),
    });
  }

  return (
    <Quantity value={current} min={1} max={maxQuantity} onChange={onChange} />
  );
}
