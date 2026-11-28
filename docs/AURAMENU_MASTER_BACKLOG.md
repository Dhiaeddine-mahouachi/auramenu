# AuraMenu master backlog

Updated 2026-11-28 (Europe/Istanbul), Sprint A.3. This is the authoritative backlog. It reconciles the original 90 rows from local branch `development/auramenu-2` (`36ae2c7`, `docs/AURAMENU_2.0_BACKLOG.md`), the 25 work items in [the previous backlog](AURAMENU_BACKLOG.md), and the Sprint A requirements. The original design counts were 25 and 10 Premium. The accepted scope is now 30 and 15 Premium.

Baseline refs are AuraMenu `f8a0d71` and AuraDigital `4539927`. `(AD)` refers to AuraDigital. Historical evidence is identified where applicable. **TESTED** means the specific test listed passed in its stated environment. **PRODUCTION VERIFIED** requires a direct production check of the acceptance criterion. Passing narrow tests does not close the broader staging or release gate.

Deployment states used below are `Baseline` (feature exists on the baseline, current production acceptance may still be pending), `Branch` (Sprint A development only), `Live-checked` (directly observed), and `Pending` (no confirmed implementation or deployment). See [progress](SPRINT_A_PROGRESS.md) and [test evidence](SPRINT_A_TEST_REPORT.md).


## Project protection

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-00 | A1 | P0 | Create development branch | — | TESTED | Branch | Create isolated branches in both repos and verify their heads. | Git branch and workflow inspection | 36ae2c7 | — |
| AM-01 | A1 | P0 | Audit repository and architecture | AM-00 | TESTED | Pending | Map live hosting, identity, API, storage and deployment owners. | Read-only Cloudflare and Git checks | 71b0fa8 | Retain inventory with future changes. |
| AM-02 | A1 | P0 | Back up database/config and test recovery | AM-01 | BLOCKED | Pending | Restore an encrypted, authorized backup into an isolated database and verify a public-menu sample. | Recovery drill and runbook | 71b0fa8 | Run full staging copy drill. |
| AM-03 | A1 | P1 | Inventory 25 templates | AM-01 | TESTED | Baseline | Inventory each of the current 30 IDs and the four legacy templates. | Current gallery and 30-design browser matrix | 0719048 | Keep IDs stable for existing menus. |
| AM-04 | A1 | P0 | Audit core workflows | AM-01 | IMPLEMENTED | Baseline | Exercise sign-in, editor, backend approval, publication and Hub with the same test restaurant. | Worker/API and browser fixtures | 078e0ad | Complete provider-backed staging flow. |
| AM-05 | A1 | P1 | Measure performance baseline | AM-03 | TESTED | Branch | Record repeatable lab and p75 field LCP, INP and CLS. | Sofra 3.348 s before and 1.840 s after under the same local profile | AuraMenu A.2 | Collect deployed field data |
| AM-06 | A1 | P0 | Create isolated staging | AM-00, AM-02 | TESTED | Branch | Stage both origins using isolated app bindings and a dedicated D1 database. | Staging frontend and dedicated D1 binding packaged and Wrangler dry runs passed | AuraMenu and AuraDigital A.2 | Authenticated remote staging deployment |
| AM-07 | A1 | P1 | Establish engineering docs | AM-01 | TESTED | Pending | Document architecture, ownership, test scope, deployments and recovery. | Reviewed engineering docs | 71b0fa8 | Keep documents current at each deployment. |

## Brand identity

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-08 | Brand | P2 | Finalize logo variants | AM-00 | IMPLEMENTED | Baseline | Inventory approved mark and favicon variants. | Brand assets and HTML references | 0719048 | Record design approval and variant usage. |
| AM-09 | Brand | P2 | Establish accessible palette | AM-08 | IMPLEMENTED | Baseline | Verify AA contrast on every approved design and both themes. | 60/60 automated guest axe scans after contrast corrections | 1c0a456 | Run keyboard and physical-device accessibility checks. |
| AM-10 | Brand | P2 | Typography incl. Arabic | AM-09 | IMPLEMENTED | Baseline | Verify Arabic glyphs, font fallbacks and retained font licenses. | Arabic renders in current matrix | 0719048 | Check glyph coverage across reference devices. |
| AM-11 | Brand | P2 | Create signature graphic motifs | AM-08 | IMPLEMENTED | Baseline | Use approved motifs consistently across the existing public UI. | Homepage and brand asset inventory | 0719048 | Record visual acceptance. |
| AM-12 | Brand | P2 | Develop original mascot | AM-08 | IMPLEMENTED | Baseline | Verify original mascot states and reduced-motion behavior. | Brand assets and historical checkpoint | 0719048 | Exercise all motion states. |
| AM-13 | Brand | P3 | Photography guidelines | AM-08 | NOT STARTED | Pending | Publish shot, crop and asset-format guidelines. | No reviewed guide located | — | Define and approve guidance. |
| AM-14 | Brand | P3 | Brand voice | AM-08 | NOT STARTED | Pending | Agree writing and localization rules for the brand. | No reviewed guide located | — | Record approved voice. |
| AM-15 | Brand | P3 | Brand guidelines | AM-08–AM-14 | NOT STARTED | Pending | Publish approved brand asset and usage guide. | Implementation assets reviewed | — | Assemble and approve guide. |

