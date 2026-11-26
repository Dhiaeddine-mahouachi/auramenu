const en = {
  home:'Home',gallery:'Gallery view',list:'List view',explore:'Explore menu', previousChapter:'Previous category',nextChapter:'Next category',
  viewModel:'View in 3D', modelFailed:'The 3D view is unavailable. The dish photo and details are above.',
  showLayers:'Explore ingredient layers', hideLayers:'Hide ingredient layers',
  rotation:'Rotate model',left:'Rotate left',right:'Rotate right',up:'Rotate up',down:'Rotate down',
  zoomIn:'Zoom in',zoomOut:'Zoom out',reset:'Reset view',viewing:'Interactive 3D model',
};
const tr = {
  home:'Ana sayfa',gallery:'Galeri görünümü',list:'Liste görünümü',explore:'Menüyü keşfet',previousChapter:'Önceki kategori',nextChapter:'Sonraki kategori',
  viewModel:'3B görüntüle',modelFailed:'3B görünüm kullanılamıyor. Fotoğraf ve bilgiler yukarıda.',
  showLayers:'İçerik katmanlarını keşfet',hideLayers:'İçerik katmanlarını gizle',
  rotation:'Modeli döndür',left:'Sola döndür',right:'Sağa döndür',up:'Yukarı döndür',down:'Aşağı döndür',
  zoomIn:'Yakınlaştır',zoomOut:'Uzaklaştır',reset:'Görünümü sıfırla',viewing:'Etkileşimli 3B model',
};
const ar = {
  home:'الرئيسية',gallery:'عرض المعرض',list:'عرض القائمة',explore:'استكشف القائمة',previousChapter:'القسم السابق',nextChapter:'القسم التالي',
  viewModel:'عرض ثلاثي الأبعاد',modelFailed:'العرض ثلاثي الأبعاد غير متاح. الصورة والتفاصيل أعلاه.',
  showLayers:'استكشف طبقات المكونات',hideLayers:'أخفِ طبقات المكونات',
  rotation:'أدر النموذج',left:'أدر يسارًا',right:'أدر يمينًا',up:'أدر لأعلى',down:'أدر لأسفل',
  zoomIn:'تكبير',zoomOut:'تصغير',reset:'إعادة ضبط العرض',viewing:'نموذج تفاعلي ثلاثي الأبعاد',
};
export const premiumCopy = lang => ({en,tr,ar})[lang] || en;
