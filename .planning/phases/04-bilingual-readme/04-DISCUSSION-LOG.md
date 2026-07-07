# Phase 4: Bilingual README - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 4-Bilingual README
**Areas discussed:** README content scope, Live demo link

---

## README content scope

| Option | Description | Selected |
|--------|-------------|----------|
| Full README | Features, Tech Stack, Getting Started (clone/install/run), Project Structure overview, License | ✓ |
| Standard | Features, Tech Stack, Getting Started only | |
| Minimal | Features + Tech Stack only (literal DOCS-01/02 wording) | |

**User's choice:** Full README
**Notes:** Reads like a professional portfolio project a recruiter or fellow dev would want to explore/run locally.

| Option | Description | Selected |
|--------|-------------|----------|
| Add MIT LICENSE file | Create a LICENSE file (MIT) and reference it in the README | ✓ |
| State "All rights reserved" | Note in the README that the code is not open for reuse, no LICENSE file added | |
| Omit the section | Skip License entirely | |

**User's choice:** Add MIT LICENSE file
**Notes:** No LICENSE file existed in the repo prior to this discussion.

| Option | Description | Selected |
|--------|-------------|----------|
| npm only | clone → npm install → npm run dev | |
| npm + Docker | Document both the npm dev workflow and the Docker production build | ✓ |

**User's choice:** npm + Docker
**Notes:** Repo has a multi-stage Dockerfile (Node 20 Alpine) already committed; should be documented alongside the simpler npm workflow.

---

## Live demo link

| Option | Description | Selected |
|--------|-------------|----------|
| No live URL | Skip the Live Demo section entirely | |
| Yes, provide URL now | User supplies a live URL to link | ✓ |

**User's choice:** `https://lsiqueira.dev.br`
**Notes:** Include a Live Demo section/link in both README files.

---

## Claude's Discretion

- Screenshots/visuals — not discussed; defaulted to text-only README (no screenshots/GIFs) as the lower-effort default.
- Cross-link banner exact style/wording — not discussed in detail; defaulted to a short text line at the top of each file with a working relative link.
- Feature description prose depth/tone — portfolio pitch style, not a code walkthrough.
- README.en.md translation mechanism — content parity required (same sections/information), exact phrasing left to Claude, mirroring the I18N-06 "translate meaning, not reword" precedent from Phase 3.

## Deferred Ideas

None — discussion stayed within phase scope.
