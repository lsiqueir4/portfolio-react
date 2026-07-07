# Phase 2: Dark Mode Toggle - Research

**Researched:** 2026-07-07
**Domain:** SSR-safe theme toggling (React Router 7 framework mode), Tailwind CSS v4 class-based dark mode, WCAG AA color contrast
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Token Foundation (carried forward from Phase 1)**
- **D-01:** The 8 semantic tokens (`surface`, `surface-elevated`, `on-surface`, `muted`, `muted-hover`, `accent`, `accent-hover`, `border-subtle`) and the `@custom-variant dark (&:where(.dark, .dark *));` directive already exist in `app/app.css` (Phase 1). This phase adds the `.dark { }` override block with light-mode values and the toggle UI that flips the `.dark` class on `<html>`. *(Note: this research finds the value-inversion direction implied by this phrasing needs correction — see Pitfall 1. The intent — a `.dark {}` block plus new light-mode values existing somewhere in `app.css` — is preserved; only which selector holds which theme's hex values is corrected.)*

### Claude's Discretion

User was offered three gray areas (light-mode palette values, toggle transition/animation feel, and toggle icon/placement) and explicitly declined discussion, choosing to leave all three as implementation details for Claude to decide during planning/research:
- **Light-mode palette values:** The actual light-mode color values each token resolves to. Must satisfy DARK-04 (purple accent stays primary/identical in both themes; only background/text tokens invert). Research should ground this in accessible contrast ratios against the existing purple accent. *(Addressed in Standard Stack / Common Pitfalls / Open Questions below.)*
- **Toggle transition feel:** Whether theme switching is an instant snap or an animated color transition, and whether the sun/moon icon itself animates (rotate/cross-fade) or swaps instantly. *(Addressed in Architecture Patterns / Pattern 2 and Code Examples below — recommend animated rotate/scale cross-fade, consistent with existing `transition-all duration-300` convention already used throughout Header.)*
- **Toggle icon & placement:** Confirmed `lucide-react` is already the icon library in use in Header — a `Sun`/`Moon` icon pair from the same library is the natural fit. Exact position in the desktop nav bar and treatment in the mobile menu are left to planning. *(Addressed in Code Examples below — recommend placing next to the mobile hamburger button, always visible, not hidden inside the collapsible panel; desktop placement alongside the "Contato"/CV button group.)*

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-------------------|
| DARK-01 | A dark/light toggle button exists in the Header — sun/moon icon, native `<button>`, `aria-label`, `aria-pressed` | Code Examples (`ThemeToggle` component); Architecture Patterns / Pattern 2 (CSS-only dual-icon, avoids hydration mismatch on the icon); Common Pitfalls / Pitfall 4 (`aria-pressed` hydration handling) |
| DARK-02 | Default theme on first visit follows the browser's `prefers-color-scheme`, with no flash of the wrong theme (SSR-safe) | Architecture Patterns / Pattern 1 (blocking inline script); System Architecture Diagram; Common Pitfalls / Pitfall 1 (token-selector direction, required for the script's class-toggle to have correct effect) |
| DARK-03 | A manual toggle choice persists across visits via localStorage, overriding the browser default on subsequent loads | Architecture Patterns / Pattern 3 (`usePersistedPreference`/`useTheme`); Common Pitfalls / Pitfall 2 (`color-scheme` must also respect the manual override, not just the media query) |
| DARK-04 | The purple accent color remains the primary accent in both light and dark themes — only background/text tokens invert | Common Pitfalls / Pitfall 3 (verified contrast math + recommended token treatment); Open Questions #1 (flags the one place this research's recommendation nuances a literal reading of this requirement) |
| DARK-05 | The persistence pattern (read localStorage → fall back to browser signal → allow override → persist) is built as a reusable primitive for Phase 3 to reuse for language | Architecture Patterns / Pattern 3 (generic `usePersistedPreference` core + theme-specific `useTheme` consumer); Recommended Project Structure (`app/hooks/` directory) |
</phase_requirements>

## Summary

This phase adds a manual dark/light toggle on top of infrastructure Phase 1 already built: 8 semantic CSS custom properties (`app/app.css`) and a compiled-but-unused `@custom-variant dark (&:where(.dark, .dark *));` directive. The critical discovery this research makes is that **the current `@theme` block's values ARE the dark-theme values, functioning today as the unconditional default** (the site has only ever had one look). Tailwind v4's class-based dark-mode convention is the reverse of that: the *undecorated* base tokens are conventionally the **light** theme, and a `.dark { }` block **overrides** them when `.dark` is present on `<html>`. Phase 2 must therefore invert the token block: write new light-mode hex values into `@theme`, and move the current (already human-signed-off, zero-regression) dark values verbatim into a new `.dark { }` rule. This is a rename-in-place of values, not a rewrite of consuming components — no component file needs to change.

