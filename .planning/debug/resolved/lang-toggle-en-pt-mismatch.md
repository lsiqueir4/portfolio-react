---
status: resolved
trigger: "Ao abrir o site, o botão de idioma no Header aparece marcado/selecionado como \"EN\", mas o conteúdo do site está sendo renderizado em português (PT-BR). O botão deveria refletir o idioma realmente exibido."
created: 2026-07-07T20:49:41Z
updated: 2026-07-07T22:20:00Z
---

## Current Focus
<!-- OVERWRITE on each update - always reflects NOW -->

hypothesis: CONFIRMED (see Resolution). `usePersistedPreference`'s `getServerSnapshot` was computed by calling the same browser-detection function (`detectBrowserLanguage()` / `detectBrowserTheme()`) used for the real client value — instead of a fixed, deterministic constant. That function's SSR guard (`typeof navigator === "undefined"`) assumed Node has no `navigator` global, but this environment's Node (v24, and Node 21+ generally) exposes a global `navigator` stub whose `.language` getter resolves to a fixed "en-US" — unrelated to the real visitor — which defeats the guard during actual SSR and makes every server response mark the EN toggle button active, regardless of visitor locale or i18next's (correctly, separately fixed-"pt") SSR content.
test: DONE — Playwright regression tests added/passing (see Resolution.verification).
expecting: n/a — confirmed via direct Node REPL check + raw curl of SSR HTML + before/after Playwright comparison.
next_action: none — user confirmed fix resolves the issue in their real workflow ("confirmado, pode commitar"). Session resolved and committed.
reasoning_checkpoint:
  hypothesis: "usePersistedPreference's getServerSnapshot is computed via detectBrowserDefault(), which reads navigator.language. Node 21+'s global navigator stub (navigator.language === 'en-US', hardcoded, unrelated to the real visitor) defeats detectBrowserLanguage()'s `typeof navigator === 'undefined'` SSR guard, so the actual Node SSR process evaluates navigator.language='en-US' -> detectBrowserLanguage() returns 'en' for every request. This gets baked into the server-rendered HTML as the toggle's aria-pressed/active state, while i18next's content uses a separate, correctly-fixed 'pt' SSR default (D-02) -> permanent toggle=EN / content=PT mismatch on every load."
  confirming_evidence:
    - "Direct `node -e \"console.log(navigator.language)\"` in this repo's Node (v24.16.0) returns 'en-US' even though `typeof navigator === 'undefined'` guard exists in code and `LANG=C.UTF-8` env — proves Node's navigator stub is not undefined and not derived from real locale."
    - "Playwright test against pre-fix code + corrected diagnostic (fixed a false-positive className substring match, see below) showed togglePressed='EN' in ALL THREE scenarios (en-US, pt-BR, default browser locale) — including the pt-BR-visitor scenario where content correctly rendered 'Início' (Portuguese) — proving the toggle's wrong state was baked into the SSR HTML itself, not a client hydration timing artifact (a client-side bug would have shown 'PT' for the pt-BR-locale visitor test, since Playwright's addInitScript genuinely overrides the browser's navigator before hydration)."
    - "curl of the raw SSR HTML (no JS) after the fix shows PT button aria-pressed=true / active class, EN button aria-pressed=false / muted class — matching the fixed-'pt' SSR content — confirming the fix operates at the SSR layer, not just post-hydration."
  falsification_test: "If the bug were purely a client-side hydration-timing race (my initial hypothesis), the pt-BR-visitor Playwright scenario (real browser navigator overridden to pt-BR before any script runs) should have shown togglePressed='PT' under the pre-fix code, since the CLIENT's own detectBrowserLanguage() would correctly read the overridden navigator. It did not — it showed 'EN' — which falsifies the pure-hydration-race hypothesis and points to the SSR-side computation itself being wrong."
  fix_rationale: "Added an explicit, purely-constant `ssrDefault` option to usePersistedPreference, used verbatim as getServerSnapshot() and as the server-side `value`, completely bypassing any call to detectBrowserDefault()/navigator/matchMedia during SSR (discriminated via `typeof window === 'undefined'`, which remains a reliable Node-vs-browser check even though `navigator` no longer is). This directly removes the mechanism that let Node's fake navigator stub corrupt SSR output, and guarantees the toggle's SSR-rendered state always matches i18next's separately-fixed SSR default ('pt'), for both the language and (as a shared-code side effect) the theme preference hook."
  blind_spots: "Did not exhaustively verify whether Node's `navigator.language` stub behavior is consistent across all Node 20/22/24 versions/patch releases (Dockerfile targets Node 20 Alpine, this sandbox runs Node 24) — but the fix is defensive regardless of the exact Node behavior, since it never calls browser-detection functions during SSR at all anymore. Did not test the theme toggle's equivalent scenario end-to-end (dark OS preference on a fresh visit) beyond confirming the existing theme Playwright suite still passes — the same class of bug likely existed there too (pre-existing, out of scope of this specific ticket) and is fixed as a byproduct of the shared-hook fix."

