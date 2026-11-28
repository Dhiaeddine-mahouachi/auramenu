# AuraMenu changelog

## 2026-11-28 · Sprint A development branches

- Reconciled 90 original backlog tasks and 30 Sprint 0/Sprint A rows.
- New signed-in submissions bind the menu to the AuraDigital account in the creation transaction. Studio accepts the builder’s earlier claim key, and staff save responses retain their role.
- Activated subscription menus can be published by an authorized owner or manager through Studio. Pending paid menus retain their pending badge until public approval.
- Cloud drafts protect against writes without a current version, recover offline startup, and only clear the version the submitting device saw.
- Tightened plan tier enforcement while retaining one-time menu grants. Added an AuraMenu readiness response and expanded lifecycle, draft and design regression coverage.
- Corrected heading and category-number contrast in Neon and Ivory light mode.
- Live route ownership verified. No production deployment from these branches.
## 2026-11-28
- Builder is a 5-step wizard (Plan → Restaurant → Menu → Look → Register), one screen per step with checks before moving on. Removed: description, city, payment note, email-code verification, the QR designer (QR is in Studio). Registration needs a signed-in AuraDigital account; the account owns the menu at once.
- Status page shows a live tracker (registered → payment confirmed → live) and refreshes itself every 15 s until the menu is live.

## 2026-11-27
- Designs follow the plan: Standard and Annual show and accept only the 15 standard designs, Premium only the 15 premium designs (builder, Studio, pricing cards, FAQ; enforced by the backend). Choosing a premium design from the gallery selects the Premium plan.
- Staff roles per menu: owner, manager, editor (Team tab in Studio). Editors change items, prices and stock; managers also design and info; plan and team stay with the owner. Enforced on the server.
- AuraHub has an AuraMenu page listing the same menus with your role.
- Builder drafts are saved to your AuraDigital account and continue on another device.
- AuraMenu sign-in is AuraDigital-only; the old AuraMenu (AuraPops) login was removed.
- Menus are linked to the AuraDigital account the first time the owner opens Studio signed in. After that, "My menus" opens them on any device without the old browser key.
- Sign in to AuraMenu Studio with the AuraDigital account (Google or email, same as AuraHub). auramenu.space gets its own session through a one-time code with PKCE; no cookies are shared between domains. The older AuraMenu (AuraPops) sign-in still works below it.
- Pricing: Standard 399 TL/month, Premium 599 TL/month, Annual 2,500 TL/year (site, builder, FAQ, SEO pages, backend). The one-time plan is no longer sold; existing one-time contracts keep their terms.
- Public menus cached at the edge for 60 s, cleared when the owner saves or an admin changes status.
- `legacy-index.html` (old home page with old pricing) now redirects to `/`.
- Sprint 0 audit documents: backlog, architecture, security, health audit, API, deployment, recovery, test report.
- 10 new Turkish SEO guides + `/qr-menu-rehberi.html` hub; sitemap now 21 URLs.
- New favicon (Bordeaux tile, saffron cloche) across all pages; `favicon.ico`, `apple-touch-icon.png`.
- "Guests find everything" section uses 20 drawn symbols (`am2/feature-icons.js`).
- Backend (auradigital `a43966d`): restaurant video, weekly hours, "limited" availability, French translations.
- Offline public menus (`/menu-sw.js`).
- French guest interface for all 30 designs; contrast-safe accent text (WCAG AA).
- Sign-in moved to `/signin.html`, site assets to `am2/` (edge worker owns `/login*`, `/brand/*`).

## 2026-11-26
- AuraMenu 2.0 identity merged: 30 designs (std-01…15, pre-16…30), new home, gallery, builder skin, Studio.
