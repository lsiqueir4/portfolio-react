# Architecture Research

**Domain:** Theme (dark/light) + i18n (PT-BR/EN) state architecture for a React Router 7 SSR portfolio
**Researched:** 2026-07-06
**Confidence:** MEDIUM (patterns are well-established web/framework conventions, cross-checked across multiple sources; the specific codebase wiring below is derived directly from this repo's own `root.tsx`/`react-router.config.ts`, so HIGH confidence on the codebase-specific parts, MEDIUM on general SSR-theming/i18n best practice)

## Correction to prior codebase docs

`.planning/codebase/ARCHITECTURE.md` states "Client-only: No server-side rendering. Everything rendered in browser after hydration." **This is stale/incorrect.** `react-router.config.ts` has `ssr: true` (the default), and `package.json` ships `@react-router/serve` / `react-router-serve ./build/server/index.js` as the `start` script. This is a **real SSR framework app**: every request is rendered to HTML on the server first, then hydrated in the browser. This distinction is the crux of this research — it is *why* theme/language flash-prevention needs deliberate handling instead of "just use React state."

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  app/root.tsx  →  Layout({children})                             │
│  <html suppressHydrationWarning>                                 │
│    <head>                                                         │
│      <script> theme-init (blocking, sync, pre-paint) </script>   │  ← determines initial
│      <Meta/><Links/>                                             │     dark/light class
│    </head>                                                        │     with zero flash
│    <body>                                                         │
│      <ThemeProvider>            (new: app/providers/theme.tsx)   │
│        <I18nextProvider i18n>   (new: app/providers/i18n.ts)     │
│          {children}  ← either <App/> or <ErrorBoundary/>         │
│        </I18nextProvider>                                        │
│      </ThemeProvider>                                             │
│      <ScrollRestoration/><Scripts/>                               │
│    </body>                                                        │
│  </html>                                                          │
├─────────────────────────────────────────────────────────────────┤
│  App (default export)  →  <Header/><Outlet/>                     │
│    Header: reads useTheme() + useTranslation() → renders 2 toggle │
│    buttons (existing mobile-menu state untouched)                 │
├─────────────────────────────────────────────────────────────────┤
│  Feature layer (unchanged folders): Hero, Projects, AboutMe,      │
│  Contacts, Footer — each adds `useTranslation()` for copy, and    │
│  swaps hardcoded Tailwind color utilities for new semantic tokens │
│  (`bg-surface`, `text-on-surface`, `text-accent`, …) — no folder  │
│  restructuring required                                           │
├─────────────────────────────────────────────────────────────────┤
│  app/app.css:  @theme tokens (semantic color vars) +              │
│  @custom-variant dark (&:where(.dark, .dark *));  +               │
│  .dark { …token overrides… }  +  @media(prefers-color-scheme)     │
│  fallback for the zero-JS default                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/providers/theme.ts` (inline script source, exported as a string) | Runs before paint on the client; reads `localStorage.getItem('theme')`, falls back to `matchMedia('(prefers-color-scheme: dark)')`; sets `classList` on `document.documentElement` | Small vanilla-JS string injected via `<script dangerouslySetInnerHTML>` in `Layout`'s `<head>` — must NOT depend on React/any bundled module (runs pre-hydration) |
| `app/providers/ThemeProvider.tsx` | React Context exposing `{ theme, toggleTheme }`; lazy-initializes state by reading the DOM class already set by the inline script; syncs `classList` + `localStorage` on change | Context + `useState(() => document.documentElement.classList.contains("dark"))` + `useEffect` |
| `app/providers/i18n.ts` | i18next instance configuration (`initReactI18next`, resources, fallback language, no backend needed — resources bundled at build time) | `i18next.init({...})`, exported singleton instance |
| `app/locales/en.ts`, `app/locales/pt.ts` | Centralized translation strings (single source of truth, mirrors existing `app/constants/index.tsx` pattern for `CONTACTS`) | Typed nested objects, one per language, imported into `i18n.ts`'s `resources` |
| `Header` (existing) | Add two toggle buttons (theme sun/moon, language PT/EN flag or text) alongside existing nav/mobile-menu `useState` | Consumes `useTheme()` and `useTranslation()` |
| Every feature `index.tsx` (Hero, Projects, AboutMe, Contacts, Footer, TechBadge) | Replace hardcoded copy strings with `t("key")` calls; replace hardcoded `purple-*/zinc-*/gray-*` utilities with semantic token utilities | No structural change — same files, same `data.tsx`/`types.tsx` split |

## Recommended Project Structure

```
app/
├── root.tsx                    # Layout gains: suppressHydrationWarning, inline theme
│                                #   script, ThemeProvider + I18nextProvider wrapping
│                                #   {children} (covers both App and ErrorBoundary)
├── app.css                     # @theme semantic color tokens + @custom-variant dark
│                                #   + .dark override block (see Patterns below)
├── providers/                  # NEW — cross-cutting app-level concerns (sibling to
│   │                           #   shared/ and constants/, same lowercase convention)
│   ├── theme-script.ts         # exported string constant, the pre-hydration blocking script
│   ├── ThemeProvider.tsx       # Context + useTheme() hook
│   └── i18n.ts                 # i18next.init(...) singleton, imports app/locales/*
├── locales/                    # NEW — centralized translation strings
│   ├── en.ts
│   └── pt.ts
├── features/                   # UNCHANGED folder set: Header, Hero, Projects,
│   │                           #   AboutMe, Contacts, Footer — each file gains
│   │                           #   useTranslation() calls + semantic token classNames
│   └── ...
├── shared/
│   └── TechBadge.tsx           # UNCHANGED location; gains semantic token classNames
└── constants/
    └── index.tsx               # UNCHANGED (CONTACTS is not translatable content)
```

### Structure Rationale

- **`app/providers/`:** New top-level directory, not nested under `features/` or `shared/`, because theme/language are cross-cutting app-level concerns that must be wired at `root.tsx`, not scoped to one feature. Naming follows the existing lowercase convention used by `shared/`/`constants/`/`assets/` (feature dirs are PascalCase; cross-cutting infra dirs are lowercase) — this is a one-word addition to an established pattern, not a new pattern.
- **`app/locales/`:** Mirrors the existing "Constants Export" idiom (`app/constants/index.tsx` → single source of truth for `CONTACTS`) applied to copy. Keeping translations in two flat files (not one per feature) makes it trivial to spot missing keys between languages and matches i18next's namespace model without over-engineering multiple namespaces for a single-page site.
- **No changes inside `app/features/*`:** Each feature file only adds a `useTranslation()` hook call and swaps class names — this satisfies the "no restructuring" constraint from PROJECT.md while still touching every file for the Phase 1 de-duplication work already planned.

## Architectural Patterns

### Pattern 1: Semantic Tailwind v4 `@theme` tokens, not a JS color constants file

**What:** Define theme colors as CSS custom properties inside `@theme` (which Tailwind v4 auto-generates utility classes from any `--color-*` variable), then override those same variable names inside a `.dark { }` block. Components then use `bg-surface`, `text-on-surface`, `text-accent`, `border-subtle`, etc. instead of raw `zinc-950`/`gray-950`/`purple-500`.

**When to use:** This is the correct choice for this project specifically because Tailwind CSS v4 already owns the styling layer everywhere (100% utility classes, no CSS-in-JS, no separate design-token library). A parallel "shared constants file" of color strings would either (a) require string-interpolating classNames at runtime (defeats Tailwind's static extraction, adds bundle/runtime cost, breaks IntelliSense) or (b) be redundant with what `@theme` already does natively.

**Trade-offs:** Requires touching every feature file once to swap `bg-gray-950``bg-surface` etc. (this is exactly the Phase 1 scope already planned — "reduce duplicated component patterns"). Upside: dark mode then requires **zero conditional className logic** anywhere in components (`dark ? "bg-zinc-950" : "bg-white"` ternaries are never needed) — toggling `.dark` on `<html>` is enough because the CSS variables flip.

**Example:**
```css
/* app/app.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif, ...;

  /* light-mode defaults */
  --color-surface: var(--color-white);
  --color-surface-elevated: var(--color-zinc-100);
  --color-on-surface: var(--color-zinc-900);
  --color-muted: var(--color-zinc-500);
  --color-accent: var(--color-purple-500);   /* same value both modes */
  --color-accent-hover: var(--color-purple-400);
}