## UI system

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-16 | UI | P2 | Central design tokens | AM-09 | IMPLEMENTED | Baseline | Reference common tokens in the public UI and verify approved styling. | Brand styles reviewed | 0719048 | Audit remaining duplicates. |
| AM-17 | UI | P2 | Buttons/navigation | AM-16 | IMPLEMENTED | Baseline | Validate keyboard, focus and responsive navigation. | Mobile home smoke passes | 0719048 | Complete keyboard and tablet coverage. |
| AM-18 | UI | P1 | Forms/validation | AM-16 | IMPLEMENTED | Baseline | Validate errors, focus and field recovery on real submission. | Builder and Worker fixtures | 078e0ad | Complete staged submission flow. |
| AM-19 | UI | P2 | Cards and food components | AM-16 | IMPLEMENTED | Baseline | Render shared card patterns at each target size. | 720 render checks and product-detail smoke | 0719048 | Complete empty and loaded visual review. |
| AM-20 | UI | P2 | Accessible dialogs/notifications | AM-16 | IMPLEMENTED | Baseline | Verify focus trap, recovery, announcements and dismissal. | Product-detail smoke | 0719048 | Test keyboard and screen reader flows. |
| AM-21 | UI | P2 | Icon system | AM-16 | IMPLEMENTED | Baseline | Inventory icons and check contrast and accessible names. | Feature and guest engine icon assets reviewed | 71b0fa8 | Audit semantic labels. |
| AM-22 | UI | P2 | Persistent light/dark theme | AM-16 | IMPLEMENTED | Baseline | Persist theme across refresh in all supported interfaces. | Menu mode toggle and both theme renders | 0719048 | Verify persistence outside guest engine. |
| AM-23 | UI | P3 | Component showcase | AM-16–AM-22 | NOT STARTED | Pending | Provide a component showcase with approved states. | No dedicated public UI showcase located | — | Confirm scope for existing assets. |

## Public website

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-24 | Public | P1 | Responsive navigation | AM-17 | TESTED | Baseline | Home navigation fits supported screens and languages. | Existing TR/EN/AR mobile smoke | f8a0d71 | Check full keyboard navigation separately. |
| AM-25 | Public | P2 | Homepage hero | AM-08 | TESTED | Baseline | Preserve current hero and render on mobile. | Homepage smoke on current branch | f8a0d71 | Record visual approval across sizes. |
| AM-26 | Public | P2 | Feature demos | AM-25 | IMPLEMENTED | Baseline | Render feature demonstrations with usable links. | Public homepage and asset inventory | 71b0fa8 | Check interactive demonstrations. |
| AM-27 | Public | P2 | Collection showcase | AM-25, AM-32 | TESTED | Baseline | Launch the public collection from the homepage. | Home/gallery smoke | f8a0d71 | Retest after future navigation edits. |
| AM-28 | Public | P0 | Verified pricing | P-1, P-2 | IMPLEMENTED | Baseline | Match approved prices and tiers across public, Studio, Hub and publishing flows. | Pricing API and Worker plan suites | eac8e29 | Generate static copy from canonical catalogue. |
| AM-29 | Public | P2 | Industry sections | AM-25 | IMPLEMENTED | Baseline | Verify industry-specific content routes and links. | SEO page inventory and historical smoke | 71b0fa8 | Check localized copy and destinations. |
| AM-30 | Public | P1 | Contact/onboarding | AM-18, A-1 | IMPLEMENTED | Baseline | Submit valid onboarding details and show usable next steps. | Builder/Worker fixture | 276e008 | Exercise real account and email delivery in staging. |
| AM-31 | Public | P1 | SEO and multilingual RTL | S-1, L-1 | IMPLEMENTED | Baseline | Verify canonical metadata, localization and full Arabic RTL. | Guest RTL matrix and public route smoke | 71b0fa8 | Fix published slug status and metadata. |

