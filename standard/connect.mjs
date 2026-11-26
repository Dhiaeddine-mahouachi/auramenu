import { el, external, photo } from './dom.mjs';

const paths = {
  directions:'M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  review:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z',
  phone:'M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2Z',
  web:'M7 17 17 7M7 7h10v10',
};
function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('aria-hidden','true');
  const path = document.createElementNS(svg.namespaceURI,'path');
  path.setAttribute('d',paths[name] || paths.web);
  path.setAttribute('fill','none');
  path.setAttribute('stroke','currentColor');
  path.setAttribute('stroke-width','1.6');
  svg.append(path);
  return svg;
}
export function whatsapp(menu) {
  const digits = menu.whatsapp.replace(/[^0-9]/g,'');
  return menu.links.whatsapp || (digits.length >= 8 && digits.length <= 15 ? 'https://wa.me/' + digits : '');
}
export function connect(menu, tokens, t) {
  if (!tokens.information) return null;
  const numbers = menu.phone.replace(/[^0-9+]/g,'');
  const telephone = /^\+?\d{7,15}$/.test(numbers) ? 'tel:' + numbers : '';
  const directions = menu.links.directions || (menu.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(menu.address) : '');
  const details = [
    ['directions',t.directions,directions],['phone',menu.phone,telephone],['review',t.review,menu.links.review],
    ['website',t.website,menu.links.website],['whatsapp','WhatsApp',whatsapp(menu)],
  ];
  if (tokens.socials) details.push(['instagram','Instagram',menu.links.instagram],['facebook','Facebook',menu.links.facebook],['tiktok','TikTok',menu.links.tiktok]);
  if (!menu.address && !menu.hours && !details.some(([, , href]) => href)) return null;
  return el('footer','sm-connect',el('h2','',t.info),el('div','sm-connect-brand',
    menu.logo && el('span','sm-logo',photo(menu.logo,{width:64,height:64})),el('strong','',menu.name)),
    menu.address && el('p','',menu.address),menu.hours && el('p','',menu.hours),
    el('div','sm-links',details.flatMap(([key,label,href]) => href ? [external(label,href,icon(key))] : [])));
}
