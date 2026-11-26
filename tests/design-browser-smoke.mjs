import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { chromium,devices } from 'playwright';
import { registry } from '../standard/registry.mjs';

const origin = process.env.AURA_TEST_ORIGIN || 'http://127.0.0.1:4173';
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
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
  assert.equal(await studio.locator('.tile').count(),30);
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
  for (const width of ['320','360','375','390','430','768']) {
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
  await studio.getByRole('button',{name:'Preview Aura Tiles',exact:true}).click();
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
  assert.equal(await frame.locator('.sm-sections>.sm-section').count(),1);
  await frame.getByRole('searchbox').fill('Paprika');
  assert.equal(await frame.locator('.sm-card').count(),1);
  assert.match(await frame.locator('.sm-card').innerText(),/Paprika Fries/);
  await frame.getByRole('button',{name:'Drinks',exact:true}).click();
  assert.equal(await frame.getByRole('searchbox').inputValue(),'');
  assert.equal(await frame.locator('.sm-sections h2').innerText(),'Drinks');
  const modeButton = frame.getByRole('button',{name:'Dark mode',exact:true});
  await modeButton.click();
  await frame.locator('.sm-panel[data-appearance=dark]').waitFor();
  assert.equal(await frame.locator('.sm-sections h2').innerText(),'Drinks');
  await modeButton.click();
  await studio.waitForURL(/appearance=light/);
  assert.equal(await frame.locator('.sm-panel').evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(244, 248, 246)');
  assert.equal(await frame.locator('.sm-appearance').count(),1);
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

  await studio.getByRole('button',{name:'3D',exact:true}).click();
  assert.equal(await studio.locator('.tile:visible').count(),5);
  await studio.getByRole('button',{name:'Preview Aura Layers',exact:true}).click();
  await studio.locator('#dataset').selectOption('burger');
  await frame.locator('.sm-layers').waitFor();
  await frame.getByRole('button',{name:'The House Smash',exact:true}).first().click();
  await frame.getByRole('button',{name:'Explore ingredient layers'}).click();
  assert.equal(await frame.locator('.pa-layers-diagram li').count(),3);
  await frame.getByRole('button',{name:'Close',exact:true}).click();

  await studio.getByRole('button',{name:'Preview Aura Reality',exact:true}).click();
  await frame.locator('.sm-reality').waitFor();
  await frame.getByRole('button',{name:'The House Smash',exact:true}).first().click();
  assert.ok(requested.every(path=>!path.endsWith('/viewer.mjs') && !path.endsWith('/smash-model.mjs')));
  await frame.getByRole('button',{name:'View in 3D'}).click();
  await frame.getByRole('img',{name:'Interactive 3D model'}).waitFor();
  if (screenshots) await frame.locator('.pa-model-stage').screenshot({path:'test-output/reality-model.png'});
  await frame.getByRole('button',{name:'Rotate left'}).click();
  await frame.getByRole('button',{name:'Zoom in'}).click();
  await frame.getByRole('button',{name:'Reset view'}).click();
  await frame.getByRole('button',{name:'Close',exact:true}).click();
  await frame.locator('canvas').waitFor({state:'detached'});
  assert.equal(requested.filter(path=>path.endsWith('/viewer.mjs')).length,1);
  const noWebGL = await desktop.newPage();
  observe(noWebGL);
  await noWebGL.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(kind,...args) {
      return kind === 'webgl' ? null : original.call(this,kind,...args);
    };
  });
  await noWebGL.goto(origin + '/studio/?template=pre-30&dataset=burger');
  const fallback = noWebGL.frameLocator('#frame');
  await fallback.getByRole('button',{name:'The House Smash',exact:true}).first().click();
  await fallback.getByRole('button',{name:'View in 3D'}).click();
  await fallback.getByText(/3D view is unavailable/).waitFor();
  await fallback.locator('.pa-product img').first().waitFor();
  await noWebGL.close();
  await studio.locator('#assets').selectOption('missing');
  await frame.locator('.sm-reality .sm-card img').first().waitFor({state:'detached'});
  await studio.locator('#assets').selectOption('slow');
  await frame.locator('.sm-reality[data-motion=off]').waitFor();
  await studio.getByRole('button',{name:'Compare designs'}).click();
  await studio.frameLocator('#compare-device iframe').locator('.pa').waitFor();
  assert.equal(await studio.locator('iframe').count(),2);
  await studio.frameLocator('#compare-device iframe').getByRole('button',{name:'Dark mode',exact:true}).click();
  await frame.locator('.sm-reality[data-appearance=dark]').waitFor();
  await frame.getByRole('button',{name:'Dark mode',exact:true}).click();
  await studio.getByRole('button',{name:'Compare designs'}).click();
  assert.equal(await studio.locator('iframe').count(),1);
  await studio.getByRole('button',{name:'All designs',exact:true}).click();
  await studio.locator('#assets').selectOption('auto');

  const mobile = await context({...devices['Pixel 7'],viewport:{width:320,height:780},reducedMotion:'reduce'});
  const production = await mobile.newPage();
  observe(production);
  await production.route('**/api/auramenu/designs',route=>route.fulfill({json:{
    standard:registry.filter(entry=>entry.tier === 'standard').map(entry=>entry.id),
    premium:registry.filter(entry=>entry.tier === 'premium').map(entry=>entry.id),
  }}));
  await production.goto(origin + '/index.html');
  await production.getByRole('link',{name:'Browse all 30 designs'}).click();
  await production.getByRole('button',{name:'Preview Aura Reality',exact:true}).click();
  assert.equal(await production.getByRole('link',{name:'Manage my menus'}).getAttribute('href'),'/account');
  await production.getByRole('button',{name:'Preview Aura Grid',exact:true}).click();
  await production.getByRole('link',{name:'Use this design'}).click();
  await production.frameLocator('#templatePreview').locator('.sm-grid').waitFor();
  assert.equal(await production.locator('#templateId').inputValue(),'std-02');
  assert.equal(await production.locator('#templateId option[value^=std-]').count(),15);
  assert.equal(await production.locator('#templateId option[value^=pre-]').count(),0);
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
  await production.getByRole('button',{name:'Dark mode',exact:true}).click();
  await production.reload();
  await production.locator('.sm[data-appearance=dark]').waitFor();
  await production.getByRole('combobox',{name:'Language'}).selectOption('ar');
  await production.getByRole('button',{name:'الوضع الداكن',exact:true}).waitFor();
  assert.equal(await production.getByRole('button',{name:'الوضع الداكن',exact:true}).getAttribute('aria-pressed'),'true');
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
  const designIds = registry.filter(entry=>entry.tier === 'standard').map(entry => entry.id);
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
    const {prepareTemplate} = await import('/standard/entry.mjs');
    const {registry} = await import('/standard/registry.mjs');
    const {datasets,fixture} = await import('/studio/fixtures.mjs');
    let cases = 0;
    for (const entry of registry) {
      const ready = await prepareTemplate(entry.id);
      for (const [id] of datasets) {
        for (const language of ['en','tr','ar']) {
          const root = document.getElementById('preview');
          const live = ready.mount(root,fixture(id),{language});
          if (!root.querySelector('h1')?.textContent || !root.querySelector('.sm-card')) throw Error('Empty menu ' + entry.id + '/' + id);
          if (root.scrollWidth > document.documentElement.clientWidth + 1) throw Error('Horizontal overflow ' + entry.id + '/' + id + '/' + language);
          if (id === 'burger') {
            const appearance = root.querySelector('button.sm-appearance');
            if (root.querySelectorAll('.sm-appearance').length !== 1) throw Error('Expected one toggle ' + entry.id);
            const colors = [];
            for (const mode of ['light','dark']) {
              if (root.firstElementChild.dataset.appearance !== mode) appearance.click();
              colors.push(getComputedStyle(root.firstElementChild).backgroundColor);
              if (root.firstElementChild.dataset.appearance !== mode ||
                  appearance.getAttribute('aria-pressed') !== String(mode === 'dark') ||
                  root.scrollWidth > document.documentElement.clientWidth + 1) {
                throw Error('Invalid ' + mode + ' appearance ' + entry.id + '/' + language);
              }
            }
            if (colors[0] === colors[1] || colors[0] === 'rgb(255, 255, 255)') {
              throw Error('Appearance lacks separate tinted palettes ' + entry.id);
            }
            root.querySelector('.sm-tile')?.click();
            const images = [...root.querySelectorAll('.sm-card>.sm-media')];
            if (!images.length || images.some(image=> {
              const {width,height} = image.getBoundingClientRect();
              return width<100 || height<90;
            })) throw Error('Product photo too small ' + entry.id + '/' + language);
          }
          const browse = root.querySelector('.sm-browse');
          if (browse) {
            const content = browse.querySelector('.sm-sections');
            if (content.querySelectorAll('.sm-section').length !== 1) throw Error('Expected one initial category ' + entry.id + '/' + id + '/' + language);
            const headings = [...browse.querySelectorAll('.sm-nav-button')];
            for (const heading of headings.slice(1,2)) {
              const previousCategory = content.firstElementChild.id;
              const before = scrollY;
              heading.click();
              if (content.children.length !== 1 || content.firstElementChild.id === previousCategory || heading.getAttribute('aria-current') !== 'true') {
                throw Error('Failed to switch category ' + entry.id + '/' + id + '/' + language);
              }
              if (scrollY !== before) throw Error('Category click jumped the page ' + entry.id + '/' + id + '/' + language);
            }
          }
          live.dispose();
          cases++;
        }
      }
    }
    return cases;
  });
  assert.equal(count,900);
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
