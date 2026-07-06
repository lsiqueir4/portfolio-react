# Feature Research

**Domain:** Portfolio/marketing site header controls — dark/light mode toggle + PT-BR/EN language switcher, plus bilingual README convention
**Researched:** 2026-07-06
**Confidence:** MEDIUM (cross-checked web sources incl. W3C WAI-ARIA APG official spec and USWDS official design system; no single authoritative "portfolio site" spec exists, so patterns are synthesized from general web UI conventions)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = the toggle feels broken or unpolished.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dark/light toggle button in header, always visible | Standard convention on nearly every modern dev portfolio/marketing site; users look for it in the header/nav on first visit | LOW | Single icon button, not a menu |
| Toggle defaults to OS/browser preference (`prefers-color-scheme`) on first visit | Users with a system-wide dark mode preference expect the site to respect it out of the box; forcing light mode on a dark-mode user feels broken | LOW | Use `window.matchMedia('(prefers-color-scheme: dark)')` as the fallback, not a hardcoded default |
| Manual choice persists across visits (localStorage) | Once a user explicitly picks a mode, re-picking it every visit is the #1 complaint about naive implementations | LOW | Explicit choice must override system preference on subsequent loads |
| No FOUC (flash of unstyled/wrong-theme content) on load | A visible flash from light→dark on page load reads as a bug, not a stylistic quirk | LOW-MEDIUM | Requires reading the theme choice before first paint (inline script or SSR-aware read in React Router 7 loader/root, since this is an SSR app) |
| Sun/moon icon convention | Near-universal visual language; users recognize it instantly without a label | LOW | Icon should represent "what you'll switch to" OR "current state" consistently — pick one convention and keep it project-wide; add `aria-label` since the icon alone doesn't convey purpose to assistive tech |
| `aria-label` and `aria-pressed` on the toggle button | WAI-ARIA APG: toggle buttons must expose `aria-pressed` (true/false); label text must NOT change between states — screen reader announces "Dark mode, toggle button, pressed" rather than swapping the wording | LOW | This is a correctness requirement, not a nice-to-have — a toggle without these is inaccessible |
| Focus-visible state + full keyboard operability (Tab to focus, Enter/Space to activate) | It's a native `<button>` semantically, so this is free if implemented correctly, but commonly broken when built with a plain `<div>` + onClick | LOW | Use a real `<button>` element |
| Purple accent preserved as identity color in both themes | Explicit project requirement (PROJECT.md) — brand consistency across themes is standard practice for dark-mode implementations that "invert background/text only" | LOW | Already scoped in PROJECT.md, listed here for completeness |
| Smooth/instant transition, no jank | Abrupt or janky flips read as low-quality; a short CSS transition (150-250ms) on background/color is standard, but must not lag or cause layout shift | LOW | Optional short `transition-colors` is common; avoid animating structural properties (position/size) |
| Language switcher button in header, near the theme toggle | Same header placement convention as dark mode toggle; users scan the header for both controls together | LOW | Matches project decision to place it "next to" the theme toggle |
| Language switcher uses visible text/labels, not flags alone | Flags represent countries, not languages (e.g., Portuguese is spoken in Brazil AND Portugal); "PT / EN" or "PT-BR / EN" text avoids this confusion entirely | LOW | Given the project is specifically PT-BR/EN, plain text abbreviations are simplest and unambiguous |
| Switcher defaults to browser language (`navigator.language`), remembers manual override via localStorage | Same expectation pattern as theme toggle — respect the user's browser locale first, then respect their explicit choice on future visits | LOW-MEDIUM | Mirrors the dark-mode persistence pattern; consistent mental model for the user |
| `lang` attribute on `<html>` updates when language changes | Core accessibility requirement — screen readers use `lang` to select the correct pronunciation/voice; also matters for browser spell-check and SEO | LOW | Must update `document.documentElement.lang` (or via SSR root loader) when switching, not just the visible text |
| `aria-label` on the language switcher control identifying its purpose | E.g., `aria-label="Change language"` or `aria-label="Selecionar idioma"` on the control/nav so assistive tech announces its purpose | LOW | If a toggle button (not a dropdown), also expose current language state, e.g. via `aria-pressed` or text content indicating current selection |
| Keyboard operability for language switcher | Tab to focus, Enter/Space to activate — same baseline as any interactive control | LOW | Native `<button>`, not `<div onClick>` |
| Bilingual README: separate `README.md` (primary language) + `README.en.md` (secondary), cross-linked at the top | The single most common convention in bilingual OSS repos (README.md stays default/primary, README.en.md or README.<code>.md is the alternate); GitHub has no native README language switching, so cross-links are the accepted workaround | LOW | Add a one-line cross-link banner at the very top of both files, e.g. "🇧🇷 Português \| [🇺🇸 English](README.en.md)" and the mirror in the other file |
| README content parity between language versions | Both files should cover the same sections (features, tech stack, setup) even if wording isn't a literal 1:1 translation | LOW | Matches PROJECT.md requirement: "each highlighting features and the tech stack" |

