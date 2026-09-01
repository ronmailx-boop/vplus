export const CATEGORIES = {
  'פירות וירקות': '#22c55e',
  'בשר ודגים': '#ef4444',
  'חלב וביצים': '#3b82f6',
  'לחם ומאפים': '#f59e0b',
  'שימורים': '#8b5cf6',
  'חטיפים': '#ec4899',
  'משקאות': '#06b6d4',
  'ניקיון': '#10b981',
  'היגיינה': '#6366f1',
  'אחר': '#6b7280',
};

export const CATEGORY_LABELS = {
  'פירות וירקות': '🥬 פירות וירקות',
  'בשר ודגים': '🥩 בשר ודגים',
  'חלב וביצים': '🥛 חלב וביצים',
  'לחם ומאפים': '🍞 לחם ומאפים',
  'שימורים': '🥫 שימורים',
  'חטיפים': '🍪 חטיפים',
  'משקאות': '🥤 משקאות',
  'ניקיון': '🧹 ניקיון',
  'היגיינה': '🧴 היגיינה',
  'אחר': '📦 אחר',
};

export const CATEGORY_ORDER = Object.keys(CATEGORIES);

export const CATEGORY_KEYWORDS = {
    'פירות וירקות': [
        // עברית
        'עגבניות', 'עגבנייה', 'מלפפון', 'מלפפונים', 'חסה', 'חציל', 'גזר', 'בצל', 'שום', 'תפוח', 'תפוחים',
        'בננה', 'בננות', 'תפוז', 'תפוזים', 'אבוקדו', 'לימון', 'לימונים', 'תות', 'תותים', 'ענבים',
        'אבטיח', 'מלון', 'אפרסק', 'אפרסקים', 'שזיף', 'שזיפים', 'אגס', 'אגסים', 'תרד', 'כרוב',
        'ברוקולי', 'כרובית', 'פלפל', 'פלפלים', 'קישוא', 'קישואים', 'דלעת', 'תירס', 'פטריות',
        'ירקות', 'פירות', 'ירק', 'פרי', 'סלט', 'פטרוזיליה', 'כוסברה', 'נענע', 'בזיליקום',
        // English
        'tomato', 'tomatoes', 'cucumber', 'cucumbers', 'lettuce', 'eggplant', 'carrot', 'carrots', 'onion', 'onions',
        'garlic', 'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'avocado', 'lemon', 'lemons',
        'strawberry', 'strawberries', 'grapes', 'watermelon', 'melon', 'peach', 'peaches', 'plum', 'plums',
        'pear', 'pears', 'spinach', 'cabbage', 'broccoli', 'cauliflower', 'pepper', 'peppers', 'zucchini',
        'pumpkin', 'corn', 'mushroom', 'mushrooms', 'vegetables', 'veggies', 'fruits', 'fruit', 'salad',
        'parsley', 'cilantro', 'coriander', 'mint', 'basil',
        // Русский
        'помидор', 'помидоры', 'огурец', 'огурцы', 'салат', 'баклажан', 'морковь', 'лук', 'чеснок',
        'яблоко', 'яблоки', 'банан', 'бананы', 'апельсин', 'апельсины', 'авокадо', 'лимон', 'лимоны',
        'клубника', 'виноград', 'арбуз', 'дыня', 'персик', 'персики', 'слива', 'сливы', 'груша', 'груши',
        'шпинат', 'капуста', 'брокколи', 'цветная капуста', 'перец', 'кабачок', 'тыква', 'кукуруза',
        'грибы', 'гриб', 'овощи', 'фрукты', 'петрушка', 'кинза', 'мята', 'базилик',
        // Română
        'roșii', 'roșie', 'castravete', 'castraveți', 'salată', 'vânătă', 'morcov', 'morcovi', 'ceapă',
        'usturoi', 'măr', 'mere', 'banană', 'banane', 'portocală', 'portocale', 'avocado', 'lămâie', 'lămâi',
        'căpșuni', 'struguri', 'pepene', 'pepene galben', 'piersică', 'piersici', 'prună', 'prune', 'pară', 'pere',
        'spanac', 'varză', 'broccoli', 'conopidă', 'ardei', 'dovlecel', 'dovleac', 'porumb', 'ciuperci',
        'legume', 'fructe', 'pătrunjel', 'coriandru', 'mentă', 'busuioc'
    ],
    'בשר ודגים': [
        // עברית
        'בשר', 'עוף', 'תרנגולת', 'הודו', 'נקניק', 'נקניקיות', 'קבב', 'המבורגר', 'שניצל',
        'סטייק', 'אנטריקוט', 'צלי', 'כבד', 'קורנדביף', 'סלמי', 'נתחי', 'כנפיים', 'לב עוף', 'לב בקר',
        'דג', 'דגים', 'סלמון', 'טונה', 'בקלה', 'אמנון', 'דניס', 'לוקוס', 'מושט', 'בורי',
        'שרימפס', 'קלמרי', 'פירות ים', 'סרדינים', 'מקרל',
        // English
        'meat', 'beef', 'chicken', 'turkey', 'sausage', 'sausages', 'kebab', 'burger', 'hamburger',
        'schnitzel', 'steak', 'ribeye', 'roast', 'liver', 'heart', 'corned beef', 'salami', 'wings',
        'fish', 'salmon', 'tuna', 'cod', 'tilapia', 'bass', 'trout', 'sardines', 'mackerel',
        'shrimp', 'prawns', 'squid', 'seafood', 'pork', 'lamb', 'veal', 'duck', 'ground meat',
        // Русский
        'мясо', 'говядина', 'курица', 'индейка', 'колбаса', 'сосиски', 'кебаб', 'бургер', 'гамбургер',
        'шницель', 'стейк', 'рибай', 'жаркое', 'печень', 'сердце', 'солонина', 'салями', 'крылышки',
        'рыба', 'лосось', 'тунец', 'треска', 'тилапия', 'окунь', 'форель', 'сардины', 'скумбрия',
        'креветки', 'кальмар', 'морепродукты', 'свинина', 'баранина', 'телятина', 'утка', 'фарш',
        // Română
        'carne', 'vită', 'pui', 'curcan', 'cârnat', 'cârnați', 'kebab', 'burger', 'hamburger',
        'șnițel', 'friptură', 'antricot', 'friptură', 'ficat', 'inimă', 'pastramă', 'salam', 'aripioare',
        'pește', 'somon', 'ton', 'cod', 'tilapia', 'biban', 'păstrăv', 'sardine', 'macrou',
        'creveți', 'calmar', 'fructe de mare', 'porc', 'miel', 'vițel', 'rață', 'carne tocată'
    ],
    'חלב וביצים': [
        // עברית
        'חלב', 'גבינה', 'גבינות', 'קוטג', 'קוטג׳', 'יוגורט', 'שמנת', 'חמאה', 'ביצים', 'ביצה',
        'לבן', 'לבנה', 'צפתית', 'בולגרית', 'צהובה', 'מוצרלה', 'פרמזן', 'עמק', 'גילה',
        'גד', 'תנובה', 'שטראוס', 'יופלה', 'דנונה', 'מילקי', 'פודינג', 'חלבון', 'מעדן',
        'גלידה', 'גלידות', 'חלבי', 'חלביים',
        // English
        'milk', 'cheese', 'cottage', 'cottage cheese', 'yogurt', 'yoghurt', 'cream', 'sour cream',
        'butter', 'eggs', 'egg', 'white cheese', 'feta', 'bulgarian cheese', 'yellow cheese',
        'mozzarella', 'parmesan', 'cheddar', 'swiss', 'gouda', 'brie', 'cream cheese',
        'pudding', 'protein', 'dessert', 'ice cream', 'dairy', 'milk products',
        // Русский
        'молоко', 'сыр', 'творог', 'йогурт', 'сметана', 'сливки', 'масло', 'яйца', 'яйцо',
        'белый сыр', 'фета', 'брынза', 'болгарский сыр', 'желтый сыр', 'моцарелла', 'пармезан',
        'чеддер', 'швейцарский', 'гауда', 'бри', 'сливочный сыр', 'пудинг', 'белок', 'десерт',
        'мороженое', 'молочные продукты', 'молочное',
        // Română
        'lapte', 'brânză', 'brânză de vaci', 'iaurt', 'smântână', 'unt', 'ouă',
        'brânză albă', 'telemea', 'brânză bulgărească', 'brânză galbenă', 'mozzarella', 'parmezan',
        'cheddar', 'gouda', 'brie', 'brânză cremă', 'budincă', 'proteină', 'desert',
        'înghețată', 'lactate', 'produse lactate'
    ],
    'לחם ומאפים': [
        // עברית
        'לחם', 'לחמניה', 'לחמניות', 'פיתה', 'פיתות', 'בגט', 'חלה', 'חלות', 'טוסט', 'כריך',
        'רוגלך', 'בורקס', 'בורקסים', 'קרואסון', 'קרואסונים', 'מאפה', 'מאפים', 'עוגה', 'עוגות',
        'עוגיות', 'עוגייה', 'ביסקוויט', 'קרקר', 'קרקרים', 'פריכיות', 'לחמית', 'בייגל',
        'מצה', 'מצות', 'פיצה', 'פסטה', 'ספגטי', 'מקרוני', 'אטריות', 'קוסקוס', 'בורגול',
        'קמח', 'שמרים', 'אבקת אפייה', 'סוכר', 'אורז', 'פתיתים',
        // English
        'bread', 'roll', 'rolls', 'pita', 'baguette', 'challah', 'toast', 'sandwich',
        'croissant', 'croissants', 'pastry', 'pastries', 'cake', 'cakes', 'cookie', 'cookies',
        'biscuit', 'biscuits', 'cracker', 'crackers', 'bagel', 'bagels', 'matzah', 'matzo',
        'pizza', 'pasta', 'spaghetti', 'macaroni', 'noodles', 'couscous', 'bulgur',
        'flour', 'yeast', 'baking powder', 'sugar', 'rice', 'cereal', 'flakes',
        // Русский
        'хлеб', 'булка', 'булочка', 'пита', 'багет', 'хала', 'тост', 'сэндвич',
        'круассан', 'круассаны', 'выпечка', 'пирожное', 'торт', 'торты', 'печенье', 'бисквит',
        'крекер', 'крекеры', 'бублик', 'маца', 'пицца', 'паста', 'спагетти', 'макароны',
        'лапша', 'кускус', 'булгур', 'мука', 'дрожжи', 'разрыхлитель', 'сахар', 'рис',
        'хлопья', 'каша',
        // Română
        'pâine', 'chiflă', 'chifle', 'pita', 'baghetă', 'challah', 'toast', 'sandviș',
        'croissant', 'croissante', 'patiserie', 'prăjitură', 'prăjituri', 'tort', 'biscuit', 'biscuiți',
        'fursec', 'cracker', 'covrig', 'matzah', 'pizza', 'paste', 'spaghete', 'macaroane',
        'tăiței', 'cuscus', 'bulgur', 'făină', 'drojdie', 'praf de copt', 'zahăr', 'orez',
        'cereale', 'fulgi'
    ],
    'שימורים': [
        // עברית
        'שימורים', 'קופסא', 'קופסת', 'שימורי', 'תירס שימורי', 'פטריות שימורי', 'זיתים',
        'מלפפונים חמוצים', 'חמוצים', 'כבושים', 'רוטב עגבניות', 'עגבניות מרוסקות', 'ממרח',
        'טונה קופסא', 'סרדינים קופסא', 'הומוס', 'טחינה', 'חומוס', 'פול', 'חומוס מוכן',
        'סלט', 'פסטה מוכנה', 'רוטב', 'רטבים', 'קטשופ', 'מיונז', 'חרדל', 'ריבה', 'דבש',
        'ממרחים', 'נוטלה', 'שוקולד ממרח',
        // English
        'canned', 'can', 'cans', 'preserved', 'canned corn', 'canned mushrooms', 'olives',
        'pickles', 'pickled', 'tomato sauce', 'crushed tomatoes', 'spread', 'spreads',
        'canned tuna', 'canned sardines', 'hummus', 'tahini', 'beans', 'ready hummus',
        'salad', 'ready pasta', 'sauce', 'sauces', 'ketchup', 'mayo', 'mayonnaise', 'mustard',
        'jam', 'jams', 'honey', 'nutella', 'chocolate spread', 'peanut butter',
        // Русский
        'консервы', 'банка', 'банки', 'консервированный', 'кукуруза консервированная', 'грибы консервированные',
        'оливки', 'маслины', 'соленья', 'маринованные', 'томатный соус', 'помидоры резаные', 'паста',
        'тунец консервированный', 'сардины консервированные', 'хумус', 'тахини', 'фасоль', 'готовый хумус',
        'салат', 'готовая паста', 'соус', 'соусы', 'кетчуп', 'майонез', 'горчица', 'варенье', 'мед',
        'паста ореховая', 'нутелла', 'шоколадная паста',
        // Română
        'conserve', 'conservă', 'cutie', 'cutii', 'porumb conservat', 'ciuperci conservate', 'măsline',
        'castraveți murați', 'murături', 'sos de roșii', 'roșii tocate', 'pastă', 'paste',
        'ton conservat', 'sardine conservate', 'humus', 'tahini', 'fasole', 'humus gata',
        'salată', 'paste gata', 'sos', 'sosuri', 'ketchup', 'maioneză', 'muștar', 'gem', 'miere',
        'unt de arahide', 'nutella', 'pastă de ciocolată'
    ],
    'חטיפים': [
        // עברית
        'חטיף', 'חטיפים', 'במבה', 'ביסלי', 'דוריטוס', 'צ׳יפס', 'צ׳יטוס', 'אפרופו', 'טורטית',
        'פופקורן', 'בוטנים', 'אגוזים', 'שקדים', 'קשיו', 'פיסטוק', 'גרעינים', 'צימוקים',
        'פירות יבשים', 'תמרים', 'משמש מיובש', 'שוקולד', 'ממתק', 'ממתקים', 'סוכריות',
        'גומי', 'מנטה', 'מסטיק', 'וופל', 'וופלים', 'חטיף אנרגיה', 'חטיף חלבון', 'גרנולה',
        'בר', 'ברים', 'קליק', 'פסק זמן', 'קינדר', 'מרס', 'סניקרס', 'טוויקס', 'קיט קט',
        // English
        'snack', 'snacks', 'chips', 'crisps', 'doritos', 'cheetos', 'tortilla', 'tortilla chips',
        'popcorn', 'peanuts', 'nuts', 'almonds', 'cashews', 'pistachios', 'seeds', 'raisins',
        'dried fruit', 'dates', 'dried apricots', 'chocolate', 'candy', 'candies', 'sweets',
        'gummies', 'mint', 'gum', 'chewing gum', 'wafer', 'wafers', 'energy bar', 'protein bar',
        'granola', 'bar', 'bars', 'kinder', 'mars', 'snickers', 'twix', 'kit kat', 'pretzels',
        // Русский
        'снэк', 'чипсы', 'дорitos', 'читос', 'тортилья', 'попкорн', 'арахис', 'орехи',
        'миндаль', 'кешью', 'фисташки', 'семечки', 'изюм', 'сухофрукты', 'финики', 'курага',
        'шоколад', 'конфета', 'конфеты', 'сладости', 'мармелад', 'мятные', 'жвачка', 'вафля',
        'вафли', 'энергетический батончик', 'протеиновый батончик', 'гранола', 'батончик',
        'киндер', 'марс', 'сникерс', 'твикс', 'кит кат',
        // Română
        'gustare', 'chips', 'chipsuri', 'doritos', 'cheetos', 'tortilla', 'popcorn', 'alune',
        'nuci', 'migdale', 'caju', 'fistic', 'semințe', 'stafide', 'fructe uscate', 'curmale',
        'caise uscate', 'ciocolată', 'bomboane', 'dulciuri', 'jeleuri', 'mentă', 'gumă de mestecat',
        'napolitană', 'napolitane', 'baton energetic', 'baton proteic', 'granola', 'baton',
        'kinder', 'mars', 'snickers', 'twix', 'kit kat'
    ],
    'משקאות': [
        // עברית
        'מים', 'מינרלים', 'נביעות', 'עדן', 'נווה', 'קולה', 'פפסי', 'ספרייט', 'פאנטה',
        'שוופס', 'סודה', 'משקה', 'משקאות', 'מיץ', 'מיצים', 'תפוזים', 'פריגת', 'פרימור',
        'בירה', 'יין', 'וודקה', 'ויסקי', 'אלכוהול', 'קפה', 'נס', 'נסקפה', 'תה', 'תיונים',
        'ויסוצקי', 'חליבה', 'שוקו', 'חלב שוקולד', 'אייס קפה', 'אנרגיה', 'רד בול', 'XL',
        'פחית', 'בקבוק', 'שתייה', 'לימונדה', 'לימונענע', 'תפוזינה',
        // English
        'water', 'mineral water', 'sparkling water', 'cola', 'coke', 'pepsi', 'sprite', 'fanta',
        'soda', 'soft drink', 'beverage', 'juice', 'orange juice', 'apple juice', 'grape juice',
        'beer', 'wine', 'vodka', 'whiskey', 'whisky', 'alcohol', 'coffee', 'nescafe', 'tea',
        'milk shake', 'chocolate milk', 'iced coffee', 'energy drink', 'red bull', 'monster',
        'can', 'bottle', 'drink', 'lemonade', 'orangeade',
        // Русский
        'вода', 'минеральная вода', 'газировка', 'кола', 'пепси', 'спрайт', 'фанта', 'швепс',
        'содовая', 'напиток', 'сок', 'соки', 'апельсиновый сок', 'яблочный сок', 'виноградный сок',
        'пиво', 'вино', 'водка', 'виски', 'алкоголь', 'кофе', 'нескафе', 'чай', 'молочный коктейль',
        'шоколадное молоко', 'холодный кофе', 'энергетик', 'ред булл', 'монстр', 'банка', 'бутылка',
        'питье', 'лимонад',
        // Română
        'apă', 'apă minerală', 'apă gazoasă', 'cola', 'pepsi', 'sprite', 'fanta', 'schweppes',
        'suc', 'băutură', 'suc de portocale', 'suc de mere', 'suc de struguri', 'bere', 'vin',
        'vodcă', 'whisky', 'alcool', 'cafea', 'nescafe', 'ceai', 'milkshake', 'lapte cu ciocolată',
        'cafea rece', 'băutură energizantă', 'red bull', 'monster', 'cutie', 'sticlă', 'băutură',
        'limonadă'
    ],
    'ניקיון': [
        // עברית
        'סבון', 'סבונים', 'ניקוי', 'ניקיון', 'דטרגנט', 'אבקת כביסה', 'מרכך', 'מרככים',
        'אקונומיקה', 'סנו', 'כלורקס', 'ווניש', 'פרסיל', 'אריאל', 'ביומט', 'סיף', 'מטליות',
        'ספוג', 'ספוגים', 'מגבונים', 'נייר מגבת', 'נייר טואלט', 'טישו', 'מברשת', 'מברשות',
        'שואב', 'שקיות אשפה', 'אשפה', 'סמרטוט', 'דלי', 'מנקה', 'מנקים', 'אקונומיקה',
        'ג׳ל כלים', 'נוזל כלים', 'פיירי', 'סודה לשתייה', 'חומץ', 'אלכוהול ניקוי', 'כפפות',
        // English
        'soap', 'soaps', 'cleaning', 'cleaner', 'detergent', 'laundry detergent', 'fabric softener',
        'bleach', 'clorox', 'vanish', 'persil', 'ariel', 'tide', 'cloths', 'cloth', 'sponge', 'sponges',
        'wipes', 'paper towel', 'toilet paper', 'tissue', 'tissues', 'brush', 'brushes', 'vacuum',
        'garbage bags', 'trash bags', 'garbage', 'mop', 'bucket', 'dish soap', 'dishwashing liquid',
        'fairy', 'baking soda', 'vinegar', 'rubbing alcohol', 'gloves', 'cleaning gloves',
        // Русский
        'мыло', 'чистка', 'моющее средство', 'стиральный порошок', 'кондиционер для белья', 'отбеливатель',
        'хлоркс', 'ваниш', 'персил', 'ариэль', 'тайд', 'тряпки', 'губка', 'губки', 'салфетки',
        'бумажные полотенца', 'туалетная бумага', 'носовые платки', 'щетка', 'щетки', 'пылесос',
        'мешки для мусора', 'мусор', 'швабра', 'ведро', 'средство для посуды', 'фейри', 'сода',
        'уксус', 'спирт', 'перчатки',
        // Română
        'săpun', 'curățenie', 'detergent', 'detergent de rufe', 'balsam de rufe', 'înălbitor',
        'clorox', 'vanish', 'persil', 'ariel', 'tide', 'cârpe', 'burete', 'bureți', 'șervețele',
        'prosop de hârtie', 'hârtie igienică', 'batiste', 'perie', 'perii', 'aspirator',
        'saci de gunoi', 'gunoi', 'mop', 'găleată', 'detergent de vase', 'fairy', 'bicarbonat',
        'oțet', 'alcool', 'mănuși'
    ],
    'היגיינה': [
        // עברית
        'שמפו', 'מרכך שיער', 'סבון גוף', 'ג׳ל רחצה', 'משחת שיניים', 'מברשת שיניים', 'חוט דנטלי',
        'דאודורנט', 'בושם', 'קרם', 'קרמים', 'תחליב', 'לוסיון', 'קצף גילוח', 'סכין גילוח',
        'מכונת גילוח', 'ג׳ילט', 'ואקס', 'תחבושות', 'פלסטרים', 'צמר גפן', 'מקלוני אוזניים',
        'טמפונים', 'תחבושות היגייניות', 'מגבונים לחים', 'חיתולים', 'האגיס', 'פמפרס',
        'קרם ידיים', 'קרם פנים', 'מסכה', 'מסכות', 'איפור', 'שפתון', 'מסקרה', 'טיפוח',
        // English
        'shampoo', 'conditioner', 'hair conditioner', 'body soap', 'shower gel', 'toothpaste',
        'toothbrush', 'dental floss', 'deodorant', 'perfume', 'cologne', 'cream', 'lotion',
        'shaving cream', 'razor', 'shaving razor', 'gillette', 'wax', 'bandages', 'band-aids',
        'cotton', 'cotton swabs', 'q-tips', 'tampons', 'pads', 'sanitary pads', 'wet wipes',
        'diapers', 'huggies', 'pampers', 'hand cream', 'face cream', 'mask', 'masks', 'makeup',
        'lipstick', 'mascara', 'skincare', 'cosmetics',
        // Русский
        'шампунь', 'кондиционер', 'кондиционер для волос', 'мыло для тела', 'гель для душа',
        'зубная паста', 'зубная щетка', 'зубная нить', 'дезодорант', 'духи', 'одеколон', 'крем',
        'лосьон', 'пена для бритья', 'бритва', 'бритвенный станок', 'жиллетт', 'воск', 'бинты',
        'пластыри', 'вата', 'ватные палочки', 'тампоны', 'прокладки', 'влажные салфетки',
        'подгузники', 'хаггис', 'памперс', 'крем для рук', 'крем для лица', 'маска', 'маски',
        'макияж', 'косметика', 'помада', 'тушь', 'уход за кожей',
        // Română
        'șampon', 'balsam', 'balsam de păr', 'săpun de corp', 'gel de duș', 'pastă de dinți',
        'periuță de dinți', 'ață dentară', 'deodorant', 'parfum', 'cremă', 'loțiune',
        'spumă de ras', 'aparat de ras', 'gillette', 'ceară', 'bandaje', 'plasturi',
        'vată', 'bețișoare', 'tampoane', 'absorbante', 'șervețele umede', 'scutece',
        'huggies', 'pampers', 'cremă de mâini', 'cremă de față', 'mască', 'măști',
        'machiaj', 'ruj', 'rimel', 'cosmetice', 'îngrijire piele'
    ],
};

export function detectCategory(productName) {
  if (!productName) return 'אחר';
  const nameLower = productName.toLowerCase().trim();
  const nameSpaced = ` ${nameLower} `;
  function matchesKeyword(kw) {
    const k = kw.toLowerCase();
    return nameLower.includes(k) || nameSpaced.includes(` ${k} `);
  }
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(keyword)) return category;
    }
  }
  return 'אחר';
}

export const APP_NAME = 'vplus';
export const STORAGE_KEY = 'vplus_db_v1';
export const APP_VERSION = 49;
