# AuraMenu deployment

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
