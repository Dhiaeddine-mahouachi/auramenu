import { copy, languageNames } from './copy.mjs';
import { fonts, normalize, theme, contrast } from './data.mjs';
import { button, el, external, photo } from './dom.mjs';
import { connect, whatsapp } from './connect.mjs';
import { playInvitation } from './play.mjs';

export function renderMenu(root, raw, template, options = {}) {
  const state = {selected:0, query:'', tile:null, ...options.state};
  const lifecycle = new AbortController();
  const host = el('article','sm sm-' + template.key);
  const menu = normalize(raw,options.language);
  const t = copy(menu.lang);
  const tokens = theme(template.defaults,menu.design);
  const selectedPhotos = new Set();
  const sections = menu.sections;
  host.lang = menu.lang;
  host.dir = menu.dir;
  host.dataset.layout = template.key;
  for (const token of ['primary','secondary','background','text','accent']) host.style.setProperty('--sm-' + token,tokens[token]);
  host.style.setProperty('--sm-on-primary',contrast('#ffffff',tokens.primary)>=4.5 ? '#ffffff' : '#161616');
  host.style.setProperty('--sm-heading',fonts[tokens.heading]);
  host.style.setProperty('--sm-body',fonts[tokens.body]);
  host.style.setProperty('--sm-radius',tokens.radius + 'px');

  function dialog(title, render, kind = '') {
    const popup = el('dialog','sm-dialog ' + kind);
    const dialogSignal = new AbortController();
    const body = el('div','sm-dialog-body');
    const close = button(t.close,() => popup.close(),'sm-dialog-close');
    const heading = el('h2','',title);
    heading.id = 'sm-dialog-title';
    popup.setAttribute('aria-labelledby',heading.id);
    popup.append(el('header','sm-dialog-top',heading,close),body);
    const trigger = document.activeElement;
    const cleanup = () => { dialogSignal.abort(); popup.remove(); };
    lifecycle.signal.addEventListener('abort',cleanup,{once:true,signal:dialogSignal.signal});
    popup.addEventListener('close',() => { cleanup(); if (host.contains(trigger)) trigger.focus({preventScroll:true}); },{once:true});
    popup.addEventListener('click',event => {
      if (event.target !== popup) return;
      const rect = popup.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) popup.close();
    });
    host.append(popup);
    popup.showModal();
    try { render(body,dialogSignal.signal); } catch (error) { cleanup(); throw error; }
  }
  function price(item) {
    if (!tokens.prices || (!item.price && !item.discount)) return null;
    return el('span','sm-price',item.discount && item.price && el('del','',el('bdi','',item.price)),el('bdi','',item.discount || item.price));
  }
  function media(item, mode, forceLazy = false) {
    if ((!tokens.images && mode !== 'cover') || !item.image) return null;
    const eager = !forceLazy && selectedPhotos.size === 0 && ['feature','gallery','feed','float','cover','tile'].includes(mode);
    if (eager) selectedPhotos.add(item.image);
    return el('div','sm-media' + (item.transparent ? ' sm-transparent' : ''),
      photo(item.image,{small:item.imageSmall,eager,
        sizes:['row','ledger','rail','compact'].includes(mode) ? '80px' :
          ['gallery','portrait','tile'].includes(mode) ? '(min-width: 760px) 270px, 48vw' : '(min-width: 760px) 460px, 94vw'}));
  }
  function details(item,{showImage = false} = {}) {
    const lines = [
      showImage && media(item,'detail',true),
      item.description && el('p','sm-description',item.description),
      ...(item.facts || []).flatMap(([key,values]) => values.length ? [
        el('div','sm-fact',el('strong','',t[key]),el('p','',values.join(menu.lang === 'ar' ? '، ' : ', '))),
      ] : []),
      item.variants.length && el('div','sm-variants',el('strong','',t.variants),el('ul','',item.variants.map(option =>
        el('li','',option.name,tokens.prices && el('bdi','',option.price))))),
    ];
    const order = whatsapp(menu);
    if (order && item.available) lines.push(external(t.order,order));
    return el('div','sm-detail-content',lines);
  }
  function card(item, mode = 'row', action = 'dialog') {
    const article = el('article','sm-card sm-card-' + mode);
    if (!item.available) article.classList.add('sm-unavailable');
    const image = media(item,mode);
    if (!image) article.classList.add('sm-no-image');
    else article.append(image);
    const flag = !item.available ? t.unavailable : item.seasonal ? t.seasonal : item.bestseller ? t.bestseller : item.featured ? t.featured : '';
    const group = el('div','sm-card-body');
    const title = el('h3','',item.name);
    const summary = el('div','sm-product-title',title,price(item));
    const canExpand = item.description || item.variants.length || item.facts.some(([,facts]) => facts.length) || whatsapp(menu);
    if (action === 'inline' && canExpand) {
      const disclosure = el('details','sm-disclosure',
        el('summary','sm-summary',el('span','',item.name),el('span','sm-expand','+')),details(item));
      title.replaceWith(disclosure);
    } else {
      const open = button(item.name,() => dialog(item.name,body => body.append(price(item) || '',details(item,{showImage:true}))), 'sm-product-open');
      title.replaceChildren(open);
    }
    group.append(...[flag && el('span','sm-flag',flag),summary,
      action !== 'inline' && item.description && el('p','sm-description',item.description),
      action === 'inline' && mode === 'feed' && item.description && el('p','sm-description sm-feed-description',item.description)].filter(Boolean));
    article.append(group);
    return article;
  }
  function header(style = 'simple') {
    const logo = tokens.information && (menu.design.logo === '' ? null : menu.logo);
    const cover = menu.design.cover !== '' ? menu.cover : '';
    const visual = ['cover','arch','band','split'].includes(style) && cover ? media({image:cover,imageSmall:raw.restaurant?.coverSmall},'cover') : null;
    const name = menu.name || t.menu;
    const headings = el('div','sm-heading',logo && el('span','sm-logo',photo(logo,{width:64,height:64})),
      tokens.information && menu.tagline && el('p','sm-tagline',menu.tagline),el('h1','',name),
      tokens.information && menu.description && el('p','sm-intro',menu.description));
    return el('header','sm-hero sm-hero-' + style,visual,headings,
      tokens.information && menu.announcement && el('p','sm-announcement',menu.announcement));
  }
  function utility() {
    const select = el('select','sm-language',Object.entries(languageNames).map(([id,name]) => {
      const option = el('option','',name);
      option.value = id; option.selected = id === menu.lang; option.lang = id;
      return option;
    }));
    select.setAttribute('aria-label',t.language);
    select.addEventListener('change',() => options.onLanguage?.(select.value,state));
    return el('div','sm-utility',el('span','',t.menu),
      ...[tokens.information && whatsapp(menu) && external(t.order,whatsapp(menu)),options.onLanguage && select].filter(Boolean));
  }
  function section(section, type, index, action = 'dialog') {
    const heading = el('h2','',section.name);
    const body = el('section','sm-section sm-section-' + type,
      el('header','sm-section-heading',section.parent && el('p','sm-parent',section.parent),heading,
        section.description && el('p','',section.description)),
      el('div','sm-products sm-products-' + type,section.items.map((item,position) =>
        card(item,type === 'bento' ? ((position === 0 || item.featured) ? 'feature' : 'gallery') : type,action))),
      !section.items.length && el('p','sm-empty',t.empty));
    body.id = 'sm-section-' + section.id;
    heading.tabIndex = -1;
    return body;
  }
  function featured(style, predicate = item => item.featured || item.bestseller) {
    const matched = sections.flatMap(section => section.items).filter(predicate).slice(0,8);
    if (!matched.length) return null;
    const strip = el('div','sm-strip-track',matched.map(item => card(item,style)));
    strip.tabIndex = 0;
    const track = el('section','sm-featured sm-featured-' + style,el('h2','',style === 'portrait' ? t.seasonal : t.featured),strip);
    if (style === 'float' && matched.length > 1) {
      strip.setAttribute('aria-label',t.featured);
      const move = shift => {
        // Logical movement in both LTR and RTL scrollers.
        const step = strip.firstElementChild.getBoundingClientRect().width + 12;
        strip.scrollBy({left:step*shift*(menu.dir === 'rtl' ? -1 : 1)});
      };
      track.append(el('div','sm-carousel-controls',
        button(t.previous,() => move(-1),'sm-pill'),button(t.next,() => move(1),'sm-pill')));
    }
    return track;
  }
  function browse({nav = 'tabs',type = 'row',behavior = 'jump',action = 'dialog',search = false} = {}) {
    const content = el('div','sm-sections');
    const navNode = el('nav','sm-nav sm-nav-' + nav);
    navNode.setAttribute('aria-label',t.sections);
    const navButtons = sections.map((value,index) => button(value.name,() => {
      state.selected = index;
      select();
      if (behavior === 'jump') {
        const target = content.querySelector('#sm-section-' + value.id);
        target?.scrollIntoView({block:'start'});
        target?.querySelector('h2')?.focus({preventScroll:true});
      }
    },'sm-nav-button'));
    navNode.append(...navButtons);
    function select() {
      for (const [index,entry] of navButtons.entries()) {
        if (index === state.selected) entry.setAttribute('aria-current','true');
        else entry.removeAttribute('aria-current');
      }
      if (behavior !== 'jump') draw();
    }
    function draw() {
      const query = state.query.trim().toLocaleLowerCase(menu.lang);
      const visible = (query ? sections : behavior === 'jump' ? sections : sections.slice(state.selected,state.selected+1))
        .map(value => query ? {...value, items:value.items.filter(item => (item.name + ' ' + item.description).toLocaleLowerCase(menu.lang).includes(query))} : value)
        .filter(value => !query || value.items.length);
      content.replaceChildren(...visible.map((value,index) => section(value,type,index,action)));
      if (!visible.length) content.append(el('p','sm-empty',query ? t.noResults : t.empty));
    }
    const controls = el('div','sm-browse-controls');
    if (search) {
      const input = el('input','sm-search');
      input.type = 'search'; input.placeholder = t.search; input.value = state.query;
      input.setAttribute('aria-label',t.search);
      input.addEventListener('input',() => { state.query = input.value; draw(); });
      controls.append(input);
    }
    if (sections.length > 1) controls.append(navNode);
    draw();
    for (const [index,entry] of navButtons.entries()) if (index === state.selected) entry.setAttribute('aria-current','true');
    return el('div','sm-browse sm-browse-' + nav,controls,content);
  }
  function tiles() {
    const page = el('div','sm-tile-page');
    function paint(focus = false) {
      const active = sections.find(section => section.id === state.tile);
      if (active) {
        const back = button(t.back,() => { state.tile = null; paint(true); },'sm-pill sm-tile-back');
        page.replaceChildren(back,section(active,'gallery',0));
        if (focus) {
          page.scrollIntoView({block:'start'});
          page.querySelector('h2').focus({preventScroll:true});
        }
        return;
      }
      const buttons = sections.map(value => {
        const item = value.items.find(item => item.image);
        const image = media(value.image ? {image:value.image} : item || {},'tile');
        const tile = button('',() => { state.tile = value.id; paint(true); },'sm-tile');
        if (image) tile.append(image);
        tile.append(el('strong','',value.name));
        if (value.description) tile.append(el('span','',value.description));
        return tile;
      });
      page.replaceChildren(el('h2','',t.sections),el('div','sm-tiles',buttons),
        ...[featured('gallery')].filter(Boolean));
      if (focus) {
        page.scrollIntoView({block:'start'});
        buttons[0]?.focus({preventScroll:true});
      }
    }
    paint();
    return page;
  }
  const logoOverride = typeof menu.design.logo === 'string' && normalize({restaurant:{logo:menu.design.logo}}).logo;
  const coverOverride = typeof menu.design.cover === 'string' && normalize({restaurant:{cover:menu.design.cover}}).cover;
  if (logoOverride) menu.logo = logoOverride;
  if (coverOverride) { menu.cover = coverOverride; raw = {...raw,restaurant:{...raw.restaurant,coverSmall:''}}; }
  const content = template.layout({header,browse,featured,tiles,menu,t});
  host.append(utility(),el('div','sm-menu-content',content),...[connect(menu,tokens,t),
    tokens.play && playInvitation(t,(title,render) => dialog('AuraPlay',render,'sm-game'),lifecycle.signal)
  ].filter(Boolean));
  root.replaceChildren(host);
  return {dispose:() => { lifecycle.abort(); host.remove(); },tokens,state};
}
