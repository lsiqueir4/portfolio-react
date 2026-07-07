# Phase 4: Bilingual README - Pattern Map

**Mapped:** 2026-07-07
**Files analyzed:** 3 (`README.md` rewrite, `README.en.md` new, `LICENSE` new)
**Analogs found:** 1 / 3 (partial — see note below)

## Note on Scope

This phase is documentation-only — no application code (controllers, services, components) is created or modified. There is no analogous role/data-flow classification (CRUD, request-response, etc.) that applies. Instead, the "pattern" here is **content/tone/structure precedent**: the current `README.md`, `package.json` scripts, and `Dockerfile` build steps are the sources of truth the new docs must reflect verbatim. There is no existing `LICENSE`, `CONTRIBUTING.md`, or other markdown doc in the repo to use as a structural analog for a bilingual README — this is a genuinely new artifact type for the repo, so RESEARCH-style external convention (standard bilingual README banner pattern) is used instead of an in-repo analog for structure, while in-repo files anchor exact content.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `README.md` (rewrite, PT-BR) | documentation | static content | current `README.md` (being replaced) | exact (self — content source, not structure) |
| `README.en.md` (new, EN) | documentation | static content | rewritten `README.md` (mirror/translate) | role-match (sibling file, not pre-existing) |
| `LICENSE` (new, MIT) | config/legal | static content | none in repo | no analog |

## Pattern Assignments

### `README.md` (documentation, static content — full rewrite)

**Analog:** existing `README.md` (content to retire) + `package.json` + `Dockerfile` (content sources, not structural analogs)

**Current README.md in full** (4 lines — the exact content being retired):
```markdown
# Portfolio

Este projeto está sendo desenvolvido em React, Typescript e utilizando TaildwindCSS para estilo.

## TODO
- Padronizar Temas no arquivo CSS, definir padrao de cores, texto etc
- Adicionar dark mode
- Adicionar suporte para inglês
```
Per D-01/D-04 and the `<specifics>` note in CONTEXT.md, this exact TODO list (3 items) must be removed and replaced with a Features section documenting them as shipped (Phase 1 theme tokens, Phase 2 dark mode, Phase 3 EN/PT toggle).

**Getting Started — npm scripts to copy verbatim** (source: `package.json` lines 5-15):
```json
"scripts": {
  "build": "react-router build",
  "dev": "react-router dev",
  "start": "react-router-serve ./build/server/index.js",
  "typecheck": "react-router typegen && tsc",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier . --write",
  "format:check": "prettier . --check",
  "test:visual": "playwright test"
}
```
Do not invent script names or flags — the Getting Started section's `npm install` → `npm run dev` workflow must reference exactly `dev`, `build`, `start` as they appear here (per D-02). Other scripts (`typecheck`, `lint`, `format`, `test:visual`) may optionally be mentioned as dev tooling but are not required by D-02.

**Getting Started — Docker workflow to copy verbatim** (source: `Dockerfile`, full file, 22 lines):
```dockerfile
FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
```
Per D-02, the README's Docker instructions should describe `docker build` → `docker run` and note the final container CMD is `npm run start` (already the literal last line of the Dockerfile) — do not describe additional deployment/orchestration steps (no compose file, no env vars) since none exist in this Dockerfile.

**Tech Stack section — dependencies to cite** (source: `package.json` lines 16-28, and `.planning/codebase/STACK.md` for verified versions):
```json
"dependencies": {
  "@fontsource/outfit": "^5.2.8",
  "@react-router/node": "7.15.1",
  "@react-router/serve": "7.15.1",
  "i18next": "^26.3.4",
  "isbot": "^5.1.36",
  "lucide-react": "^1.17.0",
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-i18next": "^17.0.8",
  "react-icons": "^5.6.0",
  "react-router": "7.15.1"
}
```
Use these for the Tech Stack section rather than re-deriving versions elsewhere; cross-check against `.planning/codebase/STACK.md` if version discrepancies arise (STACK.md is the "verified" source per CONTEXT.md canonical_refs).

