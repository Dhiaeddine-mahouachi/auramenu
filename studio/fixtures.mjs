const translated = ([en,tr,ar]) => ({en,tr,ar});
const photoPath = (id,width = 640) => new URL('./photos/' + id + '-' + width + '.webp',import.meta.url).pathname;
const logoPath = key => new URL('./photos/' + key + '.webp',import.meta.url).pathname;
const item = (title,price,img,description,extras = {}) => ({
  name:title[0],description:description[0],price,imageUrl:photoPath(img),imageSmall:photoPath(img,320),
  translations:{name:translated(title),description:translated(description)}, ...extras,
});
const section = (title,items,description) => ({
  name:title[0],translations:{name:translated(title),...(description && {description:translated(description)})},
  imageUrl:items[0]?.imageUrl,items,
});
const sesame = translated(['Sesame','Susam','سمسم']);
const gluten = translated(['Wheat','Buğday','قمح']);
const milk = translated(['Milk','Süt','حليب']);
const vegan = translated(['Vegan','Vegan','نباتي بالكامل']);
const lists = {
  burger:[
    section(['Smash burgers','Smash burgerler','برغر سماش'],[
      item(['The House Smash','Ev Usulü Smash','سماش الدار'],325,60,['Two crisp-edged beef patties, cheddar, pickles and house sauce on a toasted bun.','İki çıtır dana köftesi, çedar, turşu ve ev sosu.','قطعتا لحم بقري محمّرتان مع شيدر ومخلل وصلصة الدار.'],{featured:true,bestseller:true,discountPrice:295,allergens:[gluten,milk,sesame],variants:[{name:translated(['Single','Tek kat','مفرد']),price:265},{name:translated(['Double','Çift kat','مزدوج']),price:325}]}),
      item(['Pepper Jack Stack','Biberli Jack Burger','برغر بيبر جاك'],365,44,['Beef, jalapeños, tangy slaw and melted pepper jack.','Dana köftesi, jalapeno, lahana salatası ve biberli peynir.','لحم بقري وهالبينو وسلطة ملفوف وجبن بالفلفل.']),
      item(['Mushroom Melt','Mantarlı Burger','برغر الفطر والجبن'],350,76,['Griddled mushrooms, onions and melted cheese.','Izgara mantar, soğan ve erimiş peynir.','فطر مشوي وبصل وجبن ذائب.'],{featured:true}),
    ],['Hot off the flat top.','Izgaradan taze.','مباشرة من الصاج الساخن.']),
    section(['Sides','Yan lezzetler','الأطباق الجانبية'],[
      item(['Sea Salt Fries','Deniz Tuzlu Patates','بطاطا بملح البحر'],110,92,['Shoestring fries with flaky sea salt.','Deniz tuzlu ince patates kızartması.','بطاطا رفيعة مقرمشة بملح البحر.'],{dietary:[vegan]}),
      item(['Paprika Fries','Toz Biberli Patates','بطاطا بالبابريكا'],125,63,['Hand-cut potatoes and smoked paprika.','El kesimi patates ve füme kırmızı biber.','بطاطا مقطعة يدوياً مع بابريكا مدخنة.']),
      item(['Hot Honey Bites','Acı Ballı Tavuk','لقيمات دجاج بالعسل الحار'],185,77,['Crunchy chicken tossed with chili honey.','Acı balla harmanlanmış çıtır tavuk.','دجاج مقرمش مغطى بعسل حار.'],{available:false}),
    ]),
    section(['Drinks','İçecekler','المشروبات'],[
      item(['Blood Orange Soda','Kan Portakallı Soda','صودا البرتقال الأحمر'],95,82,['Blood orange, soda and a twist of peel.','Kan portakalı, soda ve portakal kabuğu.','برتقال أحمر وصودا وقشر برتقال.']),
      item(['House Iced Tea','Ev Yapımı Soğuk Çay','شاي مثلّج من الدار'],85,29,['Black tea, lemon and ice.','Siyah çay, limon ve buz.','شاي أسود وليمون وثلج.']),
    ]),
  ],
  coffee:[
    section(['Coffee bar','Kahve barı','بار القهوة'],[
      item(['Flat White','Flat White','فلات وايت'],4.5,2,['A double espresso with textured milk.','Çift espresso ve ipeksi süt.','إسبريسو مزدوج وحليب مخملي.'],{featured:true,bestseller:true,allergens:[milk]}),
      item(['Iced Coffee','Soğuk Kahve','قهوة مثلجة'],5,29,['Slow-brewed coffee poured over ice.','Yavaş demleme kahve ve buz.','قهوة منقوعة ببطء تُقدّم فوق الثلج.'],{featured:true,variants:[{name:translated(['Large','Büyük','كبير']),price:6}]}),
      item(['Sparkling Citrus','Narenciye Sodası','صودا الحمضيات'],4,6,['Lime, mint and mineral water.','Misket limonu, nane ve maden suyu.','ليمون أخضر ونعناع ومياه غازية.']),
    ]),
    section(['Brunch','Brunch','برانش'],[
      item(['Eggs & Brioche','Yumurta ve Briyoş','بيض وبريوش'],11,78,['Soft eggs and toasted brioche.','Yumuşak yumurta ve kızarmış briyoş.','بيض طري وبريوش محمّص.'],{featured:true}),
      item(['Garden Bowl','Bahçe Kasesi','وعاء الحديقة'],12,4,['Avocado, herbs and a lemon dressing.','Avokado, otlar ve limon sosu.','أفوكادو وأعشاب وصلصة ليمون.'],{dietary:[vegan]}),
    ]),
    section(['Sweet counter','Tatlı vitrini','ركن الحلويات'],[
      item(['Dark Chocolate Brownie','Bitter Çikolatalı Brownie','براوني بالشوكولاتة الداكنة'],5,73,['A soft center and a thin, crisp top.','Yumuşak iç ve ince çıtır kabuk.','قلب طري وقشرة مقرمشة رقيقة.'],{featured:true}),
      item(['Berry Cake','Orman Meyveli Pasta','كيك التوت'],6,39,['Layers of cream and fresh berries.','Krema ve taze orman meyvesi katları.','طبقات من الكريمة والتوت الطازج.'],{seasonal:true}),
    ]),
  ],
  arabic:[
    section(['From the grill','Izgaradan','من المشواة'],[
      item(['Charcoal Kebab','Kömürde Kebap','كباب على الفحم'],495,17,['Charcoal-grilled lamb, tomato, parsley and warm flatbread.','Kömürde kuzu, domates, maydanoz ve sıcak lavaş.','كباب لحم الضأن على الفحم مع الطماطم والبقدونس والخبز الساخن.'],{featured:true,bestseller:true,ingredients:[translated(['Lamb','Kuzu','لحم ضأن']),translated(['Parsley','Maydanoz','بقدونس'])],allergens:[gluten]}),
      item(['Shish Tawook','Tavuk Şiş','شيش طاووق'],385,62,['Lemon-marinated chicken with herbs.','Limonla marine edilmiş otlu tavuk.','دجاج متبّل بالليمون والأعشاب.'],{featured:true}),
      item(['Spiced Lamb Cutlets','Baharatlı Kuzu Pirzola','ريش ضأن بالبهارات'],525,8,['Grilled cutlets with a bright herb sauce.','Taze ot soslu ızgara kuzu pirzola.','ريش مشوية مع صلصة الأعشاب.']),
    ],['Grilled over charcoal.','Kömür ateşinde pişirilir.','مشوي على نار الفحم.']),
    section(['Mezze','Mezeler','المقبلات'],[
      item(['Crisp Falafel','Çıtır Falafel','فلافل مقرمشة'],185,10,['Chickpeas, coriander and a pinch of cumin.','Nohut, kişniş ve bir tutam kimyon.','حمص وكزبرة ورشة كمون.'],{dietary:[vegan],featured:true}),
      item(['Market Salad','Pazar Salatası','سلطة السوق'],165,21,['Seasonal vegetables and lemon dressing.','Mevsim sebzeleri ve limonlu sos.','خضروات موسمية وصلصة الليمون.'],{dietary:[vegan]}),
    ]),
    section(['Wraps & drinks','Dürümler ve içecekler','لفائف ومشروبات'],[
      item(['Chicken Shawarma','Tavuk Şavurma','شاورما دجاج'],245,9,['Spit-roasted chicken, garlic sauce and herbs.','Şişte kızarmış tavuk, sarımsak sosu ve otlar.','دجاج شاورما مع صلصة الثوم والأعشاب.']),
      item(['Mint Lemonade','Naneli Limonata','ليمون بالنعناع'],95,6,['Fresh lemon and crushed mint.','Taze limon ve ezilmiş nane.','ليمون طازج ونعناع مجروش.']),
    ]),
  ],
  italian:[
    section(['Wood-fired pizza','Odun fırınında pizza','بيتزا فرن الحطب'],[
      item(['Margherita','Margarita','مارغريتا'],13.5,50,['San Marzano tomatoes, fresh mozzarella and basil.','San Marzano domatesi, mozzarella ve fesleğen.','طماطم سان مارزانو وموزاريلا طازجة وريحان.'],{featured:true,bestseller:true,allergens:[gluten,milk]}),
      item(['Spicy Salami Pizza','Acılı Salamlı Pizza','بيتزا سلامي حارة'],16,59,['Spicy salami, tomato and fior di latte.','Acılı salam, domates ve fior di latte.','سلامي حار وطماطم وجبن فيور دي لاتيه.'],{featured:true}),
      item(['Garden Pizza','Bahçe Pizzası','بيتزا الخضار'],15,38,['Roasted vegetables and fresh herbs.','Fırınlanmış sebzeler ve taze otlar.','خضروات محمّرة وأعشاب طازجة.']),
    ]),
    section(['Handmade pasta','El yapımı makarna','معكرونة يدوية'],[
      item(['Mushroom Tagliatelle','Mantarlı Tagliatelle','تالياتيلي بالفطر'],17,25,['Silky ribbons with wild mushrooms.','Yabani mantarlı taze şerit makarna.','شرائط معكرونة طرية مع فطر بري.'],{featured:true}),
      item(['Creamy Penne','Kremalı Penne','بيني بالكريمة'],14,48,['Penne and a light Parmesan cream.','Penne ve hafif parmesan kreması.','بيني وكريمة بارميزان خفيفة.']),
    ]),
    section(['Dolci','Tatlılar','الحلويات'],[
      item(['Tiramisù','Tiramisu','تيراميسو'],7,45,['Espresso, mascarpone and cocoa.','Espresso, mascarpone ve kakao.','إسبريسو وماسكاربوني وكاكاو.']),
      item(['Berry Cheesecake','Meyveli Cheesecake','تشيز كيك بالتوت'],8,15,['Creamy baked cheesecake with berries.','Orman meyveli fırın cheesecake.','تشيز كيك مخبوز مع التوت.'],{seasonal:true}),
    ]),
  ],
  dessert:[
    section(['Pâtisserie','Pastane','الحلويات الفرنسية'],[
      item(['Raspberry Layer Cake','Ahududulu Kat Pasta','كيك طبقات بالتوت'],245,39,['Vanilla sponge, raspberries and whipped cream.','Vanilyalı pandispanya, ahududu ve çırpılmış krema.','كيك إسفنجي بالفانيليا وتوت وكريمة مخفوقة.'],{featured:true,seasonal:true,bestseller:true,allergens:[gluten,milk]}),
      item(['Vanilla Rose Cupcake','Gül ve Vanilyalı Cupcake','كب كيك الفانيليا والورد'],145,35,['Fluffy vanilla sponge and rose icing.','Vanilyalı kek ve gül aromalı krema.','كيك فانيليا خفيف وكريمة بالورد.'],{featured:true,seasonal:true}),
      item(['Chocolate Torte','Çikolatalı Pasta','تورتة الشوكولاتة'],255,52,['Rich chocolate and a cocoa crumb.','Yoğun çikolata ve kakaolu kırıntı.','شوكولاتة غنية وفتات الكاكاو.'],{featured:true}),
    ]),
    section(['Cream & chocolate','Krema ve çikolata','الكريمة والشوكولاتة'],[
      item(['Chocolate Sundae','Çikolatalı Kup','آيس كريم بالشوكولاتة'],165,36,['Ice cream, chocolate and crisp wafers.','Dondurma, çikolata ve çıtır gofret.','آيس كريم وشوكولاتة ورقائق مقرمشة.'],{featured:true}),
      item(['Dark Chocolate Bites','Bitter Çikolata Lokmaları','لقيمات الشوكولاتة الداكنة'],135,72,['Dark chocolate squares served warm.','Ilık servis edilen bitter çikolata kareleri.','مربعات شوكولاتة داكنة تُقدّم دافئة.']),
    ]),
    section(['Drinks','İçecekler','المشروبات'],[
      item(['Cappuccino','Kapuçino','كابتشينو'],110,2,['Espresso and soft milk foam.','Espresso ve yumuşak süt köpüğü.','إسبريسو ورغوة حليب ناعمة.']),
      item(['Fresh Orange Juice','Taze Portakal Suyu','عصير برتقال طازج'],125,65,['Freshly pressed orange juice.','Taze sıkılmış portakal suyu.','عصير برتقال معصور طازجاً.']),
    ]),
  ],
  fine:[
    section(['At the table','Başlangıçlar','في بداية المائدة'],[
      item(['Charred Garden Greens','Izgara Bahçe Yeşillikleri','خضار الحديقة المشوية'],14,4,['Seasonal greens, lemon and fresh herbs.','Mevsim yeşillikleri, limon ve taze otlar.','خضار موسمية وليمون وأعشاب طازجة.'],{dietary:[vegan]}),
      item(['Market Mezze','Pazar Mezeleri','مقبلات السوق'],18,21,['A selection of herbs and seasonal vegetables.','Taze otlar ve mevsim sebzelerinden bir seçki.','تشكيلة من الأعشاب والخضروات الموسمية.']),
    ]),
    section(['Main courses','Ana yemekler','الأطباق الرئيسية'],[
      item(['Aged Beef & Jus','Dinlendirilmiş Dana ve Jus','لحم بقري معتّق وصلصة اللحم'],42,13,['Grilled dry-aged beef, rested and served with its jus.','Izgara dinlendirilmiş dana, etin kendi sosuyla.','لحم بقري معتّق مشوي يُقدّم مع صلصته.'],{featured:true,bestseller:true}),
      item(['Lemon Butter Fish','Limon Tereyağlı Balık','سمك بزبدة الليمون'],32,14,['Pan-seared fillet with lemon butter and herbs.','Limonlu tereyağı ve otlarla tavada kızartılmış fileto.','فيليه محمّر بزبدة الليمون والأعشاب.'],{featured:true,allergens:[milk,translated(['Fish','Balık','سمك'])]}),
      item(['Truffle Pasta','Trüflü Makarna','معكرونة بالكمأة'],27,25,['Fresh pasta, mushrooms and truffle.','Taze makarna, mantar ve trüf.','معكرونة طازجة وفطر وكمأة.']),
    ]),
    section(['To finish','Tatlı final','ختام المائدة'],[
      item(['Cocoa Dome','Kakaolu Kubbe','قبّة الكاكاو'],15,53,['Dark chocolate, vanilla cream and fruit.','Bitter çikolata, vanilyalı krema ve meyve.','شوكولاتة داكنة وكريمة فانيليا وفاكهة.'],{seasonal:true}),
      item(['Berry Cheesecake','Orman Meyveli Cheesecake','تشيز كيك بالتوت'],13,15,['Fresh berries over lightly baked cheesecake.','Hafif fırınlanmış cheesecake üzerinde taze meyveler.','توت طازج فوق تشيز كيك مخبوز برفق.']),
    ]),
  ],
};
const brands = {
  burger:['Patty Club','Smash burgers','Smash burgerler','برغر على الصاج',24,'TRY','Crisp edges, soft buns and house sauces.','Çıtır kenarlar, yumuşak ekmek ve ev yapımı soslar.','أطراف مقرمشة وخبز طري وصلصات من الدار.'],
  coffee:['Form Coffee','Specialty coffee','Nitelikli kahve','قهوة مختصة',2,'EUR','Coffee, slow mornings and something sweet.','Kahve, sakin sabahlar ve tatlı bir şeyler.','قهوة وصباح هادئ وشيء حلو.'],
  arabic:['Zaytouna Kitchen','Levantine table','Levant mutfağı','المائدة الشامية',28,'TRY','Charcoal, warm bread and plates to share.','Kömür ateşi, sıcak ekmek ve paylaşmalık tabaklar.','مشويات على الفحم وخبز دافئ وأطباق للمشاركة.'],
  italian:['Casa Acero','Pizzeria & pasta','Pizza ve makarna','بيتزا ومعكرونة',5,'EUR','Wood-fired pizza and pasta made by hand.','Odun fırınında pizza ve el yapımı makarna.','بيتزا فرن الحطب ومعكرونة يدوية.'],
  dessert:['Petal Pâtisserie','Pâtisserie & café','Pastane ve kafe','حلويات ومقهى',39,'TRY','Seasonal cakes and small-batch pastries.','Mevsimlik pastalar ve günlük hamur işleri.','كيك موسمي ومعجنات محضّرة بكميات صغيرة.'],
  fine:['Terra Table','Seasonal dining','Mevsimlik mutfak','مائدة موسمية',13,'USD','A short seasonal menu with produce from the local market.','Yerel pazardan ürünlerle hazırlanan kısa mevsimlik menü.','قائمة موسمية قصيرة من محاصيل السوق المحلي.'],
};
export const datasets = [
  ['burger','Patty Club · Burger restaurant'],['coffee','Form Coffee · Specialty café'],['arabic','Zaytouna Kitchen · Levantine restaurant'],
  ['italian','Casa Acero · Italian restaurant'],['dessert','Petal Pâtisserie · Dessert shop'],['fine','Terra Table · Fine dining'],
  ['sparse','Test · Missing images and links'],['long','Test · Long names and Arabic copy'],['large','Test · 320 dishes'],['mixed','Test · Currencies and image ratios'],
];
export function fixture(id,{advanced=false}={}) {
  const source = ({sparse:'coffee',long:'arabic',large:'burger',mixed:'italian'})[id] || id;
  const [businessName,tagline,tr,ar,cover,currency,...description] = brands[source] || brands.burger;
  const data = {
    fixture:id, businessName, currency, menuLanguage:'en',
    categories:structuredClone(lists[source] || lists.burger),
    restaurant:{
      name:translated([businessName,businessName,source === 'arabic' ? 'مطبخ زيتونة' : businessName]),
      tagline:translated([tagline,tr,ar]),description:translated(description),
      logo:logoPath(source),cover:photoPath(cover),coverSmall:photoPath(cover,320),
      address:translated(['Kadıköy, Istanbul','Kadıköy, İstanbul','كاديكوي، إسطنبول']),
      openingHours:translated(['Daily 11:00–22:30','Her gün 11.00–22.30','يوميًا ١١:٠٠–٢٢:٣٠']),
      announcement:source === 'burger' ? translated(['House Smash special today','Bugüne özel Ev Usulü Smash','عرض سماش الدار اليوم']) : '',
      links:{directions:'https://www.google.com/maps/search/?api=1&query=Kad%C4%B1k%C3%B6y%2C%20Istanbul',
        instagram:'https://www.instagram.com/', facebook:'https://www.facebook.com/',tiktok:'https://www.tiktok.com/',
        review:'https://www.google.com/maps/',website:'https://example.com/'},
    },
  };
  if (id === 'burger' && advanced) {
    const smash=data.categories[0].items[0];
    smash.modelId='demo-smash';
    smash.demoCutout=true;
    smash.ingredientLayers=[
      ['bun',['Toasted bun','Kızarmış ekmek','خبز محمص']],
      ['cheddar',['Cheddar','Çedar','جبن شيدر']],
      ['patty',['Beef patties','Dana köftesi','قطع لحم بقري']],
    ].map(([key,name])=>({name:translated(name),imageUrl:new URL('./advanced/'+key+'.svg',import.meta.url).pathname}));
  }
  if (source === 'arabic') {
    const last = data.categories[2];
    last.subcategories = [section(['Cold drinks','Soğuk içecekler','مشروبات باردة'],[last.items.pop()])];
  }
  if (id === 'sparse') {
    data.restaurant = {};
    for (const category of data.categories) {
      delete category.imageUrl;
      for (const dish of category.items) {
        delete dish.imageUrl; delete dish.imageSmall;
        dish.description = ''; delete dish.translations.description;
      }
    }
  }
  if (id === 'long') {
    data.restaurant.name.ar = 'مطبخ زيتونة للمأكولات الشامية التقليدية والمشاوي على الفحم والأطباق العائلية';
    data.restaurant.description.ar = 'أطباق نعدّها يوميًا من الخضار الموسمية والأعشاب الطازجة. تُقدّم المشاوي مع الخبز الساخن والمقبلات التي تناسب المشاركة مع العائلة والأصدقاء.';
    data.categories[0].items[0].translations.name.ar = 'كباب لحم الضأن المتبّل بالأعشاب الطازجة والمشوي على الفحم مع الخبز الساخن وسلطة البقدونس';
  }
  if (id === 'large') {
    const originals = data.categories.flatMap(category => category.items);
    data.categories = Array.from({length:16},(_,index) => section(
      ['Selection '+(index+1),'Seçki '+(index+1),'تشكيلة '+(index+1)],
      Array.from({length:20},(_,position) => {
        const original = originals[(index+position)%originals.length];
        return {...original,name:original.name+' '+(position+1),translations:{...original.translations,
          name:Object.fromEntries(Object.entries(original.translations.name).map(([key,value]) => [key,value+' '+(position+1)]))}};
      })));
  }
  if (id === 'mixed') {
    const items = data.categories.flatMap(category => category.items);
    ['USD','TND','TRY','EUR','JPY'].forEach((code,index) => { items[index].currency = code; });
    items[1].available = false;
    items[2].imageUrl = new URL('./photos/missing.webp',import.meta.url).pathname;
    delete items[2].imageSmall;
    data.categories[1].items[0].imageUrl = photoPath(45);
  }
  return data;
}
