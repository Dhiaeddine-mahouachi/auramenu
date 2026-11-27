# AuraMenu recovery

Status: **procedure written, not yet tested** (BLK-5: no D1 access from the build environment). Never run restore tests against production.

## What must be recoverable
D1 `auradigital-db` tables: `auramenu_requests`, `auramenu_design_settings`, `auramenu_billing`, `auramenu_edit_access`, `auramenu_images`, `auramenu_images_request`, `auramenu_self_price`, `menu_drafts`, `hub_menu_reviews`. Site and worker code are in Git.

## Backup (run by Dhia, from a machine with wrangler logged in)
```bash
npx wrangler d1 export auradigital-db --remote --output backups/auradigital-$(date +%F).sql
```
Store the file outside the repo (it contains customer contact data). Keep at least the last 4 weekly exports. Cloudflare D1 Time Travel also allows restoring to any point in the last 30 days:
```bash
npx wrangler d1 time-travel info auradigital-db
```

## Restore test (isolated)
```bash
npx wrangler d1 create auradigital-restore-test
npx wrangler d1 execute auradigital-restore-test --remote --file backups/auradigital-YYYY-MM-DD.sql
npx wrangler d1 execute auradigital-restore-test --remote --command "SELECT COUNT(*) FROM auramenu_requests"
```
Compare counts with production, then delete the test database. Record the result in `TEST_REPORT.md`.

## Production restore (only after an incident, with a fresh export first)
`npx wrangler d1 time-travel restore auradigital-db --timestamp=<ISO time>` — this replaces the live database; existing QR codes keep working because slugs are restored with it.
