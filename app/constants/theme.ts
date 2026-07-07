// Single source of truth for the theme localStorage key. Must be imported by
// BOTH the SSR no-flash blocking script (app/root.tsx) and the client-side
// theme hook (app/hooks/useTheme.ts) — those two must read/write the exact
// same key or the SSR no-flash guarantee silently breaks.
export const THEME_STORAGE_KEY = "theme" as const;
