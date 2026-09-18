import { createContext, useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartTable from "../../components/CartTable/CartTable";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import CheckoutAddress from "../../components/CheckoutAddress/CheckoutAddress";
import CartPayment from "../../components/CartPayment/CartPayment";
import CompleteCart from "../../components/CompleteCart/CompleteCart";
import { CartContext } from "../../App";
import css from "./Checkout_sys.module.css";

export const PaymentContext = createContext();

const STEPS = ["Cart", "Address", "Payment"];

export default function checkout() {
  const { cartProducts } = useContext(CartContext);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [cardNumber, setCardNumber] = useState("");
  const [address, setAddress] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

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
            <Link to="/" className={css.ghost}>
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
