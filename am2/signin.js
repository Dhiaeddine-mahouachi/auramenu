/* AuraMenu login: uses the existing shared AuraDigital customer account API (same one the builder uses). */
(function () {
  "use strict";
  const API = "/api/aurapops/account";
  const S = window.AuraSite, $ = (id) => document.getElementById(id);
  const copy = {
    tr: { title: "AuraMenu · Giriş", artA: "Selam şef!", artB: "Menün seni bekliyor.", artP: "Fiyatları güncelle, ürünü tükendi yap, tasarımı değiştir. Hepsi tek yerden.", kicker: "AuraMenu Studio", titleH: "Tekrar hoş geldin.", sub: "Menünü yönetmek için giriş yap.", email: "E-posta", password: "Şifre", show: "Göster", hide: "Gizle", remember: "Beni hatırla", forgot: "Şifremi unuttum", login: "Giriş yap", or: "veya", demo: "Demo Studio'yu dene", new: "Henüz menün yok mu?", create: "Menünü oluştur", verifyText: "E-postana gönderdiğimiz doğrulama bağlantısına tıkla, sonra tekrar dene.", resend: "Bağlantıyı tekrar gönder", sent: "Doğrulama bağlantısı gönderildi.", errEmpty: "E-posta ve şifreni gir.", errBad: "E-posta veya şifre hatalı.", errDown: "Hesap servisine şu an ulaşılamıyor. Biraz sonra tekrar dene.", busy: "Giriş yapılıyor…" },
    en: { title: "AuraMenu · Log in", artA: "Hey, chef!", artB: "Your menu is waiting.", artP: "Update prices, mark dishes sold out, switch designs. All in one place.", kicker: "AuraMenu Studio", titleH: "Welcome back.", sub: "Log in to manage your menu.", email: "Email", password: "Password", show: "Show", hide: "Hide", remember: "Remember me", forgot: "Forgot password", login: "Log in", or: "or", demo: "Try the demo Studio", new: "No menu yet?", create: "Create your menu", verifyText: "Click the verification link we emailed you, then try again.", resend: "Resend link", sent: "Verification link sent.", errEmpty: "Enter your email and password.", errBad: "Wrong email or password.", errDown: "The account service is unavailable right now. Please try again shortly.", busy: "Logging in…" },
    ar: { title: "AuraMenu · تسجيل الدخول", artA: "أهلاً يا شيف!", artB: "قائمتك بانتظارك.", artP: "حدّث الأسعار، علّم الأطباق النافدة، غيّر التصميم. كل ذلك من مكان واحد.", kicker: "استوديو AuraMenu", titleH: "مرحباً بعودتك.", sub: "سجّل الدخول لإدارة قائمتك.", email: "البريد الإلكتروني", password: "كلمة المرور", show: "إظهار", hide: "إخفاء", remember: "تذكرني", forgot: "نسيت كلمة المرور", login: "تسجيل الدخول", or: "أو", demo: "جرّب الاستوديو التجريبي", new: "ليس لديك قائمة؟", create: "أنشئ قائمتك", verifyText: "اضغط رابط التحقق الذي أرسلناه إلى بريدك ثم حاول مجدداً.", resend: "إعادة إرسال الرابط", sent: "تم إرسال رابط التحقق.", errEmpty: "أدخل بريدك وكلمة المرور.", errBad: "البريد أو كلمة المرور غير صحيحة.", errDown: "خدمة الحسابات غير متاحة الآن. حاول بعد قليل.", busy: "جارٍ تسجيل الدخول…" },
  };
  for (const l in copy) copy[l].title_ = copy[l].title;
  document.querySelector('[data-i18n="title"]').dataset.i18n = "titleH";
  S.init(copy);
  const t = (k) => copy[S.lang][k] || copy.en[k];
  const msg = (m, ok) => { $("msg").textContent = m || ""; $("msg").classList.toggle("is-ok", !!ok); };
  async function api(path, body) {
    const r = await fetch(API + path, { method: body ? "POST" : "GET", cache: "no-store", credentials: "same-origin", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({})); if (!r.ok) { const e = new Error(d.error || ""); e.status = r.status; throw e; } return d;
  }
  const next = () => { const n = new URLSearchParams(location.search).get("next"); return n && /^[a-z0-9_-]+\.html(\?[^#]*)?$/i.test(n) ? n : `studio.html?lang=${S.lang}`; };
  api("/session").then((d) => { if (d.user && d.user.emailVerified) location.replace(next()); }).catch(() => {});
  $("showPass").onclick = () => { const p = $("password"), v = p.type === "password"; p.type = v ? "text" : "password"; $("showPass").textContent = v ? t("hide") : t("show"); };
  $("loginForm").onsubmit = async (e) => {
    e.preventDefault(); const email = $("email").value.trim(), password = $("password").value;
    if (!email || !password) return msg(t("errEmpty"));
    $("submit").disabled = true; msg(t("busy"), true); window.AuraMascot?.set(document.querySelector(".am-auth-mascot"), "thinking");
    try {
      const d = await api("/login", { email, password, remember: $("remember").checked });
      if (d.verificationRequired || (d.user && !d.user.emailVerified)) { $("verify").hidden = false; msg(""); return; }
      location.replace(next());
    } catch (err) { msg(err.status === 401 || err.status === 400 || err.status === 403 ? (err.message || t("errBad")) : t("errDown")); }
    finally { $("submit").disabled = false; window.AuraMascot?.set(document.querySelector(".am-auth-mascot"), "wave"); }
  };
  $("resend").onclick = async () => { try { await api("/verification/send", {}); msg(t("sent"), true); } catch { msg(t("errDown")); } };
})();
