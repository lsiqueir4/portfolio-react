import { test, expect } from "@playwright/test";

/**
 * Pre-refactor visual-regression baselines.
 *
 * These screenshots capture the CURRENT (single dark-theme) UI before any
 * token/component refactor touches source. Every downstream migration plan
 * (Phase 1 plans 03/04, and the final Phase 1 gate plan 05) diffs against
 * these baselines to prove THEME-04 (zero visual regression).
 *
 * Generic by design (D-06): this file only adds screenshot assertions; the
 * harness itself (playwright.config.ts) is reusable for Phase 2 (dark
 * toggle) and Phase 3 (language toggle) behavioral specs without change.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
});

test.describe("pre-refactor visual baselines", () => {
  test("full page", async ({ page }) => {
    await expect(page).toHaveScreenshot("home-full.png", { fullPage: true });
  });

  test("header landmark", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot("header.png");
  });

  test("hero section (#inicio)", async ({ page }) => {
    const hero = page.locator("#inicio");
    await hero.scrollIntoViewIfNeeded();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveScreenshot("hero.png");
  });

  test("projects section (#projetos)", async ({ page }) => {
    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();
    await expect(projects).toBeVisible();
    await expect(projects).toHaveScreenshot("projects.png");
  });

  test("about me section (#aboutme)", async ({ page }) => {
    const aboutMe = page.locator("#aboutme");
    await aboutMe.scrollIntoViewIfNeeded();
    await expect(aboutMe).toBeVisible();
    await expect(aboutMe).toHaveScreenshot("aboutme.png");
  });

  test("contacts section (#contacts)", async ({ page }) => {
    const contacts = page.locator("#contacts");
    await contacts.scrollIntoViewIfNeeded();
    await expect(contacts).toBeVisible();
    await expect(contacts).toHaveScreenshot("contacts.png");
  });

  test("footer landmark", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer).toHaveScreenshot("footer.png");
  });
});
