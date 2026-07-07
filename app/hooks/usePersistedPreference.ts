import { useSyncExternalStore } from "react";

interface UsePersistedPreferenceOptions<T extends string> {
  storageKey: string;
  validValues: readonly T[];
  /** Only used if no valid stored value exists — e.g. matchMedia for theme, navigator.language for locale */
  detectBrowserDefault: () => T;
  /** Side effect to run whenever the value changes (e.g. toggle classList, set documentElement.lang) */
  applySideEffect: (value: T) => void;
}

interface PreferenceStore<T extends string> {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  subscribe: (listener: () => void) => () => void;
  set: (next: T) => void;
}

// Module-level cache keyed by storageKey: every component instance backed by
// the same storageKey (e.g. the desktop + mobile <ThemeToggle /> in Header)
// shares this single store instead of holding independent per-instance
// useState, so they can never desync across a breakpoint-crossing resize.
const stores = new Map<string, PreferenceStore<string>>();

function createStore<T extends string>(
  storageKey: string,
  validValues: readonly T[],
  detectBrowserDefault: () => T,
  applySideEffect: (value: T) => void,
): PreferenceStore<T> {
  const listeners = new Set<() => void>();
  const serverSnapshot = detectBrowserDefault();
  let value: T = serverSnapshot;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && (validValues as readonly string[]).includes(stored)) {
      value = stored as T;
    }
  }

  return {
    getSnapshot: () => value,
    getServerSnapshot: () => serverSnapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set: (next: T) => {
      if (next === value) return;
      value = next;
      window.localStorage.setItem(storageKey, next);
      applySideEffect(next);
      listeners.forEach((listener) => listener());
    },
  };
}

function getStore<T extends string>(
  storageKey: string,
  validValues: readonly T[],
  detectBrowserDefault: () => T,
  applySideEffect: (value: T) => void,
): PreferenceStore<T> {
  const existing = stores.get(storageKey) as PreferenceStore<T> | undefined;
  if (existing) return existing;

  const created = createStore(storageKey, validValues, detectBrowserDefault, applySideEffect);
  stores.set(storageKey, created as unknown as PreferenceStore<string>);
  return created;
}

export function usePersistedPreference<T extends string>({
  storageKey,
  validValues,
  detectBrowserDefault,
  applySideEffect,
}: UsePersistedPreferenceOptions<T>) {
  const store = getStore(storageKey, validValues, detectBrowserDefault, applySideEffect);

  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return [value, store.set] as const;
}
