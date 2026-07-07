---
phase: 02-dark-mode-toggle
plan: 01
subsystem: ui
tags: [dark-mode, tailwind-v4, react-router-7, ssr, localstorage, accessibility, playwright]

# Dependency graph
requires:
  - phase: 01-theme-css-token-centralization
    provides: 8 semantic CSS tokens (surface, surface-elevated, on-surface, muted, muted-hover, accent, accent-hover, border-subtle) and the compiled-but-unused `@custom-variant dark` directive in app/app.css
provides:
  - Inverted app.css token architecture — light-mode values in `@theme` base, Phase 1's dark values preserved verbatim in a new `.dark {}` block
  - Reusable `usePersistedPreference<T>` detect->override->persist primitive (DARK-05), consumable unmodified by Phase 3's language toggle
  - `useTheme()` hook + `ThemeToggle` component wired into Header (desktop + mobile)
  - SSR-safe blocking init script in root.tsx preventing flash-of-wrong-theme
affects: [03-language-toggle]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "app/hooks/ directory established as the home for detect->override->persist primitives (first hooks directory in this codebase)"
    - "CSS-only dual-icon toggle (Sun/Moon both rendered, visibility via dark: utility classes) — avoids icon hydration mismatch"
    - "Static zero-interpolation dangerouslySetInnerHTML blocking script pattern for pre-paint theme application"

key-files:
  created:
    - app/hooks/usePersistedPreference.ts
    - app/hooks/useTheme.ts
    - app/features/Header/ThemeToggle.tsx
    - tests/theme-toggle.spec.ts
  modified:
    - app/app.css
    - app/root.tsx
    - app/features/Header/index.tsx
    - tests/visual.spec.ts
    - tests/visual.spec.ts-snapshots/header-chromium-linux.png

key-decisions:
  - "D-01 corrected direction applied: @theme base now holds NEW light-mode values; .dark {} holds Phase 1's already-signed-off dark values verbatim (not the literal 'dark block holds light values' phrasing in original CONTEXT.md)"
  - "accent stays byte-identical (purple-500) across both themes per DARK-04; accent-hover becomes theme-aware (purple-700 light / purple-400 dark unchanged) because literal parity fails WCAG AA (2.64:1) for its real nav-hover-text usage, while purple-700 on white passes at 6.98:1"
  - "color-scheme changed from media-query-driven to class-driven (.dark selector) so a manual light override beats an OS dark preference"

patterns-established:
  - "usePersistedPreference<T extends string>({storageKey, validValues, detectBrowserDefault, applySideEffect}) generic hook — Phase 3 supplies navigator.language as its detector and reuses this unchanged"
  - "Blocking <script> in root.tsx Layout <head>, module-scope THEME_STORAGE_KEY + themeInitScript constants, zero runtime interpolation (Security V5 / T-02-02)"

requirements-completed: [DARK-01, DARK-02, DARK-03, DARK-04, DARK-05]

coverage:
  - id: D1
    description: "Sun/moon toggle button in Header (desktop nav + always-visible mobile control) — native button, aria-label, aria-pressed, keyboard-operable"
    requirement: "DARK-01"
    verification:
      - kind: e2e
        ref: "tests/theme-toggle.spec.ts#toggle presence and accessibility"
        status: pass
      - kind: e2e
        ref: "tests/theme-toggle.spec.ts#click toggles the dark class on <html> and updates aria-pressed"
        status: pass
    human_judgment: false
  - id: D2
    description: "No flash of wrong theme on load — blocking script applies persisted/OS-preferred theme before first paint"
    requirement: "DARK-02"
    verification:
      - kind: e2e
        ref: "tests/theme-toggle.spec.ts#persisted dark theme applies before first paint (no flash)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Manual toggle choice persists via localStorage across reloads, overriding the OS/browser default"
    requirement: "DARK-03"
    verification:
      - kind: e2e
        ref: "tests/theme-toggle.spec.ts#persistence write: clicking updates localStorage"
        status: pass
      - kind: e2e
        ref: "tests/theme-toggle.spec.ts#persisted light theme overrides an OS dark preference"
        status: pass
    human_judgment: false
  - id: D4
    description: "Purple accent (purple-500) renders identically in both themes; only background/text tokens invert"
    requirement: "DARK-04"
    verification:
      - kind: e2e
        ref: "playwright:tests/visual.spec.ts-snapshots/{home-full,hero,projects,aboutme,contacts,footer}-chromium-linux.png (unchanged, dark theme forced)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Detect->override->persist logic built as a reusable primitive for Phase 3's language toggle"
    requirement: "DARK-05"
    verification:
      - kind: unit
        ref: "app/hooks/usePersistedPreference.ts (generic hook, consumed unmodified by app/hooks/useTheme.ts)"
        status: pass
    human_judgment: false