The SSR-safe, no-flash pattern is a well-established, widely-documented technique (used by MUI, next-themes, remix-themes, shadcn/ui): a synchronous inline `<script>` in `<head>`, before `<Scripts />`, that reads `localStorage`, falls back to `matchMedia('(prefers-color-scheme: dark)')`, and toggles the `.dark` class on `document.documentElement` before first paint. Because React Router 7's root `Layout` component in `app/root.tsx` literally renders `<html>`, this script's DOM mutation happens outside what the server rendered, so `suppressHydrationWarning` is required on `<html>` (and, for the toggle button's `aria-pressed` value specifically, on the button itself) to avoid noisy hydration-mismatch console warnings — this is a warning-suppression concern only; it does not affect correctness or introduce a visible flash, because the script runs before paint.

The reusable "detect → override → persist" primitive (DARK-05) should be split into a framework-agnostic core (works with any enum-like preference, storage key, and browser-signal detector) and a thin theme-specific hook built on it — Phase 3's language toggle then supplies `navigator.language` as its detector and reuses the exact same core, satisfying the reusability requirement without over-engineering a plugin system.

**Primary recommendation:** Invert `app/app.css` so `@theme` holds new light-mode hex values and `.dark {}` holds the current (unchanged) dark-mode values; add a static (non-interpolated) inline blocking script in `app/root.tsx`'s `<head>` with `suppressHydrationWarning` on `<html>`; build the toggle button using the CSS-only dual-icon pattern (`Sun`/`Moon` from `lucide-react`, shown/hidden via `dark:` utility classes, not JS state) so the icon itself never needs a hydration guard; build the persistence logic as a generic `app/hooks/usePersistedPreference.ts` core consumed by a theme-specific `app/hooks/useTheme.ts`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| First-paint theme detection (no flash) | Browser / Client (pre-hydration script) | Frontend Server (SSR) renders the `<html>` shell the script mutates | Must run synchronously before paint; SSR cannot know the client's `localStorage`/OS preference, so it can only render a neutral shell for the script to correct instantly |
| Manual toggle + persistence | Browser / Client (React hook + `localStorage`) | — | No backend/session involved; `DARK-03` is explicitly client-only via `localStorage` |
| Theme token values (color) | Frontend Server / Client shared (CSS, compiled once) | — | `app/app.css` is compiled once by Vite/Tailwind and served to both SSR and client; no runtime tier distinction |
| Toggle button UI + a11y attributes | Browser / Client (React component) | — | `aria-pressed` reflects live client state; native `<button>` semantics are a client-rendered concern |
| Reusable persistence primitive (DARK-05) | Browser / Client (hook module) | — | Consumed identically by Phase 3's language hook; no server-side counterpart needed since both prefs are `localStorage`-only |

## Package Legitimacy Audit

**No new packages are installed in this phase.** The toggle uses `lucide-react` (already a direct dependency, confirmed installed at the exact `Sun`/`Moon` icon files below) and browser-native `localStorage`/`matchMedia` APIs. This audit exists to record that check, not to approve a new install.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|--------------|---------|-------------|
| `lucide-react` | npm | already installed, pinned `^1.17.0` in `package.json`, `1.23.0` present in `node_modules` [VERIFIED: local `node_modules/lucide-react/package.json`] | N/A (pre-existing dep, not a new install) | github.com/lucide-icons/lucide | OK | No action — already approved in Phase 1 |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

`Sun` and `Moon` icon modules exist locally: `node_modules/lucide-react/dist/esm/icons/sun.mjs` and `.../moon.mjs` [VERIFIED: local filesystem check].

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `lucide-react` | `^1.17.0` (installed `1.23.0`) [VERIFIED: package.json + node_modules] | `Sun` / `Moon` icons for the toggle button | Already the project's sole icon library (used in Header for `Download`, `Menu`, `Send`, `X`) — no reason to introduce a second icon set |

### Supporting
No new supporting libraries needed. The toggle, detection, and persistence logic are all implementable with browser-native `localStorage` and `window.matchMedia`, plus React 19's `useState`/`useEffect`/`useSyncExternalStore` primitives — no state-management or theming library (e.g. `next-themes`, `remix-themes`) is required or recommended.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled `useTheme` hook + blocking script | `remix-themes` npm package | `remix-themes` targets React Router's older loader-based session/cookie theme flow; this project has no loader/session layer and the requirement is `localStorage`-only (DARK-03), so the package adds a dependency and API surface (`ThemeProvider`, ` action` route) that solves a problem this project doesn't have. [ASSUMED — not independently verified against `remix-themes`'s current API in this session; if reconsidered, re-check its README against React Router 7.15 compatibility before adopting] |
| Dual always-rendered Sun/Moon icons toggled by CSS | Single icon swapped via JS conditional (`isDark ? <Moon/> : <Sun/>`) | The JS-conditional approach re-introduces a hydration-mismatch risk on the icon itself, because the correct icon can't be known during SSR. The CSS-only dual-icon approach (below) sidesteps this entirely. |

