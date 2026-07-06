# Phase 1: Theme/CSS Token Centralization - Pattern Map

**Mapped:** 2026-07-06
**Files analyzed:** 9 (1 CSS file, 2 new shared components, 6 feature files modified in place)
**Analogs found:** 9 / 9 (all files already exist in-repo except the two new shared components, which have a strong existing-shared-component analog)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `app/app.css` | config (design tokens) | transform (CSS var definition) | itself (existing `@theme` block) | exact — extend in place |
| `app/shared/Section.tsx` (new) | component (layout wrapper) | request-response (pure render, props → JSX) | `app/shared/TechBadge.tsx` | exact-role (shared, no-barrel, typed-props component) |
| `app/shared/Button.tsx` (new) | component (CTA button) | request-response (pure render, props → JSX) | `app/shared/TechBadge.tsx` (shape) + `Header`'s `ActionButton`/`Hero`'s `Button` (behavior to consolidate) | exact — this is literally a promotion of an existing internal pattern |
| `app/features/Header/index.tsx` | component (nav) | request-response | itself (color-token swap + consumes new `Button`) | exact — in-place edit |
| `app/features/Hero/index.tsx` | component (section) | request-response | itself (color-token swap + consumes new `Button`, remove local `Button`) | exact — in-place edit |
| `app/features/AboutMe/index.tsx` | component (section, compound) | CRUD-like data render (maps `data.tsx` arrays) | itself (color-token swap + consumes new `Section`) | exact — in-place edit |
| `app/features/Projects/index.tsx` | component (section, compound) | CRUD-like data render | itself (color-token swap + consumes new `Section`) | exact — in-place edit |
| `app/features/Contacts/index.tsx` | component (section) | request-response | itself (color-token swap + consumes new `Section`) | exact — in-place edit |
| `app/features/Footer/index.tsx` | component (section, small) | request-response | itself (color-token swap only, no shared extraction) | exact — in-place edit |
| `app/shared/TechBadge.tsx` | component (badge) | request-response | itself (color-token swap only) | exact — in-place edit |

All files are **modifications of existing files**, not new files, except `app/shared/Section.tsx` and `app/shared/Button.tsx`, which are net-new but should mirror `app/shared/TechBadge.tsx`'s existing conventions exactly.

## Pattern Assignments

### `app/app.css` (config, CSS token definition)

**Analog:** itself — current 15-line file, extend the existing `@theme` block, don't replace it.

**Current full content** (`app/app.css:1-16`):
```css
@import "tailwindcss";

@theme {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";
}

html,
body {
  @apply text-white bg-gray-950 font-sans;

  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
  }
}
```

**Target shape** (per D-01's 7-token set, from `.planning/research/ARCHITECTURE.md` Pattern 1 — NOT literally copy the dark-mode class block, since Phase 1 excludes the JS toggle per CONTEXT.md; only the `@theme` tokens + `@custom-variant dark` directive are in scope this phase, per PITFALLS.md Pitfall 5 which says tokens+variant must be defined together even though the toggle itself is Phase 2):
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Outfit", ui-sans-serif, system-ui, sans-serif, ...;

  --color-surface: var(--color-gray-950);          /* was: bg-gray-950 / bg-zinc-950 (mixed usage — normalize both to this token) */
  --color-surface-elevated: var(--color-zinc-900); /* was: bg-zinc-900/40, bg-zinc-900/50, bg-zinc-900/80 */
  --color-on-surface: var(--color-white);          /* was: text-white */
  --color-muted: var(--color-zinc-400);            /* was: text-zinc-400, text-zinc-500, text-zinc-300 (see note below) */
  --color-accent: var(--color-purple-500);         /* was: bg-purple-500, border-purple-500, text-purple-400/300 (see note) */
  --color-accent-hover: var(--color-purple-400);   /* was: hover:bg-purple-400, hover:text-purple-400 */
  --color-border-subtle: var(--color-purple-500);  /* was: border-purple-500/10, /20, /30 (opacity applied via Tailwind's `/` opacity modifier on the token itself, e.g. `border-border-subtle/10`) */
}

