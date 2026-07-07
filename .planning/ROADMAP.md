# Roadmap: Portfolio — Theming, Dark Mode, i18n & README Refresh

## Overview

This milestone retrofits an existing single-route SSR portfolio (React 19 + React Router 7 + Tailwind CSS 4) with a centralized theme-token system, a manually-toggleable dark/light mode, a PT-BR/EN language switch, and a bilingual README — without changing any existing content, copy, links, images, or site structure. The four phases follow a strict dependency chain confirmed by research: theme/CSS centralization is a hard prerequisite for dark mode (Tailwind v4's `@custom-variant dark` and semantic color tokens must exist before a toggle can do anything visible); dark mode and language toggle are architecturally independent of each other but the language toggle reuses the persistence primitive (detect default → allow override → persist) that dark mode establishes; the bilingual README is ordered last since it documents the finished feature set.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Theme/CSS Token Centralization** - Replace scattered hardcoded color utility classes with centralized semantic tokens and wire the Tailwind v4 dark-mode variant mechanism, with zero visual regression (completed 2026-07-07)
- [x] **Phase 2: Dark Mode Toggle** - Add a Header sun/moon toggle that defaults to browser preference, persists a manual choice via localStorage, and never flashes the wrong theme (completed 2026-07-07)
- [x] **Phase 3: Language Toggle (i18n)** - Add a Header PT/EN toggle via react-i18next that defaults to browser language, persists a manual choice, and translates every user-facing string 1:1 (completed 2026-07-07)
- [x] **Phase 4: Bilingual README** - Rewrite the README as cross-linked PT-BR (`README.md`) and EN (`README.en.md`) versions with feature/tech-stack parity (completed 2026-07-07)

## Phase Details

### Phase 1: Theme/CSS Token Centralization

**Goal**: All hardcoded color utility classes across every feature folder are replaced with a centralized semantic-token system, and the Tailwind v4 dark-mode variant mechanism is wired — with the existing UI rendering identically to before
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04
**Success Criteria** (what must be TRUE):

  1. Every feature component (Header, Hero, AboutMe, Projects, Contacts, Footer, TechBadge) uses centralized semantic color tokens (e.g. `bg-surface`, `text-accent`, `text-on-surface`) instead of hardcoded `purple-*`/`zinc-*`/`gray-*` utility classes
  2. The `@custom-variant dark (&:where(.dark, .dark *));` directive is established in `app.css` and Tailwind compiles `dark:` utility classes correctly, proving the mechanism is wired for Phase 2 to layer on override values and the manual toggle (visible color inversion via OS preference is intentionally deferred to Phase 2 — introducing override values now would change appearance for light-OS-preference visitors before any toggle exists, conflicting with THEME-04's zero-regression guarantee, a tension that surfaced during Phase 1 planning and was resolved in favor of THEME-04)
  3. Every page section renders visually identical to before the refactor (manual before/after verification, since there is no automated visual-regression net)
  4. Repeated component-level patterns across feature folders are de-duplicated without changing visual output or structure

**Plans**: 5/5 plans complete
**Wave 1**

- [x] 01-01-PLAN.md — Playwright visual-regression harness + pre-refactor baseline capture (safety net)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — 7 semantic tokens + `@custom-variant dark` in app.css; shared Section.tsx + Button.tsx

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — Migrate Header + Hero (consume Button) + Footer + TechBadge to tokens
- [x] 01-04-PLAN.md — Migrate AboutMe + Projects + Contacts (consume Section) to tokens

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-05-PLAN.md — Final gate: grep-clean + dark-variant compile + full visual diff + human sign-off

**UI hint**: yes

### Phase 2: Dark Mode Toggle

**Goal**: Users can manually switch between dark and light themes from the Header, with the choice persisting across visits and no flash of the wrong theme on load
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: DARK-01, DARK-02, DARK-03, DARK-04, DARK-05
**Success Criteria** (what must be TRUE):

  1. A sun/moon toggle button exists in the Header, is a native `<button>`, and is keyboard-operable with `aria-label`/`aria-pressed`
  2. On first visit (no prior manual choice), the site's theme matches the browser's `prefers-color-scheme` with no flash of the wrong theme before paint
  3. After a manual toggle, the chosen theme persists across page reloads and future visits via localStorage, overriding the browser default
  4. The purple accent color remains the primary accent in both light and dark themes — only background/text tokens invert
  5. The "detect default → allow override → persist" logic is implemented as a reusable primitive that Phase 3 reuses for language

**Plans**: 2/2 plans complete

**Wave 1**

- [x] 02-01-PLAN.md — Working dark/light toggle: invert app.css tokens, reusable `usePersistedPreference`/`useTheme` hooks, `ThemeToggle` in Header, SSR no-flash script (DARK-01..05)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — Light-mode visual-regression baseline + human sign-off (DARK-02, DARK-04)

**UI hint**: yes

### Phase 3: Language Toggle (i18n)

**Goal**: Users can switch the entire site's language between PT-BR and EN from the Header, with every user-facing string translated 1:1 and no change to content, links, or images
**Mode:** mvp
**Depends on**: Phase 2 (reuses the persistence primitive established by DARK-05)
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, I18N-06, I18N-07, I18N-08
**Success Criteria** (what must be TRUE):

  1. A PT/EN text-label toggle button (not flags) exists in the Header, next to the dark mode toggle, with an `aria-label`
  2. On first visit (no prior manual choice), the site's language matches the browser's `navigator.language`
  3. After a manual toggle, the chosen language persists across page reloads and future visits via localStorage, reusing the Phase 2 persistence primitive
  4. Switching language updates every user-facing string across Hero, AboutMe, Projects, Contacts, Header, and Footer — including array-literal content in `data.tsx` files — and updates `document.documentElement.lang` to match
  5. All content, links, and images remain unchanged in both languages — only the language of text changes, including UI-adjacent strings like dates ("Fev 2022" → "Feb 2022") and status labels ("Em andamento" → "In progress")

**Plans**: 3/3 plans complete

**Wave 1**

- [x] 03-01-PLAN.md — i18n foundation + working Header PT/EN switcher end-to-end (install i18next/react-i18next, useLanguage reusing usePersistedPreference, LanguageToggle, SSR html-lang wiring, Header translated) (I18N-01..06)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03-02-PLAN.md — Translate JSX-only sections: Hero, Contacts, Footer (I18N-06, I18N-08)

**Wave 3** *(blocked on Wave 2 completion — shares locale catalogs)*

- [x] 03-03-PLAN.md — Translate array-heavy sections: Projects + AboutMe incl. data.tsx dates/status ("Fev 2022"→"Feb 2022", "Em andamento"→"In progress") (I18N-06, I18N-07, I18N-08)

**UI hint**: yes

### Phase 4: Bilingual README

**Goal**: A reader in either language can understand the project's features and tech stack from the README and jump to the other language version
**Mode:** mvp
**Depends on**: Phase 3 (documents the finished feature set; no technical dependency)
**Requirements**: DOCS-01, DOCS-02, DOCS-03
**Success Criteria** (what must be TRUE):

  1. `README.md` (PT-BR) is rewritten, highlighting the project's features and tech stack
  2. `README.en.md` (EN) exists as the English counterpart with content parity to `README.md`
  3. Both README files carry a cross-link banner at the top so a reader can jump between language versions

**Plans**: 1/1 plans complete

Plans:

- [x] 04-01-PLAN.md — Add MIT LICENSE, rewrite README.md (PT-BR), create README.en.md (EN) with cross-link banner

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Theme/CSS Token Centralization | 5/5 | Complete    | 2026-07-07 |
| 2. Dark Mode Toggle | 2/2 | Complete    | 2026-07-07 |
| 3. Language Toggle (i18n) | 3/3 | Complete    | 2026-07-07 |
| 4. Bilingual README | 1/1 | Complete    | 2026-07-07 |
