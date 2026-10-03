import { StandardFestivalDay } from "../types";
import { navaratriAsset } from "../utils/navaratriAssets";

// Sharad Navaratri 2026 — Vijayawada Indrakeeladri Dasara Schedule (Oct 11–20, 2026)
// Day 1  Oct 11 (Sun) | Padyami   — Morning: Sri Bala Tripura Sundari Devi | Evening: Sri Gayatri Devi
// Day 2  Oct 12 (Mon) | Vidiya     — Morning: Sri Gayatri Devi | Evening: Sri Annapurna Devi
// Day 3  Oct 13 (Tue) | Thadiya    — Morning: Sri Annapurna Devi | Evening: Sri Maha Chandi Devi
// Day 4  Oct 14 (Wed) | Chavithi   — Morning: Sri Maha Chandi Devi | Evening: Sri Lalitha Tripura Sundari Devi
// Day 5  Oct 15 (Thu) | Panchami   — Morning: Sri Lalitha Tripura Sundari Devi | Evening: Sri Saraswati Devi
// Day 6  Oct 16 (Fri) | Shashthi   — Morning: Sri Saraswati Devi (Moola Nakshatram) | Evening: Sri Maha Lakshmi Devi
// Day 7  Oct 17 (Sat) | Saptami    — Morning: Sri Maha Lakshmi Devi | Evening: Sri Durga Devi
// Day 8  Oct 18 (Sun) | Ashtami    — Morning: Sri Durga Devi (Durgashtami) | Evening: Sri Mahishasura Mardhini Devi
// Day 9  Oct 19 (Mon) | Navami     — Morning: Sri Mahishasura Mardhini Devi (Mahanavami) | Evening: Sri Raja Rajeshwari Devi
// Day 10 Oct 20 (Tue) | Dashami    — Full Day: Sri Raja Rajeshwari Devi (Vijayadashami, Nagarotsavam 3:30PM, Teppotsavam 5-6PM & Nimarjanam)

