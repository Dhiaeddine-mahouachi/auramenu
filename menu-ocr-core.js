/* AuraMenu: turns OCR text from a photo of a printed menu into the builder's bracket import format.
 * Deterministic: only lines with an explicit price become products; nothing is invented.
 *   [Category]
 *   Product | 250 | description
 */
(function (root) {
  "use strict";
  const PRICE = /(?:^|\s|[.·…_\-–—:|])((?:₺|\$|€)?\s?\d{1,5}(?:[.,]\d{1,2})?)\s*(?:₺|tl|try|tl\.|\$|€|usd|eur|tnd|dt|lira)?\s*$/i;
  const NOISE = /^[^\p{L}]*$/u;
  const clean = (s) => String(s || "").replace(/[|]/g, "/").replace(/\s{2,}/g, " ").replace(/^[\s.·•*\-–—:]+|[\s.·•*\-–—:]+$/g, "").trim();
  const arabicDigits = (s) => s.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

  function looksLikeCategory(line) {
    if (line.length < 2 || line.length > 32) return false;
    const letters = line.replace(/[^\p{L}]/gu, "");
    if (letters.length < 2) return false;
    const upper = letters === letters.toLocaleUpperCase("tr") && letters !== letters.toLocaleLowerCase("tr");
    const words = line.split(/\s+/).length;
    return upper || (words <= 3 && !/[,.;]/.test(line));
  }

  function parse(text, fallbackCategory) {
    const lines = arabicDigits(String(text || "")).split(/\r?\n/).map((l) => l.replace(/\t/g, " ").trim()).filter((l) => l && !NOISE.test(l));
    const cats = []; let cur = null; let last = null; const skipped = [];
    const ensure = () => { if (!cur) { cur = { name: fallbackCategory || "Menü", items: [] }; cats.push(cur); } return cur; };
    for (const raw of lines) {
      const m = PRICE.exec(raw);
      if (m) {
        const name = clean(raw.slice(0, m.index));
        const price = m[1].replace(/[₺$€\s]/g, "").replace(",", ".");
        if (name.length >= 2 && Number(price) > 0) { last = { name: name.slice(0, 80), price, description: "" }; ensure().items.push(last); continue; }
      }
      const line = clean(raw);
      if (!line) continue;
      if (looksLikeCategory(line) && !(last && /^[a-zçğıöşü]/.test(line))) { cur = { name: line.slice(0, 60), items: [] }; cats.push(cur); last = null; continue; }
      if (last && line.length <= 160 && !last.description) { last.description = line; continue; }
      skipped.push(line);
    }
    const categories = cats.filter((c) => c.items.length);
    const bracket = categories.map((c) => `[${c.name.replace(/[[\]]/g, "")}]\n` + c.items.map((i) => [i.name, i.price, i.description].filter(Boolean).join(" | ")).join("\n")).join("\n");
    return { categories, bracket, skipped, count: categories.reduce((n, c) => n + c.items.length, 0) };
  }
  root.AuraMenuOcrCore = Object.freeze({ parse });
  if (typeof module !== "undefined") module.exports = { parse };
})(typeof window !== "undefined" ? window : globalThis);
