/*
 * AuraMenu conversational draft contract.
 *
 * Deliberately free of network/LLM/payment/publishing code. A future
 * authenticated AI endpoint returns a proposed JSON draft. Normalize it here
 * before allowing the customer to review each item in the existing editor.
 * ALL prices, ingredients, allergens, images and business details require
 * explicit customer review; data alone is not proof of business truth.
 */
(function (root) {
  "use strict";
  const CURRENCIES = new Set(["TRY", "EUR", "USD", "TND"]);
  const LANGUAGES = new Set(["tr", "en", "ar"]);
  const MAX_CATEGORIES = 12, MAX_PER_CATEGORY = 20, MAX_TOTAL = 120;
  const LIMITS = Object.freeze({
    businessName: 100, tagline: 140, description: 600,
    address: 220, businessPhone: 40, openingHours: 100
  });
  const escapeControls = (value) => String(value).replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").trim();
  function string(value, field, max, required = false) {
    if (value == null || value === "") {
      if (required) throw new Error("Missing " + field + ".");
      return "";
    }
    if (typeof value !== "string") throw new Error("Invalid " + field + ".");
    const normalized = escapeControls(value);
    if (normalized.length > max || (required && !normalized)) {
      throw new Error("Invalid " + field + ": limit is " + max + " characters.");
    }
    return normalized;
  }
  function price(value) {
    if (value == null || value === "") return null;
    if (typeof value !== "string" && typeof value !== "number") throw new Error("Invalid item price.");
    const numberText = escapeControls(value)
      .replace(/^[₺€$]\s*/, "")
      .replace(/\s*(?:₺|€|\$|TL|TRY|EUR|USD|TND)\s*$/i, "");
    if (!/^\d{1,7}(?:[.,]\d{1,2})?$/.test(numberText)) throw new Error("Invalid item price.");
    return numberText;
  }
  function normalize(value) {
    if (typeof value === "string") {
      if (value.length > 25000) throw new Error("Draft exceeds size limit.");
      try { value = JSON.parse(value); } catch { throw new Error("Invalid structured draft."); }
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Expected a draft object.");
    }
    if (!Array.isArray(value.categories) || value.categories.length === 0 ||
        value.categories.length > MAX_CATEGORIES) {
      throw new Error("Draft must have 1–12 categories.");
    }
    const fields = {};
    for (const [key, max] of Object.entries(LIMITS)) {
      fields[key] = string(value[key], key, max);
    }
    const currency = CURRENCIES.has(value.currency) ? value.currency : "TRY";
    const menuLanguage = LANGUAGES.has(value.menuLanguage) ? value.menuLanguage : "tr";
    const questions = [], seenCategories = new Set();
    let count = 0;
    const categories = value.categories.map((category, categoryIndex) => {
      if (!category || typeof category !== "object" || Array.isArray(category)) {
        throw new Error("Invalid category.");
      }
      const name = string(category.name, "category name", 80, true);
      const key = name.toLocaleLowerCase("tr");
      if (seenCategories.has(key)) throw new Error("Duplicate category name.");
      seenCategories.add(key);
      if (!Array.isArray(category.items) || category.items.length > MAX_PER_CATEGORY) {
        throw new Error("Category must have up to 20 products.");
      }
      const seenNames = new Set();
      const items = category.items.map((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          throw new Error("Invalid menu product.");
        }
        const productName = string(item.name, "product name", 100, true);
        const productKey = productName.toLocaleLowerCase("tr");
        if (seenNames.has(productKey)) throw new Error("Duplicate product in category.");
        seenNames.add(productKey);
        const amount = price(item.price);
        const description = string(item.description, "item description", 300);
        // Never trust model-supplied image URLs or external side-effect fields.
        // Imported products have no photo until a customer explicitly supplies one.
        if (amount === null) {
          questions.push({
            categoryIndex, itemIndex: index,
            product: productName, field: "price",
            message: "Confirm the price for " + productName + "."
          });
        }
        count += 1;
        return {
          name: productName, description, price: amount,
          imageUrl: "", imageData: "", featured: false,
          needsPriceConfirmation: true
        };
      });
      return { name, emoji: "🍽️", items };
    });
    if (!count || count > MAX_TOTAL) throw new Error("Draft must contain 1–120 products.");
    return {
      kind: "auramenu_draft_v1",
      business: fields,
      currency, menuLanguage, categories, questions,
      productCount: count,
      requiresCustomerReview: true,
      paymentAuthorized: false,
      publicationAuthorized: false
    };
  }
  root.AuraMenuAIDraft = Object.freeze({ normalize });
})(typeof window !== "undefined" ? window : globalThis);
