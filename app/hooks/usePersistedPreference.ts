import { useState } from "react";

interface UsePersistedPreferenceOptions<T extends string> {
  storageKey: string;
  validValues: readonly T[];
  /** Only used if no valid stored value exists — e.g. matchMedia for theme, navigator.language for locale */
  detectBrowserDefault: () => T;
  /** Side effect to run whenever the value changes (e.g. toggle classList, set documentElement.lang) */
  applySideEffect: (value: T) => void;
}

export function usePersistedPreference<T extends string>({
  storageKey,
  validValues,
  detectBrowserDefault,
  applySideEffect,
}: UsePersistedPreferenceOptions<T>) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return detectBrowserDefault();
    const stored = window.localStorage.getItem(storageKey);
    if (stored && (validValues as readonly string[]).includes(stored)) {
      return stored as T;
    }
    return detectBrowserDefault();
  });

  function set(next: T) {
    setValue(next);
    window.localStorage.setItem(storageKey, next);
    applySideEffect(next);
  }

  return [value, set] as const;
}
