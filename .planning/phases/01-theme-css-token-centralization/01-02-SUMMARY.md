---
phase: 01-theme-css-token-centralization
plan: 02
subsystem: ui
tags: [tailwind, css-tokens, dark-mode, react, theming]

# Dependency graph
requires:
  - phase: 01-theme-css-token-centralization (Plan 01)
    provides: Playwright visual-regression harness with pre-refactor baselines
provides:
  - 7 locked semantic color tokens (surface, surface-elevated, on-surface, muted, accent, accent-hover, border-subtle) in app/app.css @theme
  - @custom-variant dark (&:where(.dark, .dark *)) directive wired for Tailwind v4 manual dark-mode toggling
  - Shared app/shared/Button.tsx (variant lookup object: primary/secondary, icon, external, className passthrough)
  - Shared app/shared/Section.tsx (divider + optional eyebrow/title/subtitle + children, align left/center)
affects: [01-03, 01-04, 02-dark-mode-toggle]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 CSS-first @theme token definitions (no tailwind.config.js)"
    - "@custom-variant dark directive for class-based dark mode toggling"
    - "Variant lookup object of complete literal Tailwind class strings (avoids Pitfall 6 dynamic class interpolation)"
    - "Shared component className passthrough for per-call-site geometry overrides"

key-files:
  created: [app/shared/Button.tsx, app/shared/Section.tsx]
  modified: [app/app.css]

key-decisions:
  - "Token values chosen to minimize visual delta (--color-surface: var(--color-zinc-950), not gray-950) per plan's explicit discretion note (D-01 locks token names/set, not values)"
  - "Font-weight and other per-site geometry (rounded-xl vs rounded-lg, px-4 py-2.5 vs px-5 py-3, font-semibold vs font-bold) deliberately left out of Button.tsx's shared base/variant classes, to be supplied via className passthrough in Plan 03 so each of the three existing CTA buttons can be reproduced class-for-class"
  - "Section.tsx title/subtitle classes default to AboutMe's exact styling (font-extrabold, mb-6); Projects' different styling (font-bold, mb-4) will override via titleClassName/subtitleClassName in Plan 03"
  - "Used array.filter(Boolean).join(' ') instead of template-literal string interpolation to combine base/variant/className strings in both new components, to unambiguously avoid any dynamic-class-name pitfall pattern"

patterns-established:
  - "Semantic token layer: all future color usage should reference --color-* @theme tokens, not raw Tailwind palette classes (purple-*/zinc-*/gray-*)"
  - "Shared UI primitives live in app/shared/ as default-export pure components mirroring TechBadge.tsx's conventions (inline type alias, no barrel, ~/shared import path)"

requirements-completed: [THEME-01, THEME-02, THEME-03, THEME-04]

coverage:
  - id: D1
    description: "7 locked semantic color tokens defined in app/app.css @theme, compiling into working Tailwind utilities (bg-surface, text-on-surface, text-muted, bg-accent, etc.)"
    requirement: "THEME-01"
    verification:
      - kind: other
        ref: "npm run build (Tailwind compiles token utilities into build/client/assets/root-*.css)"
        status: pass
      - kind: e2e
        ref: "playwright:tests/visual.spec.ts (7 tests, pre-refactor baselines) — pass"
        status: pass
    human_judgment: false
  - id: D2
    description: "@custom-variant dark (&:where(.dark, .dark *)) directive wired; dark: utilities generate CSS (mechanism only, no .dark override values this phase per CONTEXT.md SC2 nuance)"
    requirement: "THEME-02"
    verification:
      - kind: other
        ref: "grep '.dark' build/client/assets/root-*.css (selector present in compiled CSS)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Shared Section.tsx and Button.tsx created as pure-render de-duplication primitives, ready for Plan 03/04 feature-file consumption"
    requirement: "THEME-03"
    verification:
      - kind: other
        ref: "npm run typecheck && npm run lint (scoped to new files) — pass"
        status: pass
      - kind: other
        ref: "grep checks: variant lookup present, no ${...} template-literal class interpolation, no literal purple/zinc/gray-NNN in Section.tsx"
        status: pass
    human_judgment: false
  - id: D4
    description: "Zero visual change to the live site from this plan's changes (html/body render at identical token-resolved values; no feature files touched yet)"
    requirement: "THEME-04"
    verification:
      - kind: e2e
        ref: "playwright:tests/visual.spec.ts — 7 passed, 9.5s (pre-refactor baselines still match)"
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-07-06
status: complete
---

# Phase 01 Plan 02: Token Foundation & Shared Primitives Summary

