import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ["--no-sandbox"] });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => {
    window.__voiceTestTranscript = "Margherita, 320";
    class MockSpeechRecognition {
      start() {
        queueMicrotask(() => {
          this.onresult?.({ results: [{ isFinal: true, 0: { transcript: window.__voiceTestTranscript } }] });
          this.onend?.();
        });
      }
      stop() { this.onend?.(); }
    }
    window.SpeechRecognition = MockSpeechRecognition;
  });
  const response = await page.goto("http://127.0.0.1:4173/builder.html?lang=en", { waitUntil: "domcontentloaded" });
  assert.equal(response.status(), 200);
  await page.locator("#voiceTarget").selectOption("businessName");
  await page.locator("#voiceTranscript").fill("Bella Roma");
  await page.locator("#voiceReview").click();
  assert.match(await page.locator("#voiceReviewText").innerText(), /Bella Roma/);
  await page.locator("#voiceApply").click();
  assert.equal(await page.locator("#businessName").inputValue(), "Bella Roma");
  assert.equal(await page.locator("#slug").inputValue(), "bella-roma");

  await page.locator("#voiceTarget").selectOption("category");
  await page.locator("#voiceTranscript").fill("Pizzas");
  await page.locator("#voiceReview").click();
  await page.locator("#voiceApply").click();
  await page.locator("#voiceTarget").selectOption("product");
  const category = await page.locator("#voiceCategorySelect").inputValue();
  assert.ok(category, "At least one category is available");
  const before = await page.locator('[data-item-field="name"]').count();
  await page.locator("#voiceStart").click();
  await page.waitForFunction(() => document.querySelector("#voiceTranscript")?.value === "Margherita, 320");
  await page.locator("#voiceReview").click();
  assert.match(await page.locator("#voiceReviewText").innerText(), /320/);
  await page.locator("#voiceApply").click();
  const after = await page.locator('[data-item-field="name"]').count();
  assert.equal(after, before + 1);
  const selectedCategory = page.locator(`[data-category="${category}"]`);
  assert.equal(await selectedCategory.locator('[data-item-field="name"]').last().inputValue(), "Margherita");
  assert.equal(await selectedCategory.locator('[data-item-field="price"]').last().inputValue(), "320");

  const width = await page.locator("#voiceFillSection").evaluate((el) => el.getBoundingClientRect().width);
  assert.ok(width > 0 && width <= 390, "Voice UI fits mobile viewport");
  console.log("PASS: voice transcription, business field, slug, product insertion and 390px mobile layout");
} finally {
  await browser.close();
}
