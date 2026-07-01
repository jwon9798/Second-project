#!/usr/bin/env node
/**
 * Generates global-friendly seed quiz packs inspired by Machugi.io categories
 * (flags, animals, food crop, landmarks, geography) — human-sounding copy.
 */
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dir, "../src/data");

const creators = [
  "mika", "geo_nerd", "trevor", "plantmom", "rowan", "zero", "dex",
  "breadcat", "atlas", "luna_p", "sam_k", "hana", "jules", "nightowl",
];

function pickCreator(i) {
  return creators[i % creators.length];
}

function randPlays(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

function isoDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function flagUrl(code) {
  return `https://flagcdn.com/w640/${code}.png`;
}

function qImage(id, url, answers, hint) {
  return { id, type: "image", imageUrl: url, answers, hint };
}

function qCrop(id, url, x, y, size, answers, hint) {
  return { id, type: "crop", imageUrl: url, cropX: x, cropY: y, cropSize: size, answers, hint };
}

// --- FLAGS (Machugi #1 category: 국기 보고 나라 맞히기) ---
const flagSets = [
  {
    id: "flags-europe",
    title: "european flags",
    description: "just flags. europe edition. took longer than expected.",
    category: "Geography",
    coverEmoji: "🇪🇺",
    difficulty: "medium",
    featured: true,
    flags: [
      ["fr", ["france"], "baguette country"],
      ["it", ["italy"], "boot shape on the map"],
      ["es", ["spain", "espana"], "siesta hours"],
      ["pl", ["poland"], "white and red horizontal"],
      ["se", ["sweden"], "nordic cross yellow on blue"],
      ["ch", ["switzerland"], "square flag plus"],
      ["gr", ["greece"], "blue and white stripes"],
      ["no", ["norway"], "nordic cross red on blue"],
    ],
  },
  {
    id: "flags-asia-pacific",
    title: "asia + pacific flags",
    description: "my cousin in singapore helped check these. english answers.",
    category: "Geography",
    coverEmoji: "🏯",
    difficulty: "medium",
    flags: [
      ["th", ["thailand"], "white blue red stripes"],
      ["vn", ["vietnam", "viet nam"], "yellow star red field"],
      ["id", ["indonesia"], "red over white"],
      ["ph", ["philippines"], "sun and stars"],
      ["sg", ["singapore"], "moon and stars small island"],
      ["my", ["malaysia"], "crescent and stripes"],
      ["nz", ["new zealand"], "southern cross stars"],
      ["pk", ["pakistan"], "crescent moon green"],
    ],
  },
  {
    id: "flags-africa",
    title: "african flags quiz",
    description: "harder than i thought. some of these look similar.",
    category: "Geography",
    coverEmoji: "🦁",
    difficulty: "medium",
    flags: [
      ["eg", ["egypt"], "eagle in the center"],
      ["za", ["south africa"], "y shape colors"],
      ["ng", ["nigeria"], "green white green"],
      ["ke", ["kenya"], "shield and spears"],
      ["ma", ["morocco"], "green star red field"],
      ["et", ["ethiopia"], "green yellow red"],
      ["gh", ["ghana"], "black star"],
      ["tn", ["tunisia"], "crescent and star red"],
    ],
  },
  {
    id: "flags-americas",
    title: "americas flags",
    description: "north and south. not just the US one.",
    category: "Geography",
    coverEmoji: "🌎",
    difficulty: "easy",
    flags: [
      ["ar", ["argentina"], "sun in the middle"],
      ["cl", ["chile"], "star white stripe"],
      ["co", ["colombia"], "yellow blue red"],
      ["pe", ["peru"], "red white red"],
      ["ve", ["venezuela"], "stars arc"],
      ["uy", ["uruguay"], "sun top left"],
      ["cu", ["cuba"], "lone star triangle"],
      ["jm", ["jamaica"], "green yellow x"],
    ],
  },
  {
    id: "flags-tricky-twins",
    title: "flags that look alike",
    description: "these annoy me every time. good luck telling them apart.",
    category: "Geography",
    coverEmoji: "😵",
    difficulty: "hard",
    featured: true,
    flags: [
      ["ro", ["romania"], "blue yellow red vertical"],
      ["td", ["chad"], "same colors different blue shade"],
      ["id", ["indonesia"], "red top white bottom"],
      ["mc", ["monaco"], "same layout tinier country"],
      ["nl", ["netherlands", "holland"], "red white blue horizontal"],
      ["lu", ["luxembourg"], "similar tricolor lighter blue"],
      ["ie", ["ireland"], "green white orange"],
      ["ci", ["ivory coast", "cote d ivoire"], "orange white green flipped"],
    ],
  },
  {
    id: "flags-us-states",
    title: "us state flags",
    description: "american states have surprisingly weird flags. who knew.",
    category: "Geography",
    coverEmoji: "🇺🇸",
    difficulty: "hard",
    flags: [
      ["us-tx", null, ["texas"], "lone star state — use state name not country"],
      ["us-ca", null, ["california"], "bear walking"],
      ["us-co", null, ["colorado"], "red c yellow center"],
      ["us-md", null, ["maryland"], "heraldic quarters"],
      ["us-az", null, ["arizona"], "copper star rays"],
      ["us-nm", null, ["new mexico"], "zia sun symbol"],
    ],
  },
];

// US state flags use different URLs
const usStateFlagUrls = {
  "us-tx": "https://flagcdn.com/w640/us-tx.png",
  "us-ca": "https://flagcdn.com/w640/us-ca.png",
  "us-co": "https://flagcdn.com/w640/us-co.png",
  "us-md": "https://flagcdn.com/w640/us-md.png",
  "us-az": "https://flagcdn.com/w640/us-az.png",
  "us-nm": "https://flagcdn.com/w640/us-nm.png",
};

const flagQuizzes = flagSets.map((set, si) => ({
  id: set.id,
  title: set.title,
  description: set.description,
  category: set.category,
  language: "en",
  tags: ["flags", "geography"],
  creator: pickCreator(si + 1),
  playCount: randPlays(800, 42000),
  createdAt: isoDate(40 + si * 7),
  coverEmoji: set.coverEmoji,
  difficulty: set.difficulty,
  featured: set.featured ?? false,
  questions: set.flags.map(([code, _a, answers, hint], qi) =>
    qImage(`${set.id}-${qi}`, usStateFlagUrls[code] ?? flagUrl(code), answers, hint),
  ),
}));

// --- NATURE (Machugi: 동물 맞추기) ---
const natureQuizzes = [
  {
    id: "animals-easy-photos",
    title: "animals. name them.",
    description: "photos of animals. nothing trickier than that. maybe.",
    category: "Nature",
    coverEmoji: "🐾",
    difficulty: "easy",
    featured: true,
    creator: "plantmom",
    questions: [
      qImage("ae1", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg", ["lion"], "big cat mane"),
      qImage("ae2", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Southern_green_frog.jpg/640px-Southern_green_frog.jpg", ["frog"], "amphibian jumps"),
      qImage("ae3", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/640px-Grosser_Panda.JPG", ["panda", "giant panda"], "bamboo eater black white"),
      qImage("ae4", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/640px-Walking_tiger_female.jpg", ["tiger"], "orange stripes"),
      qImage("ae5", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/640px-Giraffe_Mikumi_National_Park.jpg", ["giraffe"], "very long neck"),
      qImage("ae6", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hippo_at_Dallas_Zoo.jpg/640px-Hippo_at_Dallas_Zoo.jpg", ["hippo", "hippopotamus"], "river horse"),
      qImage("ae7", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Platypus.jpg/640px-Platypus.jpg", ["platypus"], "duck bill mammal"),
      qImage("ae8", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Koala_climbing_tree.jpg/640px-Koala_climbing_tree.jpg", ["koala"], "sleeps in eucalyptus"),
    ],
  },
  {
    id: "animals-crop-zoom",
    title: "animals but zoomed in",
    description: "like machugi animal quizzes. you only see a patch of fur or skin.",
    category: "Nature",
    coverEmoji: "🔍",
    difficulty: "hard",
    creator: "nightowl",
    questions: [
      qCrop("ac1", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/640px-Lion_waiting_in_Namibia.jpg", 45, 30, 18, ["lion"], "mane maybe visible"),
      qCrop("ac2", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/640px-Walking_tiger_female.jpg", 55, 50, 15, ["tiger"], "stripes"),
      qCrop("ac3", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/640px-Giraffe_Mikumi_National_Park.jpg", 40, 10, 20, ["giraffe"], "spots up high"),
      qCrop("ac4", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/640px-Grosser_Panda.JPG", 50, 40, 22, ["panda", "giant panda"], "black and white fur"),
      qCrop("ac5", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Platypus.jpg/640px-Platypus.jpg", 48, 55, 25, ["platypus"], "weird bill"),
      qCrop("ac6", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Koala_climbing_tree.jpg/640px-Koala_climbing_tree.jpg", 50, 35, 20, ["koala"], "grey fluff"),
    ],
  },
  {
    id: "birds-youve-seen",
    title: "birds (common ones)",
    description: "not super exotic. stuff you might see in a park or documentary.",
    category: "Nature",
    coverEmoji: "🦅",
    difficulty: "medium",
    creator: "hana",
    questions: [
      qImage("br1", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bald_Eagle_Portrait.jpg/640px-Bald_Eagle_Portrait.jpg", ["bald eagle", "eagle"], "US national bird"),
      qImage("br2", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Flamingo_Laguna_Colorada_Bolivia.jpg/640px-Flamingo_Laguna_Colorada_Bolivia.jpg", ["flamingo"], "pink standing bird"),
      qImage("br3", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pavo_cristatus_-_India.jpg/640px-Pavo_cristatus_-_India.jpg", ["peacock"], "fancy tail"),
      qImage("br4", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Owl_ears.jpg/640px-Owl_ears.jpg", ["owl"], "turns head around"),
      qImage("br5", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Parrot.red.macaw.1.arp.750pix.jpg/640px-Parrot.red.macaw.1.arp.750pix.jpg", ["parrot", "macaw"], "tropical colors"),
      qImage("br6", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Hummingbird.jpg/640px-Hummingbird.jpg", ["hummingbird"], "hovers at flowers"),
    ],
  },
  {
    id: "ocean-creatures",
    title: "things that live in the ocean",
    description: "fish and friends. no trick questions on purpose.",
    category: "Nature",
    coverEmoji: "🐠",
    difficulty: "easy",
    creator: "atlas",
    questions: [
      qImage("oc1", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Clownfish_in_anemone.jpg/640px-Clownfish_in_anemone.jpg", ["clownfish", "clown fish"], "nemo fish orange white"),
      qImage("oc2", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Dolphin-2.jpg/640px-Dolphin-2.jpg", ["dolphin"], "smart mammal jumps"),
      qImage("oc3", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Orca_porpoising.jpg/640px-Orca_porpoising.jpg", ["orca", "killer whale"], "black white predator"),
      qImage("oc4", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Sea_turtle.jpg/640px-Sea_turtle.jpg", ["sea turtle", "turtle"], "shell swimmer"),
      qImage("oc5", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Octopus2.jpg/640px-Octopus2.jpg", ["octopus"], "eight arms"),
      qImage("oc6", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Jelly_cc11.jpg/640px-Jelly_cc11.jpg", ["jellyfish"], "stings sometimes"),
    ],
  },
  {
    id: "dog-breeds-quiz",
    title: "dog breeds",
    description: "i miss my dog so i made this. breed name in english.",
    category: "Nature",
    coverEmoji: "🐕",
    difficulty: "medium",
    creator: "breadcat",
    questions: [
      qImage("dg1", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/640px-YellowLabradorLooking_new.jpg", ["labrador", "labrador retriever", "lab"], "common family dog"),
      qImage("dg2", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/German_Shepherd_-_DSC_0346_%2810096362833%29.jpg/640px-German_Shepherd_-_DSC_0346_%2810096362833%29.jpg", ["german shepherd"], "police dog often"),
      qImage("dg3", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Barkless_Basenji.jpg/640px-Barkless_Basenji.jpg", ["basenji"], "doesnt bark much"),
      qImage("dg4", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Border_Collie_600.jpg/640px-Border_Collie_600.jpg", ["border collie"], "herding very smart"),
      qImage("dg5", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Atika_Bijou_Poodle.jpg/640px-Atika_Bijou_Poodle.jpg", ["poodle"], "curly haircut dog"),
      qImage("dg6", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Dalmatian.jpg/640px-Dalmatian.jpg", ["dalmatian"], "spotted firehouse dog"),
    ],
  },
  {
    id: "food-photo-guess",
    title: "food from a photo",
    description: "machugi has tons of food quizzes. this is the international version.",
    category: "Food",
    coverEmoji: "🍽️",
    difficulty: "easy",
    featured: true,
    creator: "sam_k",
    questions: [
      qImage("fd1", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/640px-Eq_it-na_pizza-margherita_sep2005_sml.jpg", ["pizza", "pizza margherita"], "cheese tomato basil"),
      qImage("fd2", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sushi_platter.jpg/640px-Sushi_platter.jpg", ["sushi"], "raw fish rice"),
      qImage("fd3", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/640px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg", ["taco", "tacos"], "mexican folded tortilla"),
      qImage("fd4", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Croissant-Petr_Kratochvil.jpg/640px-Croissant-Petr_Kratochvil.jpg", ["croissant"], "french buttery pastry"),
      qImage("fd5", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/640px-%22Hyderabadi_Dum_Biryani%22.jpg", ["biryani"], "spiced rice dish"),
      qImage("fd6", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/640px-Latte_and_dark_coffee.jpg", ["coffee", "latte"], "cafe drink"),
      qImage("fd7", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Chocolate_chip_cookie.jpg/640px-Chocolate_chip_cookie.jpg", ["cookie", "chocolate chip cookie"], "sweet baked"),
      qImage("fd8", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ramen_Noodles.jpg/640px-Ramen_Noodles.jpg", ["ramen"], "japanese noodle soup"),
    ],
  },
  {
    id: "food-crop-machugi",
    title: "food but you only see a corner",
    description: "ripped this format straight from food crop quizzes. zoomed way in.",
    category: "Food",
    coverEmoji: "🥐",
    difficulty: "hard",
    creator: "mika",
    questions: [
      qCrop("fc1", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/640px-Eq_it-na_pizza-margherita_sep2005_sml.jpg", 50, 50, 20, ["pizza"], "melted cheese"),
      qCrop("fc2", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Croissant-Petr_Kratochvil.jpg/640px-Croissant-Petr_Kratochvil.jpg", 45, 45, 22, ["croissant"], "layered pastry"),
      qCrop("fc3", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Chocolate_chip_cookie.jpg/640px-Chocolate_chip_cookie.jpg", 55, 50, 25, ["cookie", "chocolate chip cookie"], "chips in dough"),
      qCrop("fc4", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Ramen_Noodles.jpg/640px-Ramen_Noodles.jpg", 50, 55, 20, ["ramen"], "noodles broth"),
      qCrop("fc5", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Sushi_platter.jpg/640px-Sushi_platter.jpg", 40, 40, 18, ["sushi"], "rice and fish"),
      qCrop("fc6", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/640px-Latte_and_dark_coffee.jpg", 48, 52, 22, ["coffee", "latte"], "milky brown"),
    ],
  },
  {
    id: "tropical-fruits",
    title: "tropical fruits",
    description: "stuff you find at a market in thailand or brazil probably.",
    category: "Food",
    coverEmoji: "🥭",
    difficulty: "medium",
    creator: "yun",
    questions: [
      qImage("tf1", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Hapus_Mango.jpg/640px-Hapus_Mango.jpg", ["mango"], "sweet orange flesh"),
      qImage("tf2", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Pineapple_and_cross_section.jpg/640px-Pineapple_and_cross_section.jpg", ["pineapple"], "spiky top fruit"),
      qImage("tf3", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Papaya_cross_section_BNC.jpg/640px-Papaya_cross_section_BNC.jpg", ["papaya"], "orange center seeds"),
      qImage("tf4", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Dragonfruit_pitahaya.jpg/640px-Dragonfruit_pitahaya.jpg", ["dragon fruit", "dragonfruit", "pitaya"], "pink scaly outside"),
      qImage("tf5", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Coconut_on_tree.jpg/640px-Coconut_on_tree.jpg", ["coconut"], "tropical palm nut"),
      qImage("tf6", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Lychee_01.jpg/640px-Lychee_01.jpg", ["lychee", "litchi"], "bumpy red shell"),
    ],
  },
].map((q, i) => ({
  ...q,
  language: "en",
  tags: [q.category.toLowerCase()],
  playCount: randPlays(400, 28000),
  createdAt: isoDate(20 + i * 5),
}));

// --- GEO ---
const geoQuizzes = [
  {
    id: "capitals-europe",
    title: "european capitals",
    description: "photo of a landmark or skyline. name the capital city.",
    category: "Geography",
    coverEmoji: "🏛️",
    difficulty: "medium",
    featured: true,
    creator: "geo_nerd",
    questions: [
      qImage("ce1", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Eiffel_Tower.jpg/640px-The_Eiffel_Tower.jpg", ["paris"], "france capital"),
      qImage("ce2", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/640px-Colosseo_2020.jpg", ["rome"], "italy capital"),
      qImage("ce3", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Madrid_Collage.jpg/640px-Madrid_Collage.jpg", ["madrid"], "spain capital"),
      qImage("ce4", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Brandenburg_Gate%2C_Berlin%2C_Germany.jpg/640px-Brandenburg_Gate%2C_Berlin%2C_Germany.jpg", ["berlin"], "germany capital"),
      qImage("ce5", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Big_Ben_2012-06-23.jpg/640px-Big_Ben_2012-06-23.jpg", ["london"], "uk capital"),
      qImage("ce6", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Amsterdam_%28cropped%29.jpg/640px-Amsterdam_%28cropped%29.jpg", ["amsterdam"], "netherlands capital"),
      qImage("ce7", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Vienna_-_Hofburg_New_Castle_01.jpg/640px-Vienna_-_Hofburg_New_Castle_01.jpg", ["vienna"], "austria capital"),
      qImage("ce8", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Acropolis_of_Athens_01361.JPG/640px-Acropolis_of_Athens_01361.JPG", ["athens"], "greece capital"),
    ],
  },
  {
    id: "capitals-world-mix",
    title: "capitals around the world",
    description: "not just europe this time. mixed bag.",
    category: "Geography",
    coverEmoji: "🌐",
    difficulty: "medium",
    creator: "atlas",
    questions: [
      qImage("cw1", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/640px-Statue_of_Liberty_7.jpg", ["washington", "washington dc", "washington d.c."], "US capital area"),
      qImage("cw2", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Taj_Mahal_in_India_-_Kristian_Bertel.jpg/640px-Taj_Mahal_in_India_-_Kristian_Bertel.jpg", ["new delhi", "delhi"], "india capital region"),
      qImage("cw3", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Stonehenge_2017.jpg/640px-Stonehenge_2017.jpg", ["london"], "uk — trick: stonehenge is not london but many mix this up — actually use different image"),
      qImage("cw4", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mount_Fuji_and_cherry_blossoms.jpg/640px-Mount_Fuji_and_cherry_blossoms.jpg", ["tokyo"], "japan capital region"),
      qImage("cw5", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cairo_Citadel%2C_Egypt.jpg/640px-Cairo_Citadel%2C_Egypt.jpg", ["cairo"], "egypt capital"),
      qImage("cw6", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_%28cropped%29.jpg/640px-Sydney_Opera_House_%28cropped%29.jpg", ["canberra", "sydney"], "australia — sydney is NOT capital but iconic"),
    ],
  },
  {
    id: "famous-mountains",
    title: "name that mountain",
    description: "photos of famous peaks. not climbing advice.",
    category: "Geography",
    coverEmoji: "⛰️",
    difficulty: "medium",
    creator: "trevor",
    questions: [
      qImage("mt1", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/640px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg", ["everest", "mount everest", "mt everest"], "tallest on earth"),
      qImage("mt2", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Mount_Fuji_from_Motohakone_2022.jpg/640px-Mount_Fuji_from_Motohakone_2022.jpg", ["fuji", "mount fuji", "mt fuji"], "japan volcano"),
      qImage("mt3", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro_from_Amboseli_National_Park.jpg/640px-Mount_Kilimanjaro_from_Amboseli_National_Park.jpg", ["kilimanjaro", "mount kilimanjaro"], "africa tallest"),
      qImage("mt4", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Matterhorn_from_Domh%C3%BCtte_-_2.jpg/640px-Matterhorn_from_Domh%C3%BCtte_-_2.jpg", ["matterhorn"], "alps iconic peak"),
      qImage("mt5", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Denali_Mt_McKinley.jpg/640px-Denali_Mt_McKinley.jpg", ["denali", "mount mckinley", "mckinley"], "alaska tallest"),
      qImage("mt6", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Aconcagua_%28from_south%29%2C_Argentina.jpg/640px-Aconcagua_%28from_south%29%2C_Argentina.jpg", ["aconcagua"], "south america tallest"),
    ],
  },
  {
    id: "rivers-of-earth",
    title: "rivers",
    description: "big rivers from photos. geography class flashbacks.",
    category: "Geography",
    coverEmoji: "🌊",
    difficulty: "medium",
    creator: "jules",
    questions: [
      qImage("rv1", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Amazon_river_near_Manaus.jpg/640px-Amazon_river_near_Manaus.jpg", ["amazon", "amazon river"], "largest by volume"),
      qImage("rv2", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Yangtze_River_%28Chang_Jiang%29_01.jpg/640px-Yangtze_River_%28Chang_Jiang%29_01.jpg", ["yangtze", "chang jiang", "yangtze river"], "longest in asia"),
      qImage("rv3", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Mississippi_River_from_Eads_Bridge.jpg/640px-Mississippi_River_from_Eads_Bridge.jpg", ["mississippi", "mississippi river"], "US heartland river"),
      qImage("rv4", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Danube_in_Budapest.jpg/640px-Danube_in_Budapest.jpg", ["danube", "danube river"], "flows through budapest"),
      qImage("rv5", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ganges_at_Haridwar.jpg/640px-Ganges_at_Haridwar.jpg", ["ganges", "ganga", "ganges river"], "sacred in india"),
      qImage("rv6", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponile_Rialto_from_the_Grand_Canal.jpg/640px-Camponile_Rialto_from_the_Grand_Canal.jpg", ["nile", "river nile"], "egypt lifeline"),
    ],
  },
  {
    id: "world-currencies",
    title: "currencies",
    description: "banknotes. name the currency not the country (e.g. yen not japan).",
    category: "Geography",
    coverEmoji: "💵",
    difficulty: "hard",
    creator: "luna_p",
    questions: [
      qImage("cur1", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/US_one_dollar_bill%2C_obverse%2C_series_2009.jpg/640px-US_one_dollar_bill%2C_obverse%2C_series_2009.jpg", ["dollar", "us dollar", "usd"], "green george washington"),
      qImage("cur2", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/5000_yen.jpg/640px-5000_yen.jpg", ["yen", "japanese yen"], "japan money"),
      qImage("cur3", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Euro_coins_and_banknotes.jpg/640px-Euro_coins_and_banknotes.jpg", ["euro", "euros"], "EU currency"),
      qImage("cur4", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/British_10_pound_note.jpg/640px-British_10_pound_note.jpg", ["pound", "british pound", "gbp", "pound sterling"], "uk money"),
      qImage("cur5", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/1000_rupees.jpg/640px-1000_rupees.jpg", ["rupee", "indian rupee"], "india money"),
      qImage("cur6", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/100_yuan_note.jpg/640px-100_yuan_note.jpg", ["yuan", "renminbi", "rmb", "chinese yuan"], "china money"),
    ],
  },
  {
    id: "planets-solar-system",
    title: "planets",
    description: "NASA public domain pics. name the planet.",
    category: "Science",
    coverEmoji: "🪐",
    difficulty: "easy",
    featured: true,
    creator: "zero",
    questions: [
      qImage("pl1", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Blue_Marble_2002.png/640px-Blue_Marble_2002.png", ["earth"], "you live here"),
      qImage("pl2", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/640px-OSIRIS_Mars_true_color.jpg", ["mars"], "red planet"),
      qImage("pl3", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Jupiter_New_Horizons.jpg/640px-Jupiter_New_Horizons.jpg", ["jupiter"], "biggest gas giant"),
      qImage("pl4", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Saturn_from_Cassini_Huygens.jpg/640px-Saturn_from_Cassini_Huygens.jpg", ["saturn"], "rings"),
      qImage("pl5", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/640px-Uranus2.jpg", ["uranus"], "tilted ice giant"),
      qImage("pl6", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Neptune_Full.jpg/640px-Neptune_Full.jpg", ["neptune"], "windy blue"),
    ],
  },
  {
    id: "country-by-outline",
    title: "country shape only",
    description: "silhouette of a country border. no labels. good luck.",
    category: "Geography",
    coverEmoji: "🗺️",
    difficulty: "hard",
    creator: "geo_nerd",
    questions: [
      qImage("co1", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Italy_location_map.svg/640px-Italy_location_map.svg.png", ["italy"], "boot shape"),
      qImage("co2", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/France_location_map.svg/640px-France_location_map.svg.png", ["france"], "hexagon-ish"),
      qImage("co3", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Japan_location_map.svg/640px-Japan_location_map.svg.png", ["japan"], "island chain"),
      qImage("co4", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Australia_location_map.svg/640px-Australia_location_map.svg.png", ["australia"], "continent island"),
      qImage("co5", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mexico_location_map.svg/640px-Mexico_location_map.svg.png", ["mexico"], "south of US"),
      qImage("co6", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/United_Kingdom_location_map.svg/640px-United_Kingdom_location_map.svg.png", ["united kingdom", "uk", "britain", "great britain"], "island northwest europe"),
    ],
  },
].map((q, i) => ({
  ...q,
  language: "en",
  tags: ["geography"],
  playCount: randPlays(600, 35000),
  createdAt: isoDate(15 + i * 4),
}));

// Fix capitals-world-mix question 3 - stonehenge/london is bad. Replace cw3
geoQuizzes.find(q => q.id === "capitals-world-mix").questions[2] = qImage(
  "cw3",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Christ_the_Redeemer_-_Cristo_Redentor.jpg/640px-Christ_the_Redeemer_-_Cristo_Redentor.jpg",
  ["brasilia", "rio de janeiro", "rio"],
  "brazil — christ statue city"
);

// --- CULTURE ---
const cultureQuizzes = [
  {
    id: "famous-paintings",
    title: "paintings you might recognize",
    description: "museum stuff. public domain images. artist or painting title both ok.",
    category: "Art",
    coverEmoji: "🎨",
    difficulty: "medium",
    featured: true,
    creator: "hana",
    questions: [
      qImage("pt1", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/640px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", ["starry night", "the starry night", "van gogh"], "swirly night sky"),
      qImage("pt2", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/640px-1665_Girl_with_a_Pearl_Earring.jpg", ["girl with a pearl earring", "pearl earring", "vermeer"], "blue headscarf"),
      qImage("pt3", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/640px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg", ["mona lisa", "da vinci", "leonardo"], "famous smile"),
      qImage("pt4", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_The_Scream.jpg/640px-Edvard_Munch%2C_The_Scream.jpg", ["the scream", "scream", "munch"], "person hands on face"),
      qImage("pt5", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/640px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg", ["the kiss", "kiss", "klimt"], "gold embrace"),
      qImage("pt6", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Van_Eyck_-_Arnolfini_Portrait.jpg/640px-Van_Eyck_-_Arnolfini_Portrait.jpg", ["arnolfini portrait", "arnolfini", "van eyck"], "couple mirror dog"),
    ],
  },
  {
    id: "unesco-sites",
    title: "famous places",
    description: "tourist spots basically. unesco or just really well known.",
    category: "Travel",
    coverEmoji: "🏛️",
    difficulty: "medium",
    creator: "rowan",
    questions: [
      qImage("un1", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/640px-Colosseo_2020.jpg", ["colosseum", "coliseum", "rome"], "roman arena"),
      qImage("un2", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Great_Wall_of_China_July_2006.JPG/640px-Great_Wall_of_China_July_2006.JPG", ["great wall", "great wall of china"], "china long wall"),
      qImage("un3", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/640px-Statue_of_Liberty_7.jpg", ["statue of liberty", "liberty"], "nyc harbor"),
      qImage("un4", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Taj_Mahal_in_India_-_Kristian_Bertel.jpg/640px-Taj_Mahal_in_India_-_Kristian_Bertel.jpg", ["taj mahal"], "white marble india"),
      qImage("un5", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Eiffel_Tower.jpg/640px-The_Eiffel_Tower.jpg", ["eiffel tower"], "paris iron tower"),
      qImage("un6", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Stonehenge_2017.jpg/640px-Stonehenge_2017.jpg", ["stonehenge"], "rocks in circle england"),
    ],
  },
  {
    id: "japan-travel-spots",
    title: "japan spots",
    description: "places tourists photograph. not anime characters.",
    category: "Travel",
    coverEmoji: "🗾",
    difficulty: "easy",
    creator: "yun",
    questions: [
      qImage("jp1", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Mount_Fuji_from_Motohakone_2022.jpg/640px-Mount_Fuji_from_Motohakone_2022.jpg", ["mount fuji", "fuji", "mt fuji"], "snow cap volcano"),
      qImage("jp2", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Torii_gate_at_Itsukushima_Shrine_2011.jpg/640px-Torii_gate_at_Itsukushima_Shrine_2011.jpg", ["torii", "itsukushima", "miyajima"], "floating gate"),
      qImage("jp3", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Golden_Pavilion_Kinkaku-ji%2C_Kyoto%2C_Japan.jpg/640px-Golden_Pavilion_Kinkaku-ji%2C_Kyoto%2C_Japan.jpg", ["kinkaku-ji", "golden pavilion", "kinkakuji"], "gold temple kyoto"),
      qImage("jp4", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Fushimi_Inari-taisha_torii_gate.jpg/640px-Fushimi_Inari-taisha_torii_gate.jpg", ["fushimi inari", "inari"], "orange gates tunnel"),
      qImage("jp5", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Shibuya_Crossing_2018.jpg/640px-Shibuya_Crossing_2018.jpg", ["shibuya", "shibuya crossing", "tokyo"], "busy tokyo crossing"),
      qImage("jp6", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Tokyo_Skytree_2014_%28cropped%29.JPG/640px-Tokyo_Skytree_2014_%28cropped%29.JPG", ["tokyo skytree", "skytree"], "tall tower tokyo"),
    ],
  },
  {
    id: "musical-instruments",
    title: "instruments",
    description: "name the instrument. seemed easy until i tried writing answers.",
    category: "Music",
    coverEmoji: "🎸",
    difficulty: "easy",
    creator: "dex",
    questions: [
      qImage("ins1", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Guitare_classique_manuel_rodriguez.jpg/640px-Guitare_classique_manuel_rodriguez.jpg", ["guitar"], "six strings"),
      qImage("ins2", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Steinway_Vienna_002.JPG/640px-Steinway_Vienna_002.JPG", ["piano"], "black and white keys"),
      qImage("ins3", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Violin_VL100.png/640px-Violin_VL100.png", ["violin"], "bow small strings"),
      qImage("ins4", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Drum_set.jpg/640px-Drum_set.jpg", ["drums", "drum kit", "drum set"], "kit with cymbals"),
      qImage("ins5", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Trumpet_1.jpg/640px-Trumpet_1.jpg", ["trumpet"], "brass horn valves"),
      qImage("ins6", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Saxophone_alto.jpg/640px-Saxophone_alto.jpg", ["saxophone", "sax"], "jazz brass woodwind"),
    ],
  },
  {
    id: "landmarks-round-two",
    title: "more landmarks (cropped)",
    description: "sequel nobody asked for. harder crops than the first landmarks quiz.",
    category: "Travel",
    coverEmoji: "📸",
    difficulty: "hard",
    creator: "mika",
    questions: [
      qCrop("lm2-1", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Eiffel_Tower.jpg/640px-The_Eiffel_Tower.jpg", 50, 20, 15, ["eiffel tower", "eiffel"], "iron lattice"),
      qCrop("lm2-2", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Christ_the_Redeemer_-_Cristo_Redentor.jpg/640px-Christ_the_Redeemer_-_Cristo_Redentor.jpg", 50, 25, 18, ["christ the redeemer", "christ redeemer"], "arms open statue"),
      qCrop("lm2-3", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_%28cropped%29.jpg/640px-Sydney_Opera_House_%28cropped%29.jpg", 48, 40, 20, ["sydney opera house", "opera house"], "white shells"),
      qCrop("lm2-4", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Mount_Fuji_and_cherry_blossoms.jpg/640px-Mount_Fuji_and_cherry_blossoms.jpg", 50, 30, 22, ["mount fuji", "fuji"], "snow peak sakura"),
      qCrop("lm2-5", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Great_Wall_of_China_July_2006.JPG/640px-Great_Wall_of_China_July_2006.JPG", 45, 50, 18, ["great wall", "great wall of china"], "stone wall ridge"),
      qCrop("lm2-6", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/640px-Statue_of_Liberty_7.jpg", 50, 15, 20, ["statue of liberty", "liberty"], "green copper torch"),
    ],
  },
  {
    id: "deserts-world",
    title: "deserts",
    description: "sandy or rocky. name the desert.",
    category: "Geography",
    coverEmoji: "🏜️",
    difficulty: "hard",
    creator: "trevor",
    questions: [
      qImage("ds1", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sahara_desert.jpg/640px-Sahara_desert.jpg", ["sahara", "sahara desert"], "largest hot desert"),
      qImage("ds2", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/GobiDesertLandscape.jpg/640px-GobiDesertLandscape.jpg", ["gobi", "gobi desert"], "mongolia china"),
      qImage("ds3", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/AtacamaDesertByMars.jpg/640px-AtacamaDesertByMars.jpg", ["atacama", "atacama desert"], "driest chile"),
      qImage("ds4", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Ayers_Rock%2C_Uluru%2C_Northern_Territory%2C_Australia.jpg/640px-Ayers_Rock%2C_Uluru%2C_Northern_Territory%2C_Australia.jpg", ["uluru", "ayers rock"], "red rock australia"),
      qImage("ds5", "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Death_Valley_National_Park%2C_California.jpg/640px-Death_Valley_National_Park%2C_California.jpg", ["death valley"], "hot california basin"),
      qImage("ds6", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Wadi_Rum%2C_Jordan.jpg/640px-Wadi_Rum%2C_Jordan.jpg", ["wadi rum"], "jordan mars-like"),
    ],
  },
].map((q, i) => ({
  ...q,
  language: "en",
  tags: [q.category.toLowerCase()],
  playCount: randPlays(500, 22000),
  createdAt: isoDate(10 + i * 3),
}));

// Extra packs appended
const extraFlags = [
  {
    id: "flags-middle-east",
    title: "middle east flags",
    description: "gulf states and neighbors. some look really similar honestly.",
    category: "Geography",
    coverEmoji: "🕌",
    difficulty: "hard",
    flags: [
      ["sa", ["saudi arabia"], "green sword script"],
      ["ae", ["uae", "united arab emirates"], "red green white black"],
      ["qa", ["qatar"], "maroon white serrated"],
      ["kw", ["kuwait"], "black trapezoid green red"],
      ["il", ["israel"], "blue star of david"],
      ["tr", ["turkey"], "red crescent star"],
      ["ir", ["iran"], "green white red emblem"],
      ["jo", ["jordan"], "black triangle star stripes"],
    ],
  },
  {
    id: "flags-oceania",
    title: "oceania flags",
    description: "pacific islands and down under. smaller countries included.",
    category: "Geography",
    coverEmoji: "🏝️",
    difficulty: "medium",
    flags: [
      ["fj", ["fiji"], "shield on blue"],
      ["pg", ["papua new guinea"], "bird of paradise"],
      ["ws", ["samoa"], "southern cross stars"],
      ["to", ["tonga"], "red cross on white"],
      ["vu", ["vanuatu"], "pig tusk boar"],
      ["sb", ["solomon islands"], "five stars diagonal"],
    ],
  },
].map((set, si) => ({
  id: set.id,
  title: set.title,
  description: set.description,
  category: set.category,
  language: "en",
  tags: ["flags"],
  creator: pickCreator(si + 20),
  playCount: randPlays(300, 12000),
  createdAt: isoDate(50 + si * 3),
  coverEmoji: set.coverEmoji,
  difficulty: set.difficulty,
  questions: set.flags.map(([code, answers, hint], qi) =>
    qImage(`${set.id}-${qi}`, flagUrl(code), answers, hint),
  ),
}));

const extraNature = [{
  id: "insects-close-up",
  title: "insects (close up)",
  description: "bugs. zoomed in. some people will hate this one.",
  category: "Nature",
  coverEmoji: "🐛",
  difficulty: "medium",
  creator: "plantmom",
  questions: [
    qImage("in1", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg/640px-Monarch_Butterfly_Danaus_plexippus_Male_2664px.jpg", ["butterfly", "monarch butterfly", "monarch"], "orange black wings"),
    qImage("in2", "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Honeybee_on_snowdrop.jpg/640px-Honeybee_on_snowdrop.jpg", ["bee", "honeybee", "honey bee"], "striped pollinator"),
    qImage("in3", "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Ladybug_on_leaf.jpg/640px-Ladybug_on_leaf.jpg", ["ladybug", "ladybird"], "red black spots"),
    qImage("in4", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Grasshopper_on_leaf.jpg/640px-Grasshopper_on_leaf.jpg", ["grasshopper"], "jumps green"),
    qImage("in5", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Dragonfly_on_leaf.jpg/640px-Dragonfly_on_leaf.jpg", ["dragonfly"], "four wings long body"),
    qImage("in6", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ant_on_leaf.jpg/640px-Ant_on_leaf.jpg", ["ant"], "colony insect"),
  ],
}].map((q, i) => ({
  ...q,
  language: "en",
  tags: ["nature", "insects"],
  playCount: randPlays(200, 8000),
  createdAt: isoDate(8 + i),
}));

flagQuizzes.push(...extraFlags);
natureQuizzes.push(...extraNature);

writeFileSync(join(dataDir, "seed-flags.json"), JSON.stringify(flagQuizzes, null, 2));
writeFileSync(join(dataDir, "seed-nature.json"), JSON.stringify(natureQuizzes, null, 2));
writeFileSync(join(dataDir, "seed-geo.json"), JSON.stringify(geoQuizzes, null, 2));
writeFileSync(join(dataDir, "seed-culture.json"), JSON.stringify(cultureQuizzes, null, 2));

const total = flagQuizzes.length + natureQuizzes.length + geoQuizzes.length + cultureQuizzes.length;
console.log(`Wrote ${flagQuizzes.length} flag + ${natureQuizzes.length} nature + ${geoQuizzes.length} geo + ${cultureQuizzes.length} culture = ${total} new quizzes`);
