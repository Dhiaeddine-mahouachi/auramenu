import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { registry } from '../standard/registry.mjs';

const origin=process.env.AURA_TEST_ORIGIN || 'http://127.0.0.1:4173';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox']});
try {
  await mkdir('test-output/screens',{recursive:true});
  const page=await browser.newPage({viewport:{width:390,height:780},reducedMotion:'reduce'});
  await page.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
  await page.goto(origin+'/standard/frame.html');
  await page.evaluate(async ()=>{
    const {prepareTemplate}=await import('/standard/entry.mjs');
    const {fixture}=await import('/studio/fixtures.mjs');
    const root=document.getElementById('preview');
    let rendered;
    window.captureMenu=async (id,dataset,advanced)=>{
      rendered?.dispose();
      const {mount}=await prepareTemplate(id);
      rendered=mount(root,fixture(dataset,{advanced}),{preview:true,language:'en'});
      scrollTo(0,0);
      await document.fonts.ready;
      await Promise.allSettled([...root.querySelectorAll('img')].filter(image=>image.getBoundingClientRect().top<innerHeight).map(image=>image.decode()));
    };
  });
  for (const {id,dataset,asset,key} of registry) {
    await page.evaluate(({id,dataset,asset})=>window.captureMenu(id,dataset,Boolean(asset)),{id,dataset,asset});
    const path='test-output/screens/'+key;
    await page.screenshot({path:path+'-opening.png'});
    const product=page.locator('.sm-card .sm-product-open,.sm-card .sm-summary').first();
    if (await page.locator('.sm-tile').count()) await page.locator('.sm-tile').first().click();
    await product.click();
    await page.screenshot({path:path+'-details.png'});
  }
  console.log('Captured opening and product details for all 30 designs.');
} finally {
  await browser.close();
}
