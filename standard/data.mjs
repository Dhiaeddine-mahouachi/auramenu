const locales = {en:'en-GB',tr:'tr-TR',ar:'ar'};
const list = value => Array.isArray(value) ? value : [];
const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const text = (value, limit = 600) => typeof value === 'string' ? value.trim().slice(0,limit) : '';
export const language = value => Object.hasOwn(locales, value) ? value : 'en';
export function localized(value, lang) {
  if (typeof value === 'string') return text(value);
  const translations = record(value);
  return text(translations[lang] || translations.en || translations.tr || translations.ar);
}
export function webUrl(value, origin = globalThis.location?.origin) {
  const input = text(value, 2048);
  if (!input) return '';
  try {
    const url = input.startsWith('/') && !input.startsWith('//') ? new URL(input, origin) : new URL(input);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
export function imageUrl(value) {
  if (typeof value === 'string' && value.length < 390000 && /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/]+={0,2}$/i.test(value)) return value;
  return webUrl(value);
}
const currencyCode = value => typeof value === 'string' && /^[A-Z]{3}$/.test(value) ? value : '';
export function money(value, currency, lang) {
  if (value == null || (typeof value !== 'number' && typeof value !== 'string')) return '';
  const raw = String(value).trim().slice(0,45);
  const normalized = raw.replace(/[٠-٩۰-۹]/g, char => String(char.charCodeAt(0) - (char <= '٩' ? 0x660 : 0x6f0)))
    .replace('٫','.').replace(',','.');
  if (!/^\d+(?:\.\d{1,3})?$/.test(normalized) || !currencyCode(currency)) return raw;
  const minimumFractionDigits = Number.isInteger(Number(normalized)) ? 0 : undefined;
  return new Intl.NumberFormat(locales[language(lang)],{style:'currency',currency,minimumFractionDigits}).format(Number(normalized));
}
export function normalize(input, requestedLanguage) {
  const raw = record(input);
  const lang = language(requestedLanguage || raw.menuLanguage);
  const restaurant = record(raw.restaurant);
  const translate = (value, translations) => localized(translations,lang) || localized(value,lang);
  const currency = currencyCode(raw.currency) || 'TRY';
  const sections = [];
  function addSections(categories, parent = '', depth = 0) {
    for (const category of list(categories).slice(0,40)) {
      if (sections.length >= 80) break;
      const name = translate(category?.name,category?.translations?.name);
      if (!name) continue;
      const index = sections.length;
      const description = translate(category.description,category.translations?.description);
      const items = list(category.items).slice(0,400).flatMap((item, position) => {
        const name = translate(item?.name,item?.translations?.name);
        if (!name) return [];
        const itemCurrency = currencyCode(item.currency) || currency;
        return [{
          id: index + '-' + position,name,description: translate(item.description,item.translations?.description),
          price:money(item.price,itemCurrency,lang),discount:money(item.discountPrice,itemCurrency,lang),
          image:imageUrl(item.imageUrl || item.imageData),imageSmall:imageUrl(item.imageSmall),transparent:item.transparent === true,
          featured:item.featured === true, bestseller:item.bestseller === true, seasonal:item.seasonal === true,
          available:item.available !== false,
          facts: ['ingredients','allergens','dietary'].map(key => [key,list(item[key]).slice(0,20).map(value => localized(value,lang)).filter(Boolean)]),
          variants:list(item.variants).slice(0,20).flatMap(option => {
            const name = localized(option?.name,lang);
            return name ? [{name,price:money(option.price,currencyCode(option.currency) || itemCurrency,lang)}] : [];
          }),
        }];
      });
      const children = list(category.subcategories);
      if (items.length || !children.length) sections.push({id:String(index),name,parent,description,items,image:imageUrl(category.imageUrl)});
      if (depth < 2) addSections(children,name,depth + 1);
    }
  }
  addSections(raw.categories);
  return {
    lang, dir:lang === 'ar' ? 'rtl' : 'ltr', currency, sections,
    name:translate(raw.businessName,restaurant.name),description:translate(raw.description,restaurant.description),
    tagline:translate(raw.tagline,restaurant.tagline),announcement:localized(restaurant.announcement,lang),
    hours:localized(restaurant.openingHours || raw.openingHours,lang),
    address:localized(restaurant.address || raw.address,lang),phone:text(raw.businessPhone,40),
    whatsapp:text(raw.whatsapp,40),logo:imageUrl(restaurant.logo),cover:imageUrl(restaurant.cover),
    links:Object.fromEntries(['directions','instagram','facebook','tiktok','whatsapp','website','review'].map(key => [key,webUrl(restaurant.links?.[key])])),
    design:record(raw.design),
  };
}
const luminance = hex => {
  const rgb = hex.slice(1).match(/../g).map(pair => parseInt(pair,16) / 255);
  return rgb.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum,value,index) => sum + value * [.2126,.7152,.0722][index],0);
};
export function contrast(first, second) {
  const light = [luminance(first),luminance(second)].sort((a,b) => b-a);
  return (light[0]+.05)/(light[1]+.05);
}
const color = (value, fallback) => typeof value === 'string' && /^#[a-f\d]{6}$/i.test(value) ? value : fallback;
export const fonts = Object.freeze({
  sans:'system-ui, sans-serif', serif:'Georgia, serif', mono:'ui-monospace, monospace',
  editorial:'"Palatino Linotype", Georgia, serif', condensed:'"Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
});
export function theme(defaults, override = {}) {
  const tokens = {...defaults};
  for (const key of ['primary','secondary','background','text','accent']) tokens[key] = color(override[key],defaults[key]);
  const adjusted = contrast(tokens.text,tokens.background) < 4.5;
  if (adjusted) tokens.text = contrast('#171717',tokens.background) >= 4.5 ? '#171717' : '#ffffff';
  for (const key of ['heading','body']) if (Object.hasOwn(fonts, override[key])) tokens[key] = override[key];
  if (Number.isInteger(override.radius)) tokens.radius = Math.max(0,Math.min(32,override.radius));
  for (const key of ['images','prices','information','socials','play']) tokens[key] = override[key] !== false;
  return {...tokens, adjusted};
}