## Public gallery

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-32 | Gallery | P1 | Public gallery of 25 | AM-03 | TESTED | Baseline | Show all 30 templates and launch live previews from cards. | Current gallery browser smoke | 0719048 | Keep 15+15 split. |
| AM-33 | Gallery | P2 | Actual template thumbnails | AM-32 | IMPLEMENTED | Baseline | Use a matching screenshot for every gallery preview and language labels. | Gallery assets verified in source | 0719048 | Refresh thumbnails that still show French disabled. |
| AM-34 | Gallery | P2 | Filters | AM-32 | TESTED | Baseline | Filter into exactly 15 Standard and 15 Premium templates. | Gallery browser smoke | 0719048 | — |
| AM-35 | Gallery | P1 | Interactive public preview | AM-32 | TESTED | Baseline | Open a working interactive preview before choosing a design. | Gallery dialog smoke | 0719048 | — |
| AM-36 | Gallery | P2 | Device/theme/language controls | AM-35 | IMPLEMENTED | Baseline | Switch preview size, theme and language with the selected design retained. | Menu viewport and theme matrix | 0719048 | Exercise every gallery control. |
| AM-37 | Gallery | P1 | Want this design CTA | AM-35 | TESTED | Baseline | Require explicit choice before opening the builder with its selected tier. | Gallery smoke keeps user on preview before selection | 0719048 | — |
| AM-38 | Gallery | P1 | Retain template ID in request flow | AM-37, P-2 | IMPLEMENTED | Baseline | Persist selected ID from gallery link through draft, request and approval. | Gallery URL and Worker plan tests | 0ab41d1 | Run joined staging flow. |
| AM-39 | Gallery | P0 | Server-side premium entitlement | P-2 | TESTED | Branch | Enforce Standard/Annual and Premium tiers in server mutations and approval. | Plan and admin approval tests | 4539927 (AD) | Deploy after isolated acceptance; preserve legacy. |

## Templates

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-40 | A9 | P1 | Audit 15 standard | AM-03 | TESTED | Baseline | Render, browse and validate 15 Standard designs. | 720 matrix plus guest-feature smoke | 0719048 | Physical-device validation tracked under AM-84. |
| AM-41 | A9 | P1 | Audit 10 premium | AM-03 | TESTED | Baseline | Render, browse and validate all 15 current Premium designs. | 720 matrix plus guest-feature smoke | 0719048 | Physical-device validation tracked under AM-84. |
| AM-42 | A9 | P2 | Large product imagery | AM-40, AM-41 | IMPLEMENTED | Baseline | Verify sharp images and bounded mobile downloads with fallback art. | Local asset matrix without failed HTTP responses | 0719048 | Measure production payloads and missing-photo states. |
| AM-43 | A9 | P2 | Distinct typography | AM-40, AM-41 | IMPLEMENTED | Baseline | Verify appropriate fonts and readable hierarchy per design. | 30 designs render at target widths | 0719048 | Complete visual acceptance. |
| AM-44 | A9 | P2 | Curated colors | AM-40, AM-41 | IMPLEMENTED | Baseline | Verify theme contrast and palette in light and dark variants. | 720 render checks and 60 guest axe scans | 1c0a456 | Run manual contrast and keyboard checks. |
| AM-45 | A9 | P2 | Shared functional components | AM-40, AM-41 | TESTED | Baseline | Exercise shared categories, details, cart, search and restaurant links. | Guest-feature browser suite | 0719048 | Device scans and ordering acceptance tracked elsewhere. |
| AM-46 | A9 | P2 | Single light/dark toggle | AM-22 | TESTED | Baseline | Render one working theme toggle in each design. | Guest interaction smoke and 720 matrix | 0719048 | — |
| AM-47 | A9 | P2 | Five immersive designs plus fallback | AM-41 | IMPLEMENTED | Baseline | Verify five immersive treatments with reduced-motion fallback. | Premium designs render in reduced-motion matrix | 0719048 | Exercise 3D, performance and no-GPU behavior. |
| AM-48 | A9 | P0 | Versioning protects live menus | D-2 | TESTED | Branch | Keep a restorable menu snapshot and its images after each publish. | Version snapshots, retained images and an atomic restore verified in local tests | AuraDigital 092edae | Verify against staged traffic and approved backup |

