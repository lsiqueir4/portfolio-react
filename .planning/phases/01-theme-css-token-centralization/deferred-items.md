# Deferred Items — Phase 01

Pre-existing issues discovered during execution that are out of scope for the current task
(per executor scope-boundary rule) and therefore not auto-fixed.

## From Plan 04

- **Missing `key` prop in `Projects.map()`** — `app/features/Projects/index.tsx`, the
  `projects.map((project) => (<ProjectContainer ... />))` call renders `ProjectContainer`
  without a `key` prop, producing a React console warning ("Each child in a list should
  have a unique 'key' prop") during dev/test runs. Confirmed pre-existing (present before
  Plan 04's token/Section migration touched this file — introduced in an earlier commit,
  unrelated to color-token or Section work). Out of scope for Plan 04's task list
  (color-token migration + Section de-duplication only). Playwright visual-regression
  suite passes regardless since this is a console warning, not a rendering diff.

## From Plan 05

- **`npm run lint` fails with `no-empty-pattern` error** — `app/routes/home.tsx:8`,
  `export function meta({}: Route.MetaArgs)` uses an empty object destructuring pattern,
  tripping ESLint's `no-empty-pattern` rule. Confirmed pre-existing: last touched at
  commit `e21c950` ("fix format with eslint"), which predates every Phase 01 plan commit
  (`01-02` through `01-04`). Not caused by, or in scope of, any theme-token migration task.
  `app/routes/home.tsx` and `app/root.tsx` (source of two related `react-refresh/only-export-components`
  warnings) were never touched by Plans 01-04 of this phase. Per the executor's scope-boundary
  rule, pre-existing lint failures in unrelated files are logged here, not auto-fixed.
  Plan 05's own gate criteria list `npm run lint` as a required pass — this is the one
  automated check in Task 1 that did NOT go green, purely due to this pre-existing,
  out-of-phase-scope issue. All other gates (grep-clean, dark-variant/build, typecheck,
  full Playwright visual suite) passed cleanly.
