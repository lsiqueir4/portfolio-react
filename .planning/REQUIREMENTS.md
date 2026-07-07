# Requirements: Portfolio — Theming, Dark Mode, i18n & README Refresh

**Defined:** 2026-07-06
**Core Value:** Ship theme centralization, dark mode, PT-BR/EN language switch, and a bilingual README without changing any existing content, copy, links, images, or site structure.

## v1 Requirements

### Theme (CSS/Component Centralization)

- [x] **THEME-01**: All hardcoded color utility classes (`purple-400/500`, `zinc-300/400/900/950`, `gray-950`, etc.) scattered across Header, Hero, AboutMe, Projects, Contacts, Footer, and TechBadge are replaced with centralized semantic tokens (Tailwind v4 `@theme` config: `bg-surface`, `text-accent`, `text-on-surface`, etc.)
- [x] **THEME-02**: Tailwind v4 dark-mode variant mechanism (`@custom-variant dark (&:where(.dark, .dark *));`) is established in `app.css`, replacing the removed `tailwind.config.js` `darkMode` option
- [x] **THEME-03**: Repeated component-level patterns (not just colors) across feature folders are de-duplicated where doing so doesn't change visual output or structure
- [x] **THEME-04**: No visual regression — every page section renders identically to before the refactor (manual verification, since there is no test/visual-regression safety net)

### Dark Mode

- [x] **DARK-01**: A dark/light toggle button exists in the Header — sun/moon icon, native `<button>`, `aria-label`, `aria-pressed`
- [x] **DARK-02**: Default theme on first visit follows the browser's `prefers-color-scheme`, with no flash of the wrong theme (SSR-safe: pre-hydration inline script sets `.dark` on `<html>` before paint)
- [x] **DARK-03**: A manual toggle choice persists across visits via localStorage, overriding the browser default on subsequent loads
- [x] **DARK-04**: The purple accent color remains the primary accent in both light and dark themes — only background/text tokens invert
- [x] **DARK-05**: The persistence pattern (read localStorage → fall back to browser signal → allow override → persist) is built as a reusable primitive for Phase 3 to reuse for language

### Language (i18n PT-BR/EN)

- [x] **I18N-01**: `react-i18next` + `i18next` are integrated (SSR-safe: fixed, matching default language on server and client to avoid hydration mismatch)
- [x] **I18N-02**: A PT-BR/EN toggle button exists in the Header, next to the dark mode toggle — text labels ("PT"/"EN", not flags), `aria-label`
- [x] **I18N-03**: Default language on first visit follows the browser's `navigator.language`
- [x] **I18N-04**: A manual toggle choice persists across visits via localStorage, overriding the browser default on subsequent loads, reusing the Phase 2 persistence primitive
- [x] **I18N-05**: `document.documentElement.lang` updates when the language changes
- [x] **I18N-06**: Every user-facing string across Hero, AboutMe, Projects, Contacts, Header, and Footer is translated 1:1 into English — including array-literal content in `data.tsx` files (not just JSX strings), with no rewording of meaning and no new content
- [x] **I18N-07**: UI-adjacent strings (dates, status labels like "Fev 2022", "Em andamento") ARE translated in the EN version (e.g., "Feb 2022", "In progress") — confirmed as UI elements, not fixed content
- [x] **I18N-08**: All content, links, and images remain unchanged — only the language of existing text changes

### Documentation

- [x] **DOCS-01**: `README.md` (PT-BR) is rewritten, highlighting features and the tech stack used
- [x] **DOCS-02**: `README.en.md` (EN) is created as the English counterpart, with content parity to `README.md`
- [x] **DOCS-03**: Both README files are cross-linked at the top (language-switch banner) so a reader can jump between versions

## v2 Requirements

None — PROJECT.md explicitly scopes this milestone to the four phases above with no deferred backlog.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Any change to existing text, copy, images, or links | Explicit user requirement — content preservation |
| Any change to site structure, layout, or routes | Explicit user requirement — structure preservation |
| Three-way theme toggle (System/Light/Dark) | Explicitly scoped to a binary toggle defaulting to system preference |
| Additional languages beyond PT-BR/EN | Not requested; would be scope creep once i18n infra exists |
| Additional themes beyond light/dark | Not requested |
| Locale-prefixed routes / URL-based language or theme state | Would violate "no structure changes" |
| Language auto-detect banners / IP-geolocation detection | Unnecessary friction; `navigator.language` default is sufficient |
| Flags instead of text labels for language switcher | Flags conflate language with country; text avoids ambiguity |
| Combined single dropdown for theme + language | Decided to keep as two independent, adjacent header controls |
| `remix-i18next` / SSR middleware-based i18n | Requires React Router ^8 (incompatible with pinned 7.15.1); out of budget vs. plain `react-i18next` |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 1 | Complete |
| THEME-02 | Phase 1 | Complete |
| THEME-03 | Phase 1 | Complete |
| THEME-04 | Phase 1 | Complete |
| DARK-01 | Phase 2 | Complete |
| DARK-02 | Phase 2 | Complete |
| DARK-03 | Phase 2 | Complete |
| DARK-04 | Phase 2 | Complete |
| DARK-05 | Phase 2 | Complete |
| I18N-01 | Phase 3 | Complete |
| I18N-02 | Phase 3 | Complete |
| I18N-03 | Phase 3 | Complete |
| I18N-04 | Phase 3 | Complete |
| I18N-05 | Phase 3 | Complete |
| I18N-06 | Phase 3 | Complete |
| I18N-07 | Phase 3 | Complete |
| I18N-08 | Phase 3 | Complete |
| DOCS-01 | Phase 4 | Complete |
| DOCS-02 | Phase 4 | Complete |
| DOCS-03 | Phase 4 | Complete |

**Coverage:**

- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-06*
*Last updated: 2026-07-06 after initial definition*
