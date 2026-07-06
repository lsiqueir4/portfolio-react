# Project Research Summary

**Project:** dev-portfolio-react — theming (light/dark) + i18n (PT-BR/EN) retrofit
**Domain:** Adding a semantic color-token system with manual dark/light mode and PT-BR/EN language toggle, plus a bilingual README, to an existing React 19 + React Router 7 (SSR) + Tailwind CSS 4 single-page portfolio
**Researched:** 2026-07-06
**Confidence:** MEDIUM

## Executive Summary

This is a retrofit, not a greenfield build: a working, single-route SSR portfolio (React 19.2.6 + React Router 7.15.1 + Tailwind CSS 4.2.2) needs a centralized color-token system, a manually-toggleable dark mode, a PT-BR/EN language switcher, and a bilingual README, with an explicit constraint of not changing existing content or site structure. All four research tracks converge on the same critical fact that corrects the existing codebase docs: `.planning/codebase/ARCHITECTURE.md` incorrectly states this app is client-only. It is a real SSR app (`ssr: true`, `@react-router/serve`), and that single fact drives nearly every technical decision below — theme and language state depend on client-only signals (`localStorage`, `matchMedia`, `navigator.language`) that the server cannot see, so flash-of-wrong-content and hydration-mismatch risks are real, not theoretical.

The recommended approach is deliberately minimal: no new theming library (a ~15-line inline pre-hydration `<script>` plus Tailwind v4's `@custom-variant dark` mechanism replaces anything like `next-themes`, which doesn't fit React Router 7 anyway), and exactly one new dependency pair for i18n (`react-i18next` + `i18next`, optionally `i18next-browser-languagedetector`) rather than the heavier `remix-i18next` SSR middleware. The architecture centers on Tailwind v4 CSS-first `@theme` semantic tokens (`bg-surface`, `text-accent`, etc.) so components never need conditional theme logic — toggling a `.dark` class on `<html>` is sufficient. The build order (CSS tokens → dark mode toggle → i18n toggle → bilingual README) is confirmed sound by architecture research, with one refinement: Phase 2 should produce a small reusable "detect default → allow override → persist" primitive that Phase 3 reuses for language state.

The key risks are process risks, not technology risks: (1) manually "improving" PT-BR text while extracting it into translation resources, silently violating the no-content-change constraint; (2) `data.tsx` array literals (where most real content — experience, courses — actually lives) being invisible to standard i18next extraction tooling, producing a false "fully translated" signal; (3) classic SSR dark-mode FOUC/hydration-mismatch if the inline pre-hydration script is skipped; and (4) Tailwind v4's breaking change removing `darkMode: 'class'` from JS config entirely, meaning any dark-mode toggle needs the `@custom-variant dark` directive from day one or it will silently produce zero visual effect. This project also has zero test coverage and no visual regression tooling, so the color-token refactor across 6+ feature folders needs a manual grep-and-screenshot verification discipline rather than automated safety nets.

## Key Findings

### Recommended Stack

No new dependency is needed for theming — Tailwind CSS v4's CSS-first `@theme` config plus a `@custom-variant dark (&:where(.dark, .dark *));` directive in `app.css` is the only supported mechanism for manual dark-mode toggling in v4 (the old `tailwind.config.js` `darkMode: 'class'` approach is dead code in v4). For i18n, `react-i18next@17.0.8` + `i18next@26.3.4` are confirmed compatible with React 19.2.6, and are an explicit project decision. `i18next-browser-languagedetector@8.2.1` is recommended as a small, optional addition whose default detection order/caches already match the "localStorage override, else browser language" requirement — flag at planning time since it's one dependency beyond the strict "only react-i18next + i18next" reading of PROJECT.md (a ~7-line DIY equivalent is a valid zero-dependency substitute).

**Core technologies:**
- Tailwind CSS `@custom-variant dark` (no new package, tailwindcss 4.2.2 already installed) — the only v4-native way to get a manually-toggleable `dark:` variant
- `react-i18next` 17.0.8 + `i18next` 26.3.4 — React i18n bindings and engine; explicit project decision, compatible with React 19
- `i18next-browser-languagedetector` 8.2.1 (optional) — auto-detects language from localStorage/navigator.language with defaults matching the project's exact requirement