duration: 8min
completed: 2026-07-07
status: complete
---

# Phase 2 Plan 01: Dark Mode Toggle Summary

**SSR-safe dark/light theme toggle in the Header with a static blocking init script, localStorage persistence, and a reusable `usePersistedPreference` primitive for Phase 3's language toggle**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-07T12:17:54Z
- **Completed:** 2026-07-07T12:25:08Z
- **Tasks:** 3
- **Files modified:** 8 (4 created, 4 modified, plus 1 regenerated screenshot baseline)

## Accomplishments
- `app/app.css` inverted correctly: `@theme` base now holds a WCAG-AA-verified light-mode palette; a new `.dark {}` block preserves today's Phase 1 dark values byte-for-byte
- `usePersistedPreference<T>` — generic detect→override→persist React hook (DARK-05), SSR-guarded, validates stored values against an explicit allow-list before trusting them
- `useTheme()` + `ThemeToggle` — native sun/moon button wired into both the desktop nav group and an always-visible mobile control row, with CSS-only dual-icon rendering (no hydration mismatch)
- `app/root.tsx` — static zero-interpolation blocking `<script>` applies the persisted/OS-preferred theme before first paint; `suppressHydrationWarning` on `<html>` and the toggle button
- Full behavioral test suite (5/5) and visual-regression suite (7/7) green; dark-theme baselines confirmed byte-identical except the header (which now legitimately contains the new toggle button)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing behavioral spec + pin visual baselines to dark theme** - `c1c1b2b` (test) — RED confirmed (4/5 tests failed, no toggle/hook/script existed yet)
2. **Task 2: Invert app.css tokens and build the persistence hooks** - `335eae6` (feat)
3. **Task 3: Build ThemeToggle, wire into Header, add SSR no-flash script** - `fcc14c6` (feat) — GREEN confirmed (5/5 behavioral tests, 7/7 visual tests)

_TDD gate sequence verified in git log: test(c1c1b2b) -> feat(335eae6) -> feat(fcc14c6)._

## Files Created/Modified
- `app/hooks/usePersistedPreference.ts` - Generic detect->override->persist primitive (DARK-05)
- `app/hooks/useTheme.ts` - Theme-specific consumer: `THEME_VALUES`, `detectBrowserTheme()`, `applyTheme()`, `useTheme()`
- `app/features/Header/ThemeToggle.tsx` - Native button, aria-label/aria-pressed, CSS-only Sun/Moon dual-icon
- `tests/theme-toggle.spec.ts` - Behavioral Playwright spec: presence/a11y, click-toggle, persistence write, pre-paint apply, manual-override-beats-OS
- `app/app.css` - `@theme` base inverted to light-mode values; new `.dark {}` block; `color-scheme` now class-driven
- `app/root.tsx` - `THEME_STORAGE_KEY`/`themeInitScript` module constants, static blocking `<script>` in `<head>`, `suppressHydrationWarning` on `<html>`
- `app/features/Header/index.tsx` - Imports and renders `<ThemeToggle />` in desktop nav group and mobile-only control row
- `tests/visual.spec.ts` - `beforeEach` now forces `localStorage["theme"] = "dark"` via `addInitScript` to pin Phase 1 baselines as the dark-theme reference
- `tests/visual.spec.ts-snapshots/header-chromium-linux.png` - Regenerated to include the new toggle button (layout-only change, colors verified byte-identical)

