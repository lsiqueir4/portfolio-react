# Phase 2: Dark Mode Toggle - Pattern Map

**Mapped:** 2026-07-06
**Files analyzed:** 5
**Analogs found:** 4 / 5 (1 has no direct in-repo analog — first-of-its-kind hook; RESEARCH.md code examples serve as its pattern source)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|-----------------|----------------|
| `app/app.css` | config (CSS tokens) | transform (value inversion) | `app/app.css` (self, Phase 1 authored) | exact (modify-in-place) |
| `app/root.tsx` | config/provider (root layout) | request-response (SSR shell) | `app/root.tsx` (self) | exact (modify-in-place) |
| `app/hooks/usePersistedPreference.ts` | hook | event-driven (storage + state) | none in-repo | no analog — first hook in codebase |
| `app/hooks/useTheme.ts` | hook | event-driven (state + side effect) | `app/features/Header/index.tsx` (`useState` local-state convention) | partial (state pattern only, no persistence precedent) |
| `app/features/Header/ThemeToggle.tsx` | component | request-response (click → state → DOM side effect) | `app/features/Header/index.tsx` (mobile hamburger `<button>`) | role-match (button component) |
| `app/features/Header/index.tsx` (modified) | component | request-response | itself (existing file being extended) | exact (modify-in-place) |

## Pattern Assignments

### `app/app.css` (config, transform)

**Analog:** itself — current state read directly.

**Current full contents** (lines 1-27):
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";

  --color-surface: var(--color-zinc-950);
  --color-surface-elevated: var(--color-zinc-900);
  --color-on-surface: var(--color-white);
  --color-muted: var(--color-zinc-400);
  --color-muted-hover: var(--color-zinc-300);
  --color-accent: var(--color-purple-500);
  --color-accent-hover: var(--color-purple-400);
  --color-border-subtle: var(--color-purple-500);
}

html,
body {
  @apply text-on-surface bg-surface font-sans;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```

**Required transform (per RESEARCH.md Pitfall 1 and 2):**
1. Rewrite the 8 `--color-*` values inside `@theme` to new **light-mode** hex values (contrast-verified in RESEARCH.md Pitfall 3: keep `--color-accent: var(--color-purple-500)` unchanged; adjust `--color-accent-hover` to `var(--color-purple-700)` for light-mode AA contrast).
2. Add a new `.dark { }` block directly below `@theme`, copying the **current** (today's) 8 values verbatim — this preserves the existing signed-off dark appearance byte-for-byte:
```css
.dark {
  --color-surface: var(--color-zinc-950);
  --color-surface-elevated: var(--color-zinc-900);
  --color-on-surface: var(--color-white);
  --color-muted: var(--color-zinc-400);
  --color-muted-hover: var(--color-zinc-300);
  --color-accent: var(--color-purple-500);
  --color-accent-hover: var(--color-purple-400);
  --color-border-subtle: var(--color-purple-500);
}
```
3. Replace the `@media (prefers-color-scheme: dark)` block (lines 24-26) with a class-driven rule, since the media query now conflicts with manual override (Pitfall 2):
```css
html,
body {
  @apply text-on-surface bg-surface font-sans;
  color-scheme: light;
}

.dark html,
.dark body {
  color-scheme: dark;
}
```
(Exact selector shape is an implementation detail for the planner/executor — could also be expressed as `.dark { color-scheme: dark; }` at the `:root`/`html` level. Keep whichever form correctly scopes to the `.dark` class on `<html>`, not the media query.)

**Do NOT touch:** `@custom-variant dark (&:where(.dark, .dark *));` (line 3) — already correct from Phase 1, no change needed.

---

### `app/root.tsx` (config/provider, request-response)

**Analog:** itself — current state read directly (lines 1-52).

**Current imports** (lines 1-12):
```tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Header } from "./features/Header";
import "./app.css";
```

**Current `Layout` function to modify** (lines 27-43):
```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
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

