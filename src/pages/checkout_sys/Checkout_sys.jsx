import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CartTable from "../../components/CartTable/CartTable";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import CheckoutAddress from "../../components/CheckoutAddress/CheckoutAddress";
import CartPayment from "../../components/CartPayment/CartPayment";
import CompleteCart from "../../components/CompleteCart/CompleteCart";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import { CartContext } from "../../App";
import { useCatalog } from "../../context/CatalogContext";
import { clampCartItems } from "../../utils/inventory";
import css from "./Checkout_sys.module.css";

export const PaymentContext = createContext();

const STEPS = ["Cart", "Address", "Payment"];

export default function checkout() {
  const { cartProducts, clearCart, replaceCart } = useContext(CartContext);
  const { placeOrder, logEvent } = useCatalog();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [alert, setAlert] = useState({ bool: false, type: "" });
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [cardNumber, setCardNumber] = useState("");
  const [address, setAddress] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });
  const clampedOnce = useRef(false);

  useEffect(() => {
    if (clampedOnce.current) {
      return;
    }
    clampedOnce.current = true;
    const { items, changed } = clampCartItems(cartProducts);
    if (changed) {
      replaceCart(items);
      setAlert({ bool: true, type: "limitReached" });
      logEvent({
        type: "cart_clamped",
        message: "Cart quantities were reduced to the per-product limit",
      });
    }
  }, [cartProducts, replaceCart, logEvent]);

  const cartEmpty = !cartProducts?.length;
  const addressValid =
    address.name.trim().length > 0 && address.address.trim().length > 0;

  const canPlaceOrder = useMemo(() => {
    if (paymentMethod === "1") {
      return true;
    }
    const digits = cardNumber.replace(/\D/g, "");
    return digits.length >= 13;
  }, [paymentMethod, cardNumber]);

  const canContinue =
    step === 0 ? !cartEmpty : step === 1 ? addressValid : canPlaceOrder;

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo(0, 0);
  }

  function goNext() {
    if (!canContinue) {
      return;
    }
    if (step === 2) {
      const { items, changed } = clampCartItems(cartProducts);
      if (changed) {
        replaceCart(items);
        setAlert({ bool: true, type: "limitReached" });
        logEvent({
          type: "cart_clamped",
          message: "Cart quantities were reduced to the per-product limit",
        });
        return;
      }
      const result = placeOrder({
        items: cartProducts,
        address,
        paymentMethod: paymentMethod === "1" ? "COD" : "Card",
      });
      if (!result?.ok) {
        setAlert({ bool: true, type: "orderFail" });
        return;
      }
      clearCart();
      setDone(true);
      return;
    }
    setStep((current) => Math.min(2, current + 1));
    window.scrollTo(0, 0);
  }

  if (done) {
    return (
      <PaymentContext.Provider
        value={{
          paymentMethod,
          setPaymentMethod,
          cardNumber,
          setCardNumber,
          address,
          setAddress,
        }}
      >
        <CompleteCart />
      </PaymentContext.Provider>
    );
  }

  return (
    <PaymentContext.Provider
      value={{
        paymentMethod,
        setPaymentMethod,
        cardNumber,
        setCardNumber,
        address,
        setAddress,
      }}
    >
      {alert.bool ? <AlertPopUp type={alert.type} /> : null}
      <div className={css.page}>
        <header className={css.header}>
          <Link to="/" className={css.brand}>
            XENON
          </Link>
          <ol className={css.steps} aria-label="Checkout">
            {STEPS.map((label, index) => (
              <li
                key={label}
                className={`${css.step} ${index === step ? css.stepActive : ""} ${index < step ? css.stepDone : ""}`}
              >
                {label}
              </li>
            ))}
          </ol>
        </header>

        <div className={`${css.layout} ${step === 1 ? css.layoutSingle : ""}`}>
          <div className={css.main}>
            {step === 0 ? <CartTable /> : null}
            {step === 1 ? <CheckoutAddress /> : null}
            {step === 2 ? <CartPayment /> : null}
          </div>
          {step !== 1 ? (
            <aside className={css.aside}>
              <OrderSummary />
            </aside>
          ) : null}
        </div>

        <div className={css.nav}>
          {step === 0 ? (
            <Link to="/shop" className={css.ghost}>
              ← Continue Shopping
            </Link>
          ) : (
            <button type="button" className={css.ghost} onClick={goBack}>
              ← Back
            </button>
          )}
          <button
            type="button"
            className={css.primary}
            onClick={goNext}
            disabled={!canContinue}
          >
            {step === 2 ? "Place order" : "Continue"}
          </button>
        </div>
      </div>
    </PaymentContext.Provider>
  );
}
