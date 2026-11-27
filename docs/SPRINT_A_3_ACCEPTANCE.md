# AuraMenu Sprint A.3 — hosted staging acceptance

Date: 2026-11-28 (Europe/Istanbul). Branches: `codex/auramenu-sprint-a-stabilization` in both repositories (draft PRs AuraMenu #10, AuraDigital #115). Both branches contain the current `main` (behind 0).

Baseline refs at the start of A.3: AuraMenu `2297f36`, AuraDigital `286f784`. A.3 commits: AuraDigital `b3d5e4f` (native AuraMenu auth API), AuraMenu `be6dd03` (native auth screens, `/login` redirect) and the legacy-suite wait fix.

**Summary:** every gate that needs the hosted Cloudflare staging environment is **BLOCKED**. Checking the Wrangler session from this environment was refused (no credentials are reachable here), so nothing was deployed, migrated, exported, restored, rolled back or alerted. All work that does not need Cloudflare was done and is reported with local evidence only. No production change, merge or AuraPops route change was made in A.3.

## Release gates

| # | Gate | Result | Environment | Evidence | Commit | Remaining owner action |
|---|---|---|---|---|---|---|
| 1 | Cloudflare access and staging resources | BLOCKED | — | `wrangler whoami` from this environment was refused; no credential files are reachable. | — | Run `npx wrangler whoami` on an authorized machine and confirm the account; or authorize this environment for staging only. |
| 2a | Staging isolation (configuration) | PASS | Wrangler 4.154 dry runs | AuraDigital `--env staging`: only `auradigital-staging-db` (`7d2935b7…`, different from production `6d89053c…`), separate rate-limit namespaces, `routes: []`, `crons: []`, no `send_email`, no AI binding, `CUSTOMER_EMAIL_ENABLED=false`, `GOOGLE_LOGIN_ENABLED=false`. AuraMenu `--env staging`: single service binding `auradigital-staging`, 584 tracked assets, `routes: []`. | 286f784 (AD), 2297f36 | — |
| 2b | Deploy staging, back up D1, apply migrations incl. 0042 | BLOCKED | — | Not run (gate 1). | — | Commands below. |
| 3a | QR/NFC routing logic | PASS | Local edge Worker tests | 28/28: published slug 200 + metadata, unknown/unpublished 404, upstream failure 503, GET/HEAD, apex/www shapes, legacy `menu.html?slug=` and query/table parameters, static assets and API pass-through, rollback switch, and the new `/login` → `/signin.html` 301. | be6dd03 | — |
| 3b | Hosted routing and physical scans | BLOCKED | — | Not run. No physical scan is claimed. | — | Device test list below. |
| 4a | Authentication (code level) | PASS | Isolated Worker fixtures | AuraDigital 410/410, including PKCE, account-only registration, verified-email requirement, roles, tenant isolation and the new native AuraMenu auth tests. | b3d5e4f (AD) | — |
| 4b | Authentication with real providers | BLOCKED | — | Email delivery, Google OAuth and inbox access are not configured for staging. Synthetic results are not counted as provider acceptance. | — | BLK-6 checklist. |
| 5a | Restaurant lifecycle (local) | PASS | Local browser with controlled API, plus Worker fixtures | 5-step builder, plan choice, cloud draft recovery and conflict, Studio publication, private preview and restoration smokes passed. | 2297f36 | — |
| 5b | Hosted lifecycle | BLOCKED | — | Not run. | — | Run on staging after gates 1–2. |
| 6 | Hosted D1 recovery drill and Worker rollback | BLOCKED | — | Only the earlier synthetic local drill exists (A.2). | — | Commands below. |
| 7 | Monitoring and alert delivery | BLOCKED | — | No approved alert destination and no Cloudflare access. Failed-publication event exists in code (`auramenu_publication_failed`). | 092edae (AD) | Approve a destination (email or webhook); then trigger the controlled 503 drill. |
| 8 | Regression vs baseline | PASS (local) | Local Chromium, static server | See next table. | be6dd03, b3d5e4f (AD) | Re-run against hosted staging. |
| NA-1 | AuraMenu native authentication (new P0) | PASS (local) / BLOCKED (staging) | Worker fixtures, edge tests, local browser | Sign-in, register, verify (link), resend, forgot, reset, Google start URL (PKCE, `next=/api/auramenu/connect`), Google error return, TR/EN/AR, RTL, dark, 390 px all exercised. | b3d5e4f (AD), be6dd03 | Real email, Google and Turnstile acceptance on staging. |

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

## Owner checklist (all A.3 blockers in one place)

1. **Cloudflare:** run on an authorized machine, or authorize this environment for the staging account only:
   - `npx wrangler whoami`
   - `npx wrangler d1 list`
   - confirm `auradigital-staging-db` holds only test data
2. **Staging deploy:** run from the `codex/auramenu-sprint-a-stabilization` checkouts.
   - AuraDigital, back up first: `npx wrangler d1 export auradigital-staging-db --remote --env staging --output staging-pre-a3.sql`
   - AuraDigital: `npx wrangler d1 migrations apply auradigital-staging-db --remote --env staging`
   - AuraDigital: `npx wrangler deploy --env staging`
   - AuraMenu, after AuraDigital: `npx wrangler deploy --env staging`
   - Record both version IDs and both `*.workers.dev` URLs.
3. **Identity on staging:**
   - Set staging-only `RESEND_API_KEY` and `CUSTOMER_EMAIL_ENABLED=true`.
   - Add the staging Google OAuth redirect `https://auradigital-staging.<account>.workers.dev/api/customer/google/callback` and set `GOOGLE_LOGIN_ENABLED=true` with staging client credentials.
   - Add the AuraMenu staging and production hostnames to the Turnstile widget.
   - Provide two test identities, a test inbox and a staging admin.
4. **Terms/privacy URL** for the registration checkbox. Neither auradigitalworks.com/terms nor /privacy exists today, so no link is shown.
5. **Recovery drill:**
   - `npx wrangler d1 create auramenu-restore-drill`
   - `npx wrangler d1 execute auramenu-restore-drill --remote --file staging-pre-a3.sql`
   - Point a throwaway Worker version at the restored database and check restaurants, users, menus, staff, subscriptions, revisions and images.
   - Roll back with `npx wrangler rollback --env staging`, re-check, and record the times.
6. **Alert destination:** approve one (email address or webhook). After it is set, trigger a controlled 503 on staging and confirm delivery.
7. **Physical devices:** after staging is live, scan or tap with one iPhone (Safari) and one Android (Chrome). Write down the device, OS version, URL, result and a screenshot for each:
   - `/<staging-slug>`
   - `/<staging-slug>?t=12`
   - `/menu.html?slug=<staging-slug>`
   - an unpublished slug (expect 404)
   - `/login` (expect a redirect to `/signin.html`)
8. **Production approval** (below), only after items 1–7 pass.

## Production promotion plan (prepared, not executed)

1. **Freeze and back up:**
   - Export production D1: `npx wrangler d1 export auradigital-db --remote --output prod-pre-a3.sql`, stored encrypted outside Git.
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
   - Never restore D1 over production unless data is lost; use the pre-A.3 export into a new database first.
