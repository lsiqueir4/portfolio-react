import { test, expect } from "@playwright/test";

/**
 * Behavioral spec for the dark/light theme toggle (DARK-01/02/03).
 *
 * No screenshots here — tests/visual.spec.ts covers pixel-level regression.
 * Each test controls localStorage explicitly (via page.addInitScript so the
 * value is set BEFORE any page script runs) rather than relying on a shared
 * beforeEach default, since persistence/detection behavior is exactly what's
 * under test.
 */

test.describe("theme toggle", () => {
  test("toggle presence and accessibility", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");
    const toggle = header.getByRole("button", { name: /switch to (light|dark) theme/i });

    await expect(toggle.first()).toBeVisible();
    await expect(toggle.first()).toHaveAttribute("aria-pressed", /true|false/);
  });

  test("click toggles the dark class on <html> and updates aria-pressed", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    const header = page.locator("header");
    const toggle = header.getByRole("button", { name: /switch to (light|dark) theme/i }).first();

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();

    await expect(html).toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();

    await expect(html).not.toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  test("persistence write: clicking updates localStorage", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");
    const toggle = header.getByRole("button", { name: /switch to (light|dark) theme/i }).first();

    await toggle.click();
    await expect.poll(() => page.evaluate(() => window.localStorage.getItem("theme"))).toBe("dark");

    await toggle.click();
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("theme")))
      .toBe("light");
  });

  test("persisted dark theme applies before first paint (no flash)", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("persisted light theme overrides an OS dark preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "light");
    });
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
  });
});
