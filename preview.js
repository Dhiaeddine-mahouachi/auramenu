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

  const words = demo.rtl
    ? { back: "كل التصاميم", preview: "معاينة حقيقية", switcher: "English", customize: "خصّص هذا التصميم", notice: "هذه معاينة. أضف رقم واتساب الحقيقي عند تخصيص قائمتك." }
    : { back: "All designs", preview: "Real menu preview", switcher: "العربية", customize: "Customize this design", notice: "This is a preview. Add your real WhatsApp number when you customize the menu." };

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
    const previous = document.querySelector(".aura-preview-notice");
    if (previous) previous.remove();
    const notice = document.createElement("div");
    notice.className = "aura-preview-notice";
    notice.setAttribute("role", "status");
    notice.textContent = words.notice;
    document.body.append(notice);
    setTimeout(() => notice.remove(), 3600);
  });
})();
