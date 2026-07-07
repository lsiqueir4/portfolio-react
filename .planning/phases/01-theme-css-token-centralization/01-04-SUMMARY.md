---
phase: 01-theme-css-token-centralization
plan: 04
subsystem: ui
tags: [tailwind, css-tokens, react, theming, section-dedup]

# Dependency graph
requires:
  - phase: 01-theme-css-token-centralization (Plan 02)
    provides: 7 locked semantic color tokens in app/app.css @theme, shared app/shared/Section.tsx
provides:
  - AboutMe, Projects, and Contacts fully migrated to semantic color tokens (no purple-/zinc-/gray- literals remain)
  - AboutMe, Projects, and Contacts consuming the shared Section component for their divider/title block
affects: [01-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Section's titleClassName/subtitleClassName override used in Projects to preserve its centered heading's distinct sizing (font-bold mb-4 vs AboutMe's font-extrabold mb-6 default)"
    - "Section used divider-only (no title/subtitle/eyebrow props) in Contacts, since its h1/subtitle live inside the contact card, not the divider block"
    - "3-shade muted collapse (zinc-300/400/500 -> text-muted) causes hover:text-zinc-300 states to become visual no-ops in Contacts contact rows — accepted per Plan 02's token-normalization decision, confirmed zero regression via Playwright"

key-files:
  created: []
  modified:
    - app/features/AboutMe/index.tsx
    - app/features/Projects/index.tsx
    - app/features/Contacts/index.tsx

key-decisions:
  - "AboutMe's title block needed no titleClassName/subtitleClassName override — Section's defaults (mb-6 text-3xl font-extrabold text-on-surface sm:text-4xl md:text-5xl / max-w-3xl text-base leading-relaxed font-medium text-muted sm:text-lg) already match AboutMe's original classes exactly"
  - "Projects' title block required explicit titleClassName/subtitleClassName overrides (font-bold mb-4 / mx-auto max-w-2xl text-sm sm:text-base) since its heading/subtitle sizing differs from Section's AboutMe-derived defaults"
  - "Contacts uses <Section align=\"center\" /> with no title/subtitle/eyebrow props — only the standalone gradient divider was de-duplicated; the h1/subtitle stayed inside the contact card as before, per plan instruction to preserve card structure"

requirements-completed: [THEME-01, THEME-03, THEME-04]

coverage:
  - id: D1
    description: "AboutMe renders all theme colors via semantic tokens and consumes shared Section (align=left) for its title block; InfoCard/ExperienceCard/local SectionTitle stay in-file per D-03"
    requirement: "THEME-01, THEME-03"
    verification:
      - kind: other
        ref: "grep -Eq '(purple|zinc|gray)-[0-9]' app/features/AboutMe/index.tsx — zero matches"
        status: pass
      - kind: e2e
        ref: "npx playwright test tests/visual.spec.ts — about me section (#aboutme) and full page baselines pass"
        status: pass
    human_judgment: false
  - id: D2
    description: "Projects renders all theme colors via semantic tokens and consumes shared Section (align=center, custom title/subtitle classes) for its title block; ProjectContainer stays in-file per D-03"
    requirement: "THEME-01, THEME-03"
    verification:
      - kind: other
        ref: "grep -Eq '(purple|zinc|gray)-[0-9]' app/features/Projects/index.tsx — zero matches"
        status: pass
      - kind: e2e
        ref: "npx playwright test tests/visual.spec.ts — projects section (#projetos) and full page baselines pass"
        status: pass
    human_judgment: false
  - id: D3
    description: "Contacts renders theme colors via semantic tokens (email purple migrated to accent tokens) while WhatsApp green and LinkedIn blue brand colors stay literal, and consumes shared Section for its divider only"
    requirement: "THEME-01, THEME-03"
    verification:
      - kind: other
        ref: "grep -Eq '(purple|zinc|gray)-[0-9]' app/features/Contacts/index.tsx — zero matches; grep -Eq '(green|blue)-500' app/features/Contacts/index.tsx — matches present"
        status: pass
      - kind: e2e
        ref: "npx playwright test tests/visual.spec.ts — contacts section (#contacts) and full page baselines pass"
        status: pass
    human_judgment: false
  - id: D4
    description: "All three migrated sections match their Plan 01 visual baselines within tolerance (THEME-04), and typecheck/lint/build remain clean"
    requirement: "THEME-04"
    verification:
      - kind: other
        ref: "npm run typecheck && npm run lint (AboutMe/Projects/Contacts/Section files) && npm run build — all pass with zero errors"
        status: pass
      - kind: e2e
        ref: "npx playwright test tests/visual.spec.ts — full 7-test suite (full page, header, hero, projects, aboutme, contacts, footer) all pass"
        status: pass
    human_judgment: false

duration: ~15min
completed: 2026-07-06
status: complete
---

# Phase 01 Plan 04: AboutMe/Projects/Contacts Token & Section Migration Summary

**Migrated AboutMe, Projects, and Contacts to the locked semantic token system and replaced each section's repeated divider/title-block markup with the shared `Section` component — zero rendered visual change, confirmed by the full Playwright visual-regression suite.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 3
- **Files modified:** 3 (`AboutMe/index.tsx`, `Projects/index.tsx`, `Contacts/index.tsx`)

## Accomplishments

- Migrated every color class in `AboutMe/index.tsx` (section background, blur blobs, `InfoCard`, `ExperienceCard`, course cards, local `SectionTitle`) from `purple-*`/`zinc-*`/`white` literals to the semantic tokens (`bg-surface`, `text-on-surface`, `text-muted`, `bg-accent/10`, `border-border-subtle/10`, `bg-surface-elevated/40`, `border-accent-hover`, `bg-accent-hover`, `text-accent-hover`)
- Replaced AboutMe's title block (divider + eyebrow "Sobre Mim" + h1 "Quem sou eu" + subtitle) with `<Section align="left" eyebrow="Sobre Mim" title="Quem sou eu" subtitle="..." />`; kept the outer `mb-12 sm:mb-16` wrapper, text byte-identical, no className overrides needed since Section's defaults already matched AboutMe's original heading/subtitle classes exactly
- Kept `SectionTitle`, `InfoCard`, and `ExperienceCard` as local, non-exported subcomponents per D-03
- Migrated every color class in `Projects/index.tsx` (section background, blur blobs, `ProjectContainer` border/background/hover-shadow, title, description, "Ver código" link) to semantic tokens
- Replaced Projects' centered title block (divider + h1 "Projetos" + subtitle) with `<Section align="center" title="Projetos" subtitle="..." titleClassName="mb-4 text-3xl font-bold text-on-surface sm:text-4xl md:text-5xl" subtitleClassName="mx-auto max-w-2xl text-sm font-medium text-muted sm:text-base" />` — className overrides preserve Projects' distinct heading/subtitle sizing vs. Section's AboutMe-derived defaults
- Kept `ProjectContainer` as a local subcomponent per D-03
- Migrated every color class in `Contacts/index.tsx` (section background, blur blobs, contact card, h1, intro subtitle, all three contact rows' shared shell/value/label text) to semantic tokens
- Migrated the Email icon chip (`border-purple-400 bg-purple-500/10`, icon `text-purple-400`) to accent tokens (`border-accent-hover bg-accent/10`, `text-accent-hover`)
- Kept WhatsApp (`border-green-500 bg-green-500/10 text-green-500`) and LinkedIn (`border-blue-500 bg-blue-500/10 text-blue-500`) brand colors literal per the D-01/PATTERNS exception — these are contact-brand colors, not part of the 7-token theme set
- Replaced Contacts' standalone gradient divider with `<Section align="center" />` (divider-only usage); the contact card's h1/subtitle stayed inside the card as siblings of the divider, structure unchanged
- Confirmed via grep across all three files that zero `purple-`/`zinc-`/`gray-` literal color classes remain, and that `green-500`/`blue-500` are still present in Contacts

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate AboutMe to tokens and consume Section for its title block** - `6dde5ac` (feat)
2. **Task 2: Migrate Projects to tokens and consume Section** - `6f80ac3` (feat)
3. **Task 3: Migrate Contacts to tokens and consume Section for the divider** - `14de152` (feat)

**Plan metadata:** commit skipped (`commit_docs: false` in `.planning/config.json` — orchestrator handles docs commit centrally)

## Files Created/Modified

- `app/features/AboutMe/index.tsx` - Token migration + shared `Section` (align="left") for title block; `InfoCard`/`ExperienceCard`/`SectionTitle` kept local
- `app/features/Projects/index.tsx` - Token migration + shared `Section` (align="center", custom title/subtitle classes) for title block; `ProjectContainer` kept local
- `app/features/Contacts/index.tsx` - Token migration (email purple → accent, green/blue brand colors preserved) + shared `Section` (align="center", divider-only) replacing the standalone gradient divider

## Decisions Made

- AboutMe's title block required no `titleClassName`/`subtitleClassName` override — Section's built-in defaults are byte-for-byte identical to AboutMe's original heading/subtitle classes (Section's defaults were in fact derived from AboutMe in Plan 02)
- Projects' title block needed explicit `titleClassName`/`subtitleClassName` overrides since its heading uses `font-bold mb-4` (vs. Section's default `font-extrabold mb-6`) and its subtitle uses `mx-auto max-w-2xl text-sm sm:text-base` (vs. Section's default `max-w-3xl text-base sm:text-lg`)
- Contacts uses `<Section align="center" />` with no title/subtitle/eyebrow props — only the standalone gradient divider was de-duplicated; the h1 "Entre em Contato" and intro subtitle remain inside the contact card exactly as before, per the plan's structure-preservation instruction

## Deviations from Plan

None - plan executed exactly as written. One pre-existing, out-of-scope issue was discovered and logged (not fixed) per the scope-boundary rule:

- **Missing `key` prop in `Projects.map()`** (`app/features/Projects/index.tsx`) — confirmed pre-existing via `git log`, unrelated to this plan's color-token/Section migration. Logged to `.planning/phases/01-theme-css-token-centralization/deferred-items.md`; not fixed, since it falls outside this plan's task scope and does not affect the Playwright visual-regression baselines (console warning only, not a rendering diff).

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 feature files + `TechBadge` now fully migrated to the semantic token system across Plans 01-04; only `app/app.css`'s `@theme` block itself retains the underlying `purple-500`/`purple-400`/`zinc-950`/`zinc-900`/`zinc-400`/`white` color values (expected — that's where the tokens are defined)
- Full Playwright visual-regression suite (7 tests: full page, header, hero, projects, aboutme, contacts, footer) passes against Plan 01 baselines with zero rendered difference
- Ready for Plan 05 (final phase verification/wrap-up) or Phase 2 (dark mode toggle), which can now safely add a `.dark` variant on top of the locked token set without touching any feature file's markup

---
*Phase: 01-theme-css-token-centralization*
*Completed: 2026-07-06*

## Self-Check: PASSED

- FOUND: app/features/AboutMe/index.tsx
- FOUND: app/features/Projects/index.tsx
- FOUND: app/features/Contacts/index.tsx
- FOUND: .planning/phases/01-theme-css-token-centralization/01-04-SUMMARY.md
- FOUND commit: 6dde5ac
- FOUND commit: 6f80ac3
- FOUND commit: 14de152
