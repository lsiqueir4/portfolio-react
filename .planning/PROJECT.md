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

### Active

- [ ] Centralize theme/color tokens (currently scattered `purple-400/500`, `zinc-300/400/900/950`, `gray-950` utility classes across Header, Hero, AboutMe, Projects, Contacts, Footer, TechBadge) and reduce duplicated component patterns
- [ ] Add a dark/light mode toggle in the Header — defaults to the browser's `prefers-color-scheme`, remembers a manual toggle via localStorage on future visits, keeps the existing purple accent as the identity color in both modes (only background/text invert for light mode)
- [ ] Add a PT-BR/EN language toggle next to the dark mode toggle in the Header, using `react-i18next` — defaults to the browser's language, remembers a manual toggle via localStorage on future visits
- [ ] Rewrite the README as two files: `README.md` (PT-BR) and `README.en.md` (EN), each highlighting features and the tech stack, cross-linked to switch language

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
| Use `react-i18next` for i18n | User chose library approach over custom Context solution for robustness and future expandability | — Pending |
| Dark mode & language choice persist via localStorage, default to browser preference (`prefers-color-scheme` / `navigator.language`) | User wants a manual override to stick across visits, falling back to system/browser default when no choice was made | — Pending |
| Keep purple as accent color, invert background/text for light mode | Preserve existing visual identity while adding a light theme | — Pending |
| Phase 1 CSS scope includes both color tokens and repeated component patterns (not just colors) | User chose the broader scope to meaningfully reduce duplication | — Pending |
| Bilingual README as separate files (`README.md` PT-BR, `README.en.md` EN) with cross-links | Common open-source convention | — Pending |

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
*Last updated: 2026-07-06 after initialization*
