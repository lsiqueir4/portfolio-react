# Phase 3: Language Toggle (i18n) - Pattern Map

**Mapped:** 2026-07-07
**Files analyzed:** 9
**Analogs found:** 9 / 9 (all exact — this phase is an explicit "mirror Phase 2" reuse)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|---------------|
| `app/constants/language.ts` (new) | config | CRUD (static constant) | `app/constants/theme.ts` | exact |
| `app/hooks/useLanguage.ts` (new) | hook | event-driven (store subscribe/set) | `app/hooks/useTheme.ts` | exact |
| `app/hooks/usePersistedPreference.ts` (reused verbatim, no changes expected) | hook | event-driven | itself (already generic) | exact — no modification needed |
| `app/root.tsx` (modified) | provider/layout | request-response (SSR pre-hydration) | itself, `themeInitScript` block | exact (same file, parallel pattern) |
| `app/features/Header/LanguageToggle.tsx` (new) | component | request-response (UI event → store) | `app/features/Header/ThemeToggle.tsx` | exact |
| `app/features/Header/index.tsx` (modified) | component | request-response (composition) | itself, existing `<ThemeToggle />` placement | exact (same file) |
| `app/features/Hero/data.tsx` (modified for i18n) | model/data | transform (static data → i18n keys) | `app/features/AboutMe/data.tsx`, `app/features/Projects/data.tsx` | role-match (sibling data files, same shape) |
| `app/features/Projects/data.tsx` (modified for i18n) | model/data | transform | `app/features/AboutMe/data.tsx` | role-match |
| `app/features/AboutMe/data.tsx` (modified for i18n) | model/data | transform | `app/features/Projects/data.tsx` | role-match |
| `app/constants/index.tsx` (audit only, likely unchanged) | config | CRUD (static constant) | itself | exact — probably no translatable strings (pure contact/link data per I18N-08) |

## Pattern Assignments

### `app/constants/language.ts` (config)

**Analog:** `app/constants/theme.ts` (full file, 6 lines)

**Full pattern to mirror:**
```typescript
// Single source of truth for the theme localStorage key. Must be imported by
// BOTH the SSR no-flash blocking script (app/root.tsx) and the client-side
// theme hook (app/hooks/useTheme.ts) — those two must read/write the exact
// same key or the SSR no-flash guarantee silently breaks.
export const THEME_STORAGE_KEY = "theme" as const;
```

**Instructions:** Create `app/constants/language.ts` with the identical shape and comment structure, substituting the language-specific key:
```typescript
export const LANGUAGE_STORAGE_KEY = "language" as const;
```
Keep the same "single source of truth, imported by both root.tsx script and the hook" comment convention.

---

### `app/hooks/useLanguage.ts` (hook, event-driven)

**Analog:** `app/hooks/useTheme.ts` (full file, 27 lines)

**Imports pattern** (lines 1-2):
```typescript
import { usePersistedPreference } from "./usePersistedPreference";
import { THEME_STORAGE_KEY } from "~/constants/theme";
```
→ mirror with `import { LANGUAGE_STORAGE_KEY } from "~/constants/language";`

**Valid-values + type pattern** (lines 4-5):
```typescript
const THEME_VALUES = ["light", "dark"] as const;
type Theme = (typeof THEME_VALUES)[number];
```
→ `const LANGUAGE_VALUES = ["pt", "en"] as const; type Language = (typeof LANGUAGE_VALUES)[number];`

**detectBrowserDefault pattern** (lines 7-12) — CRITICAL: comment explicitly requires byte-for-byte parity with the root.tsx blocking script:
```typescript
// Keep this fallback logic byte-for-byte identical to the blocking script
// in app/root.tsx (themeInitScript) — if one changes, update the other.
function detectBrowserTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
```
→ new `detectBrowserLanguage(): Language` must implement D-05 (non-pt/en → "en") and the discretion note (SSR fixed default = "pt"), reading `navigator.language`, matching `pt*` → "pt", else → "en" (server-side fallback branch must return the same fixed default the root.tsx script assumes — confirm "pt" per CONTEXT.md discretion note).

**applySideEffect pattern** (lines 14-18):
```typescript
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}
```
→ `applyLanguage(language: Language)` sets `document.documentElement.lang = language` and calls `i18next.changeLanguage(language)` (per D-01).

**Hook export pattern** (lines 20-27):
```typescript
export function useTheme() {
  return usePersistedPreference<Theme>({
    storageKey: THEME_STORAGE_KEY,
    validValues: THEME_VALUES,
    detectBrowserDefault: detectBrowserTheme,
    applySideEffect: applyTheme,
  });
}
```
→ identical shape for `useLanguage()`, swapping in the language constants/functions above. No changes needed to `usePersistedPreference.ts` itself — it is already generic over `T extends string`.

---

### `app/root.tsx` (modified — Layout + init script)

**Analog:** itself, existing `themeInitScript` + `Layout` blocks (lines 12, 28-46, 50, 56)

