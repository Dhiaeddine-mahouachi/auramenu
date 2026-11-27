import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { parse } = createRequire(import.meta.url)("../menu-ocr-core.js");

test("turns a printed Turkish menu into categories and priced products", () => {
  const r = parse("KEBAPLAR\nAdana Kebap ........ 520 TL\nAcılı el çekimi kıyma\nUrfa Kebap 500₺\n\nİÇECEKLER\nAyran - 60\nÇay 40,50 tl\n~~~ 12 ~~~");
  assert.equal(r.count, 4);
  assert.deepEqual(r.categories.map((c) => c.name), ["KEBAPLAR", "İÇECEKLER"]);
  assert.equal(r.categories[0].items[0].description, "Acılı el çekimi kıyma");
  assert.equal(r.categories[1].items[1].price, "40.50");
  assert.match(r.bracket, /^\[KEBAPLAR\]\nAdana Kebap \| 520 \| Acılı el çekimi kıyma/);
});
test("never invents a price and keeps unknown lines out", () => {
  const r = parse("Welcome to our place\nSoup of the day\nBurger 250");
  assert.equal(r.count, 1);
  assert.equal(r.categories[0].items[0].name, "Burger");
});
test("reads Arabic-Indic digits", () => {
  const r = parse("مشروبات\nشاي ٤٠");
  assert.equal(r.categories[0].items[0].price, "40");
});
