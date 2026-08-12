window.AURA_MENU_CONFIG = Object.freeze({
  apiBase: "https://auradigital.ink/api/auramenu",
  publicBase: "https://auramenu.space",
  dashboardUrl: "https://auradigital.ink/admin/#auramenu",
  selfBuildPrice: 1599,
  currencyLabel: "TL",
});

(() => {
  const labels = {
    tr: { nav: "Menümü Yönet", hero: "Mevcut menümü yönet ↗", status: "Menümü Yönet ↗" },
    en: { nav: "Manage my menu", hero: "Manage existing menu ↗", status: "Manage my menu ↗" },
    ar: { nav: "إدارة قائمتي", hero: "إدارة قائمتي الحالية ↗", status: "إدارة قائمتي ↗" },
  };

  const currentLanguage = () => {
    const params = new URLSearchParams(location.search);
    const requested = params.get("lang");
    if (["tr", "en", "ar"].includes(requested)) return requested;
    const saved = localStorage.getItem("auraMenuUiLanguage");
    return ["tr", "en", "ar"].includes(saved) ? saved : "tr";
  };

  const dashboardHref = () => {
    const requestId = new URLSearchParams(location.search).get("id") || localStorage.getItem("auraMenuLastRequest") || "";
    return requestId ? `dashboard.html?id=${encodeURIComponent(requestId)}` : "dashboard.html";
  };

  function applyDashboardLinks(language = currentLanguage()) {
    const copy = labels[language] || labels.tr;
    const href = dashboardHref();

    const nav = document.querySelector(".main-nav");
    if (nav) {
      let link = nav.querySelector("[data-menu-dashboard-link]");
      if (!link) {
        link = document.createElement("a");
        link.setAttribute("data-menu-dashboard-link", "");
        nav.appendChild(link);
      }
      link.href = href;
      link.textContent = copy.nav;
      link.classList.add("manage-menu-nav");
    }

    const heroActions = document.querySelector(".hero-actions");
    if (heroActions) {
      let link = heroActions.querySelector("[data-menu-dashboard-hero]");
      if (!link) {
        link = document.createElement("a");
        link.setAttribute("data-menu-dashboard-hero", "");
        heroActions.appendChild(link);
      }
      link.href = href;
      link.textContent = copy.hero;
      link.className = "manage-menu-hero";
    }

    const statusShortcut = document.getElementById("dashboardShortcut");
    if (statusShortcut) {
      statusShortcut.href = href;
      statusShortcut.textContent = copy.status;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyDashboardLinks());
  } else {
    applyDashboardLinks();
  }

  document.addEventListener("click", event => {
    const languageButton = event.target.closest?.("[data-lang]");
    if (!languageButton) return;
    setTimeout(() => applyDashboardLinks(languageButton.dataset.lang), 0);
  });
})();
