# AuraMenu Atelier review

[Design Studio](https://auramenu-standard-design-studio.dhiamahouachi115.chatgpt.site) uses fictional restaurant data. It serves the same template modules, adapter and renderer as the candidate public QR route. The opening screenshots are in each template card. The inspector links to a separate product screenshot for the selected template.

## Collection

All 30 below are included in the review candidate. The four original public templates use their existing IDs and are available through the original QR renderer.

| Standard | Premium | Collection |
| --- | --- | --- |
| STD-01 Aura Classic | PRE-16 Aura Nouveau | Heritage |
| STD-02 Aura Grid | PRE-17 Aura Gatsby | Heritage |
| STD-03 Aura Minimal | PRE-18 Aura Époque | Heritage |
| STD-04 Aura Noir | PRE-19 Aura Maison | Signature |
| STD-05 Aura Bento | PRE-20 Aura Kyoto | Signature |
| STD-06 Aura Roast | PRE-21 Aura Studio | Signature |
| STD-07 Aura Pop | PRE-22 Aura Liquid | Signature |
| STD-08 Aura Royal | PRE-23 Aura Cinematic | Experience |
| STD-09 Aura Dolce | PRE-24 Aura Orbit | Experience |
| STD-10 Aura Zen | PRE-25 Aura Gallery | Experience |
| STD-11 Aura Feed | PRE-26 Aura PopOut | 3D |
| STD-12 Aura Float | PRE-27 Aura Layers | 3D |
| STD-13 Aura Heritage | PRE-28 Aura Exhibition | 3D |
| STD-14 Aura Panel | PRE-29 Aura Retro 3D | 3D |
| STD-15 Aura Tiles | PRE-30 Aura Reality | 3D |

## Architecture and data

- `standard/registry.mjs` registers stable IDs, collections, tier, CSS and lazy loaders. `standard/menu.mjs`, `data.mjs`, `connect.mjs` and `play.mjs` render shared product information and restaurant controls. The public route in `menu.js` selects the template after resolving the existing menu API response. The fallback tries Aura Classic before using Nova Mobile.
- `premium/templates/` contains the 15 layouts and scoped stylesheets. `premium/viewer.mjs` and `smash-model.mjs` are imported on explicit activation. The original low-poly burger model and layer illustrations are associated with the fictional demo. Unsupported WebGL falls back to the original product photo and details.
- `studio/` contains six ordinary restaurant fixtures, four edge cases, filters, viewport controls, two-template comparison, language and brand controls, account-tier simulation, photo and slowed-device modes, and screenshots. The review deployment includes renderers and fixtures only.
- The companion [AuraDigital feature branch](https://github.com/Dhiaeddine-mahouachi/auradigital/tree/feature/auramenu-premium-collection) updates `src/auramenu-designs.js`, `src/auramenu-dashboard.js` and `src/worker.js`. The existing menu token, pending or paid editing checks, and approval path remain authoritative. The public catalog exposes preview IDs and the authenticated dashboard exposes only the Premium choices granted to that restaurant.

## Data and rollout

The candidate reuses additive migration `0041_auramenu_design_settings.sql` from the Standard branch. Premium adds no table or migration. Test migration 0041 against a non-production D1 database before enabling customer selection. The ordinary checkout still accepts its existing plans. Staff can configure an explicit grant per existing menu ID with `AURAMENU_PREMIUM_ENABLED` and `AURAMENU_PREMIUM_MENU_IDS` in the selected environment. Verify billing and the menu token before assigning access. An authenticated entitled menu can switch to Premium in its dashboard. First publication requires entitlement and the existing payment approval.

The existing paid-period policy still governs whether the public menu is live. Removing the Premium grant stops subsequent Premium selections and first approval. Existing approved menus retain their assigned template while the existing billing policy permits them online. A permanent commercial downgrade policy should be decided before rollout. For release rollback, turn off the new selection flags while keeping the renderer available for menus already using the collection. Move those menus through the authenticated dashboard before reverting the renderer. Retain the additive table so saved styling survives rollback.

## Validation

- AuraMenu Node suite: 20 passed. Chromium matrix: 900 render combinations across 30 templates, ten fixtures and three languages at 320 CSS pixels, plus viewport controls, gallery filters, comparison, public QR and legacy routes, owner editing, search, price and link rendering, on-demand Snake, the ingredient diagram and the 3D viewer with and without WebGL.
- All 30 designs have an opening thumbnail and a product-detail screenshot captured from the renderer. The browser fixture suite includes mixed prices, broken photographs, missing assets, long Arabic strings and a 320-item menu.
- AuraDigital Node suite: 381 passed, including grant isolation, authorization and payment approval, paid legacy menu behavior, and existing photo-signature and ownership tests. The Worker was bundled locally using esbuild. The protected review exercises the renderer with fixtures. The backend authorization checks ran against local database tests.
- Physical iOS Safari and Android Chrome, Firefox, an authenticated Cloudflare D1 staging integration, and real-user performance remain unverified.

## Performance

Three cold-load samples per template used Chromium 131 with a Pixel 7 profile, 4× CPU slowdown, 150 ms latency and 1.6 Mbps download. The HTTP server returned the locally hosted eight-item burger fixture through the public QR route. Transfer includes local uncompressed resources reported by the browser and excludes the document itself. LCP is the median and CLS is the maximum across the three samples.

| Renderer | LCP | Max CLS | Transfer | JavaScript | Images |
| --- | ---: | ---: | ---: | ---: | ---: |
| Original Nova Mobile | 1.29 s | 0.087 | 93 kB | 49 kB | 0 kB in the legacy fixture render |
| Existing Standard Classic branch | 1.67 s | 0 | 199 kB | 49 kB | 120 kB |
| Candidate Standard Classic | 1.69 s | 0 | 205 kB | 55 kB | 120 kB |
| Nouveau | 2.68 s | 0 | 235 kB | 61 kB | 138 kB |
| Studio | 1.99 s | 0 | 401 kB | 61 kB | 304 kB |
| Reality | 2.01 s | 0 | 384 kB | 63 kB | 285 kB |

Mobile Lighthouse 12.2.2 scored Classic 98, Nouveau 97 and Reality 96 for performance. The accessibility score was 100 for the three sampled pages after adjusting muted text contrast. Their Lighthouse LCP measurements were 2.28 s, 2.64 s and 2.71 s respectively, with CLS 0. The two Premium Lighthouse runs exceeded the proposed 2.5 s LCP target. Laboratory measurements vary by browser and throttling method. Production INP, CDN delivery, memory budgets and a full 30-template accessibility audit remain pending.

Initial requests for the game or model in the sampled renders: zero. Gzipped source sizes are 1.8 kB for Snake, 2.0 kB for the viewer module and 0.8 kB for the model module. Photo transfers are measured on the sample fixture and will vary with restaurant imagery.

## Known limitations

Cinematic currently uses still photos. Reality uses the bundled example model. Authoring and uploading third-party or customer-owned 3D, layer, multi-photo, video and 360° assets remain outside this reviewed build. Product cutouts in the demo use the existing photo, cropped in the render layer. The package supports the existing photo-upload flow and its existing set of image types. Provisioning a paid Premium plan through checkout, the production enablement decision, and any production data migration are pending.

The collection is ready for protected design review. Customer rollout still requires the backend staging checks and an approved Premium plan policy.