html, body {
  @apply bg-surface text-on-surface font-sans;
}
```

**Important nuance for the planner:** the current codebase uses **three different zinc shades for muted text** (`zinc-300`, `zinc-400`, `zinc-500`) and **two different purple shades for accent** (`purple-300`, `purple-400`) inconsistently across files (e.g. `Header` nav uses `text-zinc-300`, `Hero` body copy uses `text-zinc-400`, `AboutMe` course institution uses `text-zinc-500`). D-01 only specifies one `--color-muted` token. The planner must decide whether all three collapse to one token (visual diff risk, flagged in PITFALLS.md Pitfall 7) or whether opacity/shade variants are preserved via Tailwind's opacity modifier on the single token (`text-muted/70` etc.) — this is not resolved by CONTEXT.md and should be called out explicitly in the plan.

---

### `app/shared/Section.tsx` (new — component, layout wrapper)

**Analog:** `app/shared/TechBadge.tsx` (only existing file in `app/shared/`)

**Imports pattern** (`app/shared/TechBadge.tsx:1`):
```tsx
import type { IconType } from "react-icons";
```
→ For `Section.tsx`, use `import type { ReactNode } from "react";` (matches the exact style already used for compound sub-components in `app/features/AboutMe/index.tsx:1,7`).

**Props typing pattern** (`app/shared/TechBadge.tsx:3-6`):
```tsx
type TechBadgeProps = {
  Icon: IconType;
  name: string;
};

