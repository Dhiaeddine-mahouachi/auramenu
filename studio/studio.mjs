import { registry,getTemplate } from '../standard/registry.mjs';
import { button,el } from '../standard/dom.mjs';
import { webUrl,appearanceMode } from '../standard/data.mjs';
import { datasets,fixture } from './fixtures.mjs';

const $ = id => document.getElementById(id);
const frame = $('frame');
const gallery = $('gallery');
const inspector = $('inspector');
const modes = Array.from(document.querySelectorAll('[data-mode]'));
const colors = {primary:'Primary',secondary:'Secondary',background:'Background',text:'Text',accent:'Accent'};
const visibility = {images:'Product photos',prices:'Prices',information:'Restaurant info',socials:'Social links',play:'AuraPlay',motion:'Animations',ornaments:'Ornaments'};
const fontNames = {sans:'Sans serif',serif:'Serif',mono:'Monospace',editorial:'Editorial serif',condensed:'Condensed'};
const options = new URLSearchParams(location.search);
const validDataset = id => datasets.some(([key]) => key === id);
let current = getTemplate(options.get('template')) || registry[0];
let sample, defaults, overrides = {}, timer, desktop = false, comparison;
const collections = {all:'All designs',standard:'Standard',premium:'Premium',heritage:'Heritage',signature:'Signature',experience:'Experience','3d':'3D'};
const filterButtons = [];
let filter = 'all';

