import { useContext } from "react";
import OnlinePayment from "../OnlinePayment/OnlinePayment";
import { PaymentContext } from "../../pages/checkout_sys/Checkout_sys";
import css from "./CartPayment.module.css";

const methods = [
  { label: "Cash on delivery", value: "1" },
  { label: "Online Payment", value: "2" },
];

export default function CartPayment() {
  const { paymentMethod, setPaymentMethod } = useContext(PaymentContext);
  const showCard = paymentMethod === "2";

  return (
    <section className={css.card}>
      <h1 className={css.title}>Payment</h1>
      <fieldset className={css.methods}>
        <legend>Payment method</legend>
        {methods.map((method) => (
          <label key={method.value} className={css.option}>
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={() => setPaymentMethod(method.value)}
            />
            {method.label}
          </label>
        ))}
      </fieldset>
      {showCard ? <OnlinePayment /> : null}
    </section>
  );
}
