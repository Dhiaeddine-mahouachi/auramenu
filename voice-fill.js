/* Browser dictation adapter. No purchase, service activation or publishing actions. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const bridge = window.AuraMenuVoiceBridge;
  const core = window.AuraMenuVoiceCore;
  if (!bridge || !core || !$("voiceTarget")) return;

  const translations = {
    tr: {
      title: "🎙 Sesle doldur", intro: "Alanı seçin ve konuşun. Önce sonucu inceleyin; hiçbir şey otomatik yayınlanmaz.",
      target: "Hangi bilgiyi ekleyeceksiniz?", categorySelect: "Ürün kategorisi", transcript: "Duyulan metin (düzenlenebilir)",
      start: "Konuşmaya başla", stop: "Kaydı bitir", review: "Değişikliği incele", apply: "Forma uygula",
      businessName: "İşletme adı", tagline: "Slogan", description: "İşletme açıklaması", address: "Adres",
      businessPhone: "Telefon", openingHours: "Çalışma saatleri", category: "Yeni kategori", product: "Yeni ürün ve fiyat",
      privacy: "Mikrofon yalnızca düğmeye bastığınızda açılır. Tarayıcınız ses tanıma için üçüncü taraf hizmet kullanabilir. Bu uygulama ses kaydetmez.",
      fallback: "Tarayıcıda ses tanıma yoksa iPhone/Android klavye mikrofonunu aşağıdaki alanda kullanabilirsiniz.",
      ready: "Konuşmayı başlatın veya metin yazın.", listening: "Dinleniyor… Şimdi konuşun.",
      heard: "Metin alındı. Gerekirse düzeltip değişikliği inceleyin.", stopped: "Dinleme bitti.",
      noSupport: "Bu tarayıcı ses tanımayı desteklemiyor. Metin alanında klavye mikrofonunu kullanın.",
      insecure: "Mikrofon için HTTPS veya localhost gerekir.", denied: "Mikrofon izni reddedildi. Tarayıcı ayarlarından izni verebilirsiniz.",
      noSpeech: "Ses algılanmadı; yeniden deneyin.", failure: "Ses tanıma çalışmadı; metinle devam edebilirsiniz.",
      missingCategory: "Önce bir kategori oluşturun.", applied: "Forma eklendi; canlı önizleme güncellendi. Ödeme/yayın yapılmadı.",
      old: "Önceki", new: "Yeni", itemIn: "Kategori", reviewTitle: "Uygulanacak değişiklik"
    },
    en: {
      title: "🎙 Fill by voice", intro: "Select a field, speak, then review the result before it enters your menu. Nothing is automatically published.",
      target: "What would you like to fill?", categorySelect: "Product category", transcript: "Recognized text (editable)",
      start: "Start speaking", stop: "Stop listening", review: "Review change", apply: "Apply to form",
      businessName: "Restaurant name", tagline: "Tagline", description: "Business description", address: "Address",
      businessPhone: "Phone", openingHours: "Opening hours", category: "New category", product: "New product and price",
      privacy: "The microphone starts only when you tap the button. Your browser may use a third-party service for speech recognition. AuraMenu does not save audio.",
      fallback: "If your browser lacks speech recognition, use the iPhone/Android keyboard microphone in the text field below.",
      ready: "Speak or type a value to begin.", listening: "Listening… Speak now.",
      heard: "Transcription ready. Correct any errors before review.", stopped: "Listening stopped.",
      noSupport: "Speech recognition isn't supported here. Use the keyboard microphone in the text field.",
      insecure: "Microphone access requires HTTPS or localhost.", denied: "Microphone permission denied. Enable access in your browser settings.",
      noSpeech: "No speech detected. Try again.", failure: "Speech recognition failed. You can still type the value.",
      missingCategory: "Create a category before adding a product.", applied: "Added to the form and live preview. No purchase or publication occurred.",
      old: "Previous", new: "New", itemIn: "Category", reviewTitle: "Proposed change"
    },
    ar: {
      title: "🎙 املأ بالصوت", intro: "اختر الحقل وتحدث، ثم راجع النص قبل إضافته. لن يُنشر أي شيء تلقائياً.",
      target: "ما المعلومة التي تريد إضافتها؟", categorySelect: "قسم المنتج", transcript: "النص المسموع (يمكن تعديله)",
      start: "ابدأ التحدث", stop: "إيقاف الاستماع", review: "مراجعة التغيير", apply: "تطبيق على النموذج",
      businessName: "اسم المطعم", tagline: "شعار قصير", description: "وصف النشاط", address: "العنوان",
      businessPhone: "الهاتف", openingHours: "ساعات العمل", category: "قسم جديد", product: "منتج جديد وسعره",
      privacy: "يبدأ الميكروفون فقط عند الضغط على الزر. قد يستخدم المتصفح خدمة خارجية للتعرف على الكلام. لا يحفظ AuraMenu الصوت.",
      fallback: "إذا لم يدعم متصفحك التعرف على الكلام، استخدم ميكروفون لوحة مفاتيح الهاتف في الحقل أدناه.",
      ready: "تحدث أو اكتب أولاً.", listening: "نستمع الآن… تفضل بالتحدث.",
      heard: "تم التعرف على الكلام. صحح الأخطاء قبل المراجعة.", stopped: "تم إيقاف الاستماع.",
      noSupport: "المتصفح لا يدعم التعرف على الكلام. استخدم ميكروفون لوحة المفاتيح.",
      insecure: "يحتاج الميكروفون إلى HTTPS أو localhost.", denied: "تم رفض إذن الميكروفون. اسمح به من إعدادات المتصفح.",
      noSpeech: "لم يتم التقاط صوت. حاول مرة أخرى.", failure: "تعذر التعرف على الكلام. يمكنك كتابة البيانات.",
      missingCategory: "أنشئ قسماً قبل إضافة منتج.", applied: "أُضيف إلى النموذج والمعاينة. لم يحدث دفع أو نشر.",
      old: "السابق", new: "الجديد", itemIn: "القسم", reviewTitle: "التغيير المقترح"
    }
  };
  const locale = () => ["tr","en","ar"].includes(document.documentElement.lang) ? document.documentElement.lang : "en";
  const t = (key) => translations[locale()][key] || translations.en[key] || key;
  const recognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  let pending = null;
  let listening = false;

  function status(message, error = false) {
    $("voiceStatus").textContent = message;
    $("voiceStatus").dataset.error = String(error);
  }
  function invalidate() {
    pending = null;
    $("voiceApply").hidden = true;
    $("voiceReviewText").textContent = "";
  }
  function setListening(active) {
    listening = active;
    $("voiceStart").disabled = active;
    $("voiceStop").disabled = !active;
    $("voiceStop").hidden = !active;
  }
  function categories() {
    const selector = $("voiceCategorySelect");
    const previous = selector.value;
    selector.replaceChildren();
    for (const c of bridge.getCategories()) {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.name || "—";
      selector.append(option);
    }
    if ([...selector.options].some(o => o.value === previous)) selector.value = previous;
  }
  function updateUi() {
    for (const element of document.querySelectorAll("[data-voice-i18n]")) {
      element.textContent = t(element.dataset.voiceI18n);
    }
    for (const option of $("voiceTarget").options) {
      option.textContent = t(option.value);
    }
    $("voiceProductCategory").hidden = $("voiceTarget").value !== "product";
    categories();
    if (!recognitionClass) {
      $("voiceStart").disabled = true;
      $("voiceSupport").textContent = t("noSupport") + " " + t("fallback");
    } else {
      $("voiceSupport").textContent = t("fallback");
    }
  }
  function stop() {
    if (recognizer && listening) {
      try { recognizer.stop(); } catch {}
    }
    setListening(false);
  }
  function cancel() {
    const old = recognizer; recognizer = null;
    try { old?.abort?.(); } catch {}
    setListening(false);
  }
  document.addEventListener("auramenu:speech-start", event => { if (event.detail !== "field") cancel(); });
  document.addEventListener("auramenu:draft-changed", () => { invalidate(); categories(); });
  window.addEventListener("pagehide", cancel);
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancel(); });
  $("voiceStart").addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("auramenu:speech-start", { detail: "field" }));
    invalidate();
    if (!recognitionClass) return status(t("noSupport"), true);
    if (window.isSecureContext === false) return status(t("insecure"), true);
    stop();
    try {
      const r = new recognitionClass();
      recognizer = r;
      r.lang = ({tr:"tr-TR",en:"en-US",ar:"ar-SA"})[locale()];
      r.continuous = false;
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onresult = (event) => {
        if (recognizer !== r) return;
        const result = Array.from(event.results).filter(x => x.isFinal).map(x => x[0]?.transcript || "").join(" ").trim();
        if (result) {
          $("voiceTranscript").value = result;
          invalidate();
          status(t("heard"));
        } else status(t("noSpeech"), true);
      };
      r.onerror = (event) => {
        if (recognizer !== r) return;
        const reason = event.error === "not-allowed" || event.error === "service-not-allowed" ? "denied" :
          event.error === "no-speech" ? "noSpeech" : "failure";
        status(t(reason), true);
      };
      r.onend = () => {
        if (recognizer === r) {
          recognizer = null;
          setListening(false);
        }
      };
      r.start();
      setListening(true);
      status(t("listening"));
    } catch {
      recognizer = null;
      setListening(false);
      status(t("failure"), true);
    }
  });
  $("voiceStop").addEventListener("click", stop);
  $("voiceTranscript").addEventListener("input", invalidate);
  $("voiceTarget").addEventListener("change", () => {
    cancel();
    invalidate();
    updateUi();
  });
  $("voiceCategorySelect").addEventListener("change", invalidate);
  $("voiceReview").addEventListener("click", () => {
    invalidate();
    try {
      const selected = $("voiceTarget").value;
      const parsed = core.parse(selected, $("voiceTranscript").value);
      let review = "";
      if (parsed.kind === "field") {
        const existing = $(selected)?.value || "";
        review = t("reviewTitle") + " — " + t(selected) +
          "\n" + t("old") + ": " + (existing || "—") +
          "\n" + t("new") + ": " + parsed.value;
      } else if (parsed.kind === "category") {
        review = t("reviewTitle") + " — " + t("category") + ": " + parsed.name;
      } else {
        const chosen = $("voiceCategorySelect").selectedOptions[0];
        if (!chosen) throw new Error(t("missingCategory"));
        review = t("reviewTitle") + " — " + t("itemIn") + ": " + chosen.textContent +
          "\n" + parsed.name + " — " + parsed.price + (parsed.description ? "\n" + parsed.description : "");
      }
      pending = {
        transcript: $("voiceTranscript").value,
        target: selected,
        categoryId: $("voiceCategorySelect").value,
        parsed, base: JSON.stringify(bridge.getDraft())
      };
      $("voiceReviewText").textContent = review;
      $("voiceApply").hidden = false;
      status(t("heard"));
    } catch (error) {
      status(error?.message || t("failure"), true);
    }
  });
  $("voiceApply").addEventListener("click", () => {
    if (!pending ||
        pending.transcript !== $("voiceTranscript").value ||
        pending.target !== $("voiceTarget").value ||
        pending.categoryId !== $("voiceCategorySelect").value || pending.base !== JSON.stringify(bridge.getDraft())) {
      invalidate();
      return status(t("review"), true);
    }
    try {
      const result = core.parse(pending.target, pending.transcript);
      if (result.kind === "field") {
        const field = $(result.target);
        if (!field) throw new Error("Field not found.");
        field.value = result.value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        if (result.target === "businessName") field.dispatchEvent(new Event("blur"));
      } else if (result.kind === "category") {
        bridge.addCategory(result.name);
      } else {
        bridge.addProduct(pending.categoryId, result);
      }
      invalidate();
      categories();
      status(t("applied"));
    } catch (error) {
      status(error?.message || t("failure"), true);
    }
  });
  // Keep language labels aligned with the builder's existing TR / EN / AR switch.
  new MutationObserver(() => { invalidate(); updateUi(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  updateUi();
  status(t("ready"));
})();
