# AuraMenu Sprint A.2 release candidate

## Verified on the development branches

- The AuraMenu edge Worker serves published slugs at the original guest URL. It supplies canonical, Open Graph, Twitter and Restaurant structured data. It returns 404 for unpublished or unknown slugs and 503 for upstream failures. Apex and www request shapes, legacy query links, API proxying, and the edge rollback switch passed local Worker tests, including a two-Worker workerd smoke backed by isolated D1.
- The staging frontend binds only to `auradigital-staging`. The backend staging environment binds to the dedicated `auradigital-staging-db` and separate rate-limit namespaces. Staging has no production routes, email binding or cron jobs. Google and outgoing verification email start disabled. Cloud staging is prepared in configuration. The local Wrangler session cannot authenticate to deploy it.
- Published menu snapshots preserve content, timestamps, actor IDs where an account is available, and underlying uploaded images. Earlier guest content is saved at promotion or the first live mutation. A restore creates a new version in the same D1 transaction, preserves ownership, payment state and slug, and checks the expected live revision and plan entitlement first. Only signed-in menu staff can read history. Only owners and managers can restore. Previously issued menu tokens can retain their existing edit behavior and history records label their channel when no account is attributable.
- Studio has an authorized previous-version preview and restore control. The guest frontend now rejects non-HTTP navigation links, keeps the selected theme across a public-menu reload and preserves the dedicated legacy Orbit and unknown-template fallback behavior.
- The original Sofra photograph now has an early discovery hint and a 420 px mobile derivative. The original remains available at higher display densities. All 30 template identities and navigation flows remain available.

## Deployment sequence

1. Use an authenticated Cloudflare environment scoped to the two staging Workers. Verify the existing staging database ID against the account listing and confirm it contains only approved test records. Take and record a staging backup before migrations.
2. Activate the AuraDigital staging Worker with the isolated staging configuration in its draft PR. Apply the full outstanding staging D1 migrations, including additive `0042_auramenu_publications.sql`. Run the database readiness route and check the staging backend has no production D1, route, queue or payment binding.
3. Deploy the AuraMenu Worker from its staging-only Wrangler configuration with the verified source and tracked assets. Its sole service binding must be `auradigital-staging`. Confirm the account URL returned by `/edge-runtime.js` belongs to the same workers.dev account and check the staged public slug, HEAD, sign-in redirect, static assets and session endpoint.
4. For real acceptance, the owner supplies two authorized test identities, test inbox access and a staging admin. Set staging-only email credentials and enable email after verifying the sender and recipients. Register the staging Google OAuth callback with a staging OAuth client and enable Google for that environment. Exercise registration, verification, recovery, sign-in, logout, session expiration, second-device use, account isolation and the AuraHub-to-Studio journey. Fixture-backed PKCE tests do not close this gate.
5. Verify a restore from an approved staging backup into separate isolated D1 storage. Check restaurant, ownership, publication, product details, subscription, staff membership, images and revision history through the restored app. Record rollback Worker versions and test rollback while using the restored data.
6. Prepare the production Worker version and route inventory only after stage acceptance. On approved release, deploy the additive backend change first and verify the public API. Promote matching frontend assets and review AuraMenu-specific apex and www routes, including the deployed route precedence for existing AuraPops API and legacy prefixes. Leave the existing AuraPops routes intact. Confirm any production edge API read target and stage-equivalent compatibility before activation. Scan an existing printed QR and tap an existing NFC card on real devices before closing acceptance.

Cloudflare documents Worker environment and asset-binding behavior. [Wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/) · [Worker and static asset routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/) · [Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)

## Rollback and failure alerts

- The edge rollback switch is `PRETTY_MENU_ROUTES=false`. It restores origin asset handling and keeps the API service binding operational. If the live edge integration is rolled back, actual printed slugs can return to their earlier HTTP status until the edge fix is restored. Keep routings reversible and record the deployed version before touching them.
- Roll back backend and frontend code without reversing the additive publications schema. A fixture restored from a backup was opened with the previous backend source, served the same public menu and image, and still exposed the revision records when the new backend was restored.
- Monitor the Worker structured event `auramenu_publication_failed` on 5xx publication responses. Use the staging Worker as the first alert source and group by Worker and event. Route it to an owner-approved destination. Trigger a controlled 503 in staging, verify the event and destination arrival, and record evidence before wiring production. Expected business denials such as stale revision conflicts do not emit this alert. The destination and delivery test are pending.
- Keep revision image retention in D1 for this release. Record growth and confirm a long-term policy before introducing any cleanup. Do not delete retained images as part of ordinary menu edits or rollback.

## Remaining release gates

- Remote staging publication and an approved full D1 staging backup/restore. The isolated fixture backup and application rollback passed.
- Real email/Google, inbox and second-device acceptance. Production has not been used for these tests.
- Actual apex/www ingress and physical QR/NFC probes under an approved production promotion.
- Alert destination approval and delivery drill.
- Explicit release approval before merge or production changes.
