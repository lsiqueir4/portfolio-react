// Single source of truth for the language localStorage key. Must be imported
// by BOTH the SSR no-flash blocking script (app/root.tsx) and the client-side
// language hook (app/hooks/useLanguage.ts) — those two must read/write the
// exact same key or the SSR/detection logic silently desyncs.
export const LANGUAGE_STORAGE_KEY = "language" as const;
