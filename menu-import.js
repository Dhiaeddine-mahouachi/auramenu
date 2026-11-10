/* Controlled product-list import for AuraMenu.
 * No AI inference, payment or publishing action happens in this module.
 * Future AI suggestions can pass through this same validation before preview.
 */
(function (root) {
  "use strict";
  const MAX_SOURCE_LENGTH = 15000;
  const MAX_CATEGORIES = 12;
  const MAX_ITEMS = 20;
  const MAX_LINES = 260;
  const pricePattern = /^(?:[₺€$]\s*)?\d{1,7}(?:[.,]\d{1,3})*(?:\s*(?:₺|€|\$|TL|TRY|EUR|USD|TND))?$/i;

  function parse(text) {
    if (typeof text !== "string" || !text.trim()) {
      throw new Error("Add at least one category and priced product.");
    }
    if (text.length > MAX_SOURCE_LENGTH) {
      throw new Error("Product list is too long (maximum 15,000 characters).");
    }
    const lines = text.replace(/\r\n?/g, "\n").split("\n");
    if (lines.length > MAX_LINES) {
      throw new Error("Product list has too many lines.");
    }
    const groups = [];
    let current = null;
    let itemCount = 0;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;
      const heading = /^\[([^\[\]]+)\]$/.exec(line);
      if (heading) {
        const name = heading[1].trim();
        if (!name || name.length > 80) {
          throw new Error("Line " + (i + 1) + ": category name must be 1–80 characters.");
        }
        current = groups.find((group) => group.name.toLocaleLowerCase() === name.toLocaleLowerCase());
        if (!current) {
          if (groups.length >= MAX_CATEGORIES) {
            throw new Error("Maximum " + MAX_CATEGORIES + " categories per menu.");
          }
          current = { name, emoji: "🍽️", items: [] };
          groups.push(current);
        }
        continue;
      }
      if (!current) {
        throw new Error("Line " + (i + 1) + ": add a [Category] heading before products.");
      }
      const fields = line.split("|").map((field) => field.trim());
      if (fields.length < 2 || fields.length > 4) {
        throw new Error("Line " + (i + 1) + ": use Name | Price | Optional description | Optional HTTPS image URL.");
      }
      const [name, price, description = "", imageUrl = ""] = fields;
      if (!name || name.length > 100) {
        throw new Error("Line " + (i + 1) + ": product name must be 1–100 characters.");
      }
      if (!pricePattern.test(price) || price.length > 40) {
        throw new Error("Line " + (i + 1) + ": enter a numeric price; Aura will not guess prices.");
      }
      if (description.length > 300) {
        throw new Error("Line " + (i + 1) + ": description exceeds 300 characters.");
      }
      if (imageUrl) {
        if (imageUrl.length > 800) throw new Error("Line " + (i + 1) + ": image link is too long.");
        let url;
        try { url = new URL(imageUrl); } catch { throw new Error("Line " + (i + 1) + ": image must be a full HTTPS link."); }
        if (url.protocol !== "https:" || url.username || url.password) {
          throw new Error("Line " + (i + 1) + ": only HTTPS image links without credentials are allowed.");
        }
      }
      if (current.items.length >= MAX_ITEMS) {
        throw new Error("Line " + (i + 1) + ": maximum " + MAX_ITEMS + " products per category.");
      }
      current.items.push({ name, price, description, imageUrl, imageData: "", featured: false });
      itemCount += 1;
    }
    if (!itemCount) throw new Error("Add at least one priced product.");
    return { categories: groups, itemCount };
  }

  root.AuraMenuQuickImport = Object.freeze({ parse });
})(typeof window !== "undefined" ? window : globalThis);
