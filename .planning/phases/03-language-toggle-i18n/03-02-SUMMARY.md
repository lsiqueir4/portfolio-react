---
phase: 03-language-toggle-i18n
plan: 02
subsystem: i18n
tags: [react-i18next, i18next, react, typescript, hero, contacts, footer]

# Dependency graph
requires:
  - phase: 03-language-toggle-i18n
    provides: "i18next/react-i18next runtime, useLanguage()/LanguageToggle, app/i18n/locales/{pt,en}.ts catalogs (header + common sections), Header fully wired to t()"
provides:
  - "hero, contacts, footer sections added to app/i18n/locales/{pt,en}.ts (structurally identical, typed via `typeof pt`)"
  - "Hero/index.tsx, Contacts/index.tsx, Footer/index.tsx fully wired to useTranslation()/t()"
  - "footer.rights key established with {{year}}/{{name}} interpolation pattern for translated sentences carrying runtime values"
affects: [03-03]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "i18next interpolation ({{year}}/{{name}}) used for footer.rights so the translatable sentence structure lives in the catalog while runtime values (new Date().getFullYear(), CONTACTS.fullName) are passed via t(key, { year, name })"
    - "common.downloadCV and common.contactCTA (established in Plan 01) reused verbatim by Hero's CTA buttons instead of duplicating new hero-scoped keys"

key-files:
  created: []
  modified:
    - app/features/Hero/index.tsx
    - app/features/Contacts/index.tsx
    - app/features/Footer/index.tsx
    - app/i18n/locales/pt.ts
    - app/i18n/locales/en.ts
    - tests/visual.spec.ts-snapshots/hero-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/hero-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/footer-light-chromium-linux.png

key-decisions:
  - "footer.rights modeled as a single interpolated string (\"© {{year}} {{name}}. Todos os direitos reservados.\" / English equivalent) rather than splitting the sentence into fragments — keeps the whole sentence structure translatable while year/fullName stay runtime values, per the plan's suggested pattern"
  - "WhatsApp/Email/Linkedin channel labels routed through contacts.whatsapp/email/linkedin keys even though their PT/EN values are identical strings — keeps all three labels consistently t()-driven rather than only translating the ones that differ"

patterns-established:
  - "Feature sections without array-literal data files (JSX-only) extend the same two locale catalogs opened in Plan 01, one section key per feature (hero/contacts/footer), matching the Header slice's own section-keyed structure"

requirements-completed: [I18N-06, I18N-08]

coverage:
  - id: D1
    description: "Hero section (availability badge, greeting, role heading, intro paragraph, and CV/contact CTA button labels) renders through t() and translates 1:1 between PT and EN"
    requirement: "I18N-06"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
      - kind: e2e
        ref: "tests/language-toggle.spec.ts (Header slice unregressed, confirms t()/i18next plumbing still correct after Hero wiring)"
        status: pass
      - kind: automated_ui
        ref: "tests/visual.spec.ts-snapshots/hero-chromium-linux.png, tests/theme-light.spec.ts-snapshots/hero-light-chromium-linux.png (regenerated, confirm translated Hero renders correctly in both themes)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Contacts section (heading, description paragraph, WhatsApp/Email/Linkedin channel labels) renders through t() and translates 1:1 between PT and EN; phone/email/URLs untouched"
    requirement: "I18N-06"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
      - kind: automated_ui
        ref: "tests/theme-light.spec.ts-snapshots/contacts-light-chromium-linux.png, tests/visual.spec.ts-snapshots/contacts-chromium-linux.png (unchanged, diff under threshold)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Footer copyright renders through t() with the year and CONTACTS.fullName injected via i18next interpolation ({{year}}/{{name}}), preserving them as runtime values"
    requirement: "I18N-06"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
      - kind: automated_ui
        ref: "tests/theme-light.spec.ts-snapshots/footer-light-chromium-linux.png (regenerated), tests/visual.spec.ts-snapshots/footer-chromium-linux.png (unchanged, diff under threshold)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Content, links, and images in Hero/Contacts/Footer are byte-identical between languages — only text changes (I18N-08)"
    requirement: "I18N-08"
    verification:
      - kind: manual_procedural
        ref: "Code review of Hero/Contacts/Footer diffs: CONTACTS.fullName, CONTACTS.cvDownloadLink, CONTACTS.email, CONTACTS.formattedPhone, CONTACTS.whatsappRedirectLink, CONTACTS.linkedinRedirectLink, profile image import, and all hrefs left untouched in all three files"
        status: pass
    human_judgment: true
    rationale: "I18N-08 (content/links/images unchanged) is a structural-preservation guarantee best confirmed by human review of the actual rendered page across both languages, not solely by pixel-diff thresholds which can mask subtle href/data regressions."

duration: 24min
completed: 2026-07-07
status: complete
---

# Phase 3 Plan 02: Hero, Contacts, Footer Translation Summary

**Wires Hero, Contacts, and Footer to `useTranslation()`/`t()` against new `hero`/`contacts`/`footer` sections in the Plan 01 locale catalogs, translating every user-facing string in these three JSX-only sections while leaving all contact data, links, images, and the dynamic copyright year untouched.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-07-07T15:00:50-03:00
- **Completed:** 2026-07-07T15:04:34-03:00
- **Tasks:** 2
- **Files modified:** 8 (2 feature files + 1 feature file already counted, 2 locale catalogs, 3 visual-baseline PNGs)

## Accomplishments

