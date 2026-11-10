import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const sandbox = {};
runInNewContext(readFileSync(new URL("../menu-import.js", import.meta.url), "utf8"), sandbox);
const parse = sandbox.AuraMenuQuickImport.parse;

test("imports multilingual items and preserves exact prices without inventing data", () => {
  const result = parse("[Pizzas]\nMargherita | 320 | Tomato & cheese\nبيتزا خضار | 1.250\n[Pizzas]\nPepperoni | ₺390\n[Drinks]\nAyran | 60");
  assert.equal(result.itemCount, 4);
  assert.equal(result.categories.length, 2);
  assert.equal(result.categories[0].items[1].name, "بيتزا خضار");
  assert.equal(result.categories[0].items[1].price, "1.250");
  assert.equal(result.categories[0].items[1].imageUrl, "");
  assert.equal(result.categories[0].items[2].price, "₺390");
});

test("rejects missing price, category and malformed input", () => {
  assert.throws(() => parse("[Pizzas]\nMargherita"), /Line 2/);
  assert.throws(() => parse("Margherita | 320"), /Category/);
  assert.throws(() => parse("[Pizzas]\nMargherita | ask AI"), /numeric price/);
  assert.throws(() => parse("[Pizzas]"), /priced product/);
});

test("rejects dangerous image URL schemes and credentials", () => {
  assert.throws(() => parse("[Food]\nSoup | 80 | Delicious | javascript:alert(1)"), /HTTPS/);
  assert.throws(() => parse("[Food]\nSoup | 80 | Delicious | https://user:pass@example.com/a.jpg"), /HTTPS/);
  assert.equal(parse("[Food]\nSoup | 80 | Delicious | https://example.com/a.jpg").itemCount, 1);
});

test("enforces menu category and product bounds", () => {
  const cats = Array.from({ length: 13 }, (_, i) => "[Category " + i + "]\nItem | 10").join("\n");
  assert.throws(() => parse(cats), /Maximum 12/);
  const items = "[Food]\n" + Array.from({ length: 21 }, (_, i) => "Dish" + i + " | 10").join("\n");
  assert.throws(() => parse(items), /maximum 20/);
  assert.throws(() => parse("x".repeat(15001)), /too long/);
});
