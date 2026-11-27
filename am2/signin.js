/* AuraMenu sign-in: the AuraDigital account (one-time code + PKCE). auramenu.space keeps its own session cookie. */
(function () {
  "use strict";
  const S = window.AuraSite, $ = (id) => document.getElementById(id);
  const copy = {
    tr: { connect: "AuraDigital hesabınla giriş yap", connectNote: "Google veya e-posta ile. AuraHub ile aynı hesap. Hesabın yoksa bu adımda oluşturabilirsin.", legacy: "ya da eski AuraMenu hesabınla", errVerify: "Önce AuraDigital e-posta adresini doğrula, sonra tekrar dene.", errExpired: "Giriş bağlantısının süresi doldu. Lütfen tekrar dene.", title: "AuraMenu · Giriş", artA: "Selam şef!", artB: "Menün seni bekliyor.", artP: "Fiyatları güncelle, ürünü tükendi yap, tasarımı değiştir. Hepsi tek yerden.", kicker: "AuraMenu Studio", titleH: "Tekrar hoş geldin.", sub: "Menünü yönetmek için giriş yap.", email: "E-posta", password: "Şifre", show: "Göster", hide: "Gizle", remember: "Beni hatırla", forgot: "Şifremi unuttum", login: "Giriş yap", or: "veya", demo: "Demo Studio'yu dene", new: "Henüz menün yok mu?", create: "Menünü oluştur", verifyText: "E-postana gönderdiğimiz doğrulama bağlantısına tıkla, sonra tekrar dene.", resend: "Bağlantıyı tekrar gönder", sent: "Doğrulama bağlantısı gönderildi.", errEmpty: "E-posta ve şifreni gir.", errBad: "E-posta veya şifre hatalı.", errDown: "Hesap servisine şu an ulaşılamıyor. Biraz sonra tekrar dene.", busy: "Giriş yapılıyor…" },
    en: { connect: "Continue with your AuraDigital account", connectNote: "Google or email. The same account as AuraHub. No account yet? You can create one in this step.", legacy: "or with an older AuraMenu account", errVerify: "Verify your AuraDigital email first, then try again.", errExpired: "The sign-in link expired. Please try again.", title: "AuraMenu · Log in", artA: "Hey, chef!", artB: "Your menu is waiting.", artP: "Update prices, mark dishes sold out, switch designs. All in one place.", kicker: "AuraMenu Studio", titleH: "Welcome back.", sub: "Log in to manage your menu.", email: "Email", password: "Password", show: "Show", hide: "Hide", remember: "Remember me", forgot: "Forgot password", login: "Log in", or: "or", demo: "Try the demo Studio", new: "No menu yet?", create: "Create your menu", verifyText: "Click the verification link we emailed you, then try again.", resend: "Resend link", sent: "Verification link sent.", errEmpty: "Enter your email and password.", errBad: "Wrong email or password.", errDown: "The account service is unavailable right now. Please try again shortly.", busy: "Logging in…" },
    ar: { connect: "المتابعة بحساب AuraDigital", connectNote: "عبر Google أو البريد. نفس حساب AuraHub. ليس لديك حساب؟ يمكنك إنشاؤه في هذه الخطوة.", legacy: "أو بحساب AuraMenu القديم", errVerify: "أكّد بريد AuraDigital أولاً ثم حاول مجدداً.", errExpired: "انتهت صلاحية رابط الدخول. حاول مجدداً.", title: "AuraMenu · تسجيل الدخول", artA: "أهلاً يا شيف!", artB: "قائمتك بانتظارك.", artP: "حدّث الأسعار، علّم الأطباق النافدة، غيّر التصميم. كل ذلك من مكان واحد.", kicker: "استوديو AuraMenu", titleH: "مرحباً بعودتك.", sub: "سجّل الدخول لإدارة قائمتك.", email: "البريد الإلكتروني", password: "كلمة المرور", show: "إظهار", hide: "إخفاء", remember: "تذكرني", forgot: "نسيت كلمة المرور", login: "تسجيل الدخول", or: "أو", demo: "جرّب الاستوديو التجريبي", new: "ليس لديك قائمة؟", create: "أنشئ قائمتك", verifyText: "اضغط رابط التحقق الذي أرسلناه إلى بريدك ثم حاول مجدداً.", resend: "إعادة إرسال الرابط", sent: "تم إرسال رابط التحقق.", errEmpty: "أدخل بريدك وكلمة المرور.", errBad: "البريد أو كلمة المرور غير صحيحة.", errDown: "خدمة الحسابات غير متاحة الآن. حاول بعد قليل.", busy: "جارٍ تسجيل الدخول…" },
  };
  for (const l in copy) copy[l].title_ = copy[l].title;
  document.querySelector('[data-i18n="title"]').dataset.i18n = "titleH";
  S.init(copy);
  const t = (k) => copy[S.lang][k] || copy.en[k];
  const msg = (m, ok) => { $("msg").textContent = m || ""; $("msg").classList.toggle("is-ok", !!ok); };
  const next = () => { const n = new URLSearchParams(location.search).get("next"); return n && /^[a-z0-9_-]+\.html(\?[^#]*)?$/i.test(n) ? n : `studio.html?lang=${S.lang}`; };
  // AuraDigital account: one-time code + PKCE; auramenu.space keeps its own session cookie.
  const ACCOUNTS = window.AURAMENU_ACCOUNTS_ORIGIN || "https://auradigitalworks.com";
  const b64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const rand = (n) => b64(crypto.getRandomValues(new Uint8Array(n)));
  $("auraConnect").onclick = async () => {
    const verifier = rand(32), state = rand(18);
    const challenge = b64(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
    try { sessionStorage.setItem("auramenuConnect", JSON.stringify({ verifier, state, next: next(), at: Date.now() })); } catch { return msg(t("errDown")); }
    location.assign(`${ACCOUNTS}/api/auramenu/connect?${new URLSearchParams({ challenge, state })}`);
  };
  const handoff = new URLSearchParams(location.hash.slice(1));
  if (handoff.get("state")) {
    history.replaceState(null, "", location.pathname + location.search);
    let saved = null; try { saved = JSON.parse(sessionStorage.getItem("auramenuConnect") || "null"); sessionStorage.removeItem("auramenuConnect"); } catch {}
    if (!saved || saved.state !== handoff.get("state") || Date.now() - saved.at > 10 * 60 * 1000) msg(t("errExpired"));
    else if (handoff.get("error") === "verify") msg(t("errVerify"));
    else if (handoff.get("code")) {
      msg(t("busy"), true);
      fetch("/api/auramenu/connect/exchange", { method: "POST", cache: "no-store", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: handoff.get("code"), verifier: saved.verifier }) })
        .then((r) => (r.ok ? location.replace(saved.next) : msg(t("errExpired")))).catch(() => msg(t("errDown")));
    }
  } else {
    fetch("/api/auramenu/account/session", { cache: "no-store", credentials: "same-origin" }).then((r) => r.json()).then((d) => { if (d.user) location.replace(next()); }).catch(() => {});
  }
})();
