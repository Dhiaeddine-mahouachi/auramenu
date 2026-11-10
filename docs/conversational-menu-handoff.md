# AuraMenu conversational draft — API handoff

Status: **draft implementation contract only; not deployed and no model calls enabled**.

## Purpose
Turn one customer voice transcript or typed description into a reviewable menu draft. Do not reuse the existing AuraDigital sales/pricing AI endpoint, which is intended for commercial quotations and not constrained menu extraction.

## Proposed endpoint (implement in AuraDigital backend)
`POST /api/auramenu/ai/draft`

Request, after authenticated customer account/verified entitlement and rate-limit checks:

```json
{
  "locale": "tr",
  "transcript": "Restoranım Bella Roma. Margherita 320 lira, Pepperoni 390 lira, Tiramisu 220 lira.",
  "context": { "industry": "restaurant" }
}
```

The backend must be the only holder of model credentials. It must use a dedicated environment feature flag, per-user quota, global daily spending limit, and strict body length checks. No purchase or publishing capability is exposed.

Response from backend AFTER validating the model output:

```json
{
  "draft": {
    "businessName": "Bella Roma",
    "menuLanguage": "tr",
    "currency": "TRY",
    "categories": [
      { "name": "Pizzalar", "items": [
        { "name": "Margherita", "price": "320" },
        { "name": "Pepperoni", "price": "390" }
      ] },
      { "name": "Tatlılar", "items": [
        { "name": "Tiramisu", "price": "220" }
      ] }
    ]
  }
}
```

The browser uses `AuraMenuAIDraft.normalize(draft)` to enforce limits again, strips unsupported image/side-effect fields, prompts for missing prices and displays a review screen. A structured price is **not proof** that the transcript was correctly understood; the customer must confirm every price.

## Required behaviors
- Prices and allergens are never invented. Missing prices remain null and require a question.
- Any model-inferred grouping and description is explicitly marked as a suggestion during review.
- Text from transcripts/images is treated as data, never instructions to execute code or change payment.
- The customer must explicitly choose **Apply to draft** before the form is populated; default does not overwrite existing products.
- A successful paid order still requires the existing verified-payment and independent publication approval workflow.
- No raw audio or API keys stored in browser storage. Do not log customer transcript content.
- Request-level timeouts and output caps; quota exhausted should offer the manual/voice field editor.
- Existing manual builder, previously published menus and payment state are untouched by this development PR.

## Next development steps
1. Wire a strict, quota-limited backend AI extractor with test model fixtures.
2. Add conversational UI and review flow on this existing builder, including voice transcript reuse.
3. Mobile Safari/Chrome acceptance, TR/EN/AR QA, pricing/cost monitoring and privacy checks.
4. Only after approval, merge and deploy a separate release.
