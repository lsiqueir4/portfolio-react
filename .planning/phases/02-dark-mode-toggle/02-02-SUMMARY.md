---
phase: 02-dark-mode-toggle
plan: 02
subsystem: testing
tags: [dark-mode, playwright, visual-regression, accessibility, human-verification]

# Dependency graph
requires:
  - phase: 02-dark-mode-toggle (Plan 01)
    provides: ThemeToggle component, useTheme()/usePersistedPreference hooks, SSR-safe blocking init script, dark-theme visual baselines (tests/visual.spec.ts)
provides:
  - Light-mode visual-regression baseline (tests/theme-light.spec.ts, 7 screenshots) mirroring the dark baseline for the same seven targets
  - Human sign-off confirming DARK-01..04 in a running browser: toggle behavior, no-flash persistence, manual-override-beats-OS, accent parity, content/layout preservation
affects: [03-language-toggle]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-theme Playwright spec pattern: force theme deterministically via page.addInitScript setting localStorage before goto, use suffixed screenshot names (-light) to avoid collision with the other theme's baseline"

key-files:
  created:
    - tests/theme-light.spec.ts
    - tests/theme-light.spec.ts-snapshots/aboutme-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/contacts-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/footer-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/header-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/hero-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/home-full-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/projects-light-chromium-linux.png
  modified: []

key-decisions:
  - "Light spec forces localStorage.theme=light in an addInitScript (mirroring the dark spec's own forcing pattern) so the baseline is deterministic regardless of the test runner's OS/emulated color-scheme"
  - "Screenshot names suffixed -light to keep the two theme baselines coexisting in the repo without collision"

patterns-established:
  - "Two independent Playwright visual specs (dark: tests/visual.spec.ts, light: tests/theme-light.spec.ts) each force their theme explicitly, giving both themes an equally strong regression net going forward"

requirements-completed: [DARK-02, DARK-04]

coverage:
  - id: D1
    description: "Light-mode visual-regression baseline exists for the same seven targets as the dark baseline (full page, header, hero, projects, about me, contacts, footer)"
    requirement: "DARK-02"
    verification:
      - kind: e2e
        ref: "tests/theme-light.spec.ts (7/7 passing against committed baselines)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Human confirmed in a running browser: desktop + mobile toggle switches the whole site light<->dark; purple accent renders as the same purple in both themes; keyboard operable; persists across reload with no flash of wrong theme in either direction; manual localStorage override beats OS prefers-color-scheme; no content/link/image/layout changes in either theme"
    requirement: "DARK-04"
    verification: []
    human_judgment: true
    rationale: "Visual flash-of-wrong-theme timing, subjective color-parity perception, and content-preservation across a full live site are not fully certifiable by pixel-diff screenshots alone; the plan explicitly calls for a human checkpoint for this reason"

duration: 6min
completed: 2026-07-07
status: complete
---

# Phase 2 Plan 02: Light-Mode Baseline + Human Sign-off Summary

**Light-theme Playwright visual-regression baseline (7 screenshots) plus human-verified sign-off on toggle behavior, no-flash persistence, accent parity, and content preservation across both themes**

## Performance

- **Duration:** 6 min
- **Tasks:** 2
- **Files modified:** 8 (1 spec file + 7 baseline screenshots)

## Accomplishments
- `tests/theme-light.spec.ts` forces the light theme deterministically (localStorage override via `addInitScript`, independent of OS/emulated color-scheme) and screenshots the same seven targets as the Phase 2 Plan 01 dark baseline: full page, header, hero (`#inicio`), projects (`#projetos`), about me (`#aboutme`), contacts (`#contacts`), footer
- Both themes now have an equally strong visual-regression net (dark: `tests/visual.spec.ts`, light: `tests/theme-light.spec.ts`)
- Human sign-off obtained covering everything automated screenshots cannot certify: live toggle behavior (desktop + mobile), keyboard operability, no-flash reload persistence in both directions, manual override beating OS preference, and confirmation that no text/link/image/layout changed in either theme

## Task Commits

Each task was committed atomically:

1. **Task 1: Add light-mode visual-regression baselines** - `81a2d70` (test)
2. **Task 2: Human sign-off — toggle, no-flash, accent parity, content preservation** - checkpoint, no code commit (verification-only task)

**Plan metadata:** this commit (docs: complete plan)

## Files Created/Modified
- `tests/theme-light.spec.ts` - Playwright visual spec forcing the light theme and capturing the same 7 targets as the dark baseline
- `tests/theme-light.spec.ts-snapshots/*.png` (7 files) - Committed light-theme baseline screenshots

## Decisions Made
- Forced light theme via `page.addInitScript` setting `localStorage.theme = "light"` before `goto`, matching the determinism approach already established by the dark spec in Plan 01
- Used `-light` screenshot name suffixes to keep both theme baselines in the repo without filename collision

## Deviations from Plan
None - plan executed exactly as written. Task 1's baselines were re-verified passing (7/7) at the start of this continuation before finalizing.

## Issues Encountered
None. This was a continuation of a prior executor run that completed Task 1 and paused at Task 2's `checkpoint:human-verify` gate; this run verified the Task 1 commit, recorded the human's "approved" response, and closed out the plan.

## Human Sign-off Record

**Checkpoint:** Task 2 — toggle, no-flash, accent parity, content preservation
**Resume signal received:** "approved"

The user manually verified in a browser at `http://localhost:5173`:
- Desktop toggle switches the whole site light<->dark; purple accent (logo, primary CV button fill, nav hover underline) stays the same purple in both themes — only backgrounds/text invert
- Toggle is keyboard operable (Tab + Enter/Space), native `<button>` with `aria-label`/`aria-pressed`
- Persistence across reload with no flash of wrong theme in either direction (light->reload->light, dark->reload->dark)
- Manual `localStorage.theme` override beats OS `prefers-color-scheme` (set to light with OS in dark mode, reload stays light)
- Mobile toggle visible and functional without opening the hamburger menu
- No content, link, image, or section-layout changes in either theme — only colors

DARK-01 through DARK-05 are now fully implemented and verified (automated in Plan 01, closed out by this human sign-off in Plan 02).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 2 (dark-mode-toggle) complete: both plans executed, both themes have visual-regression coverage, human sign-off obtained
- `usePersistedPreference` primitive (from Plan 01) remains ready for Phase 3's language toggle to reuse unchanged
- No blockers carried forward from this plan

---
*Phase: 02-dark-mode-toggle*
*Completed: 2026-07-07*

## Self-Check: PASSED

All listed files confirmed present on disk (tests/theme-light.spec.ts and 7 snapshot PNGs under tests/theme-light.spec.ts-snapshots/). Task 1 commit (81a2d70) confirmed present in git log. Task 2 is a human-verification checkpoint with no code artifact; its approval is recorded above per the continuation context.
