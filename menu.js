(() => {
  "use strict";

  const root = document.getElementById("menuRoot");
  const config = window.AURA_MENU_CONFIG;
  const templateFiles = {
    modern: "c.html",
    orbit: "b.html",
    maison: "a.html",
    taste3d: "d.html",
  };
  const copy = {
    tr: {
      loading: "Menü yükleniyor…",
      notFound: "Menü henüz yayında değil",
      notFoundText:
        "Bu adres bulunamadı veya menü hâlâ AuraDigital onayını bekliyor.",
      home: "AuraMenu ana sayfa",
    },
    en: {
      loading: "Loading menu…",
      notFound: "Menu is not live yet",
      notFoundText:
        "This address does not exist or the menu is still waiting for AuraDigital approval.",
      home: "AuraMenu home",
    },
    ar: {
      loading: "جارٍ تحميل القائمة…",
      notFound: "القائمة غير منشورة بعد",
      notFoundText:
        "هذا الرابط غير موجود أو أن القائمة ما زالت بانتظار موافقة AuraDigital.",
      home: "الصفحة الرئيسية",
    },
  };

  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>'"]/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[character],
    );

  function slug() {
    const query = new URLSearchParams(location.search).get("slug");
    if (query) return query.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const part = location.pathname.split("/").filter(Boolean)[0] || "";
    return ["menu.html", "404.html", "index.html"].includes(part)
      ? ""
      : part.toLowerCase().replace(/[^a-z0-9-]/g, "");
  }

  function locked(message) {
    const language = localStorage.getItem("auraMenuUiLanguage") || "tr";
    const t = copy[language] || copy.tr;
    document.documentElement.lang = language;
    document.body.dir = language === "ar" ? "rtl" : "ltr";
    root.innerHTML = `<section class="menu-locked"><span>🔒</span><h1>${esc(t.notFound)}</h1><p>${esc(message || t.notFoundText)}</p><a href="/index.html?lang=${language}">${esc(t.home)}</a></section>`;
  }

  function renderTemplate(menu) {
    const templateFile = templateFiles[menu.templateId] || templateFiles.modern;
    const frame = document.createElement("iframe");
    frame.className = "public-template-frame";
    frame.title = `${menu.businessName} menu`;
    document.body.className = "has-template-frame";
    root.innerHTML = "";
    root.append(frame);
    const targetOrigin = location.origin === "null" ? "*" : location.origin;
    const sendMenu = () =>
      frame.contentWindow?.postMessage(
        { type: "auramenu:render", menu, draft: false },
        targetOrigin,
      );
    window.addEventListener("message", (event) => {
      if (location.origin !== "null" && event.origin !== location.origin) return;
      if (event.source !== frame.contentWindow) return;
      if (event.data?.type === "auramenu:template-ready") sendMenu();
    });
    frame.addEventListener("load", sendMenu);
    frame.src = `/${templateFile}?embedded=1`;
  }

  async function load() {
    const id = slug();
    if (!id) {
      locked();
      return;
    }
    try {
      const endpoint = new URL(`${config.apiBase}/sites/${encodeURIComponent(id)}`);
      endpoint.searchParams.set("_", String(Date.now()));
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "omit",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.menu) {
        locked(data.error);
        return;
      }
      const language = ["tr", "en", "ar"].includes(data.menu.menuLanguage)
        ? data.menu.menuLanguage
        : "tr";
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.title = `${data.menu.businessName} — AuraMenu`;
      renderTemplate(data.menu);
    } catch {
      locked();
    }
  }

  load();
})();