## Studio

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-49 | A3 | P1 | Responsive Studio shell | A-1 | IMPLEMENTED | Baseline | Render Studio with accessible navigation on desktop, tablet and phone. | Studio shell and existing smoke evidence | 078e0ad | Run authenticated responsive Studio test. |
| AM-50 | A3 | P2 | Real overview metrics | N-1 | NOT STARTED | Pending | Show tenant-scoped verified activity metrics in Studio. | No production analytics path verified | — | Implement and validate counts. |
| AM-51 | A3 | P0 | Menu management | A-2, A-4 | TESTED | Branch | Expose same account-owned menus in Studio and Hub, including new submissions. | Both lists match in Worker test | bde8f8d (AD) | Verify through live-like cross-origin routing. |
| AM-52 | A3 | P1 | Product editor | AM-51 | IMPLEMENTED | Baseline | Save prices, availability, images and optional localized product fields. | API lifecycle fixture | a43966d (AD) | Exercise editor interactions and French dish text. |
| AM-53 | A3 | P1 | Category management | AM-51 | IMPLEMENTED | Baseline | Add, reorder and remove categories without losing unrelated items. | Worker content tests and builder controls | 078e0ad | Exercise full edit lifecycle across devices. |
| AM-54 | A3 | P1 | Restaurant profile | AM-51 | IMPLEMENTED | Baseline | Persist restaurant details and expose approved public fields only. | Fixture coverage for manager save and metadata | bde8f8d (AD) | Review cross-device Studio profile edits. |
| AM-55 | A3 | P1 | Account/subscription settings | AM-51, P-2 | IMPLEMENTED | Baseline | Show verified identity and correct billing state for authorized users. | Worker role and billing tests | 4539927 (AD) | Check plan display and renewal in authenticated browser. |
| AM-56 | A3 | P1 | Mobile dashboard | AM-49 | IMPLEMENTED | Baseline | Use Studio touch controls with no clipping, scrolling traps or keyboard obstruction. | Public Studio shell renders | 078e0ad | Test authenticated Studio on physical phones. |

## Visual editor

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-57 | A7 | P1 | Live preview | AM-38 | TESTED | Baseline | Render actual selected template and edited content in preview. | Gallery smoke and builder tests | 0719048 | Keep old and new template paths covered. |
| AM-58 | A7 | P2 | Brand customization | AM-57 | IMPLEMENTED | Baseline | Persist logo, palette and theme using the same preview and public data. | Design settings covered in API suite | a43966d (AD) | Compare saved editor options to staged publication. |
| AM-59 | A7 | P1 | Image crop/optimization | AM-52, M-2 | IMPLEMENTED | Baseline | Validate upload limits, optimize asset size and retain approved image crops. | Worker test verifies image visibility after approval | a43966d (AD) | Add browser crop and larger-image coverage. |
| AM-60 | A7 | P2 | Responsive preview | AM-57 | IMPLEMENTED | Baseline | Preview same menu in phone and wide modes with no overflow. | 720 guest render checks | 0719048 | Exercise visual editor toggle end to end. |
| AM-61 | A7 | P0 | Autosave and recovery | D-1 | TESTED | Branch | Recover from offline startup, a new device and a revision conflict. | Cloud draft browser and Worker tests | bde8f8d (AD) | Verify browser closure and expiry in staging. |
| AM-62 | A7 | P0 | Safe template switching | P-2 | TESTED | Branch | Allow eligible switching, preserve existing published template when a save fails. | Plan/admin and lifecycle API tests | 4539927 (AD) | Verify production rollout with protected legacy slugs. |
| AM-63 | A7 | P0 | Publish/history/rollback | AM-48, AM-62 | IN DEVELOPMENT | Pending | Publish and restore previous versions without losing working content. | Approval and failed-save behavior tested | 4539927 (AD) | Implement revision snapshots, restoration and asset retention. |

## Guest experience

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-64 | A9 | P0 | Immediate menu access | S-1 | BLOCKED | Pending | Return HTTP 200, metadata and menu content for every published QR slug. | Live /moka is 404, public API is 200 | — | Approve AuraMenu-scoped edge handler. |
| AM-65 | A9 | P1 | Categories/search | AM-45 | TESTED | Baseline | Search by product and render categories without lost scrolling. | 30-design feature smoke | 0719048 | Verify touch interactions on real hardware. |
| AM-66 | A9 | P1 | Product details/allergens | AM-45 | TESTED | Baseline | Show item details, allergens and availability. | All 30 expose details and allergen UI | 0719048 | Test localized customer-entered data. |
| AM-67 | A9 | P1 | Ordering integration | W-1 | IMPLEMENTED | Baseline | Share correct selections, quantities and prices via WhatsApp. | Cart UI and outbound link construction verified in source | 0719048 | Test full outbound payload and variants. |
| AM-68 | A9 | P2 | Location/contact | AM-45 | TESTED | Baseline | Show valid location links, hours and restaurant contact controls. | 30-design directions and hours smoke | 0719048 | Verify actual location on test restaurant. |
| AM-69 | A9 | P2 | Reviews/socials | AM-45 | TESTED | Baseline | Render review, Maps and social links for each layout. | 30-design guest smoke | 0719048 | Confirm custom review destinations in staging. |
| AM-70 | A9 | P3 | Optional lazy-loaded Snake | AM-45 | TESTED | Baseline | Load optional Snake on first interaction. | Browser game lazy-load passes | 0719048 | — |
| AM-71 | A9 | P2 | Discreet AuraMenu signature | AM-08, AM-45 | IMPLEMENTED | Baseline | Show an approved discreet AuraMenu attribution across templates. | Guest footer implementation | 0719048 | Confirm visual acceptance across themes. |