**Installation:**
No installation required — `lucide-react` is already a dependency.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ SERVER (React Router 7 SSR, request time)                          │
│  root.tsx Layout() renders:                                        │
│  <html suppressHydrationWarning>                                   │
│    <head>… <Meta/> <Links/> [BLOCKING SCRIPT TAG, static string]…  │
│    <body>{children}<Scripts/></body>                                │
│  → HTML sent to browser with NO theme class on <html> yet          │
│    (server has no access to the client's localStorage/OS setting)  │
└─────────────────────────────────────────────────────────────────────┘
                              │  HTML streamed to browser
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ BROWSER — before first paint                                       │
│  1. Blocking <script> in <head> executes synchronously:            │
│     read localStorage["theme"]                                     │
│       │ found & valid ("dark"|"light") ──────────────► use it       │
│       │ not found ──► matchMedia("(prefers-color-scheme: dark)")   │
│                         .matches ? "dark" : "light"                 │
│     → document.documentElement.classList.add/remove("dark")        │
│     → document.documentElement.style.colorScheme = value           │
│  2. Browser paints — CSS custom properties in .dark{} or @theme    │
│     base already resolve correctly. NO FLASH.                      │
└─────────────────────────────────────────────────────────────────────┘
                              │  React hydrates
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT (React 19 hydration + interaction)                           │
│  ThemeToggle button (app/features/Header):                          │
│   useTheme() hook (app/hooks/useTheme.ts)                            │
│     → reads CURRENT DOM state (already correct) as initial state,  │
│       does NOT re-run detection (avoids fighting the script)        │
│     → on click: toggle classList + localStorage.setItem +           │
│       setState (drives aria-pressed)                                 │
│   Icon shown via CSS only: <Sun class="dark:hidden"/>                │
│                            <Moon class="hidden dark:block"/>         │
│   usePersistedPreference() (app/hooks/usePersistedPreference.ts)     │
│     → generic core reused unmodified by Phase 3's useLanguage()      │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
app/
├── hooks/                          # NEW — first hooks directory in this codebase
│   ├── usePersistedPreference.ts   # generic detect→override→persist primitive (DARK-05)
│   └── useTheme.ts                 # theme-specific hook built on the primitive above
├── root.tsx                        # MODIFIED — add blocking script + suppressHydrationWarning
├── app.css                         # MODIFIED — invert @theme/.dark{} token values (see Common Pitfalls)
└── features/Header/
    ├── index.tsx                   # MODIFIED — render <ThemeToggle /> in desktop + mobile markup
    └── ThemeToggle.tsx             # NEW — sun/moon button, colocated with Header since it's Header-only UI
```

Rationale for `app/hooks/` as a new top-level directory (vs. cramming into `app/shared/`): `app/shared/` currently holds only presentational components (`Button.tsx`, `Section.tsx`, `TechBadge.tsx`); a stateful hook is a different kind of abstraction. Phase 3 will add `useLanguage.ts` to the same directory, so establishing `app/hooks/` now (rather than mixing hooks into `app/shared/`) keeps the convention clean for that phase. This is a discretionary structural choice, not a hard requirement — `app/shared/hooks/` is an equally valid alternative if the planner prefers one fewer top-level directory.

### Pattern 1: Static (non-interpolated) blocking script in `<head>`
**What:** A single `<script>` tag rendered by `Layout()` in `app/root.tsx`, placed inside `<head>` after `<Links />` and before the closing `</head>`, containing a fixed JS string (no template interpolation of any dynamic/user-controlled value) via `dangerouslySetInnerHTML`.
**When to use:** Any theme (or later, locale) decision that must be visually correct at first paint in an SSR app.
**Example:**
```tsx
// Source: pattern synthesized from MUI getInitColorSchemeScript / remix-themes
// PreventFlashOnWrongTheme / shadcn-ui mode-toggle docs [CITED: multiple, see Sources]
const THEME_STORAGE_KEY = "theme";

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var isDark = stored === "dark" || stored === "light"
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```
**Why the string must be static:** `dangerouslySetInnerHTML` with any dynamically interpolated, request- or user-influenced value is an XSS vector (see Security Domain below). The script above has zero interpolation — `THEME_STORAGE_KEY` is a compile-time constant, not a runtime variable — so it is safe to inline.

### Pattern 2: CSS-only dual-icon toggle (no icon hydration mismatch)
**What:** Render both `Sun` and `Moon` icons unconditionally; use Tailwind `dark:` utility classes (not JS state) to decide which is visible.
**When to use:** Any icon/visual whose "correct" appearance depends on the theme, when you want to avoid a mount-guard/`useEffect` flash pattern.
**Example:**
```tsx
// Source: shadcn-ui mode-toggle convention [CITED: github.com/shadcn-ui/next-template, seedflip.co/blog/shadcn-dark-mode-theming]
import { Sun, Moon } from "lucide-react";

<Sun
  size={18}
  className="rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
/>
<Moon
  size={18}
  className="absolute rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
/>
```
Because visibility/rotation is driven purely by the `.dark` class already present on `<html>` before hydration, there is nothing for React to get wrong here — no `useEffect`/mount-guard needed for the icon itself.

### Pattern 3: Generic persisted-preference primitive (DARK-05)
**What:** A hook factory that encapsulates "read storage → validate → fall back to a browser-signal detector → expose setter that persists."
**When to use:** Theme now; language in Phase 3 (swap the detector function and storage key only).
**Example:**
```typescript
// app/hooks/usePersistedPreference.ts
import { useState } from "react";

interface UsePersistedPreferenceOptions<T extends string> {
  storageKey: string;
  validValues: readonly T[];
  /** Only used if no valid stored value exists — e.g. matchMedia for theme, navigator.language for locale */
  detectBrowserDefault: () => T;
  /** Side effect to run whenever the value changes (e.g. toggle classList, set documentElement.lang) */
  applySideEffect: (value: T) => void;
}

export function usePersistedPreference<T extends string>({
  storageKey,
  validValues,
  detectBrowserDefault,
  applySideEffect,
}: UsePersistedPreferenceOptions<T>) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return detectBrowserDefault();
    const stored = window.localStorage.getItem(storageKey);
    if (stored && (validValues as readonly string[]).includes(stored)) {
      return stored as T;
    }
    return detectBrowserDefault();
  });

  function set(next: T) {
    setValue(next);
    window.localStorage.setItem(storageKey, next);
    applySideEffect(next);
  }

  return [value, set] as const;
}
```
```typescript
// app/hooks/useTheme.ts — theme-specific consumer of the primitive above
import { usePersistedPreference } from "./usePersistedPreference";