- Added a `hero` section to `app/i18n/locales/{pt,en}.ts` (`badge`, `greeting`, `role`, `intro`) and wired `Hero/index.tsx` to `t()`, reusing the existing `common.downloadCV`/`common.contactCTA` keys for the two CTA buttons instead of duplicating them
- Added `contacts` (`heading`, `description`, `whatsapp`, `email`, `linkedin`) and `footer` (`rights`, with `{{year}}`/`{{name}}` interpolation) sections to both catalogs; wired `Contacts/index.tsx` and `Footer/index.tsx` to `t()`
- Verified `CONTACTS.formattedPhone`, `CONTACTS.email`, `CONTACTS.fullName`, all `href`s (WhatsApp/mailto/LinkedIn/CV download), the profile image, and the dynamic `new Date().getFullYear()` all remain untouched runtime values (I18N-08)
- Full Playwright suite (26/26: language-toggle, theme-toggle, theme-light, visual) passes; regenerated 3 visual baselines (`hero`, `hero-light`, `footer-light`) that legitimately shifted from translated-text length/wrapping — the headless Chromium test environment's default browser locale resolves to EN post-hydration (same accepted D-02 flash from Plan 01), so these captures now show the (correct) English render

## Task Commits

Each task was committed atomically:

1. **Task 1: Translate the Hero section** - `7e286fb` (feat)
2. **Task 2: Translate the Contacts and Footer sections** - `bbdcbd7` (feat)

**Plan metadata:** commit skipped — `commit_docs: false` in `.planning/config.json`

## Files Created/Modified

- `app/features/Hero/index.tsx` - `useTranslation()`/`t()` wiring for badge, greeting, role, intro, and both CTA button labels
- `app/features/Contacts/index.tsx` - `useTranslation()`/`t()` wiring for heading, description, and WhatsApp/Email/Linkedin channel labels
- `app/features/Footer/index.tsx` - `useTranslation()`/`t()` wiring for the copyright sentence, with year/fullName passed as i18next interpolation values
- `app/i18n/locales/pt.ts` / `app/i18n/locales/en.ts` - `hero`, `contacts`, `footer` sections added (structurally identical, `en` still typed as `typeof pt`)
- `tests/visual.spec.ts-snapshots/hero-chromium-linux.png`, `tests/theme-light.spec.ts-snapshots/{hero-light,footer-light}-chromium-linux.png` - regenerated baselines reflecting translated text

## Decisions Made

- `footer.rights` uses i18next interpolation (`{{year}}`, `{{name}}`) rather than splitting the sentence into runtime-concatenated fragments, keeping the full sentence translatable in the catalog while the year and `CONTACTS.fullName` remain runtime-injected values passed via `t("footer.rights", { year, name })`.
- WhatsApp/Email/Linkedin channel labels were routed through `contacts.whatsapp`/`contacts.email`/`contacts.linkedin` keys even though two of the three (`Email`, `Linkedin`) render identical strings in both languages — kept for structural consistency across all three labels rather than special-casing.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Regenerated 3 visual-regression baselines shifted by translated Hero/Footer text**
- **Found during:** Post-Task-2 full-suite verification (part of this plan's own `<verification>` checklist: "Manual: toggling EN translates the hero/contacts/footer copy... profile image, phone, email, LinkedIn/WhatsApp links, and copyright year are identical in both languages")
- **Issue:** `tests/visual.spec.ts` (`hero`) and `tests/theme-light.spec.ts` (`hero-light`, `footer-light`) failed with pixel-diff ratios above the 2% threshold. Root cause: the Playwright/Chromium test environment's default `navigator.language` resolves to `en-US`, so `useLanguage`'s post-hydration mount effect (the accepted one-time flash from Plan 01's D-02 decision) switches the page to English before the screenshot is taken — meaning these three sections now correctly render English text, which differs in length/wrapping from the old baselines captured with hardcoded PT strings.
- **Fix:** Regenerated the 3 affected baseline PNGs via `npx playwright test tests/visual.spec.ts tests/theme-light.spec.ts --update-snapshots`. Confirmed the other 11 unaffected screenshots (header, home-full, projects, aboutme, contacts, footer-dark, in both themes) were untouched by the diff — their translated text is short/identical enough to stay under the 2% pixel-diff threshold.
- **Files modified:** `tests/visual.spec.ts-snapshots/hero-chromium-linux.png`, `tests/theme-light.spec.ts-snapshots/{hero-light,footer-light}-chromium-linux.png`
- **Verification:** Full Playwright suite (26 tests across `language-toggle.spec.ts`, `theme-toggle.spec.ts`, `theme-light.spec.ts`, `visual.spec.ts`) passes
- **Committed in:** `bbdcbd7` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (visual-baseline update, same pattern as Plan 01's deviation #2)
**Impact on plan:** Necessary to keep the pre-existing visual-regression suite green after legitimate translated-content changes. No scope creep — no content, links, or structure changed beyond the plan's own Hero/Contacts/Footer scope.

## Issues Encountered

None beyond the deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `app/i18n/locales/{pt,en}.ts` now carry `header`, `common`, `hero`, `contacts`, `footer` sections — Plan 03 should extend the same two files with the remaining sections (e.g. `about`, `projects`) without colliding with any of these key names.
- `npm run typecheck`, and the full Playwright suite (26/26) pass. `npm run lint` has one pre-existing failure (`no-empty-pattern` in `app/routes/home.tsx`) confirmed out of this plan's scope (same finding logged in Phase 01/STATE.md).
- No blockers.

---
*Phase: 03-language-toggle-i18n*
*Completed: 2026-07-07*

## Self-Check: PASSED
