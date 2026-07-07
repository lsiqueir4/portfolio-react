---
phase: 01-theme-css-token-centralization
reviewed: 2026-07-06T00:00:00Z
depth: standard
files_reviewed: 16
files_reviewed_list:
  - package.json
  - package-lock.json
  - .gitignore
  - playwright.config.ts
  - tests/visual.spec.ts
  - app/app.css
  - app/shared/Button.tsx
  - app/shared/Section.tsx
  - app/shared/TechBadge.tsx
  - app/features/Header/index.tsx
  - app/features/Header/types.tsx
  - app/features/Hero/index.tsx
  - app/features/Footer/index.tsx
  - app/features/AboutMe/index.tsx
  - app/features/Projects/index.tsx
  - app/features/Contacts/index.tsx
findings:
  critical: 1
  warning: 3
  info: 3
  total: 7
status: issues_found_critical_fixed
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-06T00:00:00Z
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

Reviewed the full diff for the theme/CSS token centralization phase: the new `@theme` token block in `app/app.css`, the two new shared components (`Button`, `Section`), the token-migrated `TechBadge`, and the five feature sections (Header, Hero, Footer, AboutMe, Projects, Contacts) plus the new Playwright visual-regression harness. `tsc --noEmit`, `eslint`, and `prettier --check` were all run against the reviewed file set; TypeScript and ESLint are clean on these files (a pre-existing, out-of-scope lint error exists in `app/routes/home.tsx`, untouched by this diff).

The token migration is largely mechanical and correct (literal `purple-*`/`zinc-*`/`white` classes were consistently replaced with the new semantic tokens, dead code — the old `ActionButton` and Hero-local `Button`, plus their now-unused `types.tsx` — was properly deleted). However, tracing the actual mapped values (not just "does it compile") surfaced one real, silent visual regression that the project's own explicit zero-regression acceptance gate (THEME-04) is supposed to prevent, plus several maintainability concerns in the new shared abstractions.

## Critical Issues

### CR-01: Token migration silently removes hover-state color feedback on all three Contacts cards — **FIXED** (commit `2d42682`)

**File:** `app/features/Contacts/index.tsx:146-159, 206-219, 268-280`
**Issue:** Before the migration, each contact card's description text used `text-zinc-400` at rest and `group-hover:text-zinc-300` on hover — a real, visible lightening on hover (WhatsApp number, email address, and "Leandro Siqueira" under LinkedIn). Both `zinc-400` and `zinc-300` were mapped to the same `text-muted` token, so all three cards now read:

```
text-muted transition-colors duration-300 group-hover:text-muted
```

`group-hover:text-muted` is now a no-op — the color literally cannot change on hover because both states resolve to the identical token/value. This is a genuine functional/visual regression introduced by the migration, not a "sub-perceptual shade normalization" (the calibrated Playwright tolerance in `playwright.config.ts:24-33` explicitly says real regressions like "missed classes" should still fail) — it silently defeats the project's explicit THEME-04 requirement ("every page section renders identically to before the refactor," `.planning/REQUIREMENTS.md:13`). It is also invisible to the committed visual-regression suite because `tests/visual.spec.ts` only captures static, non-hover screenshots (see WR-04), so this will not be caught by CI.
**Fix:** Reintroduce a distinct hover token (e.g. `--color-muted-hover: var(--color-zinc-300)`) and use it for these three cases, or explicitly decide the hover effect is no longer wanted and drop `transition-colors`/`group-hover:` entirely so the dead effect isn't left in the markup:

```tsx
<p className="... text-muted transition-colors duration-300 group-hover:text-muted-hover sm:text-base">
```

## Warnings

### WR-01: Missing `key` prop on `projects.map`

**File:** `app/features/Projects/index.tsx:172-180`
**Issue:** `ProjectContainer` is rendered in a `.map()` without a `key` prop:

```tsx
{projects.map((project) => (
  <ProjectContainer
    title={project.title}
    description={project.description}
    usedTechs={project.usedTechs}
    link={project.link}
    image={project.image}
  />
))}
```