**Explicitly avoid:** `next-themes` (Next.js-specific, doesn't integrate with React Router 7), `remix-i18next@latest`/8.0.0 (requires React Router ^8, incompatible with this project's pinned 7.15.1 — if ever adopted, pin `7.5.0`), Suspense-based lazy translation loading (causes SSR mismatches), and any `tailwind.config.js` `darkMode` setting (dead in v4).

### Expected Features

**Must have (table stakes):**
- Header dark/light toggle — sun/moon icon button, `aria-label` + `aria-pressed`, defaults to `prefers-color-scheme`, persists via localStorage, no FOUC, keyboard-operable native `<button>`
- Header PT-BR/EN language toggle — text labels ("PT"/"EN", not flags), defaults to `navigator.language`, persists via localStorage, updates `document.documentElement.lang`, `aria-label`
- Theme/color token centralization — prerequisite, not user-facing, but required for the toggle to work cleanly
- Bilingual `README.md` (PT-BR) + `README.en.md` (EN), cross-linked at top of each — standard OSS convention
- Purple accent preserved as identity color across both themes (explicit project requirement)

**Should have (differentiators, only if free within existing phase budget):**
- Animated icon transition on toggle (rotate/crossfade)
- `aria-live` confirmation announcement on toggle

**Defer / do not build (explicitly out of scope):**
- Three-way theme toggle (System/Light/Dark)
- Additional languages beyond PT-BR/EN, additional themes beyond light/dark
- Locale-prefixed routes or URL-based language/theme state
- Language auto-detect banners, IP/geolocation-based detection
- Combined single dropdown for both theme and language

### Architecture Approach

The system is a document-shell pattern: `root.tsx`'s `Layout` component gains an inline pre-hydration `<script>` in `<head>` (sets the `dark` class before paint) plus `suppressHydrationWarning` on `<html>`, and wraps `{children}` — not the inner `App` component — with a new `ThemeProvider` and `I18nextProvider`, so both normal routes and error pages get correct theme/language context. `app.css` defines semantic color tokens via Tailwind v4's `@theme` block plus a `.dark { }` override block, so components use `bg-surface`/`text-accent`/`text-on-surface` instead of raw `zinc-950`/`purple-500` and never need conditional theme logic. Feature folders (Header, Hero, Projects, AboutMe, Contacts, Footer) are untouched structurally — they only gain `useTranslation()` calls and swap hardcoded utility classes for semantic tokens. A new `app/providers/` directory (theme script, ThemeProvider, i18n singleton) and `app/locales/` directory (en.ts, pt.ts) are the only new top-level additions, following the codebase's existing lowercase-directory convention for cross-cutting concerns.

**Major components:**
1. `app/providers/theme-script.ts` — static string, injected via `dangerouslySetInnerHTML`, runs pre-hydration to set the `dark` class with zero flash
2. `app/providers/ThemeProvider.tsx` — React Context exposing `{theme, toggleTheme}`, lazy-initializes from the DOM state the script already set
3. `app/providers/i18n.ts` + `app/locales/{en,pt}.ts` — i18next singleton with synchronously bundled resources (no HTTP backend), fixed default language identical on server and client to avoid hydration mismatch
4. `Header` (existing) — gains two new toggle buttons consuming `useTheme()`/`useTranslation()`
5. `app.css` — `@theme` semantic tokens + `.dark` override + `@custom-variant dark` directive

### Critical Pitfalls