**Existing shared-constant import** (line 12):
```typescript
import { THEME_STORAGE_KEY } from "./constants/theme";
```
→ add `import { LANGUAGE_STORAGE_KEY } from "./constants/language";`

**Blocking-script pattern** (lines 34-46) — zero-interpolation static script safety comment must be preserved/extended:
```javascript
// Zero-interpolation static script: THEME_STORAGE_KEY (imported from
// ./constants/theme, the single shared copy used by app/hooks/useTheme.ts
// too) is a compile-time constant, not a runtime value, so this string is
// safe to inject via dangerouslySetInnerHTML (Security V5 / threat T-02-02).
// Keep this fallback logic byte-for-byte identical to app/hooks/useTheme.ts's
// detectBrowserTheme().
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var isDark = stored === "dark" || stored === "light"
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;
```
→ Add a parallel `languageInitScript` (or extend the same IIFE) that reads `localStorage.getItem(LANGUAGE_STORAGE_KEY)`, falls back to a `navigator.language`-based pt/en detection matching `detectBrowserLanguage()` byte-for-byte, and sets `document.documentElement.lang`. Since D-02 requires the SSR-rendered `<html>` to use a **fixed default** (not browser-detected) to avoid hydration mismatch, this script should only need to run post-hydration to correct `lang` — mirror theme's "blocking script runs before paint" approach if avoiding flash is desired, understanding D-02 already accepts a one-time flash for text content (the `lang` attribute correction itself can still be synchronous/blocking like the theme script, since changing an attribute isn't the source of the flash — the text content is).

**Layout tag pattern** (line 50):
```jsx
<html lang="en" suppressHydrationWarning>
```
→ change hardcoded `"en"` to the fixed SSR default (likely `"pt"` per discretion note) and keep `suppressHydrationWarning` since the client may correct it post-hydration.

**Script injection pattern** (line 56):
```jsx
<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
```
→ add a second `<script dangerouslySetInnerHTML={{ __html: languageInitScript }} />` immediately after, same convention.

---

### `app/features/Header/LanguageToggle.tsx` (new component)

**Analog:** `app/features/Header/ThemeToggle.tsx` (full file, 39 lines)

**Full imports + structure pattern** (lines 1-8):
```typescript
import { Sun, Moon } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const isDark = theme === "dark";

  return (
    <button
```

**Button styling/interaction pattern** (lines 9-27) — border/hover convention to visually pair with, per D-03/D-04 (two-label switcher, not single button, so structure needs adaptation but styling tokens reused):
```typescript
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      suppressHydrationWarning
      className="
        relative
        rounded-xl
        border
        border-border-subtle/10
        p-2.5
        text-muted
        transition-all
        duration-300
        hover:border-border-subtle/30
        hover:bg-accent/10
        hover:text-accent-hover
      "
    >
```

**Instructions:** `LanguageToggle.tsx` renders two `<button>` (or `<span onClick>`) labels "PT" / "EN" side by side inside a shared bordered container (reuse the `border border-border-subtle/10 rounded-xl` wrapper styling), each calling `setLanguage("pt")` / `setLanguage("en")` from `useLanguage()`. Active label gets `text-accent-hover` (per D-04); inactive gets `text-muted` (existing convention, same class already used in `ThemeToggle`/`HeaderButton`). Keep `suppressHydrationWarning` on the element(s) whose rendered class depends on the persisted value, matching `ThemeToggle`'s SSR-mismatch-avoidance convention.

---

### `app/features/Header/index.tsx` (modified — insert LanguageToggle)

**Analog:** itself — existing `<ThemeToggle />` placement (lines 6, 130, 134)

**Import pattern** (line 6):
```typescript
import { ThemeToggle } from "./ThemeToggle";
```
→ add `import { LanguageToggle } from "./LanguageToggle";`

**Desktop placement pattern** (lines 89-131, `hidden md:flex` block, `<ThemeToggle />` at line 130 as last child):
```jsx
<div className="hidden items-center gap-8 md:flex">
  <ul className="flex items-center gap-8">
    ...
  </ul>
  <a href="#contacts" ...>...</a>
  <Button variant="primary" ...>Baixar CV</Button>
  <ThemeToggle />
</div>
```
→ insert `<LanguageToggle />` immediately adjacent to `<ThemeToggle />` (per code_context integration point), e.g. `<LanguageToggle /><ThemeToggle />`.

**Mobile standalone placement pattern** (lines 133-135):
```jsx
<div className="md:hidden">
  <ThemeToggle />
</div>
```
→ same dual-placement convention: `<div className="md:hidden flex items-center gap-2"><LanguageToggle /><ThemeToggle /></div>` (adjust flex wrapper as needed since two components now share this div).

Note: all header nav strings ("Início", "Projetos", "Quem sou eu", "Contato", "Baixar CV", `aria-label="Abrir menu"`) are hardcoded JSX text needing `useTranslation`/`t()` wiring per code_context — this file is also a translation-JSX-strings target, not just an integration point for the toggle.

---

