import { registry,getTemplate } from './registry.mjs';
import { el } from './dom.mjs';
import { webUrl } from './data.mjs';

const names = {primary:'Primary',secondary:'Secondary',background:'Background',text:'Text',accent:'Accent'};
const fonts = {sans:'Sans serif',serif:'Serif',mono:'Monospace',editorial:'Editorial serif',condensed:'Condensed'};
const visibility = {images:'Show product photos',prices:'Show prices',information:'Show restaurant info',socials:'Show social links',play:'Enable AuraPlay',motion:'Enable animations',ornaments:'Show ornaments'};
const links = {directions:'Google Maps directions',review:'Google review link',instagram:'Instagram',facebook:'Facebook',tiktok:'TikTok',whatsapp:'WhatsApp link',website:'Website'};

export const standardTemplateIds = registry.filter(entry=>entry.tier === 'standard').map(entry=>entry.id);

export function offerTemplates(select,ids,existing) {
  const selected = select.value;
  for (const option of Array.from(select.options)) {
    if (getTemplate(option.value) && option.value !== existing && !ids.includes(option.value)) option.remove();
  }
  for (const entry of registry) {
    if ((ids.includes(entry.id) || entry.id === existing) && !Array.from(select.options).some(option => option.value === entry.id)) {
      select.add(new Option(entry.name,entry.id));
    }
  }
  if (Array.from(select.options).some(option=>option.value === selected)) select.value = selected;
}
export async function availableDesigns(apiBase) {
  try {
    const response = await fetch(apiBase + '/designs',{headers:{Accept:'application/json'},credentials:'omit'});
    if (!response.ok) return [];
    const {standard} = await response.json();
    return Array.isArray(standard) ? standard.filter(id => getTemplate(id)?.tier === 'standard') : [];
  } catch { return []; }
}
export function addDesignEditor(container,onChange) {
  const details = el('details','am-design-editor');
  const fields = el('div','am-design-fields');
  const tracked = [];
  let base = {};
  function field(group,key,label,type,choices) {
    const input = type === 'select' ? el('select') : el('input');
    if (type === 'select') {
      input.add(new Option('Template default',''));
      for (const [value,name] of Object.entries(choices)) input.add(new Option(name,value));
    } else {
      input.type = type;
      if (type === 'color') {
        const chosen = el('input');
        chosen.type = 'checkbox';
        chosen.setAttribute('aria-label','Override '+label.toLowerCase()+' color');
        tracked.push({group,key,input,chosen});
        return el('label','am-editor-color',label,el('span','',chosen,input));
      }
      if (type === 'number') { input.min = '0'; input.max = '32'; input.placeholder = 'Default'; }
    }
    tracked.push({group,key,input});
    return el('label','',label,input);
  }
  fields.append(...Object.entries(names).map(([key,label]) => field('design',key,label,'color')),
    field('design','heading','Heading font','select',fonts),field('design','body','Body font','select',fonts),
    field('design','radius','Card radius (px)','number'),field('restaurant','logo','Logo URL','url'),
    field('restaurant','cover','Cover image URL','url'),field('restaurant','announcement','Announcement','text'),
    ...Object.entries(links).map(([key,label]) => field('links',key,label,'url')),
    ...Object.entries(visibility).map(([key,label]) => field('design',key,label,'checkbox')));
  details.append(el('summary','','Brand and restaurant settings'),fields);
  details.hidden = true;
  container.replaceChildren(details);
  function sync(template, loaded) {
    details.hidden = !getTemplate(template);
    container.hidden = details.hidden;
    if (loaded === undefined) return;
    base = loaded || {};
    for (const row of tracked) {
      const {input,group,key,chosen} = row;
      const value = (group === 'links' ? base.restaurant?.links : base[group])?.[key];
      if (chosen) chosen.checked = typeof value === 'string' && /^#[a-f\d]{6}$/i.test(value);
      if (input.type === 'checkbox') input.checked = value !== false;
      else if (input.type === 'color') { input.value = chosen.checked ? value : '#244d39'; input.disabled = !chosen.checked; }
      else input.value = typeof value === 'string' || typeof value === 'number' ? value : value?.en || value?.tr || value?.ar || '';
      row.initial = input.type === 'checkbox' ? input.checked : input.value;
      input.setCustomValidity('');
    }
  }
  function values() {
    const restaurant = {...base.restaurant,links:{...base.restaurant?.links}};
    const design = {...base.design};
    const groups = {restaurant,design,links:restaurant.links};
    for (const {group,key,input,chosen,initial} of tracked) {
      const target = groups[group];
      if (input.type === 'checkbox') target[key] = input.checked;
      else if (input.type === 'color') {
        if (chosen.checked) target[key] = input.value;
        else delete target[key];
      } else if (!input.value.trim()) delete target[key];
      else if (input.type === 'url') {
        if (webUrl(input.value) && /^https?:\/\//i.test(input.value)) target[key] = input.value;
      } else if (input.type === 'number') target[key] = input.valueAsNumber;
      else if (input.value !== initial || typeof target[key] !== 'object') target[key] = input.value.trim();
    }
    return {restaurant,design};
  }
  function validate() {
    for (const {input} of tracked) {
      if (input.type !== 'url') continue;
      const valid = !input.value || (/^https?:\/\//i.test(input.value) && webUrl(input.value));
      input.setCustomValidity(valid ? '' : 'Use an HTTP or HTTPS link without credentials.');
    }
    return details.hidden || tracked.every(({input}) => {
      if (input.validity.valid) return true;
      details.open = true; input.reportValidity(); return false;
    });
  }
  for (const {input,chosen} of tracked) {
    chosen?.addEventListener('change',() => { input.disabled = !chosen.checked; onChange?.(); });
    input.addEventListener('input',() => { input.setCustomValidity(''); onChange?.(); });
  }
  sync('',{});
  return {sync,values,validate};
}