## Decisions Made
- Applied D-01's corrected direction (per plan's documented decision): `@theme` base = new light-mode values, `.dark {}` = today's dark values verbatim — not the literal "dark block holds light values" phrasing in the original CONTEXT.md
- `accent-hover` made theme-aware (`purple-700` light / `purple-400` dark) while `accent` itself stays byte-identical (`purple-500`) across themes, per the plan's documented accent-hover AA decision — literal byte-for-byte parity would fail WCAG AA (2.64:1) for accent-hover's real nav-hover-text usage
- `color-scheme` changed from `@media (prefers-color-scheme: dark)`-driven to `.dark`-class-driven so a manual light override beats an OS dark preference (native scrollbars/form controls)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Lint compliance] Prettier formatting on new files**
- **Found during:** Task 3, post-implementation lint check
- **Issue:** `app/features/Header/ThemeToggle.tsx` and `tests/theme-toggle.spec.ts` had minor prettier formatting violations (single-line JSX prop that should wrap, one over-long `.poll()` chain)
- **Fix:** Ran `npx eslint --fix` on both files
- **Files modified:** `app/features/Header/ThemeToggle.tsx`, `tests/theme-toggle.spec.ts`
- **Verification:** `npx eslint` reports 0 errors on all changed files (one pre-existing, unrelated `react-refresh/only-export-components` warning on `root.tsx` confirmed present before this plan's changes too); full test suites re-run and still green after the fix
- **Committed in:** `fcc14c6` (Task 3 commit)

**2. [Rule 1 - Expected visual delta, not a bug] Regenerated header.png visual baseline**
- **Found during:** Task 3, `npx playwright test tests/visual.spec.ts`
- **Issue:** Adding the new `<ThemeToggle />` button to the header necessarily shifts the nav's flex layout (existing links compress slightly to make room), producing a 7%-pixel-ratio diff against the Phase 1 `header.png` baseline — exceeding the 2% `maxDiffPixelRatio` tolerance
- **Fix:** Visually diffed actual vs. expected screenshots first to confirm the delta was purely the new button/layout shift, not a color/token regression (background, text, and purple-accent pixels matched exactly). Ran `npx playwright test tests/visual.spec.ts --update-snapshots`, which regenerated only `header-chromium-linux.png` — the other 6 screenshots (home-full, hero, projects, aboutme, contacts, footer) matched the Phase 1 baselines exactly with zero changes, positively confirming Pitfall 1's token-inversion-direction warning-sign check
- **Files modified:** `tests/visual.spec.ts-snapshots/header-chromium-linux.png`
- **Verification:** `npx playwright test tests/visual.spec.ts` — 7/7 passing after regeneration
- **Committed in:** `fcc14c6` (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 lint compliance, 1 expected visual delta from intentional UI addition)
**Impact on plan:** Both are routine execution-time corrections; no scope creep. The visual baseline update is exactly the outcome DARK-01 requires (a new visible toggle) and was verified color-safe before applying.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 phase requirements (DARK-01 through DARK-05) implemented and verified
- `usePersistedPreference` is ready for Phase 3's `useLanguage()` to reuse unchanged (swap `storageKey`, `validValues`, `detectBrowserDefault`, `applySideEffect`)
- Plan 02 (Wave 2) still needs to run: light-mode visual-regression baseline capture and human sign-off, per this phase's PLAN.md scope split
- Known pre-existing `npm run lint` failure (`no-empty-pattern` in `app/routes/home.tsx`) remains untouched, confirmed out of scope for this phase (logged in Phase 1)

---
*Phase: 02-dark-mode-toggle*
*Completed: 2026-07-07*

## Self-Check: PASSED

All created/modified files confirmed present on disk (app/hooks/usePersistedPreference.ts, app/hooks/useTheme.ts, app/features/Header/ThemeToggle.tsx, tests/theme-toggle.spec.ts, app/app.css, app/root.tsx, app/features/Header/index.tsx). All task commits (c1c1b2b, 335eae6, fcc14c6) and this SUMMARY's commit (53459de) confirmed present in git log.
