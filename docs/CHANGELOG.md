# AuraMenu changelog

## 2026-11-27
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
