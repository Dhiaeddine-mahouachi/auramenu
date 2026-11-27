(() => {
 const catalogue=window.AuraMenuPlans, select=document.getElementById('planId');
 const t={en:{label:'Choose your plan',month:'month',once:'year',monthly:'Hosting and menu editing are included. Pay monthly by bank transfer; each renewal starts after payment confirmation.',single:'Pay once a year by bank transfer. Hosting and menu editing are included for 12 months; renewal starts after payment confirmation.',pending:'Your menu is in progress and is not live yet. Payment instructions appear after submission. Publishing starts after payment verification and approval.',custom:'Need a custom menu? Request a quote.'},tr:{label:'Planınızı seçin',month:'ay',once:'yıl',monthly:'Hosting ve menü düzenleme dahildir. Her ay havale ile ödeme yapılır; yenileme ödeme onayından sonra başlar.',single:'Yılda bir kez havale ile ödeyin. 12 ay boyunca hosting ve menü düzenleme dahildir; yenileme ödeme onayından sonra başlar.',pending:'Menünüz hazırlanıyor, henüz yayında değil. Ödeme bilgileri başvurudan sonra görünür. Ödeme ve yayın onayından sonra açılır.',custom:'Özel menü mü istiyorsunuz? Teklif isteyin.'},ar:{label:'اختر خطتك',month:'شهر',once:'سنة',monthly:'الاستضافة وتعديل القائمة مشمولان. الدفع شهرياً بالتحويل البنكي؛ يبدأ التجديد بعد تأكيد الدفع.',single:'ادفع مرة في السنة بالتحويل البنكي. الاستضافة وتعديل القائمة مشمولان لمدة 12 شهراً؛ يبدأ التجديد بعد تأكيد الدفع.',pending:'قائمتك قيد الإنجاز وليست منشورة بعد. تظهر بيانات الدفع بعد إرسال الطلب. النشر بعد تأكيد الدفع والموافقة.',custom:'تريد قائمة مخصصة؟ اطلب عرض سعر.'}};
 const params=new URLSearchParams(location.search),requested=params.get('plan');
 if(catalogue.current().some(p=>p.id===requested))select.value=requested;
 function apply(){const copy=t[document.documentElement.lang]||t.en, plans=catalogue.current(), plan=plans.find(p=>p.id===select.value)||plans[0];
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
 catalogue.load().then(apply);apply();
})();
