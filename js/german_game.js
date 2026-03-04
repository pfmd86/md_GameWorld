// Module for the German game — functions are referenced internally and wired to DOM listeners
// ── Word bank (200+ words) ────────────────────────────────────────────────────
const words = [
  // Animals
  {en:"dog",de:"der Hund",emoji:"🐶"},{en:"cat",de:"die Katze",emoji:"🐱"},
  {en:"bird",de:"der Vogel",emoji:"🐦"},{en:"fish",de:"der Fisch",emoji:"🐟"},
  {en:"rabbit",de:"das Kaninchen",emoji:"🐰"},{en:"horse",de:"das Pferd",emoji:"🐴"},
  {en:"cow",de:"die Kuh",emoji:"🐄"},{en:"pig",de:"das Schwein",emoji:"🐷"},
  {en:"duck",de:"die Ente",emoji:"🦆"},{en:"elephant",de:"der Elefant",emoji:"🐘"},
  {en:"lion",de:"der Löwe",emoji:"🦁"},{en:"tiger",de:"der Tiger",emoji:"🐯"},
  {en:"bear",de:"der Bär",emoji:"🐻"},{en:"mouse",de:"die Maus",emoji:"🐭"},
  {en:"frog",de:"der Frosch",emoji:"🐸"},{en:"butterfly",de:"der Schmetterling",emoji:"🦋"},
  {en:"bee",de:"die Biene",emoji:"🐝"},{en:"snake",de:"die Schlange",emoji:"🐍"},
  {en:"turtle",de:"die Schildkröte",emoji:"🐢"},{en:"monkey",de:"der Affe",emoji:"🐒"},
  {en:"penguin",de:"der Pinguin",emoji:"🐧"},{en:"sheep",de:"das Schaf",emoji:"🐑"},
  {en:"chicken",de:"das Huhn",emoji:"🐔"},{en:"wolf",de:"der Wolf",emoji:"🐺"},
  {en:"fox",de:"der Fuchs",emoji:"🦊"},{en:"deer",de:"das Reh",emoji:"🦌"},
  {en:"owl",de:"die Eule",emoji:"🦉"},{en:"parrot",de:"der Papagei",emoji:"🦜"},
  {en:"crocodile",de:"das Krokodil",emoji:"🐊"},{en:"dolphin",de:"der Delfin",emoji:"🐬"},
  {en:"whale",de:"der Wal",emoji:"🐳"},{en:"shark",de:"der Hai",emoji:"🦈"},
  {en:"giraffe",de:"die Giraffe",emoji:"🦒"},{en:"zebra",de:"das Zebra",emoji:"🦓"},
  {en:"gorilla",de:"der Gorilla",emoji:"🦍"},{en:"hedgehog",de:"der Igel",emoji:"🦔"},
  {en:"squirrel",de:"das Eichhörnchen",emoji:"🐿️"},{en:"flamingo",de:"der Flamingo",emoji:"🦩"},
  {en:"spider",de:"die Spinne",emoji:"🕷️"},{en:"ant",de:"die Ameise",emoji:"🐜"},
  {en:"crab",de:"die Krabbe",emoji:"🦀"},{en:"octopus",de:"der Oktopus",emoji:"🐙"},
  {en:"snail",de:"die Schnecke",emoji:"🐌"},{en:"worm",de:"der Wurm",emoji:"🪱"},
  {en:"bat",de:"die Fledermaus",emoji:"🦇"},{en:"camel",de:"das Kamel",emoji:"🐪"},
  // Food & Drink
  {en:"apple",de:"der Apfel",emoji:"🍎"},{en:"banana",de:"die Banane",emoji:"🍌"},
  {en:"bread",de:"das Brot",emoji:"🍞"},{en:"milk",de:"die Milch",emoji:"🥛"},
  {en:"egg",de:"das Ei",emoji:"🥚"},{en:"cheese",de:"der Käse",emoji:"🧀"},
  {en:"water",de:"das Wasser",emoji:"💧"},{en:"juice",de:"der Saft",emoji:"🧃"},
  {en:"cake",de:"der Kuchen",emoji:"🎂"},{en:"cookie",de:"der Keks",emoji:"🍪"},
  {en:"ice cream",de:"das Eis",emoji:"🍦"},{en:"pizza",de:"die Pizza",emoji:"🍕"},
  {en:"strawberry",de:"die Erdbeere",emoji:"🍓"},{en:"orange",de:"die Orange",emoji:"🍊"},
  {en:"soup",de:"die Suppe",emoji:"🍲"},{en:"butter",de:"die Butter",emoji:"🧈"},
  {en:"chocolate",de:"die Schokolade",emoji:"🍫"},{en:"potato",de:"die Kartoffel",emoji:"🥔"},
  {en:"tomato",de:"die Tomate",emoji:"🍅"},{en:"carrot",de:"die Karotte",emoji:"🥕"},
  {en:"grapes",de:"die Traube",emoji:"🍇"},{en:"melon",de:"die Melone",emoji:"🍈"},
  {en:"peach",de:"der Pfirsich",emoji:"🍑"},{en:"cherry",de:"die Kirsche",emoji:"🍒"},
  {en:"lemon",de:"die Zitrone",emoji:"🍋"},{en:"pineapple",de:"die Ananas",emoji:"🍍"},
  {en:"mango",de:"die Mango",emoji:"🥭"},{en:"avocado",de:"die Avocado",emoji:"🥑"},
  {en:"corn",de:"der Mais",emoji:"🌽"},{en:"pepper",de:"die Paprika",emoji:"🫑"},
  {en:"mushroom",de:"der Pilz",emoji:"🍄"},{en:"noodles",de:"die Nudeln",emoji:"🍝"},
  {en:"rice",de:"der Reis",emoji:"🍚"},{en:"salad",de:"der Salat",emoji:"🥗"},
  {en:"sandwich",de:"das Sandwich",emoji:"🥪"},{en:"pretzel",de:"die Brezel",emoji:"🥨"},
  {en:"coffee",de:"der Kaffee",emoji:"☕"},{en:"tea",de:"der Tee",emoji:"🍵"},
  {en:"honey",de:"der Honig",emoji:"🍯"},{en:"salt",de:"das Salz",emoji:"🧂"},
  {en:"sugar",de:"der Zucker",emoji:"🍬"},{en:"pear",de:"die Birne",emoji:"🍐"},
  {en:"plum",de:"die Pflaume",emoji:"🟣"},{en:"coconut",de:"die Kokosnuss",emoji:"🥥"},
  {en:"garlic",de:"der Knoblauch",emoji:"🧄"},{en:"onion",de:"die Zwiebel",emoji:"🧅"},
  {en:"broccoli",de:"der Brokkoli",emoji:"🥦"},{en:"cucumber",de:"die Gurke",emoji:"🥒"},
  {en:"pumpkin",de:"der Kürbis",emoji:"🎃"},{en:"watermelon",de:"die Wassermelone",emoji:"🍉"},
  // Body
  {en:"hand",de:"die Hand",emoji:"✋"},{en:"foot",de:"der Fuß",emoji:"🦶"},
  {en:"eye",de:"das Auge",emoji:"👁️"},{en:"nose",de:"die Nase",emoji:"👃"},
  {en:"mouth",de:"der Mund",emoji:"👄"},{en:"ear",de:"das Ohr",emoji:"👂"},
  {en:"hair",de:"das Haar",emoji:"💇"},{en:"heart",de:"das Herz",emoji:"❤️"},
  {en:"tooth",de:"der Zahn",emoji:"🦷"},{en:"arm",de:"der Arm",emoji:"💪"},
  {en:"leg",de:"das Bein",emoji:"🦵"},{en:"finger",de:"der Finger",emoji:"☝️"},
  {en:"head",de:"der Kopf",emoji:"🗣️"},{en:"stomach",de:"der Bauch",emoji:"🫃"},
  {en:"back",de:"der Rücken",emoji:"🔙"},{en:"knee",de:"das Knie",emoji:"🦿"},
  {en:"neck",de:"der Hals",emoji:"💋"},{en:"cheek",de:"die Wange",emoji:"😊"},
  // Family
  {en:"mom",de:"die Mama",emoji:"👩"},{en:"dad",de:"der Papa",emoji:"👨"},
  {en:"baby",de:"das Baby",emoji:"👶"},{en:"sister",de:"die Schwester",emoji:"👧"},
  {en:"brother",de:"der Bruder",emoji:"👦"},{en:"grandma",de:"die Oma",emoji:"👵"},
  {en:"grandpa",de:"der Opa",emoji:"👴"},{en:"aunt",de:"die Tante",emoji:"👩‍👧"},
  {en:"uncle",de:"der Onkel",emoji:"👨‍👦"},{en:"friend",de:"der Freund",emoji:"🤝"},
  {en:"teacher",de:"die Lehrerin",emoji:"👩‍🏫"},{en:"doctor",de:"der Arzt",emoji:"👨‍⚕️"},
  {en:"cook",de:"der Koch",emoji:"👨‍🍳"},{en:"farmer",de:"der Bauer",emoji:"🧑‍🌾"},
  // Nature
  {en:"sun",de:"die Sonne",emoji:"☀️"},{en:"moon",de:"der Mond",emoji:"🌙"},
  {en:"star",de:"der Stern",emoji:"⭐"},{en:"tree",de:"der Baum",emoji:"🌳"},
  {en:"flower",de:"die Blume",emoji:"🌸"},{en:"rain",de:"der Regen",emoji:"🌧️"},
  {en:"snow",de:"der Schnee",emoji:"❄️"},{en:"cloud",de:"die Wolke",emoji:"☁️"},
  {en:"river",de:"der Fluss",emoji:"🏞️"},{en:"mountain",de:"der Berg",emoji:"⛰️"},
  {en:"sea",de:"das Meer",emoji:"🌊"},{en:"fire",de:"das Feuer",emoji:"🔥"},
  {en:"leaf",de:"das Blatt",emoji:"🍃"},{en:"stone",de:"der Stein",emoji:"🪨"},
  {en:"rainbow",de:"der Regenbogen",emoji:"🌈"},{en:"wind",de:"der Wind",emoji:"💨"},
  {en:"lake",de:"der See",emoji:"🏔️"},{en:"forest",de:"der Wald",emoji:"🌲"},
  {en:"grass",de:"das Gras",emoji:"🌿"},{en:"sand",de:"der Sand",emoji:"🏖️"},
  {en:"ice",de:"das Eis",emoji:"🧊"},{en:"lightning",de:"der Blitz",emoji:"⚡"},
  {en:"volcano",de:"der Vulkan",emoji:"🌋"},{en:"island",de:"die Insel",emoji:"🏝️"},
  {en:"cave",de:"die Höhle",emoji:"🕳️"},{en:"desert",de:"die Wüste",emoji:"🏜️"},
  // Colors
  {en:"red",de:"das Rot",emoji:"🔴"},{en:"blue",de:"das Blau",emoji:"🔵"},
  {en:"green",de:"das Grün",emoji:"🟢"},{en:"yellow",de:"das Gelb",emoji:"🟡"},
  {en:"black",de:"das Schwarz",emoji:"⚫"},{en:"white",de:"das Weiß",emoji:"⚪"},
  {en:"orange color",de:"das Orange",emoji:"🟠"},{en:"purple",de:"das Lila",emoji:"🟣"},
  {en:"pink",de:"das Rosa",emoji:"🩷"},{en:"brown",de:"das Braun",emoji:"🟤"},
  {en:"gray",de:"das Grau",emoji:"🩶"},{en:"gold",de:"das Gold",emoji:"🏅"},
  // Objects & Home
  {en:"ball",de:"der Ball",emoji:"⚽"},{en:"book",de:"das Buch",emoji:"📚"},
  {en:"pen",de:"der Stift",emoji:"✏️"},{en:"chair",de:"der Stuhl",emoji:"🪑"},
  {en:"table",de:"der Tisch",emoji:"🪵"},{en:"bed",de:"das Bett",emoji:"🛏️"},
  {en:"door",de:"die Tür",emoji:"🚪"},{en:"window",de:"das Fenster",emoji:"🪟"},
  {en:"bag",de:"die Tasche",emoji:"👜"},{en:"hat",de:"der Hut",emoji:"🎩"},
  {en:"shoe",de:"der Schuh",emoji:"👟"},{en:"clock",de:"die Uhr",emoji:"⏰"},
  {en:"lamp",de:"die Lampe",emoji:"💡"},{en:"cup",de:"die Tasse",emoji:"☕"},
  {en:"key",de:"der Schlüssel",emoji:"🔑"},{en:"house",de:"das Haus",emoji:"🏠"},
  {en:"picture",de:"das Bild",emoji:"🖼️"},{en:"music",de:"die Musik",emoji:"🎵"},
  {en:"toy",de:"das Spielzeug",emoji:"🪆"},{en:"balloon",de:"der Luftballon",emoji:"🎈"},
  {en:"present",de:"das Geschenk",emoji:"🎁"},{en:"candle",de:"die Kerze",emoji:"🕯️"},
  {en:"mirror",de:"der Spiegel",emoji:"🪞"},{en:"scissors",de:"die Schere",emoji:"✂️"},
  {en:"umbrella",de:"der Regenschirm",emoji:"☂️"},{en:"glasses",de:"die Brille",emoji:"👓"},
  {en:"ring",de:"der Ring",emoji:"💍"},{en:"crown",de:"die Krone",emoji:"👑"},
  {en:"flag",de:"die Fahne",emoji:"🚩"},{en:"map",de:"die Karte",emoji:"🗺️"},
  {en:"phone",de:"das Telefon",emoji:"📱"},{en:"brush",de:"die Bürste",emoji:"🪥"},
  {en:"soap",de:"die Seife",emoji:"🧼"},{en:"towel",de:"das Handtuch",emoji:"🧻"},
  {en:"pillow",de:"das Kissen",emoji:"🛋️"},{en:"blanket",de:"die Decke",emoji:"🛏️"},
  {en:"trash can",de:"der Mülleimer",emoji:"🗑️"},{en:"broom",de:"der Besen",emoji:"🧹"},
  // Transport
  {en:"car",de:"das Auto",emoji:"🚗"},{en:"train",de:"der Zug",emoji:"🚂"},
  {en:"airplane",de:"das Flugzeug",emoji:"✈️"},{en:"boat",de:"das Boot",emoji:"⛵"},
  {en:"bicycle",de:"das Fahrrad",emoji:"🚲"},{en:"bus",de:"der Bus",emoji:"🚌"},
  {en:"rocket",de:"die Rakete",emoji:"🚀"},{en:"helicopter",de:"der Hubschrauber",emoji:"🚁"},
  {en:"tractor",de:"der Traktor",emoji:"🚜"},{en:"ambulance",de:"der Krankenwagen",emoji:"🚑"},
  {en:"fire truck",de:"das Feuerwehrauto",emoji:"🚒"},{en:"ship",de:"das Schiff",emoji:"🚢"},
  {en:"skateboard",de:"das Skateboard",emoji:"🛹"},{en:"scooter",de:"der Roller",emoji:"🛴"},
  // School & Office
  {en:"school",de:"die Schule",emoji:"🏫"},{en:"pencil",de:"der Bleistift",emoji:"✏️"},
  {en:"ruler",de:"das Lineal",emoji:"📏"},{en:"backpack",de:"der Rucksack",emoji:"🎒"},
  {en:"notebook",de:"das Heft",emoji:"📓"},{en:"eraser",de:"der Radiergummi",emoji:"🩹"},
  {en:"calendar",de:"der Kalender",emoji:"📅"},{en:"letter",de:"der Brief",emoji:"✉️"},
  {en:"pencil case",de:"das Mäppchen",emoji:"🖊️"},{en:"glue",de:"der Kleber",emoji:"🖇️"},
  // Places
  {en:"park",de:"der Park",emoji:"🌳"},{en:"beach",de:"der Strand",emoji:"🏖️"},
  {en:"hospital",de:"das Krankenhaus",emoji:"🏥"},{en:"supermarket",de:"der Supermarkt",emoji:"🏪"},
  {en:"museum",de:"das Museum",emoji:"🏛️"},{en:"castle",de:"das Schloss",emoji:"🏰"},
  {en:"farm",de:"der Bauernhof",emoji:"🏡"},{en:"city",de:"die Stadt",emoji:"🌆"},
  {en:"airport",de:"der Flughafen",emoji:"🛫"},{en:"library",de:"die Bibliothek",emoji:"📖"},
  {en:"playground",de:"der Spielplatz",emoji:"🛝"},{en:"garden",de:"der Garten",emoji:"🌻"},
  {en:"zoo",de:"der Zoo",emoji:"🦁"},{en:"restaurant",de:"das Restaurant",emoji:"🍽️"},
  // Feelings & Adjectives
  {en:"happy",de:"glücklich",emoji:"😊"},{en:"sad",de:"traurig",emoji:"😢"},
  {en:"angry",de:"wütend",emoji:"😠"},{en:"tired",de:"müde",emoji:"😴"},
  {en:"hungry",de:"hungrig",emoji:"🍽️"},{en:"cold",de:"kalt",emoji:"🥶"},
  {en:"hot",de:"heiß",emoji:"🥵"},{en:"big",de:"groß",emoji:"📐"},
  {en:"small",de:"klein",emoji:"🔬"},{en:"fast",de:"schnell",emoji:"⚡"},
  {en:"slow",de:"langsam",emoji:"🐌"},{en:"loud",de:"laut",emoji:"📢"},
  {en:"quiet",de:"leise",emoji:"🤫"},{en:"funny",de:"lustig",emoji:"😂"},
  {en:"beautiful",de:"schön",emoji:"✨"},{en:"new",de:"neu",emoji:"🆕"},
  {en:"old",de:"alt",emoji:"⏳"},{en:"hard",de:"hart",emoji:"🪨"},
  {en:"soft",de:"weich",emoji:"🧸"},{en:"clean",de:"sauber",emoji:"🫧"},
  {en:"dirty",de:"schmutzig",emoji:"🤢"},
  // Numbers
  {en:"one",de:"eins",emoji:"1️⃣"},{en:"two",de:"zwei",emoji:"2️⃣"},
  {en:"three",de:"drei",emoji:"3️⃣"},{en:"four",de:"vier",emoji:"4️⃣"},
  {en:"five",de:"fünf",emoji:"5️⃣"},{en:"six",de:"sechs",emoji:"6️⃣"},
  {en:"seven",de:"sieben",emoji:"7️⃣"},{en:"eight",de:"acht",emoji:"8️⃣"},
  {en:"nine",de:"neun",emoji:"9️⃣"},{en:"ten",de:"zehn",emoji:"🔟"},
  // Days & Time
  {en:"Monday",de:"der Montag",emoji:"📅"},{en:"Tuesday",de:"der Dienstag",emoji:"📅"},
  {en:"Wednesday",de:"der Mittwoch",emoji:"📅"},{en:"Thursday",de:"der Donnerstag",emoji:"📅"},
  {en:"Friday",de:"der Freitag",emoji:"📅"},{en:"Saturday",de:"der Samstag",emoji:"📅"},
  {en:"Sunday",de:"der Sonntag",emoji:"📅"},{en:"morning",de:"der Morgen",emoji:"🌅"},
  {en:"evening",de:"der Abend",emoji:"🌇"},{en:"night",de:"die Nacht",emoji:"🌙"},
  {en:"today",de:"heute",emoji:"📆"},{en:"tomorrow",de:"morgen",emoji:"➡️"},
  {en:"yesterday",de:"gestern",emoji:"⬅️"},{en:"week",de:"die Woche",emoji:"📅"},
  {en:"year",de:"das Jahr",emoji:"🎊"},{en:"birthday",de:"der Geburtstag",emoji:"🎂"},
  // Sports & Hobbies
  {en:"soccer",de:"der Fußball",emoji:"⚽"},{en:"swimming",de:"das Schwimmen",emoji:"🏊"},
  {en:"running",de:"das Laufen",emoji:"🏃"},{en:"dancing",de:"das Tanzen",emoji:"💃"},
  {en:"singing",de:"das Singen",emoji:"🎤"},{en:"painting",de:"das Malen",emoji:"🎨"},
  {en:"reading",de:"das Lesen",emoji:"📖"},{en:"cooking",de:"das Kochen",emoji:"👨‍🍳"},
  {en:"game",de:"das Spiel",emoji:"🎮"},{en:"drum",de:"die Trommel",emoji:"🥁"},
  {en:"guitar",de:"die Gitarre",emoji:"🎸"},{en:"piano",de:"das Klavier",emoji:"🎹"},  // Months
  {en:"January",de:"der Januar",emoji:"❄️"},{en:"February",de:"der Februar",emoji:"💝"},
  {en:"March",de:"der März",emoji:"🌱"},{en:"April",de:"der April",emoji:"🌧️"},
  {en:"May",de:"der Mai",emoji:"🌸"},{en:"June",de:"der Juni",emoji:"☀️"},
  {en:"July",de:"der Juli",emoji:"🏖️"},{en:"August",de:"der August",emoji:"🌻"},
  {en:"September",de:"der September",emoji:"🍂"},{en:"October",de:"der Oktober",emoji:"🎃"},
  {en:"November",de:"der November",emoji:"🍁"},{en:"December",de:"der Dezember",emoji:"🎄"},
  // More Time
  {en:"hour",de:"die Stunde",emoji:"⏰"},{en:"minute",de:"die Minute",emoji:"⏱️"},
  {en:"second",de:"die Sekunde",emoji:"⚡"},{en:"noon",de:"der Mittag",emoji:"🌞"},
  {en:"midnight",de:"die Mitternacht",emoji:"🌚"},{en:"weekend",de:"das Wochenende",emoji:"🎉"},
  {en:"holiday",de:"der Feiertag",emoji:"🎊"},{en:"spring",de:"der Frühling",emoji:"🌸"},
  {en:"summer",de:"der Sommer",emoji:"☀️"},{en:"autumn",de:"der Herbst",emoji:"🍂"},
  {en:"winter",de:"der Winter",emoji:"❄️"},
  // More Food
  {en:"garlic",de:"der Knoblauch",emoji:"🧄"},{en:"pepper",de:"der Pfeffer",emoji:"🌶️"},
  {en:"pea",de:"die Erbse",emoji:"🫛"},{en:"spinach",de:"der Spinat",emoji:"🥬"},
  {en:"cucumber",de:"die Gurke",emoji:"🥒"},{en:"onion",de:"die Zwiebel",emoji:"🧅"},
  {en:"pumpkin",de:"der Kürbis",emoji:"🎃"},{en:"grape",de:"die Weintraube",emoji:"🍇"},
  {en:"plum",de:"die Pflaume",emoji:"🫐"},{en:"coconut",de:"die Kokosnuss",emoji:"🥥"},
  {en:"mango",de:"die Mango",emoji:"🥭"},{en:"kiwi",de:"die Kiwi",emoji:"🥝"},
  {en:"avocado",de:"die Avocado",emoji:"🥑"},{en:"blueberry",de:"die Blaubeere",emoji:"🫐"},
  {en:"raspberry",de:"die Himbeere",emoji:"🍓"},{en:"jam",de:"die Marmelade",emoji:"🫙"},
  {en:"vinegar",de:"der Essig",emoji:"🍶"},{en:"oil",de:"das Öl",emoji:"🫒"},
  {en:"flour",de:"das Mehl",emoji:"🌾"},{en:"cream",de:"die Sahne",emoji:"🥛"},
  {en:"noodle",de:"die Nudel",emoji:"🍝"},{en:"roll",de:"das Brötchen",emoji:"🥐"},
  {en:"pretzel",de:"die Brezel",emoji:"🥨"},{en:"sushi",de:"das Sushi",emoji:"🍱"},
  {en:"sandwich",de:"das Sandwich",emoji:"🥪"},{en:"hamburger",de:"der Hamburger",emoji:"🍔"},
  {en:"fries",de:"die Pommes",emoji:"🍟"},{en:"donut",de:"der Donut",emoji:"🍩"},
  {en:"lollipop",de:"der Lutscher",emoji:"🍭"},{en:"candy",de:"das Bonbon",emoji:"🍬"},
  // More Animals
  {en:"hamster",de:"der Hamster",emoji:"🐹"},{en:"lizard",de:"die Eidechse",emoji:"🦎"},
  {en:"flamingo",de:"der Flamingo",emoji:"🦩"},{en:"peacock",de:"der Pfau",emoji:"🦚"},
  {en:"swan",de:"der Schwan",emoji:"🦢"},{en:"crow",de:"die Krähe",emoji:"🐦‍⬛"},
  {en:"eagle",de:"der Adler",emoji:"🦅"},{en:"seagull",de:"die Möwe",emoji:"🐦"},
  {en:"lobster",de:"der Hummer",emoji:"🦞"},{en:"octopus",de:"der Oktopus",emoji:"🐙"},
  {en:"jellyfish",de:"die Qualle",emoji:"🪼"},{en:"starfish",de:"der Seestern",emoji:"⭐"},
  {en:"squirrel",de:"das Eichhörnchen",emoji:"🐿️"},{en:"hedgehog",de:"der Igel",emoji:"🦔"},
  {en:"bat",de:"die Fledermaus",emoji:"🦇"},{en:"camel",de:"das Kamel",emoji:"🐪"},
  {en:"kangaroo",de:"das Känguru",emoji:"🦘"},{en:"koala",de:"der Koala",emoji:"🐨"},
  {en:"panda",de:"der Panda",emoji:"🐼"},{en:"gorilla",de:"der Gorilla",emoji:"🦍"},
  {en:"hippo",de:"das Nilpferd",emoji:"🦛"},{en:"rhino",de:"das Nashorn",emoji:"🦏"},
  {en:"cheetah",de:"der Gepard",emoji:"🐆"},{en:"leopard",de:"der Leopard",emoji:"🐆"},
  // Body (more)
  {en:"forehead",de:"die Stirn",emoji:"🗣️"},{en:"cheek",de:"die Wange",emoji:"😊"},
  {en:"chin",de:"das Kinn",emoji:"🗣️"},{en:"thumb",de:"der Daumen",emoji:"👍"},
  {en:"elbow",de:"der Ellbogen",emoji:"💪"},{en:"wrist",de:"das Handgelenk",emoji:"⌚"},
  {en:"ankle",de:"der Knöchel",emoji:"🦶"},{en:"stomach",de:"der Magen",emoji:"🫃"},
  {en:"lung",de:"die Lunge",emoji:"🫁"},{en:"brain",de:"das Gehirn",emoji:"🧠"},
  // Professions
  {en:"doctor",de:"der Arzt",emoji:"👨‍⚕️"},{en:"teacher",de:"der Lehrer",emoji:"👩‍🏫"},
  {en:"cook",de:"der Koch",emoji:"👨‍🍳"},{en:"firefighter",de:"der Feuerwehrmann",emoji:"👨‍🚒"},
  {en:"police",de:"der Polizist",emoji:"👮"},{en:"pilot",de:"der Pilot",emoji:"👨‍✈️"},
  {en:"farmer",de:"der Bauer",emoji:"👨‍🌾"},{en:"painter",de:"der Maler",emoji:"👨‍🎨"},
  {en:"singer",de:"der Sänger",emoji:"🎤"},{en:"scientist",de:"der Wissenschaftler",emoji:"👨‍🔬"},
  {en:"astronaut",de:"der Astronaut",emoji:"👨‍🚀"},{en:"soldier",de:"der Soldat",emoji:"💂"},
  {en:"judge",de:"der Richter",emoji:"⚖️"},{en:"nurse",de:"die Krankenschwester",emoji:"👩‍⚕️"},
  // Nature (more)
  {en:"volcano",de:"der Vulkan",emoji:"🌋"},{en:"cave",de:"die Höhle",emoji:"🕳️"},
  {en:"waterfall",de:"der Wasserfall",emoji:"💦"},{en:"desert",de:"die Wüste",emoji:"🏜️"},
  {en:"jungle",de:"der Dschungel",emoji:"🌴"},{en:"swamp",de:"der Sumpf",emoji:"🌿"},
  {en:"cliff",de:"die Klippe",emoji:"🪨"},{en:"valley",de:"das Tal",emoji:"🏞️"},
  {en:"field",de:"das Feld",emoji:"🌾"},{en:"coast",de:"die Küste",emoji:"🏖️"},
  {en:"horizon",de:"der Horizont",emoji:"🌅"},{en:"wave",de:"die Welle",emoji:"🌊"},
  {en:"fog",de:"der Nebel",emoji:"🌫️"},{en:"frost",de:"der Frost",emoji:"🥶"},
  {en:"storm",de:"der Sturm",emoji:"⛈️"},{en:"hail",de:"der Hagel",emoji:"🧊"},
  {en:"mud",de:"der Schlamm",emoji:"💧"},{en:"dust",de:"der Staub",emoji:"💨"},
  {en:"seed",de:"der Same",emoji:"🌱"},{en:"root",de:"die Wurzel",emoji:"🌿"},
  {en:"branch",de:"der Ast",emoji:"🌿"},{en:"bush",de:"der Busch",emoji:"🌳"},
  // Space
  {en:"planet",de:"der Planet",emoji:"🪐"},{en:"rocket",de:"die Rakete",emoji:"🚀"},
  {en:"astronaut",de:"der Astronaut",emoji:"👨‍🚀"},{en:"comet",de:"der Komet",emoji:"☄️"},
  {en:"galaxy",de:"die Galaxie",emoji:"🌌"},{en:"telescope",de:"das Teleskop",emoji:"🔭"},
  {en:"satellite",de:"der Satellit",emoji:"🛰️"},{en:"meteor",de:"der Meteor",emoji:"☄️"},
  // Sports & Activities (more)
  {en:"basketball",de:"der Basketball",emoji:"🏀"},{en:"tennis",de:"das Tennis",emoji:"🎾"},
  {en:"volleyball",de:"der Volleyball",emoji:"🏐"},{en:"skiing",de:"das Skifahren",emoji:"⛷️"},
  {en:"surfing",de:"das Surfen",emoji:"🏄"},{en:"hiking",de:"das Wandern",emoji:"🥾"},
  {en:"fishing",de:"das Angeln",emoji:"🎣"},{en:"yoga",de:"das Yoga",emoji:"🧘"},
  {en:"boxing",de:"das Boxen",emoji:"🥊"},{en:"cycling",de:"das Radfahren",emoji:"🚴"},
  {en:"gymnastics",de:"das Turnen",emoji:"🤸"},{en:"archery",de:"das Bogenschießen",emoji:"🏹"},
  // Instruments
  {en:"violin",de:"die Geige",emoji:"🎻"},{en:"flute",de:"die Flöte",emoji:"🪈"},
  {en:"trumpet",de:"die Trompete",emoji:"🎺"},{en:"harp",de:"die Harfe",emoji:"🎸"},
  {en:"accordion",de:"das Akkordeon",emoji:"🪗"},{en:"xylophone",de:"das Xylophon",emoji:"🎵"},
  // Emotions & Adjectives (more)
  {en:"excited",de:"aufgeregt",emoji:"🤩"},{en:"scared",de:"ängstlich",emoji:"😨"},
  {en:"surprised",de:"überrascht",emoji:"😲"},{en:"proud",de:"stolz",emoji:"🏆"},
  {en:"bored",de:"gelangweilt",emoji:"😑"},{en:"brave",de:"mutig",emoji:"🦁"},
  {en:"shy",de:"schüchtern",emoji:"🫣"},{en:"kind",de:"nett",emoji:"🤗"},
  {en:"clever",de:"klug",emoji:"🧠"},{en:"strong",de:"stark",emoji:"💪"},
  {en:"weak",de:"schwach",emoji:"🪶"},{en:"tall",de:"groß",emoji:"📏"},
  {en:"short",de:"kurz",emoji:"📏"},{en:"heavy",de:"schwer",emoji:"⚖️"},
  {en:"light",de:"leicht",emoji:"🪶"},{en:"round",de:"rund",emoji:"⭕"},
  {en:"sharp",de:"scharf",emoji:"🔪"},{en:"sweet",de:"süß",emoji:"🍬"},
  {en:"sour",de:"sauer",emoji:"🍋"},{en:"bitter",de:"bitter",emoji:"☕"},
  {en:"salty",de:"salzig",emoji:"🧂"},{en:"spicy",de:"scharf",emoji:"🌶️"},
  // Household
  {en:"sofa",de:"das Sofa",emoji:"🛋️"},{en:"fridge",de:"der Kühlschrank",emoji:"🧊"},
  {en:"oven",de:"der Ofen",emoji:"🔥"},{en:"sink",de:"das Waschbecken",emoji:"🚿"},
  {en:"shower",de:"die Dusche",emoji:"🚿"},{en:"bathtub",de:"die Badewanne",emoji:"🛁"},
  {en:"staircase",de:"die Treppe",emoji:"🪜"},{en:"roof",de:"das Dach",emoji:"🏠"},
  {en:"wall",de:"die Wand",emoji:"🧱"},{en:"floor",de:"der Boden",emoji:"⬛"},
  {en:"ceiling",de:"die Decke",emoji:"⬜"},{en:"curtain",de:"der Vorhang",emoji:"🪟"},
  {en:"carpet",de:"der Teppich",emoji:"🟫"},{en:"shelf",de:"das Regal",emoji:"📚"},
  {en:"drawer",de:"die Schublade",emoji:"🗄️"},{en:"wardrobe",de:"der Kleiderschrank",emoji:"👗"},
  {en:"trash",de:"der Müll",emoji:"🗑️"},{en:"fence",de:"der Zaun",emoji:"🌿"},
  {en:"gate",de:"das Tor",emoji:"🚪"},{en:"garage",de:"die Garage",emoji:"🚗"},
  // Technology
  {en:"internet",de:"das Internet",emoji:"🌐"},{en:"website",de:"die Webseite",emoji:"💻"},
  {en:"video",de:"das Video",emoji:"📹"},{en:"photo",de:"das Foto",emoji:"📸"},
  {en:"battery",de:"die Batterie",emoji:"🔋"},{en:"cable",de:"das Kabel",emoji:"🔌"},
  {en:"screen",de:"der Bildschirm",emoji:"🖥️"},{en:"keyboard",de:"die Tastatur",emoji:"⌨️"},
  {en:"mouse",de:"die Maus",emoji:"🖱️"},{en:"printer",de:"der Drucker",emoji:"🖨️"},
  // Clothing (more)
  {en:"belt",de:"der Gürtel",emoji:"👔"},{en:"tie",de:"die Krawatte",emoji:"👔"},
  {en:"swimsuit",de:"der Badeanzug",emoji:"👙"},{en:"pajamas",de:"der Schlafanzug",emoji:"😴"},
  {en:"coat",de:"der Mantel",emoji:"🧥"},{en:"skirt",de:"der Rock",emoji:"👗"},
  {en:"blouse",de:"die Bluse",emoji:"👚"},{en:"vest",de:"die Weste",emoji:"🧥"},
  {en:"apron",de:"die Schürze",emoji:"👨‍🍳"},{en:"cap",de:"die Mütze",emoji:"🧢"},
  // Tools & Materials
  {en:"nail",de:"der Nagel",emoji:"🔨"},{en:"screw",de:"die Schraube",emoji:"🔩"},
  {en:"saw",de:"die Säge",emoji:"🪚"},{en:"drill",de:"der Bohrer",emoji:"🔧"},
  {en:"ladder",de:"die Leiter",emoji:"🪜"},{en:"bucket",de:"der Eimer",emoji:"🪣"},
  {en:"magnet",de:"der Magnet",emoji:"🧲"},{en:"wheel",de:"das Rad",emoji:"⚙️"},
  {en:"engine",de:"der Motor",emoji:"⚙️"},{en:"chain",de:"die Kette",emoji:"⛓️"},
  // Abstract / Concepts
  {en:"language",de:"die Sprache",emoji:"🗣️"},{en:"word",de:"das Wort",emoji:"📝"},
  {en:"story",de:"die Geschichte",emoji:"📖"},{en:"idea",de:"die Idee",emoji:"💡"},
  {en:"question",de:"die Frage",emoji:"❓"},{en:"answer",de:"die Antwort",emoji:"✅"},
  {en:"problem",de:"das Problem",emoji:"⚠️"},{en:"rule",de:"die Regel",emoji:"📋"},
  {en:"prize",de:"der Preis",emoji:"🏆"},{en:"mistake",de:"der Fehler",emoji:"❌"},
  {en:"secret",de:"das Geheimnis",emoji:"🤫"},{en:"magic",de:"die Magie",emoji:"✨"},
  {en:"wish",de:"der Wunsch",emoji:"🌠"},{en:"hope",de:"die Hoffnung",emoji:"🌈"},
  {en:"fear",de:"die Angst",emoji:"😨"},{en:"fun",de:"der Spaß",emoji:"🎉"},
  {en:"truth",de:"die Wahrheit",emoji:"✔️"},{en:"freedom",de:"die Freiheit",emoji:"🕊️"},
];