### Differentiators (Competitive Advantage)

Not required for this milestone given the explicit "don't change structure/content" and "no additional languages/themes" constraints — listed for completeness but likely deferred.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Animated icon transition (sun/moon morph, rotate, or crossfade) on toggle click | Adds polish/delight beyond an instant icon swap | LOW-MEDIUM | Reasonable stretch goal within Phase 2 if time allows — CSS-only rotate/fade is cheap; not required for "table stakes" bar |
| `aria-live` announcement confirming the switch (e.g., "Dark mode enabled") | Improves screen-reader experience beyond the baseline `aria-pressed` state change, which some screen readers announce more reliably than others | LOW | Genuine accessibility enhancement, but APG's `aria-pressed` pattern is considered sufficient baseline; add only if budget allows |
| Respecting `prefers-reduced-motion` for the toggle transition | Accessibility refinement for the animation differentiator above | LOW | Only relevant if the animated transition differentiator is built |
| Toast/tooltip explaining language switcher on first visit | Helps first-time users notice the control exists | LOW | Adds UI surface not requested; likely unnecessary given the control is header-visible and self-explanatory with PT/EN labels |
| `hreflang` alternate `<link>` tags for SEO | Helps search engines understand the page has language variants | MEDIUM | More relevant to multi-URL/multi-route i18n (e.g. `/en/...` paths); this project's i18n is client-side toggle only, not routed, so lower priority |
| Per-language README badges (shields.io style) | Visual polish for the cross-link banner | LOW | Nice touch, not required — plain text links satisfy the convention |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems, or that directly contradict this milestone's explicit constraints.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Three-way theme toggle (System / Light / Dark) | Seen on many sites (e.g. GitHub's own settings), feels "more correct" than binary | PROJECT.md explicitly scopes this to a binary toggle that defaults to system preference; a three-way UI adds a dropdown/menu, more state, and more accessibility surface (radio-group pattern) for a personal portfolio that doesn't need it | Binary toggle defaulting to `prefers-color-scheme`, with manual override — exactly as scoped |
| Language auto-detect banner/prompt ("We detected you're in Brazil, switch to Portuguese?") | Common on large marketing sites to nudge conversion | Adds an extra dismissible UI element, more state to manage, and is unnecessary friction for a personal portfolio with only 2 languages already toggle-visible in the header | Passive default based on `navigator.language`, silent — no banner, no prompt |
| Auto-detecting language via IP/geolocation | Seems "smarter" than browser language | Requires a third-party service or backend call, adds latency/privacy concerns, and browser `navigator.language` is already the correct signal and free | Use `navigator.language`/`navigator.languages` only |
| Additional languages beyond PT-BR/EN (e.g., ES, FR) | "While we're at it" scope creep, common ask once i18n infrastructure exists | PROJECT.md explicitly excludes this — react-i18next makes it technically trivial to add later, which is exactly why it should NOT be done now (scope discipline) | Build the i18n structure to be extensible (react-i18next resource bundles), but ship only PT-BR + EN |
| Additional themes beyond light/dark (e.g., "high contrast", "sepia", seasonal themes) | Seen on some sites as a differentiator | Explicitly out of scope per PROJECT.md; also multiplies the color-token maintenance surface from Phase 1 | Two themes only, sharing the purple accent token |
| A single combined dropdown/menu for both theme AND language | Seems like a tidy way to consolidate header controls | Conflates two unrelated concerns into one interaction, increases complexity of the menu's ARIA pattern (needs a full menu/listbox pattern instead of two simple buttons), and isn't what was decided ("next to" each other, not merged) | Two independent, adjacent header buttons — each with its own simple ARIA pattern |
| Reflecting theme/language choice in the URL (query param or route prefix) | Some i18n setups do this for SEO/shareability (e.g. `/en/about`) | PROJECT.md explicitly preserves existing structure/routes; adding locale-prefixed routes would violate "don't change site structure" | Client-side toggle only, backed by localStorage, no route changes |
| Full translation of all body copy as part of this feature build | Seems like the "point" of adding a language toggle | PROJECT.md explicitly says: no changes to existing text/copy — the toggle mechanism doesn't automatically imply full content is retranslated at launch, but the requirement scope actually does need translated strings for react-i18next to render EN content; distinguish this from *adding new content or rewording existing copy's meaning* | Translate existing copy into the second language 1:1 (no new claims, no rewrites of meaning) via i18next resource files, keeping structure/order/links identical |
| Native OS-style toggle switch (iOS-style pill with sliding knob) implying tri-state or "loading" affordances | Visually trendy | Adds unnecessary visual complexity for what is fundamentally a 2-state button; also easy to mis-implement ARIA (switch role vs button role confusion) if not careful | Simple icon button with `aria-pressed`, following the WAI-ARIA APG Button pattern (not the Switch pattern, unless a literal switch visual is desired — in which case use `role="switch"` + `aria-checked` correctly) |

