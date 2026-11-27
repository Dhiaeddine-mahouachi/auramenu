const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.AURA_TEST_ORIGIN || "http://127.0.0.1:4173";
const ids = 'sofra simit kahve pazar smash bahce medina lokanta tatli tasfirin bistro taze meyhane kantin aura noir kor lumiere orbit neon saray katman riviera atelier karnaval mermer velvet bogazici kuro ivory'.split(' ');
const sizes = [[390, 844], [768, 1024], [1440, 900]];
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  const errors = [], bad = [];
  try {
    for (const [width, height] of sizes) {
      const context = await browser.newContext({ viewport: {width,height}, reducedMotion: 'reduce' });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(origin)) bad.push(response.status() + ' ' + response.url()); });
      await page.route('**/*', r => r.request().url().startsWith(origin) ? r.continue() : r.abort());
      for (const id of ids) {
        for (const lang of ['tr','en','ar','fr']) {
          for (const theme of ['light','dark']) {
            const key = [width,id,lang,theme].join('/');
            const response = await page.goto(origin + '/menu-v2.html?' + new URLSearchParams({design:id,gallery:'1',lang,theme}), {waitUntil:'domcontentloaded'});
            assert.equal(response.status(),200,key);
            await page.locator('.am-item').first().waitFor();
            const result = await page.evaluate(() => [
              document.documentElement.lang,
              document.documentElement.dir,
              document.querySelector('[data-act="mode"]').getAttribute('aria-pressed'),
              document.documentElement.scrollWidth <= innerWidth + 1,
              document.querySelectorAll('.am-cat').length,
            ]);
            assert.deepEqual(result.slice(0,4),[lang,lang==='ar'?'rtl':'ltr',String(theme==='dark'),true],key);
            assert.ok(result[4] >= 3,key);
          }
        }
      }
      console.log(width + 'px 240/240');
      await context.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual([...new Set(bad)], []);
    console.log('720/720 render and layout checks');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e); process.exitCode=1});
