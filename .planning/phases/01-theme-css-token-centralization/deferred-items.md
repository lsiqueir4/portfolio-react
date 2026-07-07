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