## Feature Dependencies

```
Theme/color token centralization (Phase 1)
    └──requires──> Dark mode toggle (Phase 2)
                       (toggle needs CSS variables/tokens to flip, not hardcoded utility classes)

Dark mode toggle (Phase 2)
    ──independent of──> Language toggle (Phase 3)
                       (no shared state or DOM dependency between the two)

Language toggle (Phase 3)
    └──requires──> react-i18next setup + translated string resources
                       └──requires──> identifying all user-facing strings in Hero/About/Projects/Contacts/Header/Footer

Bilingual README (Phase 4)
    ──independent of──> all in-app phases
                       (README is documentation, not app runtime — can theoretically be done anytime,
                        but ordered last since it should describe the finished feature set, incl. dark mode + i18n)

localStorage persistence pattern (dark mode)
    ──enhances──> localStorage persistence pattern (language)
                       (same mental model and likely same small utility/hook can back both —
                        e.g. a generic "persisted preference with system-default fallback" hook)
```

### Dependency Notes

- **Dark mode toggle requires theme/color token centralization:** You cannot cleanly implement a dark/light flip against scattered hardcoded `purple-400/500`, `zinc-300/400/900/950`, `gray-950` utility classes — Phase 1's token system is a hard prerequisite, matching the project's own phase ordering.
- **Dark mode and language toggle are independent:** They touch different concerns (CSS/theme state vs. text content/i18n state) and can be built and tested in isolation from each other, even though they'll sit adjacent in the header UI.
- **Language toggle requires react-i18next setup before any translated strings can render:** Provider setup, resource bundles (`en.json`/`pt-BR.json`), and identifying every user-facing string across all sections must happen together as the foundation of Phase 3.
- **Both persistence mechanisms enhance each other via a shared pattern:** Since both dark mode and language use "read localStorage → fall back to a browser signal → let user override → persist," a single small reusable hook/utility (e.g., `usePersistedPreference`) can implement both, reducing duplicate logic. This is an implementation-efficiency opportunity, not a hard blocking dependency.
- **Bilingual README is independent but logically last:** It documents the finished feature set (theme + language toggle), so writing it after Phases 1-3 land avoids describing features that don't exist yet or re-writing it mid-milestone.

## MVP Definition

### Launch With (v1)

Minimum viable product for this milestone — matches PROJECT.md's "Active" requirements exactly.

- [ ] Header dark/light toggle button — sun/moon icon, `aria-label`, `aria-pressed`, defaults to `prefers-color-scheme`, persists via localStorage, purple accent preserved in both modes — essential per PROJECT.md, and table-stakes per research
- [ ] Header PT-BR/EN language toggle — text-based (not flag icons), `aria-label`, defaults to `navigator.language`, persists via localStorage, updates `document.documentElement.lang` — essential per PROJECT.md, and table-stakes per research
- [ ] Theme/color token centralization (CSS variables or Tailwind theme config) — essential prerequisite for the dark mode toggle to work cleanly
- [ ] Bilingual `README.md` (PT-BR) + `README.en.md` (EN), cross-linked at top of each — essential per PROJECT.md, matches OSS convention found in research

### Add After Validation (v1.x)

Nothing planned — PROJECT.md explicitly scopes this milestone to exactly the four items above with no phased rollout beyond them. Any of the Differentiators below would only be considered if time remains within the existing phases (e.g., a cheap icon transition animation within Phase 2), not as a separate future milestone trigger.

- [ ] Animated icon transition on toggle (rotate/crossfade) — only if trivial to add within Phase 2's existing scope, no new dependency
- [ ] `aria-live` confirmation announcement on toggle — only if trivial to add within Phase 2/3, no new dependency

### Future Consideration (v2+)

Explicitly out of scope per PROJECT.md — do not build now, do not scaffold "for later" beyond react-i18next's natural extensibility.

