import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const sandbox = {};
runInNewContext(readFileSync(new URL("../voice-fill-core.js", import.meta.url), "utf8"), sandbox);
const parse = sandbox.AuraMenuVoiceCore.parse;

test("dictation fills selected business field instead of guessing a target", () => {
  const out = parse("businessName", "Bella Roma");
  assert.equal(out.kind, "field");
  assert.equal(out.target, "businessName");
  assert.equal(out.value, "Bella Roma");
  assert.equal(parse("address", "Karaköy Istanbul").value, "Karaköy Istanbul");
  assert.equal(parse("category", "Pizzas").name, "Pizzas");
  assert.throws(() => parse("unknown", "wrong"), /Unknown field/);
});

test("understands spoken products and explicit prices, without invented descriptions", () => {
  const a = parse("product", "Margherita, 320");
  assert.equal(a.name, "Margherita");
  assert.equal(a.price, "320");
  assert.equal(a.description, "");
  assert.equal(parse("product", "Margherita price 320").price, "320");
  assert.equal(parse("product", "Margherita pizza 320 lira").name, "Margherita pizza");
  assert.equal(parse("product", "Pepperoni, 390, spicy salami").description, "spicy salami");
  assert.equal(parse("product", "Margherita 1,250").price, "1,250");
});

test("supports Turkish and Arabic price phrases and Arabic-Indic digits", () => {
  const turkish = parse("product", "Tavuk döner fiyatı 250 TL");
  assert.equal(turkish.name, "Tavuk döner");
  assert.equal(turkish.price, "250");
  const arabic = parse("product", "مارغريتا السعر ٣٢٠");
  assert.equal(arabic.name, "مارغريتا");
  assert.equal(arabic.price, "320");
  assert.equal(parse("product", "فلافل، ٢٥٠").price, "250");
});

test("rejects missing prices and oversize inputs", () => {
  assert.throws(() => parse("product", "Margherita pizza"), /product|price/i);
  assert.throws(() => parse("product", "Margherita price free"), /product|price/i);
  assert.throws(() => parse("businessName", ""), /Speak or type/);
  assert.throws(() => parse("businessName", "x".repeat(101)), /100 characters/);
  assert.throws(() => parse("category", "x".repeat(81)), /80 characters/);
  assert.throws(() => parse("product", "Pizza, 200, " + "x".repeat(301)), /300 characters/);
  assert.throws(() => parse("businessName", "<script>".repeat(15)), /100 characters/);
});
