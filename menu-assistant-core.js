/* Credential-free assistant fallback. Only explicit facts and allowlisted data edits.
 * This module has no network, storage, billing or publication capability.
 */
(function (root) {
  'use strict';
  const limits = Object.freeze({ businessName: 100, tagline: 140, description: 600, address: 220, businessPhone: 40, openingHours: 100 });
  const currencies = ['TRY', 'EUR', 'USD', 'TND'];
  const languages = ['en', 'tr', 'ar'];
  const clean = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().replace(/\s+/g, ' ') : '';
  const key = value => clean(value).normalize('NFKC').toLowerCase();
  const copy = value => JSON.parse(JSON.stringify(value));
  function bounded(value, max, label) {
    if (typeof value !== 'string' || !clean(value) || value.length > max) throw new Error(label + ' must be 1–' + max + ' characters.');
    return clean(value);
  }
  function price(value) {
    const normalized = root.AuraMenuVoiceCore.normalizeDigits(clean(value));
    const match = /^(?:[₺€$]\s*)?(\d{1,7}(?:[.,]\d{1,3})?)(?:\s*(?:₺|€|\$|TL|TRY|EUR|USD|TND|lira|liras|ليرة|ليرات))?$/iu.exec(normalized);
    if (!match) throw new Error('Provide an explicit numeric price. Prices are never guessed.');
    return normalized;
  }
  function priceCurrency(value) {
    const text = clean(value);
    if (/^€|€$|\bEUR$/iu.test(text)) return 'EUR';
    if (/^\$|\$$|\bUSD$/iu.test(text)) return 'USD';
    if (/^₺|₺$|\b(?:TRY|TL|lira|liras)$|(?:ليرة|ليرات)$/iu.test(text)) return 'TRY';
    if (/\bTND$/iu.test(text)) return 'TND';
    return '';
  }
  function validate(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid menu draft.');
    const fields = {};
    for (const [name, max] of Object.entries(limits)) {
      if (input.fields?.[name] !== undefined) fields[name] = input.fields[name] === '' ? '' : bounded(input.fields[name], max, name);
    }
    if (input.fields?.currency !== undefined) {
      if (!currencies.includes(input.fields.currency)) throw new Error('Unsupported currency.');
      fields.currency = input.fields.currency;
    }
    if (input.fields?.menuLanguage !== undefined) {
      if (!languages.includes(input.fields.menuLanguage)) throw new Error('Unsupported menu language.');
      fields.menuLanguage = input.fields.menuLanguage;
    }
    if (!Array.isArray(input.categories) || input.categories.length > 12) throw new Error('Maximum 12 categories.');
    let count = 0;
    const categories = input.categories.map(category => {
      if (!category || !Array.isArray(category.items) || category.items.length > 20) throw new Error('Maximum 20 products per category.');
      const result = { ...category, name: bounded(category.name, 80, 'Category'), items: category.items.map(item => {
        if (!item || typeof item !== 'object') throw new Error('Invalid product.');
        count += 1;
        if (typeof (item.description ?? '') !== 'string' || (item.description || '').length > 300) throw new Error('Description exceeds 300 characters.');
        const amount = price(item.price);
        if (priceCurrency(amount) && fields.currency && priceCurrency(amount) !== fields.currency) throw new Error('Product currency differs from the menu currency. Review currencies in the normal editor.');
        return { ...item, name: bounded(item.name, 100, 'Product'), price: amount, description: clean(item.description || '') };
      }) };
      return result;
    });
    if (count > 100) throw new Error('Maximum 100 products per menu.');
    return { fields, categories };
  }
  function csvRows(source) {
    const rows = []; let row = [], field = '', quoted = false, ended = false;
    for (let i = 0; i < source.length; i += 1) {
      const c = source[i];
      if (quoted) {
        if (c === '"') { if (source[i + 1] === '"') { field += '"'; i += 1; } else { quoted = false; ended = true; } }
        else field += c;
      } else if (c === '"') {
        if (field || ended) throw new Error('Malformed CSV quotes.');
        quoted = true;
      } else if (c === ',' || c === '\n' || c === '\r') {
        row.push(field); field = ''; ended = false;
        if (c !== ',') { if (row.some(v => v.trim())) rows.push(row); row = []; if (c === '\r' && source[i + 1] === '\n') i += 1; }
      } else { if (ended && c.trim()) throw new Error('Unexpected text after CSV quote.'); if (!ended) field += c; }
    }
    if (quoted) throw new Error('Unclosed CSV quote.');
    row.push(field); if (row.some(v => v.trim())) rows.push(row);
    return rows;
  }
  function csv(source) {
    const rows = csvRows(source);
    const header = (rows.shift() || []).map(value => key(value.replace(/^\uFEFF/, '')));
    if (header.join(',') !== 'category,name,price,description') throw new Error('CSV header must be: category,name,price,description');
    const categories = [];
    for (const row of rows) {
      if (row.length !== 4) throw new Error('Each CSV row needs category, name, price and description (which may be empty).');
      const [categoryName, name, amount, description] = row;
      let category = categories.find(c => key(c.name) === key(categoryName));
      if (!category) { category = { name: categoryName, emoji: '🍽️', items: [] }; categories.push(category); }
      category.items.push({ name, price: amount, description, imageUrl: '', imageData: '', featured: false });
    }
    return validate({ fields: {}, categories });
  }
  function extract(source) {
    if (/^(?:\uFEFF)?category,/i.test(source.trimStart())) return { ...csv(source), unresolved: [] };
    if (source.trimStart().startsWith('[')) {
      return { fields: {}, categories: root.AuraMenuQuickImport.parse(source).categories, unresolved: [] };
    }
    const fields = {}, categories = [], unresolved = [];
    let current; const explicitCurrencies = new Set();
    const lines = source.split(/\r?\n|[;；]|(?<=[^\d])[.!?]\s+|(?<=\d)\.(?=\s+[A-Z])/u).map(clean).filter(Boolean);
    for (let line of lines) {
      line = line.replace(/[.!?]$/, '').trim();
      let match = /^(?:restaurant(?: name)?|business name|my restaurant is called|my restaurant is|restoran(?: adı|ımın adı)?|اسم المطعم|اسم مطعمي)\s*(?::|is\s+)?\s*(.+)$/iu.exec(line);
      if (match) { fields.businessName = bounded(match[1], 100, 'Restaurant name'); continue; }
      match = /^(description|tagline|address|phone|opening hours)\s*:\s*(.+)$/iu.exec(line);
      if (match) { const name = ({ phone: 'businessPhone', 'opening hours': 'openingHours' })[key(match[1])] || key(match[1]); fields[name] = bounded(match[2], limits[name], name); continue; }
      match = /^(?:currency|para birimi|العملة)\s*:\s*(TRY|TL|EUR|USD|TND)$/iu.exec(line);
      if (match) { fields.currency = match[1].toUpperCase().replace(/^TL$/, 'TRY'); continue; }
      match = /^(?:language|menu language|dil|اللغة)\s*:\s*(en|english|tr|turkish|ar|arabic)$/iu.exec(line);
      if (match) { fields.menuLanguage = ({ english: 'en', turkish: 'tr', arabic: 'ar' })[key(match[1])] || key(match[1]); continue; }
      match = /^(?:category|kategori|قسم)\s*:\s*(.+)$/iu.exec(line);
      if (match) {
        const name = bounded(match[1], 80, 'Category');
        current = categories.find(c => key(c.name) === key(name));
        if (!current) { current = { name, emoji: '🍽️', items: [] }; categories.push(current); }
        continue;
      }
      try {
        const item = root.AuraMenuVoiceCore.parse('product', line.replace(/^(?:a|an)\s+/i, ''));
        const explicit = priceCurrency(line); if (explicit) explicitCurrencies.add(explicit);
        if (!current) {
          current = { name: 'Menu', emoji: '🍽️', items: [] }; categories.push(current);
        }
        current.items.push({ name: item.name, price: item.price, description: item.description, imageUrl: '', imageData: '', featured: false });
      } catch { unresolved.push(line); }
    }
    if (explicitCurrencies.size > 1 || (fields.currency && explicitCurrencies.size && !explicitCurrencies.has(fields.currency))) throw new Error('Mixed currencies need correction before import.');
    if (!fields.currency && explicitCurrencies.size) fields.currency = [...explicitCurrencies][0];
    return { ...validate({ fields, categories }), unresolved };
  }
  function edit(source, state) {
    const next = copy(state), changes = [];
    const lines = source.split(/\r?\n/).map(clean).filter(Boolean);
    for (const line of lines) {
      let match = /^set (?:restaurant|business) name to (.+)$/iu.exec(line);
      if (match) { next.fields.businessName = bounded(match[1], 100, 'Restaurant name'); changes.push('Restaurant name → ' + next.fields.businessName); continue; }
      match = /^set price of "([^"]+)" to (.+)$/iu.exec(line);
      const remove = /^remove product "([^"]+)"$/iu.exec(line);
      const rename = /^rename product "([^"]+)" to "([^"]+)"$/iu.exec(line);
      const command = match || remove || rename;
      if (!command) throw new Error('Use: Set price of "Product" to 250, Rename product "Old" to "New", Remove product "Product", or Set restaurant name to Name.');
      const found = next.categories.flatMap(category => category.items.filter(item => key(item.name) === key(command[1])).map(item => ({ category, item })));
      if (found.length !== 1) throw new Error(found.length ? 'Product name is ambiguous. Use the normal editor to choose the product.' : 'Product not found: ' + command[1]);
      const { category, item } = found[0];
      if (match) { const amount = price(match[2]); changes.push(item.name + ': ' + item.price + ' → ' + amount); item.price = amount; }
      else if (rename) { const name = bounded(rename[2], 100, 'Product name'); changes.push(item.name + ' → ' + name); item.name = name; }
      else { changes.push('Remove product: ' + item.name); category.items = category.items.filter(value => value !== item); }
    }
    return { ...validate(next), changes, unresolved: [] };
  }
  function propose(source, state, mode) {
    if (typeof source !== 'string' || !source.trim() || source.length > 15000) throw new Error('Enter 1–15,000 characters.');
    if (!['append', 'replace', 'edit'].includes(mode)) throw new Error('Choose a valid mode.');
    // Do not mutate caller data, even if the last operation fails.
    const current = copy(state);
    if (mode === 'edit') return { ...edit(source, current), mode };
    const extracted = extract(source);
    if (!Object.keys(extracted.fields).length && !extracted.categories.some(c => c.items.length)) throw new Error('No explicit menu facts found. Use Restaurant: Name, Category: Food, then Product | Price.');
    if (mode !== 'replace' && current.categories.some(c => c.items.length) && extracted.fields.currency && current.fields.currency && extracted.fields.currency !== current.fields.currency) throw new Error('Changing currency would relabel existing prices. Change prices and currency explicitly in the editor or replace the menu.');
    const next = mode === 'replace' ? [] : current.categories;
    for (const category of extracted.categories) {
      const existing = next.find(value => key(value.name) === key(category.name));
      if (existing) existing.items.push(...category.items); else next.push(category);
    }
    const result = validate({ fields: { ...current.fields, ...extracted.fields }, categories: next });
    return { ...result, mode, unresolved: extracted.unresolved, changes: [mode === 'replace' ? 'Replace all current categories and products.' : 'Append products to matching categories.', ...Object.entries(extracted.fields).map(([name, value]) => name + ' → ' + value), ...extracted.categories.flatMap(c => c.items.map(item => c.name + ': ' + item.name + ' — ' + item.price))] };
  }
  root.AuraMenuAssistantCore = Object.freeze({ propose, validate, price, csv });
})(typeof window !== 'undefined' ? window : globalThis);
