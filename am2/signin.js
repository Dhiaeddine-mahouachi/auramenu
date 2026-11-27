/* AuraMenu authentication: sign in, register, email verification and password recovery —
   all on AuraMenu's own pages, using the central AuraDigital account through /api/auramenu/auth/*.
   Sessions are AuraMenu host-only cookies. Google uses the AuraDigital provider with PKCE and returns here. */
(function () {
  "use strict";
  const API = "/api/auramenu/auth";
  const S = window.AuraSite, $ = (id) => document.getElementById(id);
  const ACCOUNTS = window.AURAMENU_ACCOUNTS_ORIGIN || "https://auradigitalworks.com";
  const copy = {
    tr: {
      kicker: "AuraMenu", artA: "Selam şef!", artB: "Menün seni bekliyor.", artP: "Fiyatları güncelle, ürünü tükendi yap, tasarımı değiştir. Hepsi tek yerden.",
      signinTitle: "Tekrar hoş geldin.", signinSub: "Menünü yönetmek için giriş yap.",
      registerTitle: "Hesabını oluştur.", registerSub: "Bir dakikada hazır. Menünü bu hesapla kaydedip yönetirsin.",
      checkTitle: "E-postanı doğrula.", checkSub: "Gönderdiğimiz bağlantıya tıkla. Sonra buraya dönüp devam et.",
      forgotTitle: "Şifreni mi unuttun?", forgotSub: "E-postanı yaz, sıfırlama bağlantısı gönderelim.",
      resetTitle: "Yeni şifre belirle.", resetSub: "En az 12 karakter kullan.",
      verifyTitle: "E-posta doğrulanıyor…", verifySub: "",
      email: "E-posta", password: "Şifre", newPassword: "Yeni şifre", confirm: "Şifre tekrar", name: "Ad soyad", show: "Göster", hide: "Gizle",
      login: "Giriş yap", create: "Hesap oluştur", send: "Bağlantı gönder", save: "Şifreyi kaydet", resend: "Bağlantıyı tekrar gönder", done: "Doğruladım, devam et",
      google: "Google ile devam et", or: "veya", forgot: "Şifremi unuttum",
      terms: "Hesap koşullarını ve gizlilik bildirimini kabul ediyorum.", termsLink: "Koşulları oku",
      noAccount: "Hesabın yok mu?", toRegister: "Kayıt ol", haveAccount: "Zaten hesabın var mı?", toSignin: "Giriş yap", back: "Girişe dön",
      demo: "Demo Studio'yu dene", note: "Tek AuraDigital hesabı: AuraMenu, AuraHub ve diğer Aura ürünlerinde aynı hesap.",
      busy: "Bir saniye…", sent: "Gönderildi. Gelen kutunu ve spam klasörünü kontrol et.", verified: "E-postan doğrulandı.", resetOk: "Şifren güncellendi. Yeni şifrenle giriş yap.",
      notVerified: "E-postan henüz doğrulanmadı. Bağlantıya tıkla, sonra tekrar dene.", forgotOk: "Bu e-postaya ait bir hesap varsa sıfırlama bağlantısı gönderildi.",
      errEmpty: "Tüm alanları doldur.", errMatch: "Şifreler aynı değil.", errShort: "Şifre en az 12 karakter olmalı.", errTerms: "Devam etmek için koşulları kabul et.",
      errDown: "Bağlantı kurulamadı. Biraz sonra tekrar dene.", errLink: "Bu bağlantı geçersiz ya da süresi dolmuş.",
      google_off: "Google ile giriş şu an kullanılamıyor. E-posta ile devam et.", google_canceled: "Google girişi iptal edildi.", google_link_required: "Bu e-postayla zaten bir hesap var. E-posta ve şifrenle giriş yap.", google_failed: "Google girişi tamamlanamadı. Tekrar dene.",
    },
    en: {
      kicker: "AuraMenu", artA: "Hey, chef!", artB: "Your menu is waiting.", artP: "Update prices, mark items sold out, change the design. All in one place.",
      signinTitle: "Welcome back.", signinSub: "Sign in to manage your menu.",
      registerTitle: "Create your account.", registerSub: "Ready in a minute. You register and manage your menu with this account.",
      checkTitle: "Verify your email.", checkSub: "Click the link we sent you, then come back here to continue.",
      forgotTitle: "Forgot your password?", forgotSub: "Enter your email and we will send a reset link.",
      resetTitle: "Choose a new password.", resetSub: "Use at least 12 characters.",
      verifyTitle: "Verifying your email…", verifySub: "",
      email: "Email", password: "Password", newPassword: "New password", confirm: "Repeat password", name: "Full name", show: "Show", hide: "Hide",
      login: "Sign in", create: "Create account", send: "Send link", save: "Save password", resend: "Send the link again", done: "I've verified, continue",
      google: "Continue with Google", or: "or", forgot: "Forgot password",
      terms: "I accept the account conditions and the privacy notice.", termsLink: "Read the conditions",
      noAccount: "No account yet?", toRegister: "Sign up", haveAccount: "Already have an account?", toSignin: "Sign in", back: "Back to sign in",
      demo: "Try the demo Studio", note: "One AuraDigital account: the same account for AuraMenu, AuraHub and other Aura products.",
      busy: "One moment…", sent: "Sent. Check your inbox and spam folder.", verified: "Your email is verified.", resetOk: "Password updated. Sign in with your new password.",
      notVerified: "Your email is not verified yet. Click the link, then try again.", forgotOk: "If an account exists for this email, a reset link has been sent.",
      errEmpty: "Fill in every field.", errMatch: "The passwords do not match.", errShort: "The password needs at least 12 characters.", errTerms: "Accept the conditions to continue.",
      errDown: "Could not connect. Try again shortly.", errLink: "This link is invalid or has expired.",
      google_off: "Google sign-in is not available right now. Continue with email.", google_canceled: "Google sign-in was canceled.", google_link_required: "An account with this email already exists. Sign in with email and password.", google_failed: "Google sign-in could not be completed. Try again.",
    },
    ar: {
      kicker: "AuraMenu", artA: "أهلاً يا شيف!", artB: "قائمتك بانتظارك.", artP: "حدّث الأسعار، علّم الأصناف النافدة، غيّر التصميم. كل ذلك في مكان واحد.",
      signinTitle: "مرحباً بعودتك.", signinSub: "سجّل الدخول لإدارة قائمتك.",
      registerTitle: "أنشئ حسابك.", registerSub: "جاهز خلال دقيقة. تسجّل قائمتك وتديرها بهذا الحساب.",
      checkTitle: "أكّد بريدك الإلكتروني.", checkSub: "اضغط الرابط الذي أرسلناه، ثم عد إلى هنا للمتابعة.",
      forgotTitle: "نسيت كلمة المرور؟", forgotSub: "اكتب بريدك وسنرسل لك رابط إعادة التعيين.",
      resetTitle: "اختر كلمة مرور جديدة.", resetSub: "استخدم 12 حرفاً على الأقل.",
      verifyTitle: "جارٍ تأكيد البريد…", verifySub: "",
      email: "البريد الإلكتروني", password: "كلمة المرور", newPassword: "كلمة مرور جديدة", confirm: "أعد كلمة المرور", name: "الاسم الكامل", show: "إظهار", hide: "إخفاء",
      login: "تسجيل الدخول", create: "إنشاء الحساب", send: "أرسل الرابط", save: "احفظ كلمة المرور", resend: "أعد إرسال الرابط", done: "أكّدت، تابع",
      google: "المتابعة عبر Google", or: "أو", forgot: "نسيت كلمة المرور",
      terms: "أوافق على شروط الحساب وإشعار الخصوصية.", termsLink: "اقرأ الشروط",
      noAccount: "ليس لديك حساب؟", toRegister: "أنشئ حساباً", haveAccount: "لديك حساب؟", toSignin: "سجّل الدخول", back: "العودة لتسجيل الدخول",
      demo: "جرّب الاستوديو التجريبي", note: "حساب AuraDigital واحد: نفس الحساب في AuraMenu و AuraHub و منتجات Aura الأخرى.",
      busy: "لحظة…", sent: "تم الإرسال. تحقق من البريد الوارد ومجلد الرسائل غير المرغوبة.", verified: "تم تأكيد بريدك.", resetOk: "تم تحديث كلمة المرور. سجّل الدخول بها.",
      notVerified: "بريدك غير مؤكد بعد. اضغط الرابط ثم حاول مجدداً.", forgotOk: "إن وُجد حساب بهذا البريد فقد أُرسل رابط إعادة التعيين.",
      errEmpty: "املأ جميع الحقول.", errMatch: "كلمتا المرور غير متطابقتين.", errShort: "كلمة المرور تحتاج 12 حرفاً على الأقل.", errTerms: "وافق على الشروط للمتابعة.",
      errDown: "تعذر الاتصال. حاول بعد قليل.", errLink: "هذا الرابط غير صالح أو منتهي الصلاحية.",
      google_off: "تسجيل الدخول عبر Google غير متاح الآن. تابع بالبريد.", google_canceled: "أُلغي تسجيل الدخول عبر Google.", google_link_required: "يوجد حساب بهذا البريد. سجّل الدخول بالبريد وكلمة المرور.", google_failed: "تعذّر إكمال تسجيل الدخول عبر Google. حاول مجدداً.",
    },
  };
  S.init(copy);
  const t = (k) => copy[S.lang]?.[k] || copy.en[k] || "";
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const mascot = (state) => window.AuraMascot?.set(document.querySelector(".am-auth-mascot"), state);
  const msg = (m, ok) => { $("msg").textContent = m || ""; $("msg").classList.toggle("is-ok", !!ok); };
  const next = () => { const n = new URLSearchParams(location.search).get("next"); return n && /^[a-z0-9_-]+\.html(\?[^#]*)?$/i.test(n) ? n : `studio.html?lang=${S.lang}`; };

  async function api(path, body, method = "POST") {
    const r = await fetch(`${API}/${path}`, { method, cache: "no-store", credentials: "same-origin", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({})); if (!r.ok) { const e = new Error(d.error || ""); e.status = r.status; throw e; } return d;
  }
  const session = () => fetch("/api/auramenu/account/session", { cache: "no-store", credentials: "same-origin" }).then((r) => r.json()).catch(() => ({}));

  /* Turnstile (only when the identity service requires it) */
  let caps = { google: true, turnstile: "" }, widget = null;
  const capsReady = fetch(`${API}/capabilities`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : {})).then((c) => { caps = { ...caps, ...c }; }).catch(() => {});
  function mountTurnstile(host) {
    if (!caps.turnstile || !host) return;
    const draw = () => { widget = window.turnstile.render(host, { sitekey: caps.turnstile, theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light", language: S.lang }); };
    if (window.turnstile) return draw();
    const s = document.createElement("script"); s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; s.async = true; s.onload = draw; document.head.append(s);
  }
  const turnstileToken = () => (widget !== null && window.turnstile ? window.turnstile.getResponse(widget) || "" : "");
  const resetTurnstile = () => { if (widget !== null && window.turnstile) window.turnstile.reset(widget); };

  /* Google through the AuraDigital provider: PKCE one-time code, back to this page, AuraMenu host-only session */
  const b64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const rand = (n) => b64(crypto.getRandomValues(new Uint8Array(n)));
  async function google() {
    const verifier = rand(32), state = rand(18);
    const challenge = b64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
    try { sessionStorage.setItem("auramenuConnect", JSON.stringify({ verifier, state, next: next(), at: Date.now() })); } catch { return msg(t("errDown")); }
    const connect = `/api/auramenu/connect?${new URLSearchParams({ challenge, state })}`;
    location.assign(`${ACCOUNTS}/api/customer/google/start?${new URLSearchParams({ acceptTerms: "true", next: connect })}`);
  }

  /* Screens */
  const field = (id, label, type = "text", extra = "") => `<label class="am-field"><span>${esc(t(label))}</span>${type === "password"
    ? `<span class="am-pass"><input type="password" id="${id}" required ${extra}><button type="button" data-toggle="${id}">${esc(t("show"))}</button></span>`
    : `<input type="${type}" id="${id}" required ${extra}>`}</label>`;
  const googleBlock = () => caps.google === false ? "" : `<div class="am-auth-or"><span>${esc(t("or"))}</span></div><button type="button" class="am-btn am-btn--ghost am-google" id="googleBtn" style="width:100%"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg> ${esc(t("google"))}</button>`;
  let mode = "signin", token = "";
  const screens = {
    signin: () => `<form id="authForm" novalidate>${field("email", "email", "email", 'autocomplete="email" inputmode="email"')}${field("password", "password", "password", 'autocomplete="current-password" minlength="12"')}
      <div class="am-auth-row"><span></span><a href="#forgot" data-mode="forgot">${esc(t("forgot"))}</a></div><div class="am-turnstile" id="ts"></div>
      <button class="am-btn am-btn--brand" type="submit" style="width:100%">${esc(t("login"))} <span class="am-arrow">→</span></button></form>${googleBlock()}
      <a class="am-btn am-btn--ghost am-auth-demo" href="studio.html?demo=1&lang=${S.lang}">${esc(t("demo"))}</a>`,
    register: () => `<form id="authForm" novalidate>${field("name", "name", "text", 'autocomplete="name" maxlength="100"')}${field("email", "email", "email", 'autocomplete="email" inputmode="email"')}
      ${field("password", "password", "password", 'autocomplete="new-password" minlength="12"')}${field("confirm", "confirm", "password", 'autocomplete="new-password" minlength="12"')}
      <label class="am-check"><input type="checkbox" id="terms"> <span>${esc(t("terms"))}</span></label><div class="am-turnstile" id="ts"></div>
      <button class="am-btn am-btn--brand" type="submit" style="width:100%">${esc(t("create"))} <span class="am-arrow">→</span></button></form>${googleBlock()}`,
    check: () => `<div class="am-auth-check"><span class="am-auth-check-ico" aria-hidden="true">✉</span><p id="checkEmail"></p></div>
      <button class="am-btn am-btn--brand" type="button" id="doneBtn" style="width:100%">${esc(t("done"))} <span class="am-arrow">→</span></button>
      <button class="am-btn am-btn--ghost" type="button" id="resendBtn" style="width:100%;margin-top:10px">${esc(t("resend"))}</button>`,
    forgot: () => `<form id="authForm" novalidate>${field("email", "email", "email", 'autocomplete="email" inputmode="email"')}<div class="am-turnstile" id="ts"></div>
      <button class="am-btn am-btn--brand" type="submit" style="width:100%">${esc(t("send"))} <span class="am-arrow">→</span></button></form>`,
    reset: () => `<form id="authForm" novalidate>${field("password", "newPassword", "password", 'autocomplete="new-password" minlength="12"')}${field("confirm", "confirm", "password", 'autocomplete="new-password" minlength="12"')}
      <button class="am-btn am-btn--brand" type="submit" style="width:100%">${esc(t("save"))} <span class="am-arrow">→</span></button></form>`,
    verify: () => `<div class="am-auth-check"><span class="am-auth-spin" aria-hidden="true"></span></div>`,
  };
  const foot = {
    signin: () => `${esc(t("noAccount"))} <a href="#register" data-mode="register">${esc(t("toRegister"))}</a>`,
    register: () => `${esc(t("haveAccount"))} <a href="#signin" data-mode="signin">${esc(t("toSignin"))}</a>`,
    forgot: () => `<a href="#signin" data-mode="signin">${esc(t("back"))}</a>`,
    reset: () => `<a href="#signin" data-mode="signin">${esc(t("back"))}</a>`,
    check: () => `<a href="#signin" data-mode="signin" data-logout>${esc(t("back"))}</a>`,
    verify: () => "",
  };

  let account = null;
  async function show(m, { keepMsg = false } = {}) {
    mode = m; widget = null;
    await capsReady;
    $("authKicker").textContent = t("kicker");
    $("authTitle").textContent = t(`${m}Title`); $("authSub").textContent = t(`${m}Sub`); $("authSub").hidden = !t(`${m}Sub`);
    $("authBody").innerHTML = screens[m](); $("authFoot").innerHTML = foot[m](); $("authNote").textContent = ["signin", "register"].includes(m) ? t("note") : "";
    if (!keepMsg) msg("");
    document.querySelectorAll("[data-mode]").forEach((a) => (a.onclick = async (e) => { e.preventDefault(); if (a.hasAttribute("data-logout")) await logout(); show(a.dataset.mode); }));
    document.querySelectorAll("[data-toggle]").forEach((b) => (b.onclick = () => { const i = $(b.dataset.toggle), v = i.type === "password"; i.type = v ? "text" : "password"; b.textContent = v ? t("hide") : t("show"); }));
    $("googleBtn")?.addEventListener("click", google);
    $("authForm")?.addEventListener("submit", submit);
    if (["signin", "register", "forgot"].includes(m)) mountTurnstile($("ts"));
    if (m === "check") {
      $("checkEmail").textContent = account?.email || "";
      $("resendBtn").onclick = async () => { const b = $("resendBtn"); b.disabled = true; try { await api("send-verification", {}); msg(t("sent"), true); } catch (e) { msg(e.message || t("errDown")); } finally { b.disabled = false; } };
      $("doneBtn").onclick = async () => { const s = await session(); if (s.user?.emailVerified) return location.replace(next()); msg(t("notVerified")); };
    }
    mascot(m === "check" ? "thinking" : m === "verify" ? "loading" : "wave");
    $("authBody").querySelector("input")?.focus({ preventScroll: true });
  }

  async function submit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]'), v = (id) => ($(id)?.value || "").trim();
    const email = v("email").toLowerCase(), password = $("password")?.value || "", confirm = $("confirm")?.value || "";
    if (mode === "signin" && (!email || !password)) return msg(t("errEmpty"));
    if (mode === "register") {
      if (!v("name") || !email || !password) return msg(t("errEmpty"));
      if (password.length < 12) return msg(t("errShort"));
      if (password !== confirm) return msg(t("errMatch"));
      if (!$("terms").checked) return msg(t("errTerms"));
    }
    if (mode === "forgot" && !email) return msg(t("errEmpty"));
    if (mode === "reset") { if (password.length < 12) return msg(t("errShort")); if (password !== confirm) return msg(t("errMatch")); }
    btn.disabled = true; msg(t("busy"), true); mascot("thinking");
    try {
      const turnstileTokenValue = turnstileToken();
      if (mode === "signin") {
        await api("login", { email, password, turnstileToken: turnstileTokenValue });
        return afterSignIn();
      }
      if (mode === "register") {
        await api("register", { name: v("name"), email, password, acceptTerms: true, turnstileToken: turnstileTokenValue });
        try { await api("send-verification", {}); } catch {}
        return afterSignIn();
      }
      if (mode === "forgot") { await api("forgot-password", { email, turnstileToken: turnstileTokenValue }); msg(t("forgotOk"), true); mascot("celebrate"); return; }
      if (mode === "reset") { await api("reset-password", { token, password }); token = ""; await show("signin"); msg(t("resetOk"), true); return; }
    } catch (err) {
      resetTurnstile(); mascot("wave");
      msg(err.status === 400 && mode === "reset" ? t("errLink") : err.status && err.status < 500 ? err.message || t("errDown") : t("errDown"));
    } finally { btn.disabled = false; }
  }

  async function afterSignIn() {
    const s = await session(); account = s.user || null;
    if (!account) return show("signin");
    if (account.emailVerified) { mascot("celebrate"); return location.replace(next()); }
    return show("check", { keepMsg: true });
  }
  async function logout() { try { await fetch("/api/auramenu/account/logout", { method: "POST", credentials: "same-origin" }); } catch {} account = null; }

  /* Links that land here: #token from email (verify/reset), #code from Google (PKCE), #google=… errors */
  async function start() {
    const params = new URLSearchParams(location.search), hash = new URLSearchParams(location.hash.slice(1));
    const urlMode = params.get("mode");
    if (location.hash) history.replaceState(null, "", location.pathname + location.search.replace(/([?&])mode=[^&]*&?/, "$1").replace(/[?&]$/, ""));
    if (hash.get("google")) { await show("signin"); return msg(t(`google_${hash.get("google")}`) || t("google_failed")); }
    if (hash.get("state")) {
      let saved = null; try { saved = JSON.parse(sessionStorage.getItem("auramenuConnect") || "null"); sessionStorage.removeItem("auramenuConnect"); } catch {}
      if (!saved || saved.state !== hash.get("state") || Date.now() - saved.at > 10 * 60 * 1000 || !hash.get("code")) { await show("signin"); return msg(hash.get("error") === "verify" ? t("notVerified") : t("errLink")); }
      await show("verify");
      try {
        const r = await fetch("/api/auramenu/connect/exchange", { method: "POST", cache: "no-store", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: hash.get("code"), verifier: saved.verifier }) });
        if (!r.ok) throw new Error();
        return location.replace(saved.next);
      } catch { await show("signin"); return msg(t("errLink")); }
    }
    if (urlMode === "verify" && /^[a-f0-9]{64}$/.test(hash.get("token") || "")) {
      await show("verify");
      try { await api("verify", { token: hash.get("token") }); } catch { await show("signin"); return msg(t("errLink")); }
      const s = await session(); account = s.user || null;
      if (account?.emailVerified) { msg(t("verified"), true); return location.replace(next()); }
      await show("signin"); return msg(t("verified"), true);
    }
    if (urlMode === "reset" && /^[a-f0-9]{64}$/.test(hash.get("token") || "")) { token = hash.get("token"); return show("reset"); }
    const s = await session(); account = s.user || null;
    if (account?.emailVerified) return location.replace(next());
    if (account) return show("check");
    show(["register", "forgot"].includes(urlMode) ? urlMode : "signin");
  }
  S.onLang?.(() => { const keep = $("msg").textContent; show(mode, { keepMsg: true }); $("msg").textContent = keep; });
  start();
})();
