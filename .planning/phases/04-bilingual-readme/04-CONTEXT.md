# Phase 4: Bilingual README - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite the project README as two cross-linked files — `README.md` (PT-BR) and `README.en.md` (EN) — so a reader in either language can understand the portfolio's features and tech stack and jump to the other language version. This is a documentation-only phase: no site code, content, structure, or existing links change (I18N-08-style preservation applies to the *site*, not to this new README content).

Current `README.md` is 4 lines: a title, one paragraph, and the exact TODO list ("Padronizar Temas...", "Adicionar dark mode", "Adicionar suporte para inglês") that Phases 1–3 of this milestone already closed. This phase retires that TODO list by documenting the finished feature set instead.

</domain>

<decisions>
## Implementation Decisions

### README content scope
- **D-01:** Full README for both languages — Features, Tech Stack, Getting Started, Project Structure overview, License, Live Demo, plus the required cross-link banner. Not the minimal "Features + Tech Stack only" literal reading of DOCS-01/02.
- **D-02:** Getting Started documents BOTH workflows: local npm dev (`npm install` → `npm run dev`) AND the Docker multi-stage build already in `Dockerfile` (`docker build` → `docker run`, `npm run start` as the container CMD). Do not invent deployment steps beyond what the Dockerfile actually does.
- **D-03:** Project Structure section is a brief overview (feature-folder pattern: `app/features/{Header,Hero,Projects,AboutMe,Contacts,Footer}` each with `index.tsx`/`data.tsx`/`types.tsx`), not a full recursive file tree.
- **D-04:** Features section documents the finished milestone feature set: dark/light theme toggle (Phase 2), PT-BR/EN language toggle (Phase 3), the six portfolio sections, and the centralized theme tokens (Phase 1) as an engineering highlight, not just user-facing features.

### License
- **D-05:** Add an MIT `LICENSE` file at the repo root (none currently exists) and reference it from both README files' License section. This is a new repo artifact, in scope for this phase since it's part of "highlighting the tech stack" as a shareable OSS-style project.

### Live demo
- **D-06:** Live URL is `https://lsiqueira.dev.br` — include a "Live Demo" section/link near the top of both README files (after the language-switch banner).

### Cross-link banner
### Claude's Discretion
- **Screenshots:** Not discussed — default to text-only README (no screenshots/GIFs). Adding visual captures would require running the live site and capturing images, which is a meaningfully larger unit of work than a content rewrite; if the user wants screenshots later it can be a fast follow-up, not blocking this phase.
- **Cross-link banner style:** Not discussed in detail — implement as a short text line at the very top of each file (e.g., `🇧🇷 Português | 🇺🇸 [English](README.en.md)` in README.md, mirrored in README.en.md), consistent with common bilingual-README conventions on GitHub. Planner/executor may adjust exact wording/emoji as long as it's a clear, working relative link at the top of both files.
- **Feature description depth:** Claude has discretion on exact prose length/tone for the Features section — should read like a portfolio pitch (what the site does) rather than a component-by-component code walkthrough.
- **Content parity mechanism:** Claude has discretion on whether README.en.md is a literal section-by-section mirror or adapted phrasing, as long as DOCS-02's "content parity" requirement (same sections, same information) is met — this mirrors the I18N-06 "translate meaning, not reword" precedent from Phase 3, applied to README prose rather than site strings.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & project scope
- `.planning/REQUIREMENTS.md` — DOCS-01, DOCS-02, DOCS-03 (full requirement text + Out of Scope table)
- `.planning/PROJECT.md` — Core Value, Constraints (content/structure preservation applies to the SITE, not this new README), Key Decisions table
- `.planning/ROADMAP.md` §"Phase 4: Bilingual README" — Goal and Success Criteria

### Source of truth for README content (must reflect actual repo state, not invented)
- `README.md` — current PT-BR file being rewritten (existing TODO list to retire)
- `package.json` — exact dependency versions and npm scripts (`dev`, `build`, `start`, `typecheck`, `lint`, `format`, `test:visual`) for the Tech Stack and Getting Started sections
- `Dockerfile` — actual multi-stage build steps (development-dependencies-env → production-dependencies-env → build-env → final stage running `npm run start`) for the Docker Getting Started subsection — do not describe steps the Dockerfile doesn't have
- `.planning/codebase/STACK.md` — verified tech stack inventory (React 19.2.6, React Router 7.15.1 SSR, Tailwind CSS 4.2.2, TypeScript 5.9.3, i18next/react-i18next, etc.)
- `.planning/codebase/STRUCTURE.md` — verified directory layout and feature-folder pattern for the Project Structure section

### Prior-phase feature context (what to describe as "finished features")
- `.planning/phases/01-theme-css-token-centralization/01-SUMMARY.md` (or its plan files) — centralized theme token system, if worth a tech-highlight mention
- `.planning/phases/02-dark-mode-toggle/` SUMMARY files — dark/light toggle behavior to describe accurately
- `.planning/phases/03-language-toggle-i18n/` SUMMARY files — PT-BR/EN toggle behavior to describe accurately

No other external specs/ADRs exist for this phase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None needed — this phase produces Markdown files (`README.md`, `README.en.md`, `LICENSE`), not application code.

### Established Patterns
- Repo already has bilingual precedent in the app itself (Phase 3's `pt`/`en` i18n catalogs) — the README's PT-BR/EN split should feel like a natural extension of that existing choice, not a new convention.
- `package.json` scripts are the single source of truth for any command shown in Getting Started — copy them verbatim, don't paraphrase into slightly-wrong commands.

### Integration Points
- None — README/LICENSE are standalone root-level files, not imported by app code. No routes, nav, or component changes.

</code_context>

<specifics>
## Specific Ideas

- Live demo URL: `https://lsiqueira.dev.br`
- Retire the exact 3-item TODO list currently in README.md ("Padronizar Temas...", "Adicionar dark mode", "Adicionar suporte para inglês") since all three are now shipped — replace with the Features section describing them as delivered.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Screenshots were explicitly deferred to Claude's discretion (see above) rather than ruled out; a future fast-follow could add them without a new phase.

</deferred>

---

*Phase: 4-Bilingual README*
*Context gathered: 2026-07-07*
