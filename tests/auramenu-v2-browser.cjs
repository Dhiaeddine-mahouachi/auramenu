// AuraMenu 2.0 browser acceptance: 30 designs × core features, public gallery, homepage.
// Run: serve this folder on 4187, then `node tests/auramenu-v2-browser.cjs`. Optional CHROMIUM_PATH.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const base = process.env.BASE_URL || "http://127.0.0.1:4187";
const ids = "sofra simit kahve pazar smash bahce medina lokanta tatli tasfirin bistro taze meyhane kantin aura noir kor lumiere orbit neon saray katman riviera atelier karnaval mermer velvet bogazici kuro ivory".split(" ");
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 }, reducedMotion: "reduce" });
    const errors = []; page.on("pageerror", (e) => errors.push(e.message));
    await page.route("**/*", (r) => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
    for (const id of ids) {
      for (const lang of ["tr", "en", "ar"]) {
        await page.goto(`${base}/menu-v2.html?design=${id}&gallery=1&lang=${lang}`, { waitUntil: "domcontentloaded" });
        await page.locator(".am-item").first().waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.dir), lang === "ar" ? "rtl" : "ltr");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${id}/${lang} horizontal overflow`);
      }
      assert.ok((await page.locator(".am-cat").count()) >= 3, `${id} categories`);
      assert.ok(await page.locator('.am-q[href*="google.com/maps/dir"]').count(), `${id} directions`);
      assert.ok(await page.locator('.am-q[href*="google.com/maps/search"], .am-q[href*="writereview"]').count(), `${id} review`);
      assert.ok(await page.locator(".am-soc").count() >= 3, `${id} socials`);
      assert.ok(await page.locator(".am-hours").count(), `${id} hours`);
      assert.ok(await page.locator(".am-avail.is-out, .am-avail.is-low").count(), `${id} availability`);
      await page.locator('[data-act="mode"]').click();
      await page.locator("[data-open]").first().click();
      await page.locator(".am-allergens").waitFor();
      await page.locator("[data-addq]").click();
      await page.locator(".am-cartbar.is-on").waitFor();
      await page.locator("[data-currency]").selectOption("USD");
      assert.match(await page.locator(".am-cart-total").innerText(), /\$/);
      await page.locator('[data-act="search"]').click();
      await page.locator(".am-searchbox input").fill("zzzz-none");
      await page.locator(".am-empty").waitFor();
      await page.evaluate(() => localStorage.clear());
      console.log("PASS design " + id);
    }
    await page.goto(`${base}/menu-v2.html?design=sofra&gallery=1`, { waitUntil: "domcontentloaded" });
    await page.locator('[data-act="game"]').click();
    await page.locator(".am-game canvas").waitFor();
    console.log("PASS snake game lazy-loads");
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto(`${base}/gallery.html?lang=en`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#grid .am-design").count(), 30);
    await page.locator('[data-f="premium"]').click(); assert.equal(await page.locator("#grid .am-design").count(), 15);
    await page.locator('[data-f="standard"]').click(); assert.equal(await page.locator("#grid .am-design").count(), 15);
    await page.locator('[data-f="all"]').click();
    await page.locator('#grid [data-open="noir"]').first().click();
    assert.equal(await page.locator("#preview").evaluate((d) => d.open), true);
    assert.match(await page.locator("#pv-frame").getAttribute("src"), /^menu-v2\.html\?design=noir/);
    assert.equal(await page.locator("#pv-choices").isVisible(), false);
    await page.locator("#pv-want").click();
    assert.match(await page.locator("#pv-self").getAttribute("href"), /^builder\.html\?template=pre-16/);
    assert.ok(page.url().includes("gallery.html"), "no redirect to Studio");
    console.log("PASS gallery: 30 designs, filters, preview, explicit selection");
    await page.setViewportSize({ width: 390, height: 844 });
    for (const l of ["tr", "en", "ar"]) { await page.goto(`${base}/index.html?lang=${l}`, { waitUntil: "domcontentloaded" }); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); }
    console.log("PASS homepage mobile width TR/EN/AR");
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch((e) => { console.error(e); process.exitCode = 1; });
