# Progress — 2026-11-11

## Implemented
- Reused existing AuraMenu static builder, dictation, product import and template preview.
- Reviewed restaurant text/voice extraction, labeled fields, explicit prices, Arabic digits/decimal separators, quoted CSV import and supported conversational product edits.
- Added append/replace/edit modes; unsupported lines are listed and mixed currencies rejected. No model inference, prices or ingredients are fabricated.
- Draft revision checks prevent stale assistant, text-import and field-dictation proposals from overwriting newer edits. Speech adapters cancel on page exit and coordinate microphone use.
- Removed demo business facts and products from new customer drafts. Existing saved work is retained. Draft field restoration is allowlisted and storage write failures report unsaved work.
- Added CI smoke coverage and excluded docs/tests/dependencies from Pages output.
- In AuraDigital: additive private menu draft migration/API with existing identity, organization permissions, verification, current membership entitlements, CSRF, write rate limits, hard request/count caps, optimistic versions and atomic audit records.
- Business Hub private draft editor: uses saved business profile, saves/reopens/edits, content preview, archive and JSON export. This UI is implemented and verified in isolated Chromium CI; live customer integration is pending.

## Verified results
- AuraMenu: `node --test tests/*.test.mjs`: 18 passed, 0 failed.
- Changed JavaScript passes `node --check`; `git diff --check` passes.
- AuraDigital: original baseline 271 passed; after draft API changes, full `npm test`: 279 passed, 0 failed.
- AuraDigital `npm run check`: passed existing syntax, shop TypeScript, shop build and hub bundle checks.
- AuraDigital `npm run deploy:check`: passed Worker dry-run bundling; no deployment.
- Browser smoke scripts were attempted but did not run: bundled Chromium missing; download returned truncated archives; installed Chromium launch denied a required socket by the sandbox. A separate browser could not connect to the local server. No visual/mobile/real-microphone acceptance pass is claimed.

## Blockers / remaining
- Replaced the missing standalone `/api/aurapops/account` adapter with the existing `/api/customer` session/registration and email-link verification contract. Added authenticated verification-status API. Client adapter and server verification tests pass; live routing and email delivery remain unverified.
- Production shared identity/Business Hub flags are false; same-origin AuraMenu API routing and centralized cross-domain auth remain unverified.
- Draft API and UI feature gates remain disabled; migration has only run against isolated in-memory test databases.
- Private Hub drafts are not yet connected to the standalone assistant/editor or converted to owned publishing requests.
- No provider checkout, webhook, recurring subscription activation, production migration, public-domain change, deployment, real email or outbound message was performed.
- Existing manual payment and publishing code was inspected and billing tests pass, but the complete signup-to-paid-public-menu/QR acceptance journey is not yet verified.
- Aura Control audit limited to connector README; private clone lacked credentials.

## Next priorities
1. Verify the repaired shared-account contract with actual same-origin routing, centralized auth redirects and isolated verification email delivery.
2. Verify browser tests in a capable environment; wire standalone drafts to shared organizations and authenticated request ownership.
3. Exercise existing manual activation/public menu/QR flow in isolated staging.
4. Add a supported provider boundary only after eligibility/test credentials; then continue unified dashboard/sales/AuraWeb backlog.

See DECISIONS, ROADMAP and AUDIT. Backend API/release/cost notes are in AuraDigital docs/MENU_DRAFTS.md and docs/COST_ASSUMPTIONS.md.

## Shared-account repair checkpoint
- Existing customer identity reused; no new authentication database or domain-cookie assumptions.
- Registration has explicit account consent and matches backend password lengths. Verification uses email links and backend status, replacing an unsupported six-digit-code flow.
- Client adapter tests cover matching passwords, consent, unverified users, refresh after verification, same-origin credentials and missing backend.
- Backend test checks current-email binding, unauthenticated rejection and no-store responses.
- Request-to-account ownership binding is still a separate required server integration; signing in alone does not establish menu ownership.

## GitHub verification checkpoint
- Draft PRs: AuraMenu #9 and AuraDigital #58; source trees match the locally tested trees. No merge or production deployment.
- AuraDigital GitHub Actions Security checks passed: dependency audit, syntax/types/builds, all tests and Worker dry-run.
- AuraMenu GitHub Actions completed the Chromium smoke step successfully. Both scripts ran: existing dictation-to-field/product flow, new extraction-to-actual-template-preview flow, stale review rejection, conversational price edit, refresh persistence, CSV, text-safe rendering and mobile/desktop overflow assertions.
- Local Chromium remains unavailable; actual microphone hardware, physical-device QA, live account routing and signup-to-payment/publication acceptance remain separate requirements.

## Final verified code checkpoint
- AuraMenu code commit `c63f5cd0b0626ea2f5348fd94158da9752051445`: GitHub run 42919691744 passed syntax, 18 tests and both Chromium scripts. QR URL updates after automatic slug changes; custom slugs persist across reload.
- AuraDigital code commit `01fd55cdd3eaf486a8e1a8e732f3e10c4583c8be`: GitHub run 42919457059 passed audit, type/build checks, 279 tests, Worker dry-run and the private draft UI browser script.
- Downloaded and visually inspected mobile and desktop CI screenshots of the private editor and the AuraMenu mobile screenshot. Inspection uncovered the QR bug above, which was corrected and covered by the subsequent passing Chromium run. Screenshots use synthetic test inputs.
- CI voice recognition uses a mock transcript; actual microphone hardware was not exercised. No full signup/payment/activation acceptance pass or production readiness certification is claimed.
- Source saved on draft PRs https://github.com/Dhiaeddine-mahouachi/auramenu/pull/9 and https://github.com/Dhiaeddine-mahouachi/auradigital/pull/58. Worktrees clean after local commits; production remains unchanged.
