export function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children.flat().filter(child => child != null && child !== false && child !== 0));
  return node;
}
export function button(label, action, className = '') {
  const node = el('button',className,label);
  node.type = 'button';
  node.addEventListener('click',action);
  return node;
}
export function external(label, href, icon) {
  const link = el('a','sm-link',icon,label);
  link.href = href;
  if (!href.startsWith('tel:')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}
export function photo(url, {small, eager = false, sizes = '(min-width: 800px) 440px, 90vw', className = '', width = 640, height = 480} = {}) {
  if (!url) return null;
  const image = el('img',className);
  image.alt = '';
  image.width = width;
  image.height = height;
  image.decoding = 'async';
  image.referrerPolicy = 'no-referrer';
  image.loading = eager ? 'eager' : 'lazy';
  if (eager) image.fetchPriority = 'high';
  if (small && !/[\s,]/.test(url + small)) {
    image.srcset = small + ' 320w, ' + url + ' 640w';
    image.sizes = sizes;
  }
  image.addEventListener('error',() => image.parentElement?.classList.add('sm-photo-error'),{once:true});
  image.src = url;
  return image;
}
