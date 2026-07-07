---
phase: 03-language-toggle-i18n
reviewed: 2026-07-07T00:00:00Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - app/constants/language.ts
  - app/features/AboutMe/data.tsx
  - app/features/AboutMe/index.tsx
  - app/features/AboutMe/types.tsx
  - app/features/Contacts/index.tsx
  - app/features/Footer/index.tsx
  - app/features/Header/LanguageToggle.tsx
  - app/features/Header/index.tsx
  - app/features/Hero/index.tsx
  - app/features/Projects/data.tsx
  - app/features/Projects/index.tsx
  - app/features/Projects/types.tsx
  - app/hooks/useLanguage.ts
  - app/i18n/config.ts
  - app/i18n/locales/en.ts
  - app/i18n/locales/pt.ts
  - app/root.tsx
  - tests/language-toggle.spec.ts
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-07-07T00:00:00Z
**Depth:** standard
**Files Reviewed:** 17
**Status:** issues_found

## Summary

Reviewed the i18n/language-toggle implementation: the shared `LANGUAGE_STORAGE_KEY` constant, the `useLanguage` hook built on top of the pre-existing `usePersistedPreference` store, the `LanguageToggle` component, the SSR no-flash blocking script in `root.tsx`, the `en`/`pt` translation catalogs, and every feature component (`Hero`, `AboutMe`, `Projects`, `Contacts`, `Footer`, `Header`) that was wired to `useTranslation()`/`t()`. `tsc --noEmit` and `eslint` both pass clean on the reviewed files (the one pre-existing `react-refresh/only-export-components` warning on `root.tsx` predates this phase and isn't caused by the language additions).

No security vulnerabilities, XSS, or injection issues were found — the two `dangerouslySetInnerHTML` blocking scripts in `root.tsx` only interpolate compile-time constants (`THEME_STORAGE_KEY`, `LANGUAGE_STORAGE_KEY`), never runtime/user-controlled values, and `escapeValue: false` in the i18next config is safe because all translated strings are rendered through JSX text nodes (React's own escaping), never through `dangerouslySetInnerHTML`.

The `en`/`pt` catalogs are structurally locked together (`en` is typed as `typeof pt`), and every dynamic key built from `data.tsx` ids (`about.experiences.${id}`, `about.courses.${id}`, `projects.${id}`) resolves correctly against both catalogs today — but see IN-02 for the lack of compile-time protection against future id/catalog drift.

Two real defects were found: a robustness gap in `useLanguage.ts`'s browser-locale detection that contradicts the file's own "byte-for-byte identical to root.tsx" contract and can throw during initial render, and an accessibility regression where `LanguageToggle`'s group `aria-label` is hardcoded in Portuguese and never changes when the user switches to English — ironic for the exact component whose job is to switch languages. Also flagged: one piece of dead code left behind by the `AboutMe` data-model refactor.

## Warnings

### WR-01: `detectBrowserLanguage()` is not actually "byte-for-byte identical" to the root.tsx script it must mirror, and can throw

**File:** `app/hooks/useLanguage.ts:12-18`
**Issue:** The comment above this function states: "Keep this fallback logic byte-for-byte identical to the blocking script in app/root.tsx (languageInitScript) — if one changes, update the other." The two implementations have actually diverged:

```ts
// app/hooks/useLanguage.ts
function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "pt";
  const locale = navigator.language.toLowerCase();   // <-- no guard for navigator.language being undefined/falsy
  if (locale.startsWith("pt")) return "pt";
  if (locale.startsWith("en")) return "en";
  return "en";
}
```
```js
// app/root.tsx (languageInitScript)
var locale = (navigator.language || "").toLowerCase();   // <-- guarded
lang = locale.indexOf("pt") === 0 ? "pt" : "en";
```

`root.tsx` defensively falls back to `""` if `navigator.language` is falsy; the hook does not. If `navigator` exists but `navigator.language` is `undefined` (seen in some restricted WebViews/embedded browsers/test harnesses), `navigator.language.toLowerCase()` throws a `TypeError`. This call happens inside `usePersistedPreference`'s `createStore()`, at `const serverSnapshot = detectBrowserDefault();` (module-level, executed synchronously during the first render, outside any try/catch) — so the throw is not swallowed and will bubble up through render, only caught by the top-level `ErrorBoundary` in `root.tsx`, replacing the entire page with the generic error UI instead of just falling back to a default language.

**Fix:** Guard the read exactly like the script does, keeping the two truly identical:
```ts
function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "pt";
  const locale = (navigator.language || "").toLowerCase();
  if (locale.startsWith("pt")) return "pt";
  return "en";
}
```

### WR-02: `LanguageToggle`'s group `aria-label` is hardcoded in Portuguese and never localizes

**File:** `app/features/Header/LanguageToggle.tsx:9-10`
**Issue:** Every other accessible label added in this phase is correctly localized via `t()` (e.g. `Header`'s `aria-label={t("header.openMenu")}` at `app/features/Header/index.tsx:157`). `LanguageToggle`, however, hardcodes:
```tsx
<div role="group" aria-label="Selecionar idioma" ...>
```
This never changes even after the user switches the active language to English, so an English-speaking screen-reader user (the exact audience this feature is meant to accommodate) still hears "Selecionar idioma" instead of "Select language" for the one control whose entire purpose is language selection. `tests/language-toggle.spec.ts` doesn't catch this because its locator regex `/idioma|language/i` matches both languages by design, masking the gap.
**Fix:** Add a translation key and use it, e.g.:
```ts
// locales
header: { ..., selectLanguage: "Select language" / "Selecionar idioma" }
```
```tsx
const { t } = useTranslation();
...
<div role="group" aria-label={t("header.selectLanguage")} ...>
```

## Info

### IN-01: Dead `Course` interface left behind by the `AboutMe` data-model refactor

**File:** `app/features/AboutMe/types.tsx:8-12`
**Issue:** This phase's commit `191c9f3` (`feat(03-03): translate AboutMe experiences/courses data arrays`) migrated `app/features/AboutMe/data.tsx` from the old `Course`/`Experience` shapes to the new `CourseData`/`ExperienceData` shapes (id + static fields only, with translated fields now pulled from `t()`). The old `Course` interface (`name`, `institution`, `conclusionYear`) was left in `types.tsx` and is no longer imported or referenced anywhere in the codebase:
```ts
export interface Course {
  name: string;
  institution: string;
  conclusionYear: string;
}
```
This is confusing dead code, especially since it's easy to mistake for the new, similarly-named `CourseData`.
**Fix:** Delete the unused `Course` interface (keep `Experience`, which is still used by `ExperienceCard`'s props).

### IN-02: Dynamic i18n key construction has no compile-time link to `data.tsx` ids

**File:** `app/features/AboutMe/index.tsx:214-219,271-272`, `app/features/Projects/index.tsx:180-181`
**Issue:** Keys like `` t(`about.experiences.${experience.id}.role`) ``, `` t(`about.courses.${course.id}.name`) ``, and `` t(`projects.${project.id}.title`) `` are built by string interpolation against `id` fields typed as plain `string` (`ExperienceData.id`, `CourseData.id`, `ProjectData.id` are all `string`, not a union of the known ids). If a new entry is added to `data.tsx` with an id that doesn't exist in `pt.ts`/`en.ts` (or a typo is introduced), TypeScript won't catch it — `i18next` will just render the raw key string (e.g. `about.courses.newCourse.name`) on the page at runtime with `returnNull: false` and no `missingKeyHandler` configured.
**Fix:** Type `id` as a union derived from the catalog keys (e.g. `keyof typeof pt.about.courses`) so a mismatched/added id fails the build instead of silently rendering a raw translation key in production.

---

_Reviewed: 2026-07-07T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
