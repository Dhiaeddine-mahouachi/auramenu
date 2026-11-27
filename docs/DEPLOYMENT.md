# AuraMenu deployment

## Sprint A promotion and rollback

The isolated development branch in both repositories is `codex/auramenu-sprint-a-stabilization`. The static workflow publishes Pages on pushes to `main`. AuraDigital's active GitHub workflow syncs `main` to `contact-autoreply`, which feeds the Cloudflare production build. Validate the separate staging environment and its D1 binding before using it for integrated acceptance.

Record the current Pages commit, Worker version, D1 backup bookmark and applicable route inventory before promotion. Smoke-check known printed slugs, current sign-in, health, the public API and a staged publishing lifecycle. If a release fails, restore the previous Pages commit or Worker version and recheck the exact same URLs. Restore data only under the separate [recovery runbook](RECOVERY.md) after incident approval.

The development branch adds `GET /api/auramenu/health`, returning 200 or 503 without exposing database configuration. Confirm existing structured Worker logs and configure alerts on repeated publication 5xx responses and health 503s. Test alert delivery using a controlled staging failure and ensure the destination is available before release.

Cloudflare access is scoped to Zone Read and Workers Routes Read for inventory, Workers Scripts Read to inspect metadata, a scoped D1 read/export source and D1 write on the isolated restore target, and R2 access for the approved media bucket. Any routing change requires owner-approved write scope on the AuraMenu zone. Refer to [Cloudflare Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/) and [D1 export/import](https://developers.cloudflare.com/d1/best-practices/import-export-data/).

## Static site (this repo)
1. Work on a branch or locally; run tests:
   - `node --test tests/*.test.mjs`
   - `BASE_URL=http://127.0.0.1:4190 node tests/auramenu-v2-browser.cjs` (with `python -m http.server 4190`)
2. Bump `?v=` on any changed CSS/JS link (edge caches 10 minutes).
3. Push to `main` → GitHub Actions `static.yml` rsyncs the repo (minus `docs/`, `tests/`, `.github/`, `node_modules/`) to GitHub Pages. Live in ~2 minutes.
4. Verify live: `/`, `/builder.html`, `/studio.html`, `/signin.html`, `/gallery.html`, one published `/<slug>`, `/sitemap.xml`.

Rules: do not create files under `/brand/` or paths containing `login` — the edge worker owns them (use `am2/`, `/signin.html`).

## Backend (`auradigital` repo)
1. `npm test` (386 tests at fb2f127).
2. Push to `main` → sync workflow → Cloudflare deploys worker `auradigital`.
3. Verify: `GET /api/auramenu/designs`, `GET /api/auramenu/pricing`, a published `/api/auramenu/sites/<slug>`.
4. D1 schema changes: back up first (see RECOVERY.md), additive migrations only, never drop customer tables.

## Rollback
- Site: `git revert <sha>` and push (Pages redeploys the previous state).
- Worker: revert commit and push, or roll back to the previous version in the Cloudflare dashboard (Workers → auradigital → Deployments).
