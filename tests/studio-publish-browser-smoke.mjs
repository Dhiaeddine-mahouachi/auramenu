import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.env.AURA_TEST_ORIGIN || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
const id = "ddee74bd-3b1c-4784-b44c-68352314dd28";
const menu = {
  id, templateId: "std-01", businessName: "Test Café", slug: "test-cafe",
  status: "pending", paymentStatus: "paid", billing: { planId: "starter", active: true },
  editAccess: { active: true }, designAccess: { standard: true }, role: "owner", canPublish: true, revision: 1,
  categories: [{ name: "Food", items: [{ name: "Toast", price: "95" }] }],
};
let calls = 0;

try {
  const page = await browser.newPage();
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (process.env.AURA_QR_SCRIPT && url.href === "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js") {
      return route.fulfill({ path: process.env.AURA_QR_SCRIPT, contentType: "application/javascript" });
    }
    if (url.origin !== origin) return route.abort();
    if (url.pathname === "/api/auramenu/account/session") {
      return route.fulfill({ json: { user: { emailVerified: true } } });
    }
    if (url.pathname === `/api/auramenu/dashboard/${id}/claim`) {
      assert.equal(route.request().postDataJSON().existingToken, "a".repeat(64));
      return route.fulfill({ json: { menu } });
    }
    if (url.pathname === `/api/auramenu/dashboard/${id}`) {
      return route.fulfill({ json: { menu } });
    }
    if (url.pathname === `/api/auramenu/dashboard/${id}/publish`) {
      assert.equal(route.request().method(), "POST");
      calls += 1;
      return route.fulfill({ json: { menu: { ...menu, status: "approved", canPublish: false, revision: 2 } } });
    }
    if (url.pathname === `/api/auramenu/dashboard/${id}/revisions`) {
      return route.fulfill({ json: { revisions: [{ revision: 1, publishedAt: "2026-11-28T00:00:00Z" }] } });
    }
    if (url.pathname === `/api/auramenu/dashboard/${id}/revisions/1`) {
      const history = { ...menu, businessName: "Earlier Café", canPublish: false, status: "approved" };
      if (route.request().method() === "POST") {
        assert.equal(route.request().postDataJSON().expectedRevision, 2);
        return route.fulfill({ json: { menu: { ...history, revision: 3 } } });
      }
      return route.fulfill({ json: { menu: history } });
    }
    return route.continue();
  });
  await page.addInitScript(id => localStorage.setItem(`auraMenuToken:${id}`, "a".repeat(64)), id);
  await page.goto(`${origin}/studio.html?lang=en&id=${id}`);
  const publish = page.getByRole("button", { name: "Publish menu" });
  await publish.waitFor();
  assert.equal(await page.locator("#statusBadge").getAttribute("data-s"), "pending");
  await publish.click();
  await publish.waitFor({ state: "detached" });
  assert.equal(await page.locator("#statusBadge").getAttribute("data-s"), "live");
  assert.equal(calls, 1);
  await page.getByRole("button", { name: "Published versions" }).click();
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await page.frameLocator("#preview").getByRole("heading", { name: "Earlier Café" }).waitFor();
  assert.equal(await page.locator("#bizName").textContent(), "Test Café");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Restore", exact: true }).click();
  await page.waitForFunction(() => document.querySelector("#bizName")?.textContent === "Earlier Café");
  await page.locator('[data-tab="qr"]').click();
  assert.match(await page.locator(".st-qrbox small").textContent(), /auramenu\.space\/test-cafe/);
  if (process.env.AURA_QR_SCRIPT) await page.locator("#qrBox canvas").waitFor({ state: "attached" });
  console.log("PASS earlier builder token, payment gate, publication, private preview and restoration");
} finally {
  await browser.close();
}