export default function TechBadge({ Icon, name }: TechBadgeProps) {
```
Note: `TechBadge` uses a local `type` alias (not `interface`), despite CONVENTIONS.md's stated preference for interfaces for props — follow the file's actual precedent since it's the only shared-component example. Default export, matches `AboutMe`'s internal `SectionTitle` pattern below for the actual title+wrapper structure to replicate.

**Core wrapper pattern to copy — title layout** (`app/features/AboutMe/index.tsx:7-21`, the internal `SectionTitle`) and the **outer decorative section frame repeated 3x** (`app/features/AboutMe/index.tsx:154-208`, `app/features/Projects/index.tsx:152-190`, `app/features/Contacts/index.tsx:58-69`) — this triple-repeated block (accent divider line + eyebrow label + `<h1>` title + optional subtitle paragraph) is exactly what D-02 asks `Section.tsx` to de-duplicate:
```tsx
// Repeated shape across AboutMe/Projects/Contacts — extract into Section.tsx
<div className="mb-6 h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
<span className="mb-3 inline-block text-sm font-medium uppercase tracking-widest text-purple-400">
  {eyebrow}
</span>
<h1 className="mb-6 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
  {title}
</h1>
{subtitle && <p className="max-w-3xl text-base leading-relaxed font-medium text-zinc-400 sm:text-lg">{subtitle}</p>}
{children}
```
Note each of the 3 usages has slightly different section-level wrapper classes (`id`, `min-h-screen` vs `min-h-[80vh]`, centered-text vs left-aligned) — those outer `<section>` attributes stay in each feature file; only the inner title-block markup moves into `Section.tsx`, per D-02's phrasing ("repeated section wrapper (title + spacing/padding pattern)"). Confirm exact prop API (title-only vs title+eyebrow+subtitle+children) during planning — CONTEXT.md leaves this to Claude's discretion.

---

### `app/shared/Button.tsx` (new — component, CTA button)

**Analog:** `app/shared/TechBadge.tsx` (file/export shape) + the two existing local button implementations to consolidate: `Header`'s `ActionButton` (`app/features/Header/index.tsx:37-67`) and `Hero`'s `Button` (`app/features/Hero/index.tsx:8-42`)

**Existing pattern A — Header's `ActionButton`** (`app/features/Header/index.tsx:37-67`):
```tsx
function ActionButton({ children, href = "#", icon }: ActionButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center justify-center gap-2
        rounded-xl bg-purple-500 px-4 py-2.5
        text-sm font-semibold text-white
        transition-all duration-300
        hover:scale-105 hover:bg-purple-400
        hover:shadow-lg hover:shadow-purple-500/30
      "
    >
      {icon}
      {children}
    </a>
  );
}
```

**Existing pattern B — Hero's `Button`** (`app/features/Hero/index.tsx:8-42`) — **CRITICAL PITFALL SOURCE**, already violates the dynamic-class-name rule (PITFALLS.md Pitfall 6) via a template literal with a conditional expression building class names:
```tsx
function Button({ children, href = "#", primary = false }: ButtonProps) {
  return (
    <a
      href={href}
      className={`
        flex items-center justify-center gap-2
        rounded-lg px-5 py-3 font-bold
        transition-all duration-300
        w-full sm:w-auto text-white
        ${
          primary
            ? `bg-purple-500 border border-purple-500 hover:bg-purple-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30`
            : `border border-purple-500 hover:bg-purple-500 hover:text-white`
        }
      `}
    >
      {children}
    </a>
  );
}
```
**Note for planner:** this existing `${primary ? ... : ...}` ternary is NOT the silent-failure Tailwind pitfall (Pitfall 6 is specifically about interpolating a *variable* into the middle of a utility name like `` `bg-${color}-500` ``) — here both branches are complete literal strings, so Tailwind's static scanner sees both branches fine. Still, when consolidating into `Button.tsx`, prefer a **lookup-object-per-variant** shape over inline ternaries for clarity and to definitively avoid the pitfall as the component becomes shared and possibly gains variants:
```tsx
const variantClasses = {
  primary: "bg-accent border border-accent hover:bg-accent-hover hover:scale-105 hover:shadow-lg hover:shadow-accent/30",
  secondary: "border border-accent hover:bg-accent hover:text-on-surface",
} as const;
```

**Props typing to unify** — Header's `ActionButtonProps` and Hero's `ButtonProps` currently live in each feature's own `./types.tsx`; the new shared component needs one merged type covering both use cases (icon-prefixed vs primary/secondary variant, external-link vs anchor-hash), e.g.:
```tsx
type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  external?: boolean; // controls target="_blank" rel="noopener noreferrer"
};
```

---

### `app/features/Header/index.tsx`, `Hero/index.tsx`, `AboutMe/index.tsx`, `Projects/index.tsx`, `Contacts/index.tsx`, `Footer/index.tsx`, `app/shared/TechBadge.tsx`

**Pattern:** in-place color-token find/replace — no structural change (per D-02/D-03: only `Section`/`Button` are extracted; `InfoCard`/`ExperienceCard`/`ProjectContainer` stay local, only their classNames change).

**Replacement mapping to apply consistently across all 7 files** (derived from actual usages found via read above):

| Old literal class | New semantic token class |
|---|---|
| `bg-gray-950`, `bg-zinc-950` (solid) | `bg-surface` |
| `bg-zinc-950/70`, `/50`, `/80` (with opacity) | `bg-surface/70`, `bg-surface/50`, `bg-surface/80` |
| `bg-zinc-900/40`, `/50`, `/80` | `bg-surface-elevated/40` etc. |
| `text-white` | `text-on-surface` |
| `text-zinc-300`, `text-zinc-400`, `text-zinc-500` | `text-muted` (see nuance note under `app.css` above — flag to planner) |
| `bg-purple-500`, `border-purple-500`, `text-purple-400` (solid accent) | `bg-accent`, `border-accent`, `text-accent` |
| `hover:bg-purple-400`, `hover:text-purple-400` | `hover:bg-accent-hover`, `hover:text-accent-hover` |
| `border-purple-500/10`, `/20`, `/30` | `border-border-subtle/10`, `/20`, `/30` |
| `text-purple-300` (used for role/label text in AboutMe, distinct shade from `text-purple-400`) | needs planner decision — likely also `text-accent` or a lighter accent variant; flag as another instance of the muted-shade-collapse ambiguity above |

**Non-token colors to leave untouched** (explicitly NOT part of the semantic token set per D-01, these are one-off semantic-meaning colors in `Contacts/index.tsx:141-142,199-201,263-264`):
```tsx
border-green-500 bg-green-500/10   // WhatsApp icon
border-purple-400 bg-purple-500/10 // Email icon (accent — DOES migrate to border-accent-hover/bg-accent/10)
border-blue-500 bg-blue-500/10     // LinkedIn icon
```
Green/blue are contact-brand colors, not part of the 7-token theme set — leave as literal Tailwind classes; only the purple/zinc/gray/white/gray-950 family migrates.

**Verification pattern (from PITFALLS.md Pitfall 7):** after migration, grep the entire `app/` tree for `purple-`, `zinc-`, `gray-` prefixes — any hits outside `app/app.css`'s token definitions themselves indicate a missed spot. This is the phase's definition of done per D-07.

## Shared Patterns

### Compound component / internal sub-component convention
**Source:** `app/features/AboutMe/index.tsx:1-107` (three internal, non-exported functions: `SectionTitle`, `InfoCard`, `ExperienceCard`, all defined above the default-exported `AboutMe`)
**Apply to:** Keep this shape when extracting `Section.tsx`/`Button.tsx` as new *shared* (not internal) components — main difference is these become their own files under `app/shared/` with a `default export`, following `TechBadge.tsx`'s existing precedent, rather than staying as internal same-file functions.

### No-barrel direct imports with `~` alias
**Source:** every feature file, e.g. `app/features/Hero/index.tsx:4` (`import TechBadge from "~/shared/TechBadge";`), `app/features/Header/index.tsx:4` (`import { CONTACTS } from "~/constants";`)
**Apply to:** All new imports of `Section`/`Button` into feature files must use `import Section from "~/shared/Section";` / `import Button from "~/shared/Button";` — no index/barrel file in `app/shared/`.

### Multi-line Tailwind className strings
**Source:** every file read above — consistent convention is one utility class (or small logical group) per line inside a `className="\n ... \n"` block for anything beyond ~3 utilities; single-line only for trivial cases (e.g. `<div className="mb-4">`).
**Apply to:** All edited files — preserve this formatting style when swapping literal color classes for token classes; do not collapse multi-line blocks to single-line during the refactor (keeps diffs minimal/reviewable, per PITFALLS.md's "migrate in small, reviewable batches" recommendation).

### Dynamic-class-name avoidance (critical pitfall guard)
**Source:** PITFALLS.md Pitfall 6, existing (safe) example at `app/features/Header/index.tsx:177-183` — an `isMenuOpen` ternary is used only for a suffix chunk of *whole* class names (`"mt-4 max-h-96 opacity-100"` vs `"max-h-0 opacity-0"`), never interpolating a variable into the middle of a single utility token.
**Apply to:** `Button.tsx`'s variant logic (see above) and any future prop-driven styling in `Section.tsx` — always branch between complete literal class strings (or use a lookup object), never `` `bg-${x}` `` style interpolation.

## No Analog Found

None — every file in scope for this phase either already exists (modification-in-place) or has a directly applicable analog (`TechBadge.tsx` for new shared components). Playwright config/test files (D-05/D-06) are out of scope for this PATTERNS.md since they are new test infrastructure, not application code with an existing analog in this codebase — the planner should treat Playwright setup as greenfield, sourced from Playwright's own official scaffolding (`npm init playwright@latest`) rather than an internal pattern.

## Metadata

**Analog search scope:** `app/` (all feature folders, `app/shared/`, `app/app.css`)
**Files scanned:** `app/app.css`, `app/shared/TechBadge.tsx`, `app/features/Header/index.tsx`, `app/features/Hero/index.tsx`, `app/features/AboutMe/index.tsx`, `app/features/Projects/index.tsx`, `app/features/Contacts/index.tsx`, `app/features/Footer/index.tsx` (8 files, full read — all well under 2,000 lines)
**Pattern extraction date:** 2026-07-06