## QR and NFC

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-72 | A8 | P1 | QR management | Q-1, S-1 | IMPLEMENTED | Baseline | Download QR to the correct unchanged slug and scan on two mobile OSes. | Builder QR and route smoke | 0719048 | Run physical scans. |
| AM-73 | A8 | P2 | Branded QR customization | Q-1 | NOT STARTED | Pending | Manage contrast, logo and safe printed quiet zones. | Studio customization pending | — | Implement and scan physical outputs. |
| AM-74 | A8 | P2 | Print-ready table stands | Q-1, Q-2 | NOT STARTED | Pending | Export print-ready stands with usable per-table routing. | Existing per-menu QR UI only | — | Add table-ready layouts and validate print. |
| AM-75 | A8 | P0 | Stable NFC URLs | S-1 | BLOCKED | Pending | Open existing NFC URLs with HTTP 200 and stable menu data. | Legacy/API behavior sampled; slug currently 404 | — | Test physical cards after route fix. |
| AM-76 | A8 | P2 | Physical preview | Q-1, Q-2 | NOT STARTED | Pending | Preview branded card or table stand at production dimensions. | No Studio physical preview verified | — | Add accurate previews. |
| AM-77 | A8 | P2 | PNG/SVG/PDF export | Q-1 | NOT STARTED | Pending | Export valid PNG, SVG and PDF versions and decode each. | Existing PNG QR downloads only | — | Implement SVG/PDF and test. |

## QA

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-78 | A9 | P0 | Authentication/authorization | A-1, A-3 | IMPLEMENTED | Baseline | Test interactive identity and server permissions end to end. | PKCE, session and role tests | 98a2be4 (AD) | Run real email, password recovery and Google staging tests. |
| AM-79 | A9 | P0 | Tenant isolation | A-2, A-3 | IMPLEMENTED | Baseline | Verify isolation for all menu, draft, image, billing and team actions. | Worker owner/team/draft and image lifecycle tests | bde8f8d (AD) | Complete image and billing coverage with two restaurants at staging. |
| AM-80 | A9 | P1 | Optimize assets/cache | M-1, M-2 | TESTED | Branch | Profile real guest URLs and avoid repeated D1 requests or oversized assets. | Early discovery and responsive hero image put Sofra below its lab target | AuraMenu A.2 | Verify field performance and deployed cache |
| AM-81 | A9 | P2 | Lazy-load motion/3D/games | AM-47 | TESTED | Baseline | Demonstrate deferred game and reduced-motion rendering. | 720 render checks and guest game test | 0719048 | Measure deferred 3D and motion asset costs. |
| AM-82 | A9 | P1 | Accessibility RTL/reduced motion | AM-22, AM-31 | IMPLEMENTED | Baseline | Verify meaningful labels, keyboard focus, RTL and reduced motion across guest and operator surfaces. | Current RTL/reduced-motion matrix and historical axe results | 0719048 | Full current accessibility and keyboard audit. |
| AM-83 | A9 | P0 | Regression tests | AM-03, AM-82 | TESTED | Branch | Run current and legacy suites with documented device and route coverage. | 720 current layouts, 60 accessibility cases and 900 legacy Chromium combinations | AuraMenu A.2 | Run physical-device and deployed acceptance |
| AM-84 | A9 | P1 | Cross-device/load tests | AM-05, AM-79 | IMPLEMENTED | Baseline | Verify concurrency, real mobile browsers and repeatable load baseline. | Draft concurrency and viewport tests | bde8f8d (AD) | Run iOS/Android cameras and staged load testing. |