**Required modification** (per RESEARCH.md Pattern 1 — the exact code to insert is fully specified there, do not re-derive):
- Add `suppressHydrationWarning` to the `<html>` tag.
- Insert a static (zero-interpolation) blocking `<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />` inside `<head>`, after `<Links />`.
- `themeInitScript` constant and `THEME_STORAGE_KEY = "theme"` defined at module scope, exactly as shown in RESEARCH.md "Pattern 1: Static (non-interpolated) blocking script in `<head>`" (lines 151-193 of 02-RESEARCH.md). Do not interpolate any dynamic/runtime value into this string (Security Domain V5/threat-pattern requirement).
- Everything else in `root.tsx` (imports, `App`, `ErrorBoundary`) — leave unchanged.

---

### `app/hooks/usePersistedPreference.ts` (hook, event-driven) — NEW FILE, NEW DIRECTORY

**Analog:** None in-repo (first hooks directory/file in this codebase). Source pattern: RESEARCH.md "Pattern 3: Generic persisted-preference primitive" (lines 218-253 of 02-RESEARCH.md) — use verbatim as the implementation basis.

**Directory convention to follow** (from `app/shared/` sibling directories): named export style consistent with `app/shared/Button.tsx`'s TypeScript conventions (interfaces not type aliases for prop-like objects — see `ButtonProps` uses `type`, but interfaces are the house style per CLAUDE.md "Use TypeScript interfaces (not type aliases for props)" — apply interface for the hook's options object as RESEARCH.md's example already does: `interface UsePersistedPreferenceOptions<T extends string>`).

**Full pattern (already complete in RESEARCH.md, reproduced here for traceability):**
```typescript
import { useState } from "react";

interface UsePersistedPreferenceOptions<T extends string> {
  storageKey: string;
  validValues: readonly T[];
  detectBrowserDefault: () => T;
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
**Security note (V5 Input Validation, from RESEARCH.md Security Domain):** the `validValues` allow-list check before trusting `localStorage.getItem(...)` is mandatory — do not remove it.

---

### `app/hooks/useTheme.ts` (hook, event-driven) — NEW FILE

**Analog:** `app/features/Header/index.tsx` for local-state convention (`useState` usage, lines 39-43) — but this is a partial match only; no existing file in this codebase persists state to `localStorage` or reads `matchMedia`. Primary pattern source is RESEARCH.md "Pattern 3" second code block (lines 255-281).

**Header's existing local-state convention to stay consistent with (naming/style, not persistence):**
```tsx
// app/features/Header/index.tsx lines 39-43
const [isMenuOpen, setIsMenuOpen] = useState(false);

function closeMenu() {
  setIsMenuOpen(false);
}
```

**Full pattern to implement (from RESEARCH.md):**
```typescript
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
**Important:** keep `detectBrowserTheme()`'s fallback logic byte-for-byte in sync with the blocking script in `app/root.tsx` (RESEARCH.md Pitfall/nuance under Pattern 3) — if one changes, update the other.

---

### `app/features/Header/ThemeToggle.tsx` (component, request-response) — NEW FILE

**Analog:** `app/features/Header/index.tsx` mobile hamburger `<button>` (lines 130-148) — closest existing button for style/className conventions (rounded-xl border, hover states, `aria-label`).

**Analog excerpt — hamburger button to mirror styling from** (lines 130-148):
```tsx
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="
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
    md:hidden
  "
  aria-label="Abrir menu"
>
  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
</button>
```

**Import pattern to follow** (from `app/features/Header/index.tsx` line 3-5, icon + hook import style):
```tsx
import { Download, Menu, Send, X } from "lucide-react";
import { CONTACTS } from "~/constants";
import Button from "~/shared/Button";
```
For `ThemeToggle.tsx`, the equivalent import block is:
```tsx
import { Sun, Moon } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";
```

