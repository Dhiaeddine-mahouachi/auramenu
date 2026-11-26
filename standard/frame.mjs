import { prepareStandard } from './entry.mjs';

const parentOrigin = location.origin;
const root = document.getElementById('preview');
const id = new URLSearchParams(location.search).get('template');
const prepared = prepareStandard(id);
let active, latest, currentLanguage, sequence = 0;

async function paint() {
  const attempt = ++sequence;
  try {
    const { mount, template } = await prepared;
    if (attempt !== sequence) return;
    const state = active?.state;
    active?.dispose();
    active = mount(root,latest,{state,language:currentLanguage,onLanguage:(language) => {
      currentLanguage = language;
      paint();
      parent.postMessage({type:'auramenu:language',language},parentOrigin);
    }});
    root.closest('html').lang = root.firstElementChild.lang;
    root.closest('html').dir = root.firstElementChild.dir;
    parent.postMessage({type:'auramenu:rendered',adjusted:active.tokens.adjusted,defaults:template.defaults},parentOrigin);
  } catch {
    if (attempt !== sequence) return;
    const error = document.createElement('p');
    error.className = 'sm-frame-status';
    error.setAttribute('role','alert');
    error.textContent = 'This menu preview could not be loaded.';
    root.replaceChildren(error);
    parent.postMessage({type:'auramenu:render-error'},parentOrigin);
  }
}
window.addEventListener('message',event => {
  if (parent === window || event.source !== parent || event.origin !== parentOrigin || event.data?.type !== 'auramenu:render') return;
  if (!event.data.menu || typeof event.data.menu !== 'object') return;
  if (event.data.menu.fixture !== latest?.fixture) { active?.dispose(); active = null; window.scrollTo(0,0); }
  latest = event.data.menu;
  currentLanguage = latest.menuLanguage;
  paint();
});
if (parent !== window) parent.postMessage({type:'auramenu:template-ready'},parentOrigin);
window.addEventListener('pagehide',event => { if (!event.persisted) active?.dispose(); });
