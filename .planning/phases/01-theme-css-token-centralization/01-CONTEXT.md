# Phase 1: Theme/CSS Token Centralization - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace scattered hardcoded color utility classes (`purple-400/500`, `zinc-300/400/900/950`, `gray-950`) across every feature folder (Header, Hero, AboutMe, Projects, Contacts, Footer, TechBadge) with a centralized semantic-token system (Tailwind v4 `@theme` config), wire the `@custom-variant dark` mechanism so a future dark-mode toggle has something to flip, and de-duplicate specific repeated component patterns — all with zero visual regression. This phase does NOT add a dark mode toggle (Phase 2) or touch content/copy/structure.

</domain>

<decisions>
## Implementation Decisions

### Token Set
- **D-01:** Use the 7 semantic tokens proposed by research (`.planning/research/ARCHITECTURE.md`): `surface`, `surface-elevated`, `on-surface`, `muted`, `accent`, `accent-hover`, `border-subtle` — no change to this set or naming requested.

### Component De-duplication Scope
- **D-02:** Extract the repeated section wrapper (title + spacing/padding pattern currently duplicated across AboutMe, Projects, Contacts) into a shared component (e.g. `app/shared/Section.tsx`), reused by all three — same visual output, no structural change to the page.
- **D-03:** Do NOT extract a shared Card component. `InfoCard`/`ExperienceCard` (AboutMe) and `ProjectContainer` (Projects) stay in their own feature folders — only their hardcoded color classes are replaced with semantic tokens. They're specific enough per-feature that the user preferred not to force a shared abstraction.
- **D-04:** Extract a shared Button component (e.g. `app/shared/Button.tsx`) for the repeated CTA button style (`rounded-lg bg-purple-500 px-4 py-2` pattern) used in Header and Hero.

### Visual Regression Verification
- **D-05:** Set up Playwright as a **permanent devDependency** (not a throwaway script) — this is a deliberate, user-approved scope addition beyond the original 4-phase plan, since the project currently has zero test coverage (per `.planning/codebase/CONCERNS.md`).
- **D-06:** Configure Playwright generically enough to support both visual-regression (screenshot diff, e.g. via `toHaveScreenshot()` or a pixelmatch-based comparison) AND future behavioral tests (e.g. dark-mode toggle behavior in Phase 2, language toggle in Phase 3) — even though only visual-regression tests are written in this phase.
- **D-07:** Verification method: capture full-page/per-section screenshots of the current (pre-refactor) UI as baseline, then re-capture after the token/component refactor and diff — the refactor is only "done" when the diff shows no unintended visual change.

### Claude's Discretion
- Exact Playwright config shape (test file layout, screenshot naming, diff threshold) — left to planning/execution.
- Whether `Section.tsx` takes a `title` prop + children, or a more specific API — left to planning.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — core value (no content/structure changes), 4-phase scope, key decisions log
- `.planning/REQUIREMENTS.md` — THEME-01 through THEME-04 (this phase's requirements)
- `.planning/ROADMAP.md` — Phase 1 entry (goal, success criteria, dependencies)

### Research
- `.planning/research/SUMMARY.md` — executive summary, recommended stack, critical pitfalls
- `.planning/research/ARCHITECTURE.md` — proposed semantic token set and naming (`surface`, `surface-elevated`, `on-surface`, `muted`, `accent`, `accent-hover`, `border-subtle`), `@custom-variant dark` mechanism, provider placement guidance
- `.planning/research/PITFALLS.md` — Tailwind v4 dark-mode mechanics (no more `tailwind.config.js` `darkMode` option), dynamically-constructed class name pitfall (Tailwind's compiler drops `` `bg-${color}-500` `` style strings silently), stale CONCERNS.md advice to ignore

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — naming patterns, Tailwind usage conventions, component patterns (compound components, props typing)
- `.planning/codebase/STRUCTURE.md` — feature-folder layout, `app/shared/` for reusable components, path alias `~/*`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/shared/TechBadge.tsx` — existing shared component pattern to follow when creating `Section.tsx` and `Button.tsx`
- `app/app.css` — only defines `--font-sans` currently; this is where the new `@theme` token block and `@custom-variant dark` directive go

### Established Patterns
- Feature folders each have `index.tsx` (component), `data.tsx` (static data), `types.tsx` (types) — no barrel files, direct imports
- Compound components pattern: internal (non-exported) subcomponents live in the same file as the main component (e.g., `AboutMe/index.tsx` has `SectionTitle`, `InfoCard`, `ExperienceCard`)
- Tailwind classes written as multi-line strings for readability; color scheme is currently `zinc-*` + `purple-*` accent
- Path alias `~/*` maps to `./app/*` — use for all new shared component imports

### Integration Points
- New `app/shared/Section.tsx` and `app/shared/Button.tsx` will be imported into `AboutMe/index.tsx`, `Projects/index.tsx`, `Contacts/index.tsx` (Section) and `Header/index.tsx`, `Hero/index.tsx` (Button)
- Playwright config and test files are new additions at the project root (e.g. `playwright.config.ts`, `tests/` or `e2e/` directory) — first test infrastructure in this codebase

</code_context>

<specifics>
## Specific Ideas

No further specific visual references beyond what's captured in Decisions — the existing purple/zinc palette is being tokenized, not redesigned.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. The Playwright test infrastructure decision (D-05/D-06) is a scope addition but was explicitly approved by the user in this discussion, not deferred.

</deferred>

---

*Phase: 1-Theme/CSS Token Centralization*
*Context gathered: 2026-07-06*