// ── Curated word pool for Simple Mode (clear, iconic emoji only) ──
const simpleWords = [
  // Animals — universally recognisable
  {en:"dog",de:"der Hund",emoji:"🐶"},{en:"cat",de:"die Katze",emoji:"🐱"},
  {en:"bird",de:"der Vogel",emoji:"🐦"},{en:"fish",de:"der Fisch",emoji:"🐟"},
  {en:"rabbit",de:"das Kaninchen",emoji:"🐰"},{en:"horse",de:"das Pferd",emoji:"🐴"},
  {en:"cow",de:"die Kuh",emoji:"🐄"},{en:"pig",de:"das Schwein",emoji:"🐷"},
  {en:"duck",de:"die Ente",emoji:"🦆"},{en:"elephant",de:"der Elefant",emoji:"🐘"},
  {en:"lion",de:"der Löwe",emoji:"🦁"},{en:"tiger",de:"der Tiger",emoji:"🐯"},
  {en:"bear",de:"der Bär",emoji:"🐻"},{en:"mouse",de:"die Maus",emoji:"🐭"},
  {en:"frog",de:"der Frosch",emoji:"🐸"},{en:"monkey",de:"der Affe",emoji:"🐒"},
  {en:"penguin",de:"der Pinguin",emoji:"🐧"},{en:"sheep",de:"das Schaf",emoji:"🐑"},
  {en:"chicken",de:"das Huhn",emoji:"🐔"},{en:"fox",de:"der Fuchs",emoji:"🦊"},
  {en:"owl",de:"die Eule",emoji:"🦉"},{en:"dolphin",de:"der Delfin",emoji:"🐬"},
  {en:"shark",de:"der Hai",emoji:"🦈"},{en:"giraffe",de:"die Giraffe",emoji:"🦒"},
  {en:"zebra",de:"das Zebra",emoji:"🦓"},{en:"crocodile",de:"das Krokodil",emoji:"🐊"},
  {en:"octopus",de:"der Oktopus",emoji:"🐙"},{en:"crab",de:"die Krabbe",emoji:"🦀"},
  {en:"butterfly",de:"der Schmetterling",emoji:"🦋"},{en:"snail",de:"die Schnecke",emoji:"🐌"},
  {en:"bee",de:"die Biene",emoji:"🐝"},{en:"turtle",de:"die Schildkröte",emoji:"🐢"},
  {en:"snake",de:"die Schlange",emoji:"🐍"},{en:"whale",de:"der Wal",emoji:"🐳"},
  {en:"parrot",de:"der Papagei",emoji:"🦜"},{en:"flamingo",de:"der Flamingo",emoji:"🦩"},
  {en:"camel",de:"das Kamel",emoji:"🐪"},
  // Food — instantly recognisable
  {en:"apple",de:"der Apfel",emoji:"🍎"},{en:"banana",de:"die Banane",emoji:"🍌"},
  {en:"pizza",de:"die Pizza",emoji:"🍕"},{en:"cake",de:"der Kuchen",emoji:"🎂"},
  {en:"ice cream",de:"das Eis",emoji:"🍦"},{en:"strawberry",de:"die Erdbeere",emoji:"🍓"},
  {en:"orange",de:"die Orange",emoji:"🍊"},{en:"grapes",de:"die Traube",emoji:"🍇"},
  {en:"watermelon",de:"die Wassermelone",emoji:"🍉"},{en:"pear",de:"die Birne",emoji:"🍐"},
  {en:"cherry",de:"die Kirsche",emoji:"🍒"},{en:"lemon",de:"die Zitrone",emoji:"🍋"},
  {en:"pineapple",de:"die Ananas",emoji:"🍍"},{en:"corn",de:"der Mais",emoji:"🌽"},
  {en:"mushroom",de:"der Pilz",emoji:"🍄"},{en:"carrot",de:"die Karotte",emoji:"🥕"},
  {en:"broccoli",de:"der Brokkoli",emoji:"🥦"},{en:"tomato",de:"die Tomate",emoji:"🍅"},
  {en:"cookie",de:"der Keks",emoji:"🍪"},{en:"chocolate",de:"die Schokolade",emoji:"🍫"},
  {en:"bread",de:"das Brot",emoji:"🍞"},{en:"egg",de:"das Ei",emoji:"🥚"},
  {en:"cheese",de:"der Käse",emoji:"🧀"},{en:"pretzel",de:"die Brezel",emoji:"🥨"},
  {en:"peach",de:"der Pfirsich",emoji:"🍑"},{en:"mango",de:"die Mango",emoji:"🥭"},
  {en:"avocado",de:"die Avocado",emoji:"🥑"},
  // Vehicles & Transport
  {en:"car",de:"das Auto",emoji:"🚗"},{en:"bus",de:"der Bus",emoji:"🚌"},
  {en:"train",de:"der Zug",emoji:"🚂"},{en:"airplane",de:"das Flugzeug",emoji:"✈️"},
  {en:"bicycle",de:"das Fahrrad",emoji:"🚲"},{en:"rocket",de:"die Rakete",emoji:"🚀"},
  {en:"boat",de:"das Boot",emoji:"⛵"},{en:"helicopter",de:"der Hubschrauber",emoji:"🚁"},
  {en:"ambulance",de:"der Krankenwagen",emoji:"🚑"},{en:"tractor",de:"der Traktor",emoji:"🚜"},
  // Nature / Weather
  {en:"sun",de:"die Sonne",emoji:"☀️"},{en:"moon",de:"der Mond",emoji:"🌙"},
  {en:"star",de:"der Stern",emoji:"⭐"},{en:"tree",de:"der Baum",emoji:"🌳"},
  {en:"flower",de:"die Blume",emoji:"🌸"},{en:"rainbow",de:"der Regenbogen",emoji:"🌈"},
  {en:"cloud",de:"die Wolke",emoji:"☁️"},{en:"snow",de:"der Schnee",emoji:"❄️"},
  {en:"fire",de:"das Feuer",emoji:"🔥"},{en:"lightning",de:"der Blitz",emoji:"⚡"},
  {en:"volcano",de:"der Vulkan",emoji:"🌋"},
  // Objects — very clear icons
  {en:"house",de:"das Haus",emoji:"🏠"},{en:"book",de:"das Buch",emoji:"📚"},
  {en:"ball",de:"der Ball",emoji:"⚽"},{en:"balloon",de:"der Luftballon",emoji:"🎈"},
  {en:"present",de:"das Geschenk",emoji:"🎁"},{en:"key",de:"der Schlüssel",emoji:"🔑"},
  {en:"clock",de:"die Uhr",emoji:"⏰"},{en:"umbrella",de:"der Regenschirm",emoji:"☂️"},
  {en:"crown",de:"die Krone",emoji:"👑"},{en:"ring",de:"der Ring",emoji:"💍"},
  {en:"scissors",de:"die Schere",emoji:"✂️"},{en:"candle",de:"die Kerze",emoji:"🕯️"},
  {en:"mirror",de:"der Spiegel",emoji:"🪞"},{en:"lamp",de:"die Lampe",emoji:"💡"},
  {en:"glasses",de:"die Brille",emoji:"👓"},{en:"hat",de:"der Hut",emoji:"🎩"},
  {en:"shoe",de:"der Schuh",emoji:"👟"},{en:"phone",de:"das Telefon",emoji:"📱"},
  {en:"camera",de:"die Kamera",emoji:"📷"},
];

