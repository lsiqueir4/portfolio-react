---
phase: 01-theme-css-token-centralization
plan: 03
subsystem: ui
tags: [tailwind, css-tokens, react, theming, button-dedup]

# Dependency graph
requires:
  - phase: 01-theme-css-token-centralization (Plan 02)
    provides: 7 locked semantic color tokens in app/app.css @theme, shared app/shared/Button.tsx
provides:
  - Header, Hero, Footer, TechBadge fully migrated to semantic color tokens (no purple-/zinc-/gray- literals remain)
  - Header and Hero consuming the shared Button component; local ActionButton (Header) and Button (Hero) removed
affects: [01-04, 01-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared Button className passthrough used to reproduce exact per-call-site geometry (rounded-xl vs rounded-lg, px/py, font-weight)"
    - "Padding compensated in arbitrary-value Tailwind classes (px-[15px] py-[9px]) to offset the shared Button's built-in 1px border and preserve identical box dimensions vs. a border-less baseline"

key-files:
  created: []
  modified:
    - app/features/Header/index.tsx
    - app/features/Header/types.tsx
    - app/features/Hero/index.tsx
    - app/features/Footer/index.tsx
    - app/shared/TechBadge.tsx
  deleted:
    - app/features/Hero/types.tsx

key-decisions:
  - "Header's CV download buttons use px-[15px] py-[9px] (instead of the original px-4 py-2.5) to compensate for the shared Button's primary variant always including a 1px border, which the original border-less ActionButton did not have — keeps the rendered box the exact same size as baseline"
  - "Hero's CTA buttons needed no padding compensation: its original local Button already included a border on both primary and secondary variants, matching the shared Button's variant classes exactly"
  - "Hero/types.tsx deleted entirely (not just trimmed) since ButtonProps was its only export and it became empty after removing the local Button"

requirements-completed: [THEME-01, THEME-03, THEME-04]

coverage:
  - id: D1
    description: "Header and Hero render all colors via semantic tokens and consume the shared Button; local ActionButton/Button implementations removed"
    requirement: "THEME-01, THEME-03"
    verification:
      - kind: other
        ref: "grep -Eq '(purple|zinc|gray)-[0-9]' app/features/Header/index.tsx app/features/Header/types.tsx app/features/Hero/index.tsx — zero matches"
        status: pass
      - kind: other
        ref: "grep 'function Button\\|function ActionButton' app/features/Header/index.tsx app/features/Hero/index.tsx — no local button components remain"
        status: pass
      - kind: other
        ref: "npm run typecheck && npm run lint — pass (pre-existing unrelated lint issues in app/root.tsx / app/routes/home.tsx untouched, out of scope)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Footer and TechBadge render all colors via semantic tokens"
    requirement: "THEME-01"
    verification:
      - kind: other
        ref: "grep -Eq '(purple|zinc|gray)-[0-9]' app/features/Footer/index.tsx app/shared/TechBadge.tsx — zero matches"
        status: pass
    human_judgment: false
  - id: D3
    description: "No hardcoded purple/zinc/gray utility class remains in any of these files, and each section is visually identical to its Plan 01 baseline"
    requirement: "THEME-04"
    verification:
      - kind: e2e
        ref: "npx playwright test tests/visual.spec.ts — all 7 pre-refactor baselines pass (full page, header, hero, projects, aboutme, contacts, footer)"
        status: pass
      - kind: other
        ref: "npm run build — Tailwind compiles token utilities cleanly, SSR + client bundles build without error"
        status: pass
    human_judgment: false

duration: ~10min
completed: 2026-07-06
status: complete
---

# Phase 01 Plan 03: Header/Hero/Footer/TechBadge Token & Button Migration Summary

**Migrated Header, Hero, Footer, and TechBadge to the locked semantic token system and replaced Header's/Hero's local button implementations with the shared `Button` component — zero rendered visual change, confirmed by the full Playwright visual-regression suite.**

## Performance

- **Duration:** ~10 min
- **Tasks:** 3
- **Files modified:** 4 modified (`Header/index.tsx`, `Footer/index.tsx`, `TechBadge.tsx`, `Header/types.tsx`), 1 modified+trimmed (`Hero/index.tsx`), 1 deleted (`Hero/types.tsx`)

## Accomplishments

- Migrated every color class in `Header/index.tsx` (nav links, logo, contact link, mobile menu button/panel/links) from `purple-*`/`zinc-*`/`white` literals to the semantic tokens (`bg-surface`, `text-muted`, `hover:text-accent-hover`, `border-border-subtle/10`, `bg-surface-elevated/80`, etc.)
- Removed Header's local `ActionButton` entirely; both the desktop and mobile "Baixar CV" buttons now render via the shared `~/shared/Button` with `variant="primary"`, `external`, and `icon={<Download size={18} />}`
- Removed `ActionButtonProps` from `Header/types.tsx`, keeping `HeaderButtonProps`
- Migrated every color class in `Hero/index.tsx` (blur blobs, profile glow/border/shadow, availability badge, headings, body copy) to semantic tokens
- Removed Hero's local `Button` entirely; both CTA buttons ("Baixar CV" primary, "Entre em contato" secondary) now render via the shared `~/shared/Button`
- Deleted `Hero/types.tsx` (its only export, `ButtonProps`, is now owned by `Button.tsx`)
- Migrated `Footer/index.tsx` (borders, background, copyright text color) and `TechBadge.tsx` (border/background/hover states, icon and label text color) to semantic tokens — leaf swaps only, no structural change, per D-03
- Confirmed via grep across all four files/dirs that zero `purple-`/`zinc-`/`gray-` literal color classes remain
- Confirmed via the full 7-test Playwright visual-regression suite that every affected section (header, hero/#inicio, footer, full page) — plus all untouched sections — renders pixel-identical (within calibrated tolerance) to the Plan 01 baseline

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Header to tokens and consume shared Button** - `71f2563` (feat)
2. **Task 2: Migrate Hero to tokens and consume shared Button** - `2d7f986` (feat)
3. **Task 3: Migrate Footer and TechBadge to tokens** - `79ff456` (feat)

_No TDD tasks in this plan (tdd="false" on all three tasks — presentational className/component-swap refactor, not new behavior)._

## Files Created/Modified

- `app/features/Header/index.tsx` - Token migration; local `ActionButton` removed, both CV buttons now use shared `Button`
- `app/features/Header/types.tsx` - `ActionButtonProps` removed, `HeaderButtonProps` retained
- `app/features/Hero/index.tsx` - Token migration; local `Button` removed, both CTAs now use shared `Button`
- `app/features/Hero/types.tsx` - Deleted (only export, `ButtonProps`, now lives in `Button.tsx`)
- `app/features/Footer/index.tsx` - Token migration (borders, background, copyright text)
- `app/shared/TechBadge.tsx` - Token migration (border/background/hover, icon/label text)

## Decisions Made

- Header's CV download buttons required padding compensation (`px-[15px] py-[9px]` instead of `px-4 py-2.5`) because the shared `Button`'s `primary` variant always includes `border border-accent` (1px), which the original border-less `ActionButton` did not have. Since button height/width are auto-sized (no explicit dimensions), the added border would otherwise grow the box by 2px in each axis — this was caught by the Playwright full-page-height diff (1280×4382 baseline vs. 1280×4384 rendered) and fixed by shrinking padding by exactly the border width, restoring an identical outer box size while keeping the (same-color, invisible) border.
- Hero's CTA buttons needed no such compensation: the original local `Button`'s primary and secondary variants both already rendered with a border (`border border-purple-500`), so swapping to the shared `Button`'s equivalent variants (`border border-accent`) is a like-for-like class mapping with no box-size change.
- `Hero/types.tsx` was deleted outright (plan allowed either trimming or deletion) since removing `ButtonProps` left the file with no remaining exports.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Header CV button box grew 2px per axis after adopting shared Button's bordered primary variant**
- **Found during:** Task 1, Playwright verification (`full page` and `header landmark` snapshots failed: `Expected an image 1280px by 4382px, received 1280px by 4384px`)
- **Issue:** The shared `Button.tsx`'s `primary` variant unconditionally includes `border border-accent`. Header's original `ActionButton` had no border. With auto height/width (no explicit dimensions set), adding a 1px border on each side grows the rendered box by 2px per axis, shifting all subsequent layout and failing the pixel-diff assertion.
- **Fix:** Changed the CV button's `className` padding from `px-4 py-2.5` to the arbitrary-value equivalents `px-[15px] py-[9px]` (each 1px smaller per side), exactly offsetting the added border width so the final rendered box matches the Plan 01 baseline pixel-for-pixel. Applied to both the desktop and mobile CV buttons.
- **Files modified:** `app/features/Header/index.tsx`
- **Commit:** `71f2563`

## Issues Encountered

None beyond the auto-fixed issue above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Header, Hero, Footer, and TechBadge are fully tokenized and Button-consolidated; no `purple-`/`zinc-`/`gray-` literals remain in any of the four files
- Plan 04 (AboutMe/Projects/Contacts) can proceed independently — it touches a disjoint set of files and consumes the same `Section`/`Button` shared components from Plan 02
- Full Playwright visual-regression suite (7/7 tests) passes, confirming zero cumulative visual drift from Plans 02 + 03 combined
- `npm run build` succeeds (client + SSR bundles), confirming the migration introduces no build-time regressions

---
*Phase: 01-theme-css-token-centralization*
*Completed: 2026-07-06*

## Self-Check: PASSED

All modified/deleted files confirmed against disk state; all 3 task commits (`71f2563`, `2d7f986`, `79ff456`) confirmed in git history via `git log --oneline`.
