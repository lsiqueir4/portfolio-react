# Phase 2: Dark Mode Toggle - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a manual dark/light theme toggle to the Header. Default theme on first visit follows the browser's `prefers-color-scheme` with no flash of the wrong theme before paint (SSR-safe). A manual toggle choice persists across visits via localStorage, overriding the browser default. The purple accent color remains the primary accent in both themes — only background/text tokens invert. The "detect default → allow override → persist" logic is built as a reusable primitive that Phase 3 (language toggle) will reuse. This phase does NOT touch content/copy/structure, and does NOT add a three-way toggle (System/Light/Dark) — binary only, per REQUIREMENTS.md.

</domain>

<decisions>
## Implementation Decisions

### Token Foundation (carried forward from Phase 1)
- **D-01:** The 8 semantic tokens (`surface`, `surface-elevated`, `on-surface`, `muted`, `muted-hover`, `accent`, `accent-hover`, `border-subtle`) and the `@custom-variant dark (&:where(.dark, .dark *));` directive already exist in `app/app.css` (Phase 1). This phase adds the `.dark { }` override block with light-mode values and the toggle UI that flips the `.dark` class on `<html>`.

### Claude's Discretion
User was offered three gray areas (light-mode palette values, toggle transition/animation feel, and toggle icon/placement) and explicitly declined discussion, choosing to leave all three as implementation details for Claude to decide during planning/research:
- **Light-mode palette values:** The actual light-mode color values each token resolves to (e.g., `surface` → white or off-white, `on-surface` → near-black or dark gray). Must satisfy DARK-04 (purple accent stays primary/identical in both themes; only background/text invert). Research should ground this in accessible contrast ratios against the existing purple accent.
- **Toggle transition feel:** Whether theme switching is an instant snap or an animated color transition, and whether the sun/moon icon itself animates (rotate/cross-fade) or swaps instantly.
- **Toggle icon & placement:** Confirmed `lucide-react` is already the icon library in use in Header (`Download`, `Menu`, `Send`, `X` are already imported) — a `Sun`/`Moon` icon pair from the same library is the natural fit. Exact position in the desktop nav bar and treatment in the mobile menu are left to planning.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — core value (no content/structure changes), 4-phase scope, key decisions log
- `.planning/REQUIREMENTS.md` — DARK-01 through DARK-05 (this phase's requirements), plus the "Out of Scope" table (binary toggle only, no locale-prefixed routes, etc.)
- `.planning/ROADMAP.md` — Phase 2 entry (goal, success criteria, dependencies on Phase 1)

### Prior Phase
- `.planning/phases/01-theme-css-token-centralization/01-CONTEXT.md` — the locked 8-token set and D-01a amendment (why there are 8 tokens, not 7)
- `.planning/phases/01-theme-css-token-centralization/01-05-SUMMARY.md` — confirms the `@custom-variant dark` mechanism compiles but has no `.dark {}` override values yet (that's this phase's job)
- `app/app.css` — current token definitions this phase extends with light-mode overrides

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — naming patterns, Tailwind usage conventions
- `.planning/codebase/STRUCTURE.md` — feature-folder layout, `app/shared/` for reusable components, path alias `~/*`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/shared/Button.tsx`, `app/shared/Section.tsx` (Phase 1) — existing shared-component conventions to mirror if a new shared toggle/primitive component is created
- `app/features/Header/index.tsx` — already imports `lucide-react` icons (`Download`, `Menu`, `Send`, `X`) and has both desktop nav and mobile menu rendering paths; the toggle button needs to appear in both

### Established Patterns
- Feature folders: `index.tsx` (component), `data.tsx` (static data), `types.tsx` (types) — no barrel files
- `app/shared/` holds reusable cross-feature components (mirrors `TechBadge.tsx`, `Button.tsx`, `Section.tsx` conventions)
- Header currently uses local `useState` for mobile menu open/close — no existing global/shared state mechanism; DARK-05's reusable persistence primitive will be the first of its kind in this codebase

### Integration Points
- New toggle button renders inside `app/features/Header/index.tsx` (both desktop and mobile menu markup)
- The dark/light persistence primitive (DARK-05) should live somewhere reusable (e.g. `app/shared/` or a new `app/hooks/` location) so Phase 3's language toggle can reuse the same detect→override→persist pattern
- SSR-safe pre-hydration script (to avoid flash-of-wrong-theme) needs to run in `app/root.tsx`, before React hydrates

</code_context>

<specifics>
## Specific Ideas

No specific visual references beyond what's captured in Decisions — user deferred palette/transition/icon details to Claude's discretion during planning/research.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-Dark Mode Toggle*
*Context gathered: 2026-07-07*
