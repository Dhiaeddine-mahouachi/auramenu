/* AuraMenu 2.0 site helper: language (TR default · EN · AR), single light/dark toggle, mobile nav, reveal-on-scroll. */
(function () {
  "use strict";
  const LANGS = ["tr", "en", "ar"];
  const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const params = new URLSearchParams(location.search);
  let lang = LANGS.includes(params.get("lang")) ? params.get("lang") : LANGS.includes(get("auraMenuUiLanguage")) ? get("auraMenuUiLanguage") : "tr";
  const COMMON = {
    tr: { skip: "İçeriğe geç", navDesigns: "Tasarımlar", navHow: "Nasıl çalışır", navFeatures: "Özellikler", navNfc: "NFC kartlar", navPricing: "Fiyatlar", login: "Giriş", cta: "Menünü oluştur", themeLabel: "Açık / koyu görünüm", footTag: "Restoranlar için lezzetli dijital menüler. AuraDigital tarafından İstanbul'da tasarlandı.", fProduct: "Ürün", fCompany: "Şirket", fHelp: "Yardım", fBuilder: "Menü oluşturucu", fStatus: "Başvuru durumu", fContact: "İletişim", fFaq: "SSS", rights: "© 2026 AuraMenu. Tüm hakları saklıdır.", madeBy: "AuraDigital tarafından yapıldı" },
    en: { skip: "Skip to content", navDesigns: "Designs", navHow: "How it works", navFeatures: "Features", navNfc: "NFC cards", navPricing: "Pricing", login: "Log in", cta: "Create your menu", themeLabel: "Light / dark appearance", footTag: "Delicious digital menus for restaurants. Designed in Istanbul by AuraDigital.", fProduct: "Product", fCompany: "Company", fHelp: "Help", fBuilder: "Menu builder", fStatus: "Request status", fContact: "Contact", fFaq: "FAQ", rights: "© 2026 AuraMenu. All rights reserved.", madeBy: "Made by AuraDigital" },
    ar: { skip: "انتقل إلى المحتوى", navDesigns: "التصاميم", navHow: "كيف يعمل", navFeatures: "المزايا", navNfc: "بطاقات NFC", navPricing: "الأسعار", login: "تسجيل الدخول", cta: "أنشئ قائمتك", themeLabel: "الوضع الفاتح / الداكن", footTag: "قوائم رقمية شهية للمطاعم. صُممت في إسطنبول بواسطة AuraDigital.", fProduct: "المنتج", fCompany: "الشركة", fHelp: "المساعدة", fBuilder: "منشئ القائمة", fStatus: "حالة الطلب", fContact: "تواصل معنا", fFaq: "الأسئلة الشائعة", rights: "© 2026 AuraMenu. جميع الحقوق محفوظة.", madeBy: "من صنع AuraDigital" },
  };
  let dict = {}; const listeners = [];
  const theme = get("auramenu-theme");
  if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;

  function t(key) { return (dict[lang] && dict[lang][key]) ?? (dict.en && dict.en[key]) ?? ""; }
  function apply() {
    const html = document.documentElement; html.lang = lang; html.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { const v = t(el.dataset.i18nHtml); if (v) el.innerHTML = v; });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => el.dataset.i18nAttr.split(";").forEach((pair) => { const [a, k] = pair.split(":"); const v = t(k); if (v) el.setAttribute(a, v); }));
    document.querySelectorAll("[data-lang-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang)));
    document.querySelectorAll("[data-lang-link]").forEach((a) => { const u = new URL(a.getAttribute("href"), location.href); u.searchParams.set("lang", lang); a.setAttribute("href", u.pathname.replace(/^\//, "") + u.search + u.hash); });
    if (t("title")) document.title = t("title");
    listeners.forEach((fn) => fn(lang));
  }
  function setLang(l) { if (!LANGS.includes(l)) return; lang = l; set("auraMenuUiLanguage", l); apply(); if (location.protocol !== "file:") { const u = new URL(location.href); u.searchParams.set("lang", l); history.replaceState(null, "", u); } }
  function init(d) {
    dict = {}; for (const l of LANGS) dict[l] = Object.assign({}, COMMON[l], (d || {})[l]);
    document.querySelectorAll("[data-lang-btn]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.langBtn)));
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
      const dark = document.documentElement.dataset.theme !== "dark";
      document.documentElement.dataset.theme = dark ? "dark" : "light"; set("auramenu-theme", dark ? "dark" : "light");
      b.setAttribute("aria-pressed", String(dark));
    }));
    const toggle = document.querySelector("[data-nav-toggle]"), nav = document.querySelector("[data-nav]");
    toggle?.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(open)); });
    nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); toggle?.setAttribute("aria-expanded", "false"); }));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    apply();
  }
  window.AuraSite = { init, t, setLang, onLang: (fn) => listeners.push(fn), get lang() { return lang; } };
})();