## Release

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| AM-85 | A10 | P0 | Staging acceptance | AM-06, AM-78–AM-84 | BLOCKED | Pending | Complete provider-backed staging acceptance with one synthetic restaurant and approved admin. | Local fixtures and D1 staging inventory | 52a26b1 (AD) | Provide authorized test identities and full staged origins. |
| AM-86 | A10 | P0 | Existing customer compatibility | AM-48, AM-75 | IMPLEMENTED | Baseline | Open established menu URLs and retain paid one-time contracts. | Live API sample and legacy template/contract fixtures | 4539927 (AD) | Check physical QR/NFC after correcting slug routing. |
| AM-87 | A10 | P0 | Migration/rollback | AM-02, AM-06 | IMPLEMENTED | Baseline | Rehearse code rollback and data recovery in staging. | Documented procedures and synthetic D1 drill | 71b0fa8 | Verify application recovery from authorized staging export. |
| AM-88 | A10 | P0 | Progressive deploy | AM-85–AM-87 | BLOCKED | Pending | Release with rollback, public-menu probes and controlled staging promotion. | Current production branch/workflow inspection | 52a26b1 (AD) | Resolve P0s and verify rollout before promotion. |
| AM-89 | A10 | P0 | Final audit | AM-85–AM-88 | IN DEVELOPMENT | Pending | Review release gates and report open issues with fresh evidence. | Sprint A progress and test report | 71b0fa8 | Close release blockers and verify production. |

## Sprint 0 backlog and Sprint A requirements

