/* AuraMenu feature symbols — one hand-drawn set (24px grid, 2px round strokes, tomato accent).
   Order matches the "feats" list in home.js. */
(function () {
  const A = 'fill="#D43B2E" stroke="none"';
  const P = [
    // 0 mobile menu
    `<rect x="6.5" y="2.5" width="11" height="19" rx="2.8"/><path d="M10.5 18.5h3"/><path d="M9.5 7h5M9.5 10h5M9.5 13h3"/><circle cx="15.5" cy="13" r="1.2" ${A}/>`,
    // 1 QR code
    `<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="5.6" y="5.6" width="1.8" height="1.8" rx=".4" ${A}/><path d="M14 14h2.5v2.5M21 14v.01M18.5 18.5H21V21M14 21h2.5"/>`,
    // 2 NFC tap
    `<rect x="3" y="7" width="12" height="13" rx="2.4"/><path d="M7 16.5h4"/><path d="M17.5 9.5a4 4 0 0 1 0 5"/><path d="M19.8 7.2a7.2 7.2 0 0 1 0 9.6"/><circle cx="9" cy="11.5" r="1.4" ${A}/>`,
    // 3 categories (tabs)
    `<rect x="2.5" y="4" width="8" height="5" rx="2.5" ${A}/><rect x="13" y="4" width="8.5" height="5" rx="2.5"/><path d="M3 14h18M3 18.5h12"/>`,
    // 4 product photos
    `<path d="M4 8h3l1.6-2.5h6.8L17 8h3a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 4 8Z"/><circle cx="12" cy="13.3" r="3.3"/><circle cx="12" cy="13.3" r="1.2" ${A}/>`,
    // 5 description & price (tag)
    `<path d="M3 12.6V4.5A1.5 1.5 0 0 1 4.5 3h8.1l8.4 8.4a1.5 1.5 0 0 1 0 2.1l-7.5 7.5a1.5 1.5 0 0 1-2.1 0Z"/><circle cx="7.8" cy="7.8" r="1.6" ${A}/><path d="M11 14l4-4"/>`,
    // 6 product details (plate & cutlery)
    `<circle cx="12" cy="12.5" r="6"/><circle cx="12" cy="12.5" r="2.6" ${A}/><path d="M3 4v5a1.5 1.5 0 0 0 1.5 1.5V21M4.5 4v4"/><path d="M21 4c-1.5 1-2 3-2 5.5h2V21"/>`,
    // 7 WhatsApp order (chat bubble + shopping bag)
    `<path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.3Z"/><path d="M8.3 10.5h7.4l-.7 5.5H9Z" ${A}/><path d="M10.2 10.5V9.6a1.8 1.8 0 0 1 3.6 0v.9"/>`,
    // 8 menu search
    `<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/><path d="M8 9.5c.6-1.3 1.7-2 3-2" /><circle cx="10.5" cy="12" r="1.3" ${A}/>`,
    // 9 address & opening hours
    `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/><circle cx="12" cy="12" r="1.3" ${A}/>`,
    // 10 multiple currencies
    `<circle cx="8" cy="8.5" r="5.8"/><text x="8" y="11.6" text-anchor="middle" font-size="9" font-weight="900" fill="currentColor" stroke="none" font-family="Arial,sans-serif">₺</text><circle cx="16.2" cy="15.6" r="5.8" ${A}/><text x="16.2" y="18.8" text-anchor="middle" font-size="9" font-weight="900" fill="#FFF6E8" stroke="none" font-family="Arial,sans-serif">$</text>`,
    // 11 TR · EN · AR (languages)
    `<path d="M2.5 5.5A2.5 2.5 0 0 1 5 3h6.5A2.5 2.5 0 0 1 14 5.5V10a2.5 2.5 0 0 1-2.5 2.5H7.5L4 15.5v-3A2.5 2.5 0 0 1 2.5 10Z"/><text x="8.2" y="10.6" text-anchor="middle" font-size="7.5" font-weight="800" fill="currentColor" stroke="none" font-family="Inter,Arial,sans-serif">A</text><path d="M10.5 15a2.5 2.5 0 0 0 2.5 2.5h3.5l3.5 3v-3a2.5 2.5 0 0 0 1.5-2.3V11A2.5 2.5 0 0 0 19 8.5h-2.5" fill="#D43B2E" stroke="currentColor"/><text x="16.4" y="16.3" text-anchor="middle" font-size="7" font-weight="800" fill="#FFF6E8" stroke="none" font-family="Cairo,Arial,sans-serif">ع</text>`,
    // 12 light / dark
    `<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" ${A}/>`,
    // 13 directions (pin + route)
    `<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4" ${A}/>`,
    // 14 Google review
    `<path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8L3.5 9.2l5.9-.8Z"/><path d="m12 7.5 1.3 2.7 2.9.4-2.1 2 .5 2.9L12 14.2" ${A}/>`,
    // 15 social media (megaphone)
    `<path d="M3 10v4a1 1 0 0 0 1 1h2l8 4.5V4.5L6 9H4a1 1 0 0 0-1 1Z"/><path d="M7 15l1.3 4.5h2.4L10 16.2"/><path d="M18 9a4 4 0 0 1 0 6"/><circle cx="20.5" cy="5.5" r="1.3" ${A}/>`,
    // 16 ingredients & allergens (wheat ear)
    `<path d="M12 22V6"/><ellipse cx="9.4" cy="8.4" rx="1.7" ry="3" transform="rotate(-35 9.4 8.4)"/><ellipse cx="14.6" cy="8.4" rx="1.7" ry="3" transform="rotate(35 14.6 8.4)"/><ellipse cx="9.4" cy="13" rx="1.7" ry="3" transform="rotate(-35 9.4 13)"/><ellipse cx="14.6" cy="13" rx="1.7" ry="3" transform="rotate(35 14.6 13)"/><ellipse cx="9.4" cy="17.6" rx="1.7" ry="3" transform="rotate(-35 9.4 17.6)" ${A}/><ellipse cx="14.6" cy="17.6" rx="1.7" ry="3" transform="rotate(35 14.6 17.6)" ${A}/><ellipse cx="12" cy="4" rx="1.5" ry="2.4"/>`,
    // 17 availability
    `<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9.5h7M7 14.5h5"/><circle cx="17" cy="9.5" r="1.6" ${A}/><circle cx="17" cy="14.5" r="1.6"/>`,
    // 18 food snake game
    `<path d="M3.5 19.5h9a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h7" stroke-width="3.4"/><circle cx="17" cy="7.5" r="2.6" fill="currentColor"/><circle cx="17.7" cy="6.8" r=".7" fill="#FFF6E8" stroke="none"/><path d="M19.6 7.5h1.6"/><circle cx="19" cy="17.5" r="2.4" ${A}/><path d="M19 15.1c0-.9.4-1.5 1.2-1.8"/>`,
    // 19 French
    `<path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7l-4.5 4v-4H6a3 3 0 0 1-3-3Z"/><path d="M6.5 6.5v7" stroke="#2B4AA8" stroke-width="2.6"/><path d="M9.6 6.5v7" stroke="#FFF6E8" stroke-width="2.6"/><path d="M12.7 6.5v7" stroke="#D43B2E" stroke-width="2.6"/><text x="17.2" y="12.6" text-anchor="middle" font-size="6.2" font-weight="800" fill="currentColor" stroke="none" font-family="Inter,Arial,sans-serif">FR</text>`,
  ];
  window.AuraFeatureIcons = P.map((d) => `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`);
})();
