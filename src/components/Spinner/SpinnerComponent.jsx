import { useEffect, useState } from "react";
import {
  LuShirt,
  LuWatch,
  LuGem,
  LuShoppingBag,
  LuGlasses,
} from "react-icons/lu";
import css from "./SpinnerComponent.module.css";

const ICONS = [LuShirt, LuWatch, LuShoppingBag, LuGem, LuGlasses];
const CYCLE_MS = 700;

export default function SpinnerComponent({ variant = "full" }) {
  const compact = variant === "compact";
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const Icon = ICONS[index];
  const iconSize = compact ? 22 : 32;

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return;
    }

    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % ICONS.length);
        setVisible(true);
      }, 180);
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`${css.shell} ${compact ? css.compact : css.full}`}
      role="status"
      aria-label="Loading"
    >
      <div className={css.loader}>
        <span className={css.ring} aria-hidden="true" />
        <span className={css.arc} aria-hidden="true" />
        <span
          className={`${css.icon} ${visible ? css.iconVisible : ""}`}
          aria-hidden="true"
        >
          <Icon size={iconSize} strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}
