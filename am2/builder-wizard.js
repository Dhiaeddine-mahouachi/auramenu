/* AuraMenu builder as a step-by-step wizard: one step per screen, Next/Back, per-step checks,
   a review screen, and registration only with a signed-in AuraDigital account.
   Loaded after builder.js, builder-plus.js and menu-plans.js; keeps their element ids and logic. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const form = $("menuForm"); if (!form) return;
  const L = () => (["tr", "en", "ar"].includes(document.documentElement.lang) ? document.documentElement.lang : "tr");
  const T = {
    tr: {
      steps: ["Plan", "Restoran", "Menü", "Görünüm", "Kaydet"], step: "Adım", of: "/", back: "← Geri", next: "Devam →",
      planTitle: "Planını seç", planText: "Plan, kullanabileceğin tasarımları belirler. İstediğin zaman değiştirebilirsin.",
      month: "/ ay", year: "/ yıl", std: "15 standart tasarım", pre: "15 premium tasarım", host: "Barındırma ve düzenleme dahil", pick: "Seçildi",
      reviewTitle: "Kontrol et ve kaydet", plan: "Plan", design: "Tasarım", name: "Restoran", link: "Menü bağlantısı", items: "Menü", lang: "Menü dili", edit: "Düzenle",
      cats: "kategori", prods: "ürün",
      signedIn: "Menün bu hesaba kaydedilecek:", other: "Başka hesap kullan",
      needTitle: "Kaydetmek için giriş yap", needText: "Menün AuraDigital hesabına kaydedilir; böylece ödeme durumunu takip eder ve menünü her cihazdan yönetirsin. Hazırladıkların kaybolmaz.",
      signIn: "Giriş yap / hesap oluştur", needSign: "Menünü kaydetmek için önce AuraDigital hesabınla giriş yap.",
      errName: "Restoran adını yaz.", errSlug: "Menü bağlantısı en az 3 karakter olmalı (harf, rakam, tire).", errMenu: "En az bir kategori ve bir ürün ekle.", errPhone: "Sana ulaşabileceğimiz bir telefon numarası yaz.",
    },
    en: {
      steps: ["Plan", "Restaurant", "Menu", "Look", "Register"], step: "Step", of: "/", back: "← Back", next: "Continue →",
      planTitle: "Choose your plan", planText: "Your plan decides which designs you can use. You can change it any time.",
      month: "/ month", year: "/ year", std: "15 standard designs", pre: "15 premium designs", host: "Hosting and editing included", pick: "Selected",
      reviewTitle: "Check and register", plan: "Plan", design: "Design", name: "Restaurant", link: "Menu link", items: "Menu", lang: "Menu language", edit: "Edit",
      cats: "categories", prods: "items",
      signedIn: "Your menu will be registered to:", other: "Use another account",
      needTitle: "Sign in to register", needText: "Your menu is saved to your AuraDigital account so you can follow the payment status and manage it from any device. Nothing you entered is lost.",
      signIn: "Sign in / create account", needSign: "Sign in with your AuraDigital account first to register your menu.",
      errName: "Enter the restaurant name.", errSlug: "The menu link needs at least 3 characters (letters, numbers, hyphens).", errMenu: "Add at least one category and one item.", errPhone: "Enter a phone number we can reach you on.",
    },
    ar: {
      steps: ["الخطة", "المطعم", "القائمة", "الشكل", "التسجيل"], step: "الخطوة", of: "/", back: "رجوع →", next: "← متابعة",
      planTitle: "اختر خطتك", planText: "الخطة تحدد التصاميم المتاحة لك. يمكنك تغييرها في أي وقت.",
      month: "/ شهرياً", year: "/ سنوياً", std: "15 تصميماً قياسياً", pre: "15 تصميماً مميزاً", host: "الاستضافة والتعديل مشمولان", pick: "مختارة",
      reviewTitle: "راجع وسجّل", plan: "الخطة", design: "التصميم", name: "المطعم", link: "رابط القائمة", items: "القائمة", lang: "لغة القائمة", edit: "تعديل",
      cats: "فئات", prods: "أصناف",
      signedIn: "ستُسجّل قائمتك في الحساب:", other: "استخدم حساباً آخر",
      needTitle: "سجّل الدخول لتسجيل قائمتك", needText: "تُحفظ قائمتك في حساب AuraDigital لتتابع حالة الدفع وتديرها من أي جهاز. لن تفقد ما أدخلته.",
      signIn: "تسجيل الدخول / إنشاء حساب", needSign: "سجّل الدخول بحساب AuraDigital أولاً لتسجيل قائمتك.",
      errName: "اكتب اسم المطعم.", errSlug: "رابط القائمة يحتاج 3 أحرف على الأقل (حروف وأرقام وشرطات).", errMenu: "أضف فئة واحدة وصنفاً واحداً على الأقل.", errPhone: "اكتب رقم هاتف يمكننا التواصل معك عليه.",
    },
  };
  const t = (k) => T[L()][k] ?? T.en[k];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const STEPS = [
    { key: "plan", ids: ["planSection"] },
    { key: "business", ids: ["businessSection"] },
    { key: "menu", ids: ["smartSection", "contentSection"] },
    { key: "look", ids: ["customizeSection"] },
    { key: "review", ids: ["reviewSection"] },
  ];
  const finalOnly = [$("formMessage"), $("planConsent"), form.querySelector(".submit-row")].filter(Boolean);
  const head = form.querySelector(".form-head");
  head?.querySelector(".builder-price")?.setAttribute("hidden", "");
  const sections = [...form.querySelectorAll(":scope > section.form-section")];

  /* Header (progress) and footer (Back / Next) */
  const bar = document.createElement("div"); bar.className = "am-wz-bar";
  form.insertBefore(bar, $("planSection"));
  const foot = document.createElement("div"); foot.className = "am-wz-foot";
  foot.innerHTML = `<p class="am-wz-error" id="wzError" role="alert"></p><div class="am-wz-btns"><button type="button" class="am-wz-back" id="wzBack"></button><button type="button" class="am-wz-next" id="wzNext"></button></div>`;
  form.insertBefore(foot, $("formMessage") || form.querySelector(".submit-row"));

  let current = 0;
  const startParam = new URLSearchParams(location.search).get("step");
  const byKey = STEPS.findIndex((s) => s.key === startParam);
  if (byKey >= 0) current = byKey; else if (/^[1-5]$/.test(startParam || "")) current = Number(startParam) - 1;

  function show(index, { scroll = true } = {}) {
    current = Math.max(0, Math.min(STEPS.length - 1, index));
    const visible = new Set(STEPS[current].ids);
    sections.forEach((s) => { s.hidden = !visible.has(s.id); });
    if (head) head.hidden = current !== 0;
    finalOnly.forEach((el) => (el.hidden = current !== STEPS.length - 1));
    $("wzBack").hidden = current === 0;
    $("wzNext").hidden = current === STEPS.length - 1;
    $("wzError").textContent = "";
    renderBar(); if (STEPS[current].key === "review") renderReview();
    const url = new URL(location.href); url.searchParams.set("step", STEPS[current].key); history.replaceState(null, "", url);
    if (scroll) { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => form.querySelector(`#${STEPS[current].ids[0]} h2`)?.focus?.({ preventScroll: true }), 300); }
  }
  function renderBar() {
    const names = t("steps");
    bar.innerHTML = `<ol class="am-wz-dots">${STEPS.map((s, i) => `<li class="${i < current ? "is-done" : i === current ? "is-on" : ""}"><button type="button" data-go="${i}" ${i > current ? "disabled" : ""}><b>${i < current ? "✓" : i + 1}</b><span>${esc(names[i])}</span></button></li>`).join("")}</ol><div class="am-wz-progress"><i style="width:${(current / (STEPS.length - 1)) * 100}%"></i></div>`;
    bar.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => show(Number(b.dataset.go))));
    $("wzBack").textContent = t("back"); $("wzNext").textContent = t("next");
  }

  /* Per-step checks */
  const draft = () => window.AuraMenuVoiceBridge?.getDraft?.() || { categories: [] };
  function check(index) {
    const key = STEPS[index].key;
    if (key === "business") {
      if (!$("businessName").value.trim()) return fail(t("errName"), "businessName");
      const slug = String($("slug").value || "").trim().toLowerCase();
      if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug)) return fail(t("errSlug"), "slug");
    }
    if (key === "menu" && !draft().categories.some((c) => String(c.name || "").trim() && (c.items || []).some((i) => String(i.name || "").trim()))) return fail(t("errMenu"));
    return true;
  }
  function fail(message, focusId) { $("wzError").textContent = message; if (focusId) $(focusId)?.focus(); return false; }
  $("wzNext").onclick = () => { if (check(current)) show(current + 1); };
  $("wzBack").onclick = () => show(current - 1);
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < STEPS.length - 1) { e.preventDefault(); $("wzNext").click(); }
  });
  form.addEventListener("submit", (e) => {
    if (current !== STEPS.length - 1) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (!$("contactPhone").value.trim()) { e.preventDefault(); e.stopImmediatePropagation(); fail(t("errPhone"), "contactPhone"); return; }
    if (!account) { e.preventDefault(); e.stopImmediatePropagation(); fail(t("needSign")); $("wzAccount").scrollIntoView({ behavior: "smooth", block: "center" }); }
  }, true);

  /* Plan cards (the select stays the source of truth for builder.js and menu-plans.js) */
  function renderPlans() {
    const plans = window.AuraMenuPlans?.current() || window.AURA_MENU_CONFIG?.plans || [];
    const select = $("planId");
    const fmt = (n) => new Intl.NumberFormat(L() === "ar" ? "ar" : L() === "en" ? "en" : "tr-TR").format(n);
    $("planCards").innerHTML = plans.map((p) => `<button type="button" class="am-wz-plan-card${select.value === p.id ? " is-on" : ""}" data-plan="${esc(p.id)}" aria-pressed="${select.value === p.id}">
      <b>${esc(p.name)}</b><span class="am-wz-price">${fmt(p.amount)} TL <small>${p.interval === "yearly" ? t("year") : t("month")}</small></span>
      <ul><li>${p.id === "pro" ? t("pre") : t("std")}</li><li>${t("host")}</li></ul>${select.value === p.id ? `<em>✓ ${t("pick")}</em>` : ""}</button>`).join("");
    $("planCards").querySelectorAll("[data-plan]").forEach((b) => (b.onclick = () => { select.value = b.dataset.plan; select.dispatchEvent(new Event("change", { bubbles: true })); renderPlans(); }));
    document.querySelector('[data-wz="planText"]').textContent = t("planText");
    document.querySelector('[data-wz="planTitle"]').textContent = t("planTitle");
    document.querySelector('[data-wz="reviewTitle"]').textContent = t("reviewTitle");
  }
  $("planId").addEventListener("change", renderPlans);

  /* Review */
  function renderReview() {
    const plan = (window.AuraMenuPlans?.current() || window.AURA_MENU_CONFIG?.plans || []).find((p) => p.id === $("planId").value);
    const tpl = $("templateId").value, designName = window.AURAMENU_V2?.names?.[tpl] || $("templateId").selectedOptions[0]?.textContent || tpl;
    const d = draft(), cats = d.categories.filter((c) => String(c.name || "").trim()), items = cats.reduce((n, c) => n + (c.items || []).filter((i) => String(i.name || "").trim()).length, 0);
    const langName = $("menuLanguage").selectedOptions[0]?.textContent || "";
    const row = (label, value, step) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd><button type="button" data-go="${step}">${esc(t("edit"))}</button></div>`;
    $("wzSummary").innerHTML = `<dl>${[
      row(t("plan"), plan ? `${plan.name} · ${new Intl.NumberFormat(L() === "ar" ? "ar" : L() === "en" ? "en" : "tr-TR").format(plan.amount)} TL ${plan.interval === "yearly" ? t("year") : t("month")}` : "", 0),
      row(t("name"), $("businessName").value.trim(), 1),
      row(t("link"), `${window.AURAMENU_ACCOUNTS_ORIGIN ? location.host : "auramenu.space"}/${$("slug").value.trim()}`, 1),
      row(t("items"), `${cats.length} ${t("cats")} · ${items} ${t("prods")}`, 2),
      row(t("design"), designName, 3),
      row(t("lang"), langName, 1),
    ].join("")}</dl>`;
    $("wzSummary").querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => show(Number(b.dataset.go))));
    renderAccount();
  }

  /* Account: registration needs a signed-in AuraDigital account (no email codes here) */
  let account = null;
  async function loadAccount() {
    try { account = (await (await fetch("/api/auramenu/account/session", { cache: "no-store", credentials: "same-origin" })).json()).user || null; }
    catch { account = null; }
    if (account) { $("contactName").value = account.name || ""; $("email").value = account.email || ""; }
    renderAccount();
  }
  function renderAccount() {
    const box = $("wzAccount"); if (!box) return;
    const next = `builder.html?step=review&lang=${L()}`;
    const signin = `signin.html?lang=${L()}&next=${encodeURIComponent(next)}`;
    box.className = `am-wz-account ${account ? "is-ok" : "is-need"}`;
    box.innerHTML = account
      ? `<span class="am-wz-check">✓</span><div><small>${esc(t("signedIn"))}</small><b>${esc(account.email)}</b></div><a href="${esc(signin)}" data-switch>${esc(t("other"))}</a>`
      : `<div><b>${esc(t("needTitle"))}</b><p>${esc(t("needText"))}</p></div><a class="am-wz-signin" href="${esc(signin)}">${esc(t("signIn"))}</a>`;
    box.querySelector("[data-switch]")?.addEventListener("click", async (e) => { e.preventDefault(); try { await fetch("/api/auramenu/account/logout", { method: "POST", credentials: "same-origin" }); } catch {} location.href = signin; });
    const submit = $("submitButton"); if (submit) submit.disabled = !account;
  }
  window.ensureAuraMenuAccount = async () => {
    await loadAccount();
    if (!account) throw new Error(t("needSign"));
    return { email: account.email, name: account.name || "" };
  };

  /* Language changes re-render the wizard texts */
  new MutationObserver(() => { renderPlans(); renderBar(); if (STEPS[current].key === "review") renderReview(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  // Fill the menu link from the restaurant name as it is typed (builder.js does it on blur).
  $("businessName").addEventListener("input", () => { if (!$("slug").dataset.edited) $("businessName").dispatchEvent(new Event("blur")); });

  renderPlans();
  window.AuraMenuPlans?.load().then(() => { renderPlans(); if (STEPS[current].key === "review") renderReview(); });
  show(current, { scroll: false });
  loadAccount();
  addEventListener("pageshow", loadAccount);
})();
