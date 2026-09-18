import { useContext } from "react";
import { UserProductSize } from "../ProductPricingDetails/ProductPricingDetails";
import css from "./ProductSize.module.css";

const SIZES = ["S", "M", "L", "XL"];

export default function ProductSize() {
  const { size, setSize } = useContext(UserProductSize);

  return (
    <div className={css.wrap}>
      <span className={css.label}>Select Size</span>
      <div className={css.row}>
        {SIZES.map((option) => (
          <button
            type="button"
            key={option}
            className={`${css.pill} ${size === option ? css.selected : ""}`}
            onClick={() => setSize(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
