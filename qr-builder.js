(() => {
  const root = document.getElementById('qrBuilder');
  if (!root || typeof QRCode === 'undefined') return;

  const $ = (id) => document.getElementById(id);
  const copy = {
    tr: { title:'QR Kodunuzu oluşturun', intro:'QR kodunuz menü bağlantınıza otomatik bağlanır. Renkleri, çerçeveyi ve logoyu özelleştirip PNG olarak indirebilirsiniz.', dark:'QR rengi', light:'Arka plan', frame:'Çerçeve', label:'QR üzerindeki yazı', logo:'Logo (isteğe bağlı)', remove:'Logoyu kaldır', download:'PNG indir', helper:'Menü içerikleri daha sonra değişse bile aynı bağlantıyı kullandığınız sürece QR kodunu yeniden basmanız gerekmez.', preview:'Menüyü Görüntüle' },
    en: { title:'Build your QR code', intro:'Your QR code is linked automatically to your menu URL. Customize colors, frame and logo, then download it as PNG.', dark:'QR color', light:'Background', frame:'Frame', label:'Text above QR', logo:'Logo (optional)', remove:'Remove logo', download:'Download PNG', helper:'You can update menu content later without reprinting the QR as long as the menu URL stays the same.', preview:'View Menu' },
    ar: { title:'أنشئ رمز QR', intro:'يرتبط رمز QR تلقائياً برابط قائمتك. خصص الألوان والإطار والشعار ثم نزّله بصيغة PNG.', dark:'لون QR', light:'الخلفية', frame:'الإطار', label:'النص أعلى QR', logo:'الشعار (اختياري)', remove:'حذف الشعار', download:'تنزيل PNG', helper:'يمكنك تعديل محتوى القائمة لاحقاً دون إعادة طباعة رمز QR ما دام رابط القائمة نفسه.', preview:'عرض القائمة' }
  };

  let qr;
  let logoData = '';
  let timer;

  function currentLang(){
    return ['tr','en','ar'].includes(document.documentElement.lang) ? document.documentElement.lang : 'tr';
  }
  function menuUrl(){
    const slug = String($('slug')?.value || '').trim().replace(/^\/+|\/+$/g,'');
    return `https://auramenu.space/${slug || 'menu'}`;
  }
  function updateText(){
    const t = copy[currentLang()];
    $('[data-qr="title"]').textContent=t.title;
    $('[data-qr="intro"]').textContent=t.intro;
    $('[data-qr="dark"]').textContent=t.dark;
    $('[data-qr="light"]').textContent=t.light;
    $('[data-qr="frame"]').textContent=t.frame;
    $('[data-qr="label"]').textContent=t.label;
    $('[data-qr="logo"]').textContent=t.logo;
    $('[data-qr="remove"]').textContent=t.remove;
    $('[data-qr="download"]').textContent=t.download;
    $('[data-qr="helper"]').textContent=t.helper;
    if (!$('qrLabel').dataset.edited) $('qrLabel').value=t.preview;
    render();
  }
  function render(){
    if (timer) clearTimeout(timer);
    timer=setTimeout(()=>{
      const target=$('qrCode');
      target.innerHTML='';
      const dark=$('qrDark').value || '#111111';
      const light=$('qrLight').value || '#ffffff';
      qr=new QRCode(target,{text:menuUrl(),width:220,height:220,colorDark:dark,colorLight:light,correctLevel:QRCode.CorrectLevel.H});
      $('qrUrl').textContent=menuUrl();
      $('qrPreviewCard').dataset.frame=$('qrFrame').value;
      $('qrPreviewTitle').textContent=$('qrLabel').value.trim() || copy[currentLang()].preview;
      $('qrLogoPreview').src=logoData || '';
      $('qrLogoPreview').classList.toggle('show',Boolean(logoData));
    },40);
  }
  function roundedRect(ctx,x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
  }
  async function exportPng(){
    const source=$('qrCode').querySelector('canvas');
    if(!source) return;
    const size=1200, margin=120, qrSize=760;
    const canvas=document.createElement('canvas');canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d');
    const frame=$('qrFrame').value;
    const bg=frame==='dark' ? '#111111' : '#ffffff';
    const fg=frame==='dark' ? '#ffffff' : '#111111';
    ctx.fillStyle=bg;roundedRect(ctx,0,0,size,size,70);ctx.fill();
    ctx.fillStyle=fg;ctx.textAlign='center';ctx.font='700 58px Manrope, Arial, sans-serif';
    ctx.fillText(($('qrLabel').value.trim() || copy[currentLang()].preview).slice(0,40),size/2,105);
    ctx.font='400 28px DM Sans, Arial, sans-serif';ctx.globalAlpha=.68;ctx.fillText(menuUrl().slice(0,62),size/2,155);ctx.globalAlpha=1;
    ctx.fillStyle=$('qrLight').value || '#ffffff';roundedRect(ctx,(size-qrSize)/2,210,qrSize,qrSize,36);ctx.fill();
    ctx.imageSmoothingEnabled=false;ctx.drawImage(source,(size-qrSize)/2+35,245,qrSize-70,qrSize-70);ctx.imageSmoothingEnabled=true;
    if(logoData){
      const img=new Image();
      await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=logoData;});
      const box=190,x=(size-box)/2,y=210+(qrSize-box)/2;
      ctx.fillStyle='#ffffff';roundedRect(ctx,x-12,y-12,box+24,box+24,40);ctx.fill();ctx.save();roundedRect(ctx,x,y,box,box,32);ctx.clip();ctx.drawImage(img,x,y,box,box);ctx.restore();
    }
    ctx.fillStyle=fg;ctx.font='600 26px DM Sans, Arial, sans-serif';ctx.globalAlpha=.72;ctx.fillText('AuraMenu',size/2,1085);ctx.globalAlpha=1;
    const link=document.createElement('a');link.download=`${(($('slug')?.value||'auramenu').trim()||'auramenu')}-qr.png`;link.href=canvas.toDataURL('image/png');link.click();
  }

  ['qrDark','qrLight','qrFrame'].forEach(id=>$(id)?.addEventListener('input',render));
  $('qrLabel')?.addEventListener('input',()=>{$('qrLabel').dataset.edited='1';render();});
  $('slug')?.addEventListener('input',render);
  $('qrLogo')?.addEventListener('change',(event)=>{
    const file=event.target.files?.[0]; if(!file) return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size>2*1024*1024){event.target.value='';return;}
    const reader=new FileReader();reader.onload=()=>{logoData=String(reader.result||'');render();};reader.readAsDataURL(file);
  });
  $('qrRemoveLogo')?.addEventListener('click',()=>{logoData='';$('qrLogo').value='';render();});
  $('qrDownload')?.addEventListener('click',exportPng);
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(updateText,0)));
  updateText();
})();