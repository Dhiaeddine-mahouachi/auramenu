/* AuraMenu Studio — manage a menu after login.
   Real mode: existing AuraMenu API (claim + GET/PATCH /dashboard/:id, shared AuraDigital session).
   Demo mode (?demo=1): sample restaurant, saved only in this browser. */
(function () {
  "use strict";
  const S = window.AuraSite, { designs, byId } = window.AURAMENU_DESIGNS;
  const API = window.AURA_MENU_CONFIG?.apiBase || "/api/auramenu";
  const ACCOUNT = "/api/aurapops/account";
  const params = new URLSearchParams(location.search);
  const DEMO = params.get("demo") === "1";
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const ALLERGENS = ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"];

  const copy = {
    tr: { title: "AuraMenu Studio", tOverview: "Genel bakış", tMenu: "Menüm", tDesign: "Tasarım", tInfo: "Bilgiler & saatler", tMedia: "Video", tQr: "QR & NFC", tPlan: "Plan & ödeme", logout: "Çıkış", openMenu: "Menüyü aç ↗", save: "Kaydet", live: "Canlı önizleme", hello: "Selam şef!", saved: "Kaydedildi ✓", savedDemo: "Demo: bu tarayıcıya kaydedildi ✓", unsaved: "Kaydedilmemiş değişiklikler var", demoBanner: "Demo Studio · Değişiklikler sadece bu tarayıcıda saklanır, hiçbir şey yayınlanmaz.", locked: "Düzenleme şu an kapalı: planını yenilediğinde tekrar açılır. Değişiklikleri yine de önizleyebilirsin.", noMenu: "Bu hesapta açık bir menü bulunamadı.", noMenuText: "Menü bağlantındaki numarayla aç veya yeni bir menü oluştur.", menuId: "Menü numarası", openId: "Aç", create: "Yeni menü oluştur", errLoad: "Menü yüklenemedi. Bağlantını kontrol et.", errSave: "Kaydedilemedi: ", status: { live: "Yayında", pending: "Onay bekliyor", draft: "Taslak", demo: "Demo" },
      ovTitle: "Bugün menünde neler var?", ovItems: "ürün", ovCats: "kategori", ovSold: "tükendi", ovDesign: "tasarım", ovUrl: "Menü adresin", copy: "Kopyala", copied: "Kopyalandı", quick: "Hızlı işlemler", qPrice: "Fiyat güncelle", qSold: "Tükendi işaretle", qDesign: "Tasarımı değiştir", qQr: "QR indir",
      cat: "Kategori", addCat: "+ Kategori ekle", addItem: "+ Ürün ekle", name: "Ad", desc: "Açıklama", price: "Fiyat", photo: "Fotoğraf bağlantısı (https)", video: "Video bağlantısı (mp4, isteğe bağlı)", ingredients: "İçindekiler", allergens: "Alerjenler", avail: "Durum", aOn: "Mevcut", aLow: "Az kaldı", aOut: "Tükendi", featured: "Şefin seçimi", remove: "Sil", up: "Yukarı", down: "Aşağı", icon: "Simge",
      dTitle: "Lezzetini seç", dText: "Tasarımı değiştirdiğinde ürünlerin, fiyatların ve QR kodun aynı kalır.", current: "Seçili",
      iBiz: "İşletme", bizName: "İşletme adı", tagline: "Kısa slogan", address: "Adres", maps: "Google Haritalar bağlantısı (isteğe bağlı)", review: "Google yorum bağlantısı", wa: "WhatsApp numarası", phone: "Telefon", currency: "Ana para birimi", hours: "Çalışma saatleri", closed: "Kapalı", socials: "Sosyal medya", days: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
      mTitle: "Menü videosu", mText: "Menünün üstünde küçük bir video gösterilir (dikey, 5–15 sn, mp4). Sessiz başlar, misafir sesi açabilir.", vSrc: "Video bağlantısı (https …mp4)", vPoster: "Kapak görseli (isteğe bağlı)", vTitle: "Video başlığı", vRemove: "Videoyu kaldır",
      qTitle: "QR kodun", qText: "Bu QR hep aynı adresi açar. Menünü güncellesen de yeniden basman gerekmez.", qDownload: "PNG indir", nfcTitle: "NFC kart", nfcText: "AuraDigital NFC kartın bu adresi açacak şekilde programlanır. Masaya koy, misafir telefonunu dokundursun.", nfcBtn: "NFC kart iste",
      pTitle: "Planın", pPaid: "Ödenen dönem sonu", pStatus: "Ödeme ve yenileme", pDetails: "Ödeme detaylarını gör", pNoData: "Plan bilgisi demo modunda gösterilmez." },
    en: { title: "AuraMenu Studio", tOverview: "Overview", tMenu: "My menu", tDesign: "Design", tInfo: "Info & hours", tMedia: "Video", tQr: "QR & NFC", tPlan: "Plan & payment", logout: "Log out", openMenu: "Open menu ↗", save: "Save", live: "Live preview", hello: "Hey, chef!", saved: "Saved ✓", savedDemo: "Demo: saved in this browser ✓", unsaved: "You have unsaved changes", demoBanner: "Demo Studio · Changes stay in this browser only; nothing is published.", locked: "Editing is closed right now: it reopens when your plan is renewed. You can still preview changes.", noMenu: "No open menu found on this account.", noMenuText: "Open it with the number from your menu link, or create a new menu.", menuId: "Menu number", openId: "Open", create: "Create a new menu", errLoad: "Couldn't load the menu. Check your connection.", errSave: "Couldn't save: ", status: { live: "Live", pending: "Awaiting approval", draft: "Draft", demo: "Demo" },
      ovTitle: "What's on your menu today?", ovItems: "dishes", ovCats: "categories", ovSold: "sold out", ovDesign: "design", ovUrl: "Your menu address", copy: "Copy", copied: "Copied", quick: "Quick actions", qPrice: "Update prices", qSold: "Mark sold out", qDesign: "Change design", qQr: "Download QR",
      cat: "Category", addCat: "+ Add category", addItem: "+ Add dish", name: "Name", desc: "Description", price: "Price", photo: "Photo link (https)", video: "Video link (mp4, optional)", ingredients: "Ingredients", allergens: "Allergens", avail: "Status", aOn: "Available", aLow: "Few left", aOut: "Sold out", featured: "Chef's pick", remove: "Delete", up: "Up", down: "Down", icon: "Icon",
      dTitle: "Find your flavour", dText: "Switching design keeps your dishes, prices and QR code exactly the same.", current: "Selected",
      iBiz: "Business", bizName: "Business name", tagline: "Short tagline", address: "Address", maps: "Google Maps link (optional)", review: "Google review link", wa: "WhatsApp number", phone: "Phone", currency: "Main currency", hours: "Opening hours", closed: "Closed", socials: "Social media", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      mTitle: "Menu video", mText: "A small video shows at the top of your menu (vertical, 5–15 s, mp4). It starts muted; guests can turn sound on.", vSrc: "Video link (https …mp4)", vPoster: "Cover image (optional)", vTitle: "Video title", vRemove: "Remove video",
      qTitle: "Your QR code", qText: "This QR always opens the same address, so you never reprint it when the menu changes.", qDownload: "Download PNG", nfcTitle: "NFC card", nfcText: "Your AuraDigital NFC card is programmed with this address. Put it on the table; guests tap their phone.", nfcBtn: "Request an NFC card",
      pTitle: "Your plan", pPaid: "Paid until", pStatus: "Payment and renewal", pDetails: "See payment details", pNoData: "Plan details aren't shown in demo mode." },
    ar: { title: "استوديو AuraMenu", tOverview: "نظرة عامة", tMenu: "قائمتي", tDesign: "التصميم", tInfo: "المعلومات والساعات", tMedia: "الفيديو", tQr: "QR وNFC", tPlan: "الخطة والدفع", logout: "خروج", openMenu: "افتح القائمة ↗", save: "حفظ", live: "معاينة مباشرة", hello: "أهلاً يا شيف!", saved: "تم الحفظ ✓", savedDemo: "تجريبي: حُفظ في هذا المتصفح ✓", unsaved: "لديك تغييرات غير محفوظة", demoBanner: "استوديو تجريبي · تبقى التغييرات في هذا المتصفح فقط ولا يُنشر شيء.", locked: "التعديل مغلق الآن ويُفتح عند تجديد خطتك. يمكنك معاينة التغييرات.", noMenu: "لم يتم العثور على قائمة في هذا الحساب.", noMenuText: "افتحها بالرقم الموجود في رابط قائمتك أو أنشئ قائمة جديدة.", menuId: "رقم القائمة", openId: "فتح", create: "أنشئ قائمة جديدة", errLoad: "تعذر تحميل القائمة. تحقق من الاتصال.", errSave: "تعذر الحفظ: ", status: { live: "منشورة", pending: "بانتظار الموافقة", draft: "مسودة", demo: "تجريبي" },
      ovTitle: "ماذا في قائمتك اليوم؟", ovItems: "طبق", ovCats: "قسم", ovSold: "نفد", ovDesign: "التصميم", ovUrl: "عنوان قائمتك", copy: "نسخ", copied: "تم النسخ", quick: "إجراءات سريعة", qPrice: "تحديث الأسعار", qSold: "تعليم كنافد", qDesign: "تغيير التصميم", qQr: "تنزيل QR",
      cat: "القسم", addCat: "+ أضف قسماً", addItem: "+ أضف طبقاً", name: "الاسم", desc: "الوصف", price: "السعر", photo: "رابط الصورة (https)", video: "رابط فيديو (mp4، اختياري)", ingredients: "المكونات", allergens: "مسببات الحساسية", avail: "الحالة", aOn: "متوفر", aLow: "كمية قليلة", aOut: "نفد", featured: "اختيار الشيف", remove: "حذف", up: "أعلى", down: "أسفل", icon: "رمز",
      dTitle: "اختر نكهتك", dText: "تغيير التصميم يُبقي أطباقك وأسعارك ورمز QR كما هي.", current: "المختار",
      iBiz: "المطعم", bizName: "اسم المطعم", tagline: "شعار قصير", address: "العنوان", maps: "رابط خرائط Google (اختياري)", review: "رابط تقييم Google", wa: "رقم واتساب", phone: "الهاتف", currency: "العملة الأساسية", hours: "ساعات العمل", closed: "مغلق", socials: "التواصل الاجتماعي", days: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
      mTitle: "فيديو القائمة", mText: "يظهر فيديو صغير أعلى قائمتك (عمودي، 5–15 ثانية، mp4). يبدأ بلا صوت ويمكن للضيف تشغيله.", vSrc: "رابط الفيديو (https …mp4)", vPoster: "صورة الغلاف (اختياري)", vTitle: "عنوان الفيديو", vRemove: "إزالة الفيديو",
      qTitle: "رمز QR الخاص بك", qText: "هذا الرمز يفتح العنوان نفسه دائماً، فلا حاجة لإعادة الطباعة عند تعديل القائمة.", qDownload: "تنزيل PNG", nfcTitle: "بطاقة NFC", nfcText: "تُبرمج بطاقة NFC من AuraDigital على هذا العنوان. ضعها على الطاولة ليلمسها الضيف بهاتفه.", nfcBtn: "اطلب بطاقة NFC",
      pTitle: "خطتك", pPaid: "مدفوعة حتى", pStatus: "الدفع والتجديد", pDetails: "عرض تفاصيل الدفع", pNoData: "لا تظهر تفاصيل الخطة في الوضع التجريبي." },
  };
  const t = (k) => copy[S.lang]?.[k] ?? copy.en[k];

  let menu = null, token = "", tab = "overview", dirty = false, frameReady = false, canEdit = true;

  /* ── API adapters (AuraDigital: restaurant/design presentation + item metadata) ── */
  const DAYS_RE = /\b(mon|tue|wed|thu|fri|sat|sun)\s+(\d{1,2}:\d{2}-\d{1,2}:\d{2}|closed)/gi;
  function fromServer(m) {
    const r = m.restaurant || {}, d = m.design || {}, l = r.links || {};
    const hours = {}; let x, n = 0; DAYS_RE.lastIndex = 0; while ((x = DAYS_RE.exec(m.openingHours || ""))) { n++; hours[x[1].toLowerCase()] = x[2] === "closed" ? "" : x[2]; }
    if (r.hours && typeof r.hours === "object") { Object.assign(hours, r.hours); n = 7; }
    const isVideo = (u) => /\.(mp4|webm|m4v)(\?|$)/i.test(String(u || ""));
    return { ...m, templateId: window.AURAMENU_V2?.code(m.templateId) || m.templateId, hours: n >= 3 ? hours : {}, socials: { instagram: l.instagram || "", tiktok: l.tiktok || "", facebook: l.facebook || "" }, reviewUrl: l.review || "", mapsUrl: l.directions || "", logo: r.logo || "", video: r.video?.src ? { src: r.video.src, poster: r.video.poster || "", title: "" } : { src: isVideo(d.cover) ? d.cover : "", poster: "", title: "" }, accent: d.accent || "",
      categories: (m.categories || []).map((c) => ({ ...c, items: (c.items || []).map((i) => ({ ...i, available: i.available === "limited" ? "limited" : i.available !== false, allergens: (i.allergens || []).map((a) => (typeof a === "object" ? a.en || a.tr || "" : String(a)).toLowerCase()), ingredients: Array.isArray(i.ingredients) ? i.ingredients.map((v) => (typeof v === "object" ? v.tr || v.en || "" : v)).join(", ") : i.ingredients || "", featured: Boolean(i.featured || i.bestseller) })) })) };
  }
  function toServer(m) {
    const hoursText = DAYS.some((d) => m.hours?.[d] !== undefined) ? DAYS.map((d) => `${d} ${m.hours?.[d] || "closed"}`).join("; ") : m.openingHours || "";
    const links = Object.fromEntries([["instagram", m.socials?.instagram], ["tiktok", m.socials?.tiktok], ["facebook", m.socials?.facebook], ["review", m.reviewUrl], ["directions", m.mapsUrl]].filter(([, v]) => /^https:\/\//i.test(v || "")));
    const design = { ...(m.design || {}) };
    if (/^https:\/\/\S+\.(mp4|webm|m4v)(\?|$)/i.test(m.video?.src || "")) design.cover = m.video.src; else if (/\.(mp4|webm|m4v)/i.test(design.cover || "")) delete design.cover;
    if (/^#[0-9a-f]{6}$/i.test(m.accent || "")) { design.accent = m.accent; design.primary = m.accent; }
    const { hours, socials, reviewUrl, mapsUrl, video, accent, ...rest } = m;
    return { ...rest, openingHours: hoursText.slice(0, 220), restaurant: { ...(m.restaurant || {}), links, ...(/^https:\/\//i.test(m.logo || "") ? { logo: m.logo } : {}), ...(DAYS.some((d) => m.hours?.[d] !== undefined) ? { hours: Object.fromEntries(DAYS.map((d) => [d, m.hours?.[d] || ""])) } : {}), ...(/^https:\/\/\S+\.(mp4|webm|m4v)(\?|$)/i.test(m.video?.src || "") ? { video: { src: m.video.src, ...(/^https:\/\//i.test(m.video.poster || "") ? { poster: m.video.poster } : {}) } } : {}) }, design,
      categories: m.categories.map((c) => ({ ...c, items: c.items.map(({ video: _v, ...i }) => ({ ...i, available: i.available === "limited" ? "limited" : i.available !== false, bestseller: Boolean(i.featured), allergens: (i.allergens || []).slice(0, 20), ingredients: String(i.ingredients || "").split(",").map((v) => v.trim()).filter(Boolean).slice(0, 20) })) })) };
  }

  /* ── Data loading ──────────────────────────────────────────────────── */
  function demoMenu() {
    const saved = (() => { try { return JSON.parse(localStorage.getItem("am2-studio-demo") || "null"); } catch { return null; } })();
    if (saved) return saved;
    const d = byId.sofra, D = window.AURAMENU_DEMO, tr = (v) => (v && typeof v === "object" ? v.tr || v.en : v || "");
    return { id: "demo", slug: "sofra-ocakbasi", status: "demo", templateId: "std-01", businessName: d.restaurant.name, tagline: tr(d.restaurant.tagline), address: "Örnek Mah. Lezzet Sok. No: 7, Fatih / İstanbul", whatsapp: "905555555555", phone: "+90 555 555 55 55", currency: "TRY", menuLanguage: "tr",
      hours: { ...D.base.hours }, socials: { ...D.base.socials }, reviewUrl: "", mapsUrl: "", video: { src: "media/video/grill.mp4", poster: "media/video/grill-poster.jpg", title: "" },
      categories: D.sets.grill.map((c) => ({ name: tr(c.name), emoji: c.icon, items: c.items.map((i) => ({ name: tr(i.name), description: tr(i.desc), price: String(i.price), imageUrl: i.img, featured: (i.tags || []).includes("chef"), available: i.available ?? true, allergens: [...(i.allergens || [])], ingredients: tr(i.ingredients), video: "" })) })) };
  }
  async function req(path, opt = {}) {
    const headers = { "Content-Type": "application/json", ...(token ? { "X-Aura-Menu-Token": token } : {}) };
    const r = await fetch(API + path, { ...opt, headers, credentials: "same-origin" }); const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`); return d;
  }
  async function load() {
    window.AuraMascot?.set(document.querySelector(".st-mascot"), "loading", 1400);
    if (DEMO) { menu = demoMenu(); $("banner").hidden = false; $("banner").textContent = t("demoBanner"); return boot(); }
    try {
      const mr = await fetch("/api/auramenu/account/session", { cache: "no-store", credentials: "same-origin" }).catch(() => null); const msess = mr && mr.ok ? await mr.json().catch(() => ({})) : {};
      const sr = msess.user ? null : await fetch(ACCOUNT + "/session", { cache: "no-store", credentials: "same-origin" }); const sess = msess.user ? msess : await sr.json().catch(() => ({}));
      if (!sess.user?.emailVerified) { location.replace(`/signin.html?lang=${S.lang}&next=${encodeURIComponent("studio.html" + location.search)}`); return; }
      $("hello").textContent = `${t("hello")} ${sess.user.name ? "· " + sess.user.name : ""}`;
    } catch { return showError(t("errLoad")); }
    const id = params.get("id") || localStorage.getItem("auraMenuLastRequest") || "";
    if (!id) return showNoMenu();
    try {
      const key = `auraMenuDashboardToken:${id}`;
      const c = await req(`/dashboard/${encodeURIComponent(id)}/claim`, { method: "POST", body: JSON.stringify({ existingToken: localStorage.getItem(key) || "" }) }).catch(() => null);
      if (c?.token) { token = c.token; localStorage.setItem(key, token); }
      const data = await req(`/dashboard/${encodeURIComponent(id)}`);
      menu = fromServer(data.menu || data); localStorage.setItem("auraMenuLastRequest", id);
      canEdit = Boolean(menu.editAccess?.active || menu.billing?.active);
      if (!canEdit) { $("banner").hidden = false; $("banner").textContent = t("locked"); }
      boot();
    } catch { showNoMenu(); }
  }
  function showError(m) { $("panel").innerHTML = `<div class="st-card"><h2>${esc(m)}</h2></div>`; }
  function showNoMenu() {
    setTimeout(() => window.AuraMascot?.all(), 0);
    $("panel").innerHTML = `<div class="st-card st-empty"><span data-mascot="sleep"></span><h2>${t("noMenu")}</h2><p>${t("noMenuText")}</p><form id="idForm" class="st-row"><label class="am-field"><span>${t("menuId")}</span><input id="idIn" required></label><button class="am-btn am-btn--brand">${t("openId")}</button></form><a class="am-btn am-btn--ghost" href="builder.html?lang=${S.lang}">${t("create")}</a></div>`;
    $("idForm").onsubmit = (e) => { e.preventDefault(); location.href = `studio.html?id=${encodeURIComponent($("idIn").value.trim())}&lang=${S.lang}`; };
  }

  /* ── Preview (same render contract as builder.js) ──────────────────── */
  function engineMenu() {
    return { ...menu, theme: menu.accent ? { accent: menu.accent } : menu.theme, menuLanguage: S.lang, categories: menu.categories.map((c) => ({ name: c.name, emoji: c.emoji, items: c.items.map((i) => ({ ...i, tags: [...(i.featured ? ["chef"] : [])] })) })) };
  }
  function loadFrame() { frameReady = false; $("preview").src = `menu-v2.html?design=${encodeURIComponent(byId[menu.templateId] ? menu.templateId : "std-01")}&embedded=1`; $("designName").textContent = byId[menu.templateId]?.name || menu.templateId; }
  let pt; function push() { clearTimeout(pt); pt = setTimeout(() => frameReady && $("preview").contentWindow?.postMessage({ type: "auramenu:render", menu: engineMenu(), draft: true }, location.origin === "null" ? "*" : location.origin), 80); }
  window.addEventListener("message", (e) => { if (e.source === $("preview").contentWindow && e.data?.type === "auramenu:template-ready") { frameReady = true; push(); } });

  /* ── Tabs ──────────────────────────────────────────────────────────── */
  const field = (label, key, val, type = "text", extra = "") => `<label class="am-field"><span>${label}</span><input type="${type}" data-k="${key}" value="${esc(val)}" ${extra}></label>`;
  const views = {
    overview() {
      const items = menu.categories.flatMap((c) => c.items), sold = items.filter((i) => i.available === false).length;
      const url = `auramenu.space/${menu.slug || ""}`;
      return `<div class="st-card st-hero"><h2>${t("ovTitle")}</h2><div class="st-stats"><div><b>${items.length}</b><span>${t("ovItems")}</span></div><div><b>${menu.categories.length}</b><span>${t("ovCats")}</span></div><div><b>${sold}</b><span>${t("ovSold")}</span></div><div><b>${esc(byId[menu.templateId]?.name || "—")}</b><span>${t("ovDesign")}</span></div></div></div>
        <div class="st-card"><h3>${t("ovUrl")}</h3><div class="st-url"><code>${esc(url)}</code><button class="am-btn am-btn--sm" data-copy="https://${esc(url)}">${t("copy")}</button></div></div>
        <div class="st-card"><h3>${t("quick")}</h3><div class="st-quick"><button data-go="menu">✏️ ${t("qPrice")}</button><button data-go="menu">🚫 ${t("qSold")}</button><button data-go="design">🎨 ${t("qDesign")}</button><button data-go="qr">🔳 ${t("qQr")}</button></div></div>`;
    },
    menu() {
      return menu.categories.map((c, ci) => `<section class="st-card st-cat"><div class="st-cat-head"><input class="st-emoji" data-c="${ci}" data-ck="emoji" value="${esc(c.emoji || "🍽️")}" aria-label="${t("icon")}" maxlength="4"><input class="st-cat-name" data-c="${ci}" data-ck="name" value="${esc(c.name)}" aria-label="${t("cat")}"><button class="st-ico" data-cmove="${ci}:-1" aria-label="${t("up")}">↑</button><button class="st-ico" data-cmove="${ci}:1" aria-label="${t("down")}">↓</button><button class="st-ico st-del" data-cdel="${ci}" aria-label="${t("remove")}">✕</button></div>
        ${c.items.map((it, ii) => `<details class="st-item"${ii === 0 && ci === 0 ? " open" : ""}><summary>${it.imageUrl ? `<img src="${esc(it.imageUrl)}" alt="" loading="lazy">` : `<span class="st-noimg">${esc(c.emoji || "🍽️")}</span>`}<b>${esc(it.name || "—")}</b><span class="st-av st-av--${it.available === false ? "out" : it.available === "limited" ? "low" : "on"}"></span><em>${esc(it.price)} ${esc(menu.currency || "TRY")}</em></summary>
          <div class="st-item-grid">${["name", "price"].map((k) => `<label class="am-field"><span>${t(k)}</span><input data-c="${ci}" data-i="${ii}" data-ik="${k}" value="${esc(it[k])}" ${k === "price" ? 'inputmode="decimal"' : ""}></label>`).join("")}
          <label class="am-field st-wide"><span>${t("desc")}</span><textarea rows="2" data-c="${ci}" data-i="${ii}" data-ik="description">${esc(it.description)}</textarea></label>
          <label class="am-field st-wide"><span>${t("ingredients")}</span><input data-c="${ci}" data-i="${ii}" data-ik="ingredients" value="${esc(it.ingredients)}"></label>
          <label class="am-field"><span>${t("photo")}</span><input type="url" data-c="${ci}" data-i="${ii}" data-ik="imageUrl" value="${esc(it.imageUrl)}"></label>
          <label class="am-field"><span>${t("video")}</span><input type="url" data-c="${ci}" data-i="${ii}" data-ik="video" value="${esc(it.video)}"></label>
          <fieldset class="st-wide st-seg"><legend>${t("avail")}</legend>${[[true, "aOn"], ["limited", "aLow"], [false, "aOut"]].map(([v, k]) => `<label><input type="radio" name="av-${ci}-${ii}" data-c="${ci}" data-i="${ii}" data-av="${v}" ${String(it.available ?? true) === String(v) ? "checked" : ""}><span>${t(k)}</span></label>`).join("")}<label class="st-feat"><input type="checkbox" data-c="${ci}" data-i="${ii}" data-feat ${it.featured ? "checked" : ""}><span>⭐ ${t("featured")}</span></label></fieldset>
          <fieldset class="st-wide st-al"><legend>${t("allergens")}</legend>${ALLERGENS.map((a) => `<label><input type="checkbox" data-c="${ci}" data-i="${ii}" data-al="${a}" ${(it.allergens || []).includes(a) ? "checked" : ""}><span>${a}</span></label>`).join("")}</fieldset>
          <div class="st-wide st-item-actions"><button class="st-ico" data-imove="${ci}:${ii}:-1">↑</button><button class="st-ico" data-imove="${ci}:${ii}:1">↓</button><button class="am-btn am-btn--sm am-btn--ghost st-del" data-idel="${ci}:${ii}">${t("remove")}</button></div></div></details>`).join("")}
        <button class="st-add" data-iadd="${ci}">${t("addItem")}</button></section>`).join("") + `<button class="am-btn am-btn--ghost" data-cadd style="width:100%">${t("addCat")}</button>`;
    },
    design() {
      return `<div class="st-card"><h2>${t("dTitle")}</h2><p class="st-muted">${t("dText")}</p><div class="st-designs">${designs.map((d) => `<button class="st-design${d.code === menu.templateId ? " is-on" : ""}" data-design="${d.code}"><img src="media/gallery-v3/${d.id}.webp" alt="" loading="lazy"><span>${esc(d.name)}${d.tier === "premium" ? " ★" : ""}</span>${d.code === menu.templateId ? `<em>${t("current")}</em>` : ""}</button>`).join("")}</div></div>`;
    },
    info() {
      const h = menu.hours || {}, s = menu.socials || {};
      return `<div class="st-card"><h3>${t("iBiz")}</h3><div class="st-grid">${field(t("bizName"), "businessName", menu.businessName)}${field(t("tagline"), "tagline", menu.tagline)}${field(t("address"), "address", menu.address)}${field(t("maps"), "mapsUrl", menu.mapsUrl, "url")}${field(t("review"), "reviewUrl", menu.reviewUrl, "url")}${field(t("wa"), "whatsapp", menu.whatsapp, "tel")}${field(t("phone"), "phone", menu.phone, "tel")}<label class="am-field"><span>🎨</span><input type="color" data-k="accent" value="${esc(menu.accent || (byId[menu.templateId]?.accent) || "#6E2037")}"></label><label class="am-field"><span>${t("currency")}</span><select data-k="currency">${["TRY", "USD", "EUR", "TND"].map((c) => `<option ${c === menu.currency ? "selected" : ""}>${c}</option>`).join("")}</select></label></div></div>
        <div class="st-card"><h3>${t("hours")}</h3><div class="st-hours">${DAYS.map((d, i) => { const [a, b] = (h[d] || "").split("-"); return `<div class="st-hour"><b>${t("days")[i]}</b><input type="time" data-h="${d}" data-p="0" value="${esc(a || "")}"><span>–</span><input type="time" data-h="${d}" data-p="1" value="${esc(b || "")}"><label class="am-check"><input type="checkbox" data-hclosed="${d}" ${h[d] ? "" : "checked"}> ${t("closed")}</label></div>`; }).join("")}</div></div>
        <div class="st-card"><h3>${t("socials")}</h3><div class="st-grid">${["instagram", "tiktok", "facebook"].map((k) => `<label class="am-field"><span>${k[0].toUpperCase() + k.slice(1)}</span><input type="url" data-s="${k}" value="${esc(s[k] || "")}"></label>`).join("")}</div></div>`;
    },
    media() {
      const v = menu.video || {};
      return `<div class="st-card"><h2>🎬 ${t("mTitle")}</h2><p class="st-muted">${t("mText")}</p><div class="st-grid">${field(t("vSrc"), "video.src", v.src, "url")}${field(t("vPoster"), "video.poster", v.poster, "url")}${field(t("vTitle"), "video.title", v.title)}</div>${v.src ? `<video class="st-vid" src="${esc(v.src)}" muted loop playsinline autoplay></video>` : ""}<button class="am-btn am-btn--sm am-btn--ghost" data-vremove>${t("vRemove")}</button></div>`;
    },
    qr() {
      return `<div class="st-card st-qr"><div><h2>${t("qTitle")}</h2><p class="st-muted">${t("qText")}</p><button class="am-btn am-btn--brand" data-qrdl>${t("qDownload")}</button></div><div class="st-qrbox"><div id="qrBox"></div><b>${esc(menu.businessName)}</b><small>auramenu.space/${esc(menu.slug || "")}</small></div></div>
        <div class="st-card"><h3>📶 ${t("nfcTitle")}</h3><p class="st-muted">${t("nfcText")}</p><a class="am-btn am-btn--ghost" href="https://auradigitalworks.com/nfc" target="_blank" rel="noopener">${t("nfcBtn")}</a></div>`;
    },
    plan() {
      if (DEMO || !menu.billing) return `<div class="st-card"><h2>${t("pTitle")}</h2><p class="st-muted">${t("pNoData")}</p></div>`;
      const b = menu.billing;
      return `<div class="st-card"><h2>${t("pTitle")}</h2><div class="st-stats"><div><b>${esc(b.planName || "—")}</b><span>${esc(b.amount || "")} TL</span></div><div><b>${b.paidUntil ? new Date(b.paidUntil).toLocaleDateString(S.lang) : "—"}</b><span>${t("pPaid")}</span></div></div><a class="am-btn am-btn--brand" href="status.html?id=${encodeURIComponent(menu.id)}&lang=${S.lang}">${t("pDetails")}</a></div>`;
    },
  };

  function render() {
    document.querySelectorAll("[data-tab]").forEach((b) => (b.dataset.tab === tab ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current")));
    $("panel").innerHTML = views[tab](); wire();
    $("bizName").textContent = menu.businessName || "AuraMenu";
    const st = DEMO ? "demo" : menu.status === "approved" || menu.billing?.active ? "live" : menu.status === "pending" ? "pending" : "draft";
    $("statusBadge").textContent = t("status")[st]; $("statusBadge").dataset.s = st;
    $("openMenu").href = DEMO ? `menu-v2.html?design=${menu.templateId}` : `https://auramenu.space/${menu.slug || ""}`;
    if (tab === "qr") drawQr();
  }
  const changed = () => { dirty = true; $("save").classList.add("is-dirty"); push(); };
  function wire() {
    const P = $("panel");
    P.querySelectorAll("[data-k]").forEach((el) => el.addEventListener("input", () => { const k = el.dataset.k; if (k.startsWith("video.")) { menu.video = menu.video || {}; menu.video[k.slice(6)] = el.value.trim(); } else menu[k] = el.value; if (k === "businessName") $("bizName").textContent = el.value; changed(); }));
    P.querySelectorAll("[data-s]").forEach((el) => el.addEventListener("input", () => { menu.socials = menu.socials || {}; menu.socials[el.dataset.s] = el.value.trim(); changed(); }));
    const hours = () => { menu.hours = menu.hours || {}; DAYS.forEach((d) => { const closed = P.querySelector(`[data-hclosed="${d}"]`).checked; const a = P.querySelector(`[data-h="${d}"][data-p="0"]`).value, b = P.querySelector(`[data-h="${d}"][data-p="1"]`).value; menu.hours[d] = closed || !a || !b ? "" : `${a}-${b}`; }); menu.openingHours = ""; changed(); };
    P.querySelectorAll("[data-h],[data-hclosed]").forEach((el) => el.addEventListener("change", hours));
    P.querySelectorAll("[data-ck]").forEach((el) => el.addEventListener("input", () => { menu.categories[el.dataset.c][el.dataset.ck] = el.value; changed(); }));
    P.querySelectorAll("[data-ik]").forEach((el) => el.addEventListener("input", () => { const it = menu.categories[el.dataset.c].items[el.dataset.i]; it[el.dataset.ik] = el.value; if (el.dataset.ik === "name") el.closest("details").querySelector("summary b").textContent = el.value || "—"; changed(); }));
    P.querySelectorAll("[data-av]").forEach((el) => el.addEventListener("change", () => { const v = el.dataset.av; menu.categories[el.dataset.c].items[el.dataset.i].available = v === "true" ? true : v === "false" ? false : "limited"; el.closest("details").querySelector(".st-av").className = `st-av st-av--${v === "false" ? "out" : v === "limited" ? "low" : "on"}`; changed(); }));
    P.querySelectorAll("[data-feat]").forEach((el) => el.addEventListener("change", () => { menu.categories[el.dataset.c].items[el.dataset.i].featured = el.checked; changed(); }));
    P.querySelectorAll("[data-al]").forEach((el) => el.addEventListener("change", () => { const it = menu.categories[el.dataset.c].items[el.dataset.i]; const s = new Set(it.allergens || []); el.checked ? s.add(el.dataset.al) : s.delete(el.dataset.al); it.allergens = [...s]; changed(); }));
    const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; };
    P.querySelectorAll("[data-cmove]").forEach((b) => (b.onclick = () => { const [c, d] = b.dataset.cmove.split(":").map(Number); move(menu.categories, c, d); changed(); render(); }));
    P.querySelectorAll("[data-imove]").forEach((b) => (b.onclick = () => { const [c, i, d] = b.dataset.imove.split(":").map(Number); move(menu.categories[c].items, i, d); changed(); render(); }));
    P.querySelectorAll("[data-cdel]").forEach((b) => (b.onclick = () => { if (confirm(`${t("remove")}: ${menu.categories[b.dataset.cdel].name}?`)) { menu.categories.splice(b.dataset.cdel, 1); changed(); render(); } }));
    P.querySelectorAll("[data-idel]").forEach((b) => (b.onclick = () => { const [c, i] = b.dataset.idel.split(":").map(Number); menu.categories[c].items.splice(i, 1); changed(); render(); }));
    P.querySelectorAll("[data-iadd]").forEach((b) => (b.onclick = () => { menu.categories[b.dataset.iadd].items.push({ name: "", description: "", price: "", imageUrl: "", available: true, allergens: [], ingredients: "", video: "" }); changed(); render(); const ds = b.parentElement.querySelectorAll("details"); ds[ds.length - 1].open = true; ds[ds.length - 1].querySelector("input").focus(); }));
    P.querySelector("[data-cadd]")?.addEventListener("click", () => { menu.categories.push({ name: t("cat"), emoji: "🍽️", items: [] }); changed(); render(); });
    P.querySelectorAll("[data-design]").forEach((b) => (b.onclick = () => { menu.templateId = b.dataset.design; changed(); loadFrame(); render(); }));
    P.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
    P.querySelectorAll("[data-copy]").forEach((b) => (b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.copy); toast(t("copied")); } catch {} }));
    P.querySelector("[data-vremove]")?.addEventListener("click", () => { menu.video = { src: "", poster: "", title: "" }; changed(); render(); });
    P.querySelector("[data-qrdl]")?.addEventListener("click", downloadQr);
  }
  function drawQr() {
    const draw = () => { const box = $("qrBox"); if (!box) return; box.innerHTML = ""; new window.QRCode(box, { text: `https://auramenu.space/${menu.slug || ""}`, width: 220, height: 220, colorDark: "#24191E", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.H }); };
    if (window.QRCode) draw(); else { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"; s.onload = draw; document.head.append(s); }
  }
  function downloadQr() {
    const src = $("qrBox")?.querySelector("canvas"); if (!src) return;
    const c = document.createElement("canvas"); c.width = 900; c.height = 1100; const x = c.getContext("2d");
    x.fillStyle = "#F8EFE2"; x.fillRect(0, 0, 900, 1100); x.fillStyle = "#6E2037"; x.beginPath(); x.roundRect(60, 60, 780, 980, 60); x.fill();
    x.fillStyle = "#fff"; x.beginPath(); x.roundRect(150, 250, 600, 600, 30); x.fill(); x.drawImage(src, 180, 280, 540, 540);
    x.fillStyle = "#F8EFE2"; x.textAlign = "center"; x.font = "800 54px 'Baloo 2', sans-serif"; x.fillText(menu.businessName || "AuraMenu", 450, 175);
    x.fillStyle = "#F5BD43"; x.font = "700 34px Inter, sans-serif"; x.fillText(`auramenu.space/${menu.slug || ""}`, 450, 940);
    const a = document.createElement("a"); a.download = `${menu.slug || "auramenu"}-qr.png`; a.href = c.toDataURL("image/png"); a.click();
  }
  function go(name) { tab = name; render(); document.body.classList.remove("is-nav"); $("panel").scrollTop = 0; window.scrollTo({ top: 0 }); }
  function toast(m) { const el = $("toast"); el.textContent = m; el.classList.add("is-on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("is-on"), 2600); }

  async function save() {
    if (DEMO) { try { localStorage.setItem("am2-studio-demo", JSON.stringify(menu)); } catch {} dirty = false; $("save").classList.remove("is-dirty"); return toast(t("savedDemo"), window.AuraMascot?.set(document.querySelector(".st-mascot"), "celebrate", 2600)); }
    if (!canEdit) return toast(t("locked"));
    $("save").disabled = true;
    try { const d = await req(`/dashboard/${encodeURIComponent(menu.id)}`, { method: "PATCH", body: JSON.stringify(toServer(menu)) }); if (d.menu) menu = fromServer({ ...toServer(menu), ...d.menu }); dirty = false; $("save").classList.remove("is-dirty"); toast(t("saved")); window.AuraMascot?.set(document.querySelector(".st-mascot"), "celebrate", 2600); }
    catch (e) { toast(t("errSave") + e.message); } finally { $("save").disabled = false; }
  }

  function boot() {
    menu.categories = menu.categories || []; menu.categories.forEach((c) => (c.items = c.items || []));
    if (!byId[menu.templateId]) menu.legacyTemplate = menu.templateId;
    loadFrame(); render();
  }
  S.init(copy); S.onLang(() => { if (menu) { render(); push(); } });
  document.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => go(b.dataset.tab)));
  $("save").onclick = save;
  $("burger").onclick = () => document.body.classList.toggle("is-nav");
  $("logout").onclick = async () => { if (!DEMO) { try { await Promise.all([fetch("/api/auramenu/account/logout", { method: "POST", credentials: "same-origin" }), fetch(ACCOUNT + "/logout", { method: "POST", credentials: "same-origin" })]); } catch {} } location.href = `/signin.html?lang=${S.lang}`; };
  addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); save(); } });
  load();
})();
