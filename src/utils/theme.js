import { useSyncExternalStore } from "react";

const THEME_KEY = "theme";
const listeners = new Set();

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function emitThemeChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStoredTheme() {
  return useSyncExternalStore(subscribe, getStoredTheme, () => null);
}

export function isLandingMidnight(colorMode, storedTheme) {
  return colorMode === "dark" || storedTheme !== "light";
}
