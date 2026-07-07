---
phase: 03-language-toggle-i18n
fixed_at: 2026-07-07T18:38:26Z
review_path: .planning/phases/03-language-toggle-i18n/03-REVIEW.md
iteration: 1
findings_in_scope: 2
fixed: 2
skipped: 0
status: all_fixed
---

# Phase 03: Code Review Fix Report

**Fixed at:** 2026-07-07T18:38:26Z
**Source review:** .planning/phases/03-language-toggle-i18n/03-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 2 (fix_scope: critical_warning — 0 Critical, 2 Warning)
- Fixed: 2
- Skipped: 0

Note: IN-01 and IN-02 (Info-severity) were out of scope for this run (`fix_scope: critical_warning`) and were not attempted. They remain open in `03-REVIEW.md` for a future `--fix --scope all` pass or manual cleanup.

## Fixed Issues

### WR-01: `detectBrowserLanguage()` is not actually "byte-for-byte identical" to the root.tsx script it must mirror, and can throw

**Files modified:** `app/hooks/useLanguage.ts`
**Commit:** `04c9314`
**Applied fix:** Guarded the `navigator.language` read with `(navigator.language || "")` before calling `.toLowerCase()`, matching `root.tsx`'s `languageInitScript` exactly, and collapsed the now-redundant explicit `en` branch so any non-`pt` locale defaults to `en` — restoring the "byte-for-byte identical" contract between the two implementations and eliminating the `TypeError` that could crash the initial render (and trip the top-level `ErrorBoundary`) in environments where `navigator.language` is `undefined`.

### WR-02: `LanguageToggle`'s group `aria-label` is hardcoded in Portuguese and never localizes

**Files modified:** `app/features/Header/LanguageToggle.tsx`, `app/i18n/locales/pt.ts`, `app/i18n/locales/en.ts`
**Commit:** `a4330dd`
**Applied fix:** Added a new `header.selectLanguage` translation key (`"Selecionar idioma"` in `pt.ts`, `"Select language"` in `en.ts`) and wired `LanguageToggle` to read it via `useTranslation()`/`t()`, so the group's `aria-label` now correctly localizes along with the rest of the header's accessible labels instead of staying hardcoded in Portuguese regardless of the active language.

## Skipped Issues

None — both in-scope findings (WR-01, WR-02) were fixed successfully.

---

_Fixed: 2026-07-07T18:38:26Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