React will emit a console warning ("Each child in a list should have a unique key prop") and fall back to index-based reconciliation, which is fragile if `projects` data is ever reordered/filtered. Every other list render in the reviewed files (`AboutMe`'s `experiences`/`courses`, `TechBadge` usages) correctly sets a `key`; this one was missed both before and after this phase's changes.
**Fix:**
```tsx
{projects.map((project) => (
  <ProjectContainer key={project.title} {...project} />
))}
```

### WR-02: `--color-border-subtle` is a byte-identical duplicate of `--color-accent`

**File:** `app/app.css:10-16`
**Issue:**
```css
--color-accent: var(--color-purple-500);
--color-accent-hover: var(--color-purple-400);
--color-border-subtle: var(--color-purple-500);
```
`border-subtle` and `accent` resolve to the exact same underlying value. The whole point of this phase is semantic token centralization, but here two semantically distinct concepts (an accent color vs. a subtle border color) are aliased to one literal value with no independent definition. If a future change wants borders to be less saturated than the accent (which "subtle" implies), every one of the ~20 `border-border-subtle/NN` call sites across Header/Hero/AboutMe/Projects/Contacts/Footer will need to be re-audited, because the token itself gives no signal that it was ever meant to diverge from `accent`.
**Fix:** Either rename `border-subtle` to something that honestly reflects it's just `accent` at varying opacity (e.g. drop the separate token and use `border-accent/NN` directly), or give it a genuinely distinct, more muted value (e.g. `var(--color-zinc-700)`) if "subtle" was the actual design intent.

### WR-03: New shared `Section` component hardcodes `<h1>`, creating multiple `<h1>` elements per page

**File:** `app/shared/Section.tsx:45`
**Issue:** `{title && <h1 className={...}>{title}</h1>}` unconditionally renders an `<h1>`. `Section` is now used by `AboutMe` (title "Quem sou eu") and `Projects` (title "Projetos"), while `Hero` renders its own separate `<h1>{CONTACTS.fullName}</h1>` and `Contacts` renders its own manual `<h1>Entre em Contato</h1>`. That's four `<h1>` elements on a single-page site. This pre-existed as scattered per-component markup before this phase, but centralizing it into a shared, reusable component with no way to configure the heading level bakes the anti-pattern into the abstraction that Phase 2/3 will keep reusing.
**Fix:** Add a `headingLevel`/`as` prop (default `"h2"`) to `Section`, and reserve `<h1>` for the single page-level heading in `Hero`:
```tsx
type SectionProps = { ...; as?: "h1" | "h2" };
...
const Heading = as ?? "h2";
{title && <Heading className={...}>{title}</Heading>}
```

## Info

### IN-01: Decorative blur-circle depth effect collapsed to a single shade

**File:** `app/features/Hero/index.tsx:17-18`, `app/features/AboutMe/index.tsx:136-152`, `app/features/Projects/index.tsx:130-149`, `app/features/Contacts/index.tsx:26-49`
**Issue:** Each section previously paired two different purple shades for its ambient background blobs (`bg-purple-500/10` for one, `bg-purple-700/10` for the other), giving a subtle layered-depth look. Both are now `bg-accent/10`, so the two blobs are visually identical. This is a real (if subtle) design simplification, not merely rounding — worth confirming with whoever owns the visual design that collapsing the 7-token palette to a single accent shade here was intentional rather than an oversight during token mapping.
**Fix:** If the layered effect is still wanted, add a second decorative token (e.g. `--color-accent-muted: var(--color-purple-700)`) rather than reusing `accent` for both blobs.

### IN-02: Unexplained arbitrary padding values compensate for a newly-added border

**File:** `app/features/Header/index.tsx:124, 259`
**Issue:** The "Baixar CV" buttons pass `className="rounded-xl px-[15px] py-[9px] text-sm font-semibold"` to the shared `Button`. The original standalone `ActionButton` had no border and used `px-4 py-2.5` (16px/10px); the new shared `primary` variant adds `border border-accent` (1px), so `px-[15px] py-[9px]` (15px/9px) is used to keep the outer box the same 32px/20px total. The math is correct, but nothing documents why these specific non-Tailwind-scale pixel values were chosen — a future contributor is likely to "clean up" `px-[15px]` back to `px-4`, silently reintroducing a 2px size shift.
**Fix:** Add a short comment at the call site explaining the compensation, or better, have the `primary` Button variant apply the border via `box-shadow`/`outline` so padding doesn't need manual compensation.

### IN-03: Visual regression tests only capture default state, not hover/focus

**File:** `tests/visual.spec.ts:22-67`
**Issue:** Every test does a static `toHaveScreenshot()` on page load; none simulate `:hover` or `:focus`. This is exactly the coverage gap that let CR-01 through undetected — an entire class of hover-only token regressions (color, background, border on `hover:`/`group-hover:` variants) has no automated safety net despite the harness's stated purpose of proving "zero visual regression" (comment block, lines 1-14).
**Fix:** Add at least one hover-state screenshot per interactive element class (nav links, contact cards, buttons) using `page.hover(selector)` before `toHaveScreenshot()`, or accept and document that hover states are out of scope for this harness.

---

_Reviewed: 2026-07-06T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
