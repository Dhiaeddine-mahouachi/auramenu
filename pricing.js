(() => {
  const config = window.AURA_MENU_CONFIG || {};
  let selfBuildPrice = Number(config.selfBuildPrice) || 1599;

  const locale = () => {
    const language = document.documentElement.lang;
    if (language === "ar") return "ar";
    if (language === "en") return "en-US";
    return "tr-TR";
  };

  const format = (value = selfBuildPrice) =>
    `${new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 }).format(value)} ${config.currencyLabel || "TL"}`;

  const apply = () => {
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
