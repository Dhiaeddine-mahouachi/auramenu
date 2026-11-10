import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const sandbox = {};
runInNewContext(readFileSync(new URL("../ai-menu-draft-contract.js", import.meta.url), "utf8"), sandbox);
const normalize = sandbox.AuraMenuAIDraft.normalize;

test("validates a draft and never grants payment or publication", () => {
  const draft = normalize({
    businessName: "Bella Roma", currency: "TRY", menuLanguage: "en",
    categories: [
      {name: "Pizza", items: [{name: "Margherita", price: "320", description: "Tomato and mozzarella"}]},
      {name: "Dessert", items: [{name: "Tiramisu", price: "220"}]}
    ],
    publish: true, paid: true
  });
  assert.equal(draft.productCount, 2);
  assert.equal(draft.categories[0].items[0].price, "320");
  assert.equal(draft.categories[0].items[0].needsPriceConfirmation, true);
  assert.equal(draft.paymentAuthorized, false);
  assert.equal(draft.publicationAuthorized, false);
  assert.equal(draft.requiresCustomerReview, true);
});

test("leaves unknown product prices missing and generates a question", () => {
  const draft = normalize({
    categories: [{name: "Drinks", items: [
      {name:"Ayran", price:null},
      {name:"Water", price:"30"}
    ]}]
  });
  assert.equal(draft.categories[0].items[0].price, null);
  assert.equal(draft.questions.length, 1);
  assert.equal(draft.questions[0].product, "Ayran");
  assert.equal(draft.currency, "TRY");
});

test("strips untrusted product URLs and side effects", () => {
  const draft = normalize({categories:[{name:"Pizza",items:[{
    name:"Cheese",price:"230",imageUrl:"https://example.com/not-reliable.jpg",
    imageData:"data:image/png;base64,AAAA",featured:true,deleteMenu:true
  }]}]});
  assert.equal(draft.categories[0].items[0].imageUrl, "");
  assert.equal(draft.categories[0].items[0].imageData, "");
  assert.equal(draft.categories[0].items[0].featured, false);
});

test("rejects invalid or oversized model output", () => {
  assert.throws(()=>normalize("not JSON"),/Invalid structured/);
  assert.throws(()=>normalize({categories:[]}),/1–12 categories/);
  assert.throws(()=>normalize({categories:[{name:"Pizza",items:[{name:"Cheese",price:"free"}]}]}),/price/);
  assert.throws(()=>normalize({categories:[{name:"Pizza",items:[
    {name:"Cheese",price:"100"},{name:"Cheese",price:"300"}
  ]}]}),/Duplicate product/);
  assert.throws(()=>normalize({categories:[{name:"Pizza",items:[{name:"Cheese",price:"100"}]}, {name:"Pizza",items:[]}]}),/Duplicate category/);
  assert.throws(()=>normalize({categories:[{name:"Pizza",items:Array.from({length:21},(_,i)=>({name:"item"+i,price:"50"}))}]}),/up to 20/);
  assert.throws(()=>normalize({categories:[{name:"Pizza",items:[{name:"x".repeat(101),price:"100"}]}]}),/product name/);
});