// ── State ─────────────────────────────────────────────────────────────────────
const ROUNDS = 10;
let endlessMode    = false;
let gameMode       = 'normal';   // 'normal' | 'reverse'
let displayMode    = 'emoji';    // 'emoji' | 'none' | 'listen'
let sameLetterMode = false;

let score = 0, currentQ = 0, correctIdx = 0;
let usedWords = [], answered = false, currentWord = null;
let isSpeaking = false, tapCount = 0;

// ── High score — localStorage ─────────────────────────────────────────────────
const LS_PREFIX = 'deutschGame_best_';
function lsKey() { return LS_PREFIX + gameMode + '_' + (endlessMode ? 'endless' : '10'); }
function loadBest() { try { return parseInt(localStorage.getItem(lsKey()) || '0', 10); } catch { return 0; } }
function saveBest(v) { try { localStorage.setItem(lsKey(), String(v)); } catch { /* ignore localStorage errors */ } }
let best = 0;

function refreshBest() {
  best = loadBest();
  const pill = document.getElementById('bestPill');
  if (pill) pill.innerHTML = `🏆 Best${endlessMode?' streak':''}: <span id="best">${best}</span>`;
}

// ── Confirm popup ─────────────────────────────────────────────────────────────
function needsConfirm() { return score > 0; }

