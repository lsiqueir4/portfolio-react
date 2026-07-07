import { useSyncExternalStore } from "react";

interface UsePersistedPreferenceOptions<T extends string> {
  storageKey: string;
  validValues: readonly T[];
  /**
   * The fixed value that real SSR (Node, no `window`/`navigator`) always renders.
   * MUST be a plain constant, not derived from any browser API — it is handed
   * to React as `getServerSnapshot`, so it has to be byte-identical on the
   * client's very first hydration pass to whatever the server actually sent.
   * Calling a browser-detection function here (as this hook used to do) makes
   * the "server snapshot" secretly environment-dependent: in the browser it
   * silently resolves to the *real* detected value instead of the value the
   * server rendered, defeating React's hydration-mismatch correction and
   * leaving `aria-*` attributes, `className`, and any other reader that also
   * derives from this store permanently out of sync with each other.
   */
  ssrDefault: T;
  /** Only used on the client, post-hydration — e.g. matchMedia for theme, navigator.language for locale */
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
  ssrDefault: T,
  detectBrowserDefault: () => T,
  applySideEffect: (value: T) => void,
): PreferenceStore<T> {
  const listeners = new Set<() => void>();
  // `value`'s initial computation may run in the browser (this store is
  // lazily created on whichever side — server or client — first renders a
  // consumer), so it's fine/desired for it to use the real browser detection
  // here. Only `getServerSnapshot` below must stay pinned to the constant
  // `ssrDefault`, since that's what React uses to reconcile hydration.
  let value: T = typeof window === "undefined" ? ssrDefault : detectBrowserDefault();

  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored && (validValues as readonly string[]).includes(stored)) {
        value = stored as T;
      }
    } catch {
      // localStorage unavailable (e.g. Safari "Block All Cookies") — fall back to detectBrowserDefault()
    }
  }

  return {
    getSnapshot: () => value,
    getServerSnapshot: () => ssrDefault,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set: (next: T) => {
      if (next === value) return;
      value = next;
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // ignore — theme still applies for this session via applySideEffect
      }
      applySideEffect(next);
      listeners.forEach((listener) => listener());
    },
  };
}

function getStore<T extends string>(
  storageKey: string,
  validValues: readonly T[],
  ssrDefault: T,
  detectBrowserDefault: () => T,
  applySideEffect: (value: T) => void,
): PreferenceStore<T> {
  const existing = stores.get(storageKey) as PreferenceStore<T> | undefined;
  if (existing) return existing;

  const created = createStore(
    storageKey,
    validValues,
    ssrDefault,
    detectBrowserDefault,
    applySideEffect,
  );
  stores.set(storageKey, created as unknown as PreferenceStore<string>);
  return created;
}

export function usePersistedPreference<T extends string>({
  storageKey,
  validValues,
  ssrDefault,
  detectBrowserDefault,
  applySideEffect,
}: UsePersistedPreferenceOptions<T>) {
  const store = getStore(
    storageKey,
    validValues,
    ssrDefault,
    detectBrowserDefault,
    applySideEffect,
  );

  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  return [value, store.set] as const;
}
