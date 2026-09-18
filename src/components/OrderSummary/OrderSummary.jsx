import { useContext } from "react";
import { CartContext } from "../../App";
import { cartTotals, formatMoney } from "../../utils/pricing";
import css from "./OrderSummary.module.css";

export default function OrderSummary() {
  const { cartProducts } = useContext(CartContext);
  const items = Array.isArray(cartProducts) ? cartProducts : [];
  const totals = cartTotals(items);

  return (
    <section className={css.card}>
      <h2 className={css.title}>Order Summary</h2>
      <p className={css.kicker}>
        {`Price details (${totals.quantity} ${totals.quantity === 1 ? "item" : "items"})`}
      </p>
      <dl className={css.rows}>
        <div className={css.row}>
          <dt>Total MRP</dt>
          <dd>${formatMoney(totals.mrp)}</dd>
        </div>
        <div className={css.row}>
          <dt>Discount on MRP</dt>
          <dd className={css.discount}>-${formatMoney(totals.discount)}</dd>
        </div>
        <div className={css.row}>
          <dt>VAT</dt>
          <dd>${formatMoney(totals.vat)}</dd>
        </div>
        <div className={css.row}>
          <dt>Shipping</dt>
          <dd>${formatMoney(totals.shipping)}</dd>
        </div>
      </dl>
      <div className={css.total}>
        <span>Total</span>
        <strong>${formatMoney(totals.total)}</strong>
      </div>
    </section>
  );
}
