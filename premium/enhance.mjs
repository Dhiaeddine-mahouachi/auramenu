import { button, el, photo } from '../standard/dom.mjs';
import { premiumCopy } from './copy.mjs';

export function exploded(item,menu) {
  if (!item.layers.length) return null;
  const t=premiumCopy(menu.lang);
  const panel=el('div','pa-layers-panel');
  panel.hidden=true;
  const toggle=button(t.showLayers,()=>{
    panel.hidden=!panel.hidden;
    toggle.textContent=panel.hidden?t.showLayers:t.hideLayers;
    toggle.setAttribute('aria-expanded',String(!panel.hidden));
    if (!panel.hidden && !panel.firstChild) {
      panel.append(el('ol','pa-layers-diagram',item.layers.map(({label,image})=>
        el('li','',photo(image),el('span','',label)))));
    }
  },'sm-action');
  toggle.setAttribute('aria-expanded','false');
  return el('section','pa-enhancement',toggle,panel);
}

export function reality(item,menu,signal) {
  if (item.modelId !== 'demo-smash') return null;
  const t=premiumCopy(menu.lang);
  const stage=el('div','pa-model-stage');
  const status=el('p','');
  status.setAttribute('role','status');
  const launch=button(t.viewModel,async ()=>{
    launch.disabled=true;
    status.textContent='';
    try {
      const {mountModel}=await import('./viewer.mjs');
      if (signal.aborted) return;
      await mountModel(stage,t,signal);
      if (signal.aborted) return;
      launch.remove();
      stage.querySelector('button')?.focus();
    } catch {
      if (signal.aborted) return;
      stage.replaceChildren();
      status.textContent=t.modelFailed;
      launch.disabled=false;
    }
  },'sm-action');
  return el('section','pa-enhancement',launch,status,stage);
}