1. **Content silently altered during i18n extraction** — moving PT-BR text into translation resources invites "cleanup" (typo fixes, rewording) that violates the no-content-change constraint. Avoid by treating extraction as a mechanical, byte-identical diff, done in a commit separate from any real translation work, with proper nouns/dates classified explicitly before touching them.
2. **`data.tsx` literal content invisible to i18n tooling** — most real content (experience descriptions, course names) lives in data arrays, not JSX, so standard extraction tools report "0 missing keys" while Portuguese text still ships to the English locale. Avoid by manually auditing every `data.tsx`/`types.tsx` file and doing a full manual read-through of the rendered EN page, not trusting tooling output alone.
3. **Dark mode FOUC on SSR loads** — if theme is resolved only in `useEffect`, the server always renders one default and the browser flashes before flipping. Avoid with a static inline pre-hydration `<script>` in `<head>` (never in `<body>` or after `<Scripts/>`), wrapped in try/catch for private-browsing `localStorage` throws.
4. **Tailwind v4 dark variant not wired for manual toggle** — v4 removed `darkMode` from JS config entirely; without an explicit `@custom-variant dark (...)` declaration, a toggle button changes state but produces zero visual change. Must be defined in the same phase as the color tokens, not deferred.
5. **Dynamically constructed Tailwind class names produce no styles** — string-interpolated class names (`` `bg-${color}-500` ``) are invisible to Tailwind's static scanner and silently render unstyled with no build error. Avoid via literal lookup maps per variant; grep the diff for template-literal class construction before merging.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Theme/CSS Token Centralization
**Rationale:** Dark mode cannot be built cleanly against scattered hardcoded `purple-*/zinc-*/gray-*` classes; this is a hard prerequisite confirmed by all four research tracks. Scope this phase to CSS/token work only (no JS toggle logic yet) so there's a clean, verifiable checkpoint: after this phase, flipping the OS-level `prefers-color-scheme` setting in devtools should already correctly invert all colors via pure CSS, proving the tokens are wired before Phase 2 adds manual-override complexity.
**Delivers:** `@theme` semantic color tokens in `app.css`, `.dark` override block, `@custom-variant dark` directive, all feature files migrated from raw Tailwind color utilities to semantic tokens (`bg-surface`, `text-accent`, etc.)
**Addresses:** Theme/color token centralization (table stakes prerequisite)
**Avoids:** Pitfall 5 (dark variant not wired), Pitfall 6 (dynamic class name interpolation), Pitfall 7 (missed hardcoded color class / visual regression)

### Phase 2: Dark Mode Toggle
**Rationale:** Builds on Phase 1's tokens; adds the manual override layer (inline script, Context, localStorage) that Phase 1 deliberately deferred. Should also produce a small reusable "detect default → allow override → persist" primitive for Phase 3 to reuse.
**Delivers:** Inline pre-hydration `<script>` in `root.tsx`'s `Layout` `<head>`, `suppressHydrationWarning` on `<html>`, `ThemeProvider` Context + `useTheme()` hook, toggle button in Header with sun/moon icon, `aria-label`/`aria-pressed`
**Uses:** Tailwind `@custom-variant dark`, `localStorage`, `matchMedia`
**Implements:** `app/providers/theme-script.ts`, `app/providers/ThemeProvider.tsx`

### Phase 3: Language Toggle (i18n)
**Rationale:** Architecturally independent of theming but should reuse Phase 2's persisted-preference pattern. Requires react-i18next setup, resource bundles, and — critically — a manual string-inventory pass across `data.tsx` files (not just JSX), since standard extraction tooling misses those.
**Delivers:** `react-i18next`/`i18next` singleton with bundled `en.ts`/`pt.ts` resources, all user-facing strings (including `data.tsx` arrays, `aria-label`s, `<title>`/meta, alt text) wired through `t()`, dynamic `<html lang>`, language toggle button in Header
**Addresses:** PT-BR/EN language toggle (table stakes)

### Phase 4: Bilingual README
**Rationale:** No architectural dependency on Phases 1-3 beyond describing the finished feature set; correctly ordered last.
**Delivers:** `README.md` (PT-BR, primary) + `README.en.md` (EN), cross-linked at the top of each, content parity on features/tech-stack sections

### Phase Ordering Rationale

- Dependency-driven: dark mode requires tokens (Phase 1→2); i18n and theming are independent of each other but share a reusable persistence pattern (Phase 2→3 reuse, not blocking dependency); README describes the finished feature set (last, Phase 4)
- SSR is a real, active constraint (not client-only, correcting stale codebase docs) — this is why Phases 2 and 3 both require deliberate anti-FOUC/anti-hydration-mismatch handling rather than naive `useEffect`-only implementations
- Splitting "CSS tokens" from "JS toggle logic" within what might otherwise be a single dark-mode phase gives a clean, testable checkpoint and avoids conflating two different risk profiles (visual regression vs. hydration mismatch)

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (i18n):** Needs a documented decision on the accepted one-time post-mount language "flash" for non-default-locale users (a known, low-stakes trade-off given no cookie/`Accept-Language` server-side resolution in scope) — confirm at kickoff, not discovered mid-implementation. Also needs explicit ambiguity resolution on locale-formatted values (e.g., should "Fev 2022" render as "Feb 2022" in English?) before extraction begins.
- **Phase 1 (tokens):** Needs a complete inventory/checklist of every current color utility prefix (`purple-`, `zinc-`, `gray-`) before starting, given zero test/visual-regression coverage in this project.

