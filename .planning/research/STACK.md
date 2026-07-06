# Stack Research

**Domain:** Adding a CSS theme/token system with light+dark mode, and PT-BR/EN i18n, to an existing React 19 + React Router 7 (SSR) + Tailwind CSS 4 portfolio
**Researched:** 2026-07-06
**Confidence:** MEDIUM (official docs cross-checked via web search + direct doc fetch; no Context7 MCP available in this environment, so tier caps at MEDIUM rather than HIGH — see Sources)

> Scope note: this file does NOT re-recommend the existing stack (React 19.2.6, React Router 7.15.1, TypeScript 5.9.3, Tailwind CSS 4.2.2 — see `.planning/codebase/STACK.md`). It only covers what's needed to ADD theming + i18n to that stack, per `.planning/PROJECT.md`.

> **Correction to existing docs:** `.planning/codebase/ARCHITECTURE.md` states "Client-only: No server-side rendering." This is stale/incorrect. `react-router.config.ts` has `ssr: true`, and the build produces `@react-router/serve` + `@react-router/node` server bundles. **SSR is active.** This materially changes the theming/i18n approach: a pure CSR app wouldn't need anti-flash scripts or `suppressHydrationWarning`; this app does. Roadmap and phase plans should treat SSR as a real constraint, not skip it because ARCHITECTURE.md says otherwise.

## Recommended Stack

### Core Technologies (new additions only)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Tailwind CSS `@custom-variant` (no new package) | tailwindcss 4.2.2 (already installed) | Switch `dark:` from OS-only to manual class-based toggle | Tailwind v4 moved dark mode config out of `tailwind.config.js` entirely (CSS-first `@theme`). The only supported way to get a manually-toggleable `dark:` variant in v4 is `@custom-variant dark (&:where(.dark, .dark *));` in `app.css`. There is no JS config equivalent anymore — this is not optional syntax sugar, it's the only mechanism. |
| `react-i18next` | 17.0.8 | React bindings for i18next (`useTranslation`, `Trans`, `I18nextProvider`) | Explicit project decision (Key Decisions in PROJECT.md). Current major (v17) targets `i18next >= 26.2.0` and `react >= 16.8.0` — compatible with React 19.2.6 already in the project. Actively maintained, the de facto standard React i18n library. |
| `i18next` | 26.3.4 | Core i18n engine (translation resources, language switching, interpolation) | Required peer of react-i18next. No SSR-specific plugin needed for a 2-language, static-string portfolio — plain `i18next.init()` with inline `resources` is sufficient (see "What NOT to Use"). |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `i18next-browser-languagedetector` | 8.2.1 | Auto-detect language from `localStorage` / `navigator.language` on the client | Recommended — it's a ~3KB, zero-dependency plugin from the same i18next org, and its **default** detection order (`querystring, hash, cookie, localStorage, sessionStorage, navigator, htmlTag, path, subdomain`) and default caches (`['localStorage', 'cookie']`) already match the project's exact requirement ("localStorage override, else browser language"). Trim the `order` array to `['localStorage', 'navigator']` to skip the detectors you don't use. This is technically one dependency beyond the "only react-i18next + i18next" constraint in PROJECT.md — flag this explicitly at planning time; the DIY alternative (7-10 lines checking `localStorage.getItem('lang') ?? navigator.language.startsWith('pt') ? 'pt' : 'en'`) is a legitimate zero-dependency substitute if the team wants to hold the line on that constraint. |

### Development Tools

No new dev tooling required. Existing ESLint/Prettier/TypeScript setup covers new files without changes. If translation JSON files grow large, consider `i18next-parser` later for extracting/validating keys — not needed at this scope (small, static, single-page portfolio).

## Installation

