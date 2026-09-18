import { useContext } from "react";
import { LuTrash } from "react-icons/lu";
import MobileStepper from "../MobileStepper/MobileStepper";
import { CartContext } from "../../App";
import { cartTotals, formatMoney } from "../../utils/pricing";
import css from "./CartTable.module.css";

export default function CartTable() {
  const { cartProducts, deleteCartItem } = useContext(CartContext);
  const items = Array.isArray(cartProducts) ? cartProducts : [];
  const { quantity } = cartTotals(items);

  return (
    <section className={css.card}>
      <div className={css.heading}>
        <h1 className={css.title}>Shopping Cart</h1>
        <p className={css.count}>
          {quantity} {quantity === 1 ? "Item" : "Items"}
        </p>
      </div>

      {items.length === 0 ? (
        <p className={css.empty}>Your bag is empty.</p>
      ) : (
        <ul className={css.list}>
          <li className={css.columns} aria-hidden="true">
            <span>Product details</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </li>
          {items.map((item) => {
            const unitSale = Number(item.price) || 0;
            const unitList = Number(item.listPrice) || 0;
            const showList = unitList > unitSale;
            return (
              <li key={item.cartId} className={css.row}>
                <img
                  className={css.thumb}
                  src={item.thumbnail}
                  alt={item.title}
                />
                <div className={css.details}>
                  <div className={css.top}>
                    <div>
                      <p className={css.name}>{item.title}</p>
                      {item.size ? (
                        <p className={css.meta}>Size — {item.size}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className={css.remove}
                      aria-label={`Remove ${item.title}`}
                      onClick={() => deleteCartItem(item.cartId)}
                    >
                      <LuTrash />
                    </button>
                  </div>
                  <div className={css.bottom}>
                    <p className={css.price}>
                      <span>${formatMoney(unitSale)}</span>
                      {showList ? (
                        <span className={css.listPrice}>
                          {" "}
                          ${formatMoney(unitList)}
                        </span>
                      ) : null}
                    </p>
                    <MobileStepper item={item} />
                    <p className={css.lineTotal}>
                      ${formatMoney(item.cartPrice)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