function requestMode(mode) {
  if (mode === gameMode) return;
  maybeConfirm(`Switch to "${mode==='normal'?'Find German':'Find English'}" mode? Your score will be lost.`,
    () => { gameMode = mode; updateToggles(); startGame(); });
}
function requestDisplay(disp) {
  if (disp === displayMode) return;
  maybeConfirm('Change display mode? Your score will be lost.',
    () => { displayMode = disp; updateToggles(); startGame(); });
}
function requestToggle(which) {
  if (which === 'sameLetter') {
    maybeConfirm('Change letter mode? Your score will be lost.',
      () => { sameLetterMode = !sameLetterMode; updateToggles(); startGame(); });
  } else {
    maybeConfirm('Switch round mode? Your score will be lost.',
      () => { endlessMode = !endlessMode; updateToggles(); startGame(); });
  }
}
function maybeConfirm(msg, onYes) {
  if (needsConfirm()) { showConfirm(msg, onYes); } else { onYes(); }
}
function showConfirm(msg, onYes) {
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmYes').onclick = () => { closeConfirm(); onYes(); };
  document.getElementById('confirmOverlay').classList.add('show');
}
function closeConfirm() { document.getElementById('confirmOverlay').classList.remove('show'); }

function openSettings() { document.getElementById('settingsOverlay').classList.add('show'); }
function closeSettings() { document.getElementById('settingsOverlay').classList.remove('show'); }
function closeSettingsIfBg(e) { if(e.target===document.getElementById('settingsOverlay')) closeSettings(); }

