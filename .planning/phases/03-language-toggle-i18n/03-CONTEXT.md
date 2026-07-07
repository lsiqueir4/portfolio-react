# Phase 3: Language Toggle (i18n) - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a PT-BR/EN language toggle to the Header, backed by `react-i18next` + `i18next`, translating every user-facing string across Hero, AboutMe, Projects, Contacts, Header, and Footer — including array-literal content in `data.tsx` files (dates, status labels, descriptions), not just JSX strings. Default language on first visit follows the browser's `navigator.language`; a manual toggle choice persists across visits via localStorage, reusing the exact `usePersistedPreference` hook built in Phase 2 for the theme toggle. `document.documentElement.lang` updates to match. No SSR middleware (`remix-i18next` is incompatible with the pinned React Router 7.15.1) — the server and client must render the same fixed default language to avoid hydration mismatch, same constraint the theme toggle already satisfies via `getServerSnapshot`. This phase does NOT change any content, links, images, or site structure, and does NOT add languages beyond PT-BR/EN.

</domain>

<decisions>
## Implementation Decisions

### Reused Foundation (carried forward from Phase 2)
- **D-01:** The language toggle reuses `app/hooks/usePersistedPreference.ts` verbatim (same `useSyncExternalStore`-backed store pattern as `useTheme`) — new `storageKey` (distinct from `THEME_STORAGE_KEY`, e.g. a new `LANGUAGE_STORAGE_KEY` constant mirroring `app/constants/theme.ts`'s pattern), `validValues: ["pt", "en"]`, a `detectBrowserDefault()` based on `navigator.language`, and an `applySideEffect()` that sets `document.documentElement.lang` (and drives `i18next.changeLanguage`).
- **D-02:** No SSR middleware — `react-i18next` client-side only, matching the milestone-kickoff decision already locked in PROJECT.md. Server and client must render the same fixed default language on first paint (mirrors the theme toggle's `getServerSnapshot` no-flash-of-wrong-CSS-class approach); since text content can't be swapped invisibly like a CSS class, a one-time post-hydration language flash for non-default-language visitors is an accepted, unavoidable consequence of avoiding SSR middleware — same tradeoff class as DARK-05, just visible for text instead of only affecting colors.

### Toggle UI Pattern
- **D-03:** Two-label switcher — both "PT" and "EN" always visible side by side in the Header (next to `ThemeToggle`, both desktop and mobile menu placements, matching where `ThemeToggle` already renders), not a single flip-button. Clicking either label selects that language directly.
- **D-04:** The active language label is rendered in the purple accent color (`text-accent-hover`, matching the existing `HeaderButton` hover/active convention already used elsewhere in Header); the inactive label uses the existing muted-text convention (`text-muted`).

### Non-PT/EN Browser Fallback
- **D-05:** When `navigator.language` is neither Portuguese (`pt*`) nor English (`en*`) — e.g. French, German, Japanese — the site defaults to **EN**, not PT-BR. User explicitly chose broader-reach English over site-native Portuguese for unrecognized locales.

### Claude's Discretion
User explicitly deferred the following to Claude's discretion during planning/research:
- **Translation content structure for `data.tsx` arrays:** How array-literal content (project descriptions, experience entries, tech lists, dates like "Fev 2022"/"Feb 2022", status labels like "Em andamento"/"In progress") is organized — i18next keys resolved per entry vs. locale-keyed data objects vs. another structure. Pick whichever best fits `react-i18next` conventions for this array-heavy content; the AboutMe/Projects/Hero `data.tsx` files (camelCase plural exports: `experiences`, `projects`, `techs`) are the concrete shape to design around.
- **Exact SSR fixed-default language value:** Not explicitly reconfirmed in discussion (user chose not to discuss this specific sub-question when selecting gray areas), but the current site content is written in Portuguese and `PROJECT.md`/`REQUIREMENTS.md` treat PT-BR as the site's native/default language throughout. Strong signal: the SSR-rendered fixed default (i.e., `getServerSnapshot()` return value, analogous to `useTheme`'s server snapshot) should be **PT-BR**, with the client then swapping to the browser-detected/persisted language post-hydration per D-02's accepted flash. Confirm this assumption is still correct during planning if it materially changes the approach.
- Exact locale-matching precision (e.g., whether `pt-PT` maps to the same PT-BR translation set as `pt-BR`, whether `en-GB`/`en-AU` all map to the single EN set) — treat any `pt*`-prefixed locale as PT-BR and any `en*`-prefixed locale as EN; this is a pure technical detail, not a product decision.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — core value (no content/structure changes), 4-phase scope, key decisions log (locks `react-i18next`, no SSR middleware, localStorage + browser-signal-default pattern for both dark mode and language)
- `.planning/REQUIREMENTS.md` — I18N-01 through I18N-08 (this phase's requirements), plus the "Out of Scope" table (no locale-prefixed routes, no flags, no `remix-i18next`, no additional languages)
- `.planning/ROADMAP.md` — Phase 3 entry (goal, success criteria, `Depends on: Phase 2` for the persistence primitive)

### Prior Phase (persistence primitive to reuse)
- `.planning/phases/02-dark-mode-toggle/02-CONTEXT.md` — original design intent for the reusable detect→override→persist primitive
- `app/hooks/usePersistedPreference.ts` — the exact reusable hook (module-level `useSyncExternalStore` store, keyed by `storageKey`) this phase's language hook must reuse
- `app/hooks/useTheme.ts` — reference implementation showing how to wire `usePersistedPreference` for a new preference (mirror this shape for a new `useLanguage` hook)
- `app/constants/theme.ts` — pattern for a single shared storage-key constant importable by both the SSR blocking script and the client hook; mirror this for a new `app/constants/language.ts` (or similar) holding the language storage key
- `app/root.tsx` — `themeInitScript` shows the SSR no-flash blocking-script pattern for theme; the `<html lang="en" suppressHydrationWarning>` here is currently a hardcoded stale value that I18N-05 requires becomes dynamic/correct
- `app/features/Header/index.tsx` — exact placement precedent (`<ThemeToggle />` appears once in the desktop `hidden md:flex` block and once in the standalone `md:hidden` block) — the language switcher follows the same dual-placement pattern
- `app/features/Header/ThemeToggle.tsx` — button styling conventions (`border-border-subtle/10`, hover states, `suppressHydrationWarning`) to visually pair with

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — naming patterns, Tailwind usage conventions, component/data file conventions
- `.planning/codebase/STRUCTURE.md` — feature-folder layout (`index.tsx`/`data.tsx`/`types.tsx`, no barrel files), `app/shared/` and `app/hooks/` locations, path alias `~/*`

### Data files requiring translation (I18N-06/I18N-07 — array-literal content, not just JSX)
- `app/features/Hero/data.tsx` — tech stack array
- `app/features/Projects/data.tsx` — projects array (descriptions, tech lists)
- `app/features/AboutMe/data.tsx` — experiences, education, courses (includes dates like "Fev 2022" and status labels like "Em andamento")
- `app/constants/index.tsx` — `CONTACTS` object (check for any translatable UI-adjacent strings vs. pure content/links that must stay unchanged per I18N-08)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/hooks/usePersistedPreference.ts` — generic preference-persistence hook, directly reusable for language (this is the whole point of DARK-05)
- `app/features/Header/ThemeToggle.tsx` — styling/interaction precedent for the new language switcher component

### Established Patterns
- Feature folders: `index.tsx` (component), `data.tsx` (static data), `types.tsx` (types) — no barrel files
- Shared cross-feature primitives live in `app/hooks/` (Phase 2 introduced this location) and `app/shared/` (Phase 1's `Button.tsx`/`Section.tsx`/`TechBadge.tsx`)
- Single shared storage-key constant pattern (`app/constants/theme.ts`) prevents SSR-script/client-hook key drift — mirror for language
- `useSyncExternalStore`-backed module-level store in `usePersistedPreference` ensures desktop + mobile toggle instances never desync across a breakpoint resize — the language switcher gets this for free by reusing the hook

### Integration Points
- New language switcher renders inside `app/features/Header/index.tsx`, immediately adjacent to `<ThemeToggle />` in both the desktop nav and mobile menu blocks
- `app/root.tsx`'s `Layout` component needs a similar SSR-safe pre-hydration mechanism for `<html lang="...">` (currently hardcoded `"en"`) — likely a parallel blocking script or a shared script factory with `themeInitScript`
- All feature components (`Hero`, `AboutMe`, `Projects`, `Contacts`, `Header`, `Footer`) need `react-i18next`'s `useTranslation`/`t()` wired into their JSX render paths

</code_context>

<specifics>
## Specific Ideas

No further specific visual references beyond what's captured in Decisions — the two-label "PT | EN" switcher styling should visually pair with (not duplicate) `ThemeToggle`'s existing border/hover treatment.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 3-Language Toggle (i18n)*
*Context gathered: 2026-07-07*
