(() => {
  "use strict";

  // Load the original shared menu renderer first.
  const core = document.createElement("script");
  core.src = "preview-core.js";
  core.defer = false;
  document.head.append(core);

  // Nova/modern menus are rendered dynamically, so use delegated events.
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
  const observer = new MutationObserver(() => {
    const sheet = document.getElementById("sheet");
    if (!sheet) return;
    const open = sheet.classList.contains("show");
    sheet.setAttribute("aria-hidden", open ? "false" : "true");
    if (!open) {
      document.body.style.overflow = "";
      document.body.classList.remove("sheet-open");
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
})();
