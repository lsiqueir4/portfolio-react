import { usePersistedPreference } from "./usePersistedPreference";

const THEME_VALUES = ["light", "dark"] as const;
type Theme = (typeof THEME_VALUES)[number];

// Keep this fallback logic byte-for-byte identical to the blocking script
// in app/root.tsx (themeInitScript) — if one changes, update the other.
function detectBrowserTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function useTheme() {
  return usePersistedPreference<Theme>({
    storageKey: "theme",
    validValues: THEME_VALUES,
    detectBrowserDefault: detectBrowserTheme,
    applySideEffect: applyTheme,
  });
}
