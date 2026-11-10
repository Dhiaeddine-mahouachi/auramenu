# Audit — 2026-11-11

## Evidence and baseline
- AuraMenu `6b260cb` baseline: see `git log` for exact source commit; static HTML/CSS/JS, no application package dependencies. Existing tests run with `node --test tests/*.test.mjs`.
- AuraDigital repository: Cloudflare Worker (`src/worker-entry.js`), D1, Workers AI, static assets, TypeScript shop and JavaScript Business Hub. Existing schemas use runtime ensures plus numbered SQL migrations.
- Aura Control private repository was read through the GitHub connector (README); direct clone was unavailable. Its README describes Python/PostgreSQL/OpenClaw operations and incomplete product provisioning. This is a limited documentation audit, not a source/security audit of that repository.

## Existing working components (source inspection; deployment not verified)
- Builder: editable categories/products, actual template iframe preview, browser-local draft, resized customer photos, QR builder, multilingual TR/EN/AR controls.
- Voice: browser SpeechRecognition, editable transcript, explicit field/product selection, review-before-apply, numeric Arabic-digit parsing, permission errors and keyboard fallback. It is deterministic field dictation, not a conversational AI agent.
- Text import: bracketed categories and pipe-delimited items, explicit prices and HTTPS image validation.
- Backend: pending menu requests, ownership token hashing, manual admin approval, authoritative 399/599/2500 TRY plans, payment-period comparison to reject duplicate renewal. Published endpoints require approval, paid status and active billing; legacy contracts are preserved.
- Existing shared customer identity, organizations and role guards in AuraDigital should be reused.

## Gaps and risks
1. At baseline, the builder called absent `/api/aurapops/account/*` routes. This branch repairs the adapter to the existing shared customer API and adds verification status; live account-required submission remains unverified until domain routing/identity configuration is tested.
2. `CUSTOMER_IDENTITY_ENABLED` and `GROWTH_OS_ENABLED` default false in AuraDigital's configuration. Existing customer identity is not proof of live unified accounts.
3. AuraMenu's relative `/api` calls require a same-origin reverse proxy/Worker route. Its Pages workflow alone cannot supply one. `_redirects` is not processed by GitHub Pages. No cross-domain identity cookie sharing is possible.
4. Drafts were local-browser only. Uploaded image bytes intentionally do not persist. Cloud drafts and recovery across devices require authenticated backend integration.
5. Example items/prices/ingredients were placed in a new draft; this risks customer submission of invented facts. New drafts should start empty.
6. Existing voice/text/normal editor paths have inconsistent count/price validation. Enforce bounds at every server boundary as well as assisted paths.
7. Automatic card checkout/webhooks and full conversational model setup are not verified. Do not claim activation from frontend success.
8. New docs/tests must be excluded from public Pages artifacts.
9. No production credentials, database, DNS, payment, or browser deployments were inspected or mutated.

## Audit scope
See PROGRESS for actual commands and verification. This audit does not certify production security, provider eligibility, live DNS, backups, or all features in the larger backlog.
