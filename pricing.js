(() => {
  const config = window.AURA_MENU_CONFIG || {};
  let selfBuildPriceTry = Number(config.selfBuildPrice) || 1599;

  const COUNTRY_CACHE_KEY = "auramenuVisitorCountry";
  const COUNTRY_CACHE_MS = 24 * 60 * 60 * 1000;
  const FX_CACHE_KEY = "auramenuUsdFxRates";
  const FX_CACHE_MS = 6 * 60 * 60 * 1000;
  const CURRENCY_OVERRIDE_KEY = "auramenuCurrencyOverride";
  const COUNTRY_ENDPOINT = "https://api.country.is/";
  const FX_ENDPOINT = "https://open.er-api.com/v6/latest/USD";
  const SUPPORTED_CURRENCIES = new Set(["TRY", "USD", "TND"]);

  let visitorCountry = "";
  let selectedCurrency = "TRY";
  let usdRates = null;

  const safeStorageGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeStorageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage can be blocked in private/restricted browser modes.
    }
  };

  const safeStorageRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore restricted storage errors.
    }
  };

  const readTimedCache = (key, maxAge) => {
    const raw = safeStorageGet(key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.savedAt || Date.now() - parsed.savedAt > maxAge) return null;
      return parsed.value;
    } catch {
      return null;
    }
  };

  const writeTimedCache = (key, value) => {
    safeStorageSet(key, JSON.stringify({ savedAt: Date.now(), value }));
  };

  const fetchJson = async (url, timeoutMs = 4500) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  };

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
      .auramenu-currency-switcher{
        display:inline-flex;
        align-items:center;
        gap:6px;
        min-height:34px;
        padding:4px 8px;
        border:1px solid rgba(12,30,24,.12);
        border-radius:999px;
        background:#fffdf7;
        color:#0c1e18;
        box-shadow:0 6px 18px rgba(12,30,24,.05);
      }
      .auramenu-currency-switcher span{
        font-size:10px;
        font-weight:900;
        letter-spacing:.06em;
        text-transform:uppercase;
        opacity:.64;
      }
      .auramenu-currency-switcher select{
        appearance:none;
        border:0;
        outline:0;
        padding:3px 18px 3px 4px;
        background:linear-gradient(45deg,transparent 50%,#0c1e18 50%) calc(100% - 7px) 50%/5px 5px no-repeat;
        color:#0c1e18;
        font:800 11px/1.2 "DM Sans",Arial,sans-serif;
        cursor:pointer;
      }
      .auramenu-currency-switcher[data-auto="true"]::after{
        content:"●";
        color:#ee6230;
        font-size:8px;
      }
      @media(max-width:920px){
        .auramenu-currency-switcher{min-height:32px;padding:3px 7px}
        .auramenu-currency-switcher span{display:none}
      }
    `;
    document.head.append(style);
  };

  const siteLanguage = () => {
    const language = (document.documentElement.lang || "tr").toLowerCase();
    if (language.startsWith("ar")) return "ar";
    if (language.startsWith("en")) return "en";
    return "tr";
  };

  const localeForCurrency = (currency) => {
    const language = siteLanguage();
    if (currency === "TRY") return language === "ar" ? "ar" : language === "en" ? "en-US" : "tr-TR";
    if (currency === "TND") return language === "ar" ? "ar-TN" : language === "tr" ? "tr-TR" : "fr-TN";
    return language === "ar" ? "ar" : "en-US";
  };

  const currencyForCountry = (country) => {
    const code = String(country || "").toUpperCase();
    if (code === "TR") return "TRY";
    if (code === "TN") return "TND";
    return "USD";
  };

  const fallbackCountryFromBrowser = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (timezone === "Europe/Istanbul") return "TR";
    if (timezone === "Africa/Tunis") return "TN";
    return "";
  };

  const detectVisitorCountry = async () => {
    const cached = readTimedCache(COUNTRY_CACHE_KEY, COUNTRY_CACHE_MS);
    if (typeof cached === "string" && /^[A-Z]{2}$/.test(cached)) return cached;

    try {
      const data = await fetchJson(COUNTRY_ENDPOINT);
      const country = String(data?.country || "").toUpperCase();
      if (/^[A-Z]{2}$/.test(country)) {
        writeTimedCache(COUNTRY_CACHE_KEY, country);
        return country;
      }
    } catch {
      // Browser timezone is only a fallback when IP lookup is unavailable.
    }

    return fallbackCountryFromBrowser();
  };

  const loadUsdRates = async () => {
    const cached = readTimedCache(FX_CACHE_KEY, FX_CACHE_MS);
    if (cached && Number(cached.TRY) > 0 && Number(cached.TND) > 0) return cached;

    try {
      const data = await fetchJson(FX_ENDPOINT, 5500);
      const rates = {
        TRY: Number(data?.rates?.TRY),
        TND: Number(data?.rates?.TND),
        USD: 1,
        updatedAt: data?.time_last_update_utc || "",
      };
      if (rates.TRY > 0 && rates.TND > 0) {
        writeTimedCache(FX_CACHE_KEY, rates);
        return rates;
      }
    } catch {
      // Keep the site usable even if the FX provider is temporarily unavailable.
    }

    return null;
  };

  const convertedPrice = (currency = selectedCurrency) => {
    if (currency === "TRY") return selfBuildPriceTry;
    if (!usdRates || !(Number(usdRates.TRY) > 0)) return selfBuildPriceTry;

    const usdPrice = selfBuildPriceTry / Number(usdRates.TRY);
    if (currency === "USD") return usdPrice;
    if (currency === "TND" && Number(usdRates.TND) > 0) return usdPrice * Number(usdRates.TND);
    return selfBuildPriceTry;
  };

  const format = (value, currency = selectedCurrency) => {
    const numeric = Number.isFinite(Number(value)) ? Number(value) : convertedPrice(currency);
    const locale = localeForCurrency(currency);

    if (currency === "USD") {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numeric);
    }

    if (currency === "TND") {
      return `${new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(numeric)} TND`;
    }

    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(numeric)} TL`;
  };

  const labels = () => {
    const lang = siteLanguage();
    if (lang === "ar") return { title: "العملة", auto: "تلقائي" };
    if (lang === "en") return { title: "Currency", auto: "Auto" };
    return { title: "Para", auto: "Otomatik" };
  };

  const installCurrencySwitcher = () => {
    if (document.querySelector("[data-auramenu-currency-switcher]")) return;
    const headerActions = document.querySelector(".header-actions");
    if (!headerActions) return;

    const copy = labels();
    const wrapper = document.createElement("label");
    wrapper.className = "auramenu-currency-switcher";
    wrapper.setAttribute("data-auramenu-currency-switcher", "");
    wrapper.setAttribute("data-auto", safeStorageGet(CURRENCY_OVERRIDE_KEY) ? "false" : "true");
    wrapper.title = "Prices are converted using the current USD exchange rate.";
    wrapper.innerHTML = `
      <span>${copy.title}</span>
      <select aria-label="${copy.title}">
        <option value="AUTO">${copy.auto}</option>
        <option value="TRY">TRY</option>
        <option value="USD">USD</option>
        <option value="TND">TND</option>
      </select>
    `;

    const select = wrapper.querySelector("select");
    const override = safeStorageGet(CURRENCY_OVERRIDE_KEY);
    select.value = SUPPORTED_CURRENCIES.has(override) ? override : "AUTO";

    select.addEventListener("change", () => {
      const next = select.value;
      if (next === "AUTO") {
        safeStorageRemove(CURRENCY_OVERRIDE_KEY);
        selectedCurrency = currencyForCountry(visitorCountry || fallbackCountryFromBrowser());
        wrapper.setAttribute("data-auto", "true");
      } else if (SUPPORTED_CURRENCIES.has(next)) {
        safeStorageSet(CURRENCY_OVERRIDE_KEY, next);
        selectedCurrency = next;
        wrapper.setAttribute("data-auto", "false");
      }
      apply();
    });

    const languageSwitch = headerActions.querySelector(".language-switch");
    if (languageSwitch) languageSwitch.insertAdjacentElement("afterend", wrapper);
    else headerActions.prepend(wrapper);
  };

  const apply = () => {
    applyBrandLogo();
    installCurrencySwitcher();

    const amount = convertedPrice(selectedCurrency);
    document.querySelectorAll("[data-self-build-price]").forEach((element) => {
      element.textContent = format(amount, selectedCurrency);
      element.dataset.currency = selectedCurrency;
      element.title = selectedCurrency === "TRY"
        ? "Türkiye fiyatı"
        : "Current currency conversion based on USD exchange rates";
    });

    document.documentElement.dataset.currency = selectedCurrency;
    document.documentElement.dataset.country = visitorCountry || "unknown";
  };

  const ready = Promise.all([
    fetch(`${config.apiBase}/pricing`, { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const livePrice = Number(data?.selfBuildPrice);
        if (Number.isFinite(livePrice) && livePrice > 0) selfBuildPriceTry = livePrice;
      })
      .catch(() => null),
    detectVisitorCountry().then((country) => {
      visitorCountry = country;
    }),
    loadUsdRates().then((rates) => {
      usdRates = rates;
    }),
  ]).then(() => {
    const override = safeStorageGet(CURRENCY_OVERRIDE_KEY);
    selectedCurrency = SUPPORTED_CURRENCIES.has(override)
      ? override
      : currencyForCountry(visitorCountry || fallbackCountryFromBrowser());
    apply();
    return {
      priceTry: selfBuildPriceTry,
      country: visitorCountry,
      currency: selectedCurrency,
      rates: usdRates,
    };
  });

  window.AuraMenuPricing = Object.freeze({
    ready,
    apply,
    format,
    current: () => convertedPrice(selectedCurrency),
    currentTry: () => selfBuildPriceTry,
    currency: () => selectedCurrency,
    country: () => visitorCountry,
    setCurrency: (currency) => {
      const next = String(currency || "").toUpperCase();
      if (!SUPPORTED_CURRENCIES.has(next)) return false;
      safeStorageSet(CURRENCY_OVERRIDE_KEY, next);
      selectedCurrency = next;
      apply();
      return true;
    },
    useAutomaticCurrency: () => {
      safeStorageRemove(CURRENCY_OVERRIDE_KEY);
      selectedCurrency = currencyForCountry(visitorCountry || fallbackCountryFromBrowser());
      apply();
    },
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
})();
