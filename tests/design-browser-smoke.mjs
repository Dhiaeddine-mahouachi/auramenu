import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { chromium,devices } from 'playwright';
import { registry } from '../standard/registry.mjs';

const origin = process.env.AURA_TEST_ORIGIN || 'http://127.0.0.1:4173';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox']});
const screenshots = process.env.DESIGN_SCREENSHOTS === '1';
const errors = [];
async function context(options) {
  const profile = await browser.newContext(options);
  await profile.route('**/*',route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
  return profile;
}
function observe(page) {
  page.on('pageerror',error => errors.push(error.message));
}
try {
  if (screenshots) await mkdir('test-output',{recursive:true});
  const desktop = await context({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const studio = await desktop.newPage();
  observe(studio);
  const requested = [];
  studio.on('request',request => requested.push(new URL(request.url()).pathname));
  await studio.goto(origin + '/studio/');
  const frame = studio.frameLocator('#frame');
  await frame.locator('.sm-classic').waitFor();
  assert.equal(await studio.locator('.tile').count(),15);
  assert.deepEqual(requested.filter(path => path.includes('/standard/templates/') && path.endsWith('.mjs')),['/standard/templates/classic.mjs']);
  assert.ok(requested.every(path => !path.endsWith('/snake.mjs')));
  const first = frame.locator('.sm-card details').first();
  await first.locator('summary').click();
  assert.match(await first.innerText(),/House Smash/);
  assert.match(await first.innerText(),/Sesame/);
  assert.ok(await frame.getByText('Leave an honest review').first().getAttribute('href'));
  await frame.getByRole('button',{name:'Play',exact:true}).click();
  await frame.getByRole('button',{name:'Start',exact:true}).click();
  await frame.getByRole('button',{name:'Restart',exact:true}).press('ArrowDown');
  await frame.locator('canvas').waitFor();
  assert.equal(requested.filter(path => path.endsWith('/snake.mjs')).length,1);
  await frame.getByRole('button',{name:'Close',exact:true}).click();
  await frame.locator('canvas').waitFor({state:'detached'});
  await studio.locator('#design summary').click();
  await studio.locator('[data-toggle=play]').uncheck();
  await frame.locator('.sm-play').waitFor({state:'detached'});
  await studio.locator('[data-toggle=prices]').uncheck();
  await frame.locator('.sm-price').first().waitFor({state:'detached'});
  await studio.locator('#reset').click();
  await frame.locator('.sm-play').waitFor();
  await studio.locator('#design summary').click();
  for (const width of ['320','375','390','430']) {
    await studio.locator('#width').selectOption(width);
    assert.equal(await frame.locator('html').evaluate(() => innerWidth),Number(width));
  }
  await studio.locator('#width').selectOption('390');
  await studio.getByRole('button',{name:'Desktop preview'}).click();
  assert.ok(await frame.locator('html').evaluate(() => innerWidth)>=760);
  await studio.getByRole('button',{name:'Mobile preview'}).click();
  for (const entry of registry) {
    await studio.getByRole('button',{name:'Preview ' + entry.name,exact:true}).click();
    await frame.locator('.sm-' + entry.key).first().waitFor();
    assert.equal(await studio.locator('#preview-name').textContent(),entry.name);
    assert.equal(await studio.locator('.tile[aria-pressed=true]').count(),1);
    if (screenshots) {
      await frame.locator('html').evaluate(() => scrollTo(0,0));
      await frame.locator('img').evaluateAll(images => Promise.race([
        Promise.allSettled(images.filter(image => image.getBoundingClientRect().top < innerHeight).map(image => image.decode())),
        new Promise(resolve => setTimeout(resolve,450)),
      ]));
      await studio.locator('#frame').screenshot({path:'test-output/'+entry.key+'.png',animations:'disabled'});
    }
  }
  const tile = frame.locator('.sm-tile').first();
  await tile.click();
  const product = frame.locator('.sm-product-open').first();
  await product.click();
  await frame.getByRole('button',{name:'Close',exact:true}).click();
  assert.equal(await frame.getByRole('button',{name:'All categories'}).count(),1);
  assert.ok(await product.evaluate(element => element === document.activeElement));
  await frame.getByRole('button',{name:'All categories'}).click();
  assert.ok(await frame.locator('.sm-tile').count()>1);
  await studio.getByRole('button',{name:'Preview Aura Panel'}).click();
  await frame.locator('.sm-panel').waitFor();
  await frame.getByRole('searchbox').fill('Paprika');
  assert.equal(await frame.locator('.sm-card').count(),1);
  await frame.getByRole('searchbox').fill('not on the menu');
  assert.match(await frame.locator('.sm-empty').innerText(),/No dishes match/);
  await studio.locator('#dataset').selectOption('large');
  await frame.getByRole('searchbox').fill('House Smash');
  assert.ok(await frame.locator('.sm-card').count()>10);
  await studio.locator('#language').selectOption('ar');
  await frame.locator('.sm[dir=rtl]').waitFor();
  await studio.getByRole('button',{name:'Preview Aura Grid'}).click();
  await studio.locator('#dataset').selectOption('mixed');
  await studio.locator('#language').selectOption('en');
  await frame.getByRole('heading',{name:'Casa Acero'}).waitFor();
  await frame.locator('.sm-card-gallery').nth(2).scrollIntoViewIfNeeded();
  await frame.locator('.sm-photo-error').first().waitFor();

  const mobile = await context({...devices['Pixel 7'],viewport:{width:320,height:780},reducedMotion:'reduce'});
  const production = await mobile.newPage();
  observe(production);
  await production.route(url => url.pathname === '/api/auramenu/sites/design-fixture',route => route.fulfill({json:{menu:{
    templateId:'std-05',businessName:'Public QR menu',menuLanguage:'en',currency:'TRY',whatsapp:'+905551112233',
    categories:[{name:'Entrées',items:[{name:'Grilled dish',price:'50',featured:true,description:'Prepared to order.'}]}],
    restaurant:{links:{review:'javascript:alert(1)',instagram:'https://instagram.com/'}}
  }}}));
  await production.goto(origin + '/menu.html?slug=design-fixture');
  await production.getByRole('heading',{name:'Public QR menu'}).waitFor();
  assert.equal(await production.locator('iframe').count(),0);
  assert.equal(await production.locator('a[href^="javascript:"]').count(),0);
  assert.ok(await production.getByRole('link',{name:'Order on WhatsApp'}).getAttribute('href'));
  await production.route(url => url.pathname === '/api/auramenu/sites/legacy-fixture',route => route.fulfill({json:{menu:{
    templateId:'modern',businessName:'Legacy QR menu',menuLanguage:'en',currency:'TRY',
    categories:[{name:'Entrées',items:[{name:'Classic dish',price:'50'}]}],
  }}}));
  await production.goto(origin + '/404.html?slug=legacy-fixture');
  await production.frameLocator('iframe.public-template-frame').getByText('Legacy QR menu',{exact:true}).first().waitFor();


  await production.route(url => url.pathname === '/api/auramenu/sites/unknown-fixture',route => route.fulfill({json:{menu:{
    templateId:'constructor',businessName:'Unknown design fallback',menuLanguage:'en',currency:'TRY',
    categories:[{name:'Entrées',items:[{name:'Legacy fallback dish',price:'50'}]}],
  }}}));
  await production.goto(origin + '/menu.html?slug=unknown-fixture');
  await production.frameLocator('iframe[src^="/c.html"]').getByText('Unknown design fallback',{exact:true}).first().waitFor();

  const ownerPage = await desktop.newPage();
  observe(ownerPage);
  const designIds = registry.map(entry => entry.id);
  const ownerToken = 'a'.repeat(64);
  await ownerPage.addInitScript(token => localStorage.setItem('auraMenuToken:a1',token),ownerToken);
  await ownerPage.route('**/api/auramenu/designs',route => route.fulfill({json:{standard:designIds}}));
  await ownerPage.route('**/api/aurapops/account/session',route => route.fulfill({json:{user:{emailVerified:true}}}));
  const draftMenu = {id:'a1',templateId:'std-01',slug:'owner-fixture',businessName:'Owner fixture',
    currency:'TRY',menuLanguage:'en',editAccess:{active:true},
    categories:[{name:'Main',items:[{name:'Existing dish',price:'180',description:'A test dish',imageUrl:''}]}]};
  let savedMenu;
  await ownerPage.route('**/api/auramenu/dashboard/a1',route => {
    if (route.request().headers()['x-aura-menu-token'] !== ownerToken) return route.fulfill({status:401,json:{error:'Missing ownership token'}});
    if (route.request().method() === 'PATCH') savedMenu = route.request().postDataJSON();
    return route.fulfill({json:{menu:savedMenu || draftMenu}});
  });
  await ownerPage.goto(origin + '/builder.html?lang=en&template=std-02');
  const builderFrame = ownerPage.frameLocator('#templatePreview');
  await builderFrame.locator('.sm-grid').waitFor();
  await ownerPage.locator('#businessName').fill('Builder fixture');
  await builderFrame.getByRole('heading',{name:'Builder fixture'}).waitFor();
  await ownerPage.locator('#standardDesign summary').click();
  await ownerPage.getByLabel('Enable AuraPlay').uncheck();
  await builderFrame.locator('.sm-play').waitFor({state:'detached'});
  await ownerPage.goto(origin + '/dashboard.html?id=a1');
  await ownerPage.locator('#standardDesign summary').waitFor();
  await ownerPage.locator('#templateId').selectOption('std-08');
  await ownerPage.locator('#standardDesign summary').click();
  await ownerPage.getByLabel('Google review link').fill('https://www.google.com/maps/');
  await ownerPage.locator('#saveMenu').click();
  await ownerPage.locator('#saveMessage.success').waitFor();
  assert.equal(savedMenu.templateId,'std-08');
  assert.equal(savedMenu.restaurant.links.review,'https://www.google.com/maps/');
  assert.equal(savedMenu.categories[0].items[0].price,'180');

  const matrix = await mobile.newPage();
  observe(matrix);
  await matrix.goto(origin + '/standard/frame.html');
  const count = await matrix.evaluate(async () => {
    const {prepareStandard} = await import('/standard/entry.mjs');
    const {registry} = await import('/standard/registry.mjs');
    const {datasets,fixture} = await import('/studio/fixtures.mjs');
    let cases = 0;
    for (const entry of registry) {
      const ready = await prepareStandard(entry.id);
      for (const [id] of datasets) {
        for (const language of ['en','tr','ar']) {
          const root = document.getElementById('preview');
          const live = ready.mount(root,fixture(id),{language});
          if (!root.querySelector('h1')?.textContent || !root.querySelector('.sm-card')) throw Error('Empty menu ' + entry.id + '/' + id);
          if (root.scrollWidth > document.documentElement.clientWidth + 1) throw Error('Horizontal overflow ' + entry.id + '/' + id + '/' + language);
          live.dispose();
          cases++;
        }
      }
    }
    return cases;
  });
  assert.equal(count,450);
  assert.deepEqual(errors,[]);
  if (screenshots) {
    await studio.getByRole('button',{name:'Preview Aura Classic'}).click();
    await studio.locator('#dataset').selectOption('');
    await frame.locator('.sm-classic').waitFor();
    await studio.screenshot({path:'test-output/design-studio.png',animations:'disabled'});
    await writeFile('test-output/design-matrix.txt',String(count)+' Chromium matrix cases passed.\n');
  }
  console.log(count+' Chromium combinations passed plus studio interaction and public-route tests.');
} finally {
  await browser.close();
}