**Full component pattern (already complete in RESEARCH.md "Code Examples" section, lines 346-386) — use as the implementation basis, adjusting only if planner decides on different placement/sizing:**
```tsx
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
**Component export convention:** named export `export function ThemeToggle()`, matching `app/features/Header/index.tsx`'s own convention (`export function Header()` at line 38) — subcomponents/feature-colocated components use named exports per CLAUDE.md ("Components: use named exports when used as subcomponents").

---

### `app/features/Header/index.tsx` (modified, component, request-response)

**Analog:** itself — full file already read (lines 1-269 above).

**Integration points (two insertion locations required):**

1. **Desktop nav** — insert `<ThemeToggle />` inside the `<div className="hidden items-center gap-8 md:flex">` block (lines 88-128), alongside the existing `Contato` link and `Button` (CV download) — i.e., as a new sibling before or after the `Button` component at line 119-127.

2. **Mobile — always-visible, not hidden inside collapsible panel** (per RESEARCH.md Code Examples note): place next to the hamburger `<button>` at lines 130-148, i.e. as a sibling within the same parent `<div className="flex items-center justify-between">` (lines 69-149), NOT inside the `<div className={...} md:hidden>` collapsible panel (lines 151-265).

**New import line to add** (alongside existing lines 1-5):
```tsx
import { ThemeToggle } from "./ThemeToggle";
```

**No changes needed to:** `HeaderButton` component (lines 7-36), `closeMenu`/`isMenuOpen` state (lines 39-43), or any of the nav link markup (lines 90-95, 173-251).

---

## Shared Patterns

### Icon import convention
**Source:** `app/features/Header/index.tsx` line 3: `import { Download, Menu, Send, X } from "lucide-react";`
**Apply to:** `ThemeToggle.tsx` — use the same named-import style: `import { Sun, Moon } from "lucide-react";`

### Path-alias imports (`~/*`)
**Source:** `app/features/Header/index.tsx` lines 4-5 (`~/constants`, `~/shared/Button`)
**Apply to:** `useTheme.ts` importing from `~/hooks/usePersistedPreference` if the planner chooses to use the alias instead of relative `./` — both are valid per `tsconfig.json`; RESEARCH.md's own example uses relative `./usePersistedPreference`, which is also acceptable since both hook files live in the same directory.

### Button/interactive-element className convention (rounded-xl border + hover states)
**Source:** `app/features/Header/index.tsx` lines 130-148 (hamburger button) and `app/shared/Button.tsx` lines 14-21 (`baseClasses`/`variantClasses`)
**Apply to:** `ThemeToggle.tsx` — reuse `rounded-xl border border-border-subtle/10 p-2.5 text-muted transition-all duration-300 hover:border-border-subtle/30 hover:bg-accent/10 hover:text-accent-hover` verbatim for visual consistency (already the pattern baked into the RESEARCH.md code example above).

### Named vs. default export convention
**Source:** CLAUDE.md Conventions — "Components: use named exports when used as subcomponents... Main feature components: use default export."
**Apply to:** `ThemeToggle` is a subcomponent of the `Header` feature (not a top-level feature) → named export, matching `export function Header()` (index.tsx line 38), not default export like `app/shared/Button.tsx`'s `export default function Button()` (Button is also cross-feature shared, different case — `ThemeToggle` is Header-scoped, so named export is correct here).

### Static/no-interpolation script security discipline
**Source:** RESEARCH.md Security Domain, Pattern 1
**Apply to:** `app/root.tsx`'s blocking script only — zero dynamic interpolation into `dangerouslySetInnerHTML`; treat `THEME_STORAGE_KEY` as compile-time constant only.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `app/hooks/usePersistedPreference.ts` | hook | event-driven | No `app/hooks/` directory or any persistence-hook precedent exists in this codebase yet (Header's `useState` is local-only, no `localStorage`/`matchMedia` usage anywhere in the repo). Planner should use the RESEARCH.md Pattern 3 code verbatim as the pattern source instead of an in-repo analog. |

## Metadata

**Analog search scope:** `app/app.css`, `app/root.tsx`, `app/features/Header/index.tsx`, `app/features/Header/types.tsx`, `app/shared/Button.tsx`, `app/shared/` and `app/features/` directory listings
**Files scanned:** 6 read directly + 2 directory listings
**Pattern extraction date:** 2026-07-06
