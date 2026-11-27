const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const { source: axe } = require("axe-core");
const origin = process.env.AURA_TEST_ORIGIN || "http://127.0.0.1:4173";

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await page.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await page.goto(origin + "/gallery.html");
    const designs = await page.evaluate(() => window.AURAMENU_DESIGNS.designs.map(design => design.id));
    assert.equal(designs.length, 30);
    const issues = {};
    for (const design of designs) {
      for (const theme of ["light", "dark"]) {
        const query = new URLSearchParams({ design, theme, lang: "en", gallery: "1" });
        await page.goto(origin + "/menu-v2.html?" + query, { waitUntil: "domcontentloaded" });
        await page.locator(".am-item").first().waitFor();
        await page.addScriptTag({ content: axe });
        const rules = await page.evaluate(async () => {
          const result = await window.axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] });
          return result.violations.map(rule => [rule.id, rule.nodes.map(node => node.target)]);
        });
        if (rules.length) issues[design + "/" + theme] = rules;
      }
    }
    assert.deepEqual(issues, {});
    console.log("60/60 accessibility cases passed");
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