function updateToggles() {
  document.getElementById('btnModeNormal').classList.toggle('active', gameMode === 'normal');
  document.getElementById('btnModeReverse').classList.toggle('active', gameMode === 'reverse');
  document.getElementById('btnShowEmoji').classList.toggle('active', displayMode === 'emoji');
  document.getElementById('btnShowNone').classList.toggle('active', displayMode === 'none');
  document.getElementById('btnShowListen').classList.toggle('active', displayMode === 'listen');
  document.getElementById('btnSameLetter').classList.toggle('active', sameLetterMode);
  const rb = document.getElementById('btnRounds');
  rb.textContent = endlessMode ? '♾️ Endless' : '🔟 10 Rounds';
  rb.classList.toggle('active', endlessMode);
  refreshBest();
}

// ── Audio ─────────────────────────────────────────────────────────────────────
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playSuccess() {
  try {
    const ctx = getAudioCtx();
    [[523,0],[659,.12],[784,.24],[1047,.38]].forEach(([f,w]) => {
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type='sine';
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      g.gain.setValueAtTime(.35,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.3);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.35);
    });
  } catch { /* ignore audio errors */ }
}
function playFail() {
  try {
    const ctx = getAudioCtx();
    [[220,0,'sawtooth'],[180,.2,'sawtooth']].forEach(([f,w,t]) => {
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);o.type=t;
      o.frequency.setValueAtTime(f,ctx.currentTime+w);
      o.frequency.exponentialRampToValueAtTime(f*.7,ctx.currentTime+w+.25);
      g.gain.setValueAtTime(.25,ctx.currentTime+w);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+w+.28);
      o.start(ctx.currentTime+w);o.stop(ctx.currentTime+w+.3);
    });
  } catch { /* ignore audio errors */ }
}

