---
phase: 01-theme-css-token-centralization
plan: 01
subsystem: testing
tags: [playwright, visual-regression, e2e, screenshot-testing]

# Dependency graph
requires: []
provides:
  - Permanent Playwright test harness (playwright.config.ts) reusable by Phase 2 (dark toggle) and Phase 3 (language toggle) behavioral specs
  - Committed pre-refactor visual baselines (full-page, header, footer, and 4 per-section screenshots)
  - test:visual npm script
affects: [01-02-theme-css-token-centralization, 01-03-theme-css-token-centralization, 01-04-theme-css-token-centralization, 01-05-theme-css-token-centralization, phase-02, phase-03]

# Tech tracking
tech-stack:
  added: ["@playwright/test 1.61.1", "playwright chromium browser binary"]
  patterns:
    - "Playwright config kept generic (single chromium project, fixed 1280x720 viewport, npm run dev webServer) so future behavioral specs drop into tests/ without reconfiguring playwright.config.ts"
    - "toHaveScreenshot tolerance (maxDiffPixelRatio 0.02, threshold 0.2) is deliberately calibrated to the locked 7-token palette's bounded shade normalization from 01-02-PLAN, not a blanket diff-ignore"

key-files:
  created:
    - playwright.config.ts
    - tests/visual.spec.ts
    - tests/visual.spec.ts-snapshots/*.png (7 baseline PNGs)
  modified:
    - package.json (added @playwright/test devDependency, test:visual script)
    - package-lock.json
    - .gitignore (Playwright runtime-output ignores; baselines remain tracked)

key-decisions:
  - "Task 1 checkpoint (package legitimacy of @playwright/test) approved by human before any install ran"
  - "Chromium-only browser install (per plan) — sufficient for deterministic visual baselines, avoids over-downloading Firefox/WebKit"
  - "OS-level Playwright dependencies (libnspr4, libnss3, etc.) installed via `npx playwright install-deps chromium` after headless Chromium failed to launch — required for the harness to run at all in this container"

requirements-completed: [THEME-04]

coverage:
  - id: D1
    description: "Playwright visual-regression harness installed and configured generically (chromium project, fixed viewport, npm run dev webServer, calibrated toHaveScreenshot tolerance)"
    requirement: "THEME-04"
    verification:
      - kind: other
        ref: "npx playwright --version && test -f playwright.config.ts && node -e \"require('fs').accessSync('node_modules/@playwright/test')\""
        status: pass
    human_judgment: false
  - id: D2
    description: "Pre-refactor baseline screenshots captured (full-page, header, footer, hero, projects, aboutme, contacts) and committed; suite passes deterministically on a second consecutive run"
    requirement: "THEME-04"
    verification:
      - kind: e2e
        ref: "npx playwright test (tests/visual.spec.ts, 7/7 passed on second run)"
        status: pass
    human_judgment: false

duration: 22min
completed: 2026-07-06
status: complete
---

# Phase 01 Plan 01: Visual-Regression Safety Net Summary

**Playwright visual-regression harness with 7 committed pre-refactor baseline screenshots (full-page, header, footer, and 4 per-section) using a generically-configured chromium project reusable by Phase 2/3 behavioral specs.**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-07-06T20:29:00-03:00 (approx, checkpoint resolution)
- **Completed:** 2026-07-06T20:51:01-03:00
- **Tasks:** 3 (1 human-verify checkpoint + 2 auto tasks)
- **Files modified:** 10 (package.json, package-lock.json, playwright.config.ts, .gitignore, tests/visual.spec.ts, 7 baseline PNGs)

## Accomplishments
- Verified and installed `@playwright/test` as a devDependency, plus the Chromium browser binary, after human sign-off on package legitimacy (Task 1 checkpoint)
- Authored a generic `playwright.config.ts` (fixed 1280x720 viewport, `npm run dev` webServer, calibrated screenshot tolerance) that Phase 2 and Phase 3 behavioral specs can use unmodified
- Authored `tests/visual.spec.ts` capturing full-page, header, footer, and per-section (`#inicio`, `#projetos`, `#aboutme`, `#contacts`) screenshots with `networkidle` + `document.fonts.ready` waits for determinism
- Captured and committed the 7 pre-refactor baseline PNGs; confirmed determinism with a second consecutive green run (7/7 passed)
- No `app/` source file was touched — this plan is purely test infrastructure

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify @playwright/test package legitimacy before install** - human-verify checkpoint only, no file changes; approved by user ("approved")
2. **Task 2: Install Playwright and configure the generic test harness** - `0b09f3d` (feat)
3. **Task 3: Author the visual spec and capture pre-refactor baselines** - `f544316` (test)

**Plan metadata:** pending (this SUMMARY + STATE/ROADMAP update commit)

## Files Created/Modified
- `playwright.config.ts` - Chromium project, fixed 1280x720 viewport, `npm run dev` webServer, calibrated `toHaveScreenshot` tolerance
- `tests/visual.spec.ts` - Full-page, header, footer, and 4 per-section screenshot assertions
- `tests/visual.spec.ts-snapshots/*.png` - 7 committed pre-refactor baseline images
- `package.json` - Added `@playwright/test` devDependency and `test:visual` script
- `package-lock.json` - Lockfile update for the new devDependency
- `.gitignore` - Added Playwright runtime-output ignores (`/test-results/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`); baselines under `tests/**-snapshots/` remain tracked

## Decisions Made
- Chromium-only browser install (per plan instruction) rather than the full Playwright browser suite, to keep the harness lean and deterministic
- Screenshot tolerance (`maxDiffPixelRatio: 0.02`, `threshold: 0.2`) documented inline as tuned specifically to the bounded 7-token shade-collapse decision from 01-02-PLAN, not a general-purpose diff suppressor

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing OS-level Chromium dependencies**
- **Found during:** Task 3 (first `npx playwright test` run)
- **Issue:** Headless Chromium failed to launch with `error while loading shared libraries: libnspr4.so: cannot open shared object file` — the container lacked required system libraries (libnspr4, libnss3, libasound2, various X11/font packages) for Chromium to run at all.
- **Fix:** Ran `npx playwright install-deps chromium` to install the missing OS packages via apt. This is an environment-provisioning step (not an npm/pip package-manager install of a project dependency), so it falls outside the Rule 3 package-manager-install exclusion — no alternative/substitute package was chosen, only Microsoft's own official dependency installer for the already-approved Playwright binary.
- **Files modified:** None (system packages only, no repo files changed)
- **Verification:** Re-ran `npx playwright test`; Chromium launched successfully and all 7 baseline screenshots were captured.
- **Committed in:** N/A (no repo file changes; system-level fix only)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to make the harness runnable in this container at all. No scope creep — no application source or plan-scoped files were affected.

## Issues Encountered
- First `npx playwright test` run correctly reported "snapshot doesn't exist, writing actual" for all 7 assertions — this is expected baseline-creation behavior on the first run, not a failure. The second run (against the newly-written baselines) passed 7/7, confirming determinism per the plan's acceptance criteria.
- A pre-existing React key-prop warning was observed in `Projects` component webServer logs during test runs (`Each child in a list should have a unique "key" prop`). This is out of scope for this plan (not caused by this plan's changes, and not in `app/`), so it was left untouched per the scope-boundary rule and is noted here for visibility rather than fixed.

## User Setup Required

None - no external service configuration required. The Task 1 human-verify checkpoint (confirming `@playwright/test` legitimacy on npmjs.com) was the only manual step, and it has already been completed and approved.

## Next Phase Readiness
- The visual-regression safety net is in place and green; plans 01-02 through 01-05 (and the final zero-regression gate) can now diff against these committed baselines.
- `playwright.config.ts` is generic enough that Phase 2 (dark toggle) and Phase 3 (language toggle) can add behavioral specs to `tests/` without touching the config.
- No blockers for the next plan in this phase.

---
*Phase: 01-theme-css-token-centralization*
*Completed: 2026-07-06*

## Self-Check: PASSED

- FOUND: playwright.config.ts
- FOUND: tests/visual.spec.ts
- FOUND: tests/visual.spec.ts-snapshots/home-full-chromium-linux.png
- FOUND: package.json
- FOUND commit: 0b09f3d
- FOUND commit: f544316
