# Sprint A progress

Updated 2026-11-28 (Europe/Istanbul). **Stabilization in progress. Production release gates are open.** Development branch in both repositories is `codex/auramenu-sprint-a-stabilization`. Baselines are AuraMenu `f8a0d71` and AuraDigital `4539927`. Production checks were read-only.

## Sprint A.2 follow-up

See [the Sprint A.2 release candidate](SPRINT_A_2_RELEASE.md) for the staging configuration, routing implementation, publication history, promotion sequence and remaining gates. See [the test report](SPRINT_A_TEST_REPORT.md) for local acceptance evidence.

| Phase | Result | Release work |
|---|---|---|
| A1 · Backlog | Recovered the local source at `36ae2c7` and reconciled 90 original IDs and 30 later rows. | Keep [the master backlog](AURAMENU_MASTER_BACKLOG.md) current. |
| A2 · Identity | AuraDigital is central. Worker tests cover verification gate, PKCE, one-time exchange, expiry, replay, host-only cookie and logout. | Verify real signup, email delivery, email/password, recovery, Google, session expiry and devices in staging. |
| A3 · Hub and Studio | Both read the same account-scoped menu records. New signed-in submissions attach in the creation transaction. Studio recognizes earlier builder-stored claim tokens. | Complete authenticated cross-origin browser test. Restaurant/workspace profile is still separate from account-scoped menu ownership. |
| A4 · Permissions | Worker tests verify role boundaries, denial for another account, removal, private drafts and pending image visibility. Studio save responses retain the actual staff role. | Complete two-restaurant staging coverage for billing, images and legacy token revocation. |
| A5 · Lifecycle | A staged-code Worker fixture verifies creation, admin payment confirmation, owner publication, public reads and a price/availability change. Studio adds a publish action after confirmation, with owner or manager access. | Exercise the full journey through real staged identity/proxy, QR download, physical scan and a second device. |
| A6 · Plans | Standard/Annual Premium restrictions, admin approval and legacy grants tested. Homepage and builder use the backend pricing API with a static fallback. | Generate static fallbacks plus FAQ and SEO copy from the same catalogue. Provider integration needs explicit authorization. |
| A7 · Drafts | Browser and Worker tests verify local recovery, cloud restore, conflict handling, stale deletes and concurrent updates. A failed published save preserves the public revision. | Persist published revision history and referenced image retention. Verify selected image recovery in drafts, which currently preserve form data separately from upload bytes. |
| A8 · Routing | Live published slug returns 404, with its JSON API and fallback HTML route returning 200. Cloudflare identified the current edge routes. | See the routing work below. |
| A9 · Regression | The design matrix passes all 720 cases. Neon and Ivory light-mode contrast issues were corrected. All 60 guest accessibility cases pass the automated scan. | Close the separate legacy browser suite and obtain real-device, full accessibility and field performance evidence. |
| A10 · Operations | Synthetic D1 export/import passed. Added a no-store AuraMenu readiness endpoint. Existing Worker observability was confirmed. | Rehearse full app restore and rollback in staging, verify production health after deployment, and test failed-publish alerts. |

## Routing ownership and rollout

- Both apex and www hosts already route `/api/auramenu/*`, `/login*`, `/brand/*` and legacy account paths through the existing `aurapops` Worker. The published slug falls through to the GitHub Pages origin and returns its 404 application shell. The static repository's `_redirects` file does not affect this observed origin behavior.
- Approve and stage an AuraMenu-scoped frontend edge handler on an isolated host. Preserve the existing API route authority and pass through static files, legacy paths, `/.well-known/` and known HTML routes. Match only a single safe slug segment. Resolve public data by the existing public menu contract, preserve query parameters, and keep existing links stable.
- An eligible menu should return 200 with escaped title, description, canonical, Open Graph, available share image and Restaurant JSON-LD. Unknown/unpublished slugs should return 404 and remain nonindexable. Transient upstream failures should return a retryable error and should not cache a 404. Verify HTML and HEAD status, crawler rendering, both hosts, preserved QR/NFC URLs and rollback using isolated routes before any live change.
- The older `/login` currently serves legacy account assets. Stage an AuraMenu-only redirect after checking legacy link use. The app's current public links use `/signin.html`, `/builder.html` and the homepage pricing section. `/pricing` and `/builder/` returned 404 and no current application link was found in the repository search. Browser bookmarks and external incoming links were not audited.

## Remaining owner decisions and access

- Approve an AuraMenu-specific staging hostname and an AuraMenu-only edge routing change. The existing AuraPops Worker and its production routes were left untouched.
- Cloudflare confirmed the staging D1 exists and the configured `auradigital-staging` Worker has not been deployed. Supply authorized test identities, inboxes and a staging admin for the two-origin browser flow. Confirm which isolated database and backup are approved for the full restore rehearsal.
- Enable R2 for the account if the image migration enters the current release. Cloudflare reports that R2 is disabled.
- Confirm the alert destination and release approach. The present AuraDigital workflow syncs `main` to the Cloudflare production ref. A tested-release/backup configuration exists on a separate operations branch and still needs an integration review.

The next sprint should close the staged identity and commercial acceptance gates, then ship and monitor the QR-safe routing fix. Keep production publication gated on the master backlog.

## Development commits

- AuraMenu `5aec673` · Draft recovery, active catalogue prices, Studio publication and browser QA.
- AuraMenu `1c0a456` · Contrast correction in light-mode Neon and Ivory.

### AuraDigital

- `d17d8fd` · Atomic account ownership and staff role responses.
- `a4b8a63` · Draft conflict and versioned cleanup protection.
- `5de1c8b` · Server-side subscription tier restrictions.
- `555caee` · Readiness endpoint and lifecycle coverage.
- `137def3` · Customer publication after admin confirmation.
