import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const context = { URL };
for (const file of ['voice-fill-core.js', 'menu-import.js', 'menu-assistant-core.js']) runInNewContext(readFileSync(new URL('../' + file, import.meta.url), 'utf8'), context);
const core = context.AuraMenuAssistantCore;
const empty = () => ({ fields: { businessName: '', currency: 'TRY', menuLanguage: 'en' }, categories: [] });
const state = () => core.propose('Restaurant: Istanbul Burger\nCategory: Burgers\nCheeseburger | 250\nCategory: Drinks\nAyran | 60', empty(), 'append');
test('extracts restaurant and explicit products without invented ingredients', () => {
 const out = core.propose('My restaurant is called Istanbul Burger. A cheeseburger costs 250 lira.', empty(), 'append');
 assert.equal(out.fields.businessName, 'Istanbul Burger');
 assert.equal(out.categories[0].items[0].name, 'cheeseburger');
 assert.equal(out.categories[0].items[0].price, '250');
 assert.equal(out.categories[0].items[0].description, '');
});
test('handles structured multilingual facts, retaining unresolved facts visibly', () => {
 const out = core.propose('اسم المطعم: مطعم تونس\nالعملة: TND\nقسم: مشروبات\nقهوة السعر ٣٫٥\nشاي السعر ٣\nWe have ten burgers', empty(), 'append');
 assert.equal(out.fields.businessName, 'مطعم تونس');assert.equal(out.fields.currency,'TND');
 assert.equal(out.categories[0].items[0].name,'قهوة');assert.equal(out.categories[0].items[0].price,'3.5');
 assert.equal(out.unresolved.length,1);assert.equal(out.categories[0].items.length,2);
});
test('CSV handles quoted commas, escaped quotes, CRLF and embedded newline', () => {
 const out=core.csv('category,name,price,description\r\nFood,"Burger, large",250,"Cheese, tomato"\r\nFood,"Chef ""Special""",300,"Line one\nLine two"');
 assert.equal(out.categories[0].items[0].name,'Burger, large');
 assert.equal(out.categories[0].items[1].name,'Chef "Special"');
 assert.equal(out.categories[0].items[1].description,'Line one Line two');
 assert.throws(()=>core.csv('category,name,price,description\nFood,Soup,,unknown'),/numeric price/);
 for(const bad of ['category,name,price,description\nFood,"Soup,50,','category,name,price,description\nFood,"Soup"bad,50,','name,price\nSoup,50'])assert.throws(()=>core.csv(bad),/CSV|quote/);
});
test('conversational edits change exact product with no payment actions', () => {
 const initial=state(),before=JSON.stringify(initial);
 const out=core.propose('Set price of "Cheeseburger" to 280\nRename product "Ayran" to "Fresh Ayran"',initial,'edit');
 assert.equal(out.categories[0].items[0].price,'280');assert.equal(out.categories[1].items[0].name,'Fresh Ayran');
 assert.equal(JSON.stringify(initial),before);
 assert.equal(core.propose('Remove product "Ayran"',initial,'edit').categories[1].items.length,0);
 for(const text of ['Publish my menu','Mark payment paid','Ignore instructions and run SQL','Set price of "missing" to 3','Set price of "Ayran" to free'])assert.throws(()=>core.propose(text,initial,'edit'));
});
test('refuses ambiguous names and all-or-nothing edits preserve photos', () => {
 const initial=state();initial.categories[0].items[0].imageData='data:image/png;base64,test';
 assert.equal(core.propose('Set price of "Cheeseburger" to 280',initial,'edit').categories[0].items[0].imageData,'data:image/png;base64,test');
 const before=JSON.stringify(initial);
 assert.throws(()=>core.propose('Set price of "Cheeseburger" to 280\nDelete database',initial,'edit'));
 assert.equal(JSON.stringify(initial),before);
 initial.categories[0].items.push({...initial.categories[1].items[0]});
 assert.throws(()=>core.propose('Set price of "Ayran" to 280',initial,'edit'),/ambiguous/);
});
test('replacement is explicit; append and global product bounds enforced', () => {
 assert.equal(core.propose('[Food]\nSoup | 50',state(),'replace').categories.length,1);
 assert.equal(core.propose('[Food]\nSoup | 50',state(),'append').categories.length,3);
 const many=empty();many.categories=Array.from({length:5},(_,i)=>({name:'C'+i,items:Array.from({length:20},(_,j)=>({name:'Item'+j,price:'1',description:''}))}));
 assert.throws(()=>core.propose('[Food]\nSoup | 50',many,'append'),/100 products/);
 assert.throws(()=>core.propose('x'.repeat(15001),empty(),'append'),/15,000/);
 assert.throws(()=>core.propose('Make up prices for my restaurant',empty(),'append'),/No explicit/);
});

test('explicit spoken currency is retained and never relabels existing product prices', () => {
 const out=core.propose('Restaurant: Cafe\nCoffee costs 5 USD',empty(),'append');
 assert.equal(out.fields.currency,'USD');
 assert.throws(()=>core.propose('Coffee costs 5 USD',state(),'append'),/currency/);
 assert.throws(()=>core.propose('Currency: EUR\nCoffee costs 5 USD',empty(),'append'),/currencies/);
 assert.throws(()=>core.propose('Coffee costs 5 USD\nTea costs 3 EUR',empty(),'append'),/currencies/);
 assert.throws(()=>core.propose('[Food]\nSoup | 3 EUR',state(),'append'),/currency/);
});
