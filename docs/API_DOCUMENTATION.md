# AuraMenu API (served by the `auradigital` worker)

Base: `https://auramenu.space/api/auramenu` (also reachable on auradigitalworks.com). JSON in/out.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/designs` | none | Design IDs enabled on this server: `{standard:[std-01…], premium:[pre-16…]}` |
| GET | `/pricing` | none | Plan prices from `MENU_PLANS` |
| POST | `/requests` | Turnstile (when configured) | Create a menu request; returns id + one-time menu token |
| GET | `/requests/:id` | menu token | Request status |
| GET | `/sites/:slug` | none | Published public menu (404 if not live/paid) |
| GET/PATCH | `/dashboard/:id` | `X-Aura-Menu-Token` | Read/save menu (categories, presentation, template) |
| POST | `/dashboard/:id/claim` | `X-Aura-Menu-Token` | Validate token on a device |
| POST/GET | `/images/…` | menu token | Upload/serve menu images (D1) |
| * | `/api/hub/workspaces/:org/menu-drafts[/:id]` | AuraDigital session + workspace role | Cloud drafts (disabled: `MENU_DRAFTS_ENABLED=false`) |

## Menu payload (PATCH `/dashboard/:id`)
```json
{
  "templateId": "std-01",
  "businessName": "…", "address": "…", "whatsapp": "+90…", "currency": "TRY",
  "openingHours": "mon 09:00-23:00; tue closed; …",
  "restaurant": {
    "logo": "https://…", "cover": "https://…",
    "links": {"instagram":"https://…","review":"https://…","directions":"https://…"},
    "video": {"src": "https://…/kitchen.mp4", "poster": "https://…/p.jpg"},
    "hours": {"mon":"09:00-23:00","tue":"", "…": "…"}
  },
  "design": {"accent":"#2E7D5B","primary":"#2E7D5B","background":"#F8EFE2","images":true,"prices":true,"play":true},
  "categories": [{"name":"Kebaplar","items":[{
     "name":"Adana","price":"520","description":"…",
     "available": true | false | "limited",
     "bestseller": true,
     "translations": {"name":{"en":"…","ar":"…","fr":"…"}},
     "allergens":[{"en":"Milk"}], "ingredients":[{"tr":"kuzu"}],
     "variants":[{"name":{"en":"Large"},"price":"620"}]
  }]}]
}
```
Validation lives in `src/auramenu-designs.js` (`normalizeMenuPresentation`, `normalizeItemMetadata`).

## AuraDigital account sign-in (since 2026-11-27)
| Method | Path | Where | Purpose |
|---|---|---|---|
| GET | `/api/auramenu/connect?challenge=<S256>&state=<random>` | auradigitalworks.com | Signed-in, verified customer → 303 to `auramenu.space/signin.html#code=…&state=…` (code valid 2 min, single use). Signed out → AuraHub login, then back. |
| POST | `/api/auramenu/connect/exchange` `{code, verifier}` | auramenu.space | Checks PKCE, issues `__Host-auramenu_customer` (HttpOnly, Secure, Lax, 7 days). Session row lives in `customer_sessions`. |
| GET | `/api/auramenu/account/session` | auramenu.space | `{user}` or `{user:null}` |
| POST | `/api/auramenu/account/logout` | auramenu.space | Ends the AuraMenu session |
| GET | `/api/auramenu/account/menus` | auramenu.space | Menus the signed-in account owns or helps manage, with `role` |
| GET/POST | `/api/auramenu/account/menus/:id/members` | auramenu.space | Team list (manager+) / add `{email, role: manager|editor}` (owner; verified AuraDigital account required) |
| DELETE | `/api/auramenu/account/menus/:id/members/:customerId` | auramenu.space | Owner removes a member; a member can remove themself |
| GET/PUT/DELETE | `/api/auramenu/account/drafts[/:id]` | auramenu.space | Private cloud drafts (max 5 × 256 KB, `baseVersion` conflict check → 409) |
| GET | `/api/auramenu/hub/menus` | auradigitalworks.com | Same menu list for AuraHub (AuraDigital session) |

Dashboard routes accept either `X-Aura-Menu-Token` or the owner's AuraMenu session. `POST /dashboard/:id/claim` with a valid token while signed in links an unowned menu (`owned: true`); a menu already owned by another account is never moved.

## Account endpoints in use by AuraMenu today
`/api/aurapops/account/{session,login,logout,register,verification/send,verification/confirm}` — AuraPops worker (to be replaced, see A-1).
AuraDigital identity (target): `/api/customer/{session,login,logout,register,google/start,google/callback,verify,forgot-password,…}`.
