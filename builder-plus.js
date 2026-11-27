/* AuraMenu 2.0 builder upgrades (loaded after builder.js; keeps all existing IDs and logic):
   1) Step navigation with progress   2) One "Smart fill" section: voice, menu photo (OCR), paste, CSV → products filled automatically
   3) "Customize" section: visual design picker, menu colour, light/dark, logo, video, socials, Google links. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const form = $("menuForm"); if (!form) return;
  const lang = () => (["tr", "en", "ar"].includes(document.documentElement.lang) ? document.documentElement.lang : "tr");
  const T = {
    tr: { steps: ["İşletme", "Akıllı doldurma", "Ürünler", "Özelleştir", "Yayın", "QR"], next: "Sonraki adım →", smartTitle: "✨ Akıllı doldurma", smartText: "Bir yöntem seç; ürünler otomatik olarak menüne eklenir. Sonra aşağıda düzenleyebilirsin.", speak: "Sesle anlat", speakSub: "Konuş, biz yazalım", photo: "Menü fotoğrafı", photoSub: "Basılı menünü çek", paste: "Yapıştır / yaz", pasteSub: "Metin veya liste", csv: "CSV dosyası", csvSub: "Excel'den aktar", fill: "Ürünleri doldur", listening: "Dinliyorum… Bitince \"Dinlemeyi durdur\"a bas.", reading: "Menü okunuyor… %{p}", readingStart: "Fotoğraf hazırlanıyor…", ocrNone: "Fotoğrafta fiyatlı ürün bulunamadı. Daha net, düz ve yakından bir fotoğraf dene ya da metni yapıştır.", added: "{n} ürün menüne eklendi ✓", undo: "Geri al", undone: "Son ekleme geri alındı.", fillFail: "Ürün bulunamadı. Biçim: Kategori: Burgerler, sonra Ürün | Fiyat", tips: "Fotoğraf ipuçları: düz tut, iyi ışık, sayfanın tamamı görünsün.", single: "Tek bir alanı sesle doldur", custTitle: "🎨 Özelleştir", custText: "Menünün tasarımını, rengini ve ek bilgilerini seç. Önizleme anında değişir.", design: "Tasarım", color: "Menü rengi", colorAuto: "Tasarımın rengi", mode: "Görünüm", mAuto: "Tasarıma göre", mLight: "Açık", mDark: "Koyu", logo: "Logo bağlantısı (https)", video: "Menü videosu (https …mp4)", ig: "Instagram", tt: "TikTok", fb: "Facebook", review: "Google yorum bağlantısı", maps: "Google Haritalar bağlantısı", extras: "Bağlantılar ve medya", premium: "Premium" },
    en: { steps: ["Business", "Smart fill", "Products", "Customize", "Publish", "QR"], next: "Next step →", smartTitle: "✨ Smart fill", smartText: "Pick a method and your products are added to the menu automatically. Edit them below afterwards.", speak: "Speak it", speakSub: "Talk, we type", photo: "Menu photo", photoSub: "Snap your printed menu", paste: "Paste / type", pasteSub: "Text or a list", csv: "CSV file", csvSub: "Import from Excel", fill: "Fill products", listening: "Listening… Press \"Stop listening\" when done.", reading: "Reading the menu… {p}%", readingStart: "Preparing the photo…", ocrNone: "No priced items found in the photo. Try a sharper, flatter, closer photo or paste the text.", added: "{n} products added to your menu ✓", undo: "Undo", undone: "Last fill undone.", fillFail: "No products found. Format: Category: Burgers, then Product | Price", tips: "Photo tips: hold it flat, good light, the whole page in frame.", single: "Dictate a single field", custTitle: "🎨 Customize", custText: "Choose your menu's design, colour and extra details. The preview updates instantly.", design: "Design", color: "Menu colour", colorAuto: "Design colour", mode: "Appearance", mAuto: "Design default", mLight: "Light", mDark: "Dark", logo: "Logo link (https)", video: "Menu video (https …mp4)", ig: "Instagram", tt: "TikTok", fb: "Facebook", review: "Google review link", maps: "Google Maps link", extras: "Links & media", premium: "Premium" },
    ar: { steps: ["المطعم", "تعبئة ذكية", "المنتجات", "تخصيص", "النشر", "QR"], next: "الخطوة التالية ←", smartTitle: "✨ تعبئة ذكية", smartText: "اختر طريقة وستُضاف المنتجات إلى قائمتك تلقائياً، ثم عدّلها بالأسفل.", speak: "تحدّث", speakSub: "تكلم ونحن نكتب", photo: "صورة القائمة", photoSub: "صوّر قائمتك المطبوعة", paste: "الصق / اكتب", pasteSub: "نص أو قائمة", csv: "ملف CSV", csvSub: "استيراد من Excel", fill: "املأ المنتجات", listening: "أستمع… اضغط \"إيقاف الاستماع\" عند الانتهاء.", reading: "جارٍ قراءة القائمة… {p}٪", readingStart: "جارٍ تجهيز الصورة…", ocrNone: "لم نجد منتجات بأسعار في الصورة. جرّب صورة أوضح وأقرب أو الصق النص.", added: "أُضيف {n} منتجاً إلى قائمتك ✓", undo: "تراجع", undone: "تم التراجع عن آخر تعبئة.", fillFail: "لم نجد منتجات. الصيغة: Category: Burgers ثم Product | Price", tips: "نصائح: صورة مستوية، إضاءة جيدة، الصفحة كاملة.", single: "تعبئة حقل واحد بالصوت", custTitle: "🎨 تخصيص", custText: "اختر تصميم قائمتك ولونها والتفاصيل الإضافية. تتغير المعاينة فوراً.", design: "التصميم", color: "لون القائمة", colorAuto: "لون التصميم", mode: "المظهر", mAuto: "حسب التصميم", mLight: "فاتح", mDark: "داكن", logo: "رابط الشعار (https)", video: "فيديو القائمة (https …mp4)", ig: "Instagram", tt: "TikTok", fb: "Facebook", review: "رابط تقييم Google", maps: "رابط خرائط Google", extras: "الروابط والوسائط", premium: "مميز" },
  };
  const t = (k) => T[lang()][k] ?? T.en[k];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  /* ── Extras store (customization) ──────────────────────────────────── */
  const KEY = "auraMenuExtras";
  let extras = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch { return {}; } })();
  const url = (v) => (/^https:\/\/\S+$/i.test(String(v || "").trim()) ? String(v).trim() : "");
  window.AuraMenuExtras = Object.freeze({
    get() {
      // AuraDigital API presentation shape (src/auramenu-designs.js normalizeMenuPresentation).
      const e = extras, sc = e.socials || {}, accent = /^#[0-9a-f]{6}$/i.test(e.accent || "") ? e.accent : "";
      const links = Object.fromEntries([["instagram", sc.instagram], ["tiktok", sc.tiktok], ["facebook", sc.facebook], ["review", e.reviewUrl], ["directions", e.mapsUrl]].map(([k, v]) => [k, url(v)]).filter(([, v]) => v));
      const design = {};
      if (accent) { design.accent = accent; design.primary = accent; }
      if (e.mode === "dark") design.background = "#1C1317"; else if (e.mode === "light") design.background = "#F8EFE2";
      if (url(e.video)) design.cover = url(e.video);
      const restaurant = { links };
      if (url(e.logo)) restaurant.logo = url(e.logo);
      return { restaurant, design };
    },
  });
  const saveExtras = () => { try { localStorage.setItem(KEY, JSON.stringify(extras)); } catch {} window.dispatchEvent(new Event("auramenu:extras")); };

  /* ── Sections & ids ────────────────────────────────────────────────── */
  const sections = [...form.querySelectorAll(":scope > section.form-section, :scope section.form-section")];
  const business = sections.find((s) => s.querySelector("#businessName")); if (business && !business.id) business.id = "businessSection";
  const publish = sections.find((s) => s.querySelector("#slug")); if (publish && !publish.id) publish.id = "publishSection";

  /* ── Smart fill section ────────────────────────────────────────────── */
  const smart = document.createElement("section"); smart.className = "form-section am-smart"; smart.id = "smartSection";
  smart.innerHTML = `<h2 data-bp="smartTitle"></h2><p class="am-smart-lede" data-bp="smartText"></p>
    <div class="am-smart-grid">
      <button type="button" class="am-smart-tile" data-smart="speak"><i>🎤</i><b data-bp="speak"></b><small data-bp="speakSub"></small></button>
      <button type="button" class="am-smart-tile" data-smart="photo"><i>📷</i><b data-bp="photo"></b><small data-bp="photoSub"></small></button>
      <button type="button" class="am-smart-tile" data-smart="paste"><i>⌨️</i><b data-bp="paste"></b><small data-bp="pasteSub"></small></button>
      <button type="button" class="am-smart-tile" data-smart="csv"><i>📄</i><b data-bp="csv"></b><small data-bp="csvSub"></small></button>
    </div>
    <input type="file" id="smartPhoto" accept="image/*" capture="environment" hidden>
    <div class="am-smart-status" id="smartStatus" role="status" aria-live="polite" hidden><span class="am-smart-bar"><i id="smartBar"></i></span><p id="smartMsg"></p><button type="button" class="add-button" id="smartUndo" hidden data-bp="undo"></button></div>
    <p class="am-smart-tip" data-bp="tips"></p>
    <div class="am-smart-inner" id="smartInner"></div>
    <details class="am-smart-more" id="smartMore"><summary data-bp="single"></summary></details>`;
  const assistant = $("assistantSection"), voice = $("voiceFillSection");
  if (assistant) { assistant.before(smart); $("smartInner").append(assistant); assistant.classList.add("am-smart-assistant"); }
  if (voice) $("smartMore").append(voice);
  const fillBtn = document.createElement("button"); fillBtn.type = "button"; fillBtn.className = "add-button am-smart-fill"; fillBtn.dataset.bp = "fill"; fillBtn.onclick = () => autoFill();
  $("assistantSource")?.after(fillBtn);

  let undoState = null;
  const status = (msg, pct) => { $("smartStatus").hidden = false; $("smartMsg").textContent = msg; $("smartBar").style.width = `${pct ?? 100}%`; };
  function autoFill() {
    const src = $("assistantSource"); if (!src || !src.value.trim()) return;
    const before = window.AuraMenuVoiceBridge?.getDraft();
    const count0 = before ? before.categories.reduce((n, c) => n + c.items.length, 0) : 0;
    if ($("assistantMode").value === "edit") $("assistantMode").value = "append";
    $("assistantMode").dispatchEvent(new Event("change", { bubbles: true }));
    $("assistantReview").click();
    setTimeout(() => {
      const apply = $("assistantApply");
      if (!apply || apply.hidden || apply.disabled) { status($("assistantStatus")?.textContent || t("fillFail"), 100); return; }
      apply.click();
      const after = window.AuraMenuVoiceBridge?.getDraft();
      const added = after ? after.categories.reduce((n, c) => n + c.items.length, 0) - count0 : 0;
      undoState = before; $("smartUndo").hidden = !before;
      status(t("added").replace("{n}", Math.max(0, added)), 100);
      $("contentSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
      $("contentSection")?.classList.add("am-flash"); setTimeout(() => $("contentSection")?.classList.remove("am-flash"), 1600);
    }, 60);
  }
  $("smartUndo").onclick = () => {
    if (!undoState || !window.AuraMenuVoiceBridge) return;
    try { window.AuraMenuVoiceBridge.applyReviewed(undoState, JSON.stringify(window.AuraMenuVoiceBridge.getDraft())); status(t("undone"), 100); $("smartUndo").hidden = true; undoState = null; } catch (e) { status(e.message, 100); }
  };
  smart.querySelectorAll("[data-smart]").forEach((b) => (b.onclick = () => {
    const k = b.dataset.smart;
    if (k === "speak") {
      $("assistantSource").value = ""; $("assistantSource").dispatchEvent(new Event("input", { bubbles: true }));
      $("assistantStart").click(); status(t("listening"), 30);
      const stop = $("assistantStop");
      const mo = new MutationObserver(() => { if (stop.hidden) { mo.disconnect(); setTimeout(autoFill, 400); } }); mo.observe(stop, { attributes: true, attributeFilter: ["hidden"] });
    }
    if (k === "photo") $("smartPhoto").click();
    if (k === "paste") { $("assistantSource").focus(); $("assistantSource").scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (k === "csv") $("assistantCsv")?.click();
  }));
  $("assistantCsv")?.addEventListener("change", () => setTimeout(autoFill, 700));

  /* Menu photo → OCR (Tesseract.js, loaded only when used) → products */
  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.append(s); }); }
  async function shrink(file) {
    const img = await createImageBitmap(file); const max = 2000, k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    const x = c.getContext("2d"); x.filter = "grayscale(1) contrast(1.25)"; x.drawImage(img, 0, 0, c.width, c.height); return c;
  }
  $("smartPhoto").onchange = async (e) => {
    const file = e.target.files?.[0]; e.target.value = ""; if (!file) return;
    try {
      status(t("readingStart"), 5);
      const canvas = await shrink(file);
      if (!window.Tesseract) await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
      const langs = $("menuLanguage")?.value === "ar" ? "ara+eng" : "tur+eng";
      const worker = await window.Tesseract.createWorker(langs, 1, { logger: (m) => { if (m.status === "recognizing text") status(t("reading").replace("{p}", Math.round(m.progress * 100)), 10 + m.progress * 85); } });
      const { data } = await worker.recognize(canvas); await worker.terminate();
      const parsed = window.AuraMenuOcrCore.parse(data.text, lang() === "en" ? "Menu" : lang() === "ar" ? "القائمة" : "Menü");
      if (!parsed.count) { status(t("ocrNone"), 100); $("assistantSource").value = data.text.slice(0, 15000); return; }
      $("assistantSource").value = parsed.bracket.slice(0, 15000); $("assistantSource").dispatchEvent(new Event("input", { bubbles: true }));
      autoFill();
    } catch (err) { status(`${t("ocrNone")} (${err?.message || err})`, 100); }
  };

  /* ── Customize section ─────────────────────────────────────────────── */
  const cust = document.createElement("section"); cust.className = "form-section am-cust"; cust.id = "customizeSection";
  const designs = window.AURAMENU_DESIGNS?.designs || [];
  const swatches = ["", "#6E2037", "#D43B2E", "#D86A41", "#F5BD43", "#778A3D", "#1F5F8B", "#1E5AA8", "#24191E", "#C9A45C", "#D9576B", "#0F2A22"];
  cust.innerHTML = `<h2 data-bp="custTitle"></h2><p data-bp="custText"></p>
    <h3 class="am-cust-h" data-bp="design"></h3><div class="am-cust-designs" id="custDesigns">${designs.map((d) => `<button type="button" data-d="${d.code || d.id}"><img src="media/gallery-v3/${d.id}.webp" alt="" loading="lazy"><span>${esc(d.name)}${d.tier === "premium" ? " ★" : ""}</span></button>`).join("")}</div>
    <div class="am-cust-row"><div><h3 class="am-cust-h" data-bp="color"></h3><div class="am-swatches" id="custSwatches">${swatches.map((c) => `<button type="button" data-c="${c}" style="--sw:${c || "conic-gradient(#6E2037,#F5BD43,#778A3D,#1E5AA8,#6E2037)"}" aria-label="${c || "auto"}"></button>`).join("")}<label class="am-swatch-pick"><input type="color" id="custColor" value="#6E2037"></label></div></div>
    <div><h3 class="am-cust-h" data-bp="mode"></h3><div class="am-cust-seg" id="custMode"><button type="button" data-m="" data-bp="mAuto"></button><button type="button" data-m="light" data-bp="mLight"></button><button type="button" data-m="dark" data-bp="mDark"></button></div></div></div>
    <h3 class="am-cust-h" data-bp="extras"></h3>
    <div class="form-grid">${[["logo", "logo"], ["video", "video"], ["socials.instagram", "ig"], ["socials.tiktok", "tt"], ["socials.facebook", "fb"], ["reviewUrl", "review"], ["mapsUrl", "maps"]].map(([k, l]) => `<label class="field"><span data-bp="${l}"></span><input type="url" inputmode="url" data-x="${k}" placeholder="https://"></label>`).join("")}</div>`;
  ($("contentSection") || assistant)?.after(cust);
  const getX = (k) => k.split(".").reduce((o, p) => (o || {})[p], extras) || "";
  const setX = (k, v) => { const ps = k.split("."); let o = extras; while (ps.length > 1) { const p = ps.shift(); o[p] = o[p] || {}; o = o[p]; } o[ps[0]] = v; };
  cust.querySelectorAll("[data-x]").forEach((i) => { i.value = getX(i.dataset.x); i.addEventListener("input", () => { setX(i.dataset.x, i.value.trim()); saveExtras(); }); });
  const markDesign = () => cust.querySelectorAll("[data-d]").forEach((b) => b.classList.toggle("is-on", b.dataset.d === $("templateId").value));
  cust.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { $("templateId").value = b.dataset.d; $("templateId").dispatchEvent(new Event("change", { bubbles: true })); $("templateId").dispatchEvent(new Event("input", { bubbles: true })); markDesign(); }));
  $("templateId").addEventListener("change", markDesign); markDesign();
  const markColor = () => { cust.querySelectorAll("[data-c]").forEach((b) => b.classList.toggle("is-on", (b.dataset.c || "") === (extras.accent || ""))); if (extras.accent) $("custColor").value = extras.accent; };
  cust.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { extras.accent = b.dataset.c; markColor(); saveExtras(); }));
  $("custColor").addEventListener("input", (e) => { extras.accent = e.target.value; markColor(); saveExtras(); });
  const markMode = () => cust.querySelectorAll("[data-m]").forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.m || "") === (extras.mode || ""))));
  cust.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => { extras.mode = b.dataset.m; markMode(); saveExtras(); }));
  markColor(); markMode();

  /* ── Step navigation ───────────────────────────────────────────────── */
  const stepIds = ["businessSection", "smartSection", "contentSection", "customizeSection", "publishSection", "qrBuilder"].filter((id) => $(id));
  const nav = document.createElement("nav"); nav.className = "am-steps-nav"; nav.setAttribute("aria-label", "Steps");
  form.prepend(nav);
  function renderNav() {
    nav.innerHTML = `<div class="am-steps-track">${stepIds.map((id, i) => `<a href="#${id}" data-step="${id}"><b>${i + 1}</b><span>${t("steps")[["businessSection", "smartSection", "contentSection", "customizeSection", "publishSection", "qrBuilder"].indexOf(id)]}</span></a>`).join("")}</div><div class="am-steps-progress"><i id="stepProgress"></i></div>`;
    nav.querySelectorAll("a").forEach((a) => (a.onclick = (e) => { e.preventDefault(); $(a.dataset.step).scrollIntoView({ behavior: "smooth", block: "start" }); }));
    done();
  }
  function done() {
    const d = window.AuraMenuVoiceBridge?.getDraft();
    const ok = { businessSection: !!$("businessName")?.value.trim(), smartSection: !!d?.categories.some((c) => c.items.length), contentSection: !!d?.categories.some((c) => c.items.some((i) => i.name && i.price)), customizeSection: !!(extras.accent || extras.mode || extras.logo || extras.socials || extras.video), publishSection: !!$("slug")?.value.trim(), qrBuilder: false };
    nav.querySelectorAll("[data-step]").forEach((a) => a.classList.toggle("is-done", !!ok[a.dataset.step]));
    const n = Object.values(ok).filter(Boolean).length; const bar = $("stepProgress"); if (bar) bar.style.width = `${Math.round((n / (stepIds.length - 1)) * 100)}%`;
  }
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) nav.querySelectorAll("[data-step]").forEach((a) => a.classList.toggle("is-active", a.dataset.step === en.target.id)); }), { rootMargin: "-30% 0px -60% 0px" });
  stepIds.forEach((id) => io.observe($(id)));
  stepIds.slice(0, -1).forEach((id, i) => { const b = document.createElement("button"); b.type = "button"; b.className = "am-next"; b.dataset.bp = "next"; b.onclick = () => $(stepIds[i + 1]).scrollIntoView({ behavior: "smooth", block: "start" }); $(id).append(b); });
  form.addEventListener("input", done); form.addEventListener("click", () => setTimeout(done, 50));

  /* ── i18n for injected UI ──────────────────────────────────────────── */
  function applyText() { document.querySelectorAll("[data-bp]").forEach((el) => (el.textContent = t(el.dataset.bp))); renderNav(); }
  new MutationObserver(applyText).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  applyText();
})();
