# AuraMenu Sprint A.3 — hosted staging acceptance

Date: 2026-11-28 (Europe/Istanbul). Branches: `codex/auramenu-sprint-a-stabilization` in both repositories (draft PRs AuraMenu #10, AuraDigital #115, both still draft).

Baseline refs at the start of A.3: AuraMenu `2297f36`, AuraDigital `286f784`. A.3 commits: AuraDigital `b3d5e4f` (native auth API), `5b1f902` (legal drafts, AuraHub sign-up links), `66ed831` (staging.auramenu.space origin, legal routes), `edb9648` (legal pages noindex). AuraMenu `be6dd03` (native auth screens, `/login` redirect), `85750b9` (legal drafts, registration links).

**Summary:** BLK-7 is resolved. Wrangler 4.169.0 is authenticated on the owner's laptop for account `072c4df3…` (OAuth approved by the owner). Both staging Workers are deployed, migration 0042 is applied to staging only, and these were exercised on the hosted staging stack with two test restaurants:

- the auth lifecycle, isolation and roles;
- Worker rollback;
- D1 point-in-time restore;
- HTTP and metadata checks.

Gates that need email, Google, Turnstile, a staging admin, an alert destination or physical devices remain BLOCKED on owner input (one list below). No production Worker, route, D1 database or AuraPops service was changed. A read-only query against production D1 was refused by the environment's safety policy and was not retried.

## Hosted staging stack

| Item | Value |
|---|---|
| AuraDigital staging | `https://auradigital-staging.dhiamahouachi2025.workers.dev`, version `76e060a6-719f-4fd5-b040-be71bbd244e2` (from `edb9648`). Earlier A.3 versions: `60fe1c54…`, `75e99437…` |
| AuraMenu staging | `https://auramenu-staging.dhiamahouachi2025.workers.dev`, version `79f183fb-0a3f-43a7-8a06-2da11c6aa872` (from `85750b9`), service binding `AURADIGITAL → auradigital-staging` |
| Staging D1 | `auradigital-staging-db` `7d2935b7…` (production `auradigital-db` `6d89053c…` untouched) |
| Routes / crons | none on either staging Worker; `workers.dev` only |
| `staging.auramenu.space` | Already exists in the `auramenu.space` zone and is protected by Cloudflare Access (team `old-bird-1fa5`). The Worker it points to is unknown. Not modified. The backend now accepts it as a staging AuraMenu origin (`66ed831`, test added) |
| Indexing | Both staging hosts send `X-Robots-Tag: noindex` |

## Release gates

| # | Gate | Result | Evidence | Remaining owner action |
|---|---|---|---|---|
| 1 | Cloudflare access and staging resources | PASS | `wrangler whoami` → account `072c4df3…`. `d1 list` shows `auradigital-staging-db` separate from production. Staging D1 held only fixtures: 2 `example.test` users and 1 menu before A.3. | — |
| 2 | Deploy staging, back up D1, apply 0042 | PASS | **Backup:** `d1 export` is unsupported for databases with FTS5 tables (`ai_fts`), so the backup is a D1 Time Travel bookmark taken before the migration: `00000007-00000000-00005130-568fe7a9…`. **Migration:** `migrations list` showed only `0042_auramenu_publications.sql` pending; it was applied (2 commands) and `auramenu_publications` exists. **Deploys:** AuraDigital and then AuraMenu. **Isolation:** dry run lists only staging bindings. | Resolve the 0042 numbering clash before production (see Risks). |
| 3a | QR/NFC routing logic | PASS | Edge tests 28/28 (unchanged). | — |
| 3b | Hosted routing and metadata | PASS (partial) | Checked on `https://auramenu-staging.dhiamahouachi2025.workers.dev`: `/` 200 with canonical, description and og tags; `/login` and `/login.html?x=1` 301 to `/signin.html` (query kept); `.html` pages 307 to clean URLs (Workers assets); `/edge-runtime.js` points at the staging accounts origin; unknown slug and `menu.html?slug=` 404 with a branded page; health 200. Published-slug 200 is not tested yet because no staging menu can be paid or published without an admin. | Staging admin (item 4), then physical scans (item 7). |
| 4a | Authentication (code level) | PASS | AuraDigital 412/412, AuraMenu 28/28. | — |
| 4b | Hosted auth lifecycle | PASS (without providers) | On `https://auramenu-staging.dhiamahouachi2025.workers.dev`, using two `@auramenu-staging.test` identities: (1) Registration: 200 with a host-only `__Host-auramenu_customer` cookie (HttpOnly, Secure, Lax, no Domain). (2) A foreign Origin is refused with 403. (3) Menu registration before verification returns 403 `verify:true`. (4) Logout clears the cookie and the session returns `user:null`. (5) A wrong password returns 401; the right password returns 200. (6) Cross-product: the same account signs in on AuraDigital staging (`__Host-aura_customer`, Strict) and its menu appears in `/api/auramenu/hub/menus`. (7) A forced expiry gives `user:null` and dashboard 401. **Fixture, not provider acceptance:** email verification was set by inserting `customer_verified_emails` rows for the two `.test` users in staging D1, because no email provider is configured. Session expiry was forced the same way. | — |
| 4c | Email, Google and Turnstile on staging | BLOCKED | Capabilities: `email:false`, `google:false`, `turnstile:""`. `send-verification` and `forgot-password` correctly return 503. | Item 3. |
| 5 | Hosted restaurant lifecycle | PASS (to payment) / BLOCKED (after) | **Restaurants:** Sofra (Standard, `std-01`) and Velvet (Premium, `pre-16`) registered at 201 as `pending`/`unpaid` at 399 and 599 TRY. Premium with `std-01` refused (403, plan-based designs). Each owner sees only their own menu. **Isolation:** cross-tenant GET/PATCH 401, anonymous 401. Unpaid menus are not public (page and `/api/auramenu/sites/` 404). **Roles:** an editor can read and change categories, but a rename attempt is ignored and adding members returns 404. A manager's rename is accepted, but adding members returns 403. Self-add is refused. Adding an unverified or unknown email is refused. Removal revokes access (401). **Drafts:** cloud drafts saved per account; another account sees none. | Admin payment confirmation, publish, QR/NFC, price and availability changes and revision restore need a staging admin (item 4). |
| 6a | Worker rollback rehearsal | PASS | `wrangler rollback 75e99437… --env staging` took 5 s and new behaviour was visible within about 1 s (`/terms` 200→404). Rolling forward to `76e060a6…` took 6 s (`/terms` 200). Health stayed 200 throughout. | — |
| 6b | D1 recovery drill | PASS | Staging only. (1) Bookmark T1 `0000000b-0000008a-00005130-f8c82f95…`. (2) Simulated loss: Sofra renamed and Velvet's owner link deleted. (3) `d1 time-travel restore` took 3.2 s. (4) Name and owner link restored; 8 users, 3 menus, migration 0042 and `auramenu_publications` intact. | — |
| 6c | Revision recovery | BLOCKED | Needs a published menu (item 4). Code-level restore tests pass. | Item 4. |
| 7 | Monitoring and alert delivery | BLOCKED | `auramenu_publication_failed` event exists in code; no destination approved. | Item 5. |
| 8 | Regression vs baseline | PASS (local) | Next table; automated tests rerun after the staging fixes (AuraDigital 412). | Hosted browser rerun once Access or a service token allows automation (item 2). |
| NA-1 | Native authentication | PASS (hosted, without providers) | Gate 4b, plus the local UI evidence from A.3 (TR/EN/AR, RTL, dark, 390 px). | Provider acceptance (item 3). |
| LG-1 | Terms and privacy drafts | DRAFT | AuraMenu `terms.html` and `privacy.html`, AuraDigital `/terms` and `/privacy` (noindex). TR/EN, based on actual processing: Cloudflare Workers/D1/Turnstile/Web Analytics/Workers AI, Google sign-in, Resend, cookies and retention periods. They are linked from AuraMenu registration and AuraHub sign-up. Every company, KVKK and legal item is a highlighted `[placeholder]`. | Item 6. |

## Regression compared with the A.2 baseline (local, not hosted)

| Suite | Baseline | A.3 result |
|---|---|---|
| Automated tests | 433 (405 + 28) | 438: AuraDigital 410 (5 new auth tests), AuraMenu 28 (edge test extended) — all pass |
| Design matrix | 720 | 720/720 |
| Guest accessibility (axe) | 60 | 60/60 |
| Legacy browser combinations | 900 | 900 pass. A navigation race in the suite was fixed by waiting for the gallery grid; no product change. |
| Guest/gallery, cloud drafts, Studio publication smokes | pass | pass |
| Sofra p75 LCP (same local profile) | 1.840 s | 1.832 s (homepage 2.404 s, Velvet 1.916 s) |

## NA-1 design (no new account system)

- AuraMenu pages call `/api/auramenu/auth/{login,register,send-verification,verify,forgot-password,reset-password,capabilities,verification-status}`.
- The adapter only accepts the AuraMenu origin, runs the existing `/api/customer/*` handlers (same `customer_users`, sessions, password rules, rate limits and Turnstile) and maps the session to the host-only `__Host-auramenu_customer` cookie. No cookie is shared between domains.
- Verification and recovery emails started from AuraMenu link to `/signin.html?mode=verify|reset#token=…` on the validated AuraMenu origin (staging uses its own origin). AuraDigital's own flows keep AuraHub links.
- Google uses the AuraDigital provider with PKCE (`/api/customer/google/start?next=/api/auramenu/connect?…`), then the one-time code exchange. Failures from an AuraMenu start return to AuraMenu's page instead of AuraHub, so no AuraDigital screen is shown.
- `/api/auramenu/account/session` now reports the real email verification. Menu registration is refused until the email is verified (403 `verify:true`). The builder sends unverified users to the verification screen.
- The older AuraPops login form is no longer part of AuraMenu. AuraPops routes were not changed.

## Owner checklist (everything still needed, in one place)

1. **Staging admin.** Create one admin user in `auradigital-staging-db` with your own password. It unblocks:
   - payment confirmation and publish;
   - published-slug 200 and QR/NFC;
   - price and availability edits;
   - revision restore;
   - the failed-publish drill.
2. **`staging.auramenu.space`.** It already exists behind Cloudflare Access. Choose one:
   - (a) keep Access and create an Access service token so automated checks can pass it; or
   - (b) approve attaching `auramenu-staging` to that hostname as a Worker custom domain. This is a DNS change in the production zone, so it needs explicit approval.
   Then set `AURAMENU_ORIGIN=https://staging.auramenu.space` on AuraDigital staging; the code already accepts it.
3. **Identity providers, staging only:**
   - `wrangler secret put RESEND_API_KEY --env staging`, from a staging or restricted key, and set `CUSTOMER_EMAIL_ENABLED=true`.
   - A Google OAuth client with redirect `https://auradigital-staging.dhiamahouachi2025.workers.dev/api/customer/google/callback`, then `GOOGLE_CLIENT_ID`, the `GOOGLE_CLIENT_SECRET` secret and `GOOGLE_LOGIN_ENABLED=true`.
   - A Turnstile widget with the staging hostnames, then `TURNSTILE_SITE_KEY` and the `TURNSTILE_SECRET_KEY` secret.
   - A test inbox you control for the verification and reset emails.
4. **Paid steps:** none were needed. No paid resource was created; D1 Time Travel and Workers rollback are included features.
5. **Alert destination.** Approve one email address or webhook for `auramenu_publication_failed`.
6. **Legal review.** Fill every highlighted placeholder in the four legal pages:
   - legal entity, address, MERSİS and tax number, KEP;
   - KVKK legal bases and transfer basis;
   - retention periods, refunds, governing law and courts.
   Then have counsel review the pages and remove the DRAFT banners.
7. **Physical devices**, after item 1. Scan or tap with one iPhone (Safari) and one Android (Chrome). Record the device, OS, URL, result and a screenshot for each:
   - `/<slug>`
   - `/<slug>?t=12`
   - `/menu.html?slug=<slug>`
   - an unpublished slug (expect 404)
   - `/login` (expect a 301)
8. **Cleanup.** Run when staging tests are done:
   ```sql
   DELETE FROM customer_users WHERE email LIKE 'a3-owner-%@auramenu-staging.test';
   ```
   Also delete their menus, owners, members and drafts.
9. **Production approval** (plan below), only after items 1–7 pass.

## Risks found in A.3

- **Migration number clash:**
  - Staging also has `0042_workspace_auramenu_links.sql`, applied from branch `codex/aura-staging-readiness`.
  - Wrangler tracks migrations by file name, so both apply.
  - Rename this branch's `0042_auramenu_publications.sql` to the next free number before merging, after checking production's `d1_migrations`. I could not read production.
- **Workers assets trim `.html`:** `/signin.html` → `/signin` and so on, with a 307. `/login` therefore redirects twice on Workers. GitHub Pages is unaffected. Pointing the edge redirect straight at `/signin` is optional.
- **`d1 export` is unavailable** because of the FTS5 table. Production backups must use Time Travel bookmarks, or an export that skips `ai_fts*` and rebuilds them.

## Production promotion plan (prepared, not executed)

1. **Freeze and back up:**
   - Record a production D1 Time Travel bookmark: `npx wrangler d1 time-travel info auradigital-db`. `d1 export` fails on the FTS5 table.
   - Note the current Worker version IDs (`npx wrangler deployments list`) and the GitHub Pages commit.
2. **Migrations first (additive only):** apply outstanding migrations including `0042_auramenu_publications.sql` to production D1. Check `/api/auramenu/health` returns 200.
3. **Backend:** merge AuraDigital #115 and deploy. Verify the following on production:
   - `/api/auramenu/designs` and `/pricing` return 200.
   - `/api/auramenu/sites/<known slug>` returns 200.
   - `/api/auramenu/account/session` returns `{user:null}`.
   - `/api/auramenu/auth/capabilities` returns 200.
4. **Frontend:** merge AuraMenu #10. GitHub Pages deploys. Verify:
   - `/signin.html` renders the new screens.
   - `/builder.html?step=review` asks a signed-out user to sign in.
5. **Edge routes (owner approval required):**
   - Bind the AuraMenu edge Worker to `auramenu.space/*` and `www.auramenu.space/*`, AuraMenu paths only. Leave AuraPops routes untouched.
   - Then verify printed slugs return 200 with metadata, `/login` returns 301, and API calls pass through.
6. **Rollback triggers** (any one): 5xx rate on `/api/auramenu/*` above 2% for 5 minutes; any printed slug returning anything other than 200 or 301; sign-in or registration failing for a test account; any publish failure event.
7. **Rollback order:**
   - `PRETTY_MENU_ROUTES=false` (edge), or remove the edge routes.
   - Revert AuraMenu Pages to the previous commit.
   - `npx wrangler rollback` for the backend. The additive schema stays.
   - Never restore D1 over production unless data is lost. A Time Travel restore is in place and returns an undo bookmark; record both bookmarks first.
