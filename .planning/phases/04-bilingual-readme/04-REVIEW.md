---
phase: 04-bilingual-readme
reviewed: 2026-07-07T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - LICENSE
  - README.en.md
  - README.md
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-07-07T00:00:00Z
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed the new root `LICENSE` and the rewritten `README.md` (PT-BR) / `README.en.md` (EN) pair for the bilingual-README phase. Verified every checkable factual claim against the actual codebase:

- Cross-links between `README.md` ↔ `README.en.md` ↔ `LICENSE` are all correct relative paths that resolve on GitHub.
- Getting Started commands (`npm install`, `npm run dev`, `npm run build`, `npm run start`) match `package.json` scripts exactly.
- Docker instructions (`docker build`, `docker run -p 3000:3000`) match the multi-stage `Dockerfile`; the final `CMD ["npm", "run", "start"]` is correctly described, and `@react-router/serve`'s default port (3000, absent a `PORT` env var) makes the `-p 3000:3000` mapping accurate.
- Version numbers cited (React 19.2.6, React Router 7.15.1, TypeScript 5.9.3, Tailwind CSS 4.2.2) match `package.json` exactly — no fabricated versions.
- Feature claims (dark mode toggle with `localStorage` + `prefers-color-scheme` + no-flash pre-render script, i18n toggle with `react-i18next` + browser detection + persistence, six sections, centralized theme tokens, shared `Section`/`Button` components) all trace to real code introduced in prior phases (02, 03) — nothing fabricated.
- Old TODO list in the original `README.md` was correctly retired and replaced.
- `git diff` confirms the phase touched only `LICENSE`, `README.md`, `README.en.md`, plus a planning summary file — no accidental site content/code changes.
- Section structure (headings, order, and count) is in exact 1:1 parity between the two README files.

One inaccurate architectural claim was found in the "Project Structure" / "Estrutura do Projeto" section (present identically in both files), which overstates a convention that isn't actually followed by several feature directories in this codebase. Two minor completeness/consistency nits are also noted.

## Warnings

### WR-01: "Project Structure" section overstates the index/data/types convention

**File:** `README.md:58`, `README.en.md:58`
**Issue:** Both READMEs state (PT-BR): "Cada diretório de feature segue o padrão `index.tsx` (componente), `data.tsx` (dados estáticos) e `types.tsx` (tipos TypeScript)." / (EN): "Each feature directory follows the `index.tsx` (component), `data.tsx` (static data), and `types.tsx` (TypeScript types) pattern." This is not true for the actual feature directories in this codebase:
- `app/features/Header/` has `index.tsx`, `types.tsx`, plus `LanguageToggle.tsx` and `ThemeToggle.tsx` — no `data.tsx`.
- `app/features/Hero/` has `index.tsx`, `data.tsx` — no `types.tsx`.
- `app/features/Contacts/` has only `index.tsx` — no `data.tsx`, no `types.tsx`.
- `app/features/Footer/` has only `index.tsx` — no `data.tsx`, no `types.tsx`.

Only `Projects/` and `AboutMe/` actually match the stated three-file pattern. A new contributor reading "Project Structure" and going to add or modify `Header`/`Contacts`/`Footer` would be misled about what files to expect/create.
**Fix:** Soften the claim to reflect reality, e.g.:
```markdown
O código-fonte fica em `app/features/`, com um diretório por seção do portfolio: `Header`, `Hero`, `Projects`, `AboutMe`, `Contacts` e `Footer`. A maioria das features usa o padrão `index.tsx` (componente) mais, quando necessário, `data.tsx` (dados estáticos) e/ou `types.tsx` (tipos TypeScript); algumas features (como `Contacts` e `Footer`) contêm apenas `index.tsx`.
```
and the equivalent adjustment in `README.en.md`.

## Info

### IN-01: `test:visual` script omitted from "Getting Started"

**File:** `README.md:29-54`, `README.en.md:29-54`
**Issue:** `package.json` defines a `test:visual` script (`playwright test`) that isn't mentioned anywhere in either README's Getting Started section. Not a blocker for this docs-only phase, but a contributor won't discover the visual-regression test suite from the README.
**Fix:** Optionally add a short "Running Tests" subsection noting `npm run test:visual` runs the Playwright visual suite.

### IN-02: Dockerfile has no `EXPOSE` directive

**File:** `README.md:47-54`, `README.en.md:47-54`
**Issue:** The README's Docker instructions are functionally correct (port mapping works regardless of `EXPOSE`), but the `Dockerfile` itself has no `EXPOSE 3000` directive, so the "3000" the README hardcodes depends entirely on `@react-router/serve`'s undocumented-in-README default (`get-port` preferring 3000, falling back to another port if 3000 is taken). This is not a README bug per se, but the README doesn't mention that the port is configurable via the `PORT` env var, which would be useful if a user's port 3000 is already occupied.
**Fix:** Optionally add a note: "The server listens on `PORT` (default `3000`) — pass `-e PORT=8080 -p 8080:8080` to use a different port."

---

_Reviewed: 2026-07-07T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