.dark {
  --color-surface: var(--color-gray-950);
  --color-surface-elevated: var(--color-zinc-900);
  --color-on-surface: var(--color-white);
  --color-muted: var(--color-zinc-400);
  /* --color-accent unchanged: purple stays the identity color in both modes */
}

html, body {
  @apply bg-surface text-on-surface font-sans;
}
```
Components then write `className="bg-surface-elevated text-muted"` instead of `className="bg-zinc-900 text-zinc-400"`.

### Pattern 2: Inline pre-hydration blocking script for theme (no dependency needed)

**What:** A small vanilla-JS `<script>` placed in `<head>`, before body content is parsed, that reads `localStorage` then falls back to `matchMedia`, and synchronously sets the `dark` class on `document.documentElement` — before React ever runs. `<html>` needs `suppressHydrationWarning` because its `class` attribute is mutated outside of React's own render.

**When to use:** Any time an app is truly SSR (this one is, `ssr: true`) and theme choice depends on client-only signals (`localStorage`, `matchMedia`) that the server cannot see. Without this, the server always renders one theme and the client flips a moment later — the classic FOUC ("flash of incorrect theme").

**Trade-offs:** This is the same technique the `next-themes` library packages up, but it's ~15 lines of vanilla JS — no new dependency needed (`next-themes` is Next.js-flavored anyway and not a natural fit here). Must stay dependency-free and pre-ES2022-safe since it runs before any bundle/transpilation guarantees apply to it specifically (it's injected as a raw string, not processed by Vite).

**Example:**
```tsx
// app/providers/theme-script.ts
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();`;
```
```tsx
// app/root.tsx (Layout)
<head>
  <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
  <Meta />
  <Links />
</head>
```

