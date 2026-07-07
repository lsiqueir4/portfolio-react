# Phase 3: Language Toggle (i18n) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-07
**Phase:** 3-Language Toggle (i18n)
**Areas discussed:** Toggle UI pattern, Non-PT/EN browser fallback, Translation structure for data.tsx arrays

---

## Toggle UI pattern

### Question 1: Single flip-button vs. two-label switcher

| Option | Description | Selected |
|--------|-------------|----------|
| Single flip-button | Shows the language you'll switch TO, mirrors ThemeToggle's single-button interaction exactly | |
| Two-label switcher (PT \| EN) | Both codes always visible, active one highlighted, click either to select directly | ✓ |
| You decide | Leave to Claude's discretion | |

**User's choice:** Two-label switcher (PT | EN)

### Question 2: Active-language visual treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Accent-colored active label | Active code in purple accent color, inactive muted — matches existing HeaderButton hover convention | ✓ |
| Pill/background highlight | Active code in a rounded pill with background, mirrors ThemeToggle's bordered container | |
| You decide | Leave to Claude's discretion | |

**User's choice:** Accent-colored active label
**Notes:** Chose consistency with existing `text-accent-hover`/`text-muted` conventions already used in Header over introducing a new pill-container visual pattern.

---

## Non-PT/EN browser fallback

### Question: Fallback default for unrecognized browser locales

| Option | Description | Selected |
|--------|-------------|----------|
| PT-BR (site's native language) | Falls back to the CV's original source language for any unrecognized locale | |
| EN (broader reach) | Falls back to English for broader international-visitor reach | ✓ |
| You decide | Leave to Claude's discretion | |

**User's choice:** EN (broader reach)

---

## Translation structure for data.tsx arrays

### Question: Organization strategy for array-literal content

| Option | Description | Selected |
|--------|-------------|----------|
| i18next keys per entry | Data arrays keep current shape, text fields become translation keys resolved via `t()` in render | |
| Locale-keyed data objects | data.tsx exports separate PT/EN versions of each array directly | |
| You decide | Leave to Claude's discretion | ✓ |

**User's choice:** You decide

---

## Claude's Discretion

- **Translation structure for `data.tsx` arrays** (see above) — user explicitly deferred; CONTEXT.md notes a lean toward `react-i18next`-idiomatic key-based resolution but leaves the final call to research/planning.
- **Exact SSR fixed-default language value** — not explicitly re-confirmed as its own question (user did not select the "SSR default & hydration flash" gray area when choosing which areas to discuss). CONTEXT.md documents the strong existing-content signal (PT-BR) as an assumption to confirm during planning if it changes the approach materially.
- **Locale-matching precision** (e.g. `pt-PT` vs `pt-BR`, `en-GB` vs `en-US`) — treated as a pure technical detail, not raised as a product question.

## Deferred Ideas

None — discussion stayed within phase scope.