// ── TTS ───────────────────────────────────────────────────────────────────────
function speakWord(text, rate) {
  if (!window.speechSynthesis) return;
  isSpeaking = true;
  speechSynthesis.cancel();
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang='de-DE'; u.rate=rate; u.pitch=1.0; u.volume=1.0;
    const vs=speechSynthesis.getVoices();
    const dv=vs.find(v=>v.lang==='de-DE'&&v.localService)||vs.find(v=>v.lang.startsWith('de-'))||vs.find(v=>v.lang.startsWith('de'))||null;
    if(dv) u.voice=dv;
    u.onend=()=>{ isSpeaking=false; setRing(false); };
    u.onerror=()=>{ isSpeaking=false; setRing(false); };
    speechSynthesis.speak(u);
    setTimeout(()=>{ isSpeaking=false; setRing(false); },8000);
  },150);
}
function setRing(on) {
  const w=document.getElementById('emojiWrap');
  if(w) w.classList.toggle('active',on);
}
function speakHint() {
  if (!currentWord||isSpeaking) return;
  tapCount++;
  const slow=tapCount>=3, rate=slow?.4:.82;
  const hl=document.getElementById('hintLabel');
  if(hl&&slow){ hl.textContent='🐢 Super slow mode!'; hl.style.color='#A78BFA'; }
  setRing(true);
  const el=document.getElementById('listenBtn')||document.getElementById('wordEmoji');
  if(el){ el.classList.add('speaking'); setTimeout(()=>el.classList.remove('speaking'),slow?1400:650); }
  speakWord(currentWord.de, rate);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

// Render a German word — only wrap with article badge if first word is der/die/das
const ARTICLES = new Set(['der','die','das','ein','eine','einen','einem','einer','des','dem','den']);
function renderDE(deStr) {
  const parts = deStr.trim().split(/\s+/);
  if (parts.length > 1 && ARTICLES.has(parts[0].toLowerCase())) {
    return `<span class="article-badge">${parts[0]}</span>${parts.slice(1).join(' ')}`;
  }
  return deStr; // no badge for bare nouns / colour words etc.
}
function wordKey(w) {
  if(gameMode==='reverse') return (w.en[0]||'').toLowerCase();
  // Always skip the article (der/die/das) — match on first letter of the noun
  const parts = w.de.trim().split(/\s+/);
  const articles = ['der','die','das','ein','eine'];
  const noun = articles.includes((parts[0]||'').toLowerCase()) ? parts.slice(1).join(' ') : parts.join(' ');
  return (noun[0]||'').toLowerCase();
}
function pickDistractors(word, pool) {
  pool = pool || words;
  if(!sameLetterMode) return shuffle(pool.filter(w=>w.de!==word.de)).slice(0,2);
  const key=wordKey(word);
  const same=pool.filter(w=>w.de!==word.de&&wordKey(w)===key);
  if(same.length>=2) return shuffle(same).slice(0,2);
  const extras=shuffle(pool.filter(w=>w.de!==word.de&&!same.includes(w)));
  return shuffle([...same,...extras]).slice(0,2);
}

// ── Game ──────────────────────────────────────────────────────────────────────
function startGame() {
  score=0; currentQ=0;
  usedWords=shuffle(displayMode==='simple' ? simpleWords : words);
  document.getElementById('score').textContent=0;
  document.getElementById('endScreen').classList.remove('show');
  document.getElementById('questionCard').style.display='';
  refreshBest();
  setupStars();
  loadQuestion();
}

function setupStars() {
  const bar=document.getElementById('starsBar');
  bar.innerHTML='';
  if(endlessMode){bar.style.display='none';return;}
  bar.style.display='';
  for(let i=0;i<ROUNDS;i++){
    const s=document.createElement('span');
    s.className='star';s.textContent='⭐';s.id='star'+i;
    bar.appendChild(s);
  }
}

function loadQuestion() {
  answered=false; tapCount=0;
  if(currentQ>=usedWords.length){usedWords=shuffle(words);currentQ=0;}
  const word=usedWords[currentQ];
  currentWord=word;

  // Use simpleWords pool in simple mode for clearer emoji
  const pool = displayMode==='simple' ? simpleWords : words;
  const wrongs=pickDistractors(word, pool);
  const options=shuffle([word,...wrongs]);
  correctIdx=options.findIndex(o=>o.de===word.de);

  document.getElementById('progressText').textContent=endlessMode
    ?`Question ${currentQ+1} — Keep going! 🔥`:`Question ${currentQ+1} of ${ROUNDS}`;
  document.getElementById('progressBar').style.width=endlessMode
    ?'100%':((currentQ/ROUNDS)*100)+'%';

  // ── Feedback / next reset ──
  document.getElementById('feedback').className='feedback';
  document.getElementById('feedback').textContent='';
  const nb=document.getElementById('nextBtn');
  nb.classList.remove('show'); nb.textContent='Weiter! ➡️'; nb.dataset.action='next';

  // ── SIMPLE MODE ──
  if(displayMode==='simple'){
    // Top area: big speaker button — auto-plays German word
    const area=document.getElementById('emojiArea');
    area.innerHTML=`
      <div class="emoji-wrap" id="emojiWrap"><div class="ring"></div>
        <div class="simple-speaker" id="simpleSpeaker" title="Tap to hear again">🔊</div>
      </div>
      <div class="hint-label" id="hintLabel">🐢 Tap 🔊 again to replay!</div>`;
    const sp = document.getElementById('simpleSpeaker'); if(sp) sp.addEventListener('click', speakHint);
    setTimeout(()=>speakHint(),400);

    // Hide question text
    document.getElementById('questionLabel').textContent='';
    document.getElementById('englishWord').textContent='';
    document.getElementById('hintText').textContent='Tap the right picture!';

    // Replace the normal .answers div with emoji grid
    buildSimpleButtons(options, correctIdx);
    return;
  }

  // Restore normal answer buttons if switching from simple
  restoreNormalButtons();

  // ── Build display area (non-simple modes) ──
  const area=document.getElementById('emojiArea');
  area.innerHTML='';
  // Simple mode speaker wiggle
  const simpleSpeaker = document.getElementById('simpleSpeaker');
  if(simpleSpeaker){ simpleSpeaker.classList.add('speaking'); setTimeout(()=>simpleSpeaker.classList.remove('speaking'), 650); }

  if(displayMode==='emoji'){
    area.innerHTML=`
      <div class="emoji-wrap" id="emojiWrap"><div class="ring"></div>
        <div class="emoji-display" id="wordEmoji">${word.emoji}</div></div>
      <div class="hint-label" id="hintLabel">🔊 Tap to hear it in German!</div>`;
    const we = document.getElementById('wordEmoji'); if(we) we.addEventListener('click', speakHint);
  } else if(displayMode==='listen'){
    area.innerHTML=`
      <div class="emoji-wrap" id="emojiWrap"><div class="ring"></div>
        <button class="listen-btn" id="listenBtn">🔊</button></div>
      <div class="hint-label" id="hintLabel">Tap 🔊 to hear the German word!</div>`;
    const lb = document.getElementById('listenBtn'); if(lb) lb.addEventListener('click', speakHint);
    setTimeout(()=>speakHint(),400);
  } else {
    area.innerHTML=`
      <div class="emoji-wrap" id="emojiWrap"><div class="ring"></div>
        <div class="emoji-display" id="wordEmoji" style="font-size:1.6rem;opacity:.35">🔊</div></div>
      <div class="hint-label" id="hintLabel">🔊 Tap to hear it in German!</div>`;
    const we2 = document.getElementById('wordEmoji'); if(we2) we2.addEventListener('click', speakHint);
  }

  // ── Question word ──
  const listenOnly=displayMode==='listen';
  if(gameMode==='reverse'){
    document.getElementById('questionLabel').textContent=listenOnly?'':'German word';
    document.getElementById('englishWord').innerHTML=listenOnly?'':renderDE(word.de);
    document.getElementById('hintText').textContent=listenOnly?'Listen — pick the English word!':'Which English word matches?';
  } else {
    document.getElementById('questionLabel').textContent=listenOnly?'':'English word';
    document.getElementById('englishWord').textContent=listenOnly?'':word.en;
    document.getElementById('hintText').textContent=listenOnly?'Listen — pick the German word!':'Which German word is correct?';
  }

  // ── Normal answer buttons ──
  for(let i=0;i<3;i++){
    const btn=document.getElementById('btn'+i);
    btn.className='answer-btn'; btn.disabled=false;
    btn.onclick=()=>checkAnswer(i,correctIdx);
    if(gameMode==='reverse'){
      btn.textContent=options[i].en;
    } else {
      btn.innerHTML=renderDE(options[i].de);
    }
  }
}

// ── Simple mode: update the permanent emoji grid in-place ──
function buildSimpleButtons(options, correctIdx) {
  document.getElementById('answersNormal').style.display = 'none';
  const grid = document.getElementById('answersSimple');
  grid.style.display = 'grid';
  options.forEach((opt, i) => {
    const btn = document.getElementById('sbtn' + i);
    btn.textContent = opt.emoji;
    btn.disabled = false;
    btn.className = 'emoji-answer-btn';
    btn.onclick = () => checkAnswer(i, correctIdx);
  });
  // remap btn0/1/2 to sbtn0/1/2 for checkAnswer compatibility
}

function restoreNormalButtons() {
  document.getElementById('answersSimple').style.display = 'none';
  document.getElementById('answersNormal').style.display = '';
}

const goodMsg=["Super! 🌟","Wunderbar! ✨","Toll! 🎉","Genial! 🚀","Fantastisch! 🌈","Jawohl! 👍"];
const badMsg=["Oops! Try again 😊","Almost! 🤔","Keep going! 💪","You got this! 🌟"];

function checkAnswer(idx,correct) {
  if(answered) return;
  answered=true;
  document.querySelectorAll('.answer-btn,.emoji-answer-btn').forEach(b=>b.disabled=true);
  const fb=document.getElementById('feedback');

  if(idx===correct){
    score++;
    document.getElementById('score').textContent=score;
    if(score>best){ best=score; saveBest(best); document.getElementById('best').textContent=best; }
    (document.getElementById(displayMode==='simple'?'sbtn'+idx:'btn'+idx)).classList.add('correct');
    fb.textContent=goodMsg[Math.floor(Math.random()*goodMsg.length)];
    fb.className='feedback good show';
    if(!endlessMode) document.getElementById('star'+currentQ)?.classList.add('lit');
    playSuccess(); spawnConfetti();
  } else {
    (document.getElementById(displayMode==='simple'?'sbtn'+idx:'btn'+idx)).classList.add('wrong');
    (document.getElementById(displayMode==='simple'?'sbtn'+correct:'btn'+correct)).classList.add('correct');
    playFail();
    if(endlessMode){
      if(score>best){ best=score; saveBest(best); document.getElementById('best').textContent=best; }
      fb.textContent=`Game over! You got ${score} in a row! 💪`;
      fb.className='feedback bad show';
      const nb=document.getElementById('nextBtn');
      nb.textContent='Try Again! 🔄'; nb.dataset.action='start';
    } else {
      fb.textContent=badMsg[Math.floor(Math.random()*badMsg.length)];
      fb.className='feedback bad show';
    }
  }
  document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion() {
  currentQ++;
  if(endlessMode){
    if(currentQ>=usedWords.length){usedWords=shuffle(words);currentQ=0;}
    loadQuestion();
  } else {
    if(currentQ>=ROUNDS) endGame(); else loadQuestion();
  }
}

function endGame() {
  if(score>best){ best=score; saveBest(best); }
  document.getElementById('best').textContent=best;
  document.getElementById('progressBar').style.width='100%';
  setTimeout(()=>{
    document.getElementById('questionCard').style.display='none';
    document.getElementById('endScreen').classList.add('show');
    const msg=score>=9?"🏆 Amazing! You're a German star!":score>=7?"🌟 Great job! Keep learning!":score>=5?"👍 Good work! Practice makes perfect!":"💪 Keep going! You'll get better!";
    document.getElementById('endScore').innerHTML=`You got <strong>${score} out of ${ROUNDS}</strong>!<br>${msg}`;
    if(score>=7) spawnConfetti(40);
  },600);
}

function spawnConfetti(count=15) {
  const c=['#FF6B6B','#FFD700','#4ECDC4','#A78BFA','#FF8DC7','#5DBB63','#FF9F43'];
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const el=document.createElement('div');el.className='confetti-piece';
      el.style.cssText=`left:${Math.random()*100}%;background:${c[Math.floor(Math.random()*c.length)]};animation-duration:${1+Math.random()*2}s;animation-delay:${Math.random()*.5}s;transform:rotate(${Math.random()*360}deg);border-radius:${Math.random()>.5?'50%':'2px'}`;
      document.body.appendChild(el);setTimeout(()=>el.remove(),3000);
    },i*50);
  }
}

  function attachGermanListeners() {
    const byId = id => document.getElementById(id);
    const openBtn = byId('openSettingsBtn'); if(openBtn) openBtn.addEventListener('click', openSettings);
    const ss = byId('btnSameLetter'); if(ss) ss.addEventListener('click', ()=>requestToggle('sameLetter'));
    const rb = byId('btnRounds'); if(rb) rb.addEventListener('click', ()=>requestToggle('endless'));
    const m1 = byId('btnModeNormal'); if(m1) m1.addEventListener('click', ()=>requestMode('normal'));
    const m2 = byId('btnModeReverse'); if(m2) m2.addEventListener('click', ()=>requestMode('reverse'));
    const d1 = byId('btnShowEmoji'); if(d1) d1.addEventListener('click', ()=>requestDisplay('emoji'));
    const d2 = byId('btnShowNone'); if(d2) d2.addEventListener('click', ()=>requestDisplay('none'));
    const d3 = byId('btnShowListen'); if(d3) d3.addEventListener('click', ()=>requestDisplay('listen'));
    const d4 = byId('btnShowSimple'); if(d4) d4.addEventListener('click', ()=>requestDisplay('simple'));
    const settingsClose = byId('settingsClose'); if(settingsClose) settingsClose.addEventListener('click', closeSettings);
    const settingsOverlay = byId('settingsOverlay'); if(settingsOverlay) settingsOverlay.addEventListener('click', closeSettingsIfBg);
    const next = byId('nextBtn'); if(next) next.addEventListener('click', ()=>{ if(next.dataset.action==='start') startGame(); else nextQuestion(); });
    const play = byId('playAgainBtn'); if(play) play.addEventListener('click', startGame);
    const confirmNo = byId('confirmNo'); if(confirmNo) confirmNo.addEventListener('click', closeConfirm);
    const we = byId('wordEmoji'); if(we) we.addEventListener('click', speakHint);
  }

// ── Boot ──────────────────────────────────────────────────────────────────────
 attachGermanListeners();
 updateToggles();
 startGame();