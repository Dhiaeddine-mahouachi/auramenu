# AuraMenu 2.0 — development checkpoint 02 (2026-11-27)
Branch: development/auramenu-2 (local). No deployment, no production data touched.

## Done in this checkpoint
- **Brand system (AM-08–16, 22):** new arch logo mark (`brand/mark.svg`, also `logo.svg` favicon), original cloche mascot (`brand/mascot.svg`), tokens + components (`brand/aura-brand.css`), self-hosted Baloo 2 / Inter / Baloo Bhaijaan 2 / Cairo + design fonts (OFL, `fonts/v2/`). Single sun/moon toggle, TR default · EN · AR (RTL).
- **Menu engine + 25 new designs (AM-40–48, 64–71):** `menu-v2.html?design=<id>` renders 15 standard + 10 premium designs from one engine (`menu-v2/engine.js`, `engine.css`, `designs.js`). Old a–d / 1–4 templates are untouched so existing customers and printed QR codes keep working.
- Every design includes: mobile menu, QR share + NFC note, categories, photos (illustrated fallback when none), descriptions & prices, product detail sheet, WhatsApp basket ordering, search, address + hours with open/closed, TRY/USD/EUR/TND (live rate, approximate, base currency stated), TR/EN/AR, FR shown as planned, light/dark toggle, Google Maps directions, Google review, Instagram/TikTok/Facebook/WhatsApp, ingredients + 14 allergens, availability (available / few left / sold out), lazy-loaded food Snake game.
- **Public gallery (AM-32–38):** `gallery.html` lists all 25 with real screenshots (`media/gallery-v3/`), tier + collection filters, live preview dialog (phone/wide, TR/EN/AR) and explicit "I want this design" choice; never redirects to Studio.
- **Homepage (AM-24–30):** rebuilt `index.html` in the new identity (old one kept as `legacy-index.html`). Prices still read from `config.js`.
- **Builder & published menus:** `menu-v2/registry.js` lets `builder.html` preview and `menu.js` publish the 25 new design IDs through the existing `auramenu:render` message contract. Builder, status and dashboard reskinned (`brand/builder-skin.css`, `brand/app-skin.css`).

## Verified
- `node --test tests/*.test.mjs` → 17 pass, 0 fail.
- `node tests/auramenu-v2-browser.cjs` (Chrome) → all 25 designs × TR/EN/AR load with no JS errors and no horizontal overflow; detail sheet, allergens, add-to-order, currency switch, search, dark toggle, Snake game, gallery filters/preview/selection, homepage mobile width.

## Open / blockers
- **Backend:** AuraDigital server must accept the 25 new `templateId` values (and any premium entitlement rule) before customers can submit/publish them. Not verified — server code not in this checkout.
- Builder does not yet collect the new optional fields (hours per day, allergens, ingredients, availability, socials, Maps/review link). The engine supports them; builder + API need fields added.
- Demo menus use sample restaurants, prices and allergen data.
- FAQ / features / how-it-works pages still use the old style.
- French content, Studio dashboard redesign (AM-49–63), QR material tools (AM-72–77) and release gates (AM-78–89) remain open.

# Checkpoint 03 (2026-11-27)
- Fixed mobile scroll lock: category bar auto-centering no longer calls scrollIntoView (it cancelled finger scrolling); sheets close properly and release page scroll; horizontal lists never trap vertical swipes; tasting "chapters" stack vertically on phones. Verified with touch-swipe tests on all designs.
- Video slot in every design (story card under the hero, autoplay muted only when visible, sound/pause buttons) + optional per-dish video in the product sheet. Demo clips in `media/video/` are made from menu photos.
- 5 high-end designs (premium): Mermer, Velvet, Boğaziçi, Kuro, Ivory, with new steakhouse sample menu. Total 30 (15 standard + 15 premium).
- Animated cloche is now the AuraMenu logo/mascot (`brand/mark.svg`, `brand/mascot*.svg`, `brand/mascot.js` states: wave, walk, thinking, loading, celebrate, sleep…).
- Community section with three brand illustrations (`media/community/`, labelled as illustrations). Client-logo row ready in `brand/home.js` (CLIENTS array, empty until real logos are supplied).
- SEO: qr-menu, dijital-menu, nfc-menu, kafe-qr-menu, restoran-qr-menu, istanbul-qr-menu, rebuilt faq (FAQPage + SoftwareApplication JSON-LD, hreflang, sitemap). features/how-it-works now point to homepage sections.
- Login (`login.html`) + AuraMenu Studio (`studio.html`; demo with `?demo=1`): overview, menu editor (availability, allergens, ingredients, photo/video), 30-design picker, info & per-day hours, socials, video, QR download, plan. Uses existing endpoints: `/api/aurapops/account/session|login|logout|verification/send`, `/dashboard/:id` (+claim, PATCH).
- Builder: step navigation with progress; one "Smart fill" section (voice, menu photo OCR via Tesseract.js, paste, CSV) that fills products automatically with undo; "Customize" section (visual design picker, menu colour, light/dark, logo, video, socials, Google links). New fields go into preview and submission payload as theme/logo/video/socials/reviewUrl/mapsUrl.
- Tests: 20 unit tests (new OCR parser tests) + browser acceptance for 30 designs × 3 languages.

Backend still needed: accept the 30 design IDs; store new optional fields (theme, logo, video, socials, reviewUrl, mapsUrl, hours, per-dish available/allergens/ingredients/video); confirm `/api/aurapops/account/login` and `/logout` exist; same-origin routing for /api on auramenu.space.

## Checkpoint 04 — live on auramenu.space (2026-11-27)

- Published to `main` (GitHub Pages). The 30 AuraMenu 2.0 designs now render every `std-01…pre-30` menu.
- The Cloudflare worker in front of auramenu.space owns `/brand/*` and any path containing `login`; site assets moved to `am2/`, sign-in lives at `/signin.html` (uses `POST /api/aurapops/account/login`).
- French guest interface in all designs (dish text falls back to English until the backend stores `fr`).
- Offline copy of public menus (`/menu-sw.js`, network first, menu files only).
- WCAG AA contrast: no axe violations across 30 designs + site, builder, Studio, sign-in.
- Front end sends/reads `restaurant.video`, `restaurant.hours`, `available: "limited"`; old fields still written.
- Backend branch `auramenu-v2-fields` (auradigital): stores those fields + French; 386/386 tests pass. Not deployed.
- Open: restaurant menu URLs return HTTP 404 (GitHub Pages 404.html), so they are not indexed and have no link previews; needs a worker route that serves them with 200 and meta tags.
