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

/**
 * Regression coverage for lang-toggle-en-pt-mismatch: the toggle's
 * active/selected state (aria-pressed AND the visual highlight class) must
 * always agree with each other AND with the actually-rendered content
 * language — for both the raw server-rendered HTML and the hydrated client
 * state, regardless of visitor locale.
 *
 * Root cause: usePersistedPreference's `getServerSnapshot` used to be
 * computed by calling the same browser-detection function used for the real
 * client value (e.g. detectBrowserLanguage(), which reads `navigator.language`).
 * That function's SSR guard assumed `navigator` is undefined in Node, but
 * Node 21+ exposes a global `navigator` stub whose `.language` getter
 * resolves to a fixed "en-US" — unrelated to the actual visitor — which
 * defeated the guard and made every server-rendered response mark the EN
 * toggle button active regardless of the real visitor or the (separately,
 * correctly, fixed-"pt") SSR content language. Fixed by giving
 * usePersistedPreference an explicit, purely-constant `ssrDefault` value that
 * never calls into browser/Node globals.
 */
test.describe("language toggle / content sync (regression: lang-toggle-en-pt-mismatch)", () => {
  async function snapshot(page: import("@playwright/test").Page) {
    const header = page.locator("header");
    const switcher = header.getByRole("group", { name: /idioma|language/i }).first();
    const ptBtn = switcher.getByRole("button", { name: /português|portuguese/i });
    const enBtn = switcher.getByRole("button", { name: /english|inglês/i });

    const ptPressed = await ptBtn.getAttribute("aria-pressed");
    const enPressed = await enBtn.getAttribute("aria-pressed");
    const ptClass = (await ptBtn.getAttribute("class")) || "";
    const enClass = (await enBtn.getAttribute("class")) || "";

    // Must match the exact "text-accent-hover" token, not the always-present
    // "hover:text-accent-hover" pseudo-class utility (a plain substring match
    // false-positives on every render since every button includes that hover
    // utility unconditionally).
    const hasActiveToken = (cls: string) => cls.split(/\s+/).includes("text-accent-hover");

    const togglePressed = ptPressed === "true" ? "PT" : enPressed === "true" ? "EN" : "none";
    const activeByClass = hasActiveToken(ptClass) ? "PT" : hasActiveToken(enClass) ? "EN" : "none";

    // The translated desktop nav "Home" link text (Início vs Home). nth(0) is
    // the untranslated logo ("Leandro.dev"), nth(1) is the real nav item.
    const homeText = (await header.locator("a[href='#inicio']").nth(1).innerText()).trim();

    return { togglePressed, activeByClass, homeText };
  }

  test("fresh en-US visitor: toggle and content both agree on English", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("language");
      Object.defineProperty(window.navigator, "language", {
        get: () => "en-US",
        configurable: true,
      });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const state = await snapshot(page);
    expect(state.togglePressed).toBe("EN");
    expect(state.activeByClass).toBe("EN");
    expect(state.homeText).toBe("Home");
  });

  test("fresh pt-BR visitor: toggle and content both agree on Portuguese", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("language");
      Object.defineProperty(window.navigator, "language", {
        get: () => "pt-BR",
        configurable: true,
      });
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const state = await snapshot(page);
    expect(state.togglePressed).toBe("PT");
    expect(state.activeByClass).toBe("PT");
    expect(state.homeText).toBe("Início");
  });

  test("server-rendered HTML marks the toggle consistently with SSR content before any JS runs", async ({
    request,
  }) => {
    const response = await request.get("/");
    const html = await response.text();

    const ptMatch = html.match(/aria-label="Português"[^>]*aria-pressed="(true|false)"/);
    const enMatch = html.match(/aria-label="English"[^>]*aria-pressed="(true|false)"/);

    // SSR always renders the fixed default language ("pt") — see
    // i18n/config.ts (D-02). The toggle's server-rendered aria-pressed must
    // match that, not a value derived from any server-side "browser"
    // detection.
    expect(ptMatch?.[1]).toBe("true");
    expect(enMatch?.[1]).toBe("false");
  });
});