export const STANDARD_NAVARATRI_DAYS: StandardFestivalDay[] = [
  {
    dayNumber: 1,
    date: "2026-10-11",
    tithi: "Padyami (Sunday)",
    morningAlankaram: "Sri Bala Tripura Sundari Devi",
    eveningTransition: "Sri Gayatri Devi (Day 2 Alankaram)",
    deviName: "Sri Bala Tripura Sundari Devi",
    teluguDeviName: "శ్రీ బాలా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री बाला त्रिपुरा सुंदरी देवी",
    colorName: "Bright Yellow / పసుపు / पीला",
    colorHex: "#EAB308",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-1-bala-tripura-sundari.jpg"),
    description: "The youthful child manifestation of the Divine Mother Tripura Sundari, personifying innocence, spiritual wisdom, memory power, and divine protection.",
    whyWeCelebrate: "Morning starts with Ghatasthapana and Suprabhatha Seva to invoke the young, divine motherly form. In the evening, as the Padyami tithi transitions into Vidiya, the dress/decoration shifts to Gayatri Devi.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం క్లీం సౌః సౌః క్లీం ఐం బాలాయై నమః (Om Aim Kleem Sauh Sauh Kleem Aim Balayai Namah)",
      sloka: "అరుణకిరణజాలై రంజితాశావకాశా | విధురజపపటీకా పుస్తకాభీష్టహస్తా ||",
      recommendedStotram: "Sri Bala Tripura Sundari Kavacham & Bala Sahasranama Stotram",
      bestChantingGuide: "Chanting the Bala Mantra 21 or 108 times at dawn boosts memory, concentration, and eliminates all fear."
    },
    suggestedOfferings: "Payasam, Ravva Kesari, Sugar candy (Kalkandu), Sweet milk, and Vadappappu (soaked moong dal with jaggery).",
    suggestedItems: "Jasmine flowers (Mallepulu), White Lotus, White/Yellow vastram, Sugarcane pieces, and Panchamrutham.",
    standardActivities: "Ghatasthapana, Suprabhatha Seva, Sri Bala Tripura Sundari Pooja, Kumkumarchana, and Kanya Pooja.",
    significance: "Invokes the young, divine motherly form with Ghatasthapana; evening transitions into Sri Gayatri Devi.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Bala Tripura Sundari Devi",
      eveningAlankarana: "Sri Gayatri Devi",
      sessionGuide: "Morning starts with Ghatasthapana and Suprabhatha Seva for Sri Bala Tripura Sundari Devi; in the evening, transitions into Gayatri Devi."
    }
  },
  {
    dayNumber: 2,
    date: "2026-10-12",
    tithi: "Vidiya (Monday)",
    morningAlankaram: "Sri Gayatri Devi",
    eveningTransition: "Sri Annapurna Devi (Day 3 Alankaram)",
    deviName: "Sri Gayatri Devi",
    teluguDeviName: "శ్రీ గాయత్రీ దేవి",
    hindiDeviName: "श्री गायत्री देवी",
    colorName: "Auspicious Orange / నారింజ / नारंगी",
    colorHex: "#EA580C",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-2-gayatri-devi.jpg"),
    description: "The Vedamatha and supreme source of spiritual illumination, adorned with sacred faces, bestowing Vedic intellect, wisdom, and inner light.",
    whyWeCelebrate: "Morning worship is dedicated to the Goddess of Vedic wisdom and light. Evening worship switches to Annapurna Devi, the giver of sustenance and food.",
    sacredChanting: {
      moolaMantra: "ఓం భూర్భువస్సువః | తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి | ధియో యో నః ప్రచోదయాత్ || (Gayatri Maha Mantra)",
      sloka: "ముక్తావిద్రుమ హేమనీల ధవళచ్ఛాయైర్ముఖైస్త్రీక్షణైః | యుక్తామిందునిబద్ధరత్నమకుటాం తత్త్వార్థవర్ణాత్మికామ్ ||",
      recommendedStotram: "Gayatri Sahasranama Stotram & Gayatri Kavacham",
      bestChantingGuide: "Chanting Gayatri Mantra 108 times during sunrise brings mental stillness, clarity, and radiant intellect."
    },
    suggestedOfferings: "Allam Garelu (Medu Vada), Coconut Rice, Sweet Boorelu, and Pulihora.",
    suggestedItems: "Red lotus, Hibiscus (Mandara), Sandalwood paste, Akshata, and pure cow ghee for deepam.",
    standardActivities: "Sri Gayatri Devi Veda Parayanam, Gayatri Japa, Gayatri Homa, and Sahasranama Deeparadhana.",
    significance: "Worship of the Goddess of Vedic wisdom and light; evening switches to Sri Annapurna Devi.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Gayatri Devi",
      eveningAlankarana: "Sri Annapurna Devi",
      sessionGuide: "Morning worship dedicated to Goddess of Vedic wisdom and light; evening worship switches to Annapurna Devi."
    }
  },
  {
    dayNumber: 3,
    date: "2026-10-13",
    tithi: "Thadiya (Tuesday)",
    morningAlankaram: "Sri Annapurna Devi",
    eveningTransition: "Sri Maha Chandi Devi (Day 4 Alankaram)",
    deviName: "Sri Annapurna Devi",
    teluguDeviName: "శ్రీ అన్నపూర్ణా దేవి",
    hindiDeviName: "श्री अन्नपूर्णा देवी",
    colorName: "Golden Saffron / కుంకుమ పసుపు / केसरिया",
    colorHex: "#D97706",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-3-annapurna-devi.jpg"),
    description: "The eternal provider of nourishment and mother of Kasi Kshetram, seated with a golden ladle and bowl of nectarous food, sustaining all living beings.",
    whyWeCelebrate: "Morning focuses on nourishment and grace. Evening shifts to the more protective, formidable form of Maha Chandi Devi to destroy negativity.",
    sacredChanting: {
      moolaMantra: "ఓం హ్రీం శ్రీం క్లీం భగవత్యై అన్నపూర్ణాయై నమః (Om Hreem Shreem Kleem Bhagavatyai Annapurnayai Namah)",
      sloka: "నిత్యానందకరీ వరాభయకరీ సౌందర్యరత్నాకరీ | నిర్ధూతాఖిలఘోరపావనకరీ ప్రత్యక్షమాహేశ్వరీ ||",
      recommendedStotram: "Sri Annapurna Ashtakam (by Adi Shankaracharya)",
      bestChantingGuide: "Recite Annapurna Ashtakam before preparing meals to invoke the divine blessing of perpetual abundance (Akshaya Patra)."
    },
    suggestedOfferings: "Ksheerannam (Paramannam), Sweet Pongali, Dal Vadas, and Maha Annadanam meal distribution.",
    suggestedItems: "Navadhanyalu (nine sacred grains), Rice grains, Fresh harvest fruits, and Yellow flowers.",
    standardActivities: "Sri Annapurna Devi Golden Ladle Pooja, Maha Annadanam, and Ksheerannam Bhog Distribution.",
    significance: "Focuses on nourishment and divine grace; evening shifts to Maha Chandi Devi to vanquish negative energies.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Annapurna Devi",
      eveningAlankarana: "Sri Maha Chandi Devi",
      sessionGuide: "Morning focuses on nourishment and grace; evening shifts to the formidable form of Maha Chandi Devi to destroy negativity."
    }
  },
  {
    dayNumber: 4,
    date: "2026-10-14",
    tithi: "Chavithi (Wednesday)",
    morningAlankaram: "Sri Maha Chandi Devi",
    eveningTransition: "Sri Lalitha Tripura Sundari Devi (Day 5 Alankaram)",
    deviName: "Sri Maha Chandi Devi",
    teluguDeviName: "శ్రీ మహా చండీ దేవి",
    hindiDeviName: "श्री महा चंडी देवी",
    colorName: "Fiery Crimson Red / ఎరుపు / गहरा लाल",
    colorHex: "#DC2626",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-4-maha-chandi-devi.jpg"),
    description: "The fierce, invincible warrior form of the Divine Mother mounted to vanquish negative energies, fear, and adversities, establishing cosmic righteousness.",
    whyWeCelebrate: "Morning continues with the fierce Chandi form and sacred Chandi Parayanam. Evening transitions to the royal, benevolent Lalitha Tripura Sundari Devi.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే (Chandi Navakshari Mantra)",
      sloka: "సర్వమంగళమాంగళ్యే శివే సర్వార్థసాధికే | శరణ్యే త్ర్యంబకే గౌరి నారాయణి నమోస్తుతే ||",
      recommendedStotram: "Devi Mahatmyam / Sri Durga Saptashati & Chandi Kavacham",
      bestChantingGuide: "Reciting Chandi Navakshari Mantra with pure devotion dissolves deep anxieties and wards off negativity."
    },
    suggestedOfferings: "Garelu (Vada with ginger), Kadambam, Bellam Appalu, and Lemon Naivedhyam.",
    suggestedItems: "Red silk vastram, Red oleander (Ganneru), Bilva patra, Kumkum, and Lemon garland.",
    standardActivities: "Sri Maha Chandi Pooja, Chandi Parayanam, Kumkumarchana, and Rahu Kala Deeparadhana.",
    significance: "Destroys negativity, fear, and obstacles; evening transitions to royal, benevolent Sri Lalitha Tripura Sundari.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Maha Chandi Devi",
      eveningAlankarana: "Sri Lalitha Tripura Sundari Devi",
      sessionGuide: "Morning continues with fierce Chandi form; evening transitions to royal, benevolent Lalitha Tripura Sundari."
    }
  },
  {
    dayNumber: 5,
    date: "2026-10-15",
    tithi: "Panchami (Thursday)",
    morningAlankaram: "Sri Lalitha Tripura Sundari Devi",
    eveningTransition: "Sri Saraswati Devi (Day 6 Alankaram)",
    deviName: "Sri Lalitha Tripura Sundari Devi",
    teluguDeviName: "శ్రీ లలితా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री ललिता त्रिपुरा सुंदरी देवी",
    colorName: "Royal Gold / బంగారు పసుపు / सुनहरा पीला",
    colorHex: "#CA8A04",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-5-lalitha-tripura-sundari.jpg"),
    description: "The supreme empress of the Sri Chakra (Sri Yantra), seated on a divine lotus throne, personifying royal splendor, universal bliss, compassion, and sovereign grace.",
    whyWeCelebrate: "Morning centers on royal splendor and harmony with Sri Chakra Navavarana Pooja. Evening transitions into the sacred Saraswati Alankaram ahead of Moola Nakshatram.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ లలితా పరమేశ్వర్యై నమః",
      sloka: "సింధూరారుణ విగ్రహాం త్రినయనాం మాణిక్యమౌళిస్ఫురత్ | తారానాయక శేఖరాం స్మితముఖీం ఆపీనవక్షోరుహామ్ ||",
      recommendedStotram: "Sri Lalitha Sahasranama Stotram & Lalitha Trishati",
      bestChantingGuide: "Chanting Lalitha Sahasranama with fresh red kumkum or lotus petals brings profound mental peace and family harmony."
    },
    suggestedOfferings: "Pesara Boorelu, Sweet Pongali, Pulihora, and Panchamrutham.",
    suggestedItems: "Red Kumkum, Turmeric roots, Lotus flowers, and Yellow/Red silk vastram.",
    standardActivities: "Sri Chakra Navavarana Pooja, Lalitha Sahasranama Kumkumarchana, Suvasini Pooja, and Harathi.",
    significance: "Royal splendor, family harmony, and sovereign spiritual grace; evening transitions into sacred Saraswati Alankaram.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Lalitha Tripura Sundari Devi",
      eveningAlankarana: "Sri Saraswati Devi",
      sessionGuide: "Morning centers on royal splendor and harmony; evening transitions into sacred Saraswati Alankaram ahead of Moola Nakshatram."
    }
  },
  {
    dayNumber: 6,
    date: "2026-10-16",
    tithi: "Shashthi — Moola Nakshatram (Friday)",
    morningAlankaram: "Sri Saraswati Devi",
    eveningTransition: "Sri Maha Lakshmi Devi (Day 7 Alankaram)",
    deviName: "Sri Saraswati Devi",
    teluguDeviName: "శ్రీ సరస్వతీ దేవి (మూలా నక్షత్రం)",
    hindiDeviName: "श्री सरस्वती देवी (मूला नक्षत्र)",
    colorName: "Pure White & Vedic Green / శ్వేతం & ఆకుపచ్చ / श्वेत व हरा",
    colorHex: "#16A34A",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-6-saraswati-devi.jpg"),
    description: "Celebrated on sacred Moola Nakshatram holding the veena, book, and crystal rosary; the supreme goddess of wisdom, education, and fine arts.",
    whyWeCelebrate: "Moola Nakshatram is the most auspicious day for students and scholars seeking wisdom (Aksharabhyasam). In the evening/night, the form changes to Maha Lakshmi Devi for wealth and prosperity.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం వాగ్దేవ్యై చ విద్మహే కామరాజాయ ధీమహి | తన్నో దేవీ ప్రచోదయాత్ || (Saraswathi Gayatri)",
      sloka: "యా కుందేందు తుషారహారధవళా యా శుభ్రవస్త్రావృతా | యా వీణావరదండమండితకరా యా శ్వేతపద్మాసనా ||",
      recommendedStotram: "Saraswathi Ashtottara Shata Namavali & Saraswathi Stotram",
      bestChantingGuide: "Chant Ya Kundendu before studying. Placing books before Goddess Saraswathi and reciting 11 times boosts memory."
    },
    suggestedOfferings: "Daddojanam (Curd Rice), Bellam Payasam, White Laddu, and Honey with milk.",
    suggestedItems: "White/Yellow flowers, Slates, Notebooks, Pens for Aksharabhyasam, and White lotus.",
    standardActivities: "Aksharabhyasam, Pustaka Pooja, Sri Saraswati Sangeetha Seva, and Classical Bhajans.",
    significance: "Moola Nakshatram Aksharabhyasam for students and scholars; evening changes to Maha Lakshmi Devi for wealth and prosperity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Saraswati Devi",
      eveningAlankarana: "Sri Maha Lakshmi Devi",
      sessionGuide: "Moola Nakshatram most auspicious for students seeking wisdom (Aksharabhyasam); evening form changes to Maha Lakshmi Devi."
    }
  },
  {
    dayNumber: 7,
    date: "2026-10-17",
    tithi: "Saptami (Saturday)",
    morningAlankaram: "Sri Maha Lakshmi Devi",
    eveningTransition: "Sri Durga Devi (Day 8 Alankaram)",
    deviName: "Sri Maha Lakshmi Devi",
    teluguDeviName: "శ్రీ మహా లక్ష్మీ దేవి",
    hindiDeviName: "श्री महा लक्ष्मी देवी",
    colorName: "Sacred Ash / Grey / బూడిద రంగు / धूसर",
    colorHex: "#6B7280",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-7-maha-lakshmi-devi.jpg"),
    description: "The auspicious embodiment of Ashta Lakshmi, bestowing prosperity, agricultural abundance, wealth, and auspicious fortune.",
    whyWeCelebrate: "Morning honors abundance and auspiciousness with Sri Maha Lakshmi Sahasra Deeparadhana. Evening shifts to Durga Devi as Durgashtami approaches.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద శ్రీం హ్రీం శ్రీం ఓం మహాలక్ష్మ్యై నమః",
      sloka: "నమస్తేస్తు మహామాయే శ్రీపీఠే సురపూజితే | శంఖచక్ర గదాహస్తే మహాలక్ష్మి నమోస్తుతే ||",
      recommendedStotram: "Sri Suktam, Kanakadhara Stotram & Lakshmi Ashtakam",
      bestChantingGuide: "Chanting Sri Suktam and Kanakadhara Stotram at dusk invites Mahalakshmi's permanent auspicious presence."
    },
    suggestedOfferings: "Chakkara Pongali, Purnam Boorelu, Ksheerannam, and Dry Fruits Laddu.",
    suggestedItems: "Pink Lotus, Bilva leaves, Gold/Silver coins, Betel leaves, and Red vastram.",
    standardActivities: "Sri Maha Lakshmi Sahasra Deeparadhana, Dhana Lakshmi & Dhanya Lakshmi Archana, and Kumkumarchana.",
    significance: "Honors abundance, prosperity, and financial peace; evening shifts to Durga Devi as Durgashtami approaches.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Maha Lakshmi Devi",
      eveningAlankarana: "Sri Durga Devi",
      sessionGuide: "Morning honors abundance and auspiciousness; evening shifts to Durga Devi as Durgashtami approaches."
    }
  },
  {
    dayNumber: 8,
    date: "2026-10-18",
    tithi: "Ashtami — Durgashtami (Sunday)",
    morningAlankaram: "Sri Durga Devi",
    eveningTransition: "Sri Mahishasura Mardhini Devi (Day 9 Alankaram)",
    deviName: "Sri Durga Devi",
    teluguDeviName: "శ్రీ దుర్గా దేవి (దుర్గాష్టమి)",
    hindiDeviName: "श्री दुर्गा देवी (दुर्गाष्टमी)",
    colorName: "Royal Purple & Red / ఊదా / बैंगनी",
    colorHex: "#7E22CE",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-8-durga-devi.jpg"),
    description: "Worshipped on sacred Durgashtami as the mighty lion-rider; the universal warrior mother who protects righteousness and eliminates all hardships.",
    whyWeCelebrate: "Morning is dedicated to the warrior form mounted on a lion. Evening transitions into the fiercest form, Mahishasura Mardhini, preparing for the final battle against evil.",
    sacredChanting: {
      moolaMantra: "ఓం దుం దుర్గాయై నమః (Om Dum Durgayai Namah)",
      sloka: "దుర్గే స్మృతా హరసి భీతిమశేషజంతోః | స్వస్థైః స్మృతా మతిమతీవ శుభాం దదాసి ||",
      recommendedStotram: "Sri Durga Kavacham, Devi Mahatmyam & Durga Ashtakam",
      bestChantingGuide: "Reciting Durga Kavacham on Durgashtami provides an invincible spiritual shield safeguarding the home."
    },
    suggestedOfferings: "Kadambam, Garelu (Vada with ginger), Bellam Kudumulu, and Coconuts.",
    suggestedItems: "Red Oleander (Ganneru), Lemon garlands, Trishulam decor, and Red silk vastram.",
    standardActivities: "Maha Durgashtami Special Pooja, Chandi Parayanam, and Sandhi Pooja (Midnight Sandhya).",
    significance: "Warrior form mounted on lion; evening transitions into Mahishasura Mardhini preparing for final victory.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Durga Devi",
      eveningAlankarana: "Sri Mahishasura Mardhini Devi",
      sessionGuide: "Morning dedicated to warrior form mounted on lion; evening transitions into fiercest form, Mahishasura Mardhini, preparing for final battle."
    }
  },
  {
    dayNumber: 9,
    date: "2026-10-19",
    tithi: "Navami — Mahanavami (Monday)",
    morningAlankaram: "Sri Mahishasura Mardhini Devi",
    eveningTransition: "Sri Raja Rajeshwari Devi (Day 10 Alankaram)",
    deviName: "Sri Mahishasura Mardhini Devi",
    teluguDeviName: "శ్రీ మహిషాసుర మర్దిని దేవి (మహార్నవమి)",
    hindiDeviName: "श्री महिषासुर मर्दिनी देवी (महानवमी)",
    colorName: "Peacock Green / నెమలి ఆకుపచ్చ / मोरपंखी हरा",
    colorHex: "#0F766E",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-9-mahishasura-mardhini.jpg"),
    description: "Celebrated on Maha Navami as the victorious warrior goddess who vanquished the demon Mahishasura, restoring peace and cosmic Dharma.",
    whyWeCelebrate: "Morning honors the slaying of the demon Mahishasura. Evening shifts to the triumphant, peaceful queen of the universe, Sri Raja Rajeshwari Devi.",
    sacredChanting: {
      moolaMantra: "ఓం క్లీం కాళికాయై నమః | ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే",
      sloka: "అయి గిరినందిని నందితమేదిని విశ్వవినోదిని నందినుతే | గిరివరవింధ్య శిరోధినివాసిని విష్ణువిలాసిని జిష్ణునుతే ||",
      recommendedStotram: "Sri Mahishasura Mardhini Stotram & Kalika Ashtakam",
      bestChantingGuide: "Chanting Mahishasura Mardhini Stotram dispels fear, lethargy, and negative energies."
    },
    suggestedOfferings: "Allam Garelu, Tamarind Pulihora, Jaggery Sweet Pongali, and Whole Tender Coconut.",
    suggestedItems: "Kumkum, Red flowers, Lime garlands, Sandalwood, and Ayudha Pooja flowers.",
    standardActivities: "Sri Mahishasura Mardhini Devi Alankarana, Ayudha Pooja, Maha Harathi, and Maha Navami Chandi Homa.",
    significance: "Honors the slaying of Mahishasura; evening shifts to triumphant, peaceful queen Sri Raja Rajeshwari Devi.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Mahishasura Mardhini Devi",
      eveningAlankarana: "Sri Raja Rajeshwari Devi",
      sessionGuide: "Morning honors slaying of demon Mahishasura; evening shifts to triumphant, peaceful queen of universe, Sri Raja Rajeshwari Devi."
    }
  },
  {
    dayNumber: 10,
    date: "2026-10-20",
    tithi: "Dashami — Vijayadashami & Nimarjanam (Tuesday)",
    morningAlankaram: "Sri Raja Rajeshwari Devi",
    eveningTransition: "Teppotsavam & Nimarjanam",
    deviName: "Sri Raja Rajeshwari Devi",
    teluguDeviName: "శ్రీ రాజరాజేశ్వరి దేవి (విజయదశమి & తెప్పోత్సవం)",
    hindiDeviName: "श्री राजराजेश्वरी देवी (विजयदशमी व तेप्पोत्सवम्)",
    colorName: "Royal Saffron / కాషాయం / केसरिया",
    colorHex: "#B45309",
    imageUrl: navaratriAsset("/navaratri/assets/alankaranas/day-10-raja-rajeshwari.jpg"),
    description: "The supreme empress and victorious queen of the universe, conferring peace, fulfillment, nobility, and ultimate victory on Vijayadashami.",
    whyWeCelebrate: "Full Day Alankaram: Sri Raja Rajeshwari Devi. At 3:30 PM: Nagarotsavam (City Procession). From 5:00 PM – 6:00 PM: Teppotsavam (Float Festival in Krishna River) where the deities (Utsava Vigrahams) are taken on the decorated Hamsa Vahanam (swan boat) at Durga Ghat, marking official conclusion and Nimarjanam.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ రాజరాజేశ్వర్యై నమః",
      sloka: "అంబా శాంభవి చంద్రమౌళి రబలా పర్ణా ఉమా పార్వతీ | కాళీ హైమవతీ శివా త్రినయనీ కాత్యాయనీ భైరవీ ||",
      recommendedStotram: "Sri Raja Rajeshwari Ashtakam & Aparajita Stotram",
      bestChantingGuide: "Recite during evening Shami Pooja when exchanging Jammi leaves with family and elders for lifelong success."
    },
    suggestedOfferings: "Jalebi, Bellam Appalu, Laddu, Chakkara Pongali, and Grand Maha Prasadam.",
    suggestedItems: "Jammi (Shami) leaves, Golden Yellow/Red silk vastram, Lotus flowers, and Sweets for distribution.",
    standardActivities: "Sri Raja Rajeshwari Devi Rajabhishekam, Aparajita Pooja, Shami Pooja, 3:30 PM Nagarotsavam, and 5:00 PM Teppotsavam on Hamsa Vahanam (Krishna River).",
    significance: "Full Day Sri Raja Rajeshwari Devi (Victorious Form). 3:30 PM Nagarotsavam; 5:00 PM – 6:00 PM Teppotsavam on Krishna River at Durga Ghat & Nimarjanam.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Raja Rajeshwari Devi (Full Day)",
      eveningAlankarana: "Teppotsavam (5-6 PM) & Nimarjanam",
      sessionGuide: "Full Day: Sri Raja Rajeshwari Devi. 3:30 PM: Nagarotsavam Procession. 5:00 PM – 6:00 PM: Teppotsavam on Hamsa Vahanam at Durga Ghat in Krishna River."
    }
  }
];