| ID | Sprint | Priority | Task | Dependencies | Status | Deployment | Acceptance | Evidence | Relevant commit | Remaining work |
|---|---|---|---|---|---|---|---|---|---|---|
| S0-1 | A1 | P0 | Technical audit and engineering records | AM-01 | TESTED | Branch | Recover all 90 original rows, track each later requirement and reconcile discrepancies | Original local file and Git history; this ledger | 71b0fa8 | Maintain release evidence |
| S-1 | A8 | P0 | Serve published slugs with the right status and metadata | AM-06 | TESTED | Branch | Same public slug returns 200 with title, description, canonical, Open Graph, share image when available and Restaurant JSON-LD | Local edge tests cover stage routing, published/unpublished status, metadata, preserved QR aliases and upstream failure | AuraMenu A.2 | Deploy staged Worker and complete approved ingress promotion |
| S-2 | A8 | P1 | Retire the older login entry | A-1, NA-1 | IMPLEMENTED | Branch | `/login`, `/login/`, `/login.html` 301 to `/signin.html` with the query kept; non-GET untouched; AuraPops routes untouched | Edge tests (A.3) | be6dd03 | Takes effect only when the AuraMenu edge Worker owns these paths in production (BLK-2) |
| S-3 | A8 | P1 | Add site HTML security headers | S-1 | NOT STARTED | Pending | CSP, HSTS, frame and referrer controls pass without blocking approved embeds and assets | API policy exists; static site header smoke | 71b0fa8 | Test staged report-only policy and rollout |
| S-4 | A8 | P1 | Retire obsolete pages with compatibility preserved | AM-86 | TESTED | Baseline | Preserve legacy renderers and current URL formats | Legacy renderer fixture and audit; retired landing redirect exists | 71b0fa8 | Recheck established QR/NFC links |
| S-5 | A9 | P2 | Refresh French gallery thumbnails | AM-33 | NOT STARTED | Pending | All gallery thumbnails show the current French capability | Guest language matrix passes; static assets await refresh | — | Regenerate gallery images |
| A-1 | A2 | P0 | Unified AuraDigital identity | AM-06 | IMPLEMENTED | Baseline | Email and Google sign-in, verification, recovery, cross-origin PKCE, expiry, logout and multi-device access | Local connect and identity tests; live signed-out session endpoint | 98a2be4 (AD) | Authorized email, Google and inbox access for full staging flow |
| A-2 | A3 | P0 | Link menus to signed-in AuraDigital accounts | A-1 | TESTED | Branch | New signed-in submissions appear immediately in Studio and Hub; older token claims preserve existing owner | Worker owner tests | d17d8fd (AD) | Verify routing sends the session correctly in staging |
| A-3 | A4 | P0 | Apply owner, manager and editor permissions | A-2 | TESTED | Branch | Owner manages plan/team; staff retain allowed roles; removed staff lose access | Worker role, team, revocation and mutation tests | d17d8fd (AD) | Complete live-like two-restaurant and staff browser verification |
| A-4 | A3 | P1 | Studio and AuraHub read the same menus | A-2 | TESTED | Branch | Both menu lists match for a single signed-in account | Worker returns identical lists for Studio and Hub | d17d8fd (AD) | Verify authenticated browser synchronization |
| D-1 | A7 | P0 | Versioned account cloud drafts | A-1 | TESTED | Branch | Offline startup preserves local content, refresh restores it, and stale writes require explicit conflict resolution | Browser recovery and concurrent D1 fixture tests | a4b8a63 (AD) | Verify expired sessions and multiple physical devices against staging |
| D-2 | A7 | P1 | Published revision history and restoration | D-1, M-2 | TESTED | Branch | Restore previously published content and all referenced images without breaking the live revision | Worker snapshot and restore tests cover prior images and stale revision rejection. Studio preview and restore have browser coverage. | AuraDigital 092edae and AuraMenu A.2 | Run authorized integrated staging acceptance and monitor image retention |
| M-1 | A9 | P1 | Public menu cache and invalidation | S-1 | IMPLEMENTED | Baseline | Warm request reuses cached menu; edit purges the entry and reaches guests within 60 s | Worker cache tests and live read-only API response | 8707f94 (AD) | Exercise timed misses, hits and publish invalidation on staging |
| M-2 | A10 | P1 | Move menu images to R2 compatibly | AM-59 | BLOCKED | Pending | Old D1 image URLs still work; new objects use an authorized R2 bucket | Cloudflare R2 bucket API reports R2 disabled | — | Enable R2 and authorize an isolated bucket |
| Q-1 | A8 | P2 | Branded QR, PNG/SVG and table links | S-1 | IMPLEMENTED | Baseline | Output formats and per-table URLs decode on two operating systems | Existing PNG path and builder QR URL checks | 0719048 | Add SVG/table management and physical scan coverage |
| Q-2 | A3 | P2 | Studio NFC product requests at 600/200/1,500 TL | AM-51 | NOT STARTED | Pending | Admin receives an accurate itemized request tied to the menu | Current Studio links to AuraDigital NFC | — | Implement Studio request handling and confirm catalog pricing |
| W-1 | A9 | P2 | WhatsApp ordering details and table context | AM-67 | IMPLEMENTED | Baseline | Confirm selected variants, extras, prices and table ID in guest message | Browser cart smoke and source check | 0719048 | Add dine-in/takeaway and verify payload in staging |
| N-1 | A3 | P2 | Privacy-conscious menu analytics | A-2 | NOT STARTED | Pending | Tenant-scoped views, scans and clicks match a deterministic test | No reviewed production path | — | Add event model and Studio metrics |
| AU-1 | A3 | P2 | Authorized AuraMenu tools for Auri | A-3, N-1 | NOT STARTED | Pending | Explicit confirmation and auditable workspace-scoped operations | No reviewed tool integration | — | Implement after role acceptance |
| P-1 | A6 | P0 | Use one authoritative pricing catalogue | AM-28 | IN DEVELOPMENT | Branch | Standard 399 TL/month, Premium 599 TL/month, Annual 2,500 TL/year agree across API, Studio, Hub, static and SEO | Live pricing API plus Worker pricing tests | 555caee (AD) | Homepage and builder consume the API. Generate static fallback, FAQ and SEO amounts from the same catalogue. |
| P-2 | A6 | P0 | Enforce publication plan entitlement | A-3 | TESTED | Branch | Standard and Annual cannot select or publish Premium. Legacy one-time grants retain their terms | Worker plan, approval and legacy contract fixtures | 5de1c8b (AD) | Verify customer and admin publication on staged origins |
| P-4 | A6 | P2 | Payment provider and webhooks | BLK-4 | BLOCKED | Pending | Authorized provider, signed webhook and no real test charges | Manual activation is supported | — | Separate payment authorization and provider choice |
| L-1 | A9 | P2 | Edit and publish French dish copy | AM-52 | IN DEVELOPMENT | Baseline | French strings can be written from builder/Studio and are rendered to guests | Backend round-trip and French browser renders | a43966d (AD) | Add or verify all editor fields and translations |
| R-1 | A10 | P0 | Verify D1 backup and restore | AM-06 | IN DEVELOPMENT | Branch | Approved encrypted backup restores to isolated D1 and passes schema/data/app checks | Synthetic full data backup and recovery through the current and preceding Worker sources | AuraDigital 092edae | Approved deployed staging D1 export and isolated restore rehearsal |
| R-2 | A10 | P1 | Health, alerts and logging | R-1 | IN DEVELOPMENT | Branch | Health endpoint returns 200/503; failed publish creates observable alert | Fixture verifies sanitized failed-publication event. Destination and delivery rehearsal remain open. | AuraDigital 092edae | Confirm alert destination and stage the alert |
| NA-1 | A3 | P0 | AuraMenu native authentication experience | A-1, S-2 | TESTED | Staging (hosted, without providers) | AuraMenu-branded sign-in, registration, email verification and password recovery on `/signin.html` (TR/EN/AR, RTL, light/dark, mobile) using the central AuraDigital identity through `/api/auramenu/auth/*`; Google via the AuraDigital provider with PKCE returning to AuraMenu; host-only `__Host-auramenu_customer`; verification/recovery emails link to AuraMenu pages; no separate account database; AuraPops untouched; legacy `/login` redirected | AuraDigital `test/auramenu-auth.test.mjs` (registration/login cookie mapping, shared account, foreign origin, verify/reset single use and session revocation, AuraMenu email links, Google failures return to AuraMenu); AuraMenu edge redirect tests; local browser walk-through of every screen with controlled API | b3d5e4f (AD), be6dd03 | Staging acceptance with real email delivery, Google OAuth on the staging origin, Turnstile hostname for the AuraMenu origin, and a published terms/privacy URL |
| LG-1 | A3 | P1 | Terms and privacy drafts for AuraDigital and AuraMenu | NA-1 | DRAFT | Branch + staging | TR/EN pages based on actual processing, linked from AuraMenu registration and AuraHub sign-up; placeholders for company, KVKK and legal items | `/terms`, `/privacy` on staging (noindex) | 5b1f902, edb9648 (AD), 85750b9 | Owner fills placeholders; legal review |
| SA-01 | A3 | P1 | Authoritative restaurant/workspace profile | A-4, AM-54 | IN DEVELOPMENT | Baseline | Studio and Hub reference the same restaurant identity and supported edits; retries avoid duplicate records | Shared menu list verified; separate restaurant authoring remains open | bde8f8d (AD) | Confirm model for multiple menus per restaurant and workspace ownership |
| SA-02 | A5 | P0 | Full restaurant lifecycle | A-1, A-4, P-2, S-1 | IN DEVELOPMENT | Branch | Account, plan, editor, draft, admin activation, customer publication, guest QR scan, edit and cross-device Hub | Worker lifecycle passes account publication; Studio browser fixture confirms its action | 137def3 (AD), 5aec673 | Complete end-to-end provider and physical-device acceptance |
| SA-03 | A8 | P1 | Check clean and legacy public routes | S-1, S-2 | TESTED | Live-checked | Classify actual referenced routes and record variants | Live route matrix in test report | f8a0d71 | Monitor which clean aliases customers still use |
| SA-04 | A10 | P0 | Protect existing domains and production releases | AM-06, AM-87 | TESTED | Branch | Confirm both branches are isolated, reconcile deploy paths and verify rollback runbook in staging | Local routing rollback and previous backend readback preserved the restored publication data | AuraMenu and AuraDigital A.2 | Rehearse rollback on approved Cloudflare staging |
| SA-05 | A9 | P0 | 30-design regression and performance gates | AM-05, AM-83 | IN DEVELOPMENT | Branch | 720 render variants, interactions, accessibility, offline and real p75 gates | Browser matrix and local diagnostics in test report | f8a0d71 | Complete prior-suite, field performance and physical-device validation |

