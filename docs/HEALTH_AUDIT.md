# AuraMenu — Health audit (Sprint 0)

Audited 2026-11-27 against live auramenu.space, repo `Dhiaeddine-mahouachi/auramenu` (main) and `Dhiaeddine-mahouachi/auradigital` (main, fb2f127).
Priorities: **P0** critical · **P1** important · **P2** improvement · **P3** future.

## What works today (verified)

| Area | Evidence |
|---|---|
| Marketing site, gallery, builder, Studio, FAQ, 17 SEO pages, guides hub | Live 200s, Playwright run on auramenu.space with zero console errors / failed requests (2026-11-27) |
| 30 menu designs (std-01…std-15, pre-16…pre-30) render from one engine | `tests/auramenu-v2-browser.cjs`: 30 designs × TR/EN/AR pass; axe WCAG 2 AA: 0 violations on all 30 |
| Public menu `/api/auramenu/sites/:slug` | Returns only public fields (no contact name/phone/email/payment) — `mapAuraMenuRequest(row,true)` |
| API security headers | CSP `default-src 'none'`, HSTS, XFO DENY, nosniff, no-referrer on `/api/*` |
| Backend fields for video / weekly hours / "limited" stock / French | Deployed 2026-11-27 (`a43966d`), 386/386 backend tests |
| Offline public menus | `/menu-sw.js` network-first, menu files only |
| French guest interface | All 30 designs |

## Findings

### P0 — critical

| ID | Finding | Impact | Next step |
|---|---|---|---|
| P0-1 | **Two account systems.** AuraMenu sign-in uses AuraPops accounts (`/api/aurapops/account/*`, served by the separate `aurapops` worker). AuraDigital and AuraHub use `/api/customer/*` (with Google OIDC) in the `auradigital` worker. | Fails "one Aura account". Customers can end up with two identities. | Sprint 2: move AuraMenu to the AuraDigital customer identity. Needs decision on migrating AuraPops-only users (BLK-1). |
| P0-2 | **Menu management access is a per-browser token** (`X-Aura-Menu-Token` in localStorage), not tied to an account or workspace. | Clearing the browser or changing device locks the owner out; no staff access; no tenant model. | Sprint 2/3: bind `auramenu_requests` to `workspace_id`/`user_id`; keep token as a legacy claim path. |
| P0-3 | **Restaurant menu URLs answer HTTP 404.** `auramenu.space/<slug>` is GitHub Pages' 404.html, which then loads the menu with JS. | Not indexable by Google, no WhatsApp/Instagram link previews, some scanners may show an error. | Serve `/<slug>` with 200 + server-rendered meta from a Cloudflare Worker route. Blocked: the worker in front of auramenu.space is not in any repo (BLK-2). |
| P0-4 | **Pricing conflict** — resolved 2026-11-27: Annual 2,500 TL/year confirmed by Dhia. Code (`MENU_PLANS`) and site FAQ sell *Starter 399/mo, Pro 599/mo, One-time 2,500 TL incl. 6 months hosting then 200 TL / 6 months*. The mission specifies *Standard 399/mo, Premium 599/mo, Annual 2,500 TL/year*. | Advertised terms may not match what is sold. | Business decision (BLK-3). Nothing changed until confirmed. |

### P1 — important

| ID | Finding |
|---|---|
| P1-1 | Site pages (GitHub Pages) send no CSP / HSTS / X-Frame-Options / Referrer-Policy; only `Cache-Control: max-age=600`. |
| P1-2 | An unknown Cloudflare worker owns `/login*` and `/brand/*` on auramenu.space; its `/login` page is broken (its `/account.js`, `/account.css` return 404). Site now uses `/signin.html`. |
| P1-3 | ~~Every QR scan reads D1~~ Fixed 2026-11-27: 60 s edge cache, purged on save/admin change (auradigital `8707f94`). |
| P1-4 | Menu images stored in D1 (`auramenu_images`), no R2 binding. Will not scale for photo-heavy menus. |
| P1-5 | Cloud drafts exist (`/api/hub/workspaces/:org/menu-drafts`) but `MENU_DRAFTS_ENABLED=false`; builder drafts live only in localStorage. |
| P1-6 | Premium access needs a manual env var edit (`AURAMENU_PREMIUM_MENU_IDS`) and redeploy. |
| P1-7 | Studio cannot list "my menus" — it only opens the menu whose token is in this browser. |
| P1-8 | ~~Old files deployed publicly~~ Corrected 2026-11-27: `a–d.html` and `1–4.html` render the four legacy designs (modern/orbit/maison/taste3d) in English and Arabic for already-published menus, and `standard/`, `premium/`, `studio/` are used by the dashboard and builder. They must stay. Only `legacy-index.html` (old home page with old pricing) was retired to a redirect. |
| P1-9 | No backup/restore procedure for the `auradigital-db` D1 database is documented or tested. |

### P2 — improvement
- No restaurant analytics (views, scans, clicks).
- No menu version history / rollback beyond `revision` counter.
- QR customisation (colours, logo, SVG, table QR) not in Studio.
- NFC product ordering not in Studio (prices approved: Review card 600 TL, table card 200 TL, 10-table pack 1,500 TL).
- Auri has no AuraMenu tools.
- Design gallery thumbnails were made before French and show "FR" as greyed.

### P3 — future
- French dish-text editor in builder/Studio (backend stores `fr` since 2026-11-27).
- Payment provider integration (requires authorization).
- 3D product presentations beyond current premium effects.
