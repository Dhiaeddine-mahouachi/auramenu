/* AuraMenu 2.0 — shared menu engine.
   One engine renders all 25 designs with the same features:
   mobile menu · QR/NFC · categories · photos · descriptions & prices · product detail sheet ·
   WhatsApp ordering · search · address & hours · multiple currencies · TR/EN/AR FR ·
   single light/dark toggle · Google Maps directions · Google review · social links ·
   ingredients & allergens · availability · food-themed Snake game.
   Customer data (builder shape) or demo data are normalised into one model. */
(function () {
  "use strict";

  const D = window.AURAMENU_DESIGNS;
  const DEMO = window.AURAMENU_DEMO;
  const params = new URLSearchParams(location.search);
  const design = D.byId[params.get("design")] || D.designs[0];
  const embedded = params.get("embedded") === "1";
  const inGallery = params.get("gallery") === "1";
  const LANGS = ["tr", "en", "ar", "fr"];
  const PLANNED_LANGS = [];
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  /* ── UI copy ─────────────────────────────────────────────────────────── */
  const UI = {
    tr: { search: "Menüde ara", searchPh: "Yemek, içecek, malzeme…", noResults: "Sonuç bulunamadı.", clear: "Temizle", open: "Şu an açık", closed: "Şu an kapalı", closesAt: "Kapanış", opensAt: "Açılış", directions: "Yol tarifi", review: "Google'da yorum yap", call: "Ara", whatsapp: "WhatsApp", hours: "Çalışma saatleri", address: "Adres", follow: "Bizi takip edin", add: "Ekle", added: "Eklendi", soldOut: "Tükendi", limited: "Az kaldı", available: "Mevcut", ingredients: "İçindekiler", allergens: "Alerjenler", noAllergens: "Bilinen alerjen yok", order: "Siparişim", sendOrder: "WhatsApp ile gönder", total: "Toplam", empty: "Siparişiniz boş.", table: "Masa no / not (isteğe bağlı)", orderIntro: "Merhaba! Sipariş vermek istiyorum:", approx: "Yaklaşık tutar. Ödeme {base} ile yapılır.", currency: "Para birimi", language: "Dil", theme: "Açık / koyu görünüm", soon: "yakında", game: "Beklerken oyna", gameTitle: "Lezzet Yılanı", gameHint: "Ok tuşları veya kaydırma ile yönlendir. Yemekleri topla!", score: "Puan", best: "En iyi", restart: "Tekrar", close: "Kapat", scan: "Tara veya dokun", scanText: "Bu menü QR kodu ve NFC kart ile açılır. Bağlantı hep aynı kalır.", share: "QR / Paylaş", copy: "Bağlantıyı kopyala", copied: "Kopyalandı", demoOrder: "Demo menü: gerçek menünüzde bu sipariş doğrudan WhatsApp'ınıza gider.", powered: "AuraMenu ile hazırlandı", allergenNote: "Alerjen bilgisi işletme tarafından verilir. Emin değilseniz personele sorun.", info: "Bilgi", today: "Bugün", qty: "Adet", tags: { spicy: "Acı", veg: "Vejetaryen", chef: "Şefin seçimi", share: "Paylaşımlık", new: "Yeni" }, days: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"], want: "Bu tasarımı istiyorum", videoKicker: "Mutfaktan", videoTitle: "Bugün ocakta ne var?", videoSound: "Sesi aç/kapat", play: "Oynat/durdur", preparing: "Menü hazırlanıyor. Ürün ekledikçe burada görünecek.", demo: "Örnek menü", menu: "Menü" },
    en: { search: "Search the menu", searchPh: "Dish, drink, ingredient…", noResults: "No results found.", clear: "Clear", open: "Open now", closed: "Closed now", closesAt: "Closes", opensAt: "Opens", directions: "Directions", review: "Review us on Google", call: "Call", whatsapp: "WhatsApp", hours: "Opening hours", address: "Address", follow: "Follow us", add: "Add", added: "Added", soldOut: "Sold out", limited: "Few left", available: "Available", ingredients: "Ingredients", allergens: "Allergens", noAllergens: "No known allergens", order: "My order", sendOrder: "Send via WhatsApp", total: "Total", empty: "Your order is empty.", table: "Table no. / note (optional)", orderIntro: "Hello! I'd like to order:", approx: "Approximate. You pay in {base}.", currency: "Currency", language: "Language", theme: "Light / dark appearance", soon: "soon", game: "Play while you wait", gameTitle: "Snack Snake", gameHint: "Use arrow keys or swipe. Collect the food!", score: "Score", best: "Best", restart: "Restart", close: "Close", scan: "Scan or tap", scanText: "This menu opens from a QR code or an NFC card. The link never changes.", share: "QR / Share", copy: "Copy link", copied: "Copied", demoOrder: "Demo menu: in your real menu this order goes straight to your WhatsApp.", powered: "Made with AuraMenu", allergenNote: "Allergen information is provided by the restaurant. If unsure, please ask our staff.", info: "Info", today: "Today", qty: "Qty", tags: { spicy: "Spicy", veg: "Vegetarian", chef: "Chef's pick", share: "To share", new: "New" }, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], want: "I want this design", videoKicker: "From our kitchen", videoTitle: "What's cooking today?", videoSound: "Sound on/off", play: "Play/pause", preparing: "The menu is being prepared. Products appear here as you add them.", demo: "Sample menu", menu: "Menu" },
    fr: { search: "Rechercher dans le menu", searchPh: "Plat, boisson, ingrédient…", noResults: "Aucun résultat.", clear: "Effacer", open: "Ouvert", closed: "Fermé", closesAt: "Ferme à", opensAt: "Ouvre à", directions: "Itinéraire", review: "Laissez un avis Google", call: "Appeler", whatsapp: "WhatsApp", hours: "Horaires d'ouverture", address: "Adresse", follow: "Suivez-nous", add: "Ajouter", added: "Ajouté", soldOut: "Épuisé", limited: "Presque épuisé", available: "Disponible", ingredients: "Ingrédients", allergens: "Allergènes", noAllergens: "Aucun allergène connu", order: "Ma commande", sendOrder: "Envoyer sur WhatsApp", total: "Total", empty: "Votre commande est vide.", table: "N° de table / note (facultatif)", orderIntro: "Bonjour ! Je voudrais commander :", approx: "Montant approximatif. Paiement en {base}.", currency: "Devise", language: "Langue", theme: "Apparence claire / sombre", soon: "bientôt", game: "Jouez en attendant", gameTitle: "Serpent gourmand", gameHint: "Flèches du clavier ou glissez. Attrapez les plats !", score: "Score", best: "Record", restart: "Rejouer", close: "Fermer", scan: "Scannez ou touchez", scanText: "Ce menu s'ouvre avec un QR code ou une carte NFC. Le lien ne change jamais.", share: "QR / Partager", copy: "Copier le lien", copied: "Copié", demoOrder: "Menu de démonstration : sur votre vrai menu, la commande arrive directement sur votre WhatsApp.", powered: "Réalisé avec AuraMenu", allergenNote: "Les informations sur les allergènes sont fournies par le restaurant. En cas de doute, demandez à notre équipe.", info: "Infos", today: "Aujourd'hui", qty: "Qté", tags: { spicy: "Épicé", veg: "Végétarien", chef: "Choix du chef", share: "À partager", new: "Nouveau" }, days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], want: "Je veux ce design", videoKicker: "En cuisine", videoTitle: "Qu'est-ce qui mijote aujourd'hui ?", videoSound: "Son activé/désactivé", play: "Lecture/pause", preparing: "Le menu est en préparation. Les produits apparaîtront ici dès leur ajout.", demo: "Menu exemple", menu: "Menu" },
    ar: { search: "ابحث في القائمة", searchPh: "طبق، مشروب، مكوّن…", noResults: "لا توجد نتائج.", clear: "مسح", open: "مفتوح الآن", closed: "مغلق الآن", closesAt: "يغلق", opensAt: "يفتح", directions: "الاتجاهات", review: "قيّمنا على Google", call: "اتصال", whatsapp: "واتساب", hours: "ساعات العمل", address: "العنوان", follow: "تابعونا", add: "أضف", added: "أضيف", soldOut: "نفد", limited: "الكمية قليلة", available: "متوفر", ingredients: "المكونات", allergens: "مسببات الحساسية", noAllergens: "لا توجد مسببات حساسية معروفة", order: "طلبي", sendOrder: "أرسل عبر واتساب", total: "المجموع", empty: "طلبك فارغ.", table: "رقم الطاولة / ملاحظة (اختياري)", orderIntro: "مرحباً! أود أن أطلب:", approx: "قيمة تقريبية. الدفع بـ {base}.", currency: "العملة", language: "اللغة", theme: "الوضع الفاتح / الداكن", soon: "قريباً", game: "العب أثناء الانتظار", gameTitle: "ثعبان الوجبات", gameHint: "استخدم الأسهم أو اسحب. اجمع الطعام!", score: "النقاط", best: "الأفضل", restart: "إعادة", close: "إغلاق", scan: "امسح أو المس", scanText: "تُفتح هذه القائمة عبر رمز QR أو بطاقة NFC. الرابط لا يتغير.", share: "QR / مشاركة", copy: "نسخ الرابط", copied: "تم النسخ", demoOrder: "قائمة تجريبية: في قائمتك الحقيقية يصل هذا الطلب مباشرة إلى واتساب الخاص بك.", powered: "صُنعت بواسطة AuraMenu", allergenNote: "معلومات الحساسية مقدمة من المطعم. إذا لم تكن متأكداً، اسأل الموظفين.", info: "معلومات", today: "اليوم", qty: "الكمية", tags: { spicy: "حار", veg: "نباتي", chef: "اختيار الشيف", share: "للمشاركة", new: "جديد" }, days: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"], want: "أريد هذا التصميم", videoKicker: "من مطبخنا", videoTitle: "ماذا يُطهى اليوم؟", videoSound: "تشغيل/كتم الصوت", play: "تشغيل/إيقاف", preparing: "القائمة قيد التحضير. ستظهر المنتجات هنا عند إضافتها.", demo: "قائمة تجريبية", menu: "القائمة" },
  };
  const ALLERGENS = {
    gluten: { i: "🌾", tr: "Gluten", en: "Gluten", ar: "الغلوتين" }, crustaceans: { i: "🦐", tr: "Kabuklular", en: "Crustaceans", ar: "القشريات" },
    eggs: { i: "🥚", tr: "Yumurta", en: "Eggs", ar: "البيض" }, fish: { i: "🐟", tr: "Balık", en: "Fish", ar: "السمك" },
    peanuts: { i: "🥜", tr: "Yer fıstığı", en: "Peanuts", ar: "الفول السوداني" }, soy: { i: "🫘", tr: "Soya", en: "Soy", ar: "الصويا" },
    milk: { i: "🥛", tr: "Süt", en: "Milk", ar: "الحليب" }, nuts: { i: "🌰", tr: "Sert kabuklu", en: "Tree nuts", ar: "المكسرات" },
    celery: { i: "🥬", tr: "Kereviz", en: "Celery", ar: "الكرفس" }, mustard: { i: "🟡", tr: "Hardal", en: "Mustard", ar: "الخردل" },
    sesame: { i: "⚪", tr: "Susam", en: "Sesame", ar: "السمسم" }, sulphites: { i: "🍷", tr: "Sülfit", en: "Sulphites", ar: "الكبريتيت" },
    lupin: { i: "🌼", tr: "Acı bakla", en: "Lupin", ar: "الترمس" }, molluscs: { i: "🦪", tr: "Yumuşakçalar", en: "Molluscs", ar: "الرخويات" },
  };
  const CURRENCIES = { TRY: "₺", USD: "$", EUR: "€", TND: "DT" };
  const FALLBACK_RATES = { TRY: 1, USD: 0.024, EUR: 0.022, TND: 0.073 }; // per 1 TRY, used only when live rates are unavailable

  /* ── State ───────────────────────────────────────────────────────────── */
  const state = {
    lang: LANGS.includes(params.get("lang")) ? params.get("lang") : (LANGS.includes(store.get("auraMenuUiLanguage")) ? store.get("auraMenuUiLanguage") : "tr"),
    mode: params.get("theme") === "dark" || params.get("theme") === "light" ? params.get("theme") : (store.get(`am2-mode-${design.id}`) || design.mode),
    currency: store.get("am2-currency") || "",
    rates: null, cart: new Map(), query: "", menu: null, demo: true,
  };
  const t = (k) => UI[state.lang][k] ?? UI.en[k];
  const tx = (v) => (v && typeof v === "object" ? v[state.lang] || v.en || v.tr || "" : v || "");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── Data model ──────────────────────────────────────────────────────── */
  function demoMenu() {
    const set = DEMO.sets[design.set];
    return Object.assign({}, DEMO.base, {
      businessName: design.restaurant.name, tagline: design.restaurant.tagline,
      address: { tr: "Örnek Mah. Lezzet Sok. No: 7, Fatih / İstanbul", en: "7 Lezzet St, Fatih, Istanbul (sample)", ar: "7 شارع لذت، الفاتح، إسطنبول (عينة)" },
      categories: set, video: { src: `media/video/${design.set}.mp4`, poster: `media/video/${design.set}-poster.jpg` },
    });
  }
  const HOURS_RE = /\b(mon|tue|wed|thu|fri|sat|sun)\s+(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}|closed|kapal[ıi])/gi;
  function parseHours(text) {
    const out = {}; let m, n = 0; HOURS_RE.lastIndex = 0;
    while ((m = HOURS_RE.exec(String(text || "")))) { n++; out[m[1].toLowerCase()] = /^\d/.test(m[2]) ? m[2].replace(/\s/g, "") : ""; }
    return n >= 3 ? out : null;
  }
  // Maps the AuraDigital API shape (restaurant/design presentation + item metadata) onto the engine shape.
  function fromApi(raw) {
    const r = raw.restaurant && typeof raw.restaurant === "object" ? raw.restaurant : {}, d = raw.design && typeof raw.design === "object" ? raw.design : {}, l = r.links || {};
    const isVideo = (u) => /\.(mp4|webm|m4v)(\?|$)/i.test(String(u || ""));
    const lum = (h) => { const n = parseInt(String(h).slice(1), 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
    const out = { ...raw };
    for (const k of ["tagline", "description", "address"]) if (r[k] && !raw[k]) out[k] = r[k];
    if (r.name && !raw.businessName) out.businessName = r.name;
    if (r.openingHours && !raw.openingHours) out.openingHours = typeof r.openingHours === "object" ? r.openingHours.tr || r.openingHours.en || "" : r.openingHours;
    if (!raw.hours) out.hours = (r.hours && typeof r.hours === "object" && Object.keys(r.hours).length ? { ...r.hours } : null) || parseHours(out.openingHours) || null;
    if (r.logo && !raw.logo) out.logo = r.logo;
    out.socials = { ...(raw.socials || {}), ...(l.instagram ? { instagram: l.instagram } : {}), ...(l.tiktok ? { tiktok: l.tiktok } : {}), ...(l.facebook ? { facebook: l.facebook } : {}) };
    if (l.review && !raw.reviewUrl) out.reviewUrl = l.review;
    if (l.directions && !raw.mapsUrl) out.mapsUrl = l.directions;
    const vid = [d.cover, r.cover].find(isVideo);
    if (r.video && r.video.src && !(raw.video && (raw.video.src || typeof raw.video === "string"))) out.video = { src: r.video.src, poster: r.video.poster || "" };
    else if (vid && !(raw.video && (raw.video.src || typeof raw.video === "string"))) out.video = { src: vid, poster: [r.coverSmall, r.cover].find((u) => u && !isVideo(u)) || "" };
    if (!raw.theme && (d.accent || d.primary || d.background)) out.theme = { accent: d.accent || d.primary || "", mode: d.background && /^#[0-9a-f]{6}$/i.test(d.background) ? (lum(d.background) < 0.35 ? "dark" : "light") : "" };
    out.toggles = { images: d.images !== false, prices: d.prices !== false, information: d.information !== false, socials: d.socials !== false, play: d.play !== false };
    if (d.play === false) out.gameEnabled = false;
    return out;
  }
  function normalize(raw, demo) {
    raw = fromApi(raw || {});
    const cats = (raw.categories || []).map((c, ci) => ({
      id: c.id || `c${ci}`, icon: c.icon || c.emoji || "🍽️", name: c.name || `${t("menu")} ${ci + 1}`,
      items: (c.items || []).map((it, ii) => ({
        id: `${c.id || "c" + ci}-${ii}`, name: (it.translations && it.translations.name && Object.keys(it.translations.name).length ? { ...it.translations.name, tr: it.translations.name.tr || it.name, en: it.translations.name.en || it.name } : null) || it.name || "", desc: (it.translations && it.translations.description && Object.keys(it.translations.description).length ? { tr: it.description, en: it.description, ...it.translations.description } : null) || (it.desc ?? it.description ?? ""),
        price: typeof it.price === "number" ? it.price : parseFloat(String(it.price || "").replace(/[^\d.,]/g, "").replace(",", ".")) || 0,
        priceText: typeof it.price === "string" ? it.price : "",
        img: it.img || it.imageUrl || it.imageSmall || "", ingredients: Array.isArray(it.ingredients) ? { tr: it.ingredients.map((v) => tx(v)).join(", "), en: it.ingredients.map((v) => (v && v.en) || tx(v)).join(", "), ar: it.ingredients.map((v) => (v && v.ar) || tx(v)).join(", ") } : it.ingredients || "", allergens: Array.isArray(it.allergens) ? it.allergens.map((a) => (typeof a === "object" ? a.en || a.tr || "" : String(a))).map((a) => a.trim().toLowerCase()).filter(Boolean) : [],
        available: it.available === undefined ? true : it.available, video: safeVideo(it.video || it.videoUrl), tags: it.tags || [...(it.featured || it.bestseller ? ["chef"] : []), ...(it.seasonal ? ["new"] : [])],
      })),
    }));
    return {
      demo, businessName: raw.businessName || "AuraMenu", tagline: raw.tagline || raw.description || "",
      address: raw.address || "", hours: raw.hours || null, hoursText: raw.openingHours || "",
      whatsapp: String(raw.whatsapp || "").replace(/\D/g, ""), phone: raw.phone || "", currency: CURRENCIES[raw.currency] ? raw.currency : "TRY",
      mapsQuery: raw.mapsQuery || tx(raw.address) || raw.businessName || "", reviewUrl: raw.reviewUrl || "", mapsUrl: raw.mapsUrl || "",
      theme: raw.theme && typeof raw.theme === "object" ? { accent: String(raw.theme.accent || ""), mode: ["light", "dark"].includes(raw.theme.mode) ? raw.theme.mode : "" } : null, toggles: raw.toggles || {}, socials: raw.socials || {}, video: raw.video && typeof raw.video === "object" ? { src: safeVideo(raw.video.src), poster: raw.video.poster || "", title: raw.video.title || "" } : { src: safeVideo(raw.videoUrl || raw.video), poster: raw.videoPoster || "", title: "" }, logo: raw.logo || "", gameEnabled: raw.gameEnabled !== false, categories: cats,
    };
  }

  function safeVideo(v) { v = String(v || ""); return /^(https:\/\/|media\/|\/media\/)/i.test(v) && /\.(mp4|webm|m4v)(\?|$)/i.test(v) ? v : ""; }

  /* ── Currency ────────────────────────────────────────────────────────── */
  async function loadRates() {
    try {
      const cached = JSON.parse(store.get("am2-rates") || "null");
      if (cached && Date.now() - cached.at < 6 * 3600e3) { state.rates = cached.rates; return; }
      const ctl = new AbortController(); setTimeout(() => ctl.abort(), 4000);
      const r = await fetch("https://open.er-api.com/v6/latest/TRY", { signal: ctl.signal });
      const j = await r.json();
      if (j && j.rates) { state.rates = { TRY: 1, USD: j.rates.USD, EUR: j.rates.EUR, TND: j.rates.TND }; store.set("am2-rates", JSON.stringify({ at: Date.now(), rates: state.rates })); }
    } catch { /* offline: fall back */ }
  }
  function money(value, item) {
    const base = state.menu.currency, cur = state.currency || base;
    if (item && item.priceText && !value) return esc(item.priceText);
    const rates = state.rates || FALLBACK_RATES;
    const conv = cur === base ? value : value * ((rates[cur] || 1) / (rates[base] || 1));
    const n = new Intl.NumberFormat(state.lang === "ar" ? "ar-EG" : state.lang === "tr" ? "tr-TR" : state.lang === "fr" ? "fr-FR" : "en-US", { maximumFractionDigits: cur === base ? 0 : 2, minimumFractionDigits: cur === base ? 0 : 2 }).format(conv);
    const sym = CURRENCIES[cur] || cur;
    return `${cur === base ? "" : "≈ "}${cur === "TRY" || cur === "TND" ? `${n} ${sym}` : `${sym}${n}`}`;
  }

  /* ── Hours ───────────────────────────────────────────────────────────── */
  const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  function openStatus() {
    const h = state.menu.hours; if (!h) return null;
    const now = new Date(); const di = (now.getDay() + 6) % 7; const mins = now.getHours() * 60 + now.getMinutes();
    const parse = (s) => { const [a, b] = String(s || "").split("-"); if (!a || !b) return null; const m = (x) => { const [hh, mm] = x.trim().split(":").map(Number); return hh * 60 + (mm || 0); }; let o = m(a), c = m(b); if (c <= o) c += 1440; return { o, c, a: a.trim(), b: b.trim() }; };
    const today = parse(h[DAY_KEYS[di]]); const yest = parse(h[DAY_KEYS[(di + 6) % 7]]);
    if (yest && yest.c > 1440 && mins < yest.c - 1440) return { open: true, label: `${t("closesAt")} ${yest.b}` };
    if (today && mins >= today.o && mins < today.c) return { open: true, label: `${t("closesAt")} ${today.b}` };
    if (today && mins < today.o) return { open: false, label: `${t("opensAt")} ${today.a}` };
    return { open: false, label: "" };
  }

  /* ── Icons ───────────────────────────────────────────────────────────── */
  const ico = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.3 1.8 3.8 4 4v3.1a7 7 0 0 1-4-1.3v6.4A5.8 5.8 0 1 1 10.7 9.6v3.2a2.6 2.6 0 1 0 2.6 2.6V3z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.2L14.2 2C10.6 2 10 4.6 10 6.3v2.2H7.5V12H10v10h4V12h3l.5-3.5z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/></svg>',
    nfc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 8.5a5 5 0 0 1 0 7M9.5 6a8.5 8.5 0 0 1 0 12M13 3.5a12 12 0 0 1 0 17"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 16c3 0 3-4 6-4s3 4 6 4 3-6 4-8"/><circle cx="20" cy="8" r="1.4" fill="currentColor"/></svg>',
  };

  /* ── Theme application ───────────────────────────────────────────────── */
  function applyTheme() {
    const p = design[state.mode] || design.light, r = document.documentElement.style;
    r.setProperty("--bg", p.bg); r.setProperty("--surface", p.surface); r.setProperty("--text", p.text); r.setProperty("--muted", p.muted); r.setProperty("--line", p.line);
    const custom = state.menu?.theme?.accent && /^#[0-9a-f]{6}$/i.test(state.menu.theme.accent) ? state.menu.theme.accent : "";
    const lum = (h) => { const n = parseInt(h.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    // Readable text versions of the theme colours (WCAG AA 4.5:1): only nudged darker/lighter when a design's colour is too faint.
    const hex = (h) => /^#[0-9a-f]{6}$/i.test(String(h || ""));
    const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const mix = (h, to, k) => "#" + [0, 2, 4].map((i) => { const a = parseInt(h.slice(1 + i, 3 + i), 16), b = parseInt(to.slice(1 + i, 3 + i), 16); return Math.round(a + (b - a) * k).toString(16).padStart(2, "0"); }).join("");
    const tryReadable = (fg, bgs) => { const ok = (c) => bgs.every((b) => ratio(c, b) >= 4.6); if (ok(fg)) return fg; const to = lum(bgs[0]) > 0.35 ? "#000000" : "#FFFFFF"; for (let k = 0.04; k <= 1.001; k += 0.04) { const c = mix(fg, to, Math.min(k, 1)); if (ok(c)) return c; } return null; };
    // Prefer a colour that reads on both the page and the cards; when a design's page and cards are too different, cards win.
    const readable = (fg, bgs) => (!hex(fg) || !bgs.length || !bgs.every(hex) ? fg : tryReadable(fg, bgs) || tryReadable(fg, bgs.slice(0, 1)) || fg);
    const accent = custom || design.accent, bgs = [p.surface, p.bg].filter(hex);
    const bestOn = (a) => (ratio(a, "#FFFFFF") >= ratio(a, "#1B1B1B") ? "#FFFFFF" : "#1B1B1B");
    const onAccent = custom || !hex(design.onAccent) || !hex(accent) || ratio(accent, design.onAccent) < 4.5 ? (hex(accent) ? bestOn(accent) : design.onAccent) : design.onAccent;
    r.setProperty("--accent", accent); r.setProperty("--accent2", design.accent2); r.setProperty("--on-accent", onAccent);
    r.setProperty("--accent-text", bgs.length ? readable(accent, bgs) : accent); r.setProperty("--muted", bgs.length ? readable(p.muted, bgs) : p.muted);
    r.setProperty("--radius", `${design.radius}px`); r.setProperty("--img-radius", `${Math.min(design.radius, 40)}px`);
    const ar = state.lang === "ar";
    r.setProperty("--f-display", `"${ar ? design.font.ar : design.font.display}", "${design.font.ar}", system-ui, sans-serif`);
    r.setProperty("--f-body", `"${ar ? "Cairo" : design.font.body}", "Cairo", system-ui, sans-serif`);
    document.documentElement.dataset.mode = state.mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", p.bg);
  }

  /* ── Render helpers ──────────────────────────────────────────────────── */
  function availability(it) {
    if (it.available === false) return `<span class="am-avail is-out"><i></i>${t("soldOut")}</span>`;
    if (it.available === "limited") return `<span class="am-avail is-low"><i></i>${t("limited")}</span>`;
    return `<span class="am-avail is-on"><i></i>${t("available")}</span>`;
  }
  const tags = (it) => (it.tags || []).filter((k) => UI.en.tags[k]).map((k) => `<span class="am-tag am-tag--${k}">${t("tags")[k]}</span>`).join("");
  function photo(it, cat, cls = "am-photo") {
    if (it.img) return `<div class="${cls}"><img src="${esc(it.img)}" alt="${esc(tx(it.name))}" loading="lazy" decoding="async"></div>`;
    const initials = tx(it.name).split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("");
    return `<div class="${cls} am-photo--none" aria-hidden="true"><span class="am-ph-icon">${esc(cat.icon)}</span><span class="am-ph-init">${esc(initials)}</span></div>`;
  }
  function itemCard(it, cat, idx) {
    const out = it.available === false;
    return `<article class="am-item${out ? " is-out" : ""}" data-item="${esc(it.id)}" style="--i:${idx}">
      <button class="am-item-hit" data-open="${esc(it.id)}" aria-label="${esc(tx(it.name))}"></button>
      ${photo(it, cat)}
      <div class="am-item-body">
        <div class="am-item-top"><h3 class="am-item-name">${esc(tx(it.name))}</h3><span class="am-leader" aria-hidden="true"></span><b class="am-price">${money(it.price, it)}</b></div>
        ${tx(it.desc) ? `<p class="am-item-desc">${esc(tx(it.desc))}</p>` : ""}
        <div class="am-item-meta">${availability(it)}${tags(it)}${it.allergens.length ? `<span class="am-al-mini" title="${esc(t("allergens"))}">${it.allergens.slice(0, 4).map((a) => ALLERGENS[a]?.i || "").join("")}</span>` : ""}</div>
      </div>
      <button class="am-add" data-add="${esc(it.id)}" ${out ? "disabled" : ""} aria-label="${esc(t("add"))}: ${esc(tx(it.name))}">+</button>
    </article>`;
  }

  function heroPhoto() {
    for (const c of state.menu.categories) for (const it of c.items) if (it.img && (it.tags || []).includes("chef")) return it.img;
    for (const c of state.menu.categories) for (const it of c.items) if (it.img) return it.img;
    return "";
  }
  function statusPill() {
    const s = openStatus(); if (!s) return state.menu.hoursText ? `<span class="am-status">${esc(state.menu.hoursText)}</span>` : "";
    return `<span class="am-status ${s.open ? "is-open" : "is-closed"}"><i></i>${s.open ? t("open") : t("closed")}${s.label ? ` · ${esc(s.label)}` : ""}</span>`;
  }
  function quickActions() {
    const m = state.menu;
    return `<div class="am-quick">
      <a class="am-q" href="${esc(mapsUrl())}" target="_blank" rel="noopener">${ico.pin}<span>${t("directions")}</span></a>
      <a class="am-q" href="${esc(reviewUrl())}" target="_blank" rel="noopener">${ico.star}<span>${t("review")}</span></a>
      ${m.whatsapp ? `<a class="am-q" href="${esc(waUrl())}" data-wa target="_blank" rel="noopener">${ico.wa}<span>${t("whatsapp")}</span></a>` : ""}
      ${m.phone ? `<a class="am-q" href="tel:${esc(m.phone.replace(/\s/g, ""))}">${ico.phone}<span>${t("call")}</span></a>` : ""}
    </div>`;
  }
  const mapsUrl = () => state.menu.mapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(state.menu.mapsQuery)}`;
  const reviewUrl = () => state.menu.reviewUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(state.menu.businessName + " " + state.menu.mapsQuery)}`;
  const waUrl = (text) => `https://wa.me/${state.menu.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

  function hero() {
    const m = state.menu, name = esc(tx(m.businessName)), tag = esc(tx(m.tagline)), img = heroPhoto(), v = design.hero;
    const logo = m.logo ? `<img class="am-logo-img" src="${esc(m.logo)}" alt="">` : "";
    const head = `${logo}<p class="am-kicker">${statusPill()}</p><h1 class="am-title">${name}</h1>${tag ? `<p class="am-tagline">${tag}</p>` : ""}`;
    if (v === "orbit") {
      const pics = []; m.categories.forEach((c) => c.items.forEach((it) => it.img && pics.length < 8 && pics.push(it.img)));
      return `<header class="am-hero am-hero--orbit"><div class="am-orbit" aria-hidden="true">${pics.map((p, i) => `<span style="--k:${i};--n:${pics.length}"><img src="${esc(p)}" alt=""></span>`).join("")}</div><div class="am-hero-copy">${head}${quickActions()}</div></header>`;
    }
    if (v === "board" || v === "minimal" || v === "magazine" || v === "frame") {
      const date = new Intl.DateTimeFormat(state.lang === "ar" ? "ar" : state.lang, { weekday: "long", day: "numeric", month: "long" }).format(new Date());
      return `<header class="am-hero am-hero--${v}"><div class="am-hero-copy">${v === "magazine" ? `<p class="am-masthead"><span>${esc(t("menu"))}</span><span>${esc(date)}</span></p>` : ""}${v === "frame" ? '<span class="am-orn" aria-hidden="true"></span>' : ""}${head}${v === "frame" ? '<span class="am-orn am-orn--b" aria-hidden="true"></span>' : ""}${quickActions()}</div>${v === "magazine" && img ? `<figure class="am-hero-img" data-parallax><img src="${esc(img)}" alt=""></figure>` : ""}</header>`;
    }
    return `<header class="am-hero am-hero--${v}">${img ? `<figure class="am-hero-img"><img src="${esc(img)}" alt="" fetchpriority="high"></figure>` : ""}<div class="am-hero-copy">${head}${quickActions()}</div>${design.fx.includes("embers") ? '<canvas class="am-embers" aria-hidden="true"></canvas>' : ""}${design.fx.includes("waves") ? '<svg class="am-wave" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 Q 150 0 300 30 T 600 30 T 900 30 T 1200 30 V60 H0z"/></svg>' : ""}</header>`;
  }

  function videoBlock() {
    const v = state.menu.video; if (!v || !v.src) return "";
    return `<section class="am-video" aria-label="${esc(t("videoKicker"))}"><div class="am-video-frame"><video src="${esc(v.src)}" ${v.poster ? `poster="${esc(v.poster)}"` : ""} muted loop playsinline preload="metadata" data-autoplay></video><button class="am-video-btn" data-vplay aria-label="${esc(t("play"))}">❚❚</button><button class="am-video-btn am-video-snd" data-vsound aria-label="${esc(t("videoSound"))}">🔇</button></div><div class="am-video-copy"><span class="am-video-kicker">● ${esc(t("videoKicker"))}</span><h2>${esc(tx(v.title) || t("videoTitle"))}</h2><p>${esc(tx(state.menu.tagline))}</p></div></section>`;
  }
  function marquee() {
    if (!design.fx.includes("marquee")) return "";
    const words = state.menu.categories.map((c) => `${c.icon} ${tx(c.name)}`).join("  ✦  ");
    return `<div class="am-marquee" aria-hidden="true"><div>${esc(words)}  ✦  ${esc(words)}  ✦  </div></div>`;
  }
  function stickers() {
    if (!design.fx.includes("stickers")) return "";
    return `<div class="am-stickers" aria-hidden="true"><span>🍓</span><span>🍩</span><span>⭐</span><span>🍭</span></div>`;
  }

  function topbar() {
    const curs = Object.keys(CURRENCIES).map((c) => `<option value="${c}" ${c === (state.currency || state.menu.currency) ? "selected" : ""}>${c}</option>`).join("");
    return `<div class="am-top">
      <a class="am-brandmini" href="#top">${esc(tx(state.menu.businessName))}</a>
      <div class="am-top-tools">
        <button class="am-icon-btn" data-act="search" aria-label="${t("search")}">${ico.search}</button>
        <div class="am-langs" role="group" aria-label="${t("language")}">${LANGS.map((l) => `<button data-lang="${l}" aria-pressed="${l === state.lang}">${l.toUpperCase()}</button>`).join("")}${PLANNED_LANGS.map((l) => `<button disabled title="${t("soon")}">${l.toUpperCase()}<small>${t("soon")}</small></button>`).join("")}</div>
        <label class="am-cur"><span class="am-visually-hidden">${t("currency")}</span><select data-currency>${curs}</select></label>
        <button class="am-icon-btn am-mode" data-act="mode" aria-label="${t("theme")}" aria-pressed="${state.mode === "dark"}">${ico.sun}${ico.moon}</button>
      </div>
    </div>`;
  }

  function nav() {
    const v = design.nav;
    return `<nav class="am-nav am-nav--${v}" aria-label="${t("menu")}"><div class="am-nav-track">${state.menu.categories.map((c, i) => `<a href="#cat-${esc(c.id)}" data-cat="${esc(c.id)}">${v === "numbered" ? `<small>${String(i + 1).padStart(2, "0")}</small>` : ""}${v === "tiles" || v === "pills" ? `<span class="am-nav-ico">${esc(c.icon)}</span>` : ""}<span>${esc(tx(c.name))}</span></a>`).join("")}</div></nav>`;
  }

  function sections() {
    const q = state.query.trim().toLocaleLowerCase(state.lang);
    let count = 0;
    const html = state.menu.categories.map((c, ci) => {
      const items = c.items.filter((it) => !q || [tx(it.name), tx(it.desc), tx(it.ingredients)].join(" ").toLocaleLowerCase(state.lang).includes(q));
      count += items.length; if (!items.length) return "";
      return `<section class="am-cat" id="cat-${esc(c.id)}" data-cat-section="${esc(c.id)}"><div class="am-cat-head"><span class="am-cat-num">${String(ci + 1).padStart(2, "0")}</span><span class="am-cat-ico" aria-hidden="true">${esc(c.icon)}</span><h2>${esc(tx(c.name))}</h2><span class="am-cat-count">${items.length}</span></div><div class="am-list am-list--${design.list}">${items.map((it, i) => itemCard(it, c, i)).join("")}</div></section>`;
    }).join("");
    return count ? html : `<p class="am-empty">${q ? t("noResults") : `🍽️<br>${t("preparing")}`}</p>`;
  }

  function info() {
    const m = state.menu, h = m.hours, di = (new Date().getDay() + 6) % 7, s = m.socials || {};
    const hours = h ? `<table class="am-hours">${DAY_KEYS.map((k, i) => `<tr${i === di ? ' class="is-today"' : ""}><th>${t("days")[i]}${i === di ? ` <em>${t("today")}</em>` : ""}</th><td>${esc(h[k] || "—")}</td></tr>`).join("")}</table>` : `<p>${esc(m.hoursText)}</p>`;
    const soc = [["instagram", ico.ig, "Instagram"], ["tiktok", ico.tt, "TikTok"], ["facebook", ico.fb, "Facebook"]].filter(([k]) => s[k]).map(([k, i, n]) => `<a class="am-soc" href="${esc(s[k])}" target="_blank" rel="noopener" aria-label="${n}">${i}</a>`).join("") + (m.whatsapp ? `<a class="am-soc" href="${esc(waUrl())}" data-wa target="_blank" rel="noopener" aria-label="WhatsApp">${ico.wa}</a>` : "");
    return `<section class="am-info" id="info" aria-labelledby="info-h">
      <h2 id="info-h">${t("info")}</h2>
      <div class="am-info-grid">
        <div class="am-info-card"><h3>${ico.pin} ${t("address")}</h3><p>${esc(tx(m.address))}</p><div class="am-info-actions"><a class="am-btn2" href="${esc(mapsUrl())}" target="_blank" rel="noopener">${ico.pin} ${t("directions")}</a><a class="am-btn2 am-btn2--ghost" href="${esc(reviewUrl())}" target="_blank" rel="noopener">${ico.star} ${t("review")}</a></div></div>
        <div class="am-info-card"><h3>🕒 ${t("hours")}</h3>${statusPill()}${hours}</div>
        <div class="am-info-card"><h3>${t("follow")}</h3><div class="am-socials">${soc}</div>
          <div class="am-scan">${ico.qr}${ico.nfc}<div><b>${t("scan")}</b><p>${t("scanText")}</p></div></div>
          <button class="am-btn2 am-btn2--ghost" data-act="share">${ico.qr} ${t("share")}</button></div>
      </div>
      ${m.gameEnabled ? `<button class="am-game-btn" data-act="game">${ico.game}<span>${t("game")}</span><b>🐍</b></button>` : ""}
      <p class="am-al-note">${t("allergenNote")}</p>
    </section>`;
  }

  function footer() {
    return `<footer class="am-foot"><a href="https://auramenu.space" target="_blank" rel="noopener"><img src="am2/mark.svg" alt="" width="18" height="18">${t("powered")}</a></footer>`;
  }

  function cartBar() {
    const n = [...state.cart.values()].reduce((a, b) => a + b, 0);
    return `<button class="am-cartbar${n ? " is-on" : ""}" data-act="cart" aria-live="polite">${ico.bag}<span>${t("order")}</span><b class="am-cart-n">${n}</b><span class="am-cart-total">${money(cartTotal())}</span></button>`;
  }
  const findItem = (id) => { for (const c of state.menu.categories) for (const it of c.items) if (it.id === id) return [it, c]; return [null, null]; };
  const cartTotal = () => [...state.cart].reduce((s, [id, q]) => s + (findItem(id)[0]?.price || 0) * q, 0);

  /* ── Full render ─────────────────────────────────────────────────────── */
  function render() {
    applyTheme();
    document.documentElement.lang = state.lang; document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.title = `${tx(state.menu.businessName)} · ${t("menu")}`;
    const app = $("#app");
    app.className = `am-app d-${design.id} hero-${design.hero} list-${design.list} nav-${design.nav} motif-${design.motif}${design.upper ? " is-upper" : ""}${design.italic ? " is-italic" : ""}${design.card ? " card-" + design.card : ""} ${design.fx.map((f) => "fx-" + f).join(" ")}${["images", "prices", "information", "socials"].filter((k) => state.menu.toggles?.[k] === false).map((k) => " no-" + k).join("")}`;
    app.innerHTML = `${state.menu.demo && !inGallery && !embedded ? `<div class="am-demo-bar"><span>${t("demo")} · AuraMenu</span><a href="gallery.html?template=${design.id}&lang=${state.lang}">${t("want")} →</a></div>` : ""}
      ${topbar()}${stickers()}<div id="top"></div>${hero()}${marquee()}${videoBlock()}
      <div class="am-searchbox" hidden><label>${ico.search}<input type="search" placeholder="${esc(t("searchPh"))}" value="${esc(state.query)}" aria-label="${esc(t("search"))}"></label><button data-act="clear">${t("clear")}</button></div>
      ${nav()}<main class="am-main" id="menu-main">${sections()}</main>${info()}${footer()}${cartBar()}
      <div class="am-toast" role="status" aria-live="polite"></div>`;
    if (state.query) $(".am-searchbox").hidden = false;
    wire(); effects();
  }
  function rerenderList() {
    $("#menu-main").innerHTML = sections(); wireItems(); effects(true);
  }
  function updateCart() { const old = $(".am-cartbar"); if (old) old.outerHTML = cartBar(); $(".am-cartbar").addEventListener("click", openCart); }

  function toast(msg) { const el = $(".am-toast"); el.textContent = msg; el.classList.add("is-on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("is-on"), 3400); }

  /* ── Sheets (detail, cart, share, game) ──────────────────────────────── */
  function sheet(html, cls = "") {
    const d = document.createElement("dialog"); d.className = `am-sheet ${cls}`;
    d.innerHTML = `<div class="am-sheet-in"><button class="am-sheet-x" aria-label="${t("close")}">${ico.x}</button>${html}</div>`;
    document.body.append(d); d.showModal(); document.documentElement.style.overflow = "hidden";
    const close = () => { if (d.dataset.closing) return; d.dataset.closing = "1"; d.classList.add("is-closing"); setTimeout(() => { try { d.close(); } catch {} d.remove(); document.documentElement.style.overflow = ""; }, 200); };
    d.querySelector(".am-sheet-x").onclick = close; d.addEventListener("click", (e) => { if (e.target === d) close(); }); d.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
    d.close2 = close; return d;
  }
  function openItem(id) {
    const [it, cat] = findItem(id); if (!it) return;
    let qty = 1; const out = it.available === false;
    const al = it.allergens.length ? it.allergens.map((a) => `<li>${ALLERGENS[a]?.i || "•"} ${ALLERGENS[a]?.[state.lang] || ALLERGENS[a]?.en || a}</li>`).join("") : `<li class="is-none">✓ ${t("noAllergens")}</li>`;
    const d = sheet(`${it.video ? `<div class="am-sheet-photo"><video src="${esc(it.video)}" ${it.img ? `poster="${esc(it.img)}"` : ""} autoplay muted loop playsinline></video></div>` : photo(it, cat, "am-sheet-photo")}
      <div class="am-sheet-body"><p class="am-sheet-cat">${esc(cat.icon)} ${esc(tx(cat.name))}</p><h2>${esc(tx(it.name))}</h2>
      <div class="am-item-meta">${availability(it)}${tags(it)}</div>
      ${tx(it.desc) ? `<p class="am-sheet-desc">${esc(tx(it.desc))}</p>` : ""}
      ${tx(it.ingredients) ? `<h3>${t("ingredients")}</h3><p>${esc(tx(it.ingredients))}</p>` : ""}
      <h3>${t("allergens")}</h3><ul class="am-allergens">${al}</ul>
      <div class="am-sheet-buy"><b class="am-price">${money(it.price, it)}</b>
        <div class="am-qty" ${out ? "hidden" : ""}><button data-q="-1" aria-label="-">−</button><output>1</output><button data-q="1" aria-label="+">+</button></div>
        <button class="am-btn2" data-addq ${out ? "disabled" : ""}>${out ? t("soldOut") : t("add")}</button></div>
      ${state.currency && state.currency !== state.menu.currency ? `<p class="am-approx">${t("approx").replace("{base}", state.menu.currency)}</p>` : ""}</div>`, "am-sheet--item");
    d.querySelectorAll("[data-q]").forEach((b) => b.onclick = () => { qty = Math.max(1, Math.min(20, qty + Number(b.dataset.q))); d.querySelector("output").textContent = qty; });
    d.querySelector("[data-addq]").onclick = () => { addToCart(id, qty); d.close2(); };
  }
  function addToCart(id, n = 1) {
    const [it] = findItem(id); if (!it || it.available === false) return;
    state.cart.set(id, Math.min(20, (state.cart.get(id) || 0) + n)); updateCart(); toast(`${t("added")}: ${tx(it.name)}`);
    const b = $(`[data-add="${CSS.escape(id)}"]`); b?.classList.add("is-pop"); setTimeout(() => b?.classList.remove("is-pop"), 400);
  }
  function openCart() {
    const rows = () => state.cart.size ? [...state.cart].map(([id, q]) => { const [it] = findItem(id); return `<li><span>${esc(tx(it.name))}</span><div class="am-qty"><button data-cq="${esc(id)}" data-d="-1">−</button><output>${q}</output><button data-cq="${esc(id)}" data-d="1">+</button></div><b>${money(it.price * q)}</b></li>`; }).join("") : `<li class="is-empty">${t("empty")}</li>`;
    const d = sheet(`<div class="am-sheet-body"><h2>${ico.bag} ${t("order")}</h2><ul class="am-cart">${rows()}</ul>
      <p class="am-cart-sum">${t("total")} <b>${money(cartTotal())}</b></p>
      <label class="am-note">${t("table")}<input type="text" maxlength="80"></label>
      <button class="am-btn2 am-btn2--wa" data-send ${state.cart.size ? "" : "disabled"}>${ico.wa} ${t("sendOrder")}</button>
      ${state.currency && state.currency !== state.menu.currency ? `<p class="am-approx">${t("approx").replace("{base}", state.menu.currency)}</p>` : ""}</div>`, "am-sheet--cart");
    const refresh = () => { d.querySelector(".am-cart").innerHTML = rows(); d.querySelector(".am-cart-sum b").innerHTML = money(cartTotal()); d.querySelector("[data-send]").disabled = !state.cart.size; bind(); updateCart(); };
    const bind = () => d.querySelectorAll("[data-cq]").forEach((b) => b.onclick = () => { const id = b.dataset.cq, q = (state.cart.get(id) || 0) + Number(b.dataset.d); q > 0 ? state.cart.set(id, q) : state.cart.delete(id); refresh(); });
    bind();
    d.querySelector("[data-send]").onclick = () => {
      const lines = [...state.cart].map(([id, q]) => { const [it] = findItem(id); return `• ${q} × ${tx(it.name)} — ${money(it.price * q).replace("≈ ", "")}`; });
      const note = d.querySelector(".am-note input").value.trim();
      const text = `${t("orderIntro")}\n${lines.join("\n")}\n${t("total")}: ${money(cartTotal()).replace("≈ ", "")}${note ? `\n${note}` : ""}`;
      if (state.menu.demo) { toast(t("demoOrder")); return; }
      window.open(waUrl(text), "_blank", "noopener");
    };
  }
  function openShare() {
    const url = state.menu.demo ? `https://auramenu.space/gallery.html?template=${design.id}` : location.href.split("#")[0].replace(/[?&]embedded=1/, "");
    const d = sheet(`<div class="am-sheet-body am-share"><h2>${ico.qr} ${t("scan")}</h2><div class="am-qr" aria-label="QR"></div><p>${t("scanText")}</p><p class="am-url">${esc(url)}</p><button class="am-btn2" data-copy>${t("copy")}</button></div>`, "am-sheet--share");
    const draw = () => { try { new window.QRCode(d.querySelector(".am-qr"), { text: url, width: 200, height: 200, colorDark: "#24191E", colorLight: "#ffffff" }); } catch {} };
    if (window.QRCode) draw(); else { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"; s.onload = draw; document.head.append(s); }
    d.querySelector("[data-copy]").onclick = async () => { try { await navigator.clipboard.writeText(url); toast(t("copied")); } catch {} };
  }
  function openGame() {
    const d = sheet(`<div class="am-sheet-body am-game"><h2>🐍 ${t("gameTitle")}</h2><p>${t("gameHint")}</p><div class="am-game-score"><span>${t("score")}: <b data-score>0</b></span><span>${t("best")}: <b data-best>0</b></span></div><canvas width="320" height="320" tabindex="0" aria-label="${t("gameTitle")}"></canvas><div class="am-game-pad"><button data-dir="up">▲</button><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div><button class="am-btn2" data-restart>${t("restart")}</button></div>`, "am-sheet--game");
    const start = () => window.AuraSnake && window.AuraSnake.start(d, { accent: design.accent, accent2: design.accent2, surface: getComputedStyle(document.documentElement).getPropertyValue("--surface"), text: getComputedStyle(document.documentElement).getPropertyValue("--text"), rtl: state.lang === "ar" });
    if (window.AuraSnake) start(); else { const s = document.createElement("script"); s.src = "menu-v2/snake.js"; s.onload = start; document.head.append(s); }
  }

  /* ── Wiring ──────────────────────────────────────────────────────────── */
  function wireItems() {
    $$("[data-open]").forEach((b) => b.onclick = () => openItem(b.dataset.open));
    $$("[data-add]").forEach((b) => b.onclick = (e) => { e.stopPropagation(); addToCart(b.dataset.add); });
  }
  function wire() {
    wireItems();
    $$("[data-lang]").forEach((b) => b.onclick = () => { state.lang = b.dataset.lang; store.set("auraMenuUiLanguage", state.lang); render(); window.parent !== window && window.parent.postMessage({ type: "auramenu:lang", lang: state.lang }, "*"); });
    $("[data-currency]").onchange = (e) => { state.currency = e.target.value; store.set("am2-currency", state.currency); render(); };
    $('[data-act="mode"]').onclick = () => { state.mode = state.mode === "dark" ? "light" : "dark"; store.set(`am2-mode-${design.id}`, state.mode); applyTheme(); $('[data-act="mode"]').setAttribute("aria-pressed", state.mode === "dark"); };
    $('[data-act="search"]').onclick = () => { const box = $(".am-searchbox"); box.hidden = !box.hidden; if (!box.hidden) box.querySelector("input").focus(); };
    const input = $(".am-searchbox input"); input.oninput = () => { state.query = input.value; rerenderList(); };
    $('[data-act="clear"]').onclick = () => { state.query = ""; input.value = ""; rerenderList(); input.focus(); };
    $('[data-act="cart"]').onclick = openCart; $('[data-act="share"]').onclick = openShare;
    const g = $('[data-act="game"]'); if (g) g.onclick = openGame;
    const vid = $("[data-autoplay]");
    if (vid) {
      const vio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !vid.dataset.paused && !reduced) vid.play().catch(() => {}); else vid.pause(); }), { threshold: 0.35 }); vio.observe(vid);
      $("[data-vplay]").onclick = () => { if (vid.paused) { delete vid.dataset.paused; vid.play().catch(() => {}); $("[data-vplay]").textContent = "❚❚"; } else { vid.dataset.paused = "1"; vid.pause(); $("[data-vplay]").textContent = "▶"; } };
      $("[data-vsound]").onclick = () => { vid.muted = !vid.muted; $("[data-vsound]").textContent = vid.muted ? "🔇" : "🔊"; if (!vid.muted) vid.play().catch(() => {}); };
      if (reduced) $("[data-vplay]").textContent = "▶";
    }
    $$("[data-wa]").forEach((a) => a.addEventListener("click", (e) => { if (state.menu.demo) { e.preventDefault(); toast(t("demoOrder")); } }));
    // active category on scroll
    const links = $$("[data-cat]");
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { links.forEach((l) => l.classList.toggle("is-active", l.dataset.cat === en.target.dataset.catSection)); const a = links.find((l) => l.classList.contains("is-active")); const tr = a?.parentElement; if (tr && a) { const x = a.offsetLeft - (tr.clientWidth - a.offsetWidth) / 2; tr.scrollTo({ left: document.dir === "rtl" || document.documentElement.dir === "rtl" ? -Math.max(0, tr.scrollWidth - tr.clientWidth - x) : x, behavior: "smooth" }); } } }), { rootMargin: "-40% 0px -55% 0px" });
    $$("[data-cat-section]").forEach((s) => io.observe(s));
  }

  /* ── Premium effects ─────────────────────────────────────────────────── */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function effects(listOnly) {
    if (design.fx.includes("reveal") && !reduced) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12 });
      $$(".am-item, .am-cat-head").forEach((el) => io.observe(el));
    } else $$(".am-item, .am-cat-head").forEach((el) => el.classList.add("is-in"));
    if (design.fx.includes("tilt") && !reduced && matchMedia("(hover:hover)").matches) {
      $$(".am-item").forEach((el) => { el.onpointermove = (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateZ(0)`; }; el.onpointerleave = () => (el.style.transform = ""); });
    }
    if (listOnly) return;
    if (design.fx.includes("parallax") && !reduced) {
      const els = $$("[data-parallax] img, .am-hero-img img, .am-list--editorial .am-photo img");
      const tick = () => { const vh = innerHeight; els.forEach((img) => { const r = img.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; img.style.transform = `translateY(${((r.top + r.height / 2 - vh / 2) / vh) * -36}px) scale(1.12)`; }); };
      addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true }); tick();
    }
    if (design.fx.includes("embers") && !reduced) embers($(".am-embers"));
    if (design.fx.includes("spotlight") && !reduced) { const h = $(".am-hero"); if (h) h.onpointermove = (e) => { const r = h.getBoundingClientRect(); h.style.setProperty("--mx", `${e.clientX - r.left}px`); h.style.setProperty("--my", `${e.clientY - r.top}px`); }; }
    if (design.fx.includes("curtain") && !reduced && !embedded && !sessionStorage.getItem(`am2-curtain-${design.id}`)) {
      try { sessionStorage.setItem(`am2-curtain-${design.id}`, "1"); } catch {}
      const c = document.createElement("div"); c.className = "am-curtain"; c.setAttribute("aria-hidden", "true");
      c.innerHTML = `<span></span><span></span><b>${esc(tx(state.menu.businessName))}</b>`; document.body.append(c);
      setTimeout(() => c.classList.add("is-open"), 900); setTimeout(() => c.remove(), 2200);
    }
  }
  function embers(cv) {
    if (!cv) return; const ctx = cv.getContext("2d"); let w, h; const ps = [];
    const size = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight; }; size(); addEventListener("resize", size);
    for (let i = 0; i < 60; i++) ps.push({ x: Math.random() * w, y: h + Math.random() * h, r: Math.random() * 2.4 + 0.6, v: Math.random() * 0.7 + 0.3, s: Math.random() * 6 });
    (function loop() { ctx.clearRect(0, 0, w, h); for (const p of ps) { p.y -= p.v; p.s += 0.02; p.x += Math.sin(p.s) * 0.4; if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; } const a = Math.max(0, Math.min(1, p.y / h)); ctx.beginPath(); ctx.fillStyle = `rgba(255,${120 + Math.floor(80 * a)},40,${0.85 * a})`; ctx.shadowBlur = 12; ctx.shadowColor = "#ff7a2f"; ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); } requestAnimationFrame(loop); })();
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */
  function boot(menu) { state.menu = menu; state.cart.clear(); if (embedded) state.mode = menu.theme?.mode || design.mode; else if (menu.theme?.mode && !store.get(`am2-mode-${design.id}`)) state.mode = menu.theme.mode; render(); }
  if (embedded) {
    window.addEventListener("message", (e) => {
      if (location.origin !== "null" && e.origin !== location.origin) return;
      if (e.source !== window.parent || e.data?.type !== "auramenu:render" || !e.data.menu) return;
      if (e.data.menu.menuLanguage && LANGS.includes(e.data.menu.menuLanguage)) state.lang = e.data.menu.menuLanguage;
      boot(normalize(e.data.menu, Boolean(e.data.draft)));
    });
    window.parent.postMessage({ type: "auramenu:template-ready", template: design.id, engine: 2 }, location.origin === "null" ? "*" : location.origin);
  }
  if (window.AURAMENU_CUSTOMER) boot(normalize(window.AURAMENU_CUSTOMER, false));
  else boot(normalize(demoMenu(), true));
  loadRates().then(() => { if (state.currency && state.currency !== state.menu.currency) render(); });
  window.AuraMenuEngine = { design, state, render, normalize };
})();