Phases with standard patterns (skip research-phase):
- **Phase 2 (dark mode toggle):** Well-documented, established SSR pattern (inline blocking script + CSS variable class toggle) — architecture and pitfalls research already fully specify the implementation.
- **Phase 4 (bilingual README):** Standard, well-established OSS convention with no technical risk.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Official docs cross-checked via WebFetch + npm registry (registry data itself is HIGH, but no Context7 MCP available to escalate framework-doc claims to HIGH) |
| Features | MEDIUM | Cross-checked against official W3C WAI-ARIA APG spec and USWDS design system (HIGH-confidence sources), but no single authoritative "portfolio site" feature spec exists |
| Architecture | MEDIUM-HIGH | Codebase-specific wiring (root.tsx, react-router.config.ts) verified directly from the repo (HIGH); general SSR-theming/i18n best practice is MEDIUM (well-established web convention, no official Context7 docs) |
| Pitfalls | MEDIUM | Cross-verified across multiple independent sources for SSR/hydration and Tailwind v4 mechanics; framework-specific API details should be reconfirmed against official react-i18next/tailwindcss docs during planning |

**Overall confidence:** MEDIUM

### Gaps to Address

- **Stale codebase docs:** `.planning/codebase/ARCHITECTURE.md` incorrectly states "no SSR" — this must be corrected before/during roadmap creation so phase plans don't assume a client-only app.
- **`remix-i18next` version sensitivity:** The v7/v8 React Router compatibility split was confirmed via a fetch-tool summary, not a raw README diff — worth a quick maintainer double-check if this library is ever considered, though current recommendation is to avoid it entirely for this milestone.
- **Locale-formatted values ambiguity:** Whether date/status literals (e.g., "Fev 2022", "Em andamento") should be transliterated per-locale or kept as literal strings is unresolved by research and needs an explicit answer during Phase 3 discussion, not left to whoever extracts the strings.
- **No-JS/first-paint default theme:** Whether the app's no-JS fallback (currently hardcoded dark via `bg-gray-950 text-white`) should stay dark or become a token-driven neutral default is a Phase 1 decision the research surfaces but does not resolve.
- **Zero test coverage:** No automated visual regression safety net exists for the token migration across 6+ feature folders; research recommends manual before/after screenshots per feature folder as a substitute, which should be budgeted into Phase 1 planning.

## Sources

### Primary (HIGH confidence)
- npm registry direct queries (`npm view <pkg> version/peerDependencies/dist-tags`) — exact current versions and peer dependency ranges
- Direct repository inspection: `react-router.config.ts`, `package.json`, `app/root.tsx`, `app/app.css`, `.planning/codebase/*`, `.planning/PROJECT.md`
- Switch Pattern and Button Pattern (W3C WAI-ARIA APG official spec)
- Dark mode / Theme variables (Tailwind CSS official docs)
- Language selector (U.S. Web Design System, USWDS)

### Secondary (MEDIUM confidence)
- react-i18next SSR documentation
- remix-i18next GitHub repo and Locize Blog article on React Router v7 i18n
- next-themes GitHub (pacocoursey) — canonical reference implementation of the blocking-script pattern
- Flexible Dark Mode with Tailwind CSS v4 Custom Variants (schoen.world)
- Fixing dark mode flickering (FOUC) articles (notanumber.in, Maxime Heckel blog)
- GitHub Community Discussion on multi-language README files
- multilanguage-readme-pattern GitHub example repo
- Full source lists in each research file: `.planning/research/STACK.md`, `.planning/research/FEATURES.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md`

### Tertiary (LOW confidence)
- None flagged — all sources cross-checked at MEDIUM or higher

---
*Research completed: 2026-07-06*
*Ready for roadmap: yes*
