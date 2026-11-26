import assert from 'node:assert/strict';
import test from 'node:test';
import { getTemplate,registry } from '../standard/registry.mjs';
import { imageUrl,money,normalize,theme,contrast,webUrl } from '../standard/data.mjs';
import { fixture } from '../studio/fixtures.mjs';

test('all thirty records resolve distinct production modules',async () => {
  assert.equal(registry.length,30);
  assert.equal(getTemplate('std-16'),undefined);
  const definitions = await Promise.all(registry.map(async entry => (await entry.load()).default));
  assert.equal(new Set(registry.map(entry => entry.stylesheet)).size,30);
  assert.ok(registry.every((entry,index) => entry.tier === (index<15 ? 'standard' : 'premium') && definitions[index].key === entry.key));
});
test('normalizes legacy amounts, currency overrides, and RTL data without guessing missing prices',() => {
  assert.equal(money('', 'TRY','en'),'');
  assert.equal(money('ask', 'TRY','en'),'ask');
  assert.equal(money('۱۲٫۵۰','USD','en'),money(12.5,'USD','en'));
  assert.equal(money('١٢,٥٠','TRY','tr'),money(12.5,'TRY','tr'));
  const menu = normalize(fixture('arabic'),'ar');
  assert.equal(menu.dir,'rtl');
  assert.equal(menu.name,'مطبخ زيتونة');
  assert.equal(menu.sections.at(-1).parent,'لفائف ومشروبات');
  assert.equal(normalize(fixture('large'),'en').sections.flatMap(value => value.items).length,320);
});
test('validates assets and ensures readable custom text',async () => {
  assert.equal(webUrl('javascript:alert(1)'), '');
  assert.equal(webUrl('https://guest:pw@example.com'), '');
  assert.equal(webUrl('//example.com/image.jpg','https://auramenu.space'), '');
  assert.equal(webUrl('/menu.webp','https://auramenu.space'),'https://auramenu.space/menu.webp');
  assert.equal(imageUrl('data:image/svg+xml;base64,AAAA'),'');
  const {default:classic} = await registry[0].load();
  const tokens = theme(classic.defaults,{background:'#ffffff',text:'#ffffff',radius:999,heading:'injected',play:false});
  assert.ok(contrast(tokens.background,tokens.text)>=4.5);
  assert.equal(tokens.adjusted,true);
  assert.equal(tokens.radius,32);
  assert.equal(tokens.heading,classic.defaults.heading);
  assert.equal(tokens.play,false);
});
