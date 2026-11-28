# AuraMenu recovery

On 2026-11-28, Wrangler exported and restored a synthetic menu database into a separate local persistence root. The slug, revision, approval state and billing expiry matched. The full app restore using approved staging data remains open. Cloudflare D1 metadata confirms `auradigital-staging-db` exists separately from production. See [Sprint A tests](SPRINT_A_TEST_REPORT.md).

## What must be recoverable
Include ownership, team, account drafts, audit and identity references as well as menu contents and images. Core data in D1 `auradigital-db` includes `auramenu_menu_owners`, `auramenu_menu_members`, `auramenu_cloud_drafts`, `auramenu_team_audit`, `auramenu_requests`, `auramenu_design_settings`, `auramenu_billing`, `auramenu_edit_access`, `auramenu_images`, `auramenu_images_request`, `auramenu_self_price`, `menu_drafts`, `hub_menu_reviews`. Site and worker code are in Git.

## Backup (run by Dhia, from a machine with wrangler logged in)
```bash
npx wrangler d1 export auradigital-db --remote --output backups/auradigital-$(date +%F).sql
```
Store the file outside the repo (it contains customer contact data). Keep at least the last 4 weekly exports under encryption with access limited to recovery operators. D1 Time Travel covers the last 7 days on Workers Free or 30 days on Workers Paid. Check the actual account plan and available bookmark before an incident. [Cloudflare Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/).
```bash
npx wrangler d1 time-travel info auradigital-db
```

## Restore test (isolated)
```bash
npx wrangler d1 create auradigital-restore-test
npx wrangler d1 execute auradigital-restore-test --remote --file backups/auradigital-YYYY-MM-DD.sql
npx wrangler d1 execute auradigital-restore-test --remote --command "SELECT COUNT(*) FROM auramenu_requests"
```
Compare counts, selected revisions, role mappings, published states and media references against the approved source. Point the isolated staging app at the restored database and run read-only guest and authenticated checks. Retain or remove the test database according to the owner’s data-handling decision. Record evidence in `SPRINT_A_TEST_REPORT.md`.

## Production restore (only after an incident, with a fresh export first)
`npx wrangler d1 time-travel restore auradigital-db --timestamp=<ISO time>` — this replaces the live database; existing QR codes keep working because slugs are restored with it.