## Symptoms
<!-- Written during gathering, then immutable -->

expected: The language toggle button should show/mark whichever language is actually being displayed in the site content (i.e., toggle state and rendered content language must always agree).
actual: On loading the site, the toggle button appears marked/selected as "EN", but the site content renders in Portuguese (PT-BR).
errors: None visible in browser console (user checked).
reproduction: Happens both on first visit (presumably fresh/no persisted preference) and on subsequent reloads — user reports "both cases".
started: Always been like this — since the language toggle feature was implemented (Phase 3, language-toggle-i18n).

## Eliminated

- hypothesis: "Client-side hydration-timing race — toggle briefly shows the browser-detected language before the post-mount `i18n.changeLanguage` effect fires and corrects content, producing only a transient flash."
  evidence: "Playwright test with the pt-BR-visitor scenario (real client navigator overridden to pt-BR before hydration) still showed togglePressed='EN' under the pre-fix code, even after a 500ms settle — a genuine client-side race would resolve using the CLIENT's own (correct, pt-BR-based) detection and converge to PT, not stay stuck on EN. The value must therefore be coming from the SSR-rendered markup itself, which is identical for every visitor regardless of their real navigator."
  timestamp: 2026-07-07T21:40:00Z

## Evidence

- timestamp: 2026-07-07T21:00:00Z
  checked: app/hooks/useLanguage.ts, app/hooks/usePersistedPreference.ts, app/hooks/useTheme.ts, app/i18n/config.ts, app/root.tsx, app/features/Header/LanguageToggle.tsx
  found: >
    `usePersistedPreference`'s `createStore()` computed `const serverSnapshot = detectBrowserDefault();` unconditionally
    — i.e. it called the passed-in browser-detection function (`detectBrowserLanguage`, reading `navigator.language`) in
    WHICHEVER environment first creates the store (server during SSR, or client during hydration — these are separate
    module instances with no shared memory). `getServerSnapshot` returned this same value. i18next's config
    (`app/i18n/config.ts`) separately hardcodes `lng: "pt"` as a fixed SSR default, independent of this hook.
  implication: >
    Two independent "default language" computations exist (i18next's fixed "pt", and usePersistedPreference's
    environment-dependent `detectBrowserDefault()`), with no guarantee they agree — the toggle's active state and the
    rendered content's language are driven by different sources.

- timestamp: 2026-07-07T21:15:00Z
  checked: Ran Playwright diagnostic (3 scenarios — en-US, pt-BR, default browser locale — via addInitScript navigator override) against original code.
  found: >
    First pass used a flawed className check (`class.includes("text-accent-hover")`, which false-positives against the
    always-present static `hover:text-accent-hover` Tailwind utility present on both buttons regardless of state).
    Corrected to exact-token matching (`class.split(/\s+/).includes("text-accent-hover")`).
  implication: >
    The apparent "aria-pressed vs className disagree with each other" finding from the first pass was a test artifact,
    not a real product bug. Re-ran with the corrected check for accurate evidence (see next entries).

- timestamp: 2026-07-07T21:30:00Z
  checked: `node -e "console.log(typeof navigator, navigator.language, typeof window)"` in this repo's environment (Node v24.16.0).
  found: "`typeof navigator` = 'object' (NOT 'undefined'), `navigator.language` = 'en-US' (hardcoded, ignores `LANG=C.UTF-8` env), `typeof window` = 'undefined'."
  implication: >
    Node 21+'s global `navigator` stub defeats `detectBrowserLanguage()`'s `typeof navigator === "undefined"` SSR guard.
    During real SSR, `detectBrowserLanguage()` evaluates `navigator.language.toLowerCase()` = "en-us" -> does not
    start with "pt" -> returns "en", for EVERY request, regardless of the real visitor. `typeof window === "undefined"`
    remains a reliable server/client discriminator in this same environment.

