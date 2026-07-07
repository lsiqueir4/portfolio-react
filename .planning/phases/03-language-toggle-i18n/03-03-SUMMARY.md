---
phase: 03-language-toggle-i18n
plan: 03
subsystem: i18n
tags: [react-i18next, i18next, react, typescript, projects, aboutme, data-modeling]

# Dependency graph
requires:
  - phase: 03-language-toggle-i18n
    provides: "i18next/react-i18next runtime, useLanguage()/LanguageToggle, app/i18n/locales/{pt,en}.ts catalogs (header, common, hero, contacts, footer sections), Header/Hero/Contacts/Footer fully wired to t()"
provides:
  - "projects and about sections added to app/i18n/locales/{pt,en}.ts (structurally identical, typed via `typeof pt`)"
  - "Projects/data.tsx and AboutMe/data.tsx refactored to id-keyed entries (Option 1: ids + non-translatable proper nouns/links/images in data.tsx, translatable text resolved from locale catalogs via t())"
  - "Projects/index.tsx and AboutMe/index.tsx fully wired to useTranslation()/t(), including array resolution via t(key, { returnObjects: true })"
  - "Full-site EN pass complete: I18N-06/07/08 closed — every user-facing string across Header, Hero, AboutMe, Projects, Contacts, Footer translates on toggle, including UI-adjacent dates/status labels, with all content/links/images unchanged"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "id-keyed data.tsx entries (Option 1 per CONTEXT.md/PATTERNS.md): data.tsx holds a stable `id` plus non-translatable fields (icons, links, images, company/institution proper nouns); translatable text lives in locale catalogs under `<section>.<id>.<field>` and is resolved in the component via t()"
    - "t(key, { returnObjects: true }) as string[] for array-literal content (AboutMe experience activities) — the returnObjects i18next option returns the raw array from the catalog instead of a string, cast to string[] at the call site"
    - "Component-level prop shapes (ProjectContainerProps, Experience) kept unchanged from pre-refactor — only the upstream data.tsx source and the index.tsx resolution point changed to id+t(), avoiding a cascading type change through child components"

key-files:
  created: []
  modified:
    - app/features/Projects/data.tsx
    - app/features/Projects/types.tsx
    - app/features/Projects/index.tsx
    - app/features/AboutMe/data.tsx
    - app/features/AboutMe/types.tsx
    - app/features/AboutMe/index.tsx
    - app/i18n/locales/pt.ts
    - app/i18n/locales/en.ts
    - tests/visual.spec.ts-snapshots/aboutme-chromium-linux.png
    - tests/visual.spec.ts-snapshots/contacts-chromium-linux.png
    - tests/visual.spec.ts-snapshots/footer-chromium-linux.png
    - tests/visual.spec.ts-snapshots/home-full-chromium-linux.png
    - tests/visual.spec.ts-snapshots/projects-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/aboutme-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/contacts-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/footer-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/home-full-light-chromium-linux.png
    - tests/theme-light.spec.ts-snapshots/projects-light-chromium-linux.png

key-decisions:
  - "Projects ids assigned: portfolio, bankApi, prescriptionApi; AboutMe experience ids: qitech, viamar; AboutMe course ids: dataScience, jsTsReact, databases, python — all compile-time constants in data.tsx, never derived from user input"
  - "ProjectContainerProps and Experience component prop types kept unchanged (still receive resolved title/description/role/startDate/endDate/activities strings) — only the new ProjectData/ExperienceData/CourseData data-shape types were added, and index.tsx resolves t() values before passing them down, so child components stay translation-agnostic"
  - "FrontEnd/BackEnd tech-category subheadings kept as literal English loanwords in both pt/en catalogs (already used untranslated in the PT original); only Ferramentas -> Tools actually changes text, per the plan's explicit instruction"
  - "Regenerated 10 visual-regression baselines (projects/aboutme/contacts/footer/home-full, dark+light variants) after wiring Projects/AboutMe to t() — same accepted pattern as Plans 01-02: the Playwright/Chromium test environment resolves navigator.language to en-US post-hydration, so English text (different length/wrapping) is what's captured now, which is correct, not a regression"

