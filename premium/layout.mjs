import { button, el } from '../standard/dom.mjs';
import { premiumCopy } from './copy.mjs';

export function opening(api, style, decoration) {
  const {header,menu}=api;
  const node=header(style);
  if (decoration) {
    const mark=el('div','pa-decoration pa-' + decoration);
    mark.setAttribute('aria-hidden','true');
    node.prepend(mark);
  }
  const enter=button(premiumCopy(menu.lang).explore,() => {
    const target=node.parentElement.querySelector('.sm-search');
    target?.scrollIntoView({block:'center'});
    target?.focus({preventScroll:true});
  },'sm-action pa-enter');
  node.querySelector('.sm-heading').append(enter);
  return node;
}

export function spotlight(api, mode) {
  const items=api.menu.sections.flatMap(section=>section.items).filter(item=>item.available);
  const selected=items.find(item=>item.featured)||items.find(item=>item.bestseller)||items[0];
  return selected ? el('section','pa-spotlight pa-spotlight-' + mode,
    el('h2','',api.t.featured),api.card(selected,mode)) : null;
}

export function orbit(api) {
  const items=api.menu.sections.flatMap(section=>section.items)
    .filter(item=>item.available).sort((a,b)=>Number(b.featured)-Number(a.featured)).slice(0,5);
  if (!items.length) return null;
  const stage=el('div','pa-orbit-stage');
  const markers=items.map((item,index)=> {
    const marker=button(String(index+1),()=>paint(index),'pa-orbit-marker');
    marker.setAttribute('aria-label',item.name);
    return marker;
  });
  const labels=el('div','pa-orbit-markers',markers);
  let selected=0;
  function paint(index) {
    selected=index;
    stage.replaceChildren(api.card(items[index],'orbit'));
    markers.forEach((marker,i)=>marker.setAttribute('aria-pressed',String(i===index)));
  }
  paint(0);
  const step=delta=>paint((selected+delta+items.length)%items.length);
  const actions=items.length>1 && el('div','pa-orbit-markers',
    button(api.t.previous,()=>step(-1),'sm-pill'),button(api.t.next,()=>step(1),'sm-pill'));
  return el('section','pa-orbit',el('h2','',api.t.featured),stage,labels,actions);
}

export function galleryBrowse(api) {
  const t=premiumCopy(api.menu.lang);
  const menu=api.browse({nav:'wall',type:'exhibit',numbered:true});
  const switchView=button(t.list,()=>{
    const compact=menu.classList.toggle('pa-exhibit-list');
    switchView.textContent=compact?t.gallery:t.list;
    switchView.setAttribute('aria-pressed',String(compact));
  },'sm-pill');
  switchView.setAttribute('aria-pressed','false');
  menu.querySelector('.sm-browse-controls').append(switchView);
  return menu;
}

export function studioNavigation(api) {
  const t=premiumCopy(api.menu.lang);
  const destinations=[[t.home,'.sm-hero'],[api.t.menu,'.sm-browse'],[api.t.info,'.sm-connect']];
  const nav=el('nav','pa-studio-nav');
  nav.setAttribute('aria-label',api.t.menu);
  nav.append(...destinations.map(([label,selector])=>button(label,event=>{
    const target=event.currentTarget.closest('.sm').querySelector(selector);
    target?.scrollIntoView({block:'start'});
    const focus=target?.querySelector('h1,h2,input');
    if (focus) {
      if (focus.tagName !== 'INPUT') focus.tabIndex=-1;
      focus.focus({preventScroll:true});
    }
  },'sm-pill')));
  return nav;
}
