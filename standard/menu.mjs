import { copy, languageNames } from './copy.mjs';
import { fonts, normalize, theme, contrast, premiumSurfaces } from './data.mjs';
import { button, el, external, photo } from './dom.mjs';
import { connect, whatsapp } from './connect.mjs';
import { playInvitation } from './play.mjs';

export function renderMenu(root, raw, template, options = {}) {
  const state = {selected:0, query:'', tile:null, ...options.state};
  const lifecycle = new AbortController();
  const host = el('article','sm sm-' + template.key);
  const menu = normalize(raw,options.language,options.preview);
  const t = copy(menu.lang);
  const tokens = theme(template.defaults,menu.design);
  const premium = template.tier === 'premium';
  host.classList.toggle('pa',premium);
  if (premium) for (const [key,value] of Object.entries(premiumSurfaces(tokens))) {
    host.style.setProperty('--sm-' + key,value);
  }
  host.dataset.motion = tokens.motion && !menu.design.slow ? 'on' : 'off';
  host.dataset.ornaments = tokens.ornaments ? 'on' : 'off';
  const selectedPhotos = new Set();
  const sections = menu.sections;
  host.lang = menu.lang;
  host.dir = menu.dir;
  host.dataset.layout = template.key;
  for (const token of ['primary','secondary','background','text','accent']) host.style.setProperty('--sm-' + token,tokens[token]);
  host.style.setProperty('--sm-on-primary',contrast('#ffffff',tokens.primary)>=4.5 ? '#ffffff' : '#000000');
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
    if (template.cutout && item.cutout) item = {...item,image:item.cutout,imageSmall:'',transparent:true};
    if ((!tokens.images && mode !== 'cover') || !item.image) return null;
    const eager = !forceLazy && selectedPhotos.size === 0 && (premium || ['feature','gallery','feed','float','cover','tile'].includes(mode));
    if (eager) selectedPhotos.add(item.image);
    return el('div','sm-media' + (item.transparent ? ' sm-transparent' : '') + (template.cutout && item.demoCutout ? ' pa-demo-cutout' : ''),
      photo(item.image,{small:item.imageSmall,eager,
        sizes:['row','ledger','rail','compact'].includes(mode) ? '80px' :
          ['gallery','portrait','tile'].includes(mode) ? '(min-width: 760px) 270px, 48vw' : '(min-width: 760px) 460px, 94vw'}));
  }
  function details(item,{showImage = false,signal} = {}) {
    const lines = [
      showImage && media(item,'detail',true),
      item.description && el('p','sm-description',item.description),
      ...(item.facts || []).flatMap(([key,values]) => values.length ? [
        el('div','sm-fact',el('strong','',t[key]),el('p','',values.join(menu.lang === 'ar' ? '، ' : ', '))),
      ] : []),
      item.variants.length && el('div','sm-variants',el('strong','',t.variants),el('ul','',item.variants.map(option =>
        el('li','',option.name,tokens.prices && el('bdi','',option.price))))),
    ];
    if (showImage && template.enhance && !menu.design.slow && tokens.images) {
      const feature = template.enhance(item,menu,signal);
      if (feature) lines.push(feature);
    }
    const order = whatsapp(menu);
    if (order && item.available) lines.push(external(t.order,order));
    return el('div','sm-detail-content',lines);
  }
  function card(item, mode = 'row', action = 'dialog') {
    const article = el('article','sm-card sm-card-' + mode);
    if (!item.available) article.classList.add('sm-unavailable');
    const image = media(item,mode);
    if (premium && image) image.querySelector('img').alt = item.name;
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
      const open = button(item.name,() => dialog(item.name,(body,signal) => body.append(price(item) || '',details(item,{showImage:true,signal})),premium ? 'pa-product' : ''), 'sm-product-open');
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
    const cover = menu.design.cover !== '' && (!premium || tokens.images) ? menu.cover : '';
    const visual = (premium ? template.cover !== false : ['cover','arch','band','split'].includes(style)) && cover ? media({image:cover,imageSmall:raw.restaurant?.coverSmall},'cover') : null;
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
  function section(section, type, action = 'dialog') {
    const heading = el('h2','',section.name);
    const body = el('section','sm-section sm-section-' + type,
      el('header','sm-section-heading',section.parent && el('p','sm-parent',section.parent),heading,
        section.description && el('p','',section.description)),
      el('div','sm-products sm-products-' + type,section.items.map((item,position) =>
        card(item,type === 'bento' ? ((position === 0 || item.featured) ? 'feature' : 'gallery') :
          type === 'spread' && position !== 0 && !item.featured ? 'ledger' : type,action))),
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
  function browse({nav = 'tabs',type = 'row',action = 'dialog',search = premium,numbered = false,chapters} = {}) {
    const content = el('div','sm-sections');
    content.id = 'sm-category-products';
    const navNode = el('nav','sm-nav sm-nav-' + nav);
    navNode.setAttribute('aria-label',t.sections);
    const selectCategory = index => {
      if (!sections[index]) return;
      state.selected = index;
      state.query = '';
      if (input) input.value = '';
      markSelected();
      draw();
    };
    const navButtons = sections.map((value,index) => {
      const entry = button(value.name,() => selectCategory(index),'sm-nav-button');
      entry.setAttribute('aria-controls',content.id);
      if (numbered) {
        const ordinal = el('span','pa-ordinal',new Intl.NumberFormat(menu.lang,{minimumIntegerDigits:2}).format(index+1));
        ordinal.setAttribute('aria-hidden','true');
        entry.prepend(ordinal);
      }
      return entry;
    });
    navNode.append(...navButtons);
    const chapterControls = chapters && sections.length>1 ? el('div','pa-chapters',
      button(chapters.previousChapter,() => selectCategory(Math.max(0,state.selected-1)),'sm-pill'),
      button(chapters.nextChapter,() => selectCategory(Math.min(sections.length-1,state.selected+1)),'sm-pill')) : null;
    function markSelected() {
      for (const [index,entry] of navButtons.entries()) {
        if (index === state.selected) entry.setAttribute('aria-current','true');
        else entry.removeAttribute('aria-current');
      }
    }
    function draw() {
      const query = state.query.trim().toLocaleLowerCase(menu.lang);
      const visible = (query ? sections : sections.slice(state.selected,state.selected+1))
        .map(value => query ? {...value, items:value.items.filter(item => (item.name + ' ' + item.description).toLocaleLowerCase(menu.lang).includes(query))} : value)
        .filter(value => !query || value.items.length);
      content.replaceChildren(...visible.map(value => section(value,type,action)));
      if (!visible.length) content.append(el('p','sm-empty',query ? t.noResults : t.empty));
    }
    const controls = el('div','sm-browse-controls');
    const input = search ? el('input','sm-search') : null;
    if (input) {
      input.type = 'search'; input.placeholder = t.search; input.value = state.query;
      input.setAttribute('aria-label',t.search);
      input.addEventListener('input',() => { state.query = input.value; draw(); });
      controls.append(input);
    }
    if (sections.length > 1) controls.append(navNode);
    if (chapterControls) controls.append(chapterControls);
    draw();
    markSelected();
    return el('div','sm-browse sm-browse-' + nav,controls,content);
  }
  function tiles() {
    const page = el('div','sm-tile-page');
    function paint(focusId) {
      const active = sections.find(section => section.id === state.tile);
      if (active) {
        const back = button(t.back,() => { state.tile = null; paint(active.id); },'sm-pill sm-tile-back');
        page.replaceChildren(back,section(active,'gallery'));
        if (focusId) page.querySelector('h2').focus({preventScroll:true});
        return;
      }
      const buttons = sections.map(value => {
        const item = value.items.find(item => item.image);
        const image = media(value.image ? {image:value.image} : item || {},'tile');
        const tile = button('',() => { state.tile = value.id; paint(value.id); },'sm-tile');
        if (image) tile.append(image);
        tile.append(el('strong','',value.name));
        if (value.description) tile.append(el('span','',value.description));
        return tile;
      });
      page.replaceChildren(el('h2','',t.sections),el('div','sm-tiles',buttons),
        ...[featured('gallery')].filter(Boolean));
      if (focusId) {
        const index = sections.findIndex(section => section.id === focusId);
        buttons[index]?.focus({preventScroll:true});
      }
    }
    paint();
    return page;
  }
  const logoOverride = typeof menu.design.logo === 'string' && normalize({restaurant:{logo:menu.design.logo}}).logo;
  const coverOverride = typeof menu.design.cover === 'string' && normalize({restaurant:{cover:menu.design.cover}}).cover;
  if (logoOverride) menu.logo = logoOverride;
  if (coverOverride) { menu.cover = coverOverride; raw = {...raw,restaurant:{...raw.restaurant,coverSmall:''}}; }
  const content = template.layout({header,browse,featured,tiles,card,menu,t});
  host.append(utility(),el('div','sm-menu-content',content),...[connect(menu,tokens,t),
    tokens.play && playInvitation(t,(title,render) => dialog('AuraPlay',render,'sm-game'),lifecycle.signal)
  ].filter(Boolean));
  root.replaceChildren(host);
  return {dispose:() => { lifecycle.abort(); host.remove(); },tokens,state};
}
