window.AURA_MENU_CONFIG = Object.freeze({
  apiBase: "https://auradigital.ink/api/auramenu",
  publicBase: "https://auramenu.space",
  dashboardUrl: "https://auradigital.ink/admin/#auramenu",
  selfBuildPrice: 1599,
  currencyLabel: "TL",
});

(() => {
  const labels = {
    tr: { hero: "Mevcut menümü yönet ↗", status: "Menümü Yönet ↗" },
    en: { hero: "Manage existing menu ↗", status: "Manage my menu ↗" },
    ar: { hero: "إدارة قائمتي الحالية ↗", status: "إدارة قائمتي ↗" },
  };

  function installAuraMenuUi() {
    if (!document.querySelector('link[data-auradigital-favicon]')) {
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/svg+xml";
      icon.href = "logo.svg?v=2";
      icon.setAttribute("data-auradigital-favicon", "");
      document.head.appendChild(icon);
    }

    // Keep the AuraMenu header clean: no AuraDigital badge and no dashboard button in the nav.
    document.querySelectorAll("[data-auradigital-visible-brand], [data-menu-dashboard-link]").forEach(element => element.remove());

    if (!document.getElementById("aura-menu-management-styles")) {
      const style = document.createElement("style");
      style.id = "aura-menu-management-styles";
      style.textContent = `
        .manage-menu-hero{
          min-height:60px;
          padding:8px 22px 8px 9px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:12px;
          border:1px solid rgba(12,30,24,.12);
          border-radius:999px;
          color:#fff;
          background:linear-gradient(135deg,#167a5a,#115f47);
          box-shadow:0 16px 34px rgba(22,122,90,.22);
          font-size:13px;
          font-weight:950;
          letter-spacing:-.01em;
          transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;
        }
        .manage-menu-hero::before{
          content:"↻";
          width:40px;
          height:40px;
          flex:0 0 40px;
          display:grid;
          place-items:center;
          border-radius:50%;
          color:#0c1e18;
          background:#d8ff45;
          font-size:20px;
          font-weight:900;
          box-shadow:inset 0 0 0 1px rgba(12,30,24,.08);
        }
        .manage-menu-hero:hover{
          transform:translateY(-2px);
          filter:saturate(1.08) brightness(1.03);
          box-shadow:0 20px 42px rgba(22,122,90,.28);
        }
        @media(max-width:760px){
          .manage-menu-hero{width:100%;min-height:58px}
        }
      `;
      document.head.appendChild(style);
    }
  }

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

    // Do not add a "Manage my menu" link to the top navigation.
    document.querySelectorAll("[data-menu-dashboard-link]").forEach(element => element.remove());

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

  function bootAuraMenuUi() {
    installAuraMenuUi();
    applyDashboardLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAuraMenuUi);
  } else {
    bootAuraMenuUi();
  }

  document.addEventListener("click", event => {
    const languageButton = event.target.closest?.("[data-lang]");
    if (!languageButton) return;
    setTimeout(() => applyDashboardLinks(languageButton.dataset.lang), 0);
  });
})();
