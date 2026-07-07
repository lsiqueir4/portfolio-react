import { test, expect } from "@playwright/test";

/**
 * Behavioral spec for the PT/EN language toggle (I18N-02/03/04/05, Header slice
 * of I18N-06).
 *
 * No screenshots here — behavioral only, mirroring tests/theme-toggle.spec.ts.
 * Each test controls its own preconditions via page.addInitScript so the
 * value is set BEFORE any page script runs, since persistence/detection
 * behavior is exactly what's under test.
 */

test.describe("language toggle", () => {
  test("switcher presence and accessibility", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");
    const switcher = header.getByRole("group", { name: /idioma|language/i });

    await expect(switcher.first()).toBeVisible();

    const ptLabel = switcher.first().getByRole("button", { name: /português|portuguese/i });
    const enLabel = switcher.first().getByRole("button", { name: /english|inglês/i });

    await expect(ptLabel).toBeVisible();
    await expect(enLabel).toBeVisible();
  });

  test("click switches html lang and header nav string", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("language", "pt");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "pt");

    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Início" }).first()).toBeVisible();

    const switcher = header.getByRole("group", { name: /idioma|language/i }).first();
    const enLabel = switcher.getByRole("button", { name: /english|inglês/i });
    await enLabel.click();

    await expect(html).toHaveAttribute("lang", "en");
    await expect(header.getByRole("link", { name: "Home" }).first()).toBeVisible();
  });

  test("persistence write: clicking updates localStorage", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("language", "pt");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header");
    const switcher = header.getByRole("group", { name: /idioma|language/i }).first();
    const enLabel = switcher.getByRole("button", { name: /english|inglês/i });
    const ptLabel = switcher.getByRole("button", { name: /português|portuguese/i });

    await enLabel.click();
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("language")))
      .toBe("en");

    await ptLabel.click();
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("language")))
      .toBe("pt");
  });

  test("persisted language applies on load", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("language", "en");
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
  });

  test("navigator.language default: en-US resolves to EN", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("language");
      Object.defineProperty(window.navigator, "language", {
        get: () => "en-US",
        configurable: true,
      });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
  });

  test("navigator.language default: pt-BR resolves to PT", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("language");
      Object.defineProperty(window.navigator, "language", {
        get: () => "pt-BR",
        configurable: true,
      });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "pt");
  });

  test("navigator.language default: non-pt/en (fr-FR) resolves to EN (D-05)", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("language");
      Object.defineProperty(window.navigator, "language", {
        get: () => "fr-FR",
        configurable: true,
      });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("lang", "en");
  });
});
