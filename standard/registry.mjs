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
export const registry = Object.freeze(templates.map(([key,name,description,dataset], index) =>
  Object.freeze({
    key, id: 'std-' + String(index + 1).padStart(2,'0'), name: 'Aura ' + name,
    description, dataset, tier: 'standard', version: 1, enabled: true,
    previewImage: new URL('../studio/thumbs/' + key + '.webp', import.meta.url).href,
    options, stylesheet:new URL('./templates/' + key + '.css', import.meta.url).href,
    load: () => import('./templates/' + key + '.mjs'),
  })));
export const getTemplate = id => registry.find(entry => entry.id === id && entry.enabled);