### Pattern 3: Providers wrap `{children}` inside `Layout`, not inside `App`

**What:** `ThemeProvider` and `I18nextProvider` are declared inside the `Layout` component (which owns `<html>/<head>/<body>`), wrapping `{children}` — not inside the default-exported `App` component (which only renders `<Header/><Outlet/>`).

**When to use:** Always, in this codebase's specific `root.tsx` shape. React Router 7's `Layout` export exists precisely to keep a consistent document shell across **both** the normal route tree (`App`) and the `ErrorBoundary` — RR7 renders whichever of the two as `Layout`'s `children`. If providers were placed inside `App` instead, error pages would render with no theme/language context at all (broken 404/error page dark mode). Because Context Providers render no DOM themselves, wrapping `{children}` inside `<body>` does not disturb `<html>` being the outermost DOM node.

**Trade-offs:** None significant — this is a strictly better placement than wrapping inside `App`, at zero extra cost. One consequence: don't try to make `<html lang="...">` itself reactive by having `Layout` call `useTranslation()` directly (it would need a wrapper/consumer split since `Layout` is the ancestor establishing the provider, not a descendant of it). Simpler fix: update `document.documentElement.lang` via a plain `useEffect` inside `ThemeProvider`/a small `LanguageEffect` component nested under the providers — this is an attribute mutation, not visible text, so it doesn't need pre-paint blocking treatment like the theme class does.

## Data Flow

### Theme: SSR-safe initial state, then client sync

```
Request (no cookies read — localStorage only, per PROJECT.md decision)
    ↓
Server renders HTML with NO explicit `dark` class.
CSS `@media (prefers-color-scheme: dark)` fallback inside .dark-equivalent
rules means OS-dark users still get correct *first-paint* colors via
pure CSS, zero JS, for anyone who never set a manual override.
    ↓
Browser parses <head>, hits blocking <script> BEFORE paint:
  reads localStorage('theme') → present? apply explicit class.
  absent? matchMedia() already agrees with the CSS media-query fallback,
  so no visible change either way. Zero flash in both cases.
    ↓
React hydrates. ThemeProvider's useState lazy-initializer reads
document.documentElement.classList (already correct) — client-render
does not fight what's already painted.
    ↓
User clicks toggle in Header → setTheme() → classList + localStorage
updated → CSS variables flip instantly (no re-render of feature
components needed; they never held theme-derived classNames, only
semantic classNames).
```

### Language: SSR-safe default, then post-mount client swap (accepted trade-off)

```
Server always renders a FIXED default language (e.g. pt for this
portfolio's native copy) — no cookie/header detection, per PROJECT.md's
explicit choice to keep the only new dependency as react-i18next itself
(not remix-i18next + RR7 middleware).
    ↓
Client hydrates with the SAME fixed default — no hydration mismatch,
because the mismatch (if any) happens AFTER mount, not during
reconciliation.
    ↓
useEffect (client-only, runs once after mount) reads
localStorage('lang'), falls back to navigator.language, calls
i18n.changeLanguage(detected) if different from the default.
    ↓
This triggers ONE visible content swap on first visit for users whose
detected language differs from the server default. This is a KNOWN,
ACCEPTED trade-off for this project's scale (personal portfolio, not
a high-traffic SEO-sensitive product) — see "Anti-Patterns" and
"Gaps" below for the zero-flash alternative and why it's deferred.
    ↓
User clicks toggle in Header → i18n.changeLanguage(lang) + localStorage
write → all useTranslation() consumers re-render with new strings.
```

