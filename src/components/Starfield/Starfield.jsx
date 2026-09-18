import { useLocation } from "react-router-dom";
import { useColorMode } from "../../src/components/ui/color-mode";
import { isLandingMidnight, useStoredTheme } from "../../utils/theme";
import css from "./Starfield.module.css";

export default function Starfield() {
  const { colorMode } = useColorMode();
  const storedTheme = useStoredTheme();
  const { pathname } = useLocation();
  const onLanding = pathname === "/";
  const midnight =
    colorMode === "dark" ||
    (onLanding && isLandingMidnight(colorMode, storedTheme));

  return (
    <div
      className={css.root}
      data-starfield="true"
      data-tone={midnight ? "midnight" : "light"}
      aria-hidden="true"
    >
      <div className={css.glow} />
      <div className={css.stars} />
      <div className={css.starsFine} />
      <div className={css.gleam} />
    </div>
  );
}
