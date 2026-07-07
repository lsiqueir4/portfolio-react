# Portfolio — Theming, Dark Mode, i18n & README Refresh

## What This Is

A personal portfolio site for Leandro Siqueira (React 19 + React Router 7 + TypeScript + Tailwind CSS 4), with Hero, About Me, Projects, Contacts, Header, and Footer sections. This milestone tackles the backlog already noted in the project's README: standardize the theme/colors, add dark mode, and add English language support — plus a bilingual README rewrite.

## Core Value

Ship these visual and technical improvements (theme centralization, dark mode, PT-BR/EN language switch, bilingual README) without changing any existing content, copy, links, images, or site structure.

## Requirements

### Validated

- ✓ Displays Hero, About Me, Projects, and Contacts sections — existing
- ✓ Contact links (email, GitHub, LinkedIn, WhatsApp, CV download) — existing
- ✓ Built with React 19, React Router 7 (SSR), TypeScript, Tailwind CSS 4 — existing
- ✓ Centralized theme/color tokens: 8 semantic tokens (`surface`, `surface-elevated`, `on-surface`, `muted`, `muted-hover`, `accent`, `accent-hover`, `border-subtle`) replace all hardcoded `purple-*`/`zinc-*`/`gray-*` classes across every feature folder; shared `Section`/`Button` components de-duplicate repeated patterns; Tailwind v4 `@custom-variant dark` mechanism wired — Validated in Phase 1 (theme-css-token-centralization)
- ✓ Dark/light mode toggle in the Header — defaults to the browser's `prefers-color-scheme`, persists a manual toggle via localStorage (overrides OS default), applies before first paint with no flash, keeps the purple accent identity in both modes, reusable `usePersistedPreference` primitive ships for Phase 3 reuse — Validated in Phase 2 (dark-mode-toggle)
- ✓ PT-BR/EN language toggle in the Header, using `react-i18next` — defaults to the browser's language (`navigator.language`, non-pt/en falls back to EN), persists a manual toggle via localStorage (reuses the Phase 2 `usePersistedPreference` primitive), updates `document.documentElement.lang`, and translates every user-facing string 1:1 (Header, Hero, Contacts, Footer, Projects, AboutMe) with no change to content, links, or images — Validated in Phase 3 (language-toggle-i18n)
- ✓ Bilingual README: `README.md` (PT-BR, rewritten) and `README.en.md` (EN, new) with a top-of-file cross-link banner, Live Demo link, Features/Tech Stack/Getting Started/Project Structure/License sections, and a root-level MIT `LICENSE` — Validated in Phase 4 (bilingual-readme)

### Active

_None — all milestone requirements validated._

### Out of Scope

- Changing any existing text, copy, images, or links — explicitly preserved per user instruction
- Changing the site's structure/layout — explicitly preserved per user instruction
- Additional languages beyond PT-BR/EN — not requested
- Additional themes beyond light/dark — not requested

## Context

- Codebase already mapped in `.planning/codebase/` (STACK.md, ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, INTEGRATIONS.md, CONCERNS.md)
- `app/app.css` currently only defines a font token (`--font-sans`); there is no existing color/theme token system — colors are hardcoded Tailwind utility classes repeated across every feature folder
- The project's own README TODO list already named this exact scope (theme standardization, dark mode, English support) — this milestone closes that backlog
- Four phases, in this order (each depends conceptually on the last for a clean base, though dark mode and i18n are independent of each other):
  1. Theme/CSS centralization + de-duplication
  2. Dark mode toggle (header)
  3. PT-BR/EN language toggle (header), via react-i18next
  4. Bilingual README rewrite (README.md + README.en.md)

## Constraints

- **Content preservation**: No changes to text, images, or links — user explicit requirement
- **Structure preservation**: No changes to site structure/layout/routes — user explicit requirement
- **Tech stack**: Stay within React 19 / React Router 7 / TypeScript / Tailwind CSS 4; only new dependency expected is `react-i18next` (+ `i18next`) for phase 3
- **Visual identity**: Purple accent color must remain the primary accent in both light and dark themes

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use `react-i18next` for i18n | User chose library approach over custom Context solution for robustness and future expandability | ✓ Validated in Phase 3 |
| Dark mode & language choice persist via localStorage, default to browser preference (`prefers-color-scheme` / `navigator.language`) | User wants a manual override to stick across visits, falling back to system/browser default when no choice was made | ✓ Validated in Phase 2 (dark mode) and Phase 3 (language, reusing the same `usePersistedPreference` primitive) |
| Keep purple as accent color, invert background/text for light mode | Preserve existing visual identity while adding a light theme | ✓ Validated in Phase 2 |
| Phase 1 CSS scope includes both color tokens and repeated component patterns (not just colors) | User chose the broader scope to meaningfully reduce duplication | ✓ Validated in Phase 1 |
| Locked 7-token set amended to 8 tokens (added `muted-hover`) | Code review found the 7-token mapping silently killed a real hover-state color change on Contacts cards (THEME-04 violation); user approved adding a token to restore it | ✓ Validated in Phase 1 |
| SSR renders a fixed default language ("pt") on server and client; the detected/persisted language applies post-hydration | Avoids a hydration text mismatch; accepted one-time language flash for non-default-locale visitors is a deliberate tradeoff | ✓ Validated in Phase 3 |
| Bilingual README as separate files (`README.md` PT-BR, `README.en.md` EN) with cross-links | Common open-source convention | ✓ Validated in Phase 4 |
| UI-adjacent strings in data files (dates, status labels like "Fev 2022", "Em andamento") ARE translated in EN, not treated as fixed content | These are UI elements, not factual content (company names, descriptions) — user confirmed during requirements research | ✓ Validated in Phase 3 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-07 after Phase 4 (bilingual-readme) completion — all 4 milestone phases complete*
