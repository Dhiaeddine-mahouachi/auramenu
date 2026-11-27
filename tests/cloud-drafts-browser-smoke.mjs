import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.env.AURA_TEST_ORIGIN || "http://127.0.0.1:4173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
let serverDraft;
let offline = false;
let writes = 0;

async function openBuilder() {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (url.pathname !== "/api/auramenu/account/drafts/builder") return route.continue();
    const respond = (status, data) => route.fulfill({ status, json: data });
    if (offline) return respond(503, {});
    if (route.request().method() === "GET") {
      return serverDraft ? respond(200, { draft: serverDraft }) : respond(404, {});
    }
    writes += 1;
    const { baseVersion, name, data } = route.request().postDataJSON();
    const version = serverDraft?.version ?? 0;
    if (baseVersion !== version) return respond(409, { version });
    serverDraft = { name, data, version: version + 1, updatedAt: "2026-11-27 12:00:00" };
    return respond(version ? 200 : 201, { version: serverDraft.version });
  });
  await page.goto(origin + "/builder.html?lang=en");
  return { page, context };
}

try {
  offline = true;
  const first = await openBuilder();
  await first.page.locator("#businessName").fill("Aurora Café");
  await first.page.getByText("Saved on this device only").waitFor();
  await first.page.reload();
  assert.equal(await first.page.locator("#businessName").inputValue(), "Aurora Café");
  assert.equal(writes, 0);

  offline = false;
  await first.page.getByText("Saved to your account").waitFor();
  assert.equal(serverDraft.version, 1);
  const second = await openBuilder();
  await second.page.getByText("Saved to your account").waitFor();
  assert.equal(await second.page.locator("#businessName").inputValue(), "Aurora Café");
  await second.page.locator("#businessName").fill("Aurora on the second device");
  await second.page.waitForFunction(() => document.querySelector(".am-cloud")?.textContent.includes(" · "));
  assert.equal(serverDraft.version, 2);

  await first.page.locator("#businessName").fill("Local edits");
  await first.page.getByText("This draft changed on another device").waitFor();
  assert.equal(await first.page.locator("#businessName").inputValue(), "Local edits");
  assert.equal(serverDraft.name, "Aurora on the second device");
  await first.page.getByRole("button", { name: "Keep this one" }).click();
  await first.page.getByText("Saved to your account").waitFor();
  assert.equal(serverDraft.version, 3);
  assert.equal(serverDraft.name, "Local edits");
  console.log("PASS offline recovery, cross-device restore and explicit conflict resolution");
} finally {
  await browser.close();
}
