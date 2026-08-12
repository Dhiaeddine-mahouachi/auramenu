(() => {
  "use strict";

  const file = location.pathname.split("/").pop() || "";
  const demos = {
    "c.html": { template: "modern", pair: "1.html", language: "English", rtl: false },
    "1.html": { template: "modern", pair: "c.html", language: "العربية", rtl: true },
    "b.html": { template: "orbit", pair: "2.html", language: "English", rtl: false },
    "2.html": { template: "orbit", pair: "b.html", language: "العربية", rtl: true },
    "a.html": { template: "maison", pair: "3.html", language: "English", rtl: false },
    "3.html": { template: "maison", pair: "a.html", language: "العربية", rtl: true },
    "d.html": { template: "taste3d", pair: "4.html", language: "English", rtl: false },
    "4.html": { template: "taste3d", pair: "d.html", language: "العربية", rtl: true },
  };
  const demo = demos[file];
  if (!demo) return;

  const embedded = new URLSearchParams(location.search).get("embedded") === "1";
  if (embedded) startEmbeddedTemplate();
  else startDemoControls();

  function startDemoControls() {
    const words = demo.rtl
      ? {
          back: "كل التصاميم",
          preview: "معاينة حقيقية",
          switcher: "English",
          customize: "خصّص هذا التصميم",
          notice: "هذه معاينة. أضف رقم واتساب الحقيقي عند تخصيص قائمتك.",
        }
      : {
          back: "All designs",
          preview: "Real menu preview",
          switcher: "العربية",
          customize: "Customize this design",
          notice: "This is a preview. Add your real WhatsApp number when you customize the menu.",
        };

    const bar = document.createElement("nav");
    bar.className = "aura-preview-bar";
    bar.setAttribute("aria-label", "AuraMenu preview controls");
    bar.innerHTML = `
      <a href="index.html#templates" aria-label="${words.back}">← ${words.back}</a>
      <span class="aura-preview-bar__brand"><span class="aura-preview-bar__mark">A</span><span class="aura-preview-bar__label">${words.preview}</span></span>
      <a href="${demo.pair}">${words.switcher}</a>
      <a class="aura-preview-bar__cta" href="builder.html?template=${demo.template}">${words.customize}</a>`;
    document.body.append(bar);

    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href*="wa.me/905555555555"]');
      if (!link) return;
      event.preventDefault();
      document.querySelector(".aura-preview-notice")?.remove();
      const notice = document.createElement("div");
      notice.className = "aura-preview-notice";
      notice.setAttribute("role", "status");
      notice.textContent = words.notice;
      document.body.append(notice);
      setTimeout(() => notice.remove(), 3600);
    });
  }

  function startEmbeddedTemplate() {
    document.documentElement.classList.add("aura-embedded-template");
    window.addEventListener("message", (event) => {
      if (location.origin !== "null" && event.origin !== location.origin) return;
      if (event.source !== window.parent) return;
      if (event.data?.type !== "auramenu:render" || !event.data.menu) return;
      renderCustomerMenu(event.data.menu, Boolean(event.data.draft));
    });
    window.parent.postMessage(
      { type: "auramenu:template-ready", template: demo.template },
      location.origin === "null" ? "*" : location.origin,
    );
  }

  const translations = {
    tr: {
      menu: "Menü",
      order: "WhatsApp ile sipariş",
      select: "Seç",
      selected: "seçildi",
      search: "Menüde ara...",
      tap: "Ürüne dokunun",
      home: "Ana sayfa",
      view: "Menüyü gör",
      back: "Yukarı dön",
      empty: "Bu kategoride henüz ürün yok.",
      premium: "Dijital restoran menüsü",
    },
    en: {
      menu: "Menu",
      order: "Order on WhatsApp",
      select: "Select",
      selected: "selected",
      search: "Search the menu...",
      tap: "Tap a product",
      home: "Home",
      view: "View menu",
      back: "Back to top",
      empty: "No products in this category yet.",
      premium: "Digital restaurant menu",
    },
    ar: {
      menu: "القائمة",
      order: "اطلب عبر واتساب",
      select: "اختر",
      selected: "تم الاختيار",
      search: "ابحث في القائمة...",
      tap: "اضغط على المنتج",
      home: "الرئيسية",
      view: "شاهد القائمة",
      back: "العودة للأعلى",
      empty: "لا توجد منتجات في هذا القسم بعد.",
      premium: "قائمة مطعم رقمية",
    },
  };
  const symbols = { TRY: "₺", EUR: "€", USD: "$", TND: "د.ت" };

  function esc(value) {
    return String(value ?? "").replace(
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
  }

  function normalizeMenu(value, draft) {
    const language = ["tr", "en", "ar"].includes(value.menuLanguage)
      ? value.menuLanguage
      : "tr";
    const categories = Array.isArray(value.categories)
      ? value.categories.map((category, categoryIndex) => ({
          name: String(category?.name || `${translations[language].menu} ${categoryIndex + 1}`),
          emoji: String(category?.emoji || "🍽️"),
          items: Array.isArray(category?.items)
            ? category.items.map((item) => ({
                name: String(item?.name || ""),
                description: String(item?.description || ""),
                price: String(item?.price || ""),
                imageUrl: String(item?.imageUrl || ""),
                featured: Boolean(item?.featured),
              }))
            : [],
        }))
      : [];
    return {
      ...value,
      draft,
      menuLanguage: language,
      businessName: String(value.businessName || "Aura Restaurant"),
      tagline: String(value.tagline || value.description || translations[language].premium),
      description: String(value.description || ""),
      address: String(value.address || ""),
      openingHours: String(value.openingHours || ""),
      whatsapp: String(value.whatsapp || ""),
      currency: String(value.currency || "TRY"),
      categories: categories.length
        ? categories
        : [{ name: translations[language].menu, emoji: "🍽️", items: [] }],
    };
  }

  function fallbackImage(name, emoji = "🍽️") {
    const safeName = String(name || "Menu").replace(/[&<>"']/g, "").slice(0, 35);
    const safeEmoji = String(emoji || "🍽️").replace(/[&<>"']/g, "").slice(0, 8);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="680" viewBox="0 0 900 680">
        <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff3df"/><stop offset="1" stop-color="#efb067"/></linearGradient></defs>
        <rect width="900" height="680" rx="48" fill="url(#g)"/>
        <text x="50%" y="43%" text-anchor="middle" font-size="120">${safeEmoji}</text>
        <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="48" font-weight="800" fill="#281a12">${safeName}</text>
      </svg>`)}`;
  }

  function safeImage(item, category) {
    const source = item?.imageUrl || "";
    if (/^https?:\/\//i.test(source) || /^data:image\/(?:jpeg|png|webp);base64,/i.test(source)) {
      return source;
    }
    return fallbackImage(item?.name, category?.emoji);
  }

  function priceText(item, menu) {
    const value = String(item?.price || "—");
    const symbol = symbols[menu.currency] || menu.currency;
    if (!symbol || value.includes(symbol) || /\b(?:TRY|EUR|USD|TND)\b/i.test(value)) return value;
    return `${value} ${symbol}`;
  }

  function whatsappUrl(menu, item, category) {
    const digits = menu.whatsapp.replace(/\D/g, "");
    if (menu.draft || !digits) return "#";
    const message = item
      ? `${item.name} · ${priceText(item, menu)}`
      : `${menu.businessName} · ${category?.name || translations[menu.menuLanguage].menu}`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }

  function setDocument(menu) {
    document.documentElement.lang = menu.menuLanguage;
    document.documentElement.dir = menu.menuLanguage === "ar" ? "rtl" : "ltr";
    document.body.dir = menu.menuLanguage === "ar" ? "rtl" : "ltr";
    document.title = `${menu.businessName} — AuraMenu`;
  }

  function renderCustomerMenu(value, draft) {
    const menu = normalizeMenu(value, draft);
    setDocument(menu);
    if (demo.template === "modern") renderModern(menu);
    else if (demo.template === "orbit") renderOrbit(menu);
    else if (demo.template === "maison") renderMaison(menu);
    else renderTaste3d(menu);
    if (menu.draft) {
      document.querySelectorAll('a[href="#"]').forEach((link) =>
        link.addEventListener("click", (event) => event.preventDefault()),
      );
    }
  }

  function renderMaison(menu) {
    const t = translations[menu.menuLanguage];
    let activeCategory = menu.categories[0];
    let activeIndex = 0;
    const heroImage = safeImage(activeCategory.items[0], activeCategory);
    document.body.id = "";
    document.body.innerHTML = `
      <div class="page">
        <header class="header">
          <nav class="nav"><div class="logo">${esc(menu.businessName)}</div><a data-main-order href="${esc(whatsappUrl(menu))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a></nav>
          <div class="hero-copy"><div class="kicker">${esc(menu.address || menu.openingHours || t.premium)}</div><h1>${esc(menu.businessName)}</h1><p>${esc(menu.tagline)}</p></div>
        </header>
        <div class="mobile-tabs" id="mobileTabs"></div>
        <section class="menu-shell">
          <aside class="sidebar"><h2>${esc(t.menu)}</h2><div id="desktopCats"></div></aside>
          <main class="content">
            <section class="feature fade-in" id="feature"><div class="feature-media"><img id="featureImg" alt=""></div><div class="feature-text"><div class="feature-label" id="featureCat"></div><h2 id="featureName"></h2><p id="featureDesc"></p><div class="feature-price" id="featurePrice"></div><a class="order" id="orderBtn" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a></div></section>
            <section class="products" id="products"></section>
          </main>
        </section>
      </div><div class="float-word">${esc(menu.openingHours || "AURAMENU")}</div><div class="toast" id="toast"></div>`;
    document.querySelector(".header").style.backgroundImage =
      `linear-gradient(rgba(32,21,15,.42),rgba(32,21,15,.62)),url("${heroImage.replace(/["\\\n\r]/g, "")}")`;

    const categoryButtons = (target) => {
      target.innerHTML = "";
      menu.categories.forEach((category) => {
        const button = document.createElement("button");
        button.className = `cat-btn${category === activeCategory ? " active" : ""}`;
        button.innerHTML = `<span>${esc(category.emoji)} ${esc(category.name)}</span><strong>${category.items.length}</strong>`;
        button.addEventListener("click", () => {
          activeCategory = category;
          activeIndex = 0;
          document.querySelectorAll(".cat-btn").forEach((item) =>
            item.classList.toggle("active", item.querySelector("span").textContent === `${category.emoji} ${category.name}`),
          );
          renderAll();
        });
        target.append(button);
      });
    };
    categoryButtons(document.getElementById("desktopCats"));
    categoryButtons(document.getElementById("mobileTabs"));

    const renderFeature = () => {
      const item = activeCategory.items[activeIndex];
      const feature = document.getElementById("feature");
      if (!item) {
        feature.innerHTML = `<p style="padding:40px">${esc(t.empty)}</p>`;
        return;
      }
      feature.innerHTML = `<div class="feature-media"><img src="${esc(safeImage(item, activeCategory))}" alt="${esc(item.name)}"></div><div class="feature-text"><div class="feature-label">${esc(activeCategory.emoji)} ${esc(activeCategory.name)}</div><h2>${esc(item.name)}</h2><p>${esc(item.description)}</p><div class="feature-price">${esc(priceText(item, menu))}</div><a class="order" href="${esc(whatsappUrl(menu, item, activeCategory))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a></div>`;
    };
    const renderProducts = () => {
      document.getElementById("products").innerHTML = activeCategory.items.length
        ? activeCategory.items
            .map(
              (item, index) => `<button class="card fade-in${index === activeIndex ? " active" : ""}" data-index="${index}"><div class="card-img"><img src="${esc(safeImage(item, activeCategory))}" alt="${esc(item.name)}" loading="lazy"></div><div class="card-body"><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="card-price">${esc(priceText(item, menu))}</div></div></button>`,
            )
            .join("")
        : `<p>${esc(t.empty)}</p>`;
      document.querySelectorAll(".card[data-index]").forEach((card) =>
        card.addEventListener("click", () => {
          activeIndex = Number(card.dataset.index);
          renderAll();
          const toast = document.getElementById("toast");
          toast.textContent = `${activeCategory.items[activeIndex].name} ${t.selected}`;
          toast.classList.add("show");
          setTimeout(() => toast.classList.remove("show"), 1200);
        }),
      );
    };
    const renderAll = () => {
      renderFeature();
      renderProducts();
    };
    renderAll();
  }

  function renderOrbit(menu) {
    const t = translations[menu.menuLanguage];
    let activeCategory = menu.categories[0];
    let activeItem = activeCategory.items[0] || null;
    document.body.id = "";
    document.body.innerHTML = `
      <div class="app">
        <header class="header"><div class="logo"><div class="logo-dot">◉</div> ${esc(menu.businessName)}</div><a class="order-link" href="${esc(whatsappUrl(menu))}" target="_blank" rel="noopener noreferrer">WhatsApp</a></header>
        <section class="hero"><div class="left"><h1>${esc(menu.businessName)}</h1><p>${esc(menu.tagline)}</p><div class="chips">${[menu.address, menu.openingHours, t.premium].filter(Boolean).map((text) => `<span class="chip">${esc(text)}</span>`).join("")}</div></div><div class="orbit" id="orbit"><div class="spotlight" id="spotlight"></div></div></section>
        <section class="menu-list"><div class="list-head"><h2 id="listTitle"></h2><select class="select" id="select"></select></div><div class="grid" id="grid"></div></section>
      </div><div class="drawer" id="drawer"></div>`;
    const orbit = document.getElementById("orbit");
    const select = document.getElementById("select");
    menu.categories.forEach((category, index) => {
      if (index < 6) {
        const planet = document.createElement("button");
        planet.className = `planet p${index + 1}${category === activeCategory ? " active" : ""}`;
        planet.innerHTML = `<img src="${esc(safeImage(category.items[0], category))}" alt="${esc(category.name)}">`;
        planet.addEventListener("click", () => setCategory(category));
        orbit.append(planet);
      }
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `${category.emoji} ${category.name}`;
      select.append(option);
    });
    select.addEventListener("change", () => setCategory(menu.categories[Number(select.value)]));

    function setCategory(category) {
      activeCategory = category;
      activeItem = category.items[0] || null;
      select.value = String(menu.categories.indexOf(category));
      document.querySelectorAll(".planet").forEach((planet, index) =>
        planet.classList.toggle("active", menu.categories[index] === category),
      );
      renderSpotlight();
      renderGrid();
    }
    function renderSpotlight() {
      const spotlight = document.getElementById("spotlight");
      spotlight.innerHTML = activeItem
        ? `<div class="spot-img"><img src="${esc(safeImage(activeItem, activeCategory))}" alt="${esc(activeItem.name)}"></div><div class="spot-body"><div class="label">${esc(activeCategory.emoji)} ${esc(activeCategory.name)}</div><h2>${esc(activeItem.name)}</h2><p>${esc(activeItem.description)}</p><div class="spot-bottom"><div class="price">${esc(priceText(activeItem, menu))}</div><button class="add" id="spotAdd">${esc(t.select)}</button></div></div>`
        : `<div class="spot-body"><p>${esc(t.empty)}</p></div>`;
      document.getElementById("spotAdd")?.addEventListener("click", () => openDrawer(activeItem));
    }
    function renderGrid() {
      document.getElementById("listTitle").textContent = `${activeCategory.emoji} ${activeCategory.name}`;
      document.getElementById("grid").innerHTML = activeCategory.items.length
        ? activeCategory.items
            .map(
              (item, index) => `<article class="item" data-index="${index}"><div class="item-img"><img src="${esc(safeImage(item, activeCategory))}" alt="${esc(item.name)}" loading="lazy"></div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="price">${esc(priceText(item, menu))}</div></article>`,
            )
            .join("")
        : `<p>${esc(t.empty)}</p>`;
      document.querySelectorAll(".item[data-index]").forEach((card) =>
        card.addEventListener("click", () => {
          activeItem = activeCategory.items[Number(card.dataset.index)];
          renderSpotlight();
          openDrawer(activeItem);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }),
      );
    }
    function openDrawer(item) {
      if (!item) return;
      const drawer = document.getElementById("drawer");
      drawer.innerHTML = `<div class="drawer-img"><img src="${esc(safeImage(item, activeCategory))}" alt="${esc(item.name)}"></div><div><h3>${esc(item.name)}</h3><p>${esc(priceText(item, menu))}</p></div><a href="${esc(whatsappUrl(menu, item, activeCategory))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a>`;
      drawer.classList.add("show");
    }
    setCategory(activeCategory);
  }

  function renderModern(menu) {
    const t = translations[menu.menuLanguage];
    let activeCategory = menu.categories[0];
    document.body.id = "";
    document.body.innerHTML = `
      <div class="app">
        <header class="topbar"><div class="brand-row"><div class="logo"><div class="logo-icon">🍽️</div> ${esc(menu.businessName)}</div><a class="cart" href="${esc(whatsappUrl(menu))}" target="_blank" rel="noopener noreferrer">💬</a></div><input class="search" id="search" placeholder="${esc(t.search)}"></header>
        <nav class="categories" id="categories"></nav>
        <section class="hero"><div class="hero-card"><h1>${esc(menu.businessName)}</h1><p>${esc(menu.tagline)}</p><div class="hero-floating"><img src="${esc(safeImage(activeCategory.items[0], activeCategory))}" alt=""></div></div></section>
        <section><div class="section-head"><h2 id="currentTitle"></h2><span>${esc(t.tap)}</span></div><div class="grid" id="products"></div></section>
      </div>
      <div class="sheet" id="sheet"></div>
      <nav class="bottom-nav"><a href="#"><b>🏠</b>${esc(t.home)}</a><a href="#products"><b>🍔</b>${esc(t.menu)}</a><a href="${esc(whatsappUrl(menu))}" target="_blank" rel="noopener noreferrer"><b>💬</b>${esc(t.order)}</a></nav>`;
    const categoriesElement = document.getElementById("categories");
    menu.categories.forEach((category) => {
      const button = document.createElement("button");
      button.className = `cat${category === activeCategory ? " active" : ""}`;
      button.textContent = `${category.emoji} ${category.name}`;
      button.addEventListener("click", () => {
        activeCategory = category;
        document.querySelectorAll(".cat").forEach((item) => item.classList.toggle("active", item === button));
        document.getElementById("search").value = "";
        renderProducts(category.items, category.name);
      });
      categoriesElement.append(button);
    });
    function renderProducts(items, title) {
      document.getElementById("currentTitle").textContent = title;
      document.getElementById("products").innerHTML = items.length
        ? items
            .map(
              (item, index) => `<article class="food-card reveal" data-index="${index}"><div class="food-img"><img src="${esc(safeImage(item, activeCategory))}" alt="${esc(item.name)}" loading="lazy"></div><div class="food-info"><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><div class="price-row"><div class="price">${esc(priceText(item, menu))}</div><button class="plus" aria-label="${esc(t.select)}">+</button></div></div></article>`,
            )
            .join("")
        : `<p>${esc(t.empty)}</p>`;
      document.querySelectorAll(".food-card[data-index]").forEach((card) =>
        card.addEventListener("click", () => openSheet(items[Number(card.dataset.index)])),
      );
    }
    function openSheet(item) {
      const sheet = document.getElementById("sheet");
      sheet.innerHTML = `<button class="close" id="closeSheet">×</button><div class="sheet-img"><img src="${esc(safeImage(item, activeCategory))}" alt="${esc(item.name)}"></div><div class="sheet-content"><h2>${esc(item.name)}</h2><p>${esc(item.description)}</p><div class="sheet-price">${esc(priceText(item, menu))}</div><a class="order-btn" href="${esc(whatsappUrl(menu, item, activeCategory))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a></div>`;
      sheet.classList.add("show");
      document.getElementById("closeSheet").addEventListener("click", () => sheet.classList.remove("show"));
    }
    document.getElementById("search").addEventListener("input", (event) => {
      const query = event.target.value.toLocaleLowerCase(menu.menuLanguage).trim();
      const items = query
        ? menu.categories.flatMap((category) => category.items).filter((item) =>
            `${item.name} ${item.description}`.toLocaleLowerCase(menu.menuLanguage).includes(query),
          )
        : activeCategory.items;
      renderProducts(items, query ? t.search.replace("...", "") : activeCategory.name);
    });
    renderProducts(activeCategory.items, activeCategory.name);
  }

  function renderTaste3d(menu) {
    const t = translations[menu.menuLanguage];
    document.body.id = "top";
    document.body.innerHTML = `
      <nav class="nav"><div class="nav-inner"><div class="logo">${esc(menu.businessName)}</div><div class="nav-links">${menu.categories.map((category, index) => `<a href="#category-${index}">${esc(category.name)}</a>`).join("")}</div></div></nav>
      <section class="hero"><div><div class="badge">${esc(menu.address || t.premium)}</div><h1>${esc(menu.businessName)}</h1><p>${esc(menu.tagline)}</p><div class="hero-actions"><a class="btn orange" href="#category-0">${esc(t.view)}</a><a class="btn" href="${esc(whatsappUrl(menu))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a></div></div></section>
      <main id="menu">${menu.categories.map((category, categoryIndex) => renderTasteCategory(category, categoryIndex, menu, t)).join("")}</main>
      <a class="whatsapp" href="${esc(whatsappUrl(menu))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a>`;
    document.querySelectorAll(".menu-block").forEach((block) => {
      const categoryIndex = Number(block.dataset.category);
      const category = menu.categories[categoryIndex];
      block.querySelectorAll(".product-btn").forEach((button) =>
        button.addEventListener("click", () => {
          const itemIndex = Number(button.dataset.index);
          const item = category.items[itemIndex];
          block.querySelectorAll(".product-btn").forEach((candidate) => candidate.classList.toggle("active", candidate === button));
          block.querySelector(".featured-img").src = safeImage(item, category);
          block.querySelector(".featured-img").alt = item.name;
          block.querySelector(".featured-name").textContent = item.name;
          block.querySelector(".featured-desc").textContent = item.description;
          block.querySelector(".feature-price").textContent = priceText(item, menu);
          block.querySelector(".order-row .orange").href = whatsappUrl(menu, item, category);
        }),
      );
    });
  }

  function renderTasteCategory(category, categoryIndex, menu, t) {
    const first = category.items[0];
    if (!first) {
      return `<section class="section" id="category-${categoryIndex}"><div class="wrap"><div class="section-head"><h2 class="section-title">${esc(category.emoji)} ${esc(category.name)}</h2><p class="section-sub">${esc(t.empty)}</p></div></div></section>`;
    }
    return `<section class="section" id="category-${categoryIndex}"><div class="wrap"><div class="section-head"><h2 class="section-title">${esc(category.emoji)} ${esc(category.name)}<br><span>${esc(t.menu)}</span></h2><p class="section-sub">${esc(menu.description || menu.tagline)}</p></div><div class="menu-block" data-category="${categoryIndex}"><div class="stage"><div class="featured"><div class="photo-frame"><img class="featured-img" src="${esc(safeImage(first, category))}" alt="${esc(first.name)}" loading="lazy"></div><div class="feature-info"><h3 class="featured-name">${esc(first.name)}</h3><p class="featured-desc">${esc(first.description)}</p><div class="feature-price">${esc(priceText(first, menu))}</div></div></div></div><div><div class="products">${category.items.map((item, itemIndex) => `<button class="product-btn${itemIndex === 0 ? " active" : ""}" data-index="${itemIndex}"><strong>${esc(item.name)}</strong><span>${esc(priceText(item, menu))}</span></button>`).join("")}</div><div class="order-row"><a class="btn orange" href="${esc(whatsappUrl(menu, first, category))}" target="_blank" rel="noopener noreferrer">${esc(t.order)}</a><a class="btn" href="#top">${esc(t.back)}</a></div></div></div></div></section>`;
  }
})();