- [ ] Additional languages beyond PT-BR/EN — PROJECT.md: "not requested"
- [ ] Additional themes beyond light/dark — PROJECT.md: "not requested"
- [ ] Locale-prefixed routes / URL-based language state — would violate "no structure changes"
- [ ] `hreflang` SEO tags — only relevant if the site becomes multi-route/multi-language at the URL level, which it isn't

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Theme/color token centralization | MEDIUM (invisible to user, enables everything else) | MEDIUM | P1 |
| Dark/light toggle with system-default + persistence + a11y | HIGH | LOW-MEDIUM | P1 |
| PT-BR/EN language toggle with browser-default + persistence + a11y | HIGH | MEDIUM | P1 |
| Bilingual README | MEDIUM (developer/recruiter-facing, not end-user-facing) | LOW | P1 |
| Icon transition animation | LOW-MEDIUM | LOW | P3 |
| `aria-live` toggle confirmation | LOW | LOW | P3 |
| Three-way theme toggle | LOW (not requested) | MEDIUM | Do not build |
| Auto language detect banner | LOW (not requested, adds friction) | MEDIUM | Do not build |
| Additional languages/themes | N/A (excluded) | HIGH | Do not build |

**Priority key:**
- P1: Must have for launch (= all four PROJECT.md Active requirements)
- P3: Nice to have, only if free within existing phase budget
- Do not build: Anti-features, explicitly excluded by PROJECT.md or by UX-complexity tradeoff

## Competitor Feature Analysis

"Competitors" here means the general convention across modern dev portfolio and marketing sites, not literal competing products.

| Feature | Common Convention A (typical dev portfolio) | Common Convention B (large marketing site / design system, e.g. USWDS) | Our Approach |
|---------|--------------|--------------|-------------|
| Theme toggle | Single icon button (sun/moon), header top-right, binary | Sometimes 3-way (system/light/dark) in settings menus | Binary icon button, defaults to system, matches Convention A — simplest, matches PROJECT.md scope |
| Language switcher | Text abbreviation button/dropdown (e.g. "EN / PT") next to theme toggle | Full language name links in a `<nav aria-label="Language switch">`, often with `aria-current` | Text-based toggle button ("PT" / "EN"), simpler than a full nav+list since there are only 2 languages, but should still carry equivalent ARIA semantics (label + current-state indication) |
| Persistence | localStorage, silent | localStorage or cookies, sometimes with an explicit "Save preference" action | Silent localStorage persistence for both theme and language, no explicit save action — matches PROJECT.md decision |
| README localization | README.md + README.en.md pattern, cross-linked, common in Brazilian/LatAm OSS repos specifically | Rarer at this scale for large corporate sites (usually docs sites with full i18n routing instead) | README.md (PT-BR) + README.en.md (EN), cross-linked — matches PROJECT.md decision and the dominant OSS convention found in research |

## Sources

- [Switch Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) — official spec, HIGH confidence on ARIA state semantics
- [Button Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — official spec, HIGH confidence
- [aria-pressed Attribute - ARIA Reference](https://playground.halfaccessible.com/aria-reference/aria-pressed-attribute) — supporting explainer, MEDIUM confidence
- [The best light/dark mode theme toggle in JavaScript](https://whitep4nth3r.com/blog/best-light-dark-mode-theme-toggle-javascript/) — MEDIUM confidence, cross-checked against multiple sources
- [The UX of dark mode toggles — Dylan Smith](https://dylanatsmith.com/wrote/the-ux-of-dark-mode-toggles) — MEDIUM confidence
- [Dark mode UI design: Best practices and examples - LogRocket Blog](https://blog.logrocket.com/ux-design/dark-mode-ui-design-best-practices-and-examples/) — MEDIUM confidence
- [Dark mode - Core concepts - Tailwind CSS](https://tailwindcss.com/docs/dark-mode) — official docs for the project's actual CSS framework, HIGH confidence
- [Language selector | U.S. Web Design System (USWDS)](https://designsystem.digital.gov/components/language-selector/) — official government design system, HIGH confidence
- [Language selector best practices: 10 UX tips - SimpleLocalize](https://simplelocalize.io/blog/posts/language-selector-best-practices/) — MEDIUM confidence
- [How to create an accessible language picker | CodyHouse](https://codyhouse.co/blog/post/accessible-language-picker) — MEDIUM confidence
- [How do HTML Lang Attributes help with Accessibility? — Recite Me](https://reciteme.com/us/news/how-do-html-lang-attributes-help-with-accessibility/) — MEDIUM confidence
- [Is there a way to have multi-language readme.md file? — GitHub Community Discussion](https://github.com/orgs/community/discussions/31132) — MEDIUM confidence, corroborates no-native-support finding
- [multilanguage-readme-pattern — GitHub](https://github.com/jonatasemidio/multilanguage-readme-pattern) — MEDIUM confidence, example repo of the exact convention recommended
- [How to Add Multiple README Files in a GitHub Repository (French/English)](https://www.codestudy.net/blog/add-multiple-readme-on-github-repo/) — MEDIUM confidence
- Project context: `.planning/PROJECT.md` (authoritative for scope/constraints, not external research)

---
*Feature research for: portfolio site header theme/language toggles + bilingual README*
*Researched: 2026-07-06*