patterns-established:
  - "Data.tsx files with array-literal translatable content follow: id-keyed entries in data.tsx -> t(`<section>.<id>.<field>`) resolution in the consuming index.tsx -> parallel <section>.<id>.<field> in both pt.ts/en.ts locale catalogs"

requirements-completed: [I18N-06, I18N-07, I18N-08]

coverage:
  - id: D1
    description: "Projects section (title, subtitle, per-project title/description, 'Ver código'/'View code' link label) renders through t() via id-keyed data.tsx entries and translates 1:1 between PT and EN; links/images/tech badges unchanged"
    requirement: "I18N-06"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
      - kind: automated_ui
        ref: "tests/visual.spec.ts-snapshots/projects-chromium-linux.png, tests/theme-light.spec.ts-snapshots/projects-light-chromium-linux.png (regenerated, confirm translated Projects renders correctly in both themes)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Every inline AboutMe JSX label (eyebrow/title/subtitle, education/languages/experience/technologies/courses headings, FrontEnd/BackEnd/Tools subheadings) renders through t() and translates 1:1 between PT and EN"
    requirement: "I18N-06"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
      - kind: automated_ui
        ref: "tests/visual.spec.ts-snapshots/aboutme-chromium-linux.png, tests/theme-light.spec.ts-snapshots/aboutme-light-chromium-linux.png (regenerated, confirm translated AboutMe renders correctly in both themes)"
        status: pass
    human_judgment: false
  - id: D3
    description: "AboutMe experiences (role, startDate, endDate, activities array) and courses (name, conclusionYear) resolve via id-keyed data.tsx + t()/t(..., { returnObjects: true }); dates ('Fev 2022'->'Feb 2022') and the 'Em andamento'->'In progress' status label are translated as UI-adjacent strings, not fixed content"
    requirement: "I18N-07"
    verification:
      - kind: unit
        ref: "npm run typecheck"
        status: pass
      - kind: e2e
        ref: "npx playwright test tests/language-toggle.spec.ts (7/7 passing, no regression of the toggle plumbing after AboutMe/Projects refactor)"
        status: pass
      - kind: manual_procedural
        ref: "grep -rn 'Ver código|Formação|Idiomas|Cursos|Experiência Profissional|Sobre Mim|Principais Tecnologias|Em andamento' app/features/ returns no hardcoded PT strings"
        status: pass
    human_judgment: false
  - id: D4
    description: "Non-translatable data (icons, links, images, company/institution proper nouns like 'QI Tech'/'Grupo Viamar'/'DIO'/'Udemy', tech names) is byte-identical in both languages — only id + those exact fields remain in data.tsx, no translatable literals leaked through"
    requirement: "I18N-08"
    verification:
      - kind: manual_procedural
        ref: "Code review of Projects/data.tsx and AboutMe/data.tsx diffs: usedTechs/link/image and company/institution values left untouched verbatim; app/constants/index.tsx (CONTACTS) confirmed unmodified"
        status: pass
    human_judgment: true
    rationale: "I18N-08 (content/links/images unchanged) is a structural-preservation guarantee best confirmed by human review of the actual rendered page across both languages, not solely by pixel-diff thresholds which can mask subtle href/data regressions -- consistent with Plan 02's D4 rationale."

duration: 20min
completed: 2026-07-07
status: complete
---

# Phase 3 Plan 03: Projects & AboutMe Translation Summary

**Translates the array-heavy Projects and AboutMe sections via id-keyed `data.tsx` entries resolved through `t()` against new `projects`/`about` locale sections, closing I18N-06/07/08: every user-facing string on the site — including data-array content like experience activities, dates, and the "Em andamento"/"In progress" status label — now switches language on toggle while all links, images, and proper nouns stay unchanged.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-07T17:55:00Z
- **Completed:** 2026-07-07T18:15:00Z
- **Tasks:** 3
- **Files modified:** 18 (8 source files, 10 regenerated visual-baseline PNGs)

## Accomplishments

