(() => {
 const plans=window.AURA_MENU_CONFIG.plans, select=document.getElementById('planId');
 const t={en:{label:'Choose your plan',month:'month',once:'one-time',monthly:'Hosting and menu editing are included. Pay monthly by bank transfer; each renewal starts after payment confirmation.',single:'Pay 2,500 TL once. The first 6 months of hosting are included, then pay 200 TL every 6 months.',pending:'Your menu is in progress and is not live yet. Payment instructions appear after submission. Publishing starts after payment verification and approval.',custom:'Need a custom menu? Request a quote.'},tr:{label:'Planınızı seçin',month:'ay',once:'tek sefer',monthly:'Hosting ve menü düzenleme dahildir. Her ay havale ile ödeme yapılır; yenileme ödeme onayından sonra başlar.',single:'Tek sefer 2.500 TL. İlk 6 ay hosting dahildir, ardından 6 ayda bir 200 TL.',pending:'Menünüz hazırlanıyor, henüz yayında değil. Ödeme bilgileri başvurudan sonra görünür. Ödeme ve yayın onayından sonra açılır.',custom:'Özel menü mü istiyorsunuz? Teklif isteyin.'},ar:{label:'اختر خطتك',month:'شهر',once:'مرة واحدة',monthly:'الاستضافة وتعديل القائمة مشمولان. الدفع شهرياً بالتحويل البنكي؛ يبدأ التجديد بعد تأكيد الدفع.',single:'ادفع 2500 ليرة مرة واحدة. أول 6 أشهر استضافة مشمولة، ثم 200 ليرة كل 6 أشهر.',pending:'قائمتك قيد الإنجاز وليست منشورة بعد. تظهر بيانات الدفع بعد إرسال الطلب. النشر بعد تأكيد الدفع والموافقة.',custom:'تريد قائمة مخصصة؟ اطلب عرض سعر.'}};
 const params=new URLSearchParams(location.search),requested=params.get('plan');
 if(plans.some(p=>p.id===requested))select.value=requested;
 function apply(){const copy=t[document.documentElement.lang]||t.en, plan=plans.find(p=>p.id===select.value)||plans[0];
 document.getElementById('planLabel').textContent=copy.label;
 document.querySelector('[data-i18n="selfPriceLabel"]').textContent=plan.name;
 document.querySelector('[data-plan-price]').textContent=plan.amount+' TL / '+(plan.interval==='monthly'?copy.month:copy.once);
 document.querySelector('[data-i18n="selfPriceNote"]').textContent=plan.interval==='monthly'?copy.monthly:copy.single;
 document.getElementById('planTerms').textContent=plan.interval==='monthly'?copy.monthly:copy.single;
 document.getElementById('planConsent').textContent=copy.pending;
 document.getElementById('customMenuLink').textContent=copy.custom;
 }
 select.addEventListener('change',apply);
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setTimeout(apply,0)));
 Promise.resolve(window.AuraMenuPricing?.ready).finally(apply);apply();
})();
