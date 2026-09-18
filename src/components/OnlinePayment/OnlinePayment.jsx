import { useContext } from "react";
import { PaymentContext } from "../../pages/checkout_sys/Checkout_sys";
import css from "./OnlinePayment.module.css";

const months = Array.from({ length: 12 }, (_, i) => String(i + 1));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

export default function OnlinePayment() {
  const { cardNumber, setCardNumber } = useContext(PaymentContext);

  return (
    <div className={css.block}>
      <h2 className={css.legend}>Card details</h2>
      <p className={css.help}>Enter a card number with at least 13 digits to place the order.</p>
      <label className={css.field}>
        Card holder’s name
        <input name="cardHolder" autoComplete="cc-name" />
      </label>
      <label className={css.field}>
        Card number
        <input
          name="cardNumber"
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          maxLength={19}
          value={cardNumber}
          onChange={(event) => setCardNumber(event.target.value)}
        />
      </label>
      <div className={css.row}>
        <label className={css.field}>
          Month
          <select name="expMonth" defaultValue="" autoComplete="cc-exp-month">
            <option value="" disabled>
              Month
            </option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label className={css.field}>
          Year
          <select name="expYear" defaultValue="" autoComplete="cc-exp-year">
            <option value="" disabled>
              Year
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className={css.field}>
          CVV
          <input
            type="text"
            name="cvvNumber"
            placeholder="CVV"
            maxLength={4}
            inputMode="numeric"
            autoComplete="cc-csc"
          />
        </label>
      </div>
    </div>
  );
}
