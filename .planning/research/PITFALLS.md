# Pitfalls Research

**Domain:** Retrofitting theming (dark mode), i18n, and a color-token refactor onto an existing React 19 + React Router 7 (SSR) + Tailwind CSS 4 portfolio, under a hard "no content/structure change" constraint
**Researched:** 2026-07-06
**Confidence:** MEDIUM (cross-verified across multiple independent sources for SSR/hydration and Tailwind v4 mechanics; no official Context7 library docs were reachable in this environment, so treat framework-specific API details as MEDIUM, not HIGH, until confirmed against `react-i18next`/`tailwindcss` docs during planning)

## Critical Pitfalls

### Pitfall 1: Content accidentally altered while "extracting" it for i18n

**What goes wrong:**
The existing PT-BR text lives inline in JSX and in `data.tsx` arrays (e.g. `app/features/AboutMe/data.tsx` experience `activities`, course names, `app/features/Header/index.tsx` nav labels). Moving that text into a `pt.json` translation resource requires re-typing or copy-pasting it. During that manual transcription it's extremely common to "clean up" text while you're already touching it — fix a perceived typo, expand an abbreviation, reflow a sentence, trim whitespace — which silently violates the explicit "no content changes" constraint. A second, subtler version: proper nouns that must **never** be translated (`"QI Tech"`, `"Grupo Viamar"`, `"React"`, `"DIO"`, `"Udemy"`) get treated as translatable strings and drift between locale files, or date/status literals (`"Fev 2022"`, `"Em andamento"`) get inconsistently normalized in one locale but not the other.

**Why it happens:**
i18n extraction is manual, string-by-string work with no built-in mechanism enforcing "the default-locale value must be byte-identical to the original source string." There's also genuine ambiguity about what counts as "content to preserve exactly" vs. "a value that should adapt per locale" (is `"Fev 2022"` a literal string, or a date that should render as `"Feb 2022"` in English?) — that ambiguity needs to be resolved explicitly during phase discussion, not assumed by whoever is extracting strings.

**How to avoid:**
- Before extraction, generate a diff-able manifest: for every hardcoded string that becomes a translation key, record `{ file, original string, new key }`.
- Assert the `pt` (or `pt-BR`) locale JSON value is character-for-character identical to the original hardcoded string — do not "improve" it in the same pass.
- Explicitly classify each data field before touching it: **immutable identifier** (company/tech/institution names — never goes through `t()`, stays a shared constant) vs. **translatable prose** (activities, titles, labels) vs. **locale-formatted value** (dates) — get the user's answer on how dates should behave in English before writing code, since this is exactly the ambiguity the "no content change" constraint doesn't resolve on its own.
- Do the extraction as a mechanical, reviewable diff (ideally one commit that only moves strings verbatim into JSON + wires `t()` calls, with zero wording changes), separate from any later commit that might add real English translations.

**Warning signs:**
- Code review shows a `pt` JSON value that doesn't match the original file byte-for-byte (extra/missing punctuation, reworded sentence, different capitalization).
- A string still hardcoded in a component after the i18n pass supposedly finished (see Pitfall 2).
- Company/tech names appearing inside translation JSON files instead of as shared constants.

**Phase to address:** i18n phase (PT-BR/EN language toggle)

---

### Pitfall 2: `data.tsx` literal content is invisible to i18n extraction tooling

**What goes wrong:**
Tools like `i18next-cli extract` or ESLint plugins (`eslint-plugin-i18next`, `eslint-plugin-i18next-no-undefined-translation-keys`) find missing translations by scanning for `t()` call sites or raw JSX text nodes. They do **not** scan arbitrary string literals sitting inside data arrays like `app/features/AboutMe/data.tsx`, `app/features/Projects/data.tsx`, `app/features/Hero/data.tsx`. Since this project's actual translatable content (experience descriptions, course names, project subtitles) lives in these data files rather than in JSX, a team relying on the standard tooling to confirm "we found and translated everything" will get a false all-clear while these strings ship untranslated to the EN locale.