## Blockers carried forward

| ID | Status | Effect | Owner decision or access |
|---|---|---|---|
| BLK-1 | Resolved decision | AuraMenu uses AuraDigital identity. Existing AuraPops-only account migration is outside Sprint A. | Dhia confirmed strategy; legacy menu access remains governed by ownership. |
| BLK-2 | Open | The existing `aurapops` Worker owns AuraMenu API and legacy login routes. GitHub Pages currently answers menu slugs. | Approve an AuraMenu-only frontend-edge integration and access to its staging route. |
| BLK-3 | Resolved decision | Annual 2,500 TL/year with Standard designs. | Keep the three approved plan terms and the legacy one-time contract. |
| BLK-4 | Open | Manual bank confirmation remains supported. | Payment provider selection and explicit authorization, if payment integration enters scope. |
| BLK-5 | Partially resolved | Cloudflare D1 metadata and a read-only public menu lookup worked. Synthetic export/restore passed locally. | Authorize the staging backup data, restore target and encrypted backup storage. |
| BLK-6 | Open | Google, real email verification, password recovery and staged admin access remain unverified (now also covers NA-1). | Provide two authorized test accounts and one staging admin with test inbox access; add the AuraMenu staging/production hostnames to the Turnstile widget; publish an account terms/privacy URL. |
| BLK-7 | Resolved (A.3) | Cloudflare access restored. Wrangler is authenticated on the owner laptop; both staging Workers are deployed, 0042 is applied to staging, and rollback and D1 restore drills pass. | Evidence in `SPRINT_A_3_ACCEPTANCE.md` gates 1, 2, 6a, 6b. |
| BLK-8 | Open (A.3) | Staging has no admin user, so payment confirmation, publication, QR/NFC on a published slug, revision restore and the failed-publish alert drill cannot run on staging. | Owner creates one staging admin with their own password (checklist item 1). |
| BLK-9 | Open (A.3) | `staging.auramenu.space` already exists behind Cloudflare Access; automated hosted browser checks need a service token, or approval to attach `auramenu-staging` as its custom domain. | Owner choice (checklist item 2). |
