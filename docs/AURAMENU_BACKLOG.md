# AuraMenu backlog

Source of truth for AuraMenu work. Read this first each session; update status, commit.
Status: `todo` · `doing` · `done` · `blocked`. Findings reference `HEALTH_AUDIT.md`.

## Blockers (need a decision, credentials or access)

| ID | Blocker | Owner | Unblocks |
|---|---|---|---|
| BLK-1 | Decide account unification: AuraMenu moves to AuraDigital `/api/customer` identity. What happens to users who only have AuraPops accounts (migrate by verified email? ask them to sign in with Google/AuraDigital?). AuraPops is a separate product — do not change it without approval. | Dhia | A-1…A-4 |
| BLK-2 | Which Cloudflare worker/route serves `auramenu.space/login*` and `/brand/*`? Its code is not in GitHub. Needed to serve `/<slug>` with 200 + meta and to fix `/login`. | Dhia | S-1, S-2 |
| BLK-3 | ~~Confirm pricing~~ Resolved 2026-11-27: Annual 2,500 TL/year. Open detail: does Annual include premium designs? | Dhia | P-2 |
| BLK-4 | Payment provider: none integrated; activation is manual by admin. Choose provider + authorize before any payment work. | Dhia | P-4 |
| BLK-5 | Read access to the production D1 database was refused in this environment; backups/restores must be run by Dhia or an authorized CI job. | Dhia | R-1, R-2 |

## Backlog

| ID | P | Task | Depends | Acceptance criteria | Status |
|---|---|---|---|---|---|
| S0-1 | P0 | Technical audit + docs (this set) | — | All Sprint 0 docs exist and reflect real code | done |
| S-1 | P0 | Serve `/<slug>` with HTTP 200, title, description, Open Graph and Restaurant JSON-LD | BLK-2 | `curl -I auramenu.space/<slug>` → 200; WhatsApp preview shows name | blocked |
| S-2 | P1 | Fix or retire `/login` on auramenu.space (redirect to `/signin.html`) | BLK-2 | `/login` → 301 `/signin.html` | blocked |
| S-3 | P1 | Security headers for site pages (CSP, HSTS, XFO, Referrer-Policy) | BLK-2 or Cloudflare Transform Rule | securityheaders scan ≥ A, no console CSP errors | todo |
| S-4 | P1 | Remove unused pages — audit corrected: legacy design pages are live dependencies; only `legacy-index.html` retired | — | Old menus still render | done |
| S-5 | P2 | Regenerate gallery thumbnails with French enabled | — | No greyed "FR" in thumbnails | todo |
| A-1 | P0 | AuraMenu sign-in/registration on AuraDigital customer identity (OIDC/PKCE between auramenu.space and auradigitalworks.com; no shared cookies) | BLK-1 | One login works on both; Google sign-in same account | blocked |
| A-2 | P0 | Bind menus to `workspace_id` + `user_id`; keep menu token as legacy claim | A-1 | Owner opens menu on a new device after sign-in | blocked |
| A-3 | P1 | Roles owner/manager/editor via existing hub workspace authorize() | A-2 | Editor cannot change plan; isolation test passes | blocked |
| A-4 | P1 | "My menus" list in Studio + AuraHub `apps/auramenu` (validate route: hub lives at `auradigitalworks.com/hub`) | A-2 | Same data from both entry points | blocked |
| D-1 | P1 | Enable cloud drafts (`MENU_DRAFTS_ENABLED`) for builder with autosave + save indicator | A-2 | Refresh/new device keeps draft | blocked |
| D-2 | P2 | Version history + restore published version | D-1 | Restore previous version works | todo |
| M-1 | P1 | Edge-cache public menu API (short TTL) + purge on publish | — | Second scan served from cache; edit visible ≤ 60 s | done (verify live `X-Menu-Cache`) |
| M-2 | P1 | Move menu images to R2 | R2 bucket approval | Uploads in R2, old images still load | todo |
| Q-1 | P2 | Studio QR: colours (contrast-checked), logo, PNG+SVG, table QR (`?t=12`) | — | Downloads scan on iOS + Android | todo |
| Q-2 | P2 | NFC product requests in Studio at approved prices (600 / 200 / 1,500 TL) | — | Request reaches admin with menu id | todo |
| W-1 | P2 | WhatsApp: dine-in/takeaway switch, variants/extras in message, price re-validation, `?t=` table id | — | Message lists variant, extra, table | todo |
| N-1 | P2 | Privacy-conscious analytics (views, scans, clicks) + Studio charts | A-2 | Counts match a scripted test visit | todo |
| AU-1 | P2 | Auri AuraMenu tools with confirmation + audit log | A-3 | Auri cannot touch another workspace | todo |
| P-1 | P0 | Pricing switched to Standard/Premium/Annual on site, builder, SEO and backend; single generated source still todo | — | One config; site text generated from it | doing |
| P-2 | P1 | Server-side premium entitlement from billing plan (replace env list) | BLK-3 | Standard plan cannot publish pre-* | blocked |
| P-4 | P2 | Payment provider + webhooks | BLK-4 | Signed webhook verified in test | blocked |
| L-1 | P2 | French dish-text editor in builder/Studio | — | `fr` saved and shown | todo |
| R-1 | P1 | Documented + tested D1 backup/restore into an isolated DB | BLK-5 | Restore test report | blocked |
| R-2 | P2 | Health checks + failed-publish alerts | — | Alert fires in test | todo |
