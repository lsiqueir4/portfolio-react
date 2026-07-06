# Phase 1: Theme/CSS Token Centralization - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 1-Theme/CSS Token Centralization
**Areas discussed:** Verificação visual, Escopo de de-dup

---

## Verificação Visual

| Option | Description | Selected |
|--------|-------------|----------|
| Screenshot antes/depois | Tirar screenshot de cada seção antes/depois e comparar lado a lado | |
| Revisão classe-por-classe | Conferir mapeamento de classe antiga → token, sem rodar o app | |
| Ambos | Mapeamento documentado + screenshot de confirmação | |

**User's choice:** Perguntou se dava para automatizar de forma mais confiável e menos trabalhosa — levou a uma nova pergunta sobre automação.

| Option | Description | Selected |
|--------|-------------|----------|
| Script descartável | Playwright via npx, só para essa fase, sem virar dependência | |
| Suíte permanente | Playwright como devDependency real, testes formais que ficam no repositório | ✓ |

**User's choice:** Suíte permanente

| Option | Description | Selected |
|--------|-------------|----------|
| Só visual regression por agora | Playwright restrito a screenshot diff nesta fase | |
| Já deixar genérico para os dois tipos | Configurar Playwright para visual regression + testes de comportamento futuros | ✓ |

**User's choice:** Já deixar genérico para os dois tipos
**Notes:** Decisão expande o escopo original (projeto não tinha nenhum teste antes) — aprovada explicitamente pelo usuário, não é scope creep não solicitado.

---

## Escopo de de-dup

| Option | Description | Selected |
|--------|-------------|----------|
| Sim, extrair (Section wrapper) | Componente compartilhado `app/shared/Section.tsx` reaproveitado por AboutMe/Projects/Contacts | ✓ |
| Não, só trocar cores | Manter wrappers como estão, só trocar classes de cor | |

**User's choice:** Sim, extrair

| Option | Description | Selected |
|--------|-------------|----------|
| Extrair Card base compartilhado | Componente Card genérico em app/shared/ | |
| Manter separados por feature | InfoCard/ExperienceCard/ProjectContainer ficam cada um na sua feature | ✓ |

**User's choice:** Manter separados por feature

| Option | Description | Selected |
|--------|-------------|----------|
| Extrair Button compartilhado | Componente Button genérico em app/shared/ reaproveitado por Header/Hero | ✓ |
| Manter como está | Cada botão fica no lugar, só trocando cores | |

**User's choice:** Extrair Button compartilhado

---

## Claude's Discretion

- Exact Playwright config shape (test file layout, screenshot naming, diff threshold)
- Whether `Section.tsx` takes a `title` prop + children, or a more specific API

## Deferred Ideas

None — discussion stayed within phase scope.