- Refactored `Projects/data.tsx` to id-keyed entries (`portfolio`, `bankApi`, `prescriptionApi`) dropping literal `title`/`description`; added a `projects` section to both locale catalogs (`title`, `subtitle`, `viewCode`, per-id `title`/`description`); wired `Projects/index.tsx` to `useTranslation()`/`t()`
- Added an `about` section to both locale catalogs covering every inline AboutMe JSX label (eyebrow/title/subtitle, education, languages, experience/technologies/courses headings, FrontEnd/BackEnd/Tools subheadings); wired `AboutMe/index.tsx` to `t()`
- Refactored `AboutMe/data.tsx` experiences/courses to id-keyed entries (`qitech`/`viamar`, `dataScience`/`jsTsReact`/`databases`/`python`), keeping only the proper-noun `company`/`institution` fields; extended the `about` section with per-id `experiences.<id>.{role,startDate,endDate,activities}` and `courses.<id>.{name,conclusionYear}`, translating dates ("Fev 2022"→"Feb 2022", "Set 2025"→"Sep 2025", "Out 2017"→"Oct 2017") and the "Em andamento"→"In progress" status label (I18N-07)
- `AboutMe/index.tsx` resolves `activities` via `t(key, { returnObjects: true })` cast to `string[]`, mapped to list items exactly as before
- Confirmed `app/constants/index.tsx` (CONTACTS) required no changes — held only links/email/phone/name
- Full-site grep confirms zero residual hardcoded Portuguese user-facing strings remain across Header/Hero/AboutMe/Projects/Contacts/Footer (I18N-06 complete)
- `npm run typecheck` passes; full Playwright suite (26/26: language-toggle, theme-toggle, theme-light, visual) passes after regenerating 10 visual baselines shifted by translated content

## Task Commits

Each task was committed atomically:

1. **Task 1: Translate Projects (title/description via id-keyed data)** - `cb6f2c7` (feat)
2. **Task 2: Translate AboutMe inline JSX labels** - `e1157d3` (feat)
3. **Task 3: Translate AboutMe data.tsx arrays (experiences + courses) incl. dates and status** - `191c9f3` (feat)

**Plan metadata:** commit skipped — `commit_docs: false` in `.planning/config.json`

## Files Created/Modified

- `app/features/Projects/data.tsx` - id-keyed `projects` array (id + usedTechs/link/image only)
- `app/features/Projects/types.tsx` - added `ProjectData` type for the id-based data shape (kept `ProjectContainerProps` unchanged)
- `app/features/Projects/index.tsx` - `useTranslation()`/`t()` wiring for section title/subtitle, per-project title/description, "Ver código"/"View code" link label; added `key={project.id}` to the map
- `app/features/AboutMe/data.tsx` - id-keyed `experiences`/`courses` arrays (id + company/institution proper nouns only)
- `app/features/AboutMe/types.tsx` - added `ExperienceData`/`CourseData` types for the id-based data shapes (kept `Experience`/`Course` component-prop types unchanged)
- `app/features/AboutMe/index.tsx` - `useTranslation()`/`t()` wiring for every inline label plus id-based resolution of experience/course fields, `activities` via `returnObjects: true`
- `app/i18n/locales/pt.ts` / `app/i18n/locales/en.ts` - `projects` and `about` sections added (structurally identical, `en` still typed as `typeof pt`)
- `tests/visual.spec.ts-snapshots/{aboutme,contacts,footer,home-full,projects}-chromium-linux.png`, `tests/theme-light.spec.ts-snapshots/{aboutme-light,contacts-light,footer-light,home-full-light,projects-light}-chromium-linux.png` - regenerated baselines reflecting translated text

## Decisions Made

