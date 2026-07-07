---
phase: 03-language-toggle-i18n
plan: 01
subsystem: i18n
tags: [react-i18next, i18next, react, typescript, header, ssr]

# Dependency graph
requires:
  - phase: 02-dark-mode-toggle
    provides: usePersistedPreference (generic useSyncExternalStore-backed preference hook), THEME_STORAGE_KEY single-shared-constant pattern, root.tsx blocking-script convention
provides:
  - i18next + react-i18next runtime dependency, synchronously initialized (SSR-safe, fixed default lng "pt")
  - LANGUAGE_STORAGE_KEY shared constant, useLanguage() hook (mirrors useTheme), detectBrowserLanguage() with D-05 non-pt/en -> EN fallback
  - LanguageToggle two-label (PT|EN) Header component
  - languageInitScript pre-hydration document.documentElement.lang setter in root.tsx
  - app/i18n/locales/{pt,en}.ts translation catalogs (header + common sections) — reused verbatim by Plans 02-03
  - Header fully wired to t()/useTranslation(), first end-to-end i18n slice working
affects: [03-02, 03-03]

# Tech tracking
tech-stack:
  added: [i18next@26, react-i18next@17]
  patterns:
    - "usePersistedPreference reused verbatim for a second preference (language) — no modification to the generic hook"
    - "Single-source storage-key constant (LANGUAGE_STORAGE_KEY) imported by both root.tsx blocking script and useLanguage.ts"
    - "SSR fixed-default pattern: server/client both render lng='pt' on first paint; useLanguage's mount effect performs the post-hydration browser-detected/persisted sync (accepted one-time flash, D-02)"
    - "Locale catalogs typed structurally: en.ts declared as `typeof pt` so the two files can never drift out of key-sync"

key-files:
  created:
    - app/constants/language.ts
    - app/i18n/config.ts
    - app/i18n/locales/pt.ts
    - app/i18n/locales/en.ts
    - app/hooks/useLanguage.ts
    - app/features/Header/LanguageToggle.tsx
    - tests/language-toggle.spec.ts
  modified:
    - app/root.tsx
    - app/features/Header/index.tsx
    - package.json
    - package-lock.json
    - tests/visual.spec.ts-snapshots/header-chromium-linux.png
    - tests/visual.spec.ts-snapshots/home-full-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/header-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/home-full-light-chromium-linux.png

key-decisions:
  - "app/i18n/locales/{pt,en}.ts created in Task 3 (not Task 4 as originally planned) because app/i18n/config.ts's synchronous resources import requires both catalogs to exist at compile time"
  - "LanguageToggle uses role='group' aria-label='Selecionar idioma' wrapping two role=button elements with aria-label 'Português'/'English' — the concrete accessible-name shape chosen to satisfy I18N-02 (not specified precisely by the plan)"
  - "Phase 1/2 visual-regression baselines (home-full, header; light + dark variants) updated: LanguageToggle adds ~2px to header height, an expected/required consequence of this plan's Header UI addition, not a regression"

patterns-established:
  - "New Header controls are inserted adjacent to ThemeToggle in both the desktop (hidden md:flex) and mobile (flex items-center gap-2 md:hidden) blocks"
  - "Locale catalog structure: single default 'translation' namespace, section-keyed (header, common, ...) — later plans (02-03) extend these same two files with hero/about/projects/contacts/footer sections rather than creating new namespace files"

requirements-completed: [I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06]

coverage:
  - id: D1
    description: "i18next + react-i18next installed and synchronously initialized with fixed default lng 'pt', fallbackLng 'en' (SSR-safe, no hydration mismatch)"
    requirement: "I18N-01"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
    human_judgment: false
  - id: D2
    description: "PT|EN two-label switcher visible in Header (desktop + mobile), each label with an accessible name, placed next to ThemeToggle"
    requirement: "I18N-02"
    verification:
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#switcher presence and accessibility"
        status: pass
    human_judgment: false
  - id: D3
    description: "First-visit language follows navigator.language (pt*->PT, en*->EN, other->EN per D-05)"
    requirement: "I18N-03"
    verification:
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#navigator.language default: en-US resolves to EN"
        status: pass
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#navigator.language default: pt-BR resolves to PT"
        status: pass
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#navigator.language default: non-pt/en (fr-FR) resolves to EN (D-05)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Manual language choice persists via localStorage (reusing usePersistedPreference), overriding the browser default"
    requirement: "I18N-04"
    verification:
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#persistence write: clicking updates localStorage"
        status: pass
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#persisted language applies on load"
        status: pass
    human_judgment: false
  - id: D5
    description: "document.documentElement.lang updates when the language changes (click) and is set pre-hydration by languageInitScript"
    requirement: "I18N-05"
    verification:
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#click switches html lang and header nav string"
        status: pass
    human_judgment: false
  - id: D6
    description: "Header nav strings (home/projects/about/contact/openMenu/downloadCV) translated 1:1 through t() — Header slice of I18N-06"
    requirement: "I18N-06"
    verification:
      - kind: e2e
        ref: "tests/language-toggle.spec.ts#click switches html lang and header nav string"
        status: pass
      - kind: other
        ref: "npm run lint (no new errors in files this plan touches)"
        status: pass
    human_judgment: false

