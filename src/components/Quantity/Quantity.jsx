import css from "./Quantity.module.css";

export default function Quantity({
  value = 1,
  onChange = () => {},
  min = 1,
  max = 5,
  variant = "default",
}) {
  const quantity = value;
  const isPdp = variant === "pdp";
  const isCompact = variant === "compact";

  return (
    <div className={css.wrap}>
      {isCompact ? null : <span className={css.label}>Quantity</span>}
      <div
        className={`${css.control} ${isPdp ? css.controlPdp : ""} ${isCompact ? css.controlCompact : ""}`}
      >
        <button
          type="button"
          className={css.btn}
          onClick={() => onChange(quantity <= min ? min : quantity - 1)}
        >
          −
        </button>
        <span className={css.value}>
          {isPdp ? String(quantity).padStart(2, "0") : quantity}
        </span>
        <button
          type="button"
          className={css.btn}
          onClick={() => onChange(quantity >= max ? max : quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
