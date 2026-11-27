/* AuraMenu builder: keep the draft in the AuraDigital account so it survives a new device.
   The builder still saves to this browser first (auraMenuDraft + auraMenuExtras); this script
   mirrors that snapshot to /api/auramenu/account/drafts/builder when the person is signed in. */
(function () {
  "use strict";
  const URL_ = "/api/auramenu/account/drafts/builder", KEYS = ["auraMenuDraft", "auraMenuExtras"], STAMP = "auraMenuCloudDraft";
  const copy = {
    en: { signIn: "Sign in to keep this draft on all your devices", saving: "Saving to your account…", saved: "Saved to your account", offline: "Saved on this device only", found: "You have a draft saved in your account", cont: "Continue it", fresh: "Keep this one", newer: "This draft changed on another device", load: "Load it" },
    tr: { signIn: "Bu taslağı tüm cihazlarında tutmak için giriş yap", saving: "Hesabına kaydediliyor…", saved: "Hesabına kaydedildi", offline: "Yalnızca bu cihazda kayıtlı", found: "Hesabında kayıtlı bir taslak var", cont: "Devam et", fresh: "Bunu kullan", newer: "Bu taslak başka bir cihazda değişti", load: "Onu yükle" },
    ar: { signIn: "سجّل الدخول لحفظ هذه المسودة على كل أجهزتك", saving: "جارٍ الحفظ في حسابك…", saved: "محفوظة في حسابك", offline: "محفوظة على هذا الجهاز فقط", found: "لديك مسودة محفوظة في حسابك", cont: "تابعها", fresh: "احتفظ بهذه", newer: "تغيّرت هذه المسودة على جهاز آخر", load: "حمّلها" },
    fr: { signIn: "Connectez-vous pour garder ce brouillon sur tous vos appareils", saving: "Enregistrement dans votre compte…", saved: "Enregistré dans votre compte", offline: "Enregistré sur cet appareil uniquement", found: "Un brouillon est enregistré dans votre compte", cont: "Le reprendre", fresh: "Garder celui-ci", newer: "Ce brouillon a changé sur un autre appareil", load: "Le charger" },
  };
  const t = (k) => (copy[(document.documentElement.lang || "en").slice(0, 2)] || copy.en)[k];
  const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } };
  const snapshot = () => { const d = read("auraMenuDraft"); return d ? { draft: d, extras: read("auraMenuExtras") || {} } : null; };
  // The builder writes a default draft on first load; that one holds nothing worth keeping.
  const blank = (snap) => !snap || (!String(snap.draft?.fields?.businessName || "").trim() && !(snap.draft?.categories || []).some((c) => (c.items || []).some((i) => String(i.name || "").trim())));
  const stamp = () => read(STAMP) || {};
  const setStamp = (v) => { try { localStorage.setItem(STAMP, JSON.stringify(v)); } catch {} };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const bar = document.createElement("div");
  bar.className = "am-cloud";
  bar.setAttribute("role", "status");
  bar.style.cssText = "position:fixed;inset-inline-start:16px;bottom:16px;z-index:60;max-width:calc(100vw - 32px);display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 14px;border-radius:999px;background:var(--am-cream,#F8EFE2);color:var(--am-plum,#24191E);border:1.5px solid var(--am-plum,#24191E);box-shadow:0 3px 0 var(--am-plum,#24191E);font:600 13px/1.3 Inter,system-ui,sans-serif";
  const show = (html) => { bar.innerHTML = html; if (!bar.isConnected) document.body.append(bar); };
  const btn = (id, label, brand) => `<button type="button" data-c="${id}" style="font:inherit;cursor:pointer;border-radius:999px;padding:4px 12px;border:1.5px solid currentColor;${brand ? "background:#6E2037;color:#fff;border-color:#6E2037" : "background:transparent;color:inherit"}">${esc(label)}</button>`;

  async function call(method, body) {
    const r = await fetch(URL_, { method, cache: "no-store", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({})); return { ok: r.ok, status: r.status, d };
  }
  function restore(data) {
    try {
      localStorage.setItem("auraMenuDraft", JSON.stringify(data.draft));
      localStorage.setItem("auraMenuExtras", JSON.stringify(data.extras || {}));
    } catch { return; }
    location.reload();
  }

  let version = null, last = "", had = false, busy = false, paused = false;
  async function sync() {
    if (busy || paused) return;
    const snap = snapshot(), text = snap ? JSON.stringify(snap) : "";
    if (snap) had = true;
    if (text === last) return;
    busy = true;
    try {
      if (!snap) { if (had) { await call("DELETE"); setStamp({}); had = false; } last = text; return; }
      show(esc(t("saving")));
      const name = String(snap.draft?.fields?.businessName || "").slice(0, 100);
      const res = await call("PUT", { name, data: snap, ...(version ? { baseVersion: version } : {}) });
      if (res.status === 409) {
        paused = true;
        show(`${esc(t("newer"))} ${btn("load", t("load"), true)} ${btn("keep", t("fresh"))}`);
        bar.querySelector('[data-c="load"]').onclick = async () => { const g = await call("GET"); if (g.ok) restore(g.d.draft.data); };
        bar.querySelector('[data-c="keep"]').onclick = async () => { const g = await call("GET"); version = g.ok ? g.d.draft.version : null; paused = false; last = ""; sync(); };
        return;
      }
      if (!res.ok) { show(esc(t("offline"))); return; }
      version = res.d.version; last = text; setStamp({ version, at: Date.now() });
      show(`✓ ${esc(t("saved"))} · ${new Date().toLocaleTimeString(document.documentElement.lang || undefined, { hour: "2-digit", minute: "2-digit" })}`);
    } catch { show(esc(t("offline"))); }
    finally { busy = false; }
  }

  async function start() {
    let user = null;
    try { user = (await (await fetch("/api/auramenu/account/session", { cache: "no-store", credentials: "same-origin" })).json()).user; } catch {}
    if (!user) {
      const lang = (document.documentElement.lang || "tr").slice(0, 2);
      show(`<a href="signin.html?lang=${esc(lang)}&next=builder.html" style="color:inherit">${esc(t("signIn"))} →</a>`);
      return;
    }
    const remote = await call("GET");
    const local = snapshot();
    if (remote.ok) {
      const server = remote.d.draft, mine = stamp();
      version = server.version;
      const same = local && JSON.stringify(local) === JSON.stringify(server.data);
      if (same) { last = JSON.stringify(local); show(`✓ ${esc(t("saved"))}`); }
      else if (blank(local)) return restore(server.data);
      else if (mine.version !== server.version) {
        paused = true;
        const when = new Date(server.updatedAt.replace(" ", "T") + "Z").toLocaleString(document.documentElement.lang || undefined, { dateStyle: "medium", timeStyle: "short" });
        show(`${esc(t("found"))} (${esc(server.name || "—")}, ${esc(when)}) ${btn("cont", t("cont"), true)} ${btn("keep", t("fresh"))}`);
        bar.querySelector('[data-c="cont"]').onclick = () => restore(server.data);
        bar.querySelector('[data-c="keep"]').onclick = () => { paused = false; sync(); };
        setInterval(sync, 4000);
        return;
      }
    }
    sync();
    setInterval(sync, 4000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