duration: 33min
completed: 2026-07-07
status: complete
---

# Phase 3 Plan 01: Language Toggle Foundation Summary

**Client-side react-i18next foundation with a working PT|EN Header switcher: SSR-safe fixed-default init, `useLanguage` mirroring `useTheme`, and the Header's nav strings translated end-to-end.**

## Performance

- **Duration:** 33 min
- **Started:** 2026-07-07T17:21:46Z
- **Completed:** 2026-07-07T17:54:59Z
- **Tasks:** 4 (1 RED spec, 1 checkpoint, 2 implementation)
- **Files modified:** 13 (7 created, 6 modified, including 4 visual-baseline PNGs)

## Accomplishments

- Installed `i18next` + `react-i18next` after human-approved package-legitimacy checkpoint (T-03-SC)
- Built the reusable i18n machinery mirroring Phase 2's `useTheme`: `LANGUAGE_STORAGE_KEY` constant, `useLanguage()` built on `usePersistedPreference` (not reimplemented), `detectBrowserLanguage()` with D-05 non-pt/en → EN fallback
- Synchronous `i18next` init (`app/i18n/config.ts`) with fixed default `lng: "pt"` on both server and client — no hydration mismatch (D-02)
- `languageInitScript` in `app/root.tsx` sets `document.documentElement.lang` pre-hydration, byte-for-byte parity with `detectBrowserLanguage()` (mitigates T-03-01)
- Two-label `PT | EN` `LanguageToggle` component (D-03/D-04), placed adjacent to `ThemeToggle` in both Header desktop and mobile blocks
- Header fully wired to `useTranslation()`/`t()` — every nav string (home, projects, about, contact, openMenu, downloadCV) resolves through the new `pt`/`en` catalogs
- `tests/language-toggle.spec.ts`: RED → GREEN across the full task sequence (7/7 passing): switcher a11y, click-to-switch, persistence write, persisted-on-load, and all three navigator.language default cases

## Task Commits

Each task was committed atomically:

1. **Task 1: Failing behavioral spec for the language toggle** - `62140c4` (test)
2. **Task 2: Package-legitimacy gate for i18next + react-i18next** - checkpoint, no commit (human-verify, approved)
3. **Task 3: Install i18next and build the reusable language machinery** - `8551764` (feat)
4. **Task 4: Wire the switcher + Header translation to make the spec pass** - `2a4f5b6` (feat)

**Plan metadata:** commit skipped — `commit_docs: false` in `.planning/config.json`

## Files Created/Modified

- `app/constants/language.ts` - single-source `LANGUAGE_STORAGE_KEY = "language"` constant
- `app/i18n/config.ts` - synchronous i18next init, fixed default `lng: "pt"`, `fallbackLng: "en"`
- `app/i18n/locales/pt.ts` / `app/i18n/locales/en.ts` - `header` + `common` translation sections, structurally locked (`en` typed as `typeof pt`)
- `app/hooks/useLanguage.ts` - `useLanguage()` hook mirroring `useTheme`, mount-effect sync to i18next
- `app/features/Header/LanguageToggle.tsx` - two-label PT|EN switcher component
- `app/root.tsx` - `LANGUAGE_STORAGE_KEY`/`./i18n/config` imports, `languageInitScript`, `<html lang="pt">` fixed default
- `app/features/Header/index.tsx` - `useTranslation()`/`t()` wiring, `<LanguageToggle />` insertion (desktop + mobile)
- `tests/language-toggle.spec.ts` - new behavioral spec (I18N-02/03/04/05, Header slice of I18N-06)
- `package.json` / `package-lock.json` - `i18next`, `react-i18next` dependencies
- `tests/visual.spec.ts-snapshots/{header,home-full}-chromium-linux.png`, `tests/theme-light.spec.ts-snapshots/{header-light,home-full-light}-chromium-linux.png` - updated baselines (header +~2px height from LanguageToggle)