### `app/features/Hero/data.tsx`, `app/features/Projects/data.tsx`, `app/features/AboutMe/data.tsx` (data files, transform role)

**Current shape (`app/features/Hero/data.tsx`, full file):**
```typescript
export const techs = [
  { name: "Python", icon: SiPython },
  ...
];
```
Tech names are proper nouns — likely no translation needed (per Claude's Discretion note, only prose/dates/status need i18n keys).

**Current shape (`app/features/AboutMe/data.tsx`, lines 43-90):** experiences with `startDate`/`endDate` ("Fev 2022"), `activities` (Portuguese sentences), and courses with `conclusionYear` (mix of year strings and status label "Em andamento").

**Current shape (`app/features/Projects/data.tsx`, lines 20-65):** each project has `title`, `description` (Portuguese prose) alongside non-translatable `usedTechs`, `link`, `image`.

**Pattern for planner:** These three files are structurally identical in role (camelCase-plural array exports, feature-colocated `data.tsx`, imported by sibling `index.tsx` via relative import) — treat as one pattern group. Per CONTEXT.md's Claude's Discretion, the planner must choose one of:
1. Convert free-text fields (`description`, `activities`, `startDate`/`endDate`, `conclusionYear` status values, `title`) to i18next translation keys resolved at render time (data arrays hold keys like `"projects.portfolio.description"`, JSON translation files hold PT/EN pairs), or
2. Keep data files as-is but locale-key the translatable strings inline (e.g. `description: { pt: "...", en: "..." }`).

No existing codebase analog for i18n-keyed data exists (this is the first phase introducing i18next) — RESEARCH.md was skipped, so the planner should pick option 1 (translation-key strings, i18next convention) since it keeps `data.tsx` files free of duplicated locale-branching logic and matches typical `react-i18next` usage with `t(key)` calls inside the consuming `index.tsx`/card components, not inside `data.tsx` itself.

---

### `app/constants/index.tsx` (audit only)

**Current full content:**
```typescript
export const CONTACTS = {
  email: "l.gsiqueira997@gmail.com",
  github: "https://github.com/lsiqueir4/",
  formattedPhone: "+55 (11) 95666-3035",
  whatsappRedirectLink: "https://wa.me/5511956663035",
  linkedinRedirectLink: "https://www.linkedin.com/in/l-siqueiraa/",
  fullName: "Leandro Siqueira",
  cvDownloadLink: "https://drive.google.com/uc?export=download&id=1e--yv8KrbVbT4D1aFwRdLmg4lYGYtm7i",
};
```
All fields are pure contact data/links (email, phone, URLs, name) — no UI-adjacent translatable strings present. Per I18N-08 (content/links preservation), **no changes expected** to this file. Planner should confirm no changes needed rather than force a pattern match.

## Shared Patterns

### Persisted-preference hook factory
**Source:** `app/hooks/usePersistedPreference.ts` (full file — generic, already reusable, no modification needed)
**Apply to:** `app/hooks/useLanguage.ts`
```typescript
export function usePersistedPreference<T extends string>({
  storageKey,
  validValues,
  detectBrowserDefault,
  applySideEffect,
}: UsePersistedPreferenceOptions<T>) {
  const store = getStore(storageKey, validValues, detectBrowserDefault, applySideEffect);
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return [value, store.set] as const;
}
```

### Single shared storage-key constant (SSR/client parity)
**Source:** `app/constants/theme.ts`
**Apply to:** `app/constants/language.ts`, imported identically by both `app/root.tsx` (blocking script) and `app/hooks/useLanguage.ts`.

### SSR no-flash blocking script + Layout wiring
**Source:** `app/root.tsx` lines 28-46, 50, 56
**Apply to:** the new language init script and `<html lang>` dynamic value — same dangerouslySetInnerHTML injection convention, same "byte-for-byte identical to the hook's detect function" comment discipline.

### Toggle button styling (border/hover/purple-accent)
**Source:** `app/features/Header/ThemeToggle.tsx` lines 15-27
**Apply to:** `LanguageToggle.tsx` — reuse `border-border-subtle/10`, `hover:border-border-subtle/30`, `hover:bg-accent/10`, `hover:text-accent-hover`, `text-muted` token set; active-language label styling reuses `text-accent-hover` per D-04.

### Dual desktop/mobile placement in Header
**Source:** `app/features/Header/index.tsx` lines 89-131 (desktop `hidden md:flex` block) and 133-135 (mobile `md:hidden` block)
**Apply to:** `LanguageToggle` placement — insert adjacent to `ThemeToggle` in both blocks.

## No Analog Found

None — every file in scope has a strong same-phase-family analog (Phase 2's theme toggle is an explicit template for this phase per CONTEXT.md D-01/D-02).

## Metadata

**Analog search scope:** `app/hooks/`, `app/constants/`, `app/features/Header/`, `app/features/Hero/`, `app/features/Projects/`, `app/features/AboutMe/`, `app/root.tsx`
**Files scanned:** 9 (all read in full — none exceeded 2,000 lines)
**Pattern extraction date:** 2026-07-07
