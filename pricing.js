(() => {
  const config = window.AURA_MENU_CONFIG || {};
  let selfBuildPrice = Number(config.selfBuildPrice) || 1599;

  const applyBrandLogo = () => {
    if (document.getElementById("auramenu-brand-logo-style")) return;
    const style = document.createElement("style");
    style.id = "auramenu-brand-logo-style";
    style.textContent = `
      .brand-mark{
        width:36px!important;
        height:36px!important;
        display:grid!important;
        place-items:center!important;
        position:relative!important;
        border-radius:0!important;
        background:transparent!important;
        color:var(--orange,#ee6230)!important;
        font-family:Manrope,"DM Sans",Arial,sans-serif!important;
        font-size:27px!important;
        line-height:1!important;
        font-weight:900!important;
        letter-spacing:-.08em!important;
      }
      .brand-mark i{
        position:absolute!important;
        right:-1px!important;
        top:-2px!important;
        color:var(--orange,#ee6230)!important;
        font-size:14px!important;
        line-height:1!important;
        font-style:normal!important;
      }
    `;
    document.head.append(style);
  };

  const locale = () => {
    const language = document.documentElement.lang;
    if (language === "ar") return "ar";
    if (language === "en") return "en-US";
    return "tr-TR";
  };

  const format = (value = selfBuildPrice) =>
    `${new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 }).format(value)} ${config.currencyLabel || "TL"}`;

  const apply = () => {
    applyBrandLogo();
    document.querySelectorAll("[data-self-build-price]").forEach((element) => {
      element.textContent = format();
    });
  };

  const ready = fetch(`${config.apiBase}/pricing`, {
    headers: { Accept: "application/json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      const livePrice = Number(data?.selfBuildPrice);
      if (Number.isFinite(livePrice) && livePrice > 0) selfBuildPrice = livePrice;
      apply();
      return selfBuildPrice;
    })
    .catch(() => {
      apply();
      return selfBuildPrice;
    });

  window.AuraMenuPricing = Object.freeze({
    ready,
    apply,
    format,
    current: () => selfBuildPrice,
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