```bash
# Core i18n
npm install react-i18next i18next

# Optional (recommended) — auto-detection of stored/browser language
npm install i18next-browser-languagedetector

# Theming requires NO new package — it's a CSS change in app.css using
# Tailwind v4's existing @custom-variant syntax.
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Hand-rolled theme toggle (no package) + Tailwind `@custom-variant dark` | `next-themes` | Never for this project — `next-themes` is Next.js-specific (relies on the Next.js App/Pages Router context) and does not integrate with React Router 7. A hand-rolled ~30-line hook + inline script achieves the identical zero-flash result with zero dependency risk. |
| Class-based `@custom-variant dark (&:where(.dark, .dark *))` | Data-attribute variant `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` | Use data-attribute only if you anticipate more than 2 themes later (e.g., a third "high-contrast" or branded theme) since `data-theme="x"` scales to N values better than stacking boolean classes. Not needed here — project explicitly scopes to light/dark only. |
| Plain `react-i18next` + `i18next-browser-languagedetector`, client-driven | `remix-i18next` (v7.5.0 for React Router 7; **v8.0.0 requires React Router ^8 — do not install `remix-i18next@latest` blindly, it will break peer deps**) | Use `remix-i18next` only if the project later adds per-route localized URLs (`/en/...`, `/pt/...`) for SEO, or needs the server to resolve language from `Accept-Language`/cookies per request across multiple routes. This portfolio is a single route with a client-side toggle preference — that per-request middleware machinery is unneeded complexity and an extra dependency PROJECT.md doesn't call for. |
| Inline synchronous `resources` on `i18next.init()` | `i18next-http-backend` (lazy-load JSON over HTTP) | Use a backend loader only if translation volume grows large enough that bundling both languages inline meaningfully bloats the JS payload, or if translations need to be updated without a redeploy (e.g., via Locize/CDN). Not justified for a personal portfolio's finite string count — inline resources also sidesteps the entire "flash of untranslated content while fetching" problem for free. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| `tailwind.config.js` `darkMode: 'class'` | Tailwind CSS v4 does not read `tailwind.config.js` for dark mode at all in the CSS-first setup this project uses (`@import "tailwindcss"` + `@theme` in `app.css`). Config left there (if any exists) is dead code for this purpose. | `@custom-variant dark (&:where(.dark, .dark *));` directly in `app.css`. |
| `remix-i18next@latest` (currently 8.0.0) | Requires `react-router@^8.0.0` (middleware-only rewrite). Installing it against this project's pinned `react-router@7.15.1` will produce a peer-dependency conflict / broken runtime behavior, not just a warning. | If `remix-i18next` is ever adopted, pin `remix-i18next@7.5.0` explicitly (last line supporting React Router 7). For this milestone, skip it entirely (see Alternatives). |
| Calling `i18n.changeLanguage()` synchronously during initial render (e.g., directly in component body based on `navigator.language`) | `navigator.language` doesn't exist on the server. Reading it during the render that SSR also executes causes a server/client output mismatch — a real React hydration error, not just a visual flash. | Initialize i18next with a fixed default language identical on server and client. Detect and switch the *actual* user preference only inside a `useEffect` (runs post-mount, client-only) — matches official react-i18next SSR guidance. |
| Suspense-based lazy translation loading (`useSuspense: true` default) combined with an SSR route that has no corresponding server-side translation loading | Produces either a server/client mismatch or a Suspense boundary that never resolves correctly server-side without additional plumbing (`renderToPipeableStream` coordination). | Set `react: { useSuspense: false }` in `initReactI18next` config and bundle both locale resource objects synchronously — nothing to suspend on. |
| Any inline theme/lang bootstrap script placed in `<body>` or after `<Scripts />` | Runs after the browser has already painted the SSR HTML — you get the exact flash you're trying to prevent. | Place the theme bootstrap `<script>` inside `<head>`, before `<Meta />`/`<Links />` render is fine, but it must execute before first paint — i.e., inside `<head>` in `root.tsx`'s `Layout`, not in `<body>`. |

## Stack Patterns by Variant

**If implementing the dark mode toggle:**
- Add `@custom-variant dark (&:where(.dark, .dark *));` to `app.css` right after `@import "tailwindcss";`
- Add an inline blocking `<script>` in the `<head>` of `root.tsx`'s `Layout` component (via `dangerouslySetInnerHTML`) that runs this exact logic before first paint:
  ```js
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  ```
- Add `suppressHydrationWarning` to the `<html>` element in `Layout` — required because the script mutates the `class` attribute before React hydrates, and the SSR-rendered HTML (which has no knowledge of the visitor's `localStorage`) will legitimately differ from the DOM state at hydration time. This is expected and safe; without `suppressHydrationWarning`, React logs a (harmless but noisy) hydration warning for that one attribute.
- Toggle button writes `localStorage.theme = "light" | "dark"` and directly flips the `dark` class on `document.documentElement` (no full page reload needed) — mirrors the same logic as the bootstrap script.
- Because SSR always renders a theme-agnostic version of the HTML (no theme class from the server), the *first* server-rendered paint that a browser would see without JS would default to whatever `app.css`'s base styles specify (currently hardcoded `bg-gray-950 text-white` — dark). Decide explicitly whether that "no-JS fallback" should stay dark (current default) or become the token-driven neutral default; this is a Phase 1 (theme centralization) decision, not a Phase 2 (dark mode toggle) one.

**If implementing the language toggle:**
- Initialize i18next once, synchronously, with both `en` and `pt` resource objects inlined (`resources: { en: {...}, pt: {...} }`) and a **fixed default `lng`** (pick one, e.g. `"pt"`, matching the site's primary authored language) — identical on server and client. This guarantees the first client render matches the SSR output exactly, avoiding a hydration error.
- Configure `react: { useSuspense: false }` in `initReactI18next`.
- After mount, in a `useEffect` in the root/App component, read the detected/stored language (via `i18next-browser-languagedetector` or the DIY equivalent) and call `i18n.changeLanguage(detected)` if it differs from the default. This causes one visible re-render (a language "flash") for first-time visitors whose preference differs from the default — this is inherent to not having a cookie the server can read on the very first request, and is an accepted, standard tradeoff (see Gaps below for the zero-flash alternative and why it's out of scope here).
- Persist the toggle's manual choice to `localStorage` (the detector's default `caches: ['localStorage', 'cookie']` already does this — trim to `['localStorage']` only if avoiding the cookie write is preferred; a cookie has no benefit here since there's no server-side reader for it in this milestone's scope).
- Do not add per-route `/en`, `/pt` URLs — the project has a single route today; a client-preference toggle (like the theme toggle) is the correct shape for this requirement, not a routing change.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `react-i18next@17.0.8` | `i18next@>=26.2.0`, `react@>=16.8.0` | Confirmed compatible with the project's `react@19.2.6`. Verified via `npm view react-i18next peerDependencies` directly against the npm registry (HIGH confidence — registry data, not a claim). |
| `i18next-browser-languagedetector@8.2.1` | Any `i18next` version (no peer dependency on i18next itself; it only implements the `languageDetector` plugin interface) | Safe to add independently of the i18next/react-i18next version pins above. |
| `remix-i18next@7.5.0` (if adopted later) | `react-router@^7.0.0`, `i18next@^24\|^25\|^26`, `react-i18next@^13-17`, `react@^16-19` | The last 7.x line supporting React Router 7. **`remix-i18next@8.0.0` (current `latest` tag) requires `react-router@^8.0.0`** — this project pins `react-router@7.15.1`, so `npm install remix-i18next` without a version pin will install an incompatible major. If ever adopted, install as `remix-i18next@7.5.0` explicitly. |
| `tailwindcss@4.2.2` (existing) | `@custom-variant` directive | Available since Tailwind CSS v4.0 CSS-first config; no version bump needed. Latest on npm is `4.3.2` (minor bump available, not required for this feature). |

## Sources

- `https://tailwindcss.com/docs/dark-mode` — official Tailwind CSS docs, fetched directly (WebFetch) and cross-checked via web search summaries; confirms `@custom-variant dark (&:where(.dark, .dark *));` as the v4 class-based mechanism and the `prefers-color-scheme` default. Confidence: MEDIUM (no Context7 MCP available in this run to escalate to HIGH; content matches official domain and was internally consistent across two independent fetches).
- `https://react.i18next.com/latest/ssr` — official react-i18next docs, fetched directly; confirms `initialLanguage`/`initialI18nStore` hydration pattern and that framework-specific SSR is normally delegated to plugins like `next-i18next`/`remix-i18next`. Confidence: MEDIUM.
- `https://github.com/i18next/i18next-browser-languageDetector` (via web search / DeepWiki summary) — default detection order and caches. Confidence: MEDIUM.
- `https://github.com/sergiodxa/remix-i18next` (via WebFetch summary) — v7 vs v8 React Router compatibility split. Confidence: MEDIUM (summarized by fetch tool, not a raw diff of the README — recommend a maintainer double-check the exact README wording before writing code against it, since this is the single most version-sensitive claim in this document).
- npm registry, queried directly via `npm view <pkg> version` / `npm view <pkg> peerDependencies` / `npm view <pkg> dist-tags` (Bash, 2026-07-06) — exact current versions and peer dependency ranges for `react-i18next`, `i18next`, `i18next-browser-languagedetector`, `remix-i18next`, `tailwindcss`, `react-router`. Confidence: HIGH (authoritative registry data, not an LLM claim).
- `.planning/PROJECT.md`, `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, `react-router.config.ts`, `app/root.tsx`, `app/app.css`, `package.json` — read directly from the repository (2026-07-06) to ground recommendations in the actual current stack and to catch the stale "no SSR" claim in ARCHITECTURE.md.

---
*Stack research for: Tailwind CSS 4 theming + dark mode, react-i18next SSR i18n on React Router 7*
*Researched: 2026-07-06*
