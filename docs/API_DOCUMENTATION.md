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

## Account endpoints in use by AuraMenu today
`/api/aurapops/account/{session,login,logout,register,verification/send,verification/confirm}` — AuraPops worker (to be replaced, see A-1).
AuraDigital identity (target): `/api/customer/{session,login,logout,register,google/start,google/callback,verify,forgot-password,…}`.