- timestamp: 2026-07-07T21:45:00Z
  checked: Re-ran corrected Playwright diagnostic (3 scenarios) against ORIGINAL (pre-fix) code.
  found: >
    ALL THREE scenarios showed togglePressed="EN" (en-US, pt-BR, and default browser locale) — including the
    pt-BR-visitor scenario where content correctly rendered "Início" (Portuguese, from i18next's fixed SSR default).
    activeByClass agreed with togglePressed in every case once the test bug was fixed (no more internal aria/class
    split — that was purely the earlier test artifact).
  implication: >
    Confirms the root cause is server-side (baked into SSR HTML), not a client hydration-timing race — matches
    Node-navigator-stub theory exactly, and matches the user's exact reported symptom (toggle=EN, content=PT) for the
    most likely real-world scenario (a pt-BR-locale visitor, i.e. this developer's own daily browser).

- timestamp: 2026-07-07T22:00:00Z
  checked: Applied fix (usePersistedPreference.ts, useLanguage.ts, useTheme.ts) then re-ran corrected Playwright diagnostic + raw `curl` of SSR HTML.
  found: >
    All 3 scenarios now fully consistent (togglePressed === activeByClass === content language) for en-US, pt-BR, and
    default-locale visitors. `curl http://localhost:5173/` (no JS) shows PT button `aria-pressed="true"` with active
    class, EN button `aria-pressed="false"` with muted class, matching the always-"pt" SSR content — correct from the
    very first byte of HTML.
  implication: Root cause fixed at the SSR layer, not just papered over client-side.

- timestamp: 2026-07-07T22:05:00Z
  checked: Full existing Playwright suite (29 tests across language-toggle, theme-toggle, theme-light, visual specs) run twice after the fix; `npx tsc --noEmit`; `npx eslint app/hooks tests/language-toggle.spec.ts`.
  found: "29/29 passed on both clean runs (one earlier failure in a cold-start run reproduced as flakiness, not tied to the fix — confirmed by 3/3 isolated passes and 2/2 clean full-suite passes). Typecheck and lint clean."
  implication: No regressions from the shared-hook change (theme toggle continues to work correctly).

## Resolution

root_cause: >
  `usePersistedPreference` (shared by `useLanguage` and `useTheme`) computed the value handed to React as
  `getServerSnapshot` by calling the same browser-detection function (`detectBrowserLanguage()` / `detectBrowserTheme()`)
  used to determine the real client-side value — instead of using a fixed, deterministic constant. Those detection
  functions guard for SSR via `typeof navigator === "undefined"` (language) / `typeof window === "undefined"` (theme),
  assuming Node has no `navigator` global. Node 21+ (this environment runs Node v24) exposes a global `navigator` stub
  whose `.language` getter resolves to a hardcoded "en-US" — unrelated to the real visitor's request — which silently
  defeats `detectBrowserLanguage()`'s guard. During actual server-side rendering, `detectBrowserLanguage()` therefore
  evaluates `navigator.language` = "en-US" and returns "en" for EVERY request, baking an incorrect "EN active" toggle
  state into the SSR HTML unconditionally. Meanwhile i18next's rendered content uses a separate, correctly-fixed "pt"
  SSR default (`app/i18n/config.ts`, `lng: "pt"`, the documented D-02 tradeoff) — completely independent of this
  broken detection. The result: the toggle button and the rendered content are driven by two different "what's the
  default language" computations that can (and, for the common Node 21+ runtime, always do) disagree — producing the
  exact reported symptom (toggle marked EN, content in Portuguese) on every single page load, not a hydration flash.

fix: >
  Added an explicit `ssrDefault: T` option to `usePersistedPreference` (a plain constant, never derived from any
  browser/Node global). `getServerSnapshot()` now returns this constant directly, and the store's initial server-side
  `value` uses it too (discriminated via `typeof window === "undefined"`, which remains a reliable Node-vs-browser
  check in this environment even though `navigator` no longer is). `useLanguage.ts` passes `ssrDefault: "pt"` (matching
  i18n/config.ts's fixed `lng`), and `useTheme.ts` passes `ssrDefault: "light"` (matching `detectBrowserTheme()`'s
  existing `typeof window === "undefined"` fallback branch, preserving its prior behavior). This guarantees the
  toggle's SSR-rendered state is always byte-identical to i18next's actual SSR content, regardless of any
  environment-specific `navigator`/`matchMedia` quirks.

verification: >
  1) Direct Node REPL check confirmed the root-cause mechanism (`navigator.language` = "en-US" in Node v24 despite
  `typeof navigator === "undefined"` guard). 2) Playwright diagnostic re-run against original code with a corrected
  (bug-fixed) assertion showed the exact reported mismatch reproducibly in all visitor scenarios. 3) Same diagnostic
  against the fix shows full consistency (toggle state == content language) for en-US, pt-BR, and default-locale
  visitors. 4) Raw `curl` of SSR HTML confirms the fix holds at the server-rendering layer, before any JS runs.
  5) Full existing Playwright suite (29 tests) passes twice cleanly post-fix; `tsc --noEmit` and `eslint` clean.
  6) New permanent regression tests added to `tests/language-toggle.spec.ts` (describe block
  "language toggle / content sync (regression: lang-toggle-en-pt-mismatch)") covering the en-US/pt-BR client scenarios
  and a raw SSR-HTML assertion, so any future reintroduction of this bug fails CI.

files_changed:
  - app/hooks/usePersistedPreference.ts (added `ssrDefault` option; `getServerSnapshot`/initial server `value` now use it directly instead of calling `detectBrowserDefault()`)
  - app/hooks/useLanguage.ts (passes `ssrDefault: "pt"`)
  - app/hooks/useTheme.ts (passes `ssrDefault: "light"`)
  - tests/language-toggle.spec.ts (added regression test suite for this bug; the temporary diagnostic file tests/diag-lang-mismatch.spec.ts was folded into this file and removed)
