/* AuraMenu 2.0 — the 25-design collection (15 standard + 10 premium).
   Every design uses the same engine and data model; only presentation changes.
   Layout vocabulary (see engine.css):
     hero:  cover | arch | split | poster | board | minimal | frame | magazine | orbit
     nav:   pills | underline | tiles | chalk | numbered
     list:  rows | grid | editorial | board | stack | polaroid | carousel | chapters
     motif: tiles | checker | dots | stripes | waves | chalk | kufi | blobs | ottoman | none
     fx (premium): kenburns | reveal | tilt | parallax | embers | neon | plate3d | sticky | waves | shimmer | marquee | stickers */
(function () {
  "use strict";
  const C = (bg, surface, text, muted, line) => ({ bg, surface, text, muted, line });

  const designs = [
    // ── STANDARD COLLECTION (15) ──────────────────────────────────────────────
    { id: "sofra", name: "Sofra", tier: "standard", collection: "heritage", set: "grill",
      restaurant: { name: "Sofra Ocakbaşı", tagline: { tr: "Közün başında, sofranın ortasında.", en: "Around the coals, at the heart of the table.", ar: "حول الجمر، في قلب المائدة." } },
      mode: "light", light: C("#F8EFE2", "#FFF9F0", "#24191E", "#6B5450", "#E2CDB6"), dark: C("#1C1317", "#2A1D22", "#F8EFE2", "#CDB8AA", "#4A3239"),
      accent: "#D43B2E", accent2: "#1F5F8B", onAccent: "#FFF9F0",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 18,
      hero: "arch", nav: "pills", list: "rows", motif: "tiles", fx: [] },

    { id: "simit", name: "Simit", tier: "standard", collection: "heritage", set: "breakfast",
      restaurant: { name: "Simit & Sabah", tagline: { tr: "Günaydın! Çay demlendi.", en: "Good morning! The tea is brewed.", ar: "صباح الخير! الشاي جاهز." } },
      mode: "light", light: C("#FFF3E2", "#FFFFFF", "#3B1F14", "#7B5A48", "#F0D7BC"), dark: C("#21140E", "#2E1D15", "#FFF3E2", "#D8BBA4", "#4B3123"),
      accent: "#D86A41", accent2: "#6E2037", onAccent: "#FFFFFF",
      font: { display: "Caveat", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 14,
      hero: "split", nav: "underline", list: "polaroid", motif: "dots", fx: [] },

    { id: "kahve", name: "Kahve", tier: "standard", collection: "minimal", set: "coffee",
      restaurant: { name: "Kahve Durağı", tagline: { tr: "Yavaş demle, iyi sohbet.", en: "Slow brew, good company.", ar: "تخمير بطيء، صحبة طيبة." } },
      mode: "light", light: C("#F3F0EA", "#FFFFFF", "#1B1B1B", "#6C6762", "#DAD4CA"), dark: C("#141312", "#1E1C1A", "#F3F0EA", "#AFA89E", "#34302C"),
      accent: "#6E2037", accent2: "#C08A4A", onAccent: "#FFFFFF",
      font: { display: "Space Grotesk", body: "Inter", ar: "Cairo" }, radius: 4,
      hero: "minimal", nav: "underline", list: "board", motif: "none", fx: [] },

    { id: "pazar", name: "Pazar", tier: "standard", collection: "street", set: "street",
      restaurant: { name: "Pazar Street Food", tagline: { tr: "Sokağın en lezzetli köşesi.", en: "The tastiest corner of the street.", ar: "ألذ زاوية في الشارع." } },
      mode: "light", light: C("#F5BD43", "#FFFDF6", "#24191E", "#5A4433", "#24191E"), dark: C("#191412", "#262019", "#F5BD43", "#E4C98C", "#4A3A22"),
      accent: "#6E2037", accent2: "#D43B2E", onAccent: "#FFFDF6",
      font: { display: "Bebas Neue", body: "Inter", ar: "Reem Kufi" }, radius: 6, upper: true,
      hero: "poster", nav: "pills", list: "stack", motif: "checker", card: "ticket", fx: [] },

    { id: "smash", name: "Smash Club", tier: "standard", collection: "street", set: "street",
      restaurant: { name: "Smash Club", tagline: { tr: "Ez. Kızart. Ye. Tekrarla.", en: "Smash. Sear. Eat. Repeat.", ar: "اضغط. اشوِ. كُل. كرّر." } },
      mode: "light", light: C("#D43B2E", "#FFF6E8", "#24191E", "#6B4A3F", "#24191E"), dark: C("#170D0C", "#251816", "#FFF6E8", "#E5BDB0", "#4A2620"),
      accent: "#F5BD43", accent2: "#24191E", onAccent: "#24191E",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 22, upper: true,
      hero: "poster", nav: "tiles", list: "grid", motif: "stripes", fx: [] },

    { id: "bahce", name: "Bahçe", tier: "standard", collection: "mediterranean", set: "garden",
      restaurant: { name: "Bahçe Mutfak", tagline: { tr: "Bahçeden tabağa, bugün.", en: "From the garden to the plate, today.", ar: "من الحديقة إلى الطبق، اليوم." } },
      mode: "light", light: C("#EEF0DF", "#FBFBF3", "#23301A", "#5E6B4E", "#D3D8BC"), dark: C("#141A10", "#1D2517", "#EEF0DF", "#B6C0A0", "#334028"),
      accent: "#778A3D", accent2: "#D86A41", onAccent: "#FBFBF3",
      font: { display: "Fraunces", body: "Inter", ar: "Amiri" }, radius: 20,
      hero: "split", nav: "pills", list: "editorial", motif: "dots", fx: [] },

    { id: "medina", name: "Medina", tier: "standard", collection: "mediterranean", set: "tunisian",
      restaurant: { name: "Dar Medina", tagline: { tr: "Sidi Bou Said'den sofranıza.", en: "From Sidi Bou Said to your table.", ar: "من سيدي بوسعيد إلى مائدتك.", fr: "De Sidi Bou Saïd à votre table." } },
      mode: "light", light: C("#F7F4EC", "#FFFFFF", "#14243F", "#55617A", "#D9DEE8"), dark: C("#0D1526", "#152038", "#F7F4EC", "#B5BFD3", "#2A3A5C"),
      accent: "#1E5AA8", accent2: "#F5BD43", onAccent: "#FFFFFF",
      font: { display: "Fraunces", body: "Inter", ar: "Reem Kufi" }, radius: 26,
      hero: "arch", nav: "underline", list: "rows", motif: "kufi", fx: [] },

    { id: "lokanta", name: "Lokanta", tier: "standard", collection: "heritage", set: "grill",
      restaurant: { name: "Esnaf Lokantası", tagline: { tr: "Bugün ocakta ne var?", en: "What's on the stove today?", ar: "ماذا على النار اليوم؟" } },
      mode: "dark", light: C("#F3EEDF", "#FFFDF6", "#1F3A2E", "#4E6658", "#CFC6AE"), dark: C("#1F3A2E", "#25443A", "#F3EEDF", "#C6D3C4", "#3E5E50"),
      accent: "#F5BD43", accent2: "#F7B68B", onAccent: "#1F3A2E",
      font: { display: "Caveat", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 8,
      hero: "board", nav: "chalk", list: "board", motif: "chalk", fx: [] },

    { id: "tatli", name: "Tatlı", tier: "standard", collection: "minimal", set: "dessert",
      restaurant: { name: "Tatlı Atölye", tagline: { tr: "Bir dilim mutluluk.", en: "A slice of happiness.", ar: "قطعة من السعادة." } },
      mode: "light", light: C("#FCE9E6", "#FFFFFF", "#4A1F2B", "#8A5A64", "#F2C9C6"), dark: C("#1E1115", "#2B1820", "#FCE9E6", "#D9AEB6", "#4D2A35"),
      accent: "#D9576B", accent2: "#F5BD43", onAccent: "#FFFFFF",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 28,
      hero: "arch", nav: "pills", list: "grid", motif: "dots", fx: [] },

    { id: "tasfirin", name: "Taş Fırın", tier: "standard", collection: "heritage", set: "pizza",
      restaurant: { name: "Taş Fırın", tagline: { tr: "Odun ateşi, ince hamur.", en: "Wood fire, thin crust.", ar: "نار الحطب، عجينة رقيقة." } },
      mode: "light", light: C("#FFF7EC", "#FFFFFF", "#2A1712", "#735446", "#EBD6C0"), dark: C("#1C1210", "#2A1C18", "#FFF7EC", "#D7BCA9", "#4C3229"),
      accent: "#6E2037", accent2: "#F5BD43", onAccent: "#FFF7EC",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 16,
      hero: "split", nav: "tiles", list: "carousel", motif: "none", fx: [] },

    { id: "bistro", name: "Bistro", tier: "standard", collection: "minimal", set: "meze",
      restaurant: { name: "Bistro Lumen", tagline: { tr: "Küçük masa, büyük lezzet.", en: "Small tables, big flavour.", ar: "طاولات صغيرة، نكهة كبيرة.", fr: "Petites tables, grandes saveurs." } },
      mode: "light", light: C("#FFFFFF", "#FAFAF7", "#111111", "#5F5F5F", "#E4E4E0"), dark: C("#0F0F0F", "#191919", "#F4F4F0", "#A8A8A4", "#2E2E2E"),
      accent: "#D43B2E", accent2: "#111111", onAccent: "#FFFFFF",
      font: { display: "Playfair Display", body: "Inter", ar: "Amiri" }, radius: 0, italic: true,
      hero: "magazine", nav: "numbered", list: "board", motif: "none", fx: [] },

    { id: "taze", name: "Taze Lab", tier: "standard", collection: "street", set: "garden",
      restaurant: { name: "Taze Lab", tagline: { tr: "Renkli, taze, bol vitaminli.", en: "Colourful, fresh, full of good stuff.", ar: "ملون، طازج، مليء بالفيتامينات." } },
      mode: "light", light: C("#FFFFFF", "#FFF6EA", "#1F2A12", "#5A6448", "#F1E2CC"), dark: C("#11160A", "#1B2311", "#FFF6EA", "#C9D2B5", "#2F3B1E"),
      accent: "#F28C28", accent2: "#8CB33E", onAccent: "#FFFFFF",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 999,
      hero: "poster", nav: "pills", list: "grid", motif: "blobs", fx: [] },

    { id: "meyhane", name: "Meyhane", tier: "standard", collection: "mediterranean", set: "meze",
      restaurant: { name: "Meyhane Mavi", tagline: { tr: "Boğaz'a karşı, meze sofrası.", en: "A meze table facing the Bosphorus.", ar: "مائدة مازة مطلة على البوسفور." } },
      mode: "dark", light: C("#F6EEDD", "#FFFBF2", "#12263F", "#4C5C72", "#DCCFB6"), dark: C("#12263F", "#18304E", "#F6EEDD", "#C2C8D2", "#2B4566"),
      accent: "#F5BD43", accent2: "#F7B68B", onAccent: "#12263F",
      font: { display: "Fraunces", body: "Inter", ar: "Amiri" }, radius: 12, italic: true,
      hero: "frame", nav: "underline", list: "rows", motif: "waves", fx: [] },

    { id: "kantin", name: "Kantin", tier: "standard", collection: "minimal", set: "pizza",
      restaurant: { name: "Kantin No.7", tagline: { tr: "Hızlı, temiz, her gün.", en: "Fast, clean, every day.", ar: "سريع، نظيف، كل يوم." } },
      mode: "light", light: C("#F4F4F2", "#FFFFFF", "#1D1D1F", "#6E6E73", "#E2E2DE"), dark: C("#111112", "#1C1C1E", "#F4F4F2", "#A1A1A6", "#2C2C2E"),
      accent: "#6E2037", accent2: "#F5BD43", onAccent: "#FFFFFF",
      font: { display: "Inter", body: "Inter", ar: "Cairo" }, radius: 14,
      hero: "cover", nav: "pills", list: "rows", motif: "none", fx: [] },

    { id: "aura", name: "Aura Classic", tier: "standard", collection: "signature", set: "breakfast",
      restaurant: { name: "Günaydın Kafe", tagline: { tr: "Bakalım ocakta ne pişiyor!", en: "See what's cooking!", ar: "لنرَ ماذا يُطهى!" } },
      mode: "light", light: C("#F8EFE2", "#FFF9F0", "#24191E", "#6B5450", "#E2CDB6"), dark: C("#1C1317", "#2A1D22", "#F8EFE2", "#CDB8AA", "#4A3239"),
      accent: "#6E2037", accent2: "#F5BD43", onAccent: "#F8EFE2",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 20,
      hero: "arch", nav: "pills", list: "grid", motif: "dots", card: "printed", fx: [] },

    // ── PREMIUM COLLECTION (10) ───────────────────────────────────────────────
    { id: "noir", name: "Noir", tier: "premium", collection: "signature", set: "fine",
      restaurant: { name: "Noir", tagline: { tr: "Ateş, zaman ve sabır.", en: "Fire, time and patience.", ar: "نار، وقت، وصبر." } },
      mode: "dark", light: C("#F4EFE6", "#FFFFFF", "#141210", "#6A6157", "#DED5C6"), dark: C("#0E0C0B", "#181513", "#EDE3D1", "#A89C8A", "#2C2621"),
      accent: "#C9A45C", accent2: "#EDE3D1", onAccent: "#0E0C0B",
      font: { display: "Playfair Display", body: "Inter", ar: "Amiri" }, radius: 2, italic: true,
      hero: "cover", nav: "numbered", list: "editorial", motif: "none", fx: ["kenburns", "reveal"] },

    { id: "kor", name: "Kor", tier: "premium", collection: "motion", set: "grill",
      restaurant: { name: "Kor Ocakbaşı", tagline: { tr: "Kor sönmeden gel.", en: "Come before the embers fade.", ar: "تعال قبل أن يخبو الجمر." } },
      mode: "dark", light: C("#FFF3E8", "#FFFFFF", "#2A120A", "#7A5644", "#F0D3BD"), dark: C("#140B08", "#21130E", "#FBE9D7", "#D2B29C", "#3D2419"),
      accent: "#FF7A2F", accent2: "#F5BD43", onAccent: "#140B08",
      font: { display: "Bebas Neue", body: "Inter", ar: "Reem Kufi" }, radius: 10, upper: true,
      hero: "cover", nav: "pills", list: "grid", motif: "none", fx: ["embers", "tilt", "reveal"] },

    { id: "lumiere", name: "Lumière", tier: "premium", collection: "signature", set: "meze",
      restaurant: { name: "Lumière", tagline: { tr: "Akdeniz ışığında bir akşam.", en: "An evening in Mediterranean light.", ar: "أمسية في ضوء المتوسط.", fr: "Une soirée sous la lumière méditerranéenne." } },
      mode: "light", light: C("#F6F1E7", "#FFFDF8", "#1F1A17", "#6C625A", "#E1D7C7"), dark: C("#14110F", "#1E1A17", "#F6F1E7", "#B9AEA2", "#352E28"),
      accent: "#6E2037", accent2: "#C9A45C", onAccent: "#F6F1E7",
      font: { display: "Fraunces", body: "Inter", ar: "Amiri" }, radius: 0, italic: true,
      hero: "magazine", nav: "numbered", list: "editorial", motif: "none", fx: ["parallax", "reveal"] },

    { id: "orbit", name: "Orbit", tier: "premium", collection: "motion", set: "pizza",
      restaurant: { name: "Orbit Pizza", tagline: { tr: "Dilimler yörüngede.", en: "Slices in orbit.", ar: "شرائح في المدار." } },
      mode: "dark", light: C("#FFF6E6", "#FFFFFF", "#24191E", "#6B5450", "#EAD7BD"), dark: C("#24191E", "#2F2228", "#F8EFE2", "#CDB8AA", "#4A3239"),
      accent: "#F5BD43", accent2: "#D43B2E", onAccent: "#24191E",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 24,
      hero: "orbit", nav: "tiles", list: "grid", motif: "dots", fx: ["plate3d", "tilt"] },

    { id: "neon", name: "Neon", tier: "premium", collection: "motion", set: "bar",
      restaurant: { name: "Neon Gece", tagline: { tr: "Işıklar yandı, bar açık.", en: "Lights on. Bar's open.", ar: "الأضواء مشتعلة، البار مفتوح." } },
      mode: "dark", light: C("#F7F1FF", "#FFFFFF", "#1A0F2B", "#6A5A80", "#E2D6F2"), dark: C("#0B0612", "#160D22", "#F3E8FF", "#BBA8D6", "#2F1F45"),
      accent: "#FF3EA5", accent2: "#3EF0FF", onAccent: "#0B0612",
      font: { display: "Baloo 2", body: "Space Grotesk", ar: "Reem Kufi" }, radius: 16,
      hero: "poster", nav: "pills", list: "rows", motif: "none", fx: ["neon", "reveal"] },

    { id: "saray", name: "Saray", tier: "premium", collection: "signature", set: "grill",
      restaurant: { name: "Saray Sofrası", tagline: { tr: "Saray mutfağından tarifler.", en: "Recipes from the palace kitchen.", ar: "وصفات من مطبخ القصر." } },
      mode: "dark", light: C("#FBF3E4", "#FFFFFF", "#4A0E1E", "#7A4A52", "#E8D2AE"), dark: C("#3A0B17", "#4A0E1E", "#F7E7C6", "#D8BD9A", "#6B2A38"),
      accent: "#D4A64A", accent2: "#F7E7C6", onAccent: "#3A0B17",
      font: { display: "Playfair Display", body: "Inter", ar: "Amiri" }, radius: 6,
      hero: "frame", nav: "underline", list: "rows", motif: "ottoman", card: "framed", fx: ["shimmer", "reveal"] },

    { id: "katman", name: "Katman", tier: "premium", collection: "motion", set: "street",
      restaurant: { name: "Katman Burger", tagline: { tr: "Kat kat lezzet.", en: "Layer upon layer.", ar: "طبقة فوق طبقة." } },
      mode: "dark", light: C("#FFF4DA", "#FFFFFF", "#111111", "#5D5546", "#EADFC4"), dark: C("#111111", "#1C1C1C", "#FFF4DA", "#C9BFA6", "#333333"),
      accent: "#F5BD43", accent2: "#D43B2E", onAccent: "#111111",
      font: { display: "Bebas Neue", body: "Inter", ar: "Reem Kufi" }, radius: 28, upper: true,
      hero: "poster", nav: "pills", list: "stack", motif: "none", fx: ["sticky", "tilt"] },

    { id: "riviera", name: "Riviera", tier: "premium", collection: "mediterranean", set: "meze",
      restaurant: { name: "Riviera Balık", tagline: { tr: "Denizden geldi, sofraya kondu.", en: "Straight from the sea to the table.", ar: "من البحر مباشرة إلى المائدة." } },
      mode: "light", light: C("#EAF3F7", "#FFFFFF", "#0F2C46", "#4C6378", "#C9DCE6"), dark: C("#08192A", "#0F2438", "#EAF3F7", "#A9C0D1", "#1F3B57"),
      accent: "#1E5AA8", accent2: "#F7B68B", onAccent: "#FFFFFF",
      font: { display: "Fraunces", body: "Inter", ar: "Amiri" }, radius: 22, italic: true,
      hero: "cover", nav: "pills", list: "editorial", motif: "waves", fx: ["waves", "parallax", "reveal"] },

    { id: "atelier", name: "Atelier", tier: "premium", collection: "signature", set: "fine",
      restaurant: { name: "Atelier 9", tagline: { tr: "Dokuz tabaklık bir hikâye.", en: "A story told in courses.", ar: "حكاية تُروى عبر الأطباق." } },
      mode: "light", light: C("#F3EFEA", "#FBF9F6", "#1A1A1A", "#66615B", "#DDD6CC"), dark: C("#121211", "#1C1B19", "#F3EFEA", "#ABA59C", "#33312D"),
      accent: "#778A3D", accent2: "#1A1A1A", onAccent: "#FBF9F6",
      font: { display: "Space Grotesk", body: "Inter", ar: "Cairo" }, radius: 0,
      hero: "minimal", nav: "numbered", list: "chapters", motif: "none", fx: ["reveal"] },

    { id: "karnaval", name: "Karnaval", tier: "premium", collection: "motion", set: "dessert",
      restaurant: { name: "Şeker Karnaval", tagline: { tr: "Bugün tatlı bir gün!", en: "Today is a sweet day!", ar: "اليوم يوم حلو!" } },
      mode: "light", light: C("#F5BD43", "#FFF9F0", "#24191E", "#5A4433", "#24191E"), dark: C("#1C1317", "#2A1D22", "#F5BD43", "#E4C98C", "#4A3239"),
      accent: "#6E2037", accent2: "#D43B2E", onAccent: "#FFF9F0",
      font: { display: "Baloo 2", body: "Inter", ar: "Baloo Bhaijaan 2" }, radius: 24,
      hero: "poster", nav: "tiles", list: "polaroid", motif: "checker", card: "printed", fx: ["marquee", "stickers", "tilt"] },
    // ── HIGH-END COLLECTION (5 premium, for upscale restaurants) ─────────────
    { id: "mermer", name: "Mermer", tier: "premium", collection: "signature", set: "steak",
      restaurant: { name: "Mermer Steakhouse", tagline: { tr: "Ateş, zaman ve mermer.", en: "Fire, time and marble.", ar: "نار، وقت، ورخام." } },
      mode: "light", light: C("#F2EFEA", "#FBFAF7", "#1B1B1B", "#6B655D", "#D9D2C6"), dark: C("#121110", "#1C1A18", "#F2EFEA", "#B3ABA0", "#35312C"),
      accent: "#B08D57", accent2: "#1B1B1B", onAccent: "#FBFAF7",
      font: { display: "Playfair Display", body: "Inter", ar: "Amiri" }, radius: 4,
      hero: "cover", nav: "numbered", list: "editorial", motif: "marble", fx: ["kenburns", "reveal", "goldline"] },

    { id: "velvet", name: "Velvet", tier: "premium", collection: "signature", set: "fine",
      restaurant: { name: "Velvet Room", tagline: { tr: "Bir akşam yemeğinden fazlası.", en: "More than an evening meal.", ar: "أكثر من مجرد عشاء." } },
      mode: "dark", light: C("#F4F0E6", "#FFFFFF", "#0F2A22", "#4F625A", "#DCD3BE"), dark: C("#0F2A22", "#14352B", "#F1E6CB", "#C2B89C", "#2C4C40"),
      accent: "#C8A45A", accent2: "#F1E6CB", onAccent: "#0F2A22",
      font: { display: "Abril Fatface", body: "Inter", ar: "Amiri" }, radius: 0,
      hero: "frame", nav: "underline", list: "rows", motif: "deco", card: "framed", fx: ["shimmer", "reveal", "deco"] },

    { id: "bogazici", name: "Boğaziçi", tier: "premium", collection: "mediterranean", set: "meze",
      restaurant: { name: "Boğaziçi Yalı", tagline: { tr: "Boğaz'ın kıyısında, ışıklar suya düşerken.", en: "On the Bosphorus, as the lights touch the water.", ar: "على ضفاف البوسفور، حين تلامس الأضواء الماء." } },
      mode: "dark", light: C("#F3F1EC", "#FFFFFF", "#0B1B33", "#4E5B70", "#D7D3C8"), dark: C("#0B1B33", "#102542", "#F3EBDA", "#B9C0CC", "#22385A"),
      accent: "#D9B46A", accent2: "#F3EBDA", onAccent: "#0B1B33",
      font: { display: "Playfair Display", body: "Inter", ar: "Amiri" }, radius: 2, italic: true,
      hero: "cover", nav: "pills", list: "editorial", motif: "none", fx: ["kenburns", "spotlight", "reveal", "goldline"] },

    { id: "kuro", name: "Kuro", tier: "premium", collection: "minimal", set: "fine",
      restaurant: { name: "Kuro", tagline: { tr: "Az ama kusursuz.", en: "Less, but flawless.", ar: "أقل، لكن بلا عيب." } },
      mode: "dark", light: C("#F5F3EF", "#FFFFFF", "#111111", "#6A665F", "#DDD9D1"), dark: C("#0D0D0C", "#171615", "#EFEBE3", "#9E988E", "#2A2826"),
      accent: "#C8412B", accent2: "#EFEBE3", onAccent: "#FFFFFF",
      font: { display: "Space Grotesk", body: "Inter", ar: "Cairo" }, radius: 0,
      hero: "minimal", nav: "numbered", list: "chapters", motif: "none", fx: ["curtain", "reveal"] },

    { id: "ivory", name: "Ivory", tier: "premium", collection: "signature", set: "steak",
      restaurant: { name: "Ivory Table", tagline: { tr: "Beyaz örtü, kusursuz servis.", en: "White tablecloth, faultless service.", ar: "مفرش أبيض وخدمة لا تشوبها شائبة." } },
      mode: "light", light: C("#FBFAF7", "#FFFFFF", "#222222", "#6E6A64", "#E6E1D8"), dark: C("#141413", "#1D1C1B", "#F4F1EA", "#AAA59C", "#33312E"),
      accent: "#6E2037", accent2: "#B08D57", onAccent: "#FFFFFF",
      font: { display: "Playfair Display", body: "Inter", ar: "Amiri" }, radius: 0, italic: true,
      hero: "magazine", nav: "numbered", list: "board", motif: "none", fx: ["reveal", "letterpress", "goldline"] },
  ];

  const collections = {
    signature: { tr: "İmza", en: "Signature", ar: "التوقيع" },
    heritage: { tr: "Miras", en: "Heritage", ar: "التراث" },
    street: { tr: "Sokak", en: "Street", ar: "الشارع" },
    minimal: { tr: "Sade", en: "Minimal", ar: "البساطة" },
    motion: { tr: "Hareket", en: "Motion", ar: "الحركة" },
    mediterranean: { tr: "Akdeniz", en: "Mediterranean", ar: "المتوسط" },
  };

  // Stable server IDs (AuraDigital API): standard → std-01…std-15, premium → pre-16…pre-30.
  let si = 0, pi = 15;
  for (const d of designs) d.code = d.tier === "premium" ? `pre-${++pi}` : `std-${String(++si).padStart(2, "0")}`;
  const byId = {};
  for (const d of designs) { byId[d.id] = d; byId[d.code] = d; }
  window.AURAMENU_DESIGNS = { designs, collections, byId };
})();
