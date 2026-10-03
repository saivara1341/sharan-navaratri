import { StandardFestivalDay } from "../types";
import { navaratriAsset } from "../utils/navaratriAssets";

// Sharad Navaratri 2026 — Correct 10-Day Sacred Schedule (Oct 11–20, 2026)
// Day 1  Oct 11 — Sri Swarna Kavachalankruta Durga Devi (Ghatasthapana)
// Day 2  Oct 12 — Sri Bala Tripura Sundari Devi
// Day 3  Oct 13 — Sri Gayatri Devi
// Day 4  Oct 14 — Sri Annapurna Devi
// Day 5  Oct 15 — Sri Lalitha Tripura Sundari Devi
// Day 6  Oct 16 — Sri Maha Saraswathi Devi (Moola Nakshatram)
// Day 7  Oct 17 — Sri Maha Lakshmi Devi
// Day 8  Oct 18 — Sri Durga Devi (Durgashtami)
// Day 9  Oct 19 — Sri Mahishasura Mardhini Devi / Sri Kalika Devi (Maha Navami)
// Day 10 Oct 20 — Sri Raja Rajeshwari Devi (Vijaya Dashami)

export const STANDARD_NAVARATRI_DAYS: StandardFestivalDay[] = [
  {
    dayNumber: 1,
    date: "2026-10-11",
    tithi: "Shuddha Padyami",
    morningAlankaram: "Sri Swarna Kavachalankruta Durga Devi",
    eveningTransition: "Sri Bala Tripura Sundari Devi (Prep for Day 2)",
    deviName: "Sri Swarna Kavachalankruta Durga Devi",
    teluguDeviName: "శ్రీ స్వర్ణ కవచాలంకృత దుర్గా దేవి",
    hindiDeviName: "श्री स्वर्ण कवच अलंकृत दुर्गा देवी",
    colorName: "Golden Orange / బంగారు నారింజ / सुनहरा नारंगी",
    colorHex: "#D97706",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-1-shailaputri.jpg"),
    description: "The grand inaugural alankarana where Devi is adorned in radiant golden armor (Swarna Kavacham), conferring fearlessness, victory, and divine health upon all devotees.",
    whyWeCelebrate: "Ghatasthapana marks the divine commencement of Navaratri. The Swarna Kavacham (golden armor) alankarana invokes Devi's supreme protective power over every devotee, shielding them from all adversities and bestowing victorious beginnings.",
    sacredChanting: {
      moolaMantra: "ఓం దుం దుర్గాయై నమః | ఓం శ్రీం హ్రీం దుర్గాయై నమః (Om Dum Durgayai Namah)",
      sloka: "జయంతీ మంగళా కాళీ భద్రకాళీ కపాలినీ | దుర్గా క్షమా శివా ధాత్రీ స్వాహా స్వధా నమోస్తుతే ||",
      recommendedStotram: "Sri Durga Kavacham & Durga Saptashati Prathama Adhyaya",
      bestChantingGuide: "Chanting Durga Kavacham at sunrise on Ghatasthapana creates an invincible divine shield for the entire 10-day festival."
    },
    suggestedOfferings: "Katte Pongali, Ghee Naivedhyam, Honey, and Bananas.",
    suggestedItems: "Golden Yellow flowers, Bilva Patra, Pure Ghee deepam, Kumkum, and Red Silk Vastram.",
    standardActivities: "Ghatasthapana, Kalash Sthapana, Sri Swarna Kavachalankruta Durga Devi Alankarana, and Evening Deeparadhana.",
    significance: "Inaugurates Navaratri with supreme divine protection and golden auspiciousness for all devotees.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Swarna Kavachalankruta Durga Devi",
      eveningAlankarana: "Sri Bala Tripura Sundari Devi (Prep for Day 2)",
      sessionGuide: "Morning Ghatasthapana & Swarna Kavachalankruta Durga Devi darshan; evening prepares for Day 2 Sri Bala Tripura Sundari Devi."
    }
  },
  {
    dayNumber: 2,
    date: "2026-10-12",
    tithi: "Shuddha Vidiya",
    morningAlankaram: "Sri Bala Tripura Sundari Devi",
    eveningTransition: "Sri Gayatri Devi (Prep for Day 3)",
    deviName: "Sri Bala Tripura Sundari Devi",
    teluguDeviName: "శ్రీ బాలా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री बाला त्रिपुरा सुंदरी देवी",
    colorName: "Pure White / తెలుపు / सफेद",
    colorHex: "#F5F5F4",
    imageUrl: navaratriAsset("/navaratri/assets/bala-tripura-sundari-alankarana.jpg"),
    description: "The youthful child manifestation of the Divine Mother Tripura Sundari, personifying innocence, spiritual wisdom, memory power, and divine playfulness.",
    whyWeCelebrate: "Bala Tripura Sundari is the 9-year-old manifestation of Sri Lalitha Tripura Sundari who confers speech eloquence, academic excellence, and cosmic protection. Devotees celebrate this sacred day with Kanya Pooja & Bala Sahasranama Kumkumarchana.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం క్లీం సౌః సౌః క్లీం ఐం బాలాయై నమః (Om Aim Kleem Sauh Sauh Kleem Aim Balayai Namah)",
      sloka: "అరుణకిరణజాలై రంజితాశావకాశా | విధురజపపటీకా పుస్తకాభీష్టహస్తా ||",
      recommendedStotram: "Sri Bala Tripura Sundari Kavacham & Bala Sahasranama Stotram",
      bestChantingGuide: "Chanting the Bala Mantra 21 or 108 times at dawn boosts memory, concentration, and eliminates all fear."
    },
    suggestedOfferings: "Payasam, Ravva Kesari, Sugar candy (Kalkandu), Sweet milk, and Vadappappu (soaked moong dal with jaggery).",
    suggestedItems: "Jasmine flowers (Mallepulu), White Lotus, White vastram, Sugarcane pieces, and Panchamrutham.",
    standardActivities: "Sri Bala Tripura Sundari Pooja, Kumkumarchana, Kanya Pooja, and Bala Sahasranama.",
    significance: "Inspires inner purity, peace, and academic excellence for children and families.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Bala Tripura Sundari Devi",
      eveningAlankarana: "Sri Gayatri Devi (Prep for Day 3)",
      sessionGuide: "Morning Sri Bala Tripura Sundari Devi Pooja & Kanya Pooja; evening transitions for Day 3 Sri Gayatri Devi."
    }
  },
  {
    dayNumber: 3,
    date: "2026-10-13",
    tithi: "Shuddha Tadiya",
    morningAlankaram: "Sri Gayatri Devi",
    eveningTransition: "Sri Annapurna Devi (Prep for Day 4)",
    deviName: "Sri Gayatri Devi",
    teluguDeviName: "శ్రీ గాయత్రీ దేవి",
    hindiDeviName: "श्री गायत्री देवी",
    colorName: "Auspicious Red / ఎరుపు / लाल",
    colorHex: "#DC2626",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-3-chandraghanta.jpg"),
    description: "The Vedamatha and supreme source of spiritual illumination, adorned with five sacred faces (Panchamukhi), bestowing intellect, wisdom, and inner light.",
    whyWeCelebrate: "Gayatri Devi illuminates the human intellect (Dhiyo Yo Nah Prachodayat) to distinguish truth from illusion. Devotees celebrate Shuddha Tadiya with Veda Parayanam & Sri Gayatri Sahasranama Deeparadhana.",
    sacredChanting: {
      moolaMantra: "ఓం భూర్భువస్సువః | తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి | ధియో యో నః ప్రచోదయాత్ || (Gayatri Maha Mantra)",
      sloka: "ముక్తావిద్రుమ హేమనీల ధవళచ్ఛాయైర్ముఖైస్త్రీక్షణైః | యుక్తామిందునిబద్ధరత్నమకుటాం తత్త్వార్థవర్ణాత్మికామ్ ||",
      recommendedStotram: "Gayatri Sahasranama Stotram & Gayatri Kavacham",
      bestChantingGuide: "Chanting Gayatri Mantra 108 times during sunrise brings mental stillness and radiant aura."
    },
    suggestedOfferings: "Allam Garelu (Medu Vada), Coconut Rice, and Pulihora.",
    suggestedItems: "Red lotus, Hibiscus (Mandara), Sandalwood paste, Akshata, and pure cow ghee for deepam.",
    standardActivities: "Sri Gayatri Devi Veda Parayanam, Gayatri Japa, Gayatri Homa, and Sahasranama Deeparadhana.",
    significance: "Removes ignorance, sharpens the intellect, and brings spiritual clarity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Gayatri Devi",
      eveningAlankarana: "Sri Annapurna Devi (Prep for Day 4)",
      sessionGuide: "Morning Vedamatha Gayatri Pooja & Deeparadhana; evening transitions with prep for Day 4 Sri Annapurna Devi."
    }
  },
  {
    dayNumber: 4,
    date: "2026-10-14",
    tithi: "Shuddha Chavithi",
    morningAlankaram: "Sri Annapurna Devi",
    eveningTransition: "Sri Lalitha Tripura Sundari Devi (Prep for Day 5)",
    deviName: "Sri Annapurna Devi",
    teluguDeviName: "శ్రీ అన్నపూర్ణా దేవి",
    hindiDeviName: "श्री अन्नपूर्णा देवी",
    colorName: "Royal Blue / గాఢ నీలం / शाही नीला",
    colorHex: "#1D4ED8",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-4-kushmanda.jpg"),
    description: "The eternal provider of nourishment and mother of Kasi Kshetram, seated with a golden ladle and bowl of nectarous food, sustaining all living beings.",
    whyWeCelebrate: "Devotees celebrate Shuddha Chavithi with Annapurna Devi's Golden Ladle Pooja so that no family ever faces shortage of food. The sacred Maha Annadanam & Ksheerannam Bhog Distribution is the centerpiece of this day.",
    sacredChanting: {
      moolaMantra: "ఓం హ్రీం శ్రీం క్లీం భగవత్యై అన్నపూర్ణాయై నమః (Om Hreem Shreem Kleem Bhagavatyai Annapurnayai Namah)",
      sloka: "నిత్యానందకరీ వరాభయకరీ సౌందర్యరత్నాకరీ | నిర్ధూతాఖిలఘోరపావనకరీ ప్రత్యక్షమాహేశ్వరీ ||",
      recommendedStotram: "Sri Annapurna Ashtakam (by Adi Shankaracharya)",
      bestChantingGuide: "Recite Annapurna Ashtakam before preparing meals. Invokes the blessing of Akshaya Patra."
    },
    suggestedOfferings: "Ksheerannam (Paramannam), Pongal, Dal Vadas, and Maha Annadanam meal distribution.",
    suggestedItems: "Navadhanyalu (nine sacred grains), Rice grains, Fresh harvest fruits, and Yellow flowers.",
    standardActivities: "Sri Annapurna Devi Golden Ladle Pooja, Maha Annadanam, and Ksheerannam Bhog Distribution.",
    significance: "Ensures abundance, hunger alleviation, and blessing of food and prosperity in every home.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Annapurna Devi",
      eveningAlankarana: "Sri Lalitha Tripura Sundari Devi (Prep for Day 5)",
      sessionGuide: "Morning Sri Annapurna Devi Golden Ladle Pooja & Maha Annadanam; evening transitions for Day 5 Sri Lalitha Tripura Sundari Devi."
    }
  },
  {
    dayNumber: 5,
    date: "2026-10-15",
    tithi: "Shuddha Panchami",
    morningAlankaram: "Sri Lalitha Tripura Sundari Devi",
    eveningTransition: "Sri Maha Saraswathi Devi (Moola Nakshatram)",
    deviName: "Sri Lalitha Tripura Sundari Devi",
    teluguDeviName: "శ్రీ లలితా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री ललिता त्रिपुरा सुंदरी देवी",
    colorName: "Bright Yellow / పసుపు / पीला",
    colorHex: "#EAB308",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-5-skandamata.jpg"),
    description: "The supreme empress of the Sri Chakra (Sri Yantra), seated on a divine lotus throne, personifying universal bliss, compassion, and sovereign grace.",
    whyWeCelebrate: "Devotees celebrate sacred Lalitha Panchami for family harmony, marital bliss (Sumangali / Soubhagyam). The Sri Chakra Navavarana Pooja & Lalitha Sahasranama Kumkumarchana & Suvasini Pooja are central rites.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ లలితా పరమేశ్వర్యై నమః",
      sloka: "సింధూరారుణ విగ్రహాం త్రినయనాం మాణిక్యమౌళిస్ఫురత్ | తారానాయక శేఖరాం స్మితముఖీం ఆపీనవక్షోరుహామ్ ||",
      recommendedStotram: "Sri Lalitha Sahasranama Stotram & Lalitha Trishati",
      bestChantingGuide: "Chanting Lalitha Sahasranama with fresh red kumkum or lotus petals brings profound mental peace and fulfills righteous desires."
    },
    suggestedOfferings: "Pesara Boorelu, Sweet Pongali, Pulihora, and Panchamrutham.",
    suggestedItems: "Red Kumkum, Turmeric roots, Lotus flowers, and Yellow silk vastram.",
    standardActivities: "Sri Chakra Navavarana Pooja, Lalitha Sahasranama Kumkumarchana, Suvasini Pooja, and Harathi.",
    significance: "Bestows family harmony, marital bliss, and sovereign spiritual grace.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Lalitha Tripura Sundari Devi",
      eveningAlankarana: "Sri Maha Saraswathi Devi (Moola Nakshatram)",
      sessionGuide: "Morning Sri Lalitha Tripura Sundari worship; evening transitions in preparation for sacred Moola Nakshatra Sri Maha Saraswathi Devi Pooja."
    }
  },
  {
    dayNumber: 6,
    date: "2026-10-16",
    tithi: "Shuddha Shashti (Moola Nakshatram)",
    morningAlankaram: "Sri Maha Saraswathi Devi",
    eveningTransition: "Sri Maha Lakshmi Devi (Prep for Day 7)",
    deviName: "Sri Maha Saraswathi Devi",
    teluguDeviName: "శ్రీ మహా సరస్వతీ దేవి",
    hindiDeviName: "श्री महा सरस्वती देवी",
    colorName: "Vedic Green / ఆకుపచ్చ / हरा",
    colorHex: "#16A34A",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-6-katyayani.jpg"),
    description: "Celebrated on sacred Moola Nakshatram holding the veena, book, and crystal rosary; the supreme goddess of wisdom, education, and fine arts.",
    whyWeCelebrate: "Celebrated on auspicious Moola Nakshatra (Devi's birth star). Aksharabhyasam & Pustaka Pooja (School & Children Initiation), Sri Maha Saraswathi Sangeetha Seva & Classical Bhajans are performed.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం వాగ్దేవ్యై చ విద్మహే కామరాజాయ ధీమహి | తన్నో దేవీ ప్రచోదయాత్ || (Saraswathi Gayatri)",
      sloka: "యా కుందేందు తుషారహారధవళా యా శుభ్రవస్త్రావృతా | యా వీణావరదండమండితకరా యా శ్వేతపద్మాసనా ||",
      recommendedStotram: "Saraswathi Ashtottara Shata Namavali & Saraswathi Stotram",
      bestChantingGuide: "Chant Ya Kundendu before studying. Placing books before Goddess Saraswathi and reciting 11 times boosts memory."
    },
    suggestedOfferings: "Daddojanam (Curd Rice), Bellam Payasam, White Laddu, and Honey with milk.",
    suggestedItems: "White/Yellow flowers, Slates, Notebooks, Pens for Aksharabhyasam, and White lotus.",
    standardActivities: "Aksharabhyasam, Pustaka Pooja, Sri Maha Saraswathi Sangeetha Seva, and Classical Bhajans.",
    significance: "Inspires wisdom, artistic eloquence, retentive memory, and blessings for students and scholars.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Maha Saraswathi Devi",
      eveningAlankarana: "Sri Maha Lakshmi Devi (Prep for Day 7)",
      sessionGuide: "Auspicious Moola Nakshatram Sri Maha Saraswathi Pooja & Aksharabhyasam; evening prep for Day 7 Sri Maha Lakshmi Devi."
    }
  },
  {
    dayNumber: 7,
    date: "2026-10-17",
    tithi: "Shuddha Saptami",
    morningAlankaram: "Sri Maha Lakshmi Devi",
    eveningTransition: "Sri Durga Devi (Prep for Day 8)",
    deviName: "Sri Maha Lakshmi Devi",
    teluguDeviName: "శ్రీ మహా లక్ష్మీ దేవి",
    hindiDeviName: "श्री महा लक्ष्मी देवी",
    colorName: "Sacred Ash / Grey / బూడిద రంగు / धूसर",
    colorHex: "#6B7280",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-7-kalaratri.jpg"),
    description: "The auspicious embodiment of Ashta Lakshmi (eight forms of wealth), bestowing prosperity, agricultural abundance, and royal fortune.",
    whyWeCelebrate: "Maha Lakshmi emerged from the cosmic ocean of milk. Devotees worship her with Sri Maha Lakshmi Sahasra Deeparadhana & Dhana Lakshmi & Dhanya Lakshmi Archana to remove poverty and bring sustainable wealth.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద శ్రీం హ్రీం శ్రీం ఓం మహాలక్ష్మ్యై నమః",
      sloka: "నమస్తేస్తు మహామాయే శ్రీపీఠే సురపూజితే | శంఖచక్ర గదాహస్తే మహాలక్ష్మి నమోస్తుతే ||",
      recommendedStotram: "Sri Suktam, Kanakadhara Stotram & Lakshmi Ashtakam",
      bestChantingGuide: "Chanting Sri Suktam and Kanakadhara Stotram at dusk invites Mahalakshmi's permanent auspicious presence."
    },
    suggestedOfferings: "Chakkara Pongali, Purnam Boorelu, Ksheerannam, and Dry Fruits Laddu.",
    suggestedItems: "Pink Lotus, Bilva leaves, Gold/Silver coins, Betel leaves, and Red vastram.",
    standardActivities: "Sri Maha Lakshmi Sahasra Deeparadhana, Dhana Lakshmi & Dhanya Lakshmi Archana, and Kumkumarchana.",
    significance: "Removes poverty and financial obstacles while inviting sustainable prosperity and peace.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Maha Lakshmi Devi",
      eveningAlankarana: "Sri Durga Devi (Prep for Day 8)",
      sessionGuide: "Morning Sri Maha Lakshmi Sahasra Deeparadhana; evening transitions with prep for Day 8 Sri Durga Devi."
    }
  },
  {
    dayNumber: 8,
    date: "2026-10-18",
    tithi: "Shuddha Ashtami (Durgashtami)",
    morningAlankaram: "Sri Durga Devi",
    eveningTransition: "Sri Mahishasura Mardhini Devi (Prep for Day 9)",
    deviName: "Sri Durga Devi",
    teluguDeviName: "శ్రీ దుర్గా దేవి",
    hindiDeviName: "श्री दुर्गा देवी",
    colorName: "Royal Purple / ఊదా / बैंगनी",
    colorHex: "#7E22CE",
    imageUrl: navaratriAsset("/navaratri/assets/durga-devi-alankarana.jpg"),
    description: "Worshipped on sacred Durgashtami as the mighty lion-rider; the universal warrior mother who protects righteousness and eliminates all hardships.",
    whyWeCelebrate: "Celebrated on sacred Maha Durgashtami with Chandi Parayanam & Sandhi Pooja (Midnight Sandhya). Mother Durga symbolizes the triumph of Dharma over Adharma, protecting devotees from adversities and fear.",
    sacredChanting: {
      moolaMantra: "ఓం దుం దుర్గాయై నమః (Om Dum Durgayai Namah)",
      sloka: "దుర్గే స్మృతా హరసి భీతిమశేషజంతోః | స్వస్థైః స్మృతా మతిమతీవ శుభాం దదాసి ||",
      recommendedStotram: "Sri Durga Kavacham, Devi Mahatmyam & Durga Ashtakam",
      bestChantingGuide: "Reciting Durga Kavacham on Durgashtami provides a spiritual shield safeguarding the home."
    },
    suggestedOfferings: "Kadambam, Garelu (Vada with ginger), Bellam Kudumulu, and Coconuts.",
    suggestedItems: "Red Oleander (Ganneru), Lemon garlands, Trishulam decor, and Red silk vastram.",
    standardActivities: "Maha Durgashtami Special Pooja, Chandi Parayanam, and Sandhi Pooja (Midnight Sandhya).",
    significance: "Destroys evil forces, bestows courage in difficult times, and safeguards devotees against adversity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Durga Devi",
      eveningAlankarana: "Sri Mahishasura Mardhini Devi (Prep for Day 9)",
      sessionGuide: "Durgashtami sacred Durga Pooja & Chandi Parayanam in morning; evening Sandhi Pooja transitions with prep for Day 9."
    }
  },
  {
    dayNumber: 9,
    date: "2026-10-19",
    tithi: "Shuddha Navami (Mahanavami)",
    morningAlankaram: "Sri Mahishasura Mardhini Devi / Sri Kalika Devi",
    eveningTransition: "Sri Raja Rajeshwari Devi (Prep for Vijaya Dashami)",
    deviName: "Sri Mahishasura Mardhini Devi / Sri Kalika Devi",
    teluguDeviName: "శ్రీ మహిషాసుర మర్దిని దేవి / శ్రీ కాళికా దేవి",
    hindiDeviName: "श्री महिषासुर मर्दिनी देवी / श्री कालिका देवी",
    colorName: "Peacock Green / నెమలి ఆకుపచ్చ / मोरपंखी हरा",
    colorHex: "#0F766E",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-9-siddhidatri.jpg"),
    description: "Celebrated on Maha Navami as the victorious warrior who slew the demon Mahishasura, and Sri Kalika Devi who dispels ignorance, negativity, and fear.",
    whyWeCelebrate: "On Maha Navami, Sri Kalika Devi Alankarana & Ayudha Pooja & Sri Mahishasura Mardhini Devi Maha Harathi are performed. Devotees also perform Ayudha Pooja, worshipping instruments and vehicles.",
    sacredChanting: {
      moolaMantra: "ఓం క్లీం కాళికాయై నమః | ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే",
      sloka: "అయి గిరినందిని నందితమేదిని విశ్వవినోదిని నందినుతే | గిరివరవింధ్య శిరోధినివాసిని విష్ణువిలాసిని జిష్ణునుతే ||",
      recommendedStotram: "Sri Mahishasura Mardhini Stotram & Kalika Ashtakam",
      bestChantingGuide: "Chanting Mahishasura Mardhini Stotram dispels fear, lethargy, and negative energies."
    },
    suggestedOfferings: "Allam Garelu, Tamarind Pulihora, Jaggery Sweet Pongali, and Whole Tender Coconut.",
    suggestedItems: "Kumkum, Red flowers, Lime garlands, Sandalwood, and Ayudha Pooja flowers.",
    standardActivities: "Sri Kalika Devi Alankarana, Ayudha Pooja, Sri Mahishasura Mardhini Devi Maha Harathi, and Maha Navami Chandi Homa.",
    significance: "Conquering internal enemies and celebrating the supreme triumph of righteousness.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Mahishasura Mardhini Devi / Sri Kalika Devi",
      eveningAlankarana: "Sri Raja Rajeshwari Devi (Prep for Vijaya Dashami)",
      sessionGuide: "Mahanavami Mahishasura Mardhini Alankarana & Ayudha Pooja; evening transitions with prep for Vijaya Dashami Sri Raja Rajeshwari Devi."
    }
  },
  {
    dayNumber: 10,
    date: "2026-10-20",
    tithi: "Shuddha Dashami (Vijaya Dashami)",
    morningAlankaram: "Sri Raja Rajeshwari Devi",
    eveningTransition: "Grand Shobhayatra / Nimarjanam",
    deviName: "Sri Raja Rajeshwari Devi",
    teluguDeviName: "శ్రీ రాజరాజేశ్వరి దేవి (విజయదశమి)",
    hindiDeviName: "श्री राजराजेश्वरी देवी (विजयदशमी)",
    colorName: "Royal Saffron / కాషాయం / केसरिया",
    colorHex: "#B45309",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-10-vijayadashami.jpg"),
    description: "The serene, all-compassionate mother seated on the imperial throne on Vijaya Dashami, bestowing peace, fulfillment, nobility, and ultimate victory.",
    whyWeCelebrate: "Vijaya Dashami (Dasara) — Sri Raja Rajeshwari Devi Rajabhishekam & Aparajita Pooja & Shami Pooja (Jammi Chettu) & Grand Shobhayatra / Nimarjanam. Devotees start new ventures on this most auspicious day.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ రాజరాజేశ్వర్యై నమః",
      sloka: "అంబా శాంభవి చంద్రమౌళి రబలా పర్ణా ఉమా పార్వతీ | కాళీ హైమవతీ శివా త్రినయనీ కాత్యాయనీ భైరవీ ||",
      recommendedStotram: "Sri Raja Rajeshwari Ashtakam & Aparajita Stotram",
      bestChantingGuide: "Recite during evening Shami Pooja when exchanging Jammi leaves with family and elders for lifelong success."
    },
    suggestedOfferings: "Jalebi, Bellam Appalu, Laddu, Chakkara Pongali, and Grand Maha Prasadam.",
    suggestedItems: "Jammi (Shami) leaves, Golden Yellow/Red silk vastram, Lotus flowers, and Sweets for distribution.",
    standardActivities: "Sri Raja Rajeshwari Devi Rajabhishekam, Aparajita Pooja, Shami Pooja (Jammi Chettu), and Grand Shobhayatra / Nimarjanam.",
    significance: "The celebration of total victory of good over evil, bringing success to new ventures.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Raja Rajeshwari Devi",
      eveningAlankarana: "Grand Shobhayatra / Nimarjanam",
      sessionGuide: "Vijaya Dashami Sri Raja Rajeshwari Devi Rajabhishekam & Aparajita Pooja; grand evening Shobhayatra & Nimarjanam."
    }
  }
];
