import { registry,getTemplate } from '../standard/registry.mjs';
import { button,el } from '../standard/dom.mjs';
import { webUrl } from '../standard/data.mjs';
import { datasets,fixture } from './fixtures.mjs';

const $ = id => document.getElementById(id);
const frame = $('frame');
const gallery = $('gallery');
const inspector = $('inspector');
const modes = Array.from(document.querySelectorAll('[data-mode]'));
const colors = {primary:'Primary',secondary:'Secondary',background:'Background',text:'Text',accent:'Accent'};
const visibility = {images:'Product photos',prices:'Prices',information:'Restaurant info',socials:'Social links',play:'AuraPlay'};
const fontNames = {sans:'Sans serif',serif:'Serif',mono:'Monospace',editorial:'Editorial serif',condensed:'Condensed'};
const options = new URLSearchParams(location.search);
const validDataset = id => datasets.some(([key]) => key === id);
let current = getTemplate(options.get('template')) || registry[0];
let sample, defaults, overrides = {}, timer, desktop = false;

for (const [id,label] of datasets) {
  const option = new Option(label,id);
  $('dataset').append(option);
}
if (validDataset(options.get('dataset'))) $('dataset').value = options.get('dataset');
if (['en','tr','ar'].includes(options.get('lang'))) $('language').value = options.get('lang');
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
  const item = button('',() => choose(entry,true),'tile');
  item.setAttribute('aria-label','Preview '+entry.name);
  const image = el('img');
  image.src = entry.previewImage; image.alt = ''; image.width = 256; image.height = 420; image.loading = index < 6 ? 'eager' : 'lazy'; image.decoding = 'async';
  item.append(el('span','tile-cover',image),el('span','tile-text',el('h3','',entry.name),
    el('p','',entry.description),el('span','tile-meta',el('span','','Standard'),el('b','','Preview'))));
  gallery.append(item);
  return item;
});
function postMenu() {
  if (!sample) return;
  const menu = {...sample,design:{...overrides},menuLanguage:$('language').value};
  frame.contentWindow?.postMessage({type:'auramenu:render',menu,draft:true},location.origin);
}
function applySample() {
  const id = $('dataset').value || current.dataset;
  sample = fixture(id);
  $('sample-label').textContent = datasets.find(([key]) => key === id)?.[1].split(' · ')[0] || sample.businessName;
  postMenu();
}
function choose(entry, show) {
  const previous = current;
  current = entry;
  $('preview-name').textContent = current.name;
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
  $('device').style.setProperty('--device-width',width+'px');
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
  if (event.origin !== location.origin || event.source !== frame.contentWindow) return;
  if (event.data?.type === 'auramenu:template-ready') postMenu();
  if (event.data?.type === 'auramenu:rendered') {
    defaults = event.data.defaults;
    $('contrast').textContent = event.data.adjusted ? 'Preview adjusted text for readable contrast.' : '';
    if (!$('design').contains(document.activeElement)) syncSettings();
  }
  if (event.data?.type === 'auramenu:language' && ['en','tr','ar'].includes(event.data.language)) $('language').value = event.data.language;
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
  timer = setTimeout(postMenu,90);
});
$('reset').addEventListener('click',() => {
  overrides = {};
  for (const input of document.querySelectorAll('[data-asset]')) input.setCustomValidity('');
  syncSettings(); postMenu();
});
$('dataset').addEventListener('change',applySample);
$('language').addEventListener('change',postMenu);
$('width').addEventListener('change',configureDevice);
for (const mode of modes) mode.addEventListener('click',() => {
  desktop = mode.dataset.mode === 'desktop';
  configureDevice();
});
configureDevice();
choose(current,false);
