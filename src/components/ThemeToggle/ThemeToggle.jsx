import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { useColorMode } from "../../src/components/ui/color-mode";
import {
  emitThemeChange,
  isLandingMidnight,
  useStoredTheme,
} from "../../utils/theme";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode();
  const { pathname } = useLocation();
  const storedTheme = useStoredTheme();
  const onLanding = pathname === "/";
  const isMidnight = onLanding
    ? isLandingMidnight(colorMode, storedTheme)
    : colorMode === "dark";

  function onToggle() {
    if (onLanding && storedTheme !== "light" && colorMode !== "dark") {
      setColorMode("light");
    } else {
      toggleColorMode();
    }
    emitThemeChange();
  }

  return (
    <ClientOnly fallback={<Skeleton className={css.fallback} />}>
      <IconButton
        type="button"
        variant="ghost"
        size="sm"
        className={css.button}
        onClick={onToggle}
        aria-label={isMidnight ? "Use light theme" : "Use midnight theme"}
        title={isMidnight ? "Use light theme" : "Use midnight theme"}
      >
        {isMidnight ? <LuSun size={18} /> : <LuMoon size={18} />}
      </IconButton>
    </ClientOnly>
  );
}
