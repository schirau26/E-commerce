import { useContext } from "react";
import { PaymentContext } from "../../pages/checkout_sys/Checkout_sys";
import css from "./CheckoutAddress.module.css";

export default function CheckoutAddress() {
  const { address, setAddress } = useContext(PaymentContext);

  function update(field) {
    return (event) => {
      setAddress({ ...address, [field]: event.target.value });
    };
  }

  return (
    <section className={css.card}>
      <h1 className={css.title}>Delivery address</h1>
      <p className={css.help}>Name and street address are required to continue.</p>
      <form className={css.form} onSubmit={(event) => event.preventDefault()}>
        <label className={css.field}>
          Name
          <input
            name="name"
            value={address.name}
            onChange={update("name")}
            required
            autoComplete="name"
          />
        </label>
        <label className={css.field}>
          Email address
          <input
            name="email"
            type="email"
            value={address.email}
            onChange={update("email")}
            autoComplete="email"
          />
        </label>
        <label className={css.field}>
          Contact
          <input
            name="contact"
            value={address.contact}
            onChange={update("contact")}
            autoComplete="tel"
          />
        </label>
        <label className={css.field}>
          Address
          <input
            name="address"
            value={address.address}
            onChange={update("address")}
            required
            autoComplete="street-address"
          />
        </label>
      </form>
    </section>
  );
}