const THEME_VALUES = ["light", "dark"] as const;
type Theme = (typeof THEME_VALUES)[number];

function detectBrowserTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function useTheme() {
  return usePersistedPreference<Theme>({
    storageKey: "theme",
    validValues: THEME_VALUES,
    detectBrowserDefault: detectBrowserTheme,
    applySideEffect: applyTheme,
  });
}
```
**Important nuance (see Pitfall 3 below):** the initializer above re-derives from `localStorage`/`matchMedia` rather than reading the DOM class the blocking script already set. Because both the script and `detectBrowserTheme()` implement identical fallback logic, they will always agree — but if the planner changes one without the other, they will silently diverge. Consider extracting the exact detection logic into one shared, imported-by-both-script-and-hook utility (impossible for the truly static <head> script, which cannot import modules) — practically, keep the two implementations byte-for-byte in sync and comment each pointing at the other.

### Anti-Patterns to Avoid
- **JS-conditional icon rendering (`isDark ? <Moon/> : <Sun/>`):** Reintroduces a hydration-mismatch risk the CSS-only pattern (Pattern 2) avoids entirely.
- **Re-running theme detection inside a `useEffect` after mount:** Causes one extra render/repaint cycle after hydration (a "flash after mount," distinct from but often confused with the flash-before-paint problem DARK-02 targets). The blocking script already solved first-paint correctness; the hook should trust and read that state, not recompute it a second time.
- **Interpolating any dynamic value into the blocking script's `dangerouslySetInnerHTML` string:** Even though this phase's script has nothing to interpolate, this is the pattern to guard against if Phase 3 is tempted to inject a detected locale string into a similar script.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon set for sun/moon | Custom SVGs | `lucide-react`'s `Sun`/`Moon` | Already the project's icon library; consistent stroke width/sizing with `Download`/`Menu`/`Send`/`X` |
| Contrast ratio math | Ad-hoc "looks fine" color picking | The WCAG relative-luminance formula (verified via a one-off Node script this session, see Standard Stack/Common Pitfalls) or a contrast-checker tool before shipping | Purple accent color combinations are genuinely non-obvious at a glance — two of the "obvious" choices in this exact palette (`purple-400` text on white, `purple-600` bg with dark text) fail AA while very similar-looking alternatives pass |

**Key insight:** There is no framework/library gap to fill here — the entire feature is achievable with native browser APIs plus the existing Tailwind/CSS-variable architecture. The real risk is architectural direction (which selector holds which theme's values) and accessibility math, not tooling choice.

## Common Pitfalls

### Pitfall 1: Base `@theme` tokens and `.dark {}` selector direction (critical, must resolve during planning)
**What goes wrong:** Phase 1 left `app/app.css`'s `@theme` block holding the CURRENT (only ever) dark-mode hex values as the unconditional default, with zero `.dark {}` overrides yet defined. If Phase 2 naively adds `.dark { }` overrides containing NEW light-mode values (a literal reading of the Phase 2 CONTEXT.md phrasing "adds the `.dark {}` override block with light-mode values"), the result is backwards: `.dark` class present → light colors; no class → dark colors. That inverts the toggle's meaning and breaks `prefers-color-scheme` detection (which expects `.dark` class ⇒ dark appearance, by convention and by how every consulted source implements it).
**Why it happens:** Phase 1's `CONTEXT.md`/`app.css` never needed to distinguish "default" from "dark" because there was only one theme. The phrase in Phase 2's CONTEXT.md conflates "the override block this phase adds" with "the block containing the new light values," which are two different things.
**How to avoid:** Invert the values, not the class semantics:
1. Rewrite `@theme`'s 8 `--color-*` values to the **new light-mode palette** (see Standard Stack/palette table below).
2. Add `.dark { --color-surface: var(--color-zinc-950); --color-surface-elevated: var(--color-zinc-900); --color-on-surface: var(--color-white); --color-muted: var(--color-zinc-400); --color-muted-hover: var(--color-zinc-300); --color-accent: var(--color-purple-500); --color-accent-hover: var(--color-purple-400); --color-border-subtle: var(--color-purple-500); }` — i.e., copy today's values, verbatim, unchanged, into the new `.dark {}` block. This guarantees the already-signed-off (Phase 1 D-07) dark appearance is preserved byte-for-byte when `.dark` is applied.
3. `.dark` class present on `<html>` → dark theme (matches every reference implementation found this session).
**Warning signs:** If a Playwright visual-regression run with `.dark` forced on `<html>` does NOT match the Phase 1 baseline screenshots exactly, the inversion was done backwards.

### Pitfall 2: Existing `@media (prefers-color-scheme: dark) { color-scheme: dark; }` in `app/app.css` conflicts with manual override
**What goes wrong:** `app/app.css` currently has:
```css
html, body {
  @apply text-on-surface bg-surface font-sans;
  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```
This sets the native `color-scheme` (affects scrollbars, form controls, `<select>` rendering) purely from the OS media query, independent of the `.dark` class. After this phase, a user who manually overrides to light mode while their OS is set to dark would still get OS-driven dark-styled native scrollbars/inputs — violating DARK-03's "manual choice…overrides the browser default."
**Why it happens:** The rule predates the toggle and was a reasonable stopgap for a single-theme site; it was never revisited against the new manual-override requirement.
**How to avoid:** Replace the media-query-driven rule with a class-driven one: `.dark { color-scheme: dark; }` (and, if desired, an explicit default `color-scheme: light` at the base level for clarity). The blocking script (Pattern 1) already sets `documentElement.style.colorScheme` inline as a redundant belt-and-suspenders measure, but the CSS rule should still be corrected so it doesn't fight the script/class in edge cases (e.g., CSS load order, no-JS fallback).
**Warning signs:** Native form controls / scrollbars visually mismatch the chosen theme after a manual toggle.

### Pitfall 3: `accent`/`accent-hover` token reuse as both background-fill and foreground-text color
**What goes wrong:** The 8-token system uses `accent`/`accent-hover` in two different roles: (a) background fill for the primary `Button` (`bg-accent` + `text-on-surface`), and (b) foreground/text color for interactive hover states in `Header` (`hover:text-accent-hover`, the `</>≥` logo glyph). These two roles have very different contrast requirements once the background flips from dark to light. Verified contrast ratios (WCAG relative-luminance formula, computed via Node this session) [VERIFIED: computed locally]:

| Combination | Ratio | WCAG AA (4.5:1 text / 3:1 large-text&UI) |
|---|---|---|
| `purple-500` (accent, unchanged) on `zinc-950` (new light-mode `on-surface`, dark text) — Button primary bg/text pairing | **5.03:1** | Pass |
| `purple-400` (accent-hover, unchanged) on `white`/`zinc-50` (new light-mode surface) — nav-hover text pairing | **2.64:1 / 2.53:1** | **Fail** |
| `purple-700` (accent-hover, adjusted for light mode) on `white` | **6.98:1** | Pass (comfortably) |
| `purple-600` (candidate accent, adjusted) on `white` | 5.38:1 | Pass |

**Why it happens:** A single semantic token name ("accent-hover") is doing two visually different jobs (fill vs. text), and only one of those jobs happens to still pass contrast when the background inverts.
**How to avoid:** Recommended resolution — keep `accent` (`purple-500`) byte-identical across both themes (it is only ever used as a background fill in this codebase, where the contrast partner is `on-surface`, which already adapts per-theme and passes at 5.03:1). Make `accent-hover` theme-aware: `purple-400` in dark mode (unchanged, current), `purple-700` in light mode (new) — since `accent-hover`'s only real-world usage in this codebase (`Header`) is as **text/foreground** color, not a fill. This keeps the "purple accent" identity intact (still recognizably the same hue family, same token name, same *primary* accent = `accent` unchanged) while fixing the accessibility bug that literal byte-for-byte parity would otherwise ship. See Open Questions for the alternate (strict-parity) option and why it's not recommended.
**Warning signs:** A contrast-checker browser extension (e.g. axe DevTools) flags the nav hover-state text color in light mode; manual visual check shows washed-out purple text barely readable on a white/near-white background.

### Pitfall 4: `aria-pressed` hydration mismatch on the toggle button itself
**What goes wrong:** The toggle button's `aria-pressed` must reflect the real (client-only-knowable) theme state. If computed via a lazy `useState` initializer that reads `document.documentElement.classList.contains("dark")`, the value legitimately differs between the SSR pass (`document` undefined → some default) and the client hydration pass (real value) — triggering a React hydration-mismatch console warning for that specific attribute, even though the script has already applied the *visually* correct theme.
**Why it happens:** `aria-pressed` is computed from client-only state that cannot be known at SSR time — this is architecturally unavoidable, only the *console noise* is optional.
**How to avoid:** Add `suppressHydrationWarning` directly on the toggle `<button>` element (in addition to `<html>`). Because the DOM class was already set correctly by the blocking script before hydration runs, the client's first-render value for `aria-pressed` is already correct at first paint — there is no visible flash to fix here, only a warning to suppress. (Alternative: a `mounted` gate + `useEffect`, as used by `next-themes`, is more conservative but introduces a one-tick delay before `aria-pressed` becomes accurate — not necessary here since the DOM state is already correct pre-hydration.)
**Warning signs:** `Warning: Prop aria-pressed did not match` in the dev console on the toggle button.

## Code Examples

### Toggle button component
```tsx
// Source: pattern synthesized from research above; conventions match app/shared/Button.tsx
// (array.filter(Boolean).join for classes) and existing Header button styling.
import { Sun, Moon } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      suppressHydrationWarning
      className="
        relative
        rounded-xl
        border
        border-border-subtle/10
        p-2.5
        text-muted
        transition-all
        duration-300
        hover:border-border-subtle/30
        hover:bg-accent/10
        hover:text-accent-hover
      "
    >
      <Sun size={18} className="rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon
        size={18}
        className="absolute inset-2.5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}
```
Styling intentionally mirrors the existing mobile-menu hamburger `<button>` in `app/features/Header/index.tsx` (`rounded-xl border border-border-subtle/10 p-2.5 … hover:bg-accent/10 hover:text-accent-hover`) for visual consistency with zero new design vocabulary.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `tailwind.config.js` `darkMode: "class"` | `@custom-variant dark (&:where(.dark, .dark *));` in CSS | Tailwind v4 (2025) | Already migrated in Phase 1 — no further action needed, just confirmed still correct |
| Three-state (system/light/dark) toggles with a "system" option in the UI | Binary toggle, system preference used only as the *initial* default | Project decision (REQUIREMENTS.md "Out of Scope") | Simpler state machine — only 2 values in `validValues`, no tri-state UI needed |

**Deprecated/outdated:** None specific to this phase beyond the already-completed `tailwind.config.js` → `@theme`/`@custom-variant` migration.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `remix-themes` npm package is not a good fit vs. hand-rolled hook (compatibility/API not independently verified against RR 7.15) | Standard Stack / Alternatives Considered | Low — hand-rolled approach is the recommendation either way; this only affects whether the planner briefly re-checks the package before dismissing it |
| A2 | Recommended resolution to Pitfall 3 (keep `accent` unchanged, make `accent-hover` theme-aware: `purple-400` dark / `purple-700` light) is the best balance of DARK-04 literal compliance vs. WCAG AA | Common Pitfalls / Pitfall 3, Standard Stack | Medium — if the user intended byte-for-byte identical accent AND accent-hover hex values across themes as a hard requirement, this recommendation deviates from that in favor of accessibility; contrast numbers are tool-verified, but the *design tradeoff* itself is a judgment call the user explicitly delegated ("Claude's discretion") |
| A3 | New `app/hooks/` top-level directory (vs. nesting under `app/shared/`) is the right home for the persistence primitive | Architecture Patterns / Recommended Project Structure | Low — purely organizational; either location works, planner/executor can choose either without correctness impact |
| A4 | `suppressHydrationWarning` on the toggle `<button>` (rather than a `mounted`-gate/`useEffect` pattern) is sufficient and preferred | Common Pitfalls / Pitfall 4 | Low-Medium — both approaches are documented/valid; if React's hydration semantics for `suppressHydrationWarning` change or behave unexpectedly in this exact React 19 + RR7 SSR setup, the mount-guard fallback should be used instead |

## Open Questions

1. **Should `accent`/`accent-hover` be byte-identical across themes (literal DARK-04 reading) or shade-adjusted for AA contrast (Pitfall 3's recommendation)?**
   - What we know: Literal parity fails WCAG AA for `accent-hover`'s real usage as nav-hover text color (2.64:1, needs 4.5:1). Shade-adjusting `accent-hover` only (keeping `accent` itself unchanged) resolves this while preserving "purple stays the primary accent."
   - What's unclear: Whether the user's "only background/text tokens invert" instruction was meant as a hard constraint on the *hex value* or a description of *which category of tokens* changes (in which case accent-hover, arguably a hover/text-interaction token, was always expected to be theme-aware, same as `muted-hover`).
   - Recommendation: Proceed with the shade-adjusted recommendation (Pitfall 3) since it's grounded in a real, tool-verified accessibility gap; flag this specific decision for a quick user confirmation during `/gsd-discuss-phase` follow-up or plan review, since it's the one place this research diverges from a strictly literal reading of a locked requirement.

2. **Exact selector strategy for `color-scheme` (Pitfall 2) — inline style vs. CSS-only vs. both?**
   - What we know: The blocking script can set `documentElement.style.colorScheme` inline (redundant with CSS but zero-latency); the CSS rule should also be corrected from media-query-driven to class-driven.
   - What's unclear: Whether both belt-and-suspenders layers are worth the minor duplication for a portfolio site (native scrollbar/form-control theming is a minor, low-traffic visual detail here — no custom form controls exist in this codebase today).
   - Recommendation: Do both — it's a two-line CSS change and one line in the script, cheap insurance against a currently-invisible-but-real bug.

## Environment Availability

Skipped — this phase introduces no new external tools, services, or packages. `localStorage` and `window.matchMedia` are standard browser APIs available in all browsers React 19 supports (a project constraint already documented in `.claude/CLAUDE.md`: "Modern browsers (React 19 requirement)"). No install, service, or runtime dependency to probe.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth in this app |
| V3 Session Management | No | No sessions/cookies involved — `localStorage` only |
| V4 Access Control | No | No access-control boundaries touched |
| V5 Input Validation | Yes | The value read from `localStorage.getItem("theme")` MUST be validated against an explicit allow-list (`"dark" | "light"`) before being used to toggle a class or set `color-scheme` — never trust stored/browser-controlled values as-is, even though the immediate blast radius here (a CSS class name) is low |
| V6 Cryptography | No | No secrets/crypto involved |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| DOM-based XSS via `dangerouslySetInnerHTML` with interpolated/user-controlled content in the blocking `<script>` | Tampering / Elevation of Privilege | Keep the blocking script's string 100% static at build time (no runtime interpolation of any value, including the storage key or theme value) — see Pattern 1's example, which has zero interpolation. If Phase 3's reusable primitive is tempted to interpolate a detected locale into a similar script, apply the same static-string discipline or use `JSON.stringify()` on any value that must be embedded, never raw string concatenation |
| `localStorage` value tampering (a stored value outside `"dark"`/`"light"`, e.g. via a shared/compromised browser, browser extension, or manual devtools edit) causing unexpected `classList.toggle` behavior | Tampering | Validate against `validValues` allow-list before use in both the blocking script and the `usePersistedPreference` hook (already reflected in Pattern 3's code example) |

## Sources

### Primary (HIGH confidence)
- `app/app.css`, `app/root.tsx`, `app/features/Header/index.tsx`, `app/shared/Button.tsx` — read directly this session
- `package.json`, `node_modules/lucide-react/package.json`, `node_modules/lucide-react/dist/esm/icons/{sun,moon}.mjs` — verified directly this session
- WCAG contrast ratios — computed locally this session via the standard WCAG relative-luminance formula (`node -e` script), not sourced from a third party [VERIFIED: computed locally]

### Secondary (MEDIUM confidence)
- [Tailwind CSS Dark Mode docs](https://tailwindcss.com/docs/dark-mode) — `@custom-variant`/class-strategy mechanics, `:where()` specificity purpose [CITED]
- [shadcn-ui/next-template mode-toggle.tsx](https://github.com/shadcn-ui/next-template/blob/main/components/theme-toggle.tsx) and [seedflip.co dark-mode theming guide](https://seedflip.co/blog/shadcn-dark-mode-theming) — CSS-only dual-icon pattern [CITED]
- [abereghici/remix-themes](https://github.com/abereghici/remix-themes) and [mattstobbs.com Remix dark-mode guide](https://www.mattstobbs.com/remix-dark-mode/) — blocking-script-in-head pattern, `PreventFlashOnWrongTheme` precedent [CITED]
- [blog.maximeheckel.com dark-mode-flashing fix](https://blog.maximeheckel.com/posts/switching-off-the-lights-part-2-fixing-dark-mode-flashing-on-servered-rendered-website/) and MUI's `getInitColorSchemeScript` pattern (via [dev.to summary](https://dev.to/mohsenfallahnjd/why-mui-avoids-theme-flash-on-first-load-darklight-mode-4ek)) — corroborates the inline-head-script + `suppressHydrationWarning` approach across a second, independent SSR framework [CITED]
- [makethingsaccessible.com WCAG 2.2 AA contrast guide](https://www.makethingsaccessible.com/guides/contrast-requirements-for-wcag-2-2-level-aa/) and [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — 4.5:1 text / 3:1 UI-component thresholds confirmed against the primary source [CITED]

### Tertiary (LOW confidence)
- None retained — all web-sourced claims above were corroborated across 2+ independent results per query.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages, existing `lucide-react` icons confirmed present locally
- Architecture (blocking script + suppressHydrationWarning + CSS-only icon pattern): HIGH — corroborated across 4 independent frameworks/libraries (MUI, remix-themes, shadcn-ui, generic Tailwind docs) all converging on the same pattern
- Token-inversion direction (Pitfall 1): HIGH — directly follows from how `@custom-variant dark` is documented to work; this is the single most important finding for planning and should be treated as a required correction, not an option
- Palette/contrast recommendations (Pitfall 3): MEDIUM — math is tool-verified (HIGH), but the *design tradeoff* of which token gets which treatment is a judgment call flagged in Open Questions

**Research date:** 2026-07-07
**Valid until:** 30 days (stable web-platform APIs + a stable, already-installed dependency; re-verify if Tailwind, React Router, or React are upgraded before execution)
