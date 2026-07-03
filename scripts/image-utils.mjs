export const FILENAME_ALIASES = {
  "GobiDesertLandscape.jpg": "Gobi Desert in Mongolia.jpg",
  "Phi_Phi_Islands.jpg": "Ko Phi Phi Lee, Thailand.jpg",
  "Stonehenge_2017.jpg": "Stonehenge, England.jpg",
  "Mount_Fuji_from_Motohakone_2022.jpg": "Mount Fuji from Lake Kawaguchi.jpg",
  "Torii_gate_at_Itsukushima_Shrine_2011.jpg": "Itsukushima torii gate.jpg",
  "Golden_Pavilion_Kinkaku-ji,_Kyoto,_Japan.jpg": "Kinkaku-ji close-up.jpg",
  "Fushimi_Inari-taisha_torii_gate.jpg": "Fushimi Inari Taisha torii gates.jpg",
  "Shibuya_Crossing_2018.jpg": "Shibuya Crossing 2018.jpg",
  "Tokyo_Skytree_2014_(cropped).JPG": "Tokyo Skytree 2014.JPG",
  "Edvard_Munch,_The_Scream.jpg":
    "Edvard Munch, 1893, The Scream, Nasjonalgalleriet, Oslo, Norway.jpg",
  "The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg":
    "The Kiss - Gustav Klimt - Google Cultural Institute.jpg",
  "AtacamaDesertByMars.jpg": "Atacama Desert landscape.jpg",
  "Death_Valley_National_Park,_California.jpg": "Death Valley National Park.jpg",
  "Dduk-bokki.jpg": "Dduk-bokki (떡볶이).jpg",
  "Hotteok.jpg": "Hotteok (호떡).jpg",
  "Korean_fried_chicken.jpg": "Korean fried chicken.jpg",
  "Korean_BBQ-Galbi-02.jpg": "Korean barbecue-Galbi-02.jpg",
  "Seoul_skyline_from_Namsan.jpg": "Seoul skyline.jpg",
  "Bangkok_Skyline.jpg": "Bangkok skyline.jpg",
  "Singapore_skyline_at_sunset.jpg":
    "Singapore skyline at sunset viewed from Gardens by the Bay East.jpg",
  "Jakarta_skyline.jpg": "Jakarta skyline.jpg",
  "Paris_Night.jpg": "Paris night from Tour Montparnasse.jpg",
  "Brandenburg_Gate_Berlin.jpg": "Brandenburg Gate Berlin.jpg",
  "Red_Square_Moscow.jpg": "Red Square, Moscow.jpg",
  "Amsterdam_canals.jpg": "Amsterdam canal Belt.jpg",
  "Golden_Gate_Bridge_0002.jpg": "GoldenGateBridge-001.jpg",
  "Peking_duck.jpg": "Peking Roast Duck.jpg",
  "Tacos_de_carne_deshebrada.jpg": "Tacos de carnitas, carne asada y al pastor.jpg",
  "Pho_with_beef_and_tendon.jpg": "Pho with beef and tendon.jpg",
  "Paella_de_marisco_01.jpg": "Paella de marisco 01.jpg",
  "Chocolate_cake.jpg": "Chocolate cake.jpg",
  "Macarons_in_a_box.jpg": "Macarons in a box.jpg",
  "Waffles_with_strawberry.jpg": "Waffles with strawberry.jpg",
  "Creme_brulee.jpg": "Crème brûlée.jpg",
  "Ayers_Rock,_Uluru,_Northern_Territory,_Australia.jpg":
    "Uluru, Northern Territory, Australia.jpg",
  "Gobi_desert_landscape.jpg": "Gobi Desert in Mongolia.jpg",
  "Korean-style_chicken.jpg": "Korean fried chicken.jpg",
  "Korean_BBQ-Galbi.jpg": "Korean barbecue-Galbi-02.jpg",
  "Tempura_prawns.jpg": "Tempura prawns.jpg",
  "Ramen_-_Danbo.jpg": "Ramen in Kyoto, Japan.jpg",
  "Croissant-PetrKratochvil.jpg": "Croissant-Petr Kratochvil.jpg",
  "Hamburger_(black_bg).jpg": "Hamburger.jpg",
  "Hyderabadi_Biryani.jpg": "Hyderabadi Dum Biryani.jpg",
  "Tiramisu_(cropped).jpg": "Tiramisu.jpg",
  "Phi_Phi_Lee,_Thailand.jpg": "Ko Phi Phi Lee, Thailand.jpg",
  "5000_yen.jpg": "5000 yen note (2004).jpg",
  "British_10_pound_note.jpg": "British 10 pound note (Series G).jpg",
  "1000_rupees.jpg": "1000 rupees note (India).jpg",
  "100_yuan_note.jpg": "100 yuan note (2015).jpg",
  "US_one_dollar_bill,_obverse,_series_2009.jpg":
    "United States one dollar bill, obverse, series 2009.jpg",
  "Hippo_at_Dallas_Zoo.jpg": "Hippopotamus amphibius in water.jpg",
  "Leopard_in_tree.jpg": "African leopard in tree.jpg",
  "Buffalo_Cape.jpg": "Cape buffalo (Syncerus caffer caffer).jpg",
  "Dolphin_in_the_water.jpg": "Common bottlenose dolphin.jpg",
  "Humpback_Whale_underwater_shot.jpg": "Humpback whale underwater.jpg",
  "Clownfish.jpg": "Amphiprion ocellaris (Clown anemonefish) by Nick Hobgood.jpg",
  "Clownfish_in_anemone.jpg":
    "Amphiprion ocellaris (Clown anemonefish) by Nick Hobgood.jpg",
  "Dolphin-2.jpg": "Common bottlenose dolphin.jpg",
  "Orca_porpoising.jpg": "Killerwhale jumping.jpg",
  "Octopus2.jpg": "Octopus vulgaris.jpg",
  '"Hyderabadi_Dum_Biryani".jpg': "Hyderabadi Dum Biryani.jpg",
  "Ramen_Noodles.jpg": "Ramen in Kyoto, Japan.jpg",
  "Barkless_Basenji.jpg": "Basenji 600.jpg",
  "Cheetah4.jpg": "Cheetah (Acinonyx jubatus) female 2.jpg",
  "Chameleon_in_Madagascar.jpg": "Furcifer pardalis (Panther chameleon).jpg",
  "Siam_lilacPoint.jpg": "Siamese cat.jpg",
  "Bengal_cat_4.jpg": "Bengal cat.jpg",
  "Honeybee_on_snowdrop.jpg": "Apis mellifera Western honey bee.jpg",
  "Ladybug_on_leaf.jpg": "Coccinella septempunctata.jpg",
  "Rose_red_closeup.jpg": "Red rose closeup.jpg",
  "Lavender_field.jpg": "Lavender field in Provence.jpg",
};

export function canonicalName(filename) {
  return FILENAME_ALIASES[filename] ?? filename.replace(/_/g, " ");
}

export function extractFilename(url) {
  if (!url) return null;
  if (url.includes("upload.wikimedia.org")) {
    const thumb = url.match(/\/(\d+px-[^/]+)$/);
    if (thumb) {
      const name = decodeURIComponent(thumb[1].replace(/^\d+px-/, ""));
      return name;
    }
  }
  if (url.includes("Special:FilePath/")) {
    const m = url.match(/Special:FilePath\/([^?]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  const thumb = url.match(/commons\/thumb\/[a-f0-9]\/[a-f0-9]{2}\/([^/]+)\//i);
  if (thumb) return decodeURIComponent(thumb[1]);
  const direct = url.match(/commons\/[a-f0-9]\/[a-f0-9]{2}\/([^/]+)$/i);
  if (direct) return decodeURIComponent(direct[1]);
  return null;
}

export function lookupVerified(verified, filename, width) {
  return verified[`${filename}@${width}`] ?? verified[`${canonicalName(filename)}@${width}`];
}
