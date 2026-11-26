import { prepareTemplate } from './entry.mjs';
import { appearanceMode } from './data.mjs';

const parentOrigin = location.origin;
const root = document.getElementById('preview');
const id = new URLSearchParams(location.search).get('template');
const prepared = prepareTemplate(id).catch(error => id === 'std-01' ? {error} :
  prepareTemplate('std-01').catch(fallbackError => ({error:fallbackError})));
let active, latest, currentLanguage, currentAppearance, sequence = 0;

async function paint() {
  const attempt = ++sequence;
  try {
    const { mount, template, error } = await prepared;
    if (error) throw error;
    if (attempt !== sequence) return;
    const state = active?.state;
    active?.dispose();
    active = mount(root,latest,{state,language:currentLanguage,appearance:currentAppearance,preview:latest.fixture != null,
      onAppearance:appearance => {
        currentAppearance = appearance;
        parent.postMessage({type:'auramenu:appearance',appearance},parentOrigin);
      },
      onLanguage:(language) => {
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
  if (parent === window || event.source !== parent || event.origin !== parentOrigin) return;
  if (event.data?.type === 'auramenu:appearance') {
    currentAppearance = appearanceMode(event.data.appearance);
    active?.setAppearance(currentAppearance);
    return;
  }
  if (event.data?.type !== 'auramenu:render' || !event.data.menu || typeof event.data.menu !== 'object') return;
  if (event.data.appearance != null) currentAppearance = appearanceMode(event.data.appearance);
  if (event.data.menu.fixture !== latest?.fixture) { active?.dispose(); active = null; window.scrollTo(0,0); }
  latest = event.data.menu;
  currentLanguage = latest.menuLanguage;
  paint();
});
if (parent !== window) parent.postMessage({type:'auramenu:template-ready'},parentOrigin);
window.addEventListener('pagehide',event => { if (!event.persisted) active?.dispose(); });