- Assigned stable ids: Projects (`portfolio`, `bankApi`, `prescriptionApi`), AboutMe experiences (`qitech`, `viamar`), AboutMe courses (`dataScience`, `jsTsReact`, `databases`, `python`) — all compile-time constants in `data.tsx`, never derived from user input (mitigates T-03-05).
- Kept `ProjectContainerProps` and `Experience` component-prop types unchanged — added separate `ProjectData`/`ExperienceData`/`CourseData` types for the raw id-keyed data shapes, so `index.tsx` is the only place that changed to resolve `t()` values before passing already-translated strings down to presentation components.
- `FrontEnd`/`BackEnd` tech-category subheadings kept as literal, unchanged English loanwords in both catalogs (they were already used untranslated in the PT original); only `Ferramentas`→`Tools` actually changes text, per the plan's explicit instruction.
- Regenerated 10 visual-regression baselines (projects/aboutme/contacts/footer/home-full, dark+light) — same accepted pattern from Plans 01-02: the Playwright/Chromium test environment's `navigator.language` resolves to `en-US` post-hydration, so these baselines now correctly capture the translated English render (different text length/wrapping), not a regression.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added missing `key` prop to the Projects map**
- **Found during:** Task 1 (refactoring `Projects/index.tsx` to map over id-keyed data)
- **Issue:** The pre-existing `projects.map((project) => (<ProjectContainer .../>))` had no `key` prop, a React list-rendering correctness issue (console warning, potential reconciliation bugs). The id refactor made a stable key trivially available.
- **Fix:** Added `key={project.id}` to the `ProjectContainer` element in the map, directly touching the line already being modified for the id refactor.
- **Files modified:** `app/features/Projects/index.tsx`
- **Verification:** `npm run typecheck` passes; no React key warnings in Playwright test output
- **Committed in:** `cb6f2c7` (Task 1 commit)

**2. [Rule 1 - Bug] Regenerated 10 visual-regression baselines shifted by translated Projects/AboutMe text**
- **Found during:** Post-Task-3 full-suite verification (per this plan's own `<verification>` checklist: "Full-site pass: with EN selected, no untranslated Portuguese user-facing string remains")
- **Issue:** `tests/visual.spec.ts` and `tests/theme-light.spec.ts` failed on `projects`, `aboutme`, `contacts`, `footer`, and `home-full` screenshots (both theme variants) with pixel-diff/dimension mismatches — translated English text in Projects/AboutMe is shorter/wraps differently than the Portuguese baselines, and the layout shift cascades to push `contacts`/`footer` content, changing full-page height.
- **Fix:** Regenerated the 10 affected baseline PNGs via `npx playwright test tests/visual.spec.ts tests/theme-light.spec.ts --update-snapshots`. Confirmed the remaining baselines (header, hero, dark-mode variants) were untouched by the diff.
- **Files modified:** `tests/visual.spec.ts-snapshots/{aboutme,contacts,footer,home-full,projects}-chromium-linux.png`, `tests/theme-light.spec.ts-snapshots/{aboutme-light,contacts-light,footer-light,home-full-light,projects-light}-chromium-linux.png`
- **Verification:** Full Playwright suite (26 tests across `language-toggle.spec.ts`, `theme-toggle.spec.ts`, `theme-light.spec.ts`, `visual.spec.ts`) passes
- **Committed in:** `191c9f3` (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 minor bug fix, 1 visual-baseline update consistent with Plans 01-02's established pattern)
**Impact on plan:** Both auto-fixes necessary to keep the pre-existing verification/test suites green after legitimate translated-content changes. No scope creep — no content, links, or structure changed beyond the plan's own Projects/AboutMe scope.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 3 (language-toggle-i18n) is fully complete: I18N-01 through I18N-08 all closed across Plans 01-03. `app/i18n/locales/{pt,en}.ts` now carry `header`, `common`, `hero`, `contacts`, `footer`, `projects`, `about` sections, structurally locked via `en: typeof pt`.
- `npm run typecheck` passes; full Playwright suite (26/26) passes. `npm run lint` has one pre-existing failure (`no-empty-pattern` in `app/routes/home.tsx`) confirmed out of this plan's and this phase's scope (same finding logged since Phase 01/STATE.md).
- No blockers. Phase 4 (bilingual README rewrite) is unblocked and does not depend on any i18n runtime code from this phase.

---
*Phase: 03-language-toggle-i18n*
*Completed: 2026-07-07*

## Self-Check: PASSED
