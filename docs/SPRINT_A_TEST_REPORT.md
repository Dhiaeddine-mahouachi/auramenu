# Sprint A test report

Executed 2026-11-28 (Europe/Istanbul). Baselines are AuraMenu `f8a0d71` and AuraDigital `4539927`. Verified development commits include AuraMenu `5aec673` and `1c0a456`, and AuraDigital `137def3`.

| Check | Environment | Result |
|---|---|---|
| AuraMenu `node --test tests/*.test.mjs` | Node 24 | 24 passed |
| AuraDigital `npm test` | Node 24, isolated SQLite Worker fixtures | 403 passed |
| AuraDigital `npm run deploy:check` | Wrangler dry run | Worker bundles; no deployment |
| `tests/auramenu-v2-browser.cjs` | Local Chromium | 30 designs × TR/EN/AR at 390 px; gallery/filter/preview, details, allergens, cart/currency, directions/reviews, search and Snake passed |
| `tests/auramenu-design-matrix.cjs` | Local Chromium; third-party requests blocked | 720/720 combinations (30 designs, 4 languages, 3 widths, 2 themes). Expected language, RTL, theme, categories and no horizontal overflow. No uncaught exceptions or local HTTP failures in this run. |
| Guest accessibility | axe-core WCAG 2/2.1 A and AA, Chromium at 390 px, English | 60/60 cases after correcting contrast in Neon and Ivory light mode. Full keyboard, non-English and physical-device accessibility testing remains open. |
| `tests/cloud-drafts-browser-smoke.mjs` | Local browser, controlled network responses | Offline startup and reload, recovery into a second browser context, conflict detection and explicit resolution passed |
| Worker security and lifecycle fixtures | Isolated local databases | PKCE expiry and replay protections, account ownership, roles, pending image visibility, admin activation, account publication, unchanged revision on publish retry, and public menu update passed |
| Synthetic D1 backup/restore | Separate local Wrangler persistence roots | Exported SQL, restored into an empty local DB, and verified the same published slug, revision, status and paid-through date |
| Studio publication smoke | Local Chromium, controlled API | Earlier builder token reaches claim, active paid draft still displays Pending, and successful publication changes the badge to Live |
| Pricing browser check | Local Chromium, controlled pricing API | Homepage and builder reflect API amounts. Builder uses the approved static fallback after a failed pricing response. |
| `assistant-browser-smoke.mjs` | Local Chromium, pinned QR script supplied locally | Passed extraction review, draft persistence, stale edit, CSV import and generated QR URL assertions |
| `voice-browser-smoke.mjs` | Local Chromium | Passed after updating the test to open the current Smart Fill disclosure |
| `design-browser-smoke.mjs` | Local Chromium | Older template suite stops at the removed “Browse all 30 designs” homepage selector. Remaining assertions of that legacy suite were not reached. The current gallery and production design engine have the separate passing suites above. |

## Production read-only probes

| URL at auramenu.space | HTTP | Result |
|---|---:|---|
| `/`, `/index.html`, `/builder.html`, `/signin.html` | 200 | Document entry points available |
| `/moka` | 404 | GitHub Pages application shell; no slug-specific meta/canonical in the HTTP document |
| `/menu.html?slug=moka` | 200 | Working HTML fallback entry |
| `/api/auramenu/sites/moka` | 200 | Public menu JSON available |
| `/api/auramenu/designs`, `/api/auramenu/pricing`, `/api/auramenu/account/session` | 200 | Public or signed-out read-only responses |
| `/login`, `/account.js`, `/account.css` | 200 | Older login page with available legacy assets; current sign-in is `/signin.html` |
| `/pricing`, `/builder/` | 404 | Current source links to homepage pricing and `/builder.html` |

The suite used synthetic browser/API accounts and local fixtures. Provider-backed authentication, physical QR/NFC scans, a complete current accessibility sweep, real offline device behavior, production cache invalidation and a full staged D1 recovery remain open. Prior accessibility and offline results are retained in [the previous test report](TEST_REPORT.md).

## Performance method

Run `tests/auramenu-performance.cjs` against a local static server with Playwright and Chromium. Ten cold contexts per page, 390 × 844 viewport, 4× CPU slowdown, 150 ms latency, 200 kB/s download and a 3.5 s observation window after DOMContentLoaded. External requests are blocked. Report the nearest-rank p75 of local LCP and CLS. These samples do not measure real visitor INP or field Core Web Vitals.


| Local sample | p75 LCP | p75 CLS |
|---|---:|---:|
| Homepage, English | 2.408 s | 0.005 |
| Sofra Standard gallery menu | 3.328 s | 0.005 |
| Velvet Premium gallery menu | 1.816 s | 0.052 |

Sofra exceeded the 2.5 s target under these lab conditions. Use the same cold-cache profile to isolate large guest assets before rechecking deployed field performance. Field p75 and INP were not measured.
