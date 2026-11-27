/* AuraMenu 2.0 — demo restaurant data for the public design gallery.
   All restaurants, dishes, prices, allergens and contact details below are ILLUSTRATIVE SAMPLES.
   Real customer menus come from the builder (same data shape) and never use these values. */
(function () {
  "use strict";
  const P = (id) => `media/template-photos/photo-${id}.webp`;
  const L = (tr, en, ar, fr) => ({ tr, en, ar, fr: fr || en });
  const I = (img, price, n, d, ing, al, extra) => Object.assign({ img: img ? P(img) : "", price, name: n, desc: d, ingredients: ing, allergens: al || [] }, extra || {});

  const sets = {
    grill: [
      { id: "kebab", icon: "🔥", name: L("Kebaplar", "Kebabs", "الكباب"), items: [
        I("1603360946369-dc9bb6258143", 520, L("Adana Kebap", "Adana Kebab", "كباب أضنة"), L("El çekimi kuzu kıyma, közde biber ve domates.", "Hand-minced lamb on the skewer, charred pepper and tomato.", "لحم ضأن مفروم يدوياً مع فلفل وطماطم مشوية."), L("Kuzu kıyma, pul biber, lavaş, sumak", "Lamb mince, chili flakes, lavash, sumac", "لحم ضأن، فلفل أحمر، خبز لافاش، سماق"), ["gluten"], { tags: ["spicy", "chef"] }),
        I("1555939594-58d7cb561ad1", 890, L("Karışık Izgara", "Mixed Grill Platter", "مشاوي مشكلة"), L("İki kişilik: şiş, köfte, pirzola ve tavuk kanat.", "For two: shish, köfte, lamb chops and wings.", "لشخصين: شيش، كفتة، ريش ضأن وأجنحة دجاج."), L("Kuzu, dana, tavuk, közlenmiş sebze", "Lamb, beef, chicken, roasted vegetables", "ضأن، بقر، دجاج، خضار مشوية"), [], { tags: ["share"] }),
        I("1529042410759-befb1204b468", 430, L("Izgara Köfte", "Grilled Köfte", "كفتة مشوية"), L("Çıtır yeşillik ve acı sos ile.", "With crisp greens and house chili sauce.", "مع خضار طازجة وصلصة حارة."), L("Dana kıyma, soğan, ekmek içi, baharat", "Beef mince, onion, breadcrumbs, spices", "لحم بقري مفروم، بصل، خبز، بهارات"), ["gluten", "eggs"]),
        I("1599487488170-d11ec9c172f0", 410, L("Tavuk Şiş", "Chicken Shish", "شيش طاووق"), L("Yoğurtlu marinasyon, bulgur pilavı ile.", "Yoghurt-marinated, served with bulgur pilaf.", "متبل باللبن ويقدم مع برغل."), L("Tavuk göğsü, yoğurt, bulgur", "Chicken breast, yoghurt, bulgur", "صدر دجاج، لبن، برغل"), ["milk", "gluten"], { available: "limited" }),
      ] },
      { id: "starters", icon: "🥗", name: L("Başlangıçlar", "Starters", "المقبلات"), items: [
        I("1505253716362-afaea1d3d1af", 210, L("Çoban Salata", "Shepherd's Salad", "سلطة الراعي"), L("Domates, salatalık, biber, nar ekşisi.", "Tomato, cucumber, pepper, pomegranate molasses.", "طماطم، خيار، فلفل، دبس الرمان."), L("Domates, salatalık, soğan, maydanoz, zeytinyağı", "Tomato, cucumber, onion, parsley, olive oil", "طماطم، خيار، بصل، بقدونس، زيت زيتون"), [], { tags: ["veg"] }),
        I("1576107232684-1279f390859f", 150, L("Kızarmış Patates", "Crispy Fries", "بطاطا مقلية"), L("Pul biber ve kekikle.", "Tossed with chili flakes and thyme.", "مع فلفل أحمر وزعتر."), L("Patates, ayçiçek yağı, kekik", "Potato, sunflower oil, thyme", "بطاطا، زيت دوار الشمس، زعتر"), [], { tags: ["veg"] }),
      ] },
      { id: "desserts", icon: "🍮", name: L("Tatlılar", "Desserts", "الحلويات"), items: [
        I("1571877227200-a0d98ea607e9", 240, L("Ev Yapımı Tiramisu", "House Tiramisu", "تيراميسو منزلي"), L("Türk kahvesiyle ıslatılmış.", "Soaked in Turkish coffee.", "مغموس بالقهوة التركية."), L("Mascarpone, kedidili, kakao, kahve", "Mascarpone, ladyfingers, cocoa, coffee", "ماسكاربوني، بسكويت، كاكاو، قهوة"), ["milk", "eggs", "gluten"]),
      ] },
      { id: "drinks", icon: "🥤", name: L("İçecekler", "Drinks", "المشروبات"), items: [
        I("1600271886742-f049cd451bba", 120, L("Taze Portakal Suyu", "Fresh Orange Juice", "عصير برتقال طازج"), L("Günlük sıkılır.", "Squeezed daily.", "يعصر يومياً."), L("Portakal", "Orange", "برتقال"), [], { tags: ["veg"] }),
        I("1613478223719-2ab802602423", 95, L("Limonata", "Lemonade", "ليموناضة"), L("Naneli, ev yapımı.", "House-made with mint.", "منزلية بالنعناع."), L("Limon, nane, şeker", "Lemon, mint, sugar", "ليمون، نعناع، سكر"), [], { available: false }),
      ] },
    ],

    breakfast: [
      { id: "plates", icon: "🍳", name: L("Kahvaltı", "Breakfast", "الفطور"), items: [
        I("1608039829572-78524f79c4c7", 340, L("Benedikt Yumurta", "Eggs Benedict", "بيض بنديكت"), L("Ekşi maya ekmek, hollandez sos.", "On sourdough with hollandaise.", "على خبز العجين المخمر مع صلصة هولنديز."), L("Yumurta, tereyağı, ekşi maya, limon", "Egg, butter, sourdough, lemon", "بيض، زبدة، خبز مخمر، ليمون"), ["eggs", "milk", "gluten"], { tags: ["chef"] }),
        I("1512058564366-18510be2db19", 380, L("Tavada Pilav", "Skillet Rice", "أرز في المقلاة"), L("Safranlı, limonlu, karidesli.", "Saffron, lemon and shrimp.", "بالزعفران والليمون والروبيان."), L("Pirinç, karides, safran, bezelye", "Rice, shrimp, saffron, peas", "أرز، روبيان، زعفران، بازلاء"), ["crustaceans"]),
      ] },
      { id: "bakery", icon: "🥐", name: L("Fırından", "From the oven", "من الفرن"), items: [
        I("1579372786545-d24232daf58c", 95, L("Mini Pastalar", "Petit Fours", "حلويات صغيرة"), L("Günün seçkisi, adet fiyatı.", "Today's selection, priced each.", "تشكيلة اليوم، السعر للقطعة."), L("Un, tereyağı, krema, meyve", "Flour, butter, cream, fruit", "دقيق، زبدة، قشطة، فواكه"), ["gluten", "milk", "eggs"]),
        I("1563729784474-d77dbb933a9e", 110, L("Kapkek", "Cupcake", "كب كيك"), L("Vanilyalı krema ile.", "With vanilla frosting.", "بكريمة الفانيليا."), L("Un, şeker, tereyağı, vanilya", "Flour, sugar, butter, vanilla", "دقيق، سكر، زبدة، فانيليا"), ["gluten", "milk", "eggs"], { available: "limited" }),
        I("1533134242443-d4fd215305ad", 210, L("Yaban Mersinli Cheesecake", "Blueberry Cheesecake", "تشيز كيك بالتوت"), L("Fırında, ev yapımı.", "Baked in-house.", "مخبوز في المحل."), L("Krem peynir, bisküvi, yaban mersini", "Cream cheese, biscuit, blueberry", "جبن كريمي، بسكويت، توت"), ["milk", "gluten", "eggs"]),
      ] },
      { id: "fresh", icon: "🍊", name: L("Tazeler", "Fresh", "طازج"), items: [
        I("1621506289937-a8e4df240d0b", 120, L("Narenciye Suyu", "Citrus Juice", "عصير حمضيات"), L("Portakal ve greyfurt.", "Orange and grapefruit.", "برتقال وجريب فروت."), L("Portakal, greyfurt", "Orange, grapefruit", "برتقال، جريب فروت"), [], { tags: ["veg"] }),
        I("1547592180-85f173990554", 290, L("Granola Kase", "Granola Bowl", "وعاء جرانولا"), L("Yoğurt, mevsim meyveleri, bal.", "Yoghurt, seasonal fruit, honey.", "لبن، فواكه موسمية، عسل."), L("Yulaf, yoğurt, bal, fındık", "Oats, yoghurt, honey, hazelnut", "شوفان، لبن، عسل، بندق"), ["milk", "nuts", "gluten"], { tags: ["veg"] }),
      ] },
    ],

    coffee: [
      { id: "espresso", icon: "☕", name: L("Espresso Bar", "Espresso Bar", "بار الإسبريسو"), items: [
        I("", 75, L("Espresso", "Espresso", "إسبريسو"), L("Tek köken, günlük kavrum.", "Single origin, roasted weekly.", "أحادي المصدر، يحمص أسبوعياً."), L("Kahve", "Coffee", "قهوة"), []),
        I("", 105, L("Flat White", "Flat White", "فلات وايت"), L("Çift shot, ipeksi süt.", "Double shot, silky milk.", "جرعتان مع حليب ناعم."), L("Kahve, süt", "Coffee, milk", "قهوة، حليب"), ["milk"]),
        I("", 115, L("Yulaf Latte", "Oat Latte", "لاتيه بحليب الشوفان"), L("Bitkisel sütle.", "With oat milk.", "بحليب الشوفان."), L("Kahve, yulaf sütü", "Coffee, oat milk", "قهوة، حليب شوفان"), ["gluten"], { tags: ["veg"] }),
        I("", 85, L("Türk Kahvesi", "Turkish Coffee", "قهوة تركية"), L("Lokum ile.", "Served with lokum.", "تقدم مع راحة الحلقوم."), L("Kahve, su", "Coffee, water", "قهوة، ماء"), [], { tags: ["chef"] }),
      ] },
      { id: "slow", icon: "🫖", name: L("Demleme", "Slow Brew", "تخمير بطيء"), items: [
        I("", 120, L("V60", "V60 Pour-over", "في 60"), L("Günün çekirdeği, meyvemsi.", "Bean of the day, fruity.", "حبوب اليوم، نكهة فاكهية."), L("Kahve, su", "Coffee, water", "قهوة، ماء"), []),
        I("", 125, L("Soğuk Demleme", "Cold Brew", "كولد برو"), L("18 saat demlenir.", "Steeped for 18 hours.", "منقوع 18 ساعة."), L("Kahve, su, buz", "Coffee, water, ice", "قهوة، ماء، ثلج"), [], { available: "limited" }),
        I("", 70, L("Çay", "Turkish Tea", "شاي تركي"), L("İnce belli bardakta.", "In the tulip glass.", "في كأس التوليب."), L("Siyah çay", "Black tea", "شاي أسود"), []),
      ] },
      { id: "sweet", icon: "🍪", name: L("Yanına", "On the side", "بجانبها"), items: [
        I("1606312619070-d48b4c652a52", 130, L("Bitter Brownie", "Dark Brownie", "براوني داكن"), L("Deniz tuzlu.", "With sea salt.", "مع ملح البحر."), L("Bitter çikolata, tereyağı, yumurta, un", "Dark chocolate, butter, egg, flour", "شوكولاتة داكنة، زبدة، بيض، دقيق"), ["gluten", "milk", "eggs"]),
        I("", 140, L("Kurabiye", "Cookie", "كوكي"), L("Fındıklı, sıcak servis.", "Hazelnut, served warm.", "بالبندق، يقدم دافئاً."), L("Un, tereyağı, fındık", "Flour, butter, hazelnut", "دقيق، زبدة، بندق"), ["gluten", "milk", "nuts"], { available: false }),
      ] },
    ],

    street: [
      { id: "burgers", icon: "🍔", name: L("Burgerler", "Burgers", "البرغر"), items: [
        I("1572802419224-296b0aeee0d9", 420, L("Çift Smash", "Double Smash", "دبل سماش"), L("İki köfte, cheddar, turşu, ev sosu.", "Two patties, cheddar, pickles, house sauce.", "قطعتان من اللحم، شيدر، مخلل، صلصة البيت."), L("Dana köfte, cheddar, brioche, turşu", "Beef patty, cheddar, brioche, pickles", "لحم بقري، شيدر، خبز بريوش، مخلل"), ["gluten", "milk", "eggs", "mustard", "sesame"], { tags: ["chef"] }),
        I("1568901346375-23c9450c58cd", 380, L("Klasik Burger", "Classic Burger", "برغر كلاسيك"), L("Marul, domates, karamelize soğan.", "Lettuce, tomato, caramelised onion.", "خس، طماطم، بصل مكرمل."), L("Dana köfte, marul, domates, soğan", "Beef patty, lettuce, tomato, onion", "لحم بقري، خس، طماطم، بصل"), ["gluten", "sesame"]),
        I("1565299507177-b0ac66763828", 450, L("Acılı Burger", "Hot Burger", "برغر حار"), L("Jalapeño ve chipotle mayo.", "Jalapeño and chipotle mayo.", "هالبينو ومايونيز شيبوتلي."), L("Dana köfte, jalapeño, chipotle", "Beef patty, jalapeño, chipotle", "لحم بقري، هالبينو، شيبوتلي"), ["gluten", "eggs"], { tags: ["spicy"] }),
      ] },
      { id: "wraps", icon: "🌯", name: L("Dürümler", "Wraps", "اللفائف"), items: [
        I("1626700051175-6818013e1d4f", 260, L("Tavuk Dürüm", "Chicken Wrap", "لفافة دجاج"), L("Közlenmiş biber ve sarımsaklı sos.", "Roasted pepper and garlic sauce.", "فلفل مشوي وصلصة الثوم."), L("Tavuk, lavaş, biber, sarımsak", "Chicken, lavash, pepper, garlic", "دجاج، خبز، فلفل، ثوم"), ["gluten", "eggs"]),
        I("1633321702518-7feccafb94d5", 290, L("Et Dürüm", "Beef Wrap", "لفافة لحم"), L("Sumaklı soğan ile.", "With sumac onions.", "مع بصل بالسماق."), L("Dana, lavaş, soğan, sumak", "Beef, lavash, onion, sumac", "لحم، خبز، بصل، سماق"), ["gluten"], { available: "limited" }),
      ] },
      { id: "sides", icon: "🍟", name: L("Yanlar", "Sides", "إضافات"), items: [
        I("1608039755401-742074f0548d", 240, L("Acılı Kanat", "Hot Wings", "أجنحة حارة"), L("6 adet, mavi peynir sos.", "Six pieces, blue cheese dip.", "ست قطع مع صلصة الجبن الأزرق."), L("Tavuk kanat, acı sos", "Chicken wings, hot sauce", "أجنحة دجاج، صلصة حارة"), ["milk"], { tags: ["spicy"] }),
        I("1598679253544-2c97992403ea", 140, L("Patates", "Fries", "بطاطا"), L("Çift kızartma.", "Double fried.", "مقلية مرتين."), L("Patates, tuz", "Potato, salt", "بطاطا، ملح"), [], { tags: ["veg"] }),
        I("1639024471283-03518883512d", 150, L("Soğan Halkası", "Onion Rings", "حلقات البصل"), L("Bira hamurunda.", "Beer-battered.", "بعجينة خاصة."), L("Soğan, un", "Onion, flour", "بصل، دقيق"), ["gluten"], { tags: ["veg"] }),
      ] },
      { id: "drinks", icon: "🥤", name: L("İçecekler", "Drinks", "المشروبات"), items: [
        I("1622483767028-3f66f32aef97", 70, L("Kola", "Cola", "كولا"), L("330 ml.", "330 ml can.", "علبة 330 مل."), L("Gazlı içecek", "Soft drink", "مشروب غازي"), []),
        I("1624517452488-04869289c4ca", 70, L("Portakallı Gazoz", "Orange Soda", "صودا برتقال"), L("330 ml.", "330 ml can.", "علبة 330 مل."), L("Gazlı içecek", "Soft drink", "مشروب غازي"), []),
      ] },
    ],

    garden: [
      { id: "bowls", icon: "🥗", name: L("Kaseler", "Bowls", "الأطباق"), items: [
        I("1512621776951-a57141f2eefd", 320, L("Bahçe Kasesi", "Garden Bowl", "طبق الحديقة"), L("Avokado, nohut, kinoa, tahin.", "Avocado, chickpeas, quinoa, tahini.", "أفوكادو، حمص، كينوا، طحينة."), L("Avokado, nohut, kinoa, tahin, roka", "Avocado, chickpea, quinoa, tahini, rocket", "أفوكادو، حمص، كينوا، طحينة، جرجير"), ["sesame"], { tags: ["veg", "chef"] }),
        I("1547496502-affa22d38842", 290, L("Mevsim Salatası", "Seasonal Salad", "سلطة موسمية"), L("Nar, ceviz, keçi peyniri.", "Pomegranate, walnut, goat cheese.", "رمان، جوز، جبن ماعز."), L("Yeşillik, nar, ceviz, keçi peyniri", "Greens, pomegranate, walnut, goat cheese", "خضار، رمان، جوز، جبن ماعز"), ["nuts", "milk"], { tags: ["veg"] }),
        I("1604908176997-125f25cc6f3d", 340, L("Hellim Tava", "Halloumi Skillet", "حلوم في المقلاة"), L("Biber, domates ve fesleğen.", "Peppers, tomato and basil.", "فلفل، طماطم وريحان."), L("Hellim, biber, domates, fesleğen", "Halloumi, pepper, tomato, basil", "حلوم، فلفل، طماطم، ريحان"), ["milk"], { tags: ["veg"], available: "limited" }),
      ] },
      { id: "pasta", icon: "🍝", name: L("Makarnalar", "Pasta", "المعكرونة"), items: [
        I("1551892374-ecf8754cf8b0", 310, L("Domatesli Spagetti", "Tomato Spaghetti", "سباغيتي بالطماطم"), L("San Marzano ve fesleğen.", "San Marzano tomatoes and basil.", "طماطم سان مارزانو وريحان."), L("Makarna, domates, sarımsak, fesleğen", "Pasta, tomato, garlic, basil", "معكرونة، طماطم، ثوم، ريحان"), ["gluten"], { tags: ["veg"] }),
        I("1551183053-bf91a1d81141", 360, L("Mantarlı Tagliatelle", "Mushroom Tagliatelle", "تالياتيلي بالفطر"), L("Kremalı, parmesanlı.", "Creamy, with parmesan.", "بالكريمة والبارميزان."), L("Makarna, mantar, krema, parmesan", "Pasta, mushroom, cream, parmesan", "معكرونة، فطر، قشطة، بارميزان"), ["gluten", "milk", "eggs"], { tags: ["veg"] }),
      ] },
      { id: "drinks", icon: "🍋", name: L("İçecekler", "Drinks", "المشروبات"), items: [
        I("1613478223719-2ab802602423", 95, L("Zencefilli Limonata", "Ginger Lemonade", "ليموناضة بالزنجبيل"), L("Az şekerli.", "Lightly sweetened.", "قليلة السكر."), L("Limon, zencefil, bal", "Lemon, ginger, honey", "ليمون، زنجبيل، عسل"), [], { tags: ["veg"], available: false }),
        I("1548839140-29a749e1cf4d", 45, L("Su", "Still Water", "ماء"), L("500 ml.", "500 ml.", "500 مل."), L("Su", "Water", "ماء"), []),
      ] },
    ],

    tunisian: [
      { id: "plats", icon: "🌶️", name: L("Ana Yemekler", "Mains", "الأطباق الرئيسية", "Plats"), items: [
        I("1546833999-b9f581a1996d", 360, L("Tunus Tabağı", "Tunisian Platter", "صحن تونسي", "Assiette tunisienne"), L("Günün yahnisi, harissa, ekmek.", "Stew of the day, harissa and bread.", "مرق اليوم مع الهريسة والخبز.", "Ragoût du jour, harissa et pain."), L("Et, nohut, harissa, kimyon", "Meat, chickpeas, harissa, cumin", "لحم، حمص، هريسة، كمون"), ["gluten"], { tags: ["spicy", "chef"] }),
        I("1529042410759-befb1204b468", 320, L("Kefta", "Kefta", "كفتة", "Kefta"), L("Baharatlı köfte, közde.", "Spiced meatballs, char-grilled.", "كفتة متبلة مشوية على الفحم.", "Boulettes épicées grillées."), L("Kuzu, maydanoz, kimyon", "Lamb, parsley, cumin", "ضأن، بقدونس، كمون"), ["gluten"]),
        I("1610057099431-d73a1c9d2f2f", 340, L("Mechoui Tavuk", "Mechoui Chicken", "دجاج مشوي", "Poulet méchoui"), L("Ispanak ve limon ile.", "With greens and lemon.", "مع خضار وليمون.", "Avec verdures et citron."), L("Tavuk, ıspanak, limon", "Chicken, spinach, lemon", "دجاج، سبانخ، ليمون"), []),
      ] },
      { id: "entrees", icon: "🫒", name: L("Başlangıçlar", "Starters", "مقبلات", "Entrées"), items: [
        I("", 160, L("Salata Meşviye", "Slata Mechouia", "سلاطة مشوية", "Salade méchouia"), L("Közlenmiş biber ve domates, ton balığı, yumurta.", "Grilled peppers and tomato, tuna, egg.", "فلفل وطماطم مشوية مع التن والبيض.", "Poivrons et tomates grillés, thon, œuf."), L("Biber, domates, ton, yumurta, zeytin", "Pepper, tomato, tuna, egg, olive", "فلفل، طماطم، تن، بيض، زيتون"), ["fish", "eggs"], { tags: ["spicy"] }),
        I("", 140, L("Brik", "Brik", "بريك", "Brik"), L("Çıtır yufkada yumurta ve ton.", "Crisp pastry with egg and tuna.", "عجينة مقرمشة بالبيض والتن.", "Feuille croustillante, œuf et thon."), L("Malsouka, yumurta, ton, maydanoz", "Malsouka, egg, tuna, parsley", "ملسوقة، بيض، تن، بقدونس"), ["gluten", "eggs", "fish"], { available: "limited" }),
      ] },
      { id: "boissons", icon: "🍵", name: L("İçecekler", "Drinks", "مشروبات", "Boissons"), items: [
        I("", 80, L("Naneli Çay", "Mint Tea", "شاي بالنعناع", "Thé à la menthe"), L("Çam fıstıklı.", "With pine nuts.", "مع الصنوبر.", "Aux pignons."), L("Yeşil çay, nane, çam fıstığı", "Green tea, mint, pine nuts", "شاي أخضر، نعناع، صنوبر"), ["nuts"]),
        I("1621506289937-a8e4df240d0b", 110, L("Portakal Suyu", "Orange Juice", "عصير برتقال", "Jus d'orange"), L("Taze sıkım.", "Freshly squeezed.", "معصور طازجاً.", "Pressé minute."), L("Portakal", "Orange", "برتقال"), []),
      ] },
    ],

    dessert: [
      { id: "cakes", icon: "🍰", name: L("Pastalar", "Cakes", "الكيك"), items: [
        I("1565958011703-44f9829ba187", 230, L("Frambuazlı Pasta", "Raspberry Layer Cake", "كيك التوت"), L("Vanilyalı pandispanya, taze frambuaz.", "Vanilla sponge, fresh raspberries.", "إسفنج الفانيليا مع توت طازج."), L("Un, yumurta, krema, frambuaz", "Flour, egg, cream, raspberry", "دقيق، بيض، قشطة، توت"), ["gluten", "eggs", "milk"], { tags: ["chef"] }),
        I("1571115177098-24ec42ed204d", 210, L("Opera", "Opera Slice", "أوبرا"), L("Kahve ve çikolata katları.", "Coffee and chocolate layers.", "طبقات القهوة والشوكولاتة."), L("Badem unu, kahve, çikolata", "Almond flour, coffee, chocolate", "دقيق اللوز، قهوة، شوكولاتة"), ["nuts", "eggs", "milk"]),
        I("1606890737304-57a1ca8a5b62", 250, L("Vişneli Çikolatalı", "Black Forest", "الغابة السوداء"), L("Kat kat, vişneli.", "Layered, with sour cherry.", "طبقات مع الكرز الحامض."), L("Kakao, krema, vişne", "Cocoa, cream, sour cherry", "كاكاو، قشطة، كرز"), ["gluten", "eggs", "milk"], { available: "limited" }),
      ] },
      { id: "cups", icon: "🍨", name: L("Bardakta", "In a cup", "في كوب"), items: [
        I("1563805042-7684c019e1cb", 190, L("Kurabiyeli Kup", "Cookie Crumble Cup", "كوب الكوكيز"), L("Çikolata sos ve krema.", "Chocolate sauce and cream.", "صلصة شوكولاتة وقشطة."), L("Bisküvi, krema, çikolata", "Biscuit, cream, chocolate", "بسكويت، قشطة، شوكولاتة"), ["gluten", "milk"]),
        I("1567206563064-6f60f40a2b57", 160, L("Dondurma (3 top)", "Gelato (3 scoops)", "جيلاتو (3 كرات)"), L("Günün tatları.", "Flavours of the day.", "نكهات اليوم."), L("Süt, şeker, meyve", "Milk, sugar, fruit", "حليب، سكر، فواكه"), ["milk"]),
      ] },
      { id: "bites", icon: "🍫", name: L("Lokmalar", "Bites", "قطع صغيرة"), items: [
        I("1606313564200-e75d5e30476c", 120, L("Brownie", "Brownie", "براوني"), L("Ortası akışkan.", "Gooey centre.", "قلب طري."), L("Çikolata, tereyağı, yumurta", "Chocolate, butter, egg", "شوكولاتة، زبدة، بيض"), ["gluten", "eggs", "milk"]),
        I("1563729784474-d77dbb933a9e", 110, L("Kapkek", "Cupcake", "كب كيك"), L("Mevsim kreması.", "Seasonal frosting.", "كريمة موسمية."), L("Un, şeker, tereyağı", "Flour, sugar, butter", "دقيق، سكر، زبدة"), ["gluten", "milk", "eggs"], { available: false }),
      ] },
    ],

    fine: [
      { id: "first", icon: "✦", name: L("Başlangıç", "To begin", "البداية"), items: [
        I("1625944525533-473f1a3d54e7", 690, L("Somon Tartar", "Salmon Tartare", "تارتار السلمون"), L("Avokado, havyar, yuzu.", "Avocado, roe, yuzu.", "أفوكادو، بطارخ، يوزو."), L("Somon, avokado, balık yumurtası, yuzu", "Salmon, avocado, roe, yuzu", "سلمون، أفوكادو، بطارخ، يوزو"), ["fish", "soy"], { tags: ["chef"] }),
        I("1608039829572-78524f79c4c7", 560, L("Yumurta, Trüf", "Egg & Truffle", "بيض وكمأة"), L("Düşük ısıda yumurta, trüf hollandez.", "Slow egg, truffle hollandaise.", "بيض مطهو ببطء، هولنديز بالكمأة."), L("Yumurta, trüf, tereyağı", "Egg, truffle, butter", "بيض، كمأة، زبدة"), ["eggs", "milk", "gluten"]),
      ] },
      { id: "main", icon: "✦", name: L("Ana", "The main", "الرئيسي"), items: [
        I("1529692236671-f1f6cf9683ba", 1450, L("Dry-Aged Antrikot", "Dry-Aged Ribeye", "ريب آي معتق"), L("45 gün, kemik iliği sosu.", "45 days, bone-marrow jus.", "45 يوماً مع صلصة النخاع."), L("Dana antrikot, ilik, tereyağı", "Beef ribeye, marrow, butter", "ريب آي، نخاع، زبدة"), ["milk"], { tags: ["chef"] }),
        I("1544025162-d76694265947", 1250, L("Kuzu Kaburga", "Lamb Ribs", "ضلوع الضأن"), L("12 saat, nar sosu.", "Twelve hours, pomegranate glaze.", "12 ساعة مع صلصة الرمان."), L("Kuzu, nar ekşisi, baharat", "Lamb, pomegranate, spices", "ضأن، رمان، بهارات"), [], { available: "limited" }),
        I("1532550907401-a500c9a57435", 890, L("Limonlu Piliç", "Lemon Poussin", "دجاج بالليمون"), L("Biberiye ve közlenmiş havuç.", "Rosemary, roasted carrot.", "إكليل الجبل وجزر مشوي."), L("Piliç, limon, biberiye, havuç", "Poussin, lemon, rosemary, carrot", "دجاج، ليمون، إكليل، جزر"), []),
      ] },
      { id: "sweet", icon: "✦", name: L("Final", "To finish", "الختام"), items: [
        I("1571877227200-a0d98ea607e9", 420, L("Tiramisu", "Tiramisu", "تيراميسو"), L("Masada tamamlanır.", "Finished at the table.", "يكمل على الطاولة."), L("Mascarpone, kahve, kakao", "Mascarpone, coffee, cocoa", "ماسكاربوني، قهوة، كاكاو"), ["milk", "eggs", "gluten"]),
      ] },
    ],

    meze: [
      { id: "sea", icon: "🐟", name: L("Denizden", "From the sea", "من البحر"), items: [
        I("1563379926898-05f4575a45d8", 520, L("Karidesli Linguine", "Shrimp Linguine", "لينغويني بالروبيان"), L("Sarımsak, limon, maydanoz.", "Garlic, lemon, parsley.", "ثوم، ليمون، بقدونس."), L("Makarna, karides, sarımsak, tereyağı", "Pasta, shrimp, garlic, butter", "معكرونة، روبيان، ثوم، زبدة"), ["gluten", "crustaceans", "milk"], { tags: ["chef"] }),
        I("1512058564366-18510be2db19", 590, L("Deniz Mahsullü Pilav", "Seafood Rice", "أرز بثمار البحر"), L("Safranlı, iki kişilik.", "Saffron, for two.", "بالزعفران، لشخصين."), L("Pirinç, karides, midye, safran", "Rice, shrimp, mussels, saffron", "أرز، روبيان، بلح البحر، زعفران"), ["crustaceans", "molluscs"], { tags: ["share"] }),
        I("1625944525533-473f1a3d54e7", 480, L("Somon Tartar", "Salmon Tartare", "تارتار السلمون"), L("Avokado ve limon.", "Avocado and lime.", "أفوكادو وليمون."), L("Somon, avokado, limon", "Salmon, avocado, lime", "سلمون، أفوكادو، ليمون"), ["fish"], { available: "limited" }),
      ] },
      { id: "meze", icon: "🫒", name: L("Mezeler", "Meze", "المازة"), items: [
        I("1505253716362-afaea1d3d1af", 190, L("Akdeniz Salatası", "Mediterranean Salad", "سلطة متوسطية"), L("Zeytin, beyaz peynir, kekik.", "Olives, feta, oregano.", "زيتون، جبن أبيض، زعتر."), L("Domates, salatalık, zeytin, beyaz peynir", "Tomato, cucumber, olive, feta", "طماطم، خيار، زيتون، جبن"), ["milk"], { tags: ["veg"] }),
        I("", 160, L("Humus", "Hummus", "حمص"), L("Tahinli, sıcak tereyağlı.", "With tahini and warm butter.", "بالطحينة والزبدة الدافئة."), L("Nohut, tahin, limon, sarımsak", "Chickpea, tahini, lemon, garlic", "حمص، طحينة، ليمون، ثوم"), ["sesame", "milk"], { tags: ["veg"] }),
        I("", 150, L("Haydari", "Haydari", "حيدري"), L("Süzme yoğurt ve nane.", "Strained yoghurt and mint.", "لبنة ونعناع."), L("Yoğurt, nane, sarımsak", "Yoghurt, mint, garlic", "لبن، نعناع، ثوم"), ["milk"], { tags: ["veg"] }),
      ] },
      { id: "grill", icon: "🔥", name: L("Izgara", "Grill", "مشويات"), items: [
        I("1600891964092-4316c288032e", 820, L("Bonfile & Patates", "Steak Frites", "ستيك مع بطاطا"), L("Otlu tereyağı ile.", "With herb butter.", "مع زبدة الأعشاب."), L("Dana bonfile, patates, tereyağı", "Beef tenderloin, potato, butter", "لحم بقري، بطاطا، زبدة"), ["milk"]),
      ] },
    ],

    pizza: [
      { id: "pide", icon: "🔥", name: L("Taş Fırın", "Stone Oven", "فرن الحجر"), items: [
        I("1574071318508-1cdbab80d002", 340, L("Margherita", "Margherita", "مارغريتا"), L("Domates, mozzarella, fesleğen.", "Tomato, mozzarella, basil.", "طماطم، موزاريلا، ريحان."), L("Hamur, domates, mozzarella, fesleğen", "Dough, tomato, mozzarella, basil", "عجين، طماطم، موزاريلا، ريحان"), ["gluten", "milk"], { tags: ["veg"] }),
        I("1628840042765-356cda07504e", 390, L("Sucuklu", "Sucuk Pizza", "بيتزا السجق"), L("Kayseri sucuğu, kaşar.", "Turkish sucuk, kaşar cheese.", "سجق تركي وجبن قشقوان."), L("Hamur, sucuk, kaşar, domates", "Dough, sucuk, kaşar, tomato", "عجين، سجق، جبن، طماطم"), ["gluten", "milk"], { tags: ["chef"] }),
        I("1593560708920-61dd98c46a4e", 370, L("Ispanaklı Beyaz", "Spinach Bianca", "بيضاء بالسبانخ"), L("Ricotta ve sarımsak.", "Ricotta and garlic.", "ريكوتا وثوم."), L("Hamur, ıspanak, ricotta, sarımsak", "Dough, spinach, ricotta, garlic", "عجين، سبانخ، ريكوتا، ثوم"), ["gluten", "milk"], { tags: ["veg"] }),
        I("1604917877934-07d8d248d396", 360, L("Dört Peynir", "Four Cheese", "أربعة أجبان"), L("Mavi peynir dahil.", "Including blue cheese.", "يشمل الجبن الأزرق."), L("Hamur, mozzarella, gorgonzola, parmesan, kaşar", "Dough, mozzarella, gorgonzola, parmesan, kaşar", "عجين، موزاريلا، غورغونزولا، بارميزان"), ["gluten", "milk"], { available: false }),
      ] },
      { id: "salads", icon: "🥗", name: L("Salatalar", "Salads", "السلطات"), items: [
        I("1547496502-affa22d38842", 240, L("Roka Salatası", "Rocket Salad", "سلطة الجرجير"), L("Parmesan ve balzamik.", "Parmesan and balsamic.", "بارميزان وخل بلسمي."), L("Roka, parmesan, balzamik", "Rocket, parmesan, balsamic", "جرجير، بارميزان، خل بلسمي"), ["milk", "sulphites"], { tags: ["veg"] }),
      ] },
      { id: "sweet", icon: "🍫", name: L("Tatlı", "Dessert", "حلوى"), items: [
        I("1578985545062-69928b1d9587", 220, L("Çikolatalı Pasta", "Chocolate Cake", "كيك الشوكولاتة"), L("Dilim.", "By the slice.", "بالشريحة."), L("Kakao, un, yumurta, krema", "Cocoa, flour, egg, cream", "كاكاو، دقيق، بيض، قشطة"), ["gluten", "eggs", "milk"]),
      ] },
    ],

    steak: [
      { id: "cuts", icon: "🥩", name: L("Etler", "The cuts", "قطع اللحم", "Les pièces"), items: [
        I("1529692236671-f1f6cf9683ba", 2450, L("Dry-Aged Ribeye 400g", "Dry-Aged Ribeye 400g", "ريب آي معتق 400غ", "Entrecôte maturée 400g"), L("38 gün kuru dinlendirilmiş, közde.", "Aged 38 days, cooked over embers.", "معتق 38 يوماً ومشوي على الجمر.", "Maturée 38 jours, cuite sur la braise."), L("Dana antrikot, deniz tuzu, biberiye tereyağı", "Beef ribeye, sea salt, rosemary butter", "ريب آي، ملح البحر، زبدة إكليل الجبل"), ["milk"], { tags: ["chef"] }),
        I("1558030006-450675393462", 1980, L("Bonfile Tagliata", "Tenderloin Tagliata", "تالياتا الفيليه", "Tagliata de filet"), L("Roka, parmesan, balzamik.", "Rocket, parmesan, balsamic.", "جرجير، بارميزان، خل بلسمي.", "Roquette, parmesan, balsamique."), L("Dana bonfile, roka, parmesan", "Beef tenderloin, rocket, parmesan", "فيليه بقري، جرجير، بارميزان"), ["milk", "sulphites"]),
        I("1544025162-d76694265947", 1650, L("Kuzu Kaburga", "Lamb Ribs", "ضلوع الضأن", "Côtes d'agneau"), L("12 saat fırın, nar glazürü.", "Twelve hours slow-roasted, pomegranate glaze.", "مشوية 12 ساعة مع صلصة الرمان.", "Rôties douze heures, laque grenade."), L("Kuzu, nar ekşisi, baharat", "Lamb, pomegranate, spices", "ضأن، رمان، بهارات"), [], { available: "limited" }),
        I("1529193591184-b1d58069ecdd", 2200, L("Brisket", "Smoked Brisket", "بريسكت مدخن", "Poitrine fumée"), L("Meşe odunu, 14 saat.", "Oak-smoked for fourteen hours.", "مدخن بخشب البلوط 14 ساعة.", "Fumée au chêne quatorze heures."), L("Dana döş, baharat ovması", "Beef brisket, spice rub", "صدر بقري، بهارات"), [], { available: false }),
      ] },
      { id: "sides", icon: "🥔", name: L("Yanında", "Sides", "الأطباق الجانبية", "Accompagnements"), items: [
        I("1600891964092-4316c288032e", 380, L("Trüflü Patates", "Truffle Frites", "بطاطا بالكمأة", "Frites à la truffe"), L("Parmesan ve maydanoz.", "Parmesan and parsley.", "بارميزان وبقدونس.", "Parmesan et persil."), L("Patates, trüf yağı, parmesan", "Potato, truffle oil, parmesan", "بطاطا، زيت الكمأة، بارميزان"), ["milk"], { tags: ["veg"] }),
        I("1505253716362-afaea1d3d1af", 320, L("Bahçe Salatası", "Garden Salad", "سلطة الحديقة", "Salade du jardin"), L("Hardallı vinegret.", "Mustard vinaigrette.", "صلصة الخردل.", "Vinaigrette moutarde."), L("Yeşillik, domates, hardal", "Greens, tomato, mustard", "خضار، طماطم، خردل"), ["mustard"], { tags: ["veg"] }),
      ] },
      { id: "end", icon: "🍫", name: L("Final", "To finish", "الختام", "Pour finir"), items: [
        I("1606312619070-d48b4c652a52", 420, L("Bitter Çikolata", "Dark Chocolate Slab", "شوكولاتة داكنة", "Chocolat noir"), L("%70 kakao, deniz tuzu.", "70% cacao, sea salt.", "كاكاو 70٪ وملح البحر.", "Cacao 70 %, sel de mer."), L("Bitter çikolata, tereyağı", "Dark chocolate, butter", "شوكولاتة داكنة، زبدة"), ["milk"]),
        I("1499638673689-79a0b5115d87", 450, L("Ev Şerbeti", "House Sherbet", "شربات البيت", "Sorbet maison"), L("Nar ve tarçın.", "Pomegranate and cinnamon.", "رمان وقرفة.", "Grenade et cannelle."), L("Nar, tarçın, şeker", "Pomegranate, cinnamon, sugar", "رمان، قرفة، سكر"), []),
      ] },
    ],

    bar: [
      { id: "signature", icon: "🍸", name: L("İmza Kokteyller", "Signature", "الكوكتيلات"), items: [
        I("1544145945-f90425340c7e", 420, L("Saffron Sour", "Saffron Sour", "سافرون ساور"), L("Safran şurubu, limon, köpük.", "Saffron syrup, lemon, foam.", "شراب الزعفران، ليمون، رغوة."), L("Safran, limon, şurup, yumurta akı", "Saffron, lemon, syrup, egg white", "زعفران، ليمون، شراب، بياض البيض"), ["eggs", "sulphites"], { tags: ["chef"] }),
        I("1499638673689-79a0b5115d87", 390, L("Nar Spritz", "Pomegranate Spritz", "سبريتز الرمان"), L("Nar ve köpüklü.", "Pomegranate and bubbles.", "رمان وفقاعات."), L("Nar, soda, buz", "Pomegranate, soda, ice", "رمان، صودا، ثلج"), ["sulphites"]),
        I("1556679343-c7306c1976bc", 360, L("Smoky Highball", "Smoky Highball", "سموكي هايبول"), L("İsli, limonlu.", "Smoky, with lime.", "مدخن مع ليمون."), L("Soda, lime, buz", "Soda, lime, ice", "صودا، ليمون، ثلج"), [], { available: "limited" }),
      ] },
      { id: "zero", icon: "🍋", name: L("Alkolsüz", "Zero proof", "بدون كحول"), items: [
        I("1600271886742-f049cd451bba", 180, L("Gün Batımı", "Sunset", "غروب"), L("Portakal, nar, soda.", "Orange, pomegranate, soda.", "برتقال، رمان، صودا."), L("Portakal, nar, soda", "Orange, pomegranate, soda", "برتقال، رمان، صودا"), [], { tags: ["veg"] }),
        I("1581636625402-29b2a704ef13", 90, L("Kola", "Cola", "كولا"), L("Buzlu bardakta.", "Over ice.", "مع ثلج."), L("Gazlı içecek", "Soft drink", "مشروب غازي"), []),
      ] },
      { id: "bites", icon: "🍟", name: L("Atıştırmalık", "Bar bites", "مقبلات البار"), items: [
        I("1573080496219-bb080dd4f877", 170, L("Trüflü Patates", "Truffle Fries", "بطاطا بالكمأة"), L("Parmesanlı.", "With parmesan.", "مع البارميزان."), L("Patates, trüf yağı, parmesan", "Potato, truffle oil, parmesan", "بطاطا، زيت الكمأة، بارميزان"), ["milk"], { tags: ["veg"] }),
        I("1626645738196-c2a7c87a8f58", 260, L("Çıtır Tavuk", "Crispy Chicken", "دجاج مقرمش"), L("Acı bal sos.", "Hot honey dip.", "صلصة عسل حارة."), L("Tavuk, un, bal, acı biber", "Chicken, flour, honey, chili", "دجاج، دقيق، عسل، فلفل"), ["gluten"], { tags: ["spicy"] }),
      ] },
    ],
  };

  const base = { whatsapp: "905555555555", phone: "+90 555 555 55 55", currency: "TRY", mapsQuery: "Sultanahmet, Fatih, İstanbul", socials: { instagram: "https://instagram.com/", tiktok: "https://tiktok.com/", facebook: "https://facebook.com/" }, reviewUrl: "https://search.google.com/local/writereview", hours: { mon: "09:00-23:00", tue: "09:00-23:00", wed: "09:00-23:00", thu: "09:00-23:00", fri: "09:00-00:30", sat: "10:00-00:30", sun: "10:00-22:00" } };

  window.AURAMENU_DEMO = { sets, base, L };
})();
