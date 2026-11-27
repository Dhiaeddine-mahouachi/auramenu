# AuraMenu architecture (as of 2026-11-27)

## Sprint A updates · 2026-11-28

AuraDigital customer identity handles verification and Google/email sign-in. Studio's current `/signin.html` exchanges an AuraDigital one-time PKCE code for an AuraMenu host-only session. The same AuraDigital Worker serves Studio and AuraHub menu records using D1. The AuraMenu domain's existing `aurapops` edge route forwards `/api/auramenu/*` and serves legacy account paths. GitHub Pages is the HTML origin for restaurant slugs. Scope and open routing work are listed in [Sprint A progress](SPRINT_A_PROGRESS.md).

The baseline has per-menu ownership, owner/manager/editor access, and account-scoped builder drafts. The Sprint A branch adds atomic account ownership on signup-authenticated menu submissions and a publish action after manual activation. AuraHub's menu screen consumes the same list; restaurant/workspace ownership consolidation remains tracked in the master backlog.

The diagram below describes the Sprint 0 baseline at the time it was written.

```
Guest phone ──QR/NFC──> auramenu.space/<slug>
                          │  (Cloudflare zone; GitHub Pages origin serves 404.html → menu.js)
                          │  unknown CF worker owns /login*, /brand/*        [BLK-2]
                          ▼
              menu.js ──GET /api/auramenu/sites/<slug>──> auradigital worker ──> D1 auradigital-db
                 │                                                (auramenu_requests, auramenu_design_settings,
                 └─ iframe menu-v2.html?design=<std-NN|pre-NN>     auramenu_billing, auramenu_edit_access,
                    (engine.js renders all 30 designs)             auramenu_images, menu_drafts …)
Owner: builder.html ──POST /api/auramenu/requests──> worker (creates request + menu token)
       studio.html / dashboard.html ──/api/auramenu/dashboard/:id (X-Aura-Menu-Token)──> worker
       signin.html ──/api/aurapops/account/*──> aurapops worker (separate account DB)   [P0-1]
Admin: auradigitalworks.com admin ──/api/auramenu admin routes──> worker (approve, payment, renew)
AuraHub: auradigitalworks.com/hub ──/api/hub/*, /api/customer/* (Google OIDC)──> auradigital worker
```

## Repositories
| Repo | Contents | Deploy |
|---|---|---|
| `auramenu` | Static site: marketing, SEO pages, builder, Studio, menu engine (`menu-v2/`), assets (`am2/`, `media/`, `fonts/`) | GitHub Actions → GitHub Pages on push to `main` (`docs/`, `tests/` excluded) |
| `auradigital` | Cloudflare Worker `auradigital`: AuraMenu API, AuraHub, customer identity, admin, Auri, D1 schema | Push to `main` → sync workflow → Cloudflare build |
| `aurapops` | AuraPops worker incl. `/api/aurapops/account/*` used by AuraMenu sign-in | Deployed separately (repo last pushed 2026-09-29; live worker 2026-10-15) |

## Data model (AuraMenu)
- `auramenu_requests` — one row per menu: slug, template_id, business fields, `categories_json`, status, payment_status, revision.
- `auramenu_design_settings.presentation_json` — `restaurant` (links, logo, cover, video, hours) + `design` (colours, toggles).
- Item metadata inside `categories_json`: translations (en/tr/ar/fr), available (true/false/"limited"), allergens, ingredients, variants, imageSmall.
- `auramenu_billing` — plan, amount, paid_until. `auramenu_edit_access` — hashed menu token, access window.
- Designs: `std-01…15` (standard), `pre-16…30` (premium, needs grant). Legacy `modern|orbit|maison|taste3d` still render.

## Front-end conventions
- Site assets live in `am2/` (not `brand/` — owned by the edge worker). Sign-in at `/signin.html`.
- Asset links carry `?v=N`; bump on change (edge caches 10 min).
- SEO pages are generated (`seo.py`, `seo_more.py`, `partials.py`; kept outside the repo during this session — move into `tools/` next).
- Public menus register `/menu-sw.js` (network-first offline copy, menu files only).