for (const [id,label] of datasets) {
  const option = new Option(label,id);
  $('dataset').append(option);
}
if (validDataset(options.get('dataset'))) $('dataset').value = options.get('dataset');
if (['en','tr','ar'].includes(options.get('lang'))) $('language').value = options.get('lang');
$('appearance').value = appearanceMode(options.get('appearance'));
for (const [key,label] of Object.entries(colors)) {
  const input = el('input');
  input.type = 'color';
  input.dataset.color = key;
  $('colors').append(el('label','',label,input));
}
for (const select of document.querySelectorAll('[data-font]')) {
  for (const [key,name] of Object.entries(fontNames)) select.add(new Option(name,key));
}
for (const [key,label] of Object.entries(visibility)) {
  const input = el('input');
  input.type = 'checkbox'; input.checked = true; input.dataset.toggle = key;
  $('toggles').append(el('label','',input,label));
}
const previews = registry.map((entry,index) => {
  $('compare-template').add(new Option(entry.name,entry.id));
  const item = button('',() => choose(entry,true),'tile');
  item.setAttribute('aria-label','Preview '+entry.name);
  const image = el('img');
  image.src = entry.previewImage; image.alt = ''; image.width = 256; image.height = 420; image.loading = index < 6 ? 'eager' : 'lazy'; image.decoding = 'async';
  item.append(el('span','tile-cover',image),el('span','tile-text',el('h3','',entry.name),
    el('p','',entry.description),el('span','tile-meta',
      el('span','',entry.id.toUpperCase() + ' · ' + collections[entry.collection]),el('b','',entry.tier === 'premium' ? 'Premium' : 'Preview'))));
  gallery.append(item);
  return item;
});
for (const [key,label] of Object.entries(collections)) {
  const control = button(label,() => { filter = key; applyFilter(); });
  control.dataset.collection = key;
  filterButtons.push(control);
  $('filters').append(control);
}
function applyFilter() {
  let count = 0;
  registry.forEach((entry,index) => {
    const visible = filter === 'all' || entry.tier === filter || entry.collection === filter;
    previews[index].hidden = !visible;
    if (visible) count++;
  });
  $('visible-count').textContent = count + ' designs';
  filterButtons.forEach(control => control.setAttribute('aria-pressed',String(control.dataset.collection === filter)));
}
function accessNote() {
  const entitled = current.tier === 'standard' || $('account-view').value === 'premium';
  $('access-note').textContent = entitled ? 'Included in the selected account tier.' : 'Premium preview · activation requires Premium access.';
}
function postMenu(target = frame) {
  if (!sample) return;
  const assetMode = $('assets').value;
  const entry = target === frame ? current : getTemplate($('compare-template').value);
  const advanced = assetMode === 'advanced' || (assetMode === 'auto' && entry?.asset && entry.dataset === sample.fixture);
  const fixtureData = advanced ? fixture(sample.fixture,{advanced:true}) : sample;
  const mode = assetMode === 'missing' ? {images:false} : assetMode === 'slow' ? {motion:false,slow:true} : {};
  const menu = {...fixtureData,design:{...overrides,...mode},menuLanguage:$('language').value};
  target.contentWindow?.postMessage({type:'auramenu:render',menu,draft:true,appearance:$('appearance').value},location.origin);
}
function updateAppearance(value,source) {
  const appearance = appearanceMode(value);
  $('appearance').value = appearance;
  for (const pane of [frame,comparison]) {
    if (pane && pane.contentWindow !== source) {
      pane.contentWindow?.postMessage({type:'auramenu:appearance',appearance},location.origin);
    }
  }
  const url = new URL(location.href);
  if (appearance === 'original') url.searchParams.delete('appearance');
  else url.searchParams.set('appearance',appearance);
  history.replaceState(null,'',url);
}
function postActive() {
  postMenu();
  if (comparison) postMenu(comparison);
}
function applySample() {
  const id = $('dataset').value || current.dataset;
  sample = fixture(id);
  $('sample-label').textContent = datasets.find(([key]) => key === id)?.[1].split(' · ')[0] || sample.businessName;
  postActive();
}
function choose(entry, show) {
  const previous = current;
  current = entry;
  $('preview-name').textContent = current.name;
  $('product-shot').href = new URL('./screens/' + entry.key + '.webp',import.meta.url).href;
  accessNote();
  for (const [index,tile] of previews.entries()) tile.setAttribute('aria-pressed',String(registry[index] === entry));
  if (previous?.id !== current.id || !frame.hasAttribute('src')) {
    frame.src = '../standard/frame.html?template=' + current.id;
    frame.title = current.name + ' interactive menu preview';
  }
  applySample();
  const url = new URL(location.href);
  url.searchParams.set('template',entry.id);
  history.replaceState(null,'',url);
  if (show && matchMedia('(max-width:760px)').matches) inspector.scrollIntoView({block:'start'});
}
function configureDevice() {
  const width = $('width').value;
  for (const pane of [$('device'),$('compare-device')]) pane.style.setProperty('--device-width',width+'px');
  inspector.parentElement.classList.toggle('desktop-mode',desktop);
  $('width').parentElement.hidden = desktop;
  $('preview-size').textContent = desktop ? 'Desktop preview' : width+' px mobile';
  for (const mode of modes) mode.setAttribute('aria-pressed',String(mode.dataset.mode === (desktop ? 'desktop' : 'mobile')));
}
function syncSettings() {
  if (!defaults) return;
  for (const input of $('design').querySelectorAll('input,select')) {
    const key = input.dataset.color || input.dataset.font || (Object.hasOwn(input.dataset,'radius') ? 'radius' : null);
    if (key) input.value = overrides[key] ?? defaults[key];
    if (input.dataset.toggle) input.checked = overrides[input.dataset.toggle] !== false;
    if (input.dataset.asset) input.value = overrides[input.dataset.asset] ?? '';
  }
}
window.addEventListener('message',event => {
  if (event.origin !== location.origin) return;
  const knownFrame = event.source === frame.contentWindow || (comparison && event.source === comparison.contentWindow);
  if (!knownFrame) return;
  if (event.data?.type === 'auramenu:appearance') {
    updateAppearance(event.data.appearance,event.source);
    return;
  }
  if (comparison && event.source === comparison.contentWindow) {
    if (event.data?.type === 'auramenu:template-ready') postMenu(comparison);
    return;
  }
  if (event.data?.type === 'auramenu:template-ready') postMenu();
  if (event.data?.type === 'auramenu:rendered') {
    defaults = event.data.defaults;
    $('contrast').textContent = event.data.adjusted ? 'Preview adjusted text for readable contrast.' : '';
    if (!$('design').contains(document.activeElement)) syncSettings();
  }
  if (event.data?.type === 'auramenu:language' && ['en','tr','ar'].includes(event.data.language)) {
    $('language').value = event.data.language;
    if (comparison) postMenu(comparison);
  }
});
$('design').addEventListener('toggle',() => { if ($('design').open) syncSettings(); });
$('design').addEventListener('input',event => {
  const control = event.target;
  if (control.dataset.asset) {
    if (control.value && !webUrl(control.value)) {
      control.setCustomValidity('Enter a valid HTTP or HTTPS image URL.');
      return;
    }
    control.setCustomValidity('');
    if (control.value) overrides[control.dataset.asset] = control.value;
    else delete overrides[control.dataset.asset];
  }
  if (control.dataset.color) overrides[control.dataset.color] = control.value;
  if (control.dataset.font) overrides[control.dataset.font] = control.value;
  if (control.dataset.toggle) overrides[control.dataset.toggle] = control.checked;
  if (Object.hasOwn(control.dataset,'radius')) overrides.radius = Number(control.value);
  clearTimeout(timer);
  timer = setTimeout(postActive,90);
});
$('reset').addEventListener('click',() => {
  overrides = {};
  for (const input of document.querySelectorAll('[data-asset]')) input.setCustomValidity('');
  syncSettings(); postActive();
});
$('dataset').addEventListener('change',applySample);
$('language').addEventListener('change',postActive);
$('appearance').addEventListener('change',event=>updateAppearance(event.target.value));
$('width').addEventListener('change',configureDevice);
for (const mode of modes) mode.addEventListener('click',() => {
  desktop = mode.dataset.mode === 'desktop';
  configureDevice();
});
$('assets').addEventListener('change',postActive);
$('account-view').addEventListener('change',accessNote);
function refreshComparison() {
  const entry = getTemplate($('compare-template').value);
  if (!comparison || !entry) return;
  comparison.src = '../standard/frame.html?template=' + entry.id;
  comparison.title = entry.name + ' comparison preview';
}
$('compare-template').addEventListener('change',refreshComparison);
$('comparison').addEventListener('click',() => {
  if (comparison) {
    comparison.remove();
    comparison = null;
  } else {
    const match = registry.find(entry => entry.id !== current.id && entry.tier === current.tier) || registry[0];
    $('compare-template').value = match.id;
    comparison = el('iframe');
    $('compare-device').append(comparison);
    refreshComparison();
  }
  $('compare-pane').hidden = !comparison;
  inspector.classList.toggle('comparing',Boolean(comparison));
  $('comparison').setAttribute('aria-pressed',String(Boolean(comparison)));
});
applyFilter();
configureDevice();
choose(current,false);
