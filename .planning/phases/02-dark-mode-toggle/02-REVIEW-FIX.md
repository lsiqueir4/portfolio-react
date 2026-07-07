---
phase: 02-dark-mode-toggle
fixed_at: 2026-07-07T14:36:00Z
review_path: .planning/phases/02-dark-mode-toggle/02-REVIEW.md
iteration: 1
findings_in_scope: 3
fixed: 3
skipped: 0
status: all_fixed
---

# Phase 02: Code Review Fix Report

**Fixed at:** 2026-07-07T14:36:00Z
**Source review:** .planning/phases/02-dark-mode-toggle/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 3 (fix_scope: critical_warning — 1 Critical, 2 Warning; the 4 Info findings were out of scope and left untouched)
- Fixed: 3
- Skipped: 0

## Fixed Issues

### CR-01: Two ThemeToggle instances desync after a breakpoint-crossing resize, causing a stale/no-op first click

**Files modified:** `app/hooks/usePersistedPreference.ts`
**Commit:** `40d7104`
**Applied fix:** Rewrote `usePersistedPreference` from a per-instance `useState` to a module-level store keyed by `storageKey`, read via `useSyncExternalStore` (with a `getServerSnapshot` for SSR parity). Every consumer that shares a `storageKey` — e.g. the desktop and mobile `<ThemeToggle />` instances rendered simultaneously in `Header` — now reads from and writes to the exact same store, so both `aria-pressed`/`aria-label` stay in sync across a resize instead of one instance holding stale local state. Followed the review's suggested `useSyncExternalStore` approach, adapted to memoize one store per `storageKey` (via a `Map`) rather than a single hardcoded store, since the primitive is also intended for the Phase 3 locale hook. Verified with `tsc --noEmit` (no new errors beyond the pre-existing, unrelated `+types` route-generation errors) and `eslint` (clean).

### WR-01: `usePersistedPreference` has no error handling around `localStorage` access — can crash the entire page

**Files modified:** `app/hooks/usePersistedPreference.ts`
**Commit:** `9f64bbd`
**Applied fix:** Wrapped both the `localStorage.getItem` read (in the store's lazy initializer) and the `localStorage.setItem` write (in `set`) in `try/catch`, matching the equivalent blocking script in `root.tsx`. On a read failure, the store falls back to `detectBrowserDefault()`; on a write failure, the value/side-effect still apply for the current session but the persistence write is silently skipped. Applied on top of the CR-01 rewrite since both findings touch the same block of code. Verified with `tsc --noEmit` and `eslint` (clean, no new errors).

### WR-02: `"theme"` storage key is duplicated as an untied literal instead of a single shared constant

**Files modified:** `app/constants/theme.ts` (new), `app/root.tsx`, `app/hooks/useTheme.ts`
**Commit:** `c4f3a24`
**Applied fix:** Created `app/constants/theme.ts` exporting `THEME_STORAGE_KEY = "theme" as const` (new file, explicitly required by the fix — the review's suggested location was used directly, matching this project's existing `app/constants/` convention). Updated `app/root.tsx` to import it (dropping the local re-declaration) and `app/hooks/useTheme.ts` to import and pass it as `storageKey` instead of re-hardcoding the literal `"theme"`. Left the `root.tsx` "Zero-interpolation" comment's wording intact — its imprecision is tracked separately as IN-04, which is out of scope for this `critical_warning` fix pass — only updating it to note the constant is now imported rather than locally declared. Verified with `tsc --noEmit`, `eslint`, and `prettier --check` (all clean, no new issues).

## Skipped Issues

None — all in-scope findings were fixed.

---

_Fixed: 2026-07-07T14:36:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
