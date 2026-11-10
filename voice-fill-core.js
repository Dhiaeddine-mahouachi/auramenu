/* Pure, deterministic dictation parser. Speech is handled separately.
 * Never infer a price that the customer did not explicitly say.
 */
(function (root) {
  "use strict";
  const fields = Object.freeze({
    businessName: 100,
    tagline: 140,
    description: 600,
    address: 220,
    businessPhone: 40,
    openingHours: 100
  });

  function normalizeDigits(value) {
    return value
      .replace(/[٠-٩]/g, (char) => String(char.charCodeAt(0) - 0x0660))
      .replace(/[۰-۹]/g, (char) => String(char.charCodeAt(0) - 0x06f0));
  }
  function textValue(value) {
    return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().replace(/\s+/g, " ") : "";
  }
  function requireLength(value, max, label) {
    if (!value || value.length > max) {
      throw new Error(label + " must be between 1 and " + max + " characters.");
    }
    return value;
  }
  function parsePrice(raw) {
    const value = normalizeDigits(textValue(raw))
      .replace(/^[₺€$]\s*/, "")
      .replace(/\s*(?:₺|€|\$|TL|TRY|EUR|USD|TND|lira|liras|lirası|ليرة|ليرات)\s*$/iu, "")
      .trim();
    if (!/^\d{1,7}(?:[.,]\d{1,3})?$/.test(value)) {
      throw new Error("Say an explicit numeric price, such as 320. Prices are never guessed.");
    }
    return value;
  }

  function parseProduct(raw) {
    const speech = normalizeDigits(textValue(raw)).replace(/^(?:(?:add|create)\s+(?:(?:a|new)\s+)?(?:product|item)\s*|(?:ürün ekle)\s*|(?:أضف منتج)\s*)/iu, "").trim();
    let name, price, description = "";
    const separated = speech.includes("|") ? speech.split("|").map(textValue)
      : speech.split(/\s*,\s*/).map(textValue);
    if (separated.length >= 2 && separated.length <= 3) {
      [name, price, description = ""] = separated;
      // A comma may be a decimal separator, not a field delimiter.
      if (separated.length === 2 && /^\d{1,7}$/.test(name) && /^\d{1,3}$/.test(price)) {
        throw new Error("Say the product name and its numeric price.");
      }
    } else {
      const amount = "([₺€$]?\\s*\\d{1,7}(?:[.,]\\d{1,3})?\\s*(?:₺|€|\\$|TL|TRY|EUR|USD|TND|lira|liras|ليرة|ليرات)?)";
      const pattern = new RegExp("^(.+?)(?:\\s+(?:price|costs?|for|fiyat[ıi]?|ücreti|السعر|سعر|بـ|بسعر)\\s+|\\s+)"+amount+"$", "iu");
      const match = pattern.exec(speech);
      if (!match) throw new Error("For a product, say 'Margherita, 320' or 'Margherita price 320'.");
      name = match[1].trim();
      price = match[2].trim();
    }
    requireLength(name, 100, "Product name");
    requireLength(description, 300, "Description");
    return { kind: "product", name, price: parsePrice(price), description };
  }

  function parse(target, transcript) {
    const value = textValue(transcript);
    if (!value) throw new Error("Speak or type a value first.");
    if (Object.prototype.hasOwnProperty.call(fields, target)) {
      return { kind: "field", target, value: requireLength(value, fields[target], target) };
    }
    if (target === "category") {
      return { kind: "category", name: requireLength(value, 80, "Category name") };
    }
    if (target === "product") return parseProduct(value);
    throw new Error("Unknown field selection.");
  }

  root.AuraMenuVoiceCore = Object.freeze({ parse, normalizeDigits });
})(typeof window !== "undefined" ? window : globalThis);