### Key Data Flows

1. **Theme propagation:** `ThemeProvider` → DOM `classList` + CSS variables (NOT React props/context re-renders driving feature component classNames — components use static semantic classNames like `bg-surface` that resolve differently depending on the ambient `.dark` class).
2. **Language propagation:** `i18next` singleton → `useTranslation()` hook in each feature component → re-render with new string values on `changeLanguage()`. This IS a standard React re-render flow (unlike theme), because translated text must actually change, not just a CSS variable.

## Scaling Considerations

Not meaningfully applicable — this is a static single-route personal portfolio (confirmed: "Single route: Only one route (`/`)" per `.planning/codebase/ARCHITECTURE.md`). No scaling tiers needed. The only "scale" axis relevant here is maintainability as more sections/languages are potentially added later — the centralized `app/locales/*` and `@theme` token approach already scales to that (add a `fr.ts` locale file, or add a new semantic token) without touching component structure.

## Anti-Patterns

### Anti-Pattern 1: Deciding theme via `useEffect` + `useState` alone (no inline script)

**What people do:** `const [dark, setDark] = useState(false); useEffect(() => { setDark(matchMedia(...).matches) }, [])`.
**Why it's wrong:** Under `ssr: true`, this guarantees a flash — server always renders `false` (light), client re-renders to `true` a tick after hydration for the ~50% of users whose OS/localStorage says dark. This is the single most common dark-mode SSR mistake.
**Do this instead:** Pattern 2 above (blocking inline script + CSS-variable class toggle) — the DOM is already correct before React ever touches it.

### Anti-Pattern 2: Per-component `dark ? "bg-x" : "bg-y"` ternaries

**What people do:** Keep hardcoded Tailwind color utilities and branch on a `theme` value read from context in every component.
**Why it's wrong:** Directly contradicts the Phase 1 goal ("centralize theme/color tokens... reduce duplicated component patterns"). Also forces every themed component to re-render on toggle (unnecessary work) instead of letting CSS variables do it for free.
**Do this instead:** Pattern 1 — semantic Tailwind tokens driven by the ambient `.dark` class; components never need to know the current theme to render correct colors, only to render the *toggle button itself* (which does need `useTheme()` to show sun/moon icon state).

### Anti-Pattern 3: Full `remix-i18next` + RR7 middleware for a personal portfolio

