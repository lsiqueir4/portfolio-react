import { useEffect } from "react";
import { usePersistedPreference } from "./usePersistedPreference";
import { LANGUAGE_STORAGE_KEY } from "~/constants/language";
import i18n from "~/i18n/config";

const LANGUAGE_VALUES = ["pt", "en"] as const;
type Language = (typeof LANGUAGE_VALUES)[number];

// Keep this fallback logic byte-for-byte identical to the blocking script
// in app/root.tsx (languageInitScript) — if one changes, update the other.
// D-05: any locale that is neither pt-* nor en-* defaults to English.
function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "pt";
  const locale = navigator.language.toLowerCase();
  if (locale.startsWith("pt")) return "pt";
  if (locale.startsWith("en")) return "en";
  return "en";
}

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
  i18n.changeLanguage(language);
}

export function useLanguage() {
  const [language, setLanguage] = usePersistedPreference<Language>({
    storageKey: LANGUAGE_STORAGE_KEY,
    validValues: LANGUAGE_VALUES,
    detectBrowserDefault: detectBrowserLanguage,
    applySideEffect: applyLanguage,
  });

  // usePersistedPreference only invokes applySideEffect on set(), not for the
  // initial value — so this mount effect performs the initial persisted /
  // browser-detected sync of i18next (and produces the accepted one-time D-02
  // post-hydration language flash for non-default-locale visitors).
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return [language, setLanguage] as const;
}
