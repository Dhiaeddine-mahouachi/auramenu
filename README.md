# AuraMenu

AuraMenu is a multilingual digital-menu storefront and customer menu builder. Turkish is the default interface; English and Arabic are also available.

## Important files

- `index.html` — landing page and design gallery
- `style.css` / `script.js` — landing page layout and language controls
- `builder.html` / `builder.js` — customer details, pricing and menu editor
- `status.html` / `status.js` — pending/approved request status
- `menu.html` / `menu.js` / `menu.css` — published menu renderer
- `config.js` — AuraDigital API and public URL configuration
- `a.html`–`d.html`, `1.html`–`4.html` — real English and Arabic design previews
- `preview.css` / `preview.js` — controls shared by all design previews
- `404.html` — clean custom-menu URL fallback for GitHub Pages

## Run locally

From this folder:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`. Local submissions are accepted by the configured AuraDigital API from port `4173`.

## Publishing flow

1. A customer chooses a design and submits the builder form.
2. The request appears red/pending in the AuraDigital admin dashboard.
3. The owner records payment and approves the request.
4. The request turns green and the custom URL becomes public, for example `https://auramenu.space/coffee1`.

The public menu endpoint never exposes the customer's private contact details, payment reference or internal owner note.
