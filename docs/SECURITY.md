# AuraMenu security notes (Sprint 0)

## Verified
- API responses: `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'`, HSTS (1y, subdomains), `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`.
- CORS allow-list on the worker includes `https://auramenu.space`, `https://www.auramenu.space`.
- Public menu endpoint exposes only public fields; contact name/phone, email, payment reference and notes are excluded.
- Menu tokens are stored hashed (SHA-256) in `auramenu_edit_access`; 32-byte random tokens.
- Presentation input is normalised server-side: URLs must be http(s) without credentials, colours must be `#RRGGBB`, video must be a direct MP4/WebM link, hours must match `HH:MM-HH:MM`.
- Menu engine escapes all menu text before rendering (`esc()`); `safeVideo()` only accepts http(s) media URLs.
- Offline service worker never caches `/api/*` except public menu reads.

## Open issues
| ID | P | Issue | Action |
|---|---|---|---|
| SEC-1 | P0 | Menu management authorised only by a bearer token in localStorage; no account binding, no roles, no revocation UI. | A-2/A-3 in backlog. |
| SEC-2 | P1 | Site pages have no CSP/HSTS/XFO (GitHub Pages cannot send headers). | Cloudflare Transform Rule or worker route (BLK-2). |
| SEC-3 | P1 | Two identity providers (AuraPops, AuraDigital). | A-1 (BLK-1). |
| SEC-4 | P1 | Tenant-isolation tests do not exist for AuraMenu endpoints. | Write after A-2: one restaurant must never read/write another's menu, drafts, images or billing. Release blocker. |
| SEC-5 | P2 | Rate limiting on `/api/auramenu/requests` and image upload not verified in this audit; Turnstile keys exist in config. | Verify + test. |
| SEC-6 | P2 | Admin actions on menus are not written to an audit log. | Add `auramenu_audit` rows on approve/payment/renew. |

Never: share cookies between auramenu.space and auradigitalworks.com; expose private customer data on public menu routes; trust front-end checks for premium access.
