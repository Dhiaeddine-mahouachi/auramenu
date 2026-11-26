# AuraMenu Design Studio release candidate

## Review

The owner-private [Design Studio](https://auramenu-standard-design-studio.dhiamahouachi115.chatgpt.site) hosts the 15 functional Standard layouts with six restaurant datasets and four edge-case datasets. The template cards use screenshots captured from the same components that serve public menus. The review deployment uses fixture data exclusively. It has no customer API, account credentials, or database binding.

The existing QR route resolves the restaurant through the current AuraDigital API. The API's template ID determines the renderer. The four pre-existing IDs keep their original iframe renderers. Invalid IDs and load failures fall back to Nova Mobile. The builder, public restaurant menu, and Studio reuse the same Standard modules.

## Audit and changed files

The frontend baseline is AuraMenu commit `1ee3b771b48b4e1c82f34029b30f63ed735514b2`. AuraMenu serves HTML, CSS, and JavaScript through its existing Pages setup. AuraDigital commit `e2133b255c312f474dcd3016a81180c883788bcd` owns request approval, edit access, subscription terms, D1, and restaurant photos. The legacy settings, categories and item records live in the existing request and image tables. No customer records were accessed for testing.

- `standard/` contains the 15 template modules and styles, registry, adapter, customization editor, shared menu, Aura Connect, and AuraPlay.
- `studio/` contains the interactive catalog, screenshot thumbnails, photo derivatives and isolated fixtures. [Photo sources](design-photo-sources.md) records the original assets.
- `builder.html`, `builder.js`, `dashboard.html`, and `dashboard.js` integrate the server-offered templates and setup controls. The owner dashboard now restores the existing per-menu token after account verification.
- `menu.html`, `404.html`, and `menu.js` connect the public QR entry points to the Standard renderer. The loader now resolves the relative API base against the current origin.
- `tests/design-data.test.mjs` and `tests/design-browser-smoke.mjs` check the shared renderer, public routes, builder, and dashboard.
- AuraDigital changes are in `src/auramenu-designs.js`, `src/auramenu-dashboard.js`, `src/worker.js`, `migrations/0041_auramenu_design_settings.sql` and `test/auramenu-design.test.mjs`. See [AuraDigital commit d5874fc](https://github.com/Dhiaeddine-mahouachi/auradigital/commit/d5874fc889cf797f9d02c7e69a4e06f9d6bdbb10).

The optional presentation table stores brand settings by menu ID. Existing category records continue to carry the products, variants, translations and subcategories. Saving settings and changing the template uses the existing authenticated menu mutation and the same transaction. The API gates new selection and initial approval. Existing Starter, Pro and One-time contracts can use Standard once the flag is enabled. No Premium designs or new billing plans are registered.

## Performance

Before changes, the standalone Nova Mobile and Maison demos measured median LCP of 0.92 s and 1.84 s. The comparison below uses the same public-menu route and restaurant fixture for both generations after fixing the existing URL loader.

Cold-load measurements used local Chromium 153 with the Pixel 7 profile, 4× CPU slowdown, 150 ms network latency and 1.6 Mbps downstream. Each row is three runs on the public-menu route with the same eight-dish Patty Club fixture and a mocked API response. Third-party requests were blocked in this lab run. LCP is relative to initial page navigation, including the legacy iframe's navigation offset. Transfer is the locally served browser-reported traffic, with no production CDN compression. CLS and click timing report the maximum observed across the three runs.

| Menu | Median LCP | Slowest LCP | Max CLS | Max sampled click | Transfer |
|---|---:|---:|---:|---:|---:|
| Nova Mobile (legacy) | 1.27 s | 1.28 s | 0.032 | — | 106 kB |
| Maison (legacy) | 1.13 s | 1.15 s | 0.000 | — | 104 kB |
| Aura Classic | 1.62 s | 1.64 s | 0.000 | 56 ms | 200 kB |
| Aura Grid | 2.15 s | 2.26 s | 0.000 | 152 ms | 201 kB |
| Aura Royal | 2.08 s | 2.12 s | 0.000 | 56 ms | 201 kB |
| Aura Feed | 1.99 s | 2.10 s | 0.000 | 48 ms | 243 kB |
| Aura Panel | 1.64 s | 1.66 s | 0.000 | 48 ms | 115 kB |

All sampled Standard runs were within the 2.5 s LCP and 0.1 CLS targets. The comparison shows a material load-time and transfer cost for Standard photo layouts relative to the two legacy templates. The Standard changes preserve the legacy renderer. Click samples are individual lab interactions. Production INP, Lighthouse scores, and CDN behavior still need measurement before a customer rollout.

The new menu loads only the selected template's CSS and layout module. Fixture photos use local WebP at two widths. The gallery loads WebP screenshots. AuraPlay issued zero requests for its game module before Play. The game module is about 1.6 kB gzipped and plays without API requests.

## Verification

- 18 AuraMenu Node tests passed. Syntax checks use Node; the static frontend has no TypeScript build to run.
- The existing voice and assistant browser tests passed. The assistant test used a local copy of the existing QR library because the lab could not reach its CDN.
- The Chromium matrix passed all 450 combinations of 15 templates, ten datasets and three languages at 320 px. The browser suite also checked the 375, 390 and 430 px presets, desktop sizing, category and product interactions, search, failed photos, currency and price visibility, external links, AuraPlay, builder preview, authenticated settings save, and legacy and Standard public routes. Full-size local screenshots were captured for every template, and the gallery includes optimized copies.
- 381 AuraDigital tests passed. The worker bundled with the repository's esbuild tool. D1-style SQLite fixtures verified ownership, rejected unsafe URLs and unsupported templates, enforced approval and paid access, preserved nested products, and checked the legacy release path.
- Physical iOS Safari and Android Chrome coverage is pending. Large menus were tested with a 320-item fixture. Existing authoring limits cap saved customer menus at 100 products. The existing AuraHub private draft contract still exposes its legacy template choices.

To reproduce the frontend checks, serve the repository and run:

```sh
node --test tests/*.test.mjs
AURA_TEST_ORIGIN=http://127.0.0.1:4173 DESIGN_SCREENSHOTS=1 node tests/design-browser-smoke.mjs
```

The browser suite uses Playwright and Chromium. Set `CHROMIUM_PATH` when testing with a system browser.

## Rollout and rollback

The customer-facing production branches, DNS and D1 database have not been updated. For a controlled rollout, apply migration 0041 in a non-production AuraDigital D1 environment, deploy the AuraMenu frontend with the Standard files, then deploy the companion API. Keep the `studio/` fixture gallery on the protected review deployment when preparing a customer-facing package. Enable `AURAMENU_STANDARD_ENABLED=true` only in the environment where you want to enable new selections and approval. Confirm the same menu opens from its QR URL and that both save and approval still enforce ownership and billing.

For immediate rollback after enablement, unset `AURAMENU_STANDARD_ENABLED`. This stops new Standard selections and first approvals while preserving existing published Standard menus. Keep the additive presentation table and renderer deployed while customers use these layouts. If a full frontend revert is necessary, migrate those menus back to a legacy template through the authenticated edit flow before reverting. The private review release itself can be rolled back independently.