## Decisions Made

- Locale catalogs (`app/i18n/locales/pt.ts`/`en.ts`) created during Task 3 instead of Task 4, because `app/i18n/config.ts`'s synchronous `resources` object requires both catalogs to exist for the module to compile/typecheck — Task 4 then only needed to wire `Header/index.tsx` to the already-existing catalogs.
- `LanguageToggle`'s concrete accessible-name shape (`role="group"` + `aria-label="Selecionar idioma"` wrapping two `aria-label`'d buttons "Português"/"English") was chosen to satisfy I18N-02's "accessible name" requirement — the plan specified the requirement but not the exact ARIA structure.
- Updated four pre-existing visual-regression baselines (Phase 1/2's `home-full`/`header` screenshots, dark and light variants) because `LanguageToggle` legitimately adds ~2px to the Header's rendered height — this is a required, intentional UI change per D-03, not a regression to fix.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created locale catalogs in Task 3 instead of Task 4**
- **Found during:** Task 3 (building `app/i18n/config.ts`)
- **Issue:** `app/i18n/config.ts`'s `i18next.init({ resources: { pt: {...}, en: {...} } })` requires `app/i18n/locales/pt.ts` and `en.ts` to exist for the import to resolve — but the plan assigned their creation to Task 4, which would leave Task 3 unable to typecheck.
- **Fix:** Created `app/i18n/locales/pt.ts` and `en.ts` with the full `header` + `common` sections specified in Task 4's action, during Task 3, so Task 3's own `npm run typecheck` verification gate passes. Task 4 then only added the `Header/index.tsx` wiring (no further locale-file changes needed).
- **Files modified:** `app/i18n/locales/pt.ts`, `app/i18n/locales/en.ts`
- **Verification:** `npm run typecheck` passes after Task 3; Task 4's spec run confirms the catalogs' content is correct end-to-end
- **Committed in:** `8551764` (Task 3 commit)

**2. [Rule 1 - Bug] Updated 4 visual-regression baselines broken by the new Header element**
- **Found during:** Post-Task-4 full-suite verification (not part of the plan's own `<verification>` list, but run as a safety check since Header layout changed)
- **Issue:** `tests/visual.spec.ts` and `tests/theme-light.spec.ts` (Phase 1/2 baselines) failed on `home-full` and `header` screenshots with a 2px height dimension mismatch (1280x4382 expected vs 1280x4384 received) — caused by `LanguageToggle`'s slightly taller bordered container (text-sm content + p-2.5 padding) versus `ThemeToggle`'s icon-only button, making the Header's flex row 2px taller.
- **Fix:** Regenerated the 4 affected baseline PNGs via `npx playwright test tests/visual.spec.ts tests/theme-light.spec.ts --update-snapshots`. Confirmed all 6 unaffected screenshots (hero, projects, aboutme, contacts, footer, in both dark/light) were untouched by the diff.
- **Files modified:** `tests/visual.spec.ts-snapshots/{header,home-full}-chromium-linux.png`, `tests/theme-light.spec.ts-snapshots/{header-light,home-full-light}-chromium-linux.png`
- **Verification:** Full Playwright suite (26 tests across `language-toggle.spec.ts`, `theme-toggle.spec.ts`, `theme-light.spec.ts`, `visual.spec.ts`) passes
- **Committed in:** `2a4f5b6` (Task 4 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking file-ordering fix, 1 bug/baseline-update)
**Impact on plan:** Both auto-fixes were necessary to keep the plan's own verification gates green and to avoid leaving the pre-existing visual-regression suite in a broken state. No scope creep — no content, links, or structure changed beyond the plan's own Header/root.tsx scope.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The i18n foundation (`app/i18n/config.ts`, `useLanguage`, `LanguageToggle`, locale catalogs) is in place and proven end-to-end on the Header — Plans 02-03 extend the same `pt.ts`/`en.ts` catalogs with `hero`/`about`/`projects`/`contacts`/`footer` sections and wire the remaining feature components to `t()`.
- No blockers. `npm run typecheck`, `npm run lint` (no new errors), and the full Playwright suite (26/26) all pass.

---
*Phase: 03-language-toggle-i18n*
*Completed: 2026-07-07*

## Self-Check: PASSED

All created files verified present on disk; all 4 task/summary commits (`62140c4`, `8551764`, `2a4f5b6`, `c8793bc`) verified present in git log.
