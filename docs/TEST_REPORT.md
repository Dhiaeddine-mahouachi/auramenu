# AuraMenu test report — 2026-11-27

Only tests actually run are listed.

| Suite | Where | Result |
|---|---|---|
| `node --test tests/*.test.mjs` | local copy of main | pass |
| `tests/auramenu-v2-browser.cjs` — 30 designs × TR/EN/AR/FR render, no console errors | local server | pass |
| axe-core WCAG 2 AA — 30 designs + 37 site pages + 11 new SEO pages | local server | 0 violations |
| Offline menu (`/menu-sw.js`): load, go offline, reload | local server | menu renders offline |
| Sign-in → Studio flow (`/api/aurapops/account/login`) | live | wrong password → 401 as expected; redirect to Studio works |
| Live smoke: home, gallery, builder, Studio, FAQ, 17 SEO pages, hub — HTTP 200, no console errors/failed requests | auramenu.space (Edge via Playwright) | pass |
| auradigital `npm test` incl. `test/auramenu-v2-fields.test.mjs` | auradigital a43966d | 386 / 386 pass |
| Live API health: `/api/auramenu/designs`, `/pricing` | auramenu.space | 200 |

## Not tested (no coverage yet)
- Tenant isolation between restaurants (blocked by A-2).
- Backup/restore (BLK-5).
- Payment flows (no provider).
- Real-device QR scanning on iOS/Android.
- Load/performance under many concurrent scans.
