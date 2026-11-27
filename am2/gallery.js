/* AuraMenu 2.0 — public design gallery: all 30 designs browsable without login; preview never redirects to Studio. */
(function () {
  "use strict";
  const { designs, collections } = window.AURAMENU_DESIGNS;
  const S = window.AuraSite;
  const copy = {
    tr: { title: "AuraMenu · Tasarım koleksiyonu", gKicker: "AuraMenu Koleksiyonu", gTitleA: "Lezzetini", gTitleB: "bul.", gLede: "30 gerçek menü tasarımı. Hepsini dene: kategorilere gir, ürün aç, sepeti doldur. Kayıt gerekmez.", gTotal: "tasarım", gStd: "standart", gPrem: "premium", gFeat: "özellik her tasarımda", fAll: "Tümü", gStdCap: "Standart", gPremCap: "Premium ★", count: "{n} tasarım", tryIt: "Canlı dene →", back: "Tüm tasarımlar", phone: "Telefon", wide: "Geniş", sideKicker: "Senin menün, senin kimliğin", want: "Bu tasarımı restoranın için ister misin?", wantText: "Bu tasarımı kendi yemeklerin, fotoğrafların, fiyatların ve renklerinle kullan.", wantBtn: "Bu tasarımı istiyorum", self: "Kendim özelleştireceğim", selfText: "Menü stüdyosunda ürünleri, fiyatları ve fotoğrafları sen düzenle.", help: "AuraDigital benim için hazırlasın", helpText: "Seçtiğin tasarım bilgisiyle talep gönder; biz kuralım.", safe: "Sadece önizleme. Tasarımları gezmekle hiçbir şey satın alınmaz veya yayınlanmaz.", standard: "Standart", premium: "Premium", planned: "planlandı",
      feats: ["Mobil uyumlu menü", "QR kod erişimi", "NFC uyumlu", "Kategoriler", "Ürün fotoğrafları", "Açıklama ve fiyat", "Ürün detayı", "WhatsApp sipariş", "Menüde arama", "Adres ve saatler", "Çoklu para birimi", "TR · EN · AR", "Tek açık/koyu düğme", "Google Haritalar yol tarifi", "Google yorum düğmesi", "Sosyal medya bağlantıları", "Malzeme ve alerjenler", "Stok durumu", "Yılan oyunu", "Fransızca"] },
    en: { title: "AuraMenu · The design collection", gKicker: "The AuraMenu Collection", gTitleA: "Find your", gTitleB: "flavour.", gLede: "30 real menu designs. Try every one: open categories, tap dishes, fill the order basket. No sign-up needed.", gTotal: "designs", gStd: "standard", gPrem: "premium", gFeat: "features in every design", fAll: "All", gStdCap: "Standard", gPremCap: "Premium ★", count: "{n} designs", tryIt: "Try it live →", back: "All designs", phone: "Phone", wide: "Wide", sideKicker: "Your menu, your identity", want: "Want this design for your restaurant?", wantText: "Use this exact design with your own dishes, photos, prices and colours.", wantBtn: "I want this design", self: "I'll customise it myself", selfText: "Edit dishes, prices and photos in the menu studio.", help: "AuraDigital builds it for me", helpText: "Send a request with this design; we set it up.", safe: "Preview only. Nothing is purchased or published by exploring designs.", standard: "Standard", premium: "Premium", planned: "planned",
      feats: ["Mobile-friendly menu", "QR code access", "NFC compatible", "Food categories", "Product photos", "Descriptions & prices", "Product details", "WhatsApp ordering", "Menu search", "Address & hours", "Multiple currencies", "TR · EN · AR", "One light/dark toggle", "Google Maps directions", "Google review button", "Social media links", "Ingredients & allergens", "Availability indicator", "Snake game", "French"] },
    ar: { title: "AuraMenu · مجموعة التصاميم", gKicker: "مجموعة AuraMenu", gTitleA: "اعثر على", gTitleB: "نكهتك.", gLede: "30 تصميماً حقيقياً للقوائم. جرّبها كلها: افتح الأقسام والأطباق واملأ سلة الطلب. دون تسجيل.", gTotal: "تصميماً", gStd: "قياسي", gPrem: "مميز", gFeat: "ميزة في كل تصميم", fAll: "الكل", gStdCap: "قياسي", gPremCap: "مميز ★", count: "{n} تصميماً", tryIt: "جرّبه مباشرة ←", back: "كل التصاميم", phone: "هاتف", wide: "عريض", sideKicker: "قائمتك، هويتك", want: "هل تريد هذا التصميم لمطعمك؟", wantText: "استخدم هذا التصميم مع أطباقك وصورك وأسعارك وألوانك.", wantBtn: "أريد هذا التصميم", self: "سأخصصه بنفسي", selfText: "عدّل الأطباق والأسعار والصور في استوديو القائمة.", help: "AuraDigital تجهزه لي", helpText: "أرسل طلباً بهذا التصميم وسنقوم بإعداده.", safe: "معاينة فقط. لا يتم شراء أو نشر أي شيء أثناء التصفح.", standard: "قياسي", premium: "مميز", planned: "مخطط",
      feats: ["قائمة متوافقة مع الهاتف", "الوصول عبر QR", "متوافق مع NFC", "أقسام الطعام", "صور المنتجات", "الوصف والأسعار", "تفاصيل المنتج", "الطلب عبر واتساب", "البحث في القائمة", "العنوان والساعات", "عملات متعددة", "تركي · إنجليزي · عربي", "زر فاتح/داكن واحد", "اتجاهات خرائط Google", "زر تقييم Google", "روابط التواصل", "المكونات والحساسية", "مؤشر التوفر", "لعبة الثعبان", "الفرنسية"] },
  };
  let filter = "all", coll = "", selected = null, trigger = null, pvLang = S.lang;
  const $ = (id) => document.getElementById(id);
  const tt = (k) => copy[S.lang][k] ?? copy.en[k];

  function chips() {
    $("collections").innerHTML = Object.entries(collections).map(([k, v]) => `<button class="am-chip" data-c="${k}" aria-pressed="${coll === k}">${v[S.lang] || v.en}</button>`).join("");
    document.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => { coll = coll === b.dataset.c ? "" : b.dataset.c; chips(); render(); }));
  }
  function render() {
    const list = designs.filter((d) => (filter === "all" || d.tier === filter) && (!coll || d.collection === coll));
    $("count").textContent = tt("count").replace("{n}", list.length);
    $("grid").innerHTML = list.map((d) => `<article class="am-design" data-reveal><button data-open="${d.id}" aria-label="${d.name}"><div class="am-design-frame"><img src="media/gallery-v3/${d.id}.webp" alt="${d.name} — ${d.restaurant.name}" loading="lazy" width="420" height="840"><span class="am-design-badge${d.tier === "premium" ? " is-premium" : ""}">${d.tier === "premium" ? "★ " + tt("premium") : tt("standard")}</span></div></button><div class="am-g-meta"><h3>${d.name}</h3><a class="am-g-try" href="#" data-open="${d.id}">${tt("tryIt")}</a></div><p>${collections[d.collection][S.lang] || collections[d.collection].en} · ${d.restaurant.name}</p></article>`).join("");
    document.querySelectorAll("[data-open]").forEach((b) => (b.onclick = (e) => { e.preventDefault(); open(b.dataset.open, b); }));
    requestAnimationFrame(() => document.querySelectorAll("#grid [data-reveal]").forEach((el) => el.classList.add("is-in")));
  }
  function load() {
    $("pv-frame").src = `menu-v2.html?design=${selected.id}&gallery=1&lang=${pvLang}`;
    $("pv-self").href = `builder.html?template=${selected.code || selected.id}&lang=${S.lang}`;
    $("pv-help").href = `https://auradigitalworks.com/contact?service=auramenu&template=${selected.code || selected.id}&lang=${S.lang}`;
    document.querySelectorAll("#pv-lang [data-l]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === pvLang)));
  }
  function feats() { $("pv-feats").innerHTML = tt("feats").map((f, i) => `<li${i === 19 ? ' class="is-planned"' : ""}>${f}${i === 19 ? ` (${tt("planned")})` : ""}</li>`).join(""); }
  function open(id, btn) {
    selected = designs.find((d) => d.id === id); if (!selected) return; trigger = btn; pvLang = S.lang;
    $("pv-name").textContent = `${selected.name}${selected.tier === "premium" ? " ★" : ""}`; $("pv-choices").hidden = true; $("pv-want").hidden = false;
    feats(); load(); $("preview").showModal();
    const u = new URL(location.href); u.searchParams.set("template", id); history.replaceState(null, "", u);
  }
  $("pv-back").onclick = () => $("preview").close();
  $("preview").addEventListener("close", () => { $("pv-frame").removeAttribute("src"); trigger?.focus({ preventScroll: true }); const u = new URL(location.href); u.searchParams.delete("template"); history.replaceState(null, "", u); });
  $("pv-want").onclick = () => { $("pv-choices").hidden = false; $("pv-want").hidden = true; $("pv-self").focus(); };
  const wide = (v) => { $("pv-viewport").classList.toggle("is-wide", v); $("pv-phone").setAttribute("aria-pressed", String(!v)); $("pv-wide").setAttribute("aria-pressed", String(v)); };
  $("pv-phone").onclick = () => wide(false); $("pv-wide").onclick = () => wide(true);
  document.querySelectorAll("#pv-lang [data-l]").forEach((b) => (b.onclick = () => { pvLang = b.dataset.l; load(); }));
  document.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { filter = b.dataset.f; document.querySelectorAll("[data-f]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); render(); }));
  S.init(copy); S.onLang(() => { chips(); render(); if (selected && $("preview").open) feats(); });
  chips(); render();
  const initial = new URLSearchParams(location.search).get("template");
  if (initial && designs.some((d) => d.id === initial)) open(initial, null);
})();