**Project Structure section — feature-folder pattern to describe** (verified via repo listing):
```
app/features/
  ├── AboutMe/
  ├── Contacts/
  ├── Footer/
  ├── Header/
  ├── Hero/
  └── Projects/
```
Each feature folder follows `index.tsx` (component) / `data.tsx` (static data) / `types.tsx` (TypeScript types) per project convention (see CLAUDE.md "Component Patterns" and "Key Abstractions" sections). Per D-03, this is a brief overview only — do not produce a full recursive file tree.

**Cross-link banner pattern** (no in-repo precedent — external GitHub convention, per CONTEXT.md Claude's Discretion):
```markdown
🇧🇷 Português | 🇺🇸 [English](README.en.md)
```
Mirror in `README.en.md` as:
```markdown
🇺🇸 English | 🇧🇷 [Português](README.md)
```
Place at the very top of each file, above the title, per CONTEXT.md discretion note.

---

### `README.en.md` (documentation, static content — new file)

**Analog:** the rewritten `README.md` (same phase, same commit) — this file mirrors it section-for-section per D-01/DOCS-02 content parity requirement. No separate structural analog needed; translate meaning (not reword) per the I18N-06 precedent cited in CONTEXT.md (Phase 3's approach to translation fidelity).

Sections required (same for both files, per D-01):
1. Cross-link banner (top)
2. Title
3. Live Demo (`https://lsiqueira.dev.br`, per D-06 — placed near top, after banner)
4. Features (dark/light toggle, PT-BR/EN toggle, six portfolio sections, centralized theme tokens — per D-04)
5. Tech Stack
6. Getting Started (npm workflow + Docker workflow — per D-02)
7. Project Structure overview (per D-03)
8. License (references root `LICENSE` file — per D-05)

---

### `LICENSE` (new file, MIT)

**Analog:** none in repo. Use the standard MIT License boilerplate text (year 2026, copyright holder Leandro Siqueira per project author). No in-repo formatting precedent exists; this is a new root-level artifact per D-05. Reference it from both README files' License sections as `[LICENSE](LICENSE)` (relative link).

---

## Shared Patterns

### Content-accuracy-over-invention
**Source:** `package.json`, `Dockerfile` (both read in full above)
**Apply to:** Both `README.md` and `README.en.md`
Every command, script name, and build step mentioned in Getting Started must be copied verbatim from these two files — do not paraphrase into slightly-wrong commands (explicit CONTEXT.md instruction, canonical_refs section).

### Bilingual parity without literal duplication
**Source:** Phase 3 i18n precedent (`.planning/phases/03-language-toggle-i18n/` SUMMARY files — not re-read here, already summarized in CONTEXT.md canonical_refs)
**Apply to:** `README.en.md` relative to `README.md`
Same sections, same information, but Claude has discretion on exact prose — "translate meaning, not reword," per D- discretion notes.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `LICENSE` | config/legal | static content | No LICENSE, CONTRIBUTING, or similar legal/meta doc exists anywhere in this repo; use standard MIT boilerplate, not an in-repo pattern |
| `README.en.md` (as a *structural* precedent, not content mirror) | documentation | static content | No existing bilingual-doc convention in this repo; Phase 3's in-app i18n catalogs (`pt`/`en`) are the closest conceptual precedent but are code (JSON/TS catalogs), not markdown — cited for spirit, not structure |

## Metadata

**Analog search scope:** repo root (`README.md`, `package.json`, `Dockerfile`), `app/features/*` (directory listing only), `.planning/codebase/` (referenced, not deep-read)
**Files scanned:** 4 read in full (`README.md`, `package.json`, `Dockerfile`, `04-CONTEXT.md`) + 1 directory listing (`app/features/`)
**Pattern extraction date:** 2026-07-07
