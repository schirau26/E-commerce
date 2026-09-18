import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../App";
import css from "./CompleteCart.module.css";

export default function CompleteCart() {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  function cartReset() {
    clearCart();
    navigate("/");
  }

  return (
    <div className={css.page}>
      <section className={css.card}>
        <p className={css.brand}>XENON</p>
        <h1 className={css.title}>Order placed</h1>
        <p className={css.copy}>
          Payment has been completed. Continue to the shop when you are ready.
        </p>
        <button type="button" className={css.button} onClick={cartReset}>
          Finish
        </button>
      </section>
    </div>
  );
}
