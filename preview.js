(() => {
  "use strict";

  // Keep AuraDigital branding visible in the browser tab for every menu preview.
  if (!document.querySelector('link[data-auradigital-favicon]')) {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = "auradigital-mark.svg";
    icon.setAttribute("data-auradigital-favicon", "");
    document.head.appendChild(icon);
  }

  // Nova/modern menus are rendered dynamically, so use delegated events.
  if (!document.getElementById("sheet")) return;

  function closeNovaSheet() {
    const sheet = document.getElementById("sheet");
    if (!sheet || !sheet.classList.contains("show")) return;
    sheet.classList.remove("show");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.body.classList.remove("sheet-open");
  }

  document.addEventListener("click", (event) => {
    const sheet = document.getElementById("sheet");
    if (!sheet || !sheet.classList.contains("show")) return;

    // Keep WhatsApp/order links interactive.
    if (event.target.closest(".order-btn")) return;

    // Close from X or by tapping the enlarged product image.
    if (event.target.closest(".close") || event.target.closest(".sheet-img")) {
      event.preventDefault();
      event.stopPropagation();
      closeNovaSheet();
      return;
    }

    // Tap anywhere outside the bottom sheet to dismiss it.
    if (!event.target.closest("#sheet")) {
      closeNovaSheet();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNovaSheet();
  });

  // Keep body scroll usable after the renderer opens/closes a Nova product.
  const sheetObserver = new MutationObserver(([{target: sheet}]) => {
    const open = sheet.classList.contains("show");
    sheet.setAttribute("aria-hidden", String(!open));
    if (open) return;
    document.body.style.overflow = "";
    document.body.classList.remove("sheet-open");
  });

  function observeSheet() {
    sheetObserver.disconnect();
    const sheet = document.getElementById("sheet");
    if (sheet) sheetObserver.observe(sheet, { attributeFilter: ["class"] });
  }

  observeSheet();
  if (document.documentElement.classList.contains("aura-embedded-template")) {
    new MutationObserver(observeSheet).observe(document.body, { childList: true });
  }
})();