**Why it happens:**
The tooling ecosystem for i18next assumes translatable strings sit in components as `t('key')` calls; this codebase's convention (per `CONVENTIONS.md`) is to keep content in a separate `data.tsx` per feature. That architectural pattern predates the i18n requirement and doesn't map cleanly onto it.

**How to avoid:**
- Do not rely solely on automated key-extraction tools for coverage; treat every `data.tsx` file as its own manual audit checklist (grep every feature's `data.tsx`/`types.tsx` for quoted string literals and confirm each one is either wired through `t()`/a translation lookup or explicitly marked as an intentionally untranslated identifier).
- Convert `data.tsx` arrays that hold user-facing prose into functions/hooks that resolve strings through `t()` at render time (or key-reference objects resolved via `useTranslation`), rather than pre-baked arrays of plain strings.
- After wiring, do a full manual pass over the rendered EN version of the page looking for any remaining Portuguese text — this is the actual verification step, not "the extraction tool reported zero missing keys."

**Warning signs:**
- `i18next-cli extract` / lint reports "0 missing keys" but toggling the language still shows Portuguese text somewhere on the page.
- Any `data.tsx` export whose array items are plain string literals rather than translation-key references.

**Phase to address:** i18n phase — flag this phase for deeper string-inventory work before implementation, since the standard "run the extractor" workflow undercounts here.

---

### Pitfall 3: Dark mode flash of wrong theme (FOUC) on SSR page loads

**What goes wrong:**
With React Router 7 SSR, the server has no access to `localStorage` or `window.matchMedia`, so if theme is only resolved on the client (e.g. in a `useEffect` after mount), the server always renders one default theme and the browser briefly shows it before JS runs and flips to the user's actual saved/system theme — a visible flash on every full page load.

**Why it happens:**
Developers reach for `useState` + `useEffect` to read `localStorage`/`prefers-color-scheme` because that's the natural React pattern, but that only runs after the first paint, which is exactly when the flash is visible.

**How to avoid:**
- Add a small, fully static inline `<script>` in `app/root.tsx`'s `Layout` `<head>` (before `<Scripts />`/hydration) that: reads `localStorage` for a saved theme → falls back to `window.matchMedia('(prefers-color-scheme: dark)').matches` → sets the theme attribute/class on `<html>` synchronously, before any paint.
- Wrap the `localStorage` read in `try/catch` (private/incognito browsing can throw).
- Keep the script's contents fully static/hardcoded — see Pitfall 9 for why dynamic interpolation here is a security risk, not just a style choice.

**Warning signs:**
- Reloading the page with a manually set `dark` preference in `localStorage` while the OS is set to light mode shows a brief light flash before flipping to dark.
- Any dark-mode logic currently lives only inside a `useEffect`.

**Phase to address:** Dark mode phase

---

### Pitfall 4: Dark mode hydration mismatch errors

**What goes wrong:**
Related to Pitfall 3 but a distinct failure mode: if the theme-dependent class/attribute differs between what the server rendered and what the client computes on first render, React logs a hydration mismatch (`"Text content does not match server-rendered HTML"` / attribute mismatch) and may re-render the whole subtree client-side, discarding the SSR output's benefit.

**Why it happens:**
Any conditional rendering (`className={isDark ? "..." : "..."}`) that depends on a client-only value (`window`, `localStorage`, `matchMedia`) evaluated during the component's render function — rather than only after mount — produces different output between server and client passes.

**How to avoid:**
- Prefer the "attribute on `<html>` set by inline script + CSS variant selector" approach (Pitfall 3 + Pitfall 6) over conditional React class logic — this way React itself never needs to know the theme during SSR; pure CSS handles the branch.
- If a component must branch in JS on the resolved theme (not just CSS), read the value only inside `useEffect`/after an `isMounted` flag, and accept a single client-only re-render for that component rather than trying to force SSR to guess the right value.
- Use `suppressHydrationWarning` only as a narrow, deliberate escape hatch on the single element whose attribute is expected to legitimately differ (e.g. `<html suppressHydrationWarning>`), never as a blanket fix, since it masks real mismatches too.

**Warning signs:**
- React DevTools/console hydration mismatch warnings appearing specifically tied to theme-conditional class names.
- Visible content "flicker" or re-layout right after hydration completes (a symptom of React discarding and re-rendering the mismatched subtree).

**Phase to address:** Dark mode phase

---

### Pitfall 5: Tailwind CSS v4 dark mode isn't class/attribute-toggleable by default

**What goes wrong:**
Tailwind v4 removed the JS config file and the `darkMode` config option entirely. Out of the box, the `dark:` variant only responds to the OS-level `prefers-color-scheme` media query — there is no manual override built in. A team that just writes `dark:bg-zinc-950` expecting a JS-driven toggle to work will find the toggle has no effect, because Tailwind is still only listening to the media query.

**Why it happens:**
This is a v3→v4 breaking change; a lot of existing tutorials/muscle memory (`darkMode: 'class'` in `tailwind.config.js`) no longer applies, and Tailwind v4's CSS-first config (`@theme` in `app/app.css`) isn't yet the default mental model for most React devs migrating an older project.

**How to avoid:**
- Explicitly declare a custom variant in `app/app.css`: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` (or the `.dark` class equivalent), then toggle `data-theme="dark"`/`class="dark"` on `<html>` from the inline script (Pitfall 3) and the toggle button's click handler.
- Do this in the **same phase that defines the color tokens** (Theme/CSS centralization), not deferred to the dark-mode phase — the token system and the variant strategy are coupled: tokens need both a light and dark value defined via the same mechanism from the start, otherwise the dark-mode phase has to retrofit the token layer it was told was "done."
- Note directly for `CONCERNS.md`'s existing suggested fix ("Define a complete Tailwind theme configuration in `tailwind.config.ts`") — that recommendation is stale for Tailwind v4 and should **not** be followed; the correct v4-native approach is CSS-based `@theme` + `@custom-variant`, not a JS config file.

**Warning signs:**
- A dark-mode toggle button that changes state but produces zero visual change.
- Any new `tailwind.config.ts`/`.js` file being introduced when the project is on Tailwind v4 with `@import "tailwindcss"` (this project has no JS Tailwind config today — that's correct for v4, keep it that way).

**Phase to address:** Theme/CSS centralization phase (token + variant strategy), verified in Dark mode phase

---

### Pitfall 6: Dynamically constructed Tailwind class names silently produce no styles

**What goes wrong:**
Tailwind scans source files for complete, literal class-name strings at build time to decide which utility CSS to generate. If the theme-centralization refactor introduces shared components that build class names via string interpolation — e.g. a `Badge`/`Button` taking a `color` prop and doing `` className={`bg-${color}-500`} `` — Tailwind's compiler cannot see the concatenated result and will not generate that CSS. The component renders with **no error**, just a missing background color, which is easy to miss visually if the fallback happens to look "close enough" (e.g. transparent background on a dark page).

**Why it happens:**
This is exactly the kind of "reduce duplicated component patterns" refactor the theme-centralization phase is scoped to do (per `PROJECT.md` Active requirements), so the risk is directly proportional to how aggressively components get generalized.

**How to avoid:**
- Never interpolate a variant/color into the middle of a Tailwind class string. Use a lookup map of complete, literal class strings per variant instead: `{ purple: "bg-purple-500 hover:bg-purple-400", ... }[variant]`.
- If token-driven theming is the goal, prefer CSS custom properties consumed via a small fixed set of utility classes (e.g. always `bg-[var(--color-accent)]` or a single `bg-accent` utility mapped once in `@theme`) over parametrized Tailwind class construction.
- Grep the diff for template-literal class construction (`` className={`...${...}...`} ``) as an explicit review step before merging the centralization phase.

**Warning signs:**
- Any shared component whose `className` is built with a template literal containing a prop/variable in the middle of a utility name.
- A component that looks unstyled/transparent only for certain prop values, not others.

**Phase to address:** Theme/CSS centralization phase

---

### Pitfall 7: Tailwind color-token refactor breaks visual parity from a missed hardcoded class

**What goes wrong:**
`CONCERNS.md` already documents purple/zinc/gray utility classes duplicated across `Header`, `Hero`, `Projects`, `AboutMe`, `Contacts`, `Footer`, and `TechBadge`. Migrating these to centralized semantic tokens is a large, repetitive find-and-replace across many files; missing even one instance (e.g. a `purple-500/30` opacity variant, or a `gray-950` used once instead of the more common `zinc-950`) produces a subtle visual regression — a color that's *almost* but not quite consistent with the rest of the page, which is easy to miss without a systematic check, especially since this project has **zero test coverage** (`CONCERNS.md` — 0% test coverage, no visual regression tooling).

**Why it happens:**
Tailwind utility classes are plain strings with no compiler-enforced consistency; a manual refactor across 6+ files is inherently error-prone, and this project has no automated safety net (no snapshot tests, no Chromatic/visual diff pipeline) to catch a missed spot.

**How to avoid:**
- Before starting, grep the entire `app/` tree for every currently-used color utility prefix (`purple-`, `zinc-`, `gray-`) to build a complete inventory/checklist of every literal color class in the codebase — treat this as the refactor's definition of done, not "I think I got everything."
- Migrate in small, reviewable batches (one feature folder at a time), verifying each batch visually before moving to the next, rather than one giant sweeping change across all six feature folders simultaneously.
- Take manual before/after screenshots of each page section (light and dark) as a lightweight substitute for automated visual regression testing, given none exists in this project.

**Warning signs:**
- Grep for the old literal color prefixes after the refactor is declared complete still returns hits outside of the new token definitions themselves.
- Any component whose accent/border color looks slightly "off" compared to sibling components after the refactor.

**Phase to address:** Theme/CSS centralization phase

---

### Pitfall 8: Inline theme-detection script becomes an XSS vector

**What goes wrong:**
The standard SSR dark-mode fix (Pitfall 3) is an inline `<script>` injected via `dangerouslySetInnerHTML` in `root.tsx`. If that script's source is built by interpolating any runtime/user-influenced value (rather than being a fully static string), it becomes an injection point.

**Why it happens:**
It's tempting to parametrize the script (e.g. to also inject a server-detected locale or a default theme value read from a cookie) using template-literal interpolation directly into the `dangerouslySetInnerHTML` string, which is exactly the pattern that creates XSS risk if any interpolated value is ever attacker- or user-influenced.

**How to avoid:**
- Keep the inline script's text fully static/hardcoded (no runtime interpolation of any value into the script body).
- If a value genuinely must be passed from server to client inline (e.g. resolved locale), serialize it with `JSON.stringify` into a clearly separate `<script type="application/json">` data island or a `data-*` attribute, never by string-splicing into executable JS.
- Validate any `localStorage`/cookie value read back into the app against a strict allow-list (`"light" | "dark"`, `"pt" | "en"`) before applying it to the DOM or the i18n instance — a corrupted or manually-edited storage value should fall back to the default, not be trusted as-is.

**Warning signs:**
- Any `dangerouslySetInnerHTML` script string built with a template literal that includes a variable.
- Theme/language state applied to the DOM directly from `localStorage.getItem(...)` without a validation/allow-list step.

**Phase to address:** Dark mode phase (script) and i18n phase (locale value validation)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|-----------------|
| Skip the inline pre-hydration script, do theme detection in `useEffect` only | Faster to implement, less root.tsx surgery | Visible FOUC flash on every SSR load; user-perceived quality regression | Never for a public-facing site — implement inline script from day one |
| Bundle both `pt` and `en` translation JSON eagerly instead of lazy-loading the active locale | Simpler initial i18next setup | Slightly larger main bundle; compounds existing bundle-size concerns already flagged in `CONCERNS.md` (react-icons bloat, no code splitting) | Acceptable for now — this is a small single-page site with only 2 locales; revisit only if the site grows substantially |
| Leave `data.tsx` content as plain strings and only i18n-wire the JSX-level UI copy (nav, buttons, section titles) | Much smaller, faster milestone | Directly contradicts the milestone's stated goal (portfolio "cannot be used for non-Portuguese audiences" per `CONCERNS.md`) since the bulk of real content — experience descriptions, courses — stays untranslated | Never — the `data.tsx` content is the primary content this milestone is meant to make bilingual |
| Use `suppressHydrationWarning` broadly to silence any hydration noise during development | Quiets console warnings quickly | Hides real mismatches unrelated to theme, delaying detection of actual SSR/client divergence bugs | Only on the single, deliberate theme/lang attribute element — never repo-wide |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| `react-i18next` + React Router 7 SSR | Initializing i18next only client-side (in `useEffect`) causes a visible flash of untranslated/wrong-language content plus a hydration mismatch on first paint | Resolve the locale server-side (cookie → `Accept-Language` header → default) in a root loader, pass the resolved language into the initial render so client and server agree before hydration |
| `localStorage` (theme and language) + SSR | Reading `localStorage` at module scope or during the render function throws/returns `undefined` on the server, causing divergent output | Only read `localStorage` inside `useEffect` or the pre-hydration inline `<script>` — never during the SSR render path |
| Tailwind v4 dynamic class names | Constructing class strings via props/template literals for shared components | Use complete literal class strings via a lookup map per variant (see Pitfall 6) |
| `react-i18next` missing-key handling | Assuming a missing translation key throws or is caught by default | By default i18next silently falls back to the key string or `fallbackLng` — configure `saveMissing`/a dev-only missing-key handler so gaps are visible in development, not just discovered by users toggling languages |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Eagerly bundling both locale JSON files in the main chunk | Marginally larger initial JS payload after the i18n phase ships | Lazy-load only the active locale (i18next dynamic-import backend); keep both locale files small | Not urgent at 2 languages/1 page — but establish the lazy-load pattern now rather than retrofitting later, since `CONCERNS.md` already flags bundle bloat (react-icons, no code splitting) as an existing concern |
| Full-tree re-render / visible flash on every theme or language toggle click | Whole page appears to "blink" or reflow on toggle | Scope theme/i18n state via context + memoized consumers; use a short CSS `transition` on color properties instead of a jarring instant swap | Noticeable immediately on a single click — not a scale issue, a UX-perf issue to catch during dark-mode/i18n phase review |
| Tailwind on-demand scanning silently omitting dynamically-built class names | No error at build or runtime — just missing styles, easy to miss visually (see Pitfall 6) | Static review/lint pass for template-literal class construction before merging the centralization phase | Breaks the instant any variant/color is chosen via a prop instead of a literal string |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Interpolating a runtime value directly into the `dangerouslySetInnerHTML` inline theme script | XSS if the interpolated value is ever attacker/user-influenced | Keep the script fully static; pass data via `JSON.stringify`'d data islands, not string-spliced JS (Pitfall 8) |
| Trusting raw `localStorage`/cookie values for theme or language without validation | A corrupted or manually-edited storage value could set an unexpected attribute/class, breaking layout or CSS | Validate against a strict allow-list (`"light" \| "dark"`, `"pt" \| "en"`) before applying; fall back to default otherwise |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Abrupt, untransitioned color flip on theme toggle | Feels jarring/broken, jumpy visual experience | Add a short, scoped CSS `transition` on `background-color`/`color`/`border-color` for themed elements (avoid `transition: all`, which is expensive) |
| Language toggle triggers a full page reload/navigation | Loses scroll position and any open mobile menu state on a single-page portfolio | Keep the language switch fully client-side (`i18n.changeLanguage`), persist to `localStorage` only, never reload/navigate |
| New dark-mode/language toggle buttons crammed into the already-fragile mobile header | Compounds existing accessibility gaps already documented in `CONCERNS.md` (mobile menu has no focus trap, no Escape-to-close, no resize handling) | Give the new toggles real focus states and `aria-label`s from day one; don't treat their accessibility as a follow-up task since this phase is already touching the Header |
| `<html lang="en">` hardcoded in `root.tsx` while all current content is Portuguese | Screen readers/translation tools currently mis-announce language even before this milestone; risk of leaving it wrong after adding a language toggle | Make the `lang` attribute dynamic based on resolved locale as part of the i18n phase — this is an attribute fix, not a content change, so it does not conflict with the "no content change" constraint |

## "Looks Done But Isn't" Checklist

- [ ] **Dark mode toggle:** Often missing the pre-hydration inline script — verify by setting the OS to light mode, saving `"dark"` in `localStorage`, and hard-refreshing; the page must never flash light before showing dark.
- [ ] **Dark mode toggle:** Often missing the Tailwind v4 `@custom-variant dark (...)` declaration — verify the toggle actually changes `dark:` utility output, not just an attribute with no visual effect (Pitfall 5).
- [ ] **Language toggle:** Often missing translation of non-JSX-text content — `data.tsx` array literals, `aria-label`s (e.g. `"Abrir menu"`), page `<title>`/meta description, image `alt` text, and the `<html lang>` attribute — verify by toggling to EN and reading through the entire rendered page including inspected attributes, not just visible headings.
- [ ] **Theme/color-token centralization:** Often missing dynamically-constructed class names (`` `bg-${x}-500` ``) that produce no CSS at all — verify by grepping the diff for template-literal class construction (Pitfall 6).
- [ ] **Theme/color-token centralization:** Often missing hover/focus/opacity variants during the token migration (e.g. `purple-500/30`, `hover:bg-purple-400`) — verify every interactive state, not just the resting state, in both themes.
- [ ] **Bilingual README:** Often missing that cross-links between `README.md` and `README.en.md` actually resolve, and that both files stay in sync on shared sections (tech stack list, features) — verify by clicking every cross-link in both directions.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|-----------------|
| FOUC / dark-mode hydration mismatch found post-launch | LOW | Add the inline pre-hydration script to `root.tsx`'s `Layout`; scope `suppressHydrationWarning` narrowly to the `<html>` element |
| Missing translation key discovered late | LOW | i18next's default `fallbackLng` prevents a hard crash; add the missing key to the JSON resource, no structural change needed |
| Content accidentally reworded during i18n extraction, discovered late | MEDIUM | Diff the new locale JSON against the original file's git history (`git log -p` on the component/data file) to restore the exact original text as the default-locale value |
| Missed hardcoded color class causing a visual regression | LOW–MEDIUM | Grep for remaining literal color-utility prefixes (`purple-`, `zinc-`, `gray-`) outside the token definitions and migrate the stragglers in a follow-up pass |
| Dynamically-constructed Tailwind class silently producing no CSS | MEDIUM | Convert the offending component from string-interpolated class construction to a literal lookup map per variant; rebuild and visually re-verify all variants |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Tailwind v4 dark variant not wired for manual toggle (Pitfall 5) | Theme/CSS centralization phase (define `@custom-variant` + tokens together) | Toggle the attribute manually in devtools and confirm `dark:` utilities actually change |
| Dynamically constructed Tailwind class names silently missing (Pitfall 6) | Theme/CSS centralization phase | Grep diff for template-literal class construction before merging |
| Missed hardcoded color class / visual regression (Pitfall 7) | Theme/CSS centralization phase | Full-repo grep for old literal color prefixes returns zero hits outside token definitions; before/after screenshots per feature folder |
| Dark mode FOUC (Pitfall 3) | Dark mode phase | Hard-refresh with mismatched OS/localStorage preference never shows a flash |
| Dark mode hydration mismatch (Pitfall 4) | Dark mode phase | No hydration warnings in console tied to theme-conditional classes |
| Inline script XSS risk (Pitfall 8) | Dark mode phase (script) + i18n phase (locale validation) | Script body contains no interpolated runtime values; storage values validated against allow-list |
| Content altered during i18n extraction (Pitfall 1) | i18n phase | `pt` locale JSON values are byte-identical to original hardcoded strings (diff check) |
| `data.tsx` content invisible to extraction tooling (Pitfall 2) | i18n phase | Manual full-page read-through in EN finds zero remaining Portuguese text, independent of extractor tool output |
| `<html lang>` mismatch (UX pitfall) | i18n phase | `lang` attribute matches resolved locale at all times |
| Bilingual README drift/broken cross-links | README phase | Every cross-link between `README.md` and `README.en.md` resolves; shared sections (tech stack, features) match in substance |

## Sources

- [Fixing Dark Mode Flickering (FOUC) in React and Next.js](https://www.notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Avoid Flash of Default Theme: An Implementation of Dark Mode in React App](https://hangindev.com/blog/avoid-flash-of-default-theme-an-implementation-of-dark-mode-in-react-app)
- [Fixing the dark mode flash issue on server rendered websites — Maxime Heckel](https://blog.maximeheckel.com/posts/switching-off-the-lights-part-2-fixing-dark-mode-flashing-on-servered-rendered-website/)
- [Add a Theme Toggle to a React Router v7 Application Using localStorage — Medium](https://medium.com/@almina.brulic/add-a-theme-toggle-to-a-react-router-v7-application-using-localstorage-a92efbdc29b6)
- [Text content does not match server-rendered HTML — Next.js docs](https://nextjs.org/docs/messages/react-hydration-error)
- [Handling the React server hydration mismatch error — Ben Ilegbodu](https://www.benmvp.com/blog/handling-react-server-mismatch-error/)
- [How to internationalize a React Router v7 app with remix-i18next — Locize Blog](https://www.locize.com/blog/react-router-i18next)
- [remix-i18next GitHub repo](https://github.com/sergiodxa/remix-i18next)
- [How to Persist the User Locale Using Cookies with React Router and i18next — sergiodxa](https://sergiodxa.com/tutorials/persist-the-user-locale-using-cookies-with-remix-i18next)
- [i18next-cli / official extraction tooling — i18next plugins overview](https://www.i18next.com/overview/plugins-and-utils)
- [eslint-plugin-i18next-no-undefined-translation-keys — npm](https://www.npmjs.com/package/eslint-plugin-i18next-no-undefined-translation-keys)
- [Flexible Dark Mode with Tailwind CSS v4 Custom Variants — Nils Schönwald](https://schoen.world/n/tailwind-dark-mode-custom-variant)
- [Dark mode — Tailwind CSS official docs](https://tailwindcss.com/docs/dark-mode)
- [Theme variables — Tailwind CSS official docs](https://tailwindcss.com/docs/theme)
- [Tailwind CSS in Large Codebases: Maintainability, Patterns, and Pitfalls — Makers' Den](https://makersden.io/blog/tailwind-css-in-large-codebases-maintainability-patterns-pitfalls)
- Project-specific: `.planning/codebase/CONCERNS.md`, `.planning/codebase/CONVENTIONS.md`, `.planning/PROJECT.md`, and direct inspection of `app/root.tsx`, `app/app.css`, `app/features/Header/index.tsx`, `app/features/AboutMe/data.tsx`, `package.json`

---
*Pitfalls research for: React portfolio theming/dark-mode/i18n retrofit milestone*
*Researched: 2026-07-06*
