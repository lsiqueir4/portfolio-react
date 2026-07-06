import { defineConfig, devices } from "@playwright/test";

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Generic Playwright config (D-06): kept deterministic and behavior-agnostic
 * so future Phase 2 (dark toggle) and Phase 3 (language toggle) specs can be
 * dropped into `tests/` without reconfiguring this file.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  expect: {
    toHaveScreenshot: {
      // Tolerance is deliberately calibrated to absorb the known
      // sub-perceptual shade normalizations introduced by the locked
      // 7-token palette (see 01-02-PLAN token-mapping decision) — it is
      // NOT a blanket "ignore diffs" setting. Real regressions (missed
      // classes, unstyled elements, layout shifts, wrong hue) still fail.
      maxDiffPixelRatio: 0.02,
      threshold: 0.2,
      animations: "disabled",
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
