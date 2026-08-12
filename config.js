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

  function installAuraDigitalBranding() {
    if (!document.querySelector('link[data-auradigital-favicon]')) {
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/svg+xml";
      icon.href = "auradigital-mark.svg";
      icon.setAttribute("data-auradigital-favicon", "");
      document.head.appendChild(icon);
    }

    if (!document.getElementById("aura-menu-management-styles")) {
      const style = document.createElement("style");
      style.id = "aura-menu-management-styles";
      style.textContent = `
        .manage-menu-nav{
          display:inline-flex!important;
          align-items:center;
          justify-content:center;
          min-height:36px;
          padding:0 14px!important;
          border:1px solid rgba(22,122,90,.28);
          border-radius:999px;
          color:#0c1e18!important;
          background:#edf5ea;
          font-weight:900!important;
          transition:transform .18s ease,background .18s ease,box-shadow .18s ease;
        }
        .manage-menu-nav:hover{
          color:#0c1e18!important;
          background:#d8ff45;
          transform:translateY(-1px);
          box-shadow:0 8px 20px rgba(12,30,24,.12);
        }
        .manage-menu-hero{
          min-height:60px;
          padding:8px 22px 8px 9px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:12px;
          border:2px solid #d8ff45;
          border-radius:999px;
          color:#fff;
          background:#0c1e18;
          box-shadow:0 16px 34px rgba(12,30,24,.22);
          font-size:13px;
          font-weight:950;
          letter-spacing:-.01em;
          transition:transform .18s ease,box-shadow .18s ease,background .18s ease;
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
        }
        .manage-menu-hero:hover{
          transform:translateY(-2px);
          background:#163429;
          box-shadow:0 20px 42px rgba(12,30,24,.28);
        }
        @media(max-width:920px){
          .main-nav .manage-menu-nav{width:100%;min-height:44px;margin-top:5px}
        }
        @media(max-width:760px){
          .manage-menu-hero{width:100%;min-height:58px}
        }
      `;
      document.head.appendChild(style);
    }
  }

  installAuraDigitalBranding();

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
