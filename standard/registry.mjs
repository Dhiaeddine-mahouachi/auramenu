const premiumCatalog = [
  ['nouveau','Nouveau','heritage','Botanical chapters, ornamental borders and parchment.','coffee'],
  ['gatsby','Gatsby','heritage','Art Deco geometry and a vertical hotel-directory index.','fine'],
  ['epoque','Époque','heritage','A brasserie booklet with direct chapter navigation.','italian'],
  ['atelier-maison','Maison','signature','Asymmetric spreads from a culinary magazine.','fine'],
  ['kyoto','Kyoto','signature','Quiet compositions, natural materials and asymmetry.','coffee'],
  ['studio','Studio','signature','Swiss typography, a visible grid and indexed dishes.','italian'],
  ['liquid','Liquid','signature','A soft translucent interface with a floating category bar.','dessert'],
  ['cinematic','Cinematic','experience','A dark, wide-format restaurant and dish showcase.','arabic'],
  ['atelier-orbit','Orbit','experience','A circular featured-dish selector with direct browsing.','burger'],
  ['gallery','Gallery','experience','A curated exhibition of dishes with a practical menu index.','italian'],
  ['popout','PopOut','3d','Product cutouts rise off bold graphic stages.','burger','cutout'],
  ['layers','Layers','3d','Explore verified ingredient layers with a conventional ingredient list.','burger','layers'],
  ['exhibition','Exhibition','3d','Individual dishes presented on gallery pedestals.','fine','cutout'],
  ['retro-3d','Retro 3D','3d','A retro arcade menu with stepped graphic depth.','dessert','cutout'],
  ['reality','Reality','3d','A technical product catalog with an optional interactive model.','burger','model'],
];

const options = Object.freeze(['primary','secondary','background','text','accent','logo','cover','heading','body','radius','images','prices','information','socials','play']);
const templates = [
  ['classic','Classic','A compact list, clear prices and sticky category tabs.','burger'],
  ['grid','Grid','A two-column gallery built around dish photography.','italian'],
  ['minimal','Minimal','An ivory, type-led menu with fine rules and airy spacing.','fine'],
  ['noir','Noir','Charcoal surfaces and warm metallic accents.','fine'],
  ['bento','Bento','Featured dishes anchor a modular, asymmetric grid.','arabic'],
  ['roast','Roast','A warm café menu with a scrollable counter of favorites.','coffee'],
  ['pop','Pop','Bold color blocks, strong type and space for specials.','burger'],
  ['royal','Royal','Architectural arches and elegant right-to-left typography.','arabic'],
  ['dolce','Dolce','Soft tones, rounded cards and a seasonal gallery.','dessert'],
  ['zen','Zen','A low-distraction index for browsing long menus.','coffee'],
  ['feed','Feed','Full-width photos in a continuous vertical feed.','italian'],
  ['float','Float','A layered showcase with a featured-dish carousel.','dessert'],
  ['heritage','Heritage','A restaurant story and menu laid out like a culinary magazine.','fine'],
  ['panel','Panel','A compact category sidebar and quick dish search.','burger'],
  ['tiles','Tiles','Photo-led category navigation with dedicated category views.','arabic'],
];
const standard = templates.map(([key,name,description,dataset], index) =>
  Object.freeze({
    key, id: 'std-' + String(index + 1).padStart(2,'0'), name: 'Aura ' + name,
    description, dataset, collection:'standard', tier: 'standard', version: 1, enabled: true,
    previewImage: new URL('../studio/thumbs/' + key + '.webp', import.meta.url).href,
    options, stylesheet:new URL('./templates/' + key + '.css', import.meta.url).href,
    load: () => import('./templates/' + key + '.mjs'),
  }));
const premium = premiumCatalog.map(([key,name,collection,description,dataset,asset],index) =>
  Object.freeze({
    key,id:'pre-' + (index + 16),name:'Aura ' + name,collection,description,dataset,
    tier:'premium',version:1,enabled:true,asset,options:Object.freeze([...options,'motion','ornaments']),
    previewImage:new URL('../studio/thumbs/' + key + '.webp',import.meta.url).href,
    stylesheet:new URL('../premium/templates/' + key + '.css',import.meta.url).href,
    load:() => import('../premium/templates/' + key + '.mjs'),
  }));
export const registry = Object.freeze([...standard,...premium]);
export const getTemplate = id => registry.find(entry => entry.id === id && entry.enabled);
