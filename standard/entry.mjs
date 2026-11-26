import { getTemplate,registry } from './registry.mjs';

const loaded = new Map();
const preloaded = new Set();
function stylesheet(href) {
  if (!loaded.has(href)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    const ready = new Promise((resolve,reject) => {
      link.addEventListener('load',resolve,{once:true});
      link.addEventListener('error',() => {
        loaded.delete(href);
        link.remove();
        reject(new Error('Menu styles could not be loaded.'));
      },{once:true});
    });
    loaded.set(href,ready);
    document.head.append(link);
  }
  return loaded.get(href);
}
function preload(url) {
  if (preloaded.has(url)) return;
  preloaded.add(url);
  const hint = document.createElement('link');
  hint.rel = 'modulepreload';
  hint.href = new URL(url,import.meta.url);
  document.head.append(hint);
}
export async function prepareStandard(id) {
  const entry = getTemplate(id) || registry[0];
  // Discover the active theme and the shared renderer in the same network round.
  for (const module of ['./copy.mjs','./data.mjs','./dom.mjs','./connect.mjs','./play.mjs']) preload(module);
  const [{default:template},{renderMenu}] = await Promise.all([
    entry.load(),import('./menu.mjs'),stylesheet(new URL('./base.css',import.meta.url).href),stylesheet(entry.stylesheet),
  ]);
  return {mount:(root,raw,options) => renderMenu(root,raw,template,options),template};
}
