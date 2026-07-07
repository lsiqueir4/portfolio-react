import { test, expect } from "@playwright/test";

/**
 * Light-mode visual-regression baselines.
 *
 * Mirrors tests/visual.spec.ts (which pins the DARK theme reference) but
 * forces the LIGHT theme deterministically via localStorage so the result
 * does not depend on the runner's OS/emulated `prefers-color-scheme`. This
 * gives the light theme its own regression net (DARK-04 accent parity +
 * general no-content-drift), independent of the dark baseline.
 *
 * Screenshot names are suffixed with `-light` so they never collide with
 * the dark baselines already stored in tests/visual.spec.ts-snapshots/.
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "light");
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
});

test.describe("light-mode visual baselines", () => {
  test("full page", async ({ page }) => {
    await expect(page).toHaveScreenshot("home-full-light.png", { fullPage: true });
  });

  test("header landmark", async ({ page }) => {
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header).toHaveScreenshot("header-light.png");
  });

  test("hero section (#inicio)", async ({ page }) => {
    const hero = page.locator("#inicio");
    await hero.scrollIntoViewIfNeeded();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveScreenshot("hero-light.png");
  });

  test("projects section (#projetos)", async ({ page }) => {
    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();
    await expect(projects).toBeVisible();
    await expect(projects).toHaveScreenshot("projects-light.png");
  });

  test("about me section (#aboutme)", async ({ page }) => {
    const aboutMe = page.locator("#aboutme");
    await aboutMe.scrollIntoViewIfNeeded();
    await expect(aboutMe).toBeVisible();
    await expect(aboutMe).toHaveScreenshot("aboutme-light.png");
  });

  test("contacts section (#contacts)", async ({ page }) => {
    const contacts = page.locator("#contacts");
    await contacts.scrollIntoViewIfNeeded();
    await expect(contacts).toBeVisible();
    await expect(contacts).toHaveScreenshot("contacts-light.png");
  });

  test("footer landmark", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer).toHaveScreenshot("footer-light.png");
  });
});