**What people do (and what's "more correct" in the abstract):** Adopt `remix-i18next`'s per-request cookie/`Accept-Language` middleware (`createI18nextMiddleware`, requires RR ≥7.3.0, "unstable" API) to get zero-flash, fully SSR-rendered translated content from the first byte.
**Why it's not right here:** PROJECT.md explicitly scopes the only new dependency to `react-i18next` (+`i18next`) and explicitly chose localStorage + browser-language defaulting (client-side) over a more robust but heavier cookie/middleware approach. Adding `remix-i18next` would mean depending on an explicitly "unstable" React Router middleware API for a low-traffic personal site — disproportionate complexity for the value gained (one avoided content-swap on first visit).
**Do this instead:** Accept the documented one-time post-mount content swap (see Data Flow above) as the pragmatic default. Flag it in Phase 3 planning as a known limitation, not a bug — and note `remix-i18next` as the documented escalation path if the flash becomes a real user complaint later.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `react-i18next` / `i18next` | `initReactI18next` + bundled resources (no HTTP backend, no `i18next-http-backend`) | Resources compiled into the JS bundle at build time from `app/locales/{en,pt}.ts` — no runtime fetch, no added network waterfall |
| Browser `localStorage` | Read/write for both `theme` and `lang` preferences | Both providers should use distinct, namespaced keys (e.g. `portfolio:theme`, `portfolio:lang`) to avoid collisions |
| Browser `matchMedia('(prefers-color-scheme: dark)')` | Theme default detection | Already partially covered for free by the CSS `@media` fallback even without the JS read |
| Browser `navigator.language` | Language default detection | Client-only API; only usable inside `useEffect`, never during SSR render |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `root.tsx` (`Layout`) ↔ `app/providers/*` | Direct import + JSX composition | `Layout` is the sole integration point; no feature file imports providers directly except via hooks |
| `Header` ↔ `ThemeProvider`/`i18next` | `useTheme()` / `useTranslation()` hooks | Only place with two new toggle buttons; existing `useState` mobile-menu logic untouched |
| Feature components ↔ `app/locales/*` | Indirect, via `useTranslation()` — never import locale files directly | Keeps feature files decoupled from the specific language-resource shape |
| Feature components ↔ `app/app.css` tokens | Indirect, via Tailwind utility classNames (`bg-surface`, etc.) | No component imports CSS variables directly; Tailwind's `@theme` mechanism is the only integration surface |

## Build Order Assessment (responding directly to the stated 4-phase plan)

**Stated order:** (1) Theme/CSS centralization + de-dup → (2) Dark mode toggle → (3) i18n toggle → (4) Bilingual README.

**Verdict: Confirmed, with one refinement.**

1. **Phase 1 → Phase 2 dependency is real and correctly ordered.** Dark mode toggle *cannot* be built cleanly without semantic tokens already in place (Pattern 1) — attempting them together would mean redoing every className twice. Phase 1 should ship the `@theme`/`.dark`/`@custom-variant` CSS scaffolding and the token rename across all feature files, but **not yet** the JS toggle/localStorage logic — this gives a clean, verifiable checkpoint: after Phase 1, toggling the OS-level `prefers-color-scheme` setting in browser devtools should already correctly invert all colors with zero JS, proving the tokens are wired correctly before Phase 2 adds the manual override complexity (inline script, Context, localStorage).

2. **Phase 2 → Phase 3 are architecturally independent** (i18n doesn't touch colors at all) — the stated order is fine as parallelizable-in-principle, but there IS a reuse opportunity worth noting for planning: both toggles share the identical shape of "detect default → allow manual override → persist to localStorage → expose via Header." **Refinement:** have Phase 2 produce a small generic primitive (e.g. `usePersistedPreference(key, detectDefault)` hook, or at minimum a documented pattern) in `app/providers/`, so Phase 3's language persistence logic reuses it instead of re-deriving the same localStorage-sync logic from scratch. This is a scope note for the Phase 2 plan, not a reordering.

3. **Phase 3 (i18n) has one architecturally significant open decision the roadmap should surface explicitly:** given `ssr:true`, pure client-side language detection (the PROJECT.md-decided approach) will cause a one-time post-mount content swap for non-default-language users on first visit (see Data Flow above). This is a legitimate, low-stakes trade-off for this project's scale, but it should be a conscious, documented decision at Phase 3 kickoff (not discovered mid-implementation) — the roadmap should flag Phase 3 as "standard i18n wiring, but confirm the accepted-flash trade-off before starting."

4. **Phase 4 (README) has no architectural dependency on 1–3** beyond needing the final tech stack list (e.g., confirming `react-i18next` was actually added) — correctly last, no changes needed to this ordering.

**Net: order is sound. Recommended micro-adjustment:** split Phase 1 into "CSS tokens + component de-dup" (no JS) as originally scoped, and treat "shared persisted-preference primitive" as a Phase 2 deliverable that Phase 3 explicitly reuses — call this out in the roadmap phase descriptions so Phase 3's estimate accounts for reuse rather than net-new work.

## Sources

- [Tailwind CSS official docs — Dark Mode](https://tailwindcss.com/docs/dark-mode) (MEDIUM confidence, cross-checked)
- [Flexible Dark Mode with Tailwind CSS v4 Custom Variants — schoen.world](https://schoen.world/n/tailwind-dark-mode-custom-variant) (MEDIUM)
- [next-themes — GitHub (pacocoursey)](https://github.com/pacocoursey/next-themes) (MEDIUM — canonical reference implementation of the blocking-script pattern)
- [Fixing dark mode flickering (FOUC) — notanumber.in](https://www.notanumber.in/blog/fixing-react-dark-mode-flickering) (MEDIUM)
- [remix-i18next — GitHub (sergiodxa)](https://github.com/sergiodxa/remix-i18next) (MEDIUM — confirms v7.x targets RR7 framework mode + SSR specifically via unstable middleware)
- [How to internationalize a React Router v7 app with remix-i18next — Locize Blog](https://www.locize.com/blog/react-router-i18next) (MEDIUM)
- [react-i18next SSR documentation](https://react.i18next.com/latest/ssr) (MEDIUM)
- Direct inspection of this repo: `react-router.config.ts` (`ssr: true`), `package.json` (`@react-router/serve`), `app/root.tsx`, `app/app.css` (HIGH — primary source, not web research)

---
*Architecture research for: Theme/i18n state architecture, React Router 7 SSR portfolio*
*Researched: 2026-07-06*