**7 locked semantic color tokens + Tailwind v4 `@custom-variant dark` mechanism in app.css, plus shared Button/Section components consolidating three CTA button instances and three repeated title-block/divider patterns — zero rendered visual change.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-06T23:57:00Z (approx, per session start)
- **Completed:** 2026-07-06T23:59:59Z
- **Tasks:** 3
- **Files modified:** 1 modified (`app/app.css`), 2 created (`app/shared/Button.tsx`, `app/shared/Section.tsx`)

## Accomplishments
- Defined the 7 locked semantic color tokens (`surface`, `surface-elevated`, `on-surface`, `muted`, `accent`, `accent-hover`, `border-subtle`) inside `app/app.css`'s `@theme` block, with values chosen to minimize visual delta from current usage
- Wired `@custom-variant dark (&:where(.dark, .dark *));` — the Tailwind v4-native mechanism for a future class-based dark-mode toggle (Phase 2), with no `.dark {}` override block added yet (correctly deferred)
- Switched `html, body` to use `bg-surface text-on-surface font-sans` token utilities instead of `bg-gray-950`/`text-white` literals
- Created `app/shared/Button.tsx`: a default-export component with a variant lookup object (`primary`/`secondary`) of complete literal token-class strings, `icon`/`external`/`className` props, ready to replace Header's `ActionButton` and Hero's primary/secondary `Button` in Plan 03
- Created `app/shared/Section.tsx`: de-duplicates the byte-identical gradient divider used in AboutMe/Projects/Contacts, plus optional eyebrow/title/subtitle rendering with per-instance className overrides, verified to render correctly with only `align` supplied (Contacts' divider-only use case)

## Task Commits

Each task was committed atomically:

1. **Task 1: Define the 7 semantic tokens and wire the dark variant in app.css** - `e0ed5ab` (feat)
2. **Task 2: Create shared Button.tsx consolidating the Header/Hero CTA styles** - `e4b584d` (feat)
3. **Task 3: Create shared Section.tsx for the repeated title-block/divider** - `bbc39f8` (feat)

_No TDD tasks in this plan (tdd="false" on Tasks 2/3; Task 1 is a CSS-only config change)._

## Files Created/Modified
- `app/app.css` - Added `@custom-variant dark` directive and 7 `--color-*` tokens inside `@theme`; `html, body` now uses `bg-surface text-on-surface font-sans`
- `app/shared/Button.tsx` (new) - Shared CTA button: variant lookup object, icon/external/className props
- `app/shared/Section.tsx` (new) - Shared title-block/divider: align, eyebrow, title, subtitle, className overrides, children

## Decisions Made
- Token values normalize to the dominant existing usage (`zinc-950` over `gray-950`, single `zinc-400` for the three muted greys, single `purple-500`/`purple-400` for accent/accent-hover) — matches the plan's explicit discretion note; residual sub-perceptual diffs are absorbed by the Playwright tolerance from Plan 01
- Button.tsx's shared base intentionally excludes font-weight/border-radius/padding (these differ per call site — Header vs Hero); Plan 03 will supply them via the `className` passthrough so each of the three existing buttons renders class-for-class identically
- Section.tsx's title/subtitle default classes match AboutMe's exact styling; Projects' differing styling will be supplied via `titleClassName`/`subtitleClassName` overrides in Plan 03
- Both new components use `[..strings].filter(Boolean).join(" ")` rather than template-literal interpolation to combine class strings, keeping the code unambiguously free of the Pitfall 6 dynamic-class-name pattern (verified by grep in Task 2's automated verification)

## Deviations from Plan

None - plan executed exactly as written. Two trivial Prettier formatting fixes (line-wrapping long strings in `Button.tsx` and `Section.tsx`) were applied via `eslint --fix` scoped to each new file as part of normal lint-pass verification within each task — not tracked as a Rule 1-4 deviation since this is routine formatting compliance with the project's existing Prettier config, not a bug fix or added functionality.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `app/app.css` now exposes token utilities (`bg-surface`, `text-on-surface`, `text-muted`, `bg-accent`/`text-accent`/`border-accent`, `bg-accent-hover`/`text-accent-hover`, `border-border-subtle`) plus the `dark:` variant mechanism, ready for Plans 03/04 to migrate feature files' literal color classes
- `Section` and `Button` are ready for import via `~/shared/Section` and `~/shared/Button` into `AboutMe`, `Projects`, `Contacts` (Section) and `Header`, `Hero` (Button)
- Plan 03 must pass exact per-call-site geometry via `className`/`titleClassName`/`subtitleClassName` to guarantee zero visual diff when replacing the three local button implementations and three local title blocks
- Full Playwright visual-regression suite (7 tests) confirms zero visual change introduced by this plan alone

---
*Phase: 01-theme-css-token-centralization*
*Completed: 2026-07-06*

## Self-Check: PASSED

All created/modified files confirmed present on disk; all 3 task commits (`e0ed5ab`, `e4b584d`, `bbc39f8`) confirmed in git history.
