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
    whyWeCelebrate: `శ్రీ బాలా త్రిపుర సుందరి దేవి లలితా పరమేశ్వరి యొక్క 9 ఏళ్ల బాల్య స్వరూపం. బ్రహ్మాండ పురాణ లలితోపాఖ్యానం ప్రకారం, భండాసురుని సైన్యం లోకాలను పీడిస్తున్నప్పుడు, బాలాత్రిపుర సుందరి దేవి అమ్మవారి అనుజ్ఞ పొంది 'కర్ణీరథం' పై రణరంగంలోకి ప్రవేశించి, భండాసురుని 30 మంది కుమారులను (భండపుత్రులను) సంహరించి జగత్తును రక్షించింది.

నవరాత్రుల ప్రథమ దినాన ఘటస్థాపనతో ఈ అవతారాన్ని ఆరాధించడం వల్ల అజ్ఞానం, భయం మరియు మానసిక చంచలత్వం సమసిపోతాయి. అమ్మవారు బాల్యంలో ఉండాల్సిన స్వచ్ఛమైన అమాయకత్వం, తీక్షణమైన మేధాశక్తి (జ్ఞాపకశక్తి), వాక్శుద్ధి మరియు ఆధ్యాత్మిక జ్ఞానాన్ని ప్రసాదిస్తుంది. ఈ పవిత్ర దినాన 2 నుండి 9 సంవత్సరాల బాలికలను సాక్షాత్తు బాలా దేవిగా భావించి 'కన్యా పూజ' (కుమారి పూజ) నిర్వహించడం వల్ల వంశాభివృద్ధి, సమస్త శుభాలు చేకూరుతాయి.

Sri Bala Tripura Sundari Devi is the 9-year-old child manifestation of Supreme Mother Lalitha Tripura Sundari. According to the Brahmanda Purana, when the demon king Bhandasura threatened cosmic balance, Bala Devi sought Mother Lalitha's blessings, rode Her divine chariot into battle, and single-handedly eliminated Bhandasura's thirty demonic sons (Bhandaputras). Celebrated on Day 1 with Ghatasthapana, She personifies pure innocence, wisdom, and divine valor. Worshipping Bala Devi blesses devotees—especially children and students—with razor-sharp intellect (Medha Shakti), speech eloquence, fearlessness, and academic excellence. Devotees perform Kanya Pooja (Kumari Pooja) on this sacred day to invoke Mother's eternal grace.`,
    sacredChanting: {
      moolaMantra: "ఓం ఐం క్లీం సౌః సౌః క్లీం ఐం బాలాయై నమః (Om Aim Kleem Sauh Sauh Kleem Aim Balayai Namah)",
      sloka: "అరుణకిరణజాలై రంజితాశావకాశా | విధురజపపటీకా పుస్తకాభీష్టహస్తా ||",
      recommendedStotram: "Sri Bala Tripura Sundari Kavacham & Bala Sahasranama Stotram",
      bestChantingGuide: "Chanting the Bala Mantra 21 or 108 times at dawn boosts memory, concentration, and eliminates all fear."
    },
    suggestedOfferings: "Payasam, Ravva Kesari, Sugar candy (Kalkandu), Sweet milk, and Vadappappu (soaked moong dal with jaggery).",
    suggestedItems: "Jasmine flowers (Mallepulu), White Lotus, White/Yellow vastram, Sugarcane pieces, and Panchamrutham.",
    standardActivities: "Ghatasthapana, Suprabhatha Seva, Sri Bala Tripura Sundari Pooja, Kumkumarchana, and Kanya Pooja.",
    significance: "Invokes pure childhood innocence, photographic memory, and fearlessness; marks the auspicious beginning with Ghatasthapana and Kanya Pooja.",
    bathukammaDay: {
      dayNumber: 2,
      date: "2026-10-11",
      dayOfWeek: "ఆదివారం (Sunday)",
      teluguName: "అటుకుల బతుకమ్మ",
      englishName: "Atukula Bathukamma",
      description: "Offered with flattened rice (atukulu), jaggery, and boiled lentils along with vibrant seasonal flowers."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Bala Tripura Sundari Devi",
      eveningAlankarana: "Sri Gayatri Devi",
      sessionGuide: "Morning starts with Ghatasthapana and Suprabhatha Seva for Sri Bala Tripura Sundari Devi; in the evening, transitions into Gayatri Devi.",
      morningDetails: {
        deviName: "Sri Bala Tripura Sundari Devi",
        colorName: "Bright Yellow / పసుపు / पीला",
        colorHex: "#EAB308",
        saree: "Pitambaram / Bright Yellow Silk Pattu Saree with gold Zari border (పసుపు పట్టు చీర, స్వర్ణ జరీ అంచు)",
        ornaments: "Balika Kiritam (బాలికా కిరీటం), Pearl & Coral necklaces (ముత్యాల హారాలు, పగడాల దండలు), Akshamala (స్పటిక జపమాల), Pustakam (palm-leaf scriptures), and sweet sugarcane pieces"
      },
      eveningDetails: {
        deviName: "Sri Gayatri Devi",
        colorName: "Radiant Crimson & Orange / నారింజ-ఎరుపు",
        colorHex: "#EA580C",
        saree: "Crimson Red & Orange Kanchi Pattu Saree with temple zari borders (ఎరుపు & నారింజ కాంచీపురం పట్టు చీర)",
        ornaments: "Swarna Ratna Kiritam (రత్న కిరీటం), Shankham, Chakram, Gada, Padmam, Kamandalam, Kasula Peru, and Swarna Vaddanam (గోల్డెన్ వడ్డాణం)"
      }
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
    whyWeCelebrate: `శ్రీ గాయత్రీ దేవి సమస్త సనాతన ధర్మానికి మూలమైన నాలుగు వేదాలకు తల్లిగా పూజించబడే 'వేదమాత'. అమ్మవారి పంచముఖాలు పంచప్రాణాలు (ప్రాణ, అపాన, వ్యాన, ఉదాన, సమాన) మరియు పంచభూతాలకు ప్రతీకలు. 'గాయంతం త్రాయతే ఇతి గాయత్రీ' — అనగా భక్తిశ్రద్ధలతో తనను జపించే వారిని సర్వ ఆపదల నుంచి కాపాడే జగద్రక్షకి.

గాయత్రీ దేవి ఆరాధనతో సాధకులలోని అజ్ఞానపు చీకట్లు తొలగి బ్రహ్మతేజస్సు, మేధస్సు మరియు సద్బుద్ధి మేల్కొంటాయి. జన్మజన్మాంతరాల పాపాలు ప్రక్షాళనమై మానసిక ప్రశాంతత, ఉజ్వలమైన జ్ఞానం, ఆయురారోగ్యాలు చేకూరుతాయి. ఈ పవిత్ర దినాన గాయత్రీ మహామంత్ర జపం, గాయత్రీ హోమం మరియు వేద పారాయణ చేయడం ద్వారా ఆత్మశుద్ధి, ఏకాగ్రత మరియు కుటుంబ సౌభాగ్యం లభిస్తాయి.

Sri Gayatri Devi is revered across Sanatana Dharma as 'Vedamatha'—the primordial Mother of the Vedas and the embodiment of the sacred Gayatri Maha Mantra. Her five divine faces symbolize the Pancha Pranas (five vital life forces) and the Pancha Tattvas (five cosmic elements). The sacred scripture affirms: 'Gāyantaṁ trāyate iti Gāyatrī' (She who protects those who chant Her name). Worshipping Gayatri Devi purifies the mind, dispels ignorance (avidya), ignites spiritual intellect (Brahma Tejas), and neutralizes past karmas. Reciting the Gayatri Mantra 108 times at sunrise on this day bestows radiant clarity, longevity, physical vitality, and supreme inner peace.`,
    sacredChanting: {
      moolaMantra: "ఓం భూర్భువస్సువః | తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి | ధియో యో నః ప్రచోదయాత్ || (Gayatri Maha Mantra)",
      sloka: "ముక్తావిద్రుమ హేమనీల ధవళచ్ఛాయైర్ముఖైస్త్రీక్షణైః | యుక్తామిందునిబద్ధరత్నమకుటాం తత్త్వార్థవర్ణాత్మికామ్ ||",
      recommendedStotram: "Gayatri Sahasranama Stotram & Gayatri Kavacham",
      bestChantingGuide: "Chanting Gayatri Mantra 108 times during sunrise brings mental stillness, clarity, and radiant intellect."
    },
    suggestedOfferings: "Allam Garelu (Medu Vada), Coconut Rice, Sweet Boorelu, and Pulihora.",
    suggestedItems: "Red lotus, Hibiscus (Mandara), Sandalwood paste, Akshata, and pure cow ghee for deepam.",
    standardActivities: "Sri Gayatri Devi Veda Parayanam, Gayatri Japa, Gayatri Homa, and Sahasranama Deeparadhana.",
    significance: "Awakens Vedic intellect, mental clarity, and spiritual brilliance through Gayatri Maha Mantra, purifying past karmas.",
    bathukammaDay: {
      dayNumber: 3,
      date: "2026-10-12",
      dayOfWeek: "సోమవారం (Monday)",
      teluguName: "ముద్దపప్పు బతుకమ్మ",
      englishName: "Muddapappu Bathukamma",
      description: "Offered with cooked softened moong dal (muddapappu), milk, and jaggery."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Gayatri Devi",
      eveningAlankarana: "Sri Annapurna Devi",
      sessionGuide: "Morning worship dedicated to Goddess of Vedic wisdom and light; evening worship switches to Annapurna Devi.",
      morningDetails: {
        deviName: "Sri Gayatri Devi",
        colorName: "Auspicious Orange / నారింజ / नारंगी",
        colorHex: "#EA580C",
        saree: "Saffron Orange Silk Pattu Saree with grand Golden Zari pallu (కేసరి నారింజ రంగు పట్టు వస్త్రం, స్వర్ణ జరీ అంచు)",
        ornaments: "Panchamukha Swarna Kiritam (పంచముఖ రత్న కిరీటం), Kasula Haaram, Emerald & Ruby necklaces, holding Shankham, Chakram, Lotus, Rosary, and Kamandalam"
      },
      eveningDetails: {
        deviName: "Sri Annapurna Devi",
        colorName: "Golden Saffron / కుంకుమ పసుపు / केसरिया",
        colorHex: "#D97706",
        saree: "Golden Yellow & Rich Green border Pattu Saree (బంగారు పసుపు పట్టు చీర, పచ్చటి అంచు)",
        ornaments: "Swarna Kiritam, Navaratna Haaram, Golden Ladle (స్వర్ణ గరిటె / Akshaya Darvi) in right hand, Golden Vessel with ambrosial food (అమృత అన్నపాత్ర), and Jasmine garlands"
      }
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
    whyWeCelebrate: `శ్రీ అన్నపూర్ణా దేవి సకల జీవకోటికి అన్నాన్ని ప్రసాదించి పోషించే జగన్మాత. పౌరాణిక గాథ ప్రకారం, ఒకసారి కైలాసంలో పరమశివుడు 'జగత్తు మాయ' అని పలికినప్పుడు, ప్రకృతి సమతుల్యత దెబ్బతిని భూమిపై భయంకరమైన కరువు ఏర్పడింది. అప్పుడు పార్వతీదేవి కాశీ క్షేత్రంలో అన్నపూర్ణగా అవతరించి సర్వజీవులకు అమృతాన్నాన్ని ప్రసాదించింది. సాక్షాత్తు పరమశివుడే 'భిక్షాం దేహి కృపావలంబనకరీ' అంటూ జోలె పట్టి అమ్మవారి వద్ద భిక్షను స్వీకరించాడు.

ఆధ్యాత్మిక ముక్తికి ప్రాణాధారమైన శరీర పోషణ ఎంత ప్రాముఖ్యమైనదో ఈ అవతారం తెలియజేస్తుంది. అన్నపూర్ణా దేవిని ఆరాధించడం వల్ల ఇళ్లలో ఎన్నటికీ అన్నవస్త్రాలకు లోటు ఉండదు (అక్షయ పాత్ర సిద్ధిస్తుంది). ఈ రోజున అమ్మవారికి పాయసం, క్షీరాన్నం సమర్పించి, పేదలకు మరియు భక్తులకు స్వచ్ఛందంగా అన్నదానం చేయడం వల్ల సమస్త పాపాలు హరించి అక్షయ పుణ్యం లభిస్తుంది.

Sri Annapurna Devi is the eternal mother of Kasi Kshetram and the supreme provider of nourishment holding a golden ladle and bowl filled with ambrosial food. When Lord Shiva playfully declared the material world to be maya, nature withdrew its nourishment, causing famine across the earth. Parvati Devi then manifested in Kasi as Annapurna to feed every living being. Lord Shiva Himself approached Her as a mendicant with a begging bowl, affirming that physical nourishment is sacred and essential for spiritual pursuit. Worshipping Annapurna Devi ensures perpetual food abundance (Akshaya Patra), banishes poverty and hunger, and fosters inner contentment. Organizing Maha Annadanam on this day bestows boundless merit.`,
    sacredChanting: {
      moolaMantra: "ఓం హ్రీం శ్రీం క్లీం భగవత్యై అన్నపూర్ణాయై నమః (Om Hreem Shreem Kleem Bhagavatyai Annapurnayai Namah)",
      sloka: "నిత్యానందకరీ వరాభయకరీ సౌందర్యరత్నాకరీ | నిర్ధూతాఖిలఘోరపావనకరీ ప్రత్యక్షమాహేశ్వరీ ||",
      recommendedStotram: "Sri Annapurna Ashtakam (by Adi Shankaracharya)",
      bestChantingGuide: "Recite Annapurna Ashtakam before preparing meals to invoke the divine blessing of perpetual abundance (Akshaya Patra)."
    },
    suggestedOfferings: "Ksheerannam (Paramannam), Sweet Pongali, Dal Vadas, and Maha Annadanam meal distribution.",
    suggestedItems: "Navadhanyalu (nine sacred grains), Rice grains, Fresh harvest fruits, and Yellow flowers.",
    standardActivities: "Sri Annapurna Devi Golden Ladle Pooja, Maha Annadanam, and Ksheerannam Distribution.",
    significance: "Bestows boundless sustenance, food abundance (Akshaya Patra), and family fulfillment; celebrated with Maha Annadanam.",
    bathukammaDay: {
      dayNumber: 4,
      date: "2026-10-13",
      dayOfWeek: "మంగళవారం (Tuesday)",
      teluguName: "నానబియ్యం బతుకమ్మ",
      englishName: "Nanabiyyam Bathukamma",
      description: "Offered with soaked rice (nanabiyyam) mixed with jaggery or sugar."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Annapurna Devi",
      eveningAlankarana: "Sri Maha Chandi Devi",
      sessionGuide: "Morning focuses on nourishment and grace; evening shifts to the formidable form of Maha Chandi Devi to destroy negativity.",
      morningDetails: {
        deviName: "Sri Annapurna Devi",
        colorName: "Golden Saffron / కుంకుమ పసుపు / केसरिया",
        colorHex: "#D97706",
        saree: "Pure Golden Yellow Silk Saree adorned with Navadhanyam and fresh floral borders (బంగారు పసుపు పట్టు చీర, తాజా పుష్పాలంకరణ)",
        ornaments: "Swarna Kiritam, Golden ladle (స్వర్ణ దర్వి), Golden bowl of nectarous food (స్వర్ణ అన్నపాత్ర), Navaratna Vaddanam, and pearl necklaces"
      },
      eveningDetails: {
        deviName: "Sri Maha Chandi Devi",
        colorName: "Fiery Crimson Red / ఎరుపు / गहरा लाल",
        colorHex: "#DC2626",
        saree: "Fiery Dark Red Silk Saree with heavy golden temple border (గాఢమైన ఎరుపు పట్టు చీర, స్వర్ణ రత్న అంచు)",
        ornaments: "Veera Kiritam (వీర కిరీటం), Trishulam (శూలం), Khadgam (తీవ్ర ఖడ్గం), Khethaka (shield), Dhanus, Baanam, Lemon garland (నిమ్మకాయల హారం), and Kasula Peru"
      }
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
    whyWeCelebrate: `శ్రీ మహా చండీ దేవి దుష్టశిక్షణ, శిష్టరక్షణ కోసం త్రిమూర్తులు మరియు సకల దేవతల దివ్య తేజస్సుల కలయికతో ఆవిర్భవించిన అత్యంత శక్తివంతమైన రణదేవత. దేవీ మాహాత్మ్యం (దుర్గా సప్తశతి) ప్రకారం, చండ, ముండ, రక్తాక్షాది భయంకర రాక్షసులను సంహరించడానికి జగన్మాత ఈ ఉగ్రరూపాన్ని ధరించింది. అమ్మవారు చేతిలో పదునైన ఖడ్గం, శూలం, చక్రం ధరించి అధర్మాన్ని కూకటివేళ్ళతో పెకలించివేస్తుంది.

చండీ దేవి కేవలం బాహ్య శత్రువులనే కాక, మన అంతరంగంలో దాగి ఉన్న కామ, క్రోధ, లోభ, మోహ, మద, మాత్సర్యాలనే అరిషడ్వర్గాలను సంహరిస్తుంది. ఈ దినాన చండీ నవాక్షరీ మంత్ర జపం, చండీ పారాయణం మరియు చండీ హోమం నిర్వహించడం వల్ల శత్రు బాధలు, రాహు-కేతు గ్రహ దోషాలు, నరదిష్టి, ప్రమాద భయాలు తొలగిపోయి అద్భుతమైన ఆత్మవిశ్వాసం, విజయం మరియు దివ్య రక్షణ లభిస్తాయి.

Sri Maha Chandi Devi is the invincible warrior embodiment of the Supreme Mother, forged from the concentrated effulgence of Brahma, Vishnu, Shiva, and all the celestial devas. In the Devi Mahatmyam (Durga Saptashati), She arose to annihilate formidable demon generals including Chanda, Munda, and Raktabija. Armed with celestial weaponry, She ruthlessly eradicates darkness and re-establishes cosmic righteousness. Beyond external battles, Maha Chandi conquers the internal demons of ego, anger, lust, greed, and envy. Chanting the Chandi Navakshari Mantra, reading the Saptashati, and performing Chandi Homa on this day dissolves malefic planetary influences (Rahu-Ketu doshas), eliminates negative energies, and instills unshakeable moral courage.`,
    sacredChanting: {
      moolaMantra: "ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే (Chandi Navakshari Mantra)",
      sloka: "సర్వమంగళమాంగళ్యే శివే సర్వార్థసాధికే | శరణ్యే త్ర్యంబకే గౌరి నారాయణి నమోస్తుతే ||",
      recommendedStotram: "Devi Mahatmyam / Sri Durga Saptashati & Chandi Kavacham",
      bestChantingGuide: "Reciting Chandi Navakshari Mantra with pure devotion dissolves deep anxieties and wards off negativity."
    },
    suggestedOfferings: "Garelu (Vada with ginger), Kadambam, Bellam Appalu, and Lemon Naivedhyam.",
    suggestedItems: "Red silk vastram, Red oleander (Ganneru), Bilva patra, Kumkum, and Lemon garland.",
    standardActivities: "Sri Maha Chandi Pooja, Chandi Parayanam, Kumkumarchana, and Rahu Kala Deeparadhana.",
    significance: "Vanquishes negative energies, Rahu-Ketu doshas, and internal foes (Arishadvargas); grants courage and protection.",
    bathukammaDay: {
      dayNumber: 5,
      date: "2026-10-14",
      dayOfWeek: "బుధవారం (Wednesday)",
      teluguName: "అట్ల బతుకమ్మ",
      englishName: "Atla Bathukamma",
      description: "Offered with mini traditional dosas / crepes (atlu)."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Maha Chandi Devi",
      eveningAlankarana: "Sri Lalitha Tripura Sundari Devi",
      sessionGuide: "Morning continues with fierce Chandi form; evening transitions to royal, benevolent Lalitha Tripura Sundari.",
      morningDetails: {
        deviName: "Sri Maha Chandi Devi",
        colorName: "Fiery Crimson Red / రక్త వర్ణం",
        colorHex: "#DC2626",
        saree: "Radiant Blood Red Silk Pattu Saree with auspicious gold borders (ఎరుపు రంగు పట్టు వస్త్రం, రక్త చందన తిలకం)",
        ornaments: "Golden Crown with crescent moon, 10 divine weapons (Trishulam, Sword, Discus, Bow & Arrow, Conch), Lemon garlands, and heavy gold waist-belt (వడ్డాణం)"
      },
      eveningDetails: {
        deviName: "Sri Lalitha Tripura Sundari Devi",
        colorName: "Royal Magenta & Gold / రాణి పింక్ & బంగారం",
        colorHex: "#CA8A04",
        saree: "Royal Rani Pink / Magenta Pattu Saree with gold zari brocade (రాణి పింక్ & మామిడిపిందె రంగు పట్టు చీర, బంగారు జరీ)",
        ornaments: "Ratna Kiritam with Chandra Kala, Sugarcane bow (చెరకుగడ ధనుస్సు), Five flower arrows (పంచ బాణాలు), Pasha, Ankusha, and Diamond Mangalasutram"
      }
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
    whyWeCelebrate: `శ్రీ లలితా త్రిపుర సుందరి దేవి సమస్త జగత్తులను పాలించే పరాభట్టారిక మరియు శ్రీచక్ర అధిష్ఠాన దేవత. లలితోపాఖ్యానం ప్రకారం, సకల లోకాలను అల్లకల్లోలం చేసిన భండాసురుని సంహరించడానికి దేవతలు చేసిన 'మహా చిదగ్ని' యజ్ఞ కుండం నుంచి సాక్షాత్తు పరమేశ్వరిగా అమ్మవారు ఆవిర్భవించింది. చెరకుగడ ధనుస్సు (మనస్సు), పంచ పుష్పబాణాలు (పంచతన్మాత్రలు), పాశం (రాగం), అంకుశం (క్రోధం) ధరించి కామేశ్వర సమేతంగా శ్రీచక్ర సింహాసనంపై కొలువై ఉంటుంది.

లలితా పంచమి నాడు అమ్మవారిని శ్రీచక్ర నవావరణ పూజ, లలితా సహస్రనామ కుంకుమార్చనలతో పూజించడం వల్ల గృహంలో కలహాలు తొలగిపోయి దాంపత్య సౌఖ్యం, వంశాభివృద్ధి, సంపూర్ణ మానసిక శాంతి లభిస్తాయి. సాధకులకు కుండలినీ శక్తి జాగృతమై ఉన్నతమైన ఆధ్యాత్మిక స్థితి చేకూరుతుంది. ఈ పూజ సమస్త వాస్తు దోషాలను నివారించి ఐశ్వర్యాన్ని, రాజయోగాలను ప్రసాదిస్తుంది.

Sri Lalitha Tripura Sundari Devi is the Sovereign Empress of the Universe (Raja Rajeshwari) and the presiding deity of the sacred Sri Yantra (Sri Chakra). According to the Lalitopakhyana, when the demon Bhandasura conquered the realms of gods, the devas performed the supreme sacrifice, from whose 'Chidagni Kunda' (sacrificial altar of Pure Consciousness) Mother Lalitha manifested in radiant majesty. Seated on the Sri Chakra, She holds the sugarcane bow (the mind), five floral arrows (the senses), the noose (love), and the goad (discernment). Worshipping Her on Lalitha Panchami with Sri Chakra Navavarana Pooja and Lalitha Sahasranama Kumkumarchana brings deep marital harmony, peace, prosperity, and spiritual awakening.`,
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ లలితా పరమేశ్వర్యై నమః",
      sloka: "సింధూరారుణ విగ్రహాం త్రినయనాం మాణిక్యమౌళిస్ఫురత్ | తారానాయక శేఖరాం స్మితముఖీం ఆపీనవక్షోరుహామ్ ||",
      recommendedStotram: "Sri Lalitha Sahasranama Stotram & Lalitha Trishati",
      bestChantingGuide: "Chanting Lalitha Sahasranama with fresh red kumkum or lotus petals brings profound mental peace and family harmony."
    },
    suggestedOfferings: "Pesara Boorelu, Sweet Pongali, Pulihora, and Panchamrutham.",
    suggestedItems: "Red Kumkum, Turmeric roots, Lotus flowers, and Yellow/Red silk vastram.",
    standardActivities: "Sri Chakra Navavarana Pooja, Lalitha Sahasranama Kumkumarchana, Suvasini Pooja, and Harathi.",
    significance: "Confers royal grace, marital harmony, and spiritual elevation through Sri Chakra Navavarana Pooja on Lalitha Panchami.",
    bathukammaDay: {
      dayNumber: 6,
      date: "2026-10-15",
      dayOfWeek: "గురువారం (Thursday)",
      teluguName: "అలిగిన బతుకమ్మ",
      englishName: "Aligina Bathukamma",
      description: "A day of quiet reverence where Goddess Bathukamma is traditionally believed to rest."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Lalitha Tripura Sundari Devi",
      eveningAlankarana: "Sri Saraswati Devi",
      sessionGuide: "Morning centers on royal splendor and harmony; evening transitions into sacred Saraswati Alankaram ahead of Moola Nakshatram.",
      morningDetails: {
        deviName: "Sri Lalitha Tripura Sundari Devi",
        colorName: "Royal Gold / బంగారు పసుపు / सुनहरा पीला",
        colorHex: "#CA8A04",
        saree: "Heavy Kanchi Pattu Golden Silk Saree with red border (బంగారు జరీ కాంచీపురం పట్టు చీర, ఎరుపు అంచు)",
        ornaments: "Manikya Kiritam (మాణిక్య కిరీటం), Sugarcane bow (ఇక్షు ధనుస్సు), 5 floral arrows, Pasha, Ankusha, seated on Sri Chakra with diamond necklaces and Lakshmi Kasula Haaram"
      },
      eveningDetails: {
        deviName: "Sri Saraswati Devi",
        colorName: "Pure White & Vedic Green / శ్వేతం & ఆకుపచ్చ",
        colorHex: "#16A34A",
        saree: "Spotless White Silk Saree with Vedic green and gold border (పరిశుద్ధ శ్వేత పట్టు చీర, ఆకుపచ్చ/బంగారు అంచు)",
        ornaments: "Swarna Mukutam, Celestial Veena (దివ్య వీణ), Akshamala (స్పటిక జపమాల), Pustakam (Veda grantham), Pearl necklace (ముత్యాల హారం), and white lotus flowers"
      }
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
    whyWeCelebrate: `శ్రీ సరస్వతీ దేవి జ్ఞానానికి, విద్యకు, వాక్కుకు మరియు సకల లలిత కళలకు అధిదేవత. శరన్నవరాత్రులలో 'మూలా నక్షత్రం' ఇంద్రకీలాద్రి కనకదుర్గమ్మ జన్మ నక్షత్రం కావడంతో ఈ రోజుకు అత్యంత విశిష్టమైన ప్రాధాన్యత ఉంది. తెల్లటి పద్మాసనంపై ఆసీనురాలై చేతిలో వీణ (నాదబ్రహ్మ ప్రతీక), పుస్తకం (వేద విజ్ఞానం), స్పటిక మాల (ఏకాగ్రత) ధరించి బ్రహ్మజ్ఞాన ప్రదాయినిగా దర్శనమిస్తుంది.

ఈ పవిత్ర దినాన చిన్నారులకు విద్యాభ్యాసాన్ని ప్రారంభించే 'అక్షరాభ్యాసం' చేయించడం తరతరాల సంప్రదాయం. విద్యార్థులు, ఉపాధ్యాయులు, కళాకారులు తమ పుస్తకాలను, సంగీత వాయిద్యాలను అమ్మవారి పాదాల వద్ద ఉంచి 'పుస్తక పూజ' నిర్వహిస్తారు. సరస్వతీ దేవిని ఆరాధించడం వల్ల అజ్ఞానమనే చీకటి తొలగిపోయి అమోఘమైన జ్ఞాపకశక్తి, వాక్శుద్ధి, విద్యా రంగంలో అత్యున్నత విజయాలు, వివేకం లభిస్తాయి.

Sri Saraswati Devi is the divine goddess of supreme learning, intellect, music, and the fine arts. In the Vijayawada Dasara tradition, 'Moola Nakshatram' is celebrated as the sacred birth star (Janma Nakshatram) of Mother Kanaka Durga, attracting lakhs of devotees. Clad in spotless white seated on a white lotus, She holds the sacred scriptures, the crystal Japamala, and strums the divine Veena symbolizing cosmic harmony (Nada Brahma). This day is auspicious for 'Aksharabhyasam' (initiating children into the alphabet and education) and 'Pustaka Pooja' (blessing of books and academic tools). Worshipping Saraswati Devi removes ignorance, bestows photographic memory, eloquence, and paves the path to academic and scholarly distinction.`,
    sacredChanting: {
      moolaMantra: "ఓం ఐం వాగ్దేవ్యై చ విద్మహే కామరాజాయ ధీమహి | తన్నో దేవీ ప్రచోదయాత్ || (Saraswathi Gayatri)",
      sloka: "యా కుందేందు తుషారహారధవళా యా శుభ్రవస్త్రావృతా | యా వీణావరదండమండితకరా యా శ్వేతపద్మాసనా ||",
      recommendedStotram: "Saraswathi Ashtottara Shata Namavali & Saraswathi Stotram",
      bestChantingGuide: "Chant Ya Kundendu before studying. Placing books before Goddess Saraswathi and reciting 11 times boosts memory."
    },
    suggestedOfferings: "Daddojanam (Curd Rice), Bellam Payasam, White Laddu, and Honey with milk.",
    suggestedItems: "White/Yellow flowers, Slates, Notebooks, Pens for Aksharabhyasam, and White lotus.",
    standardActivities: "Aksharabhyasam, Pustaka Pooja, Sri Saraswati Sangeetha Seva, and Classical Bhajans.",
    significance: "Sacred birth star of Kanaka Durga; grants academic excellence, speech eloquence (Vak Siddhi), and wisdom with Aksharabhyasam.",
    bathukammaDay: {
      dayNumber: 7,
      date: "2026-10-16",
      dayOfWeek: "శుక్రవారం (Friday)",
      teluguName: "వేపకాయల బతుకమ్మ",
      englishName: "Vepakayala Bathukamma",
      description: "Offered with neem-seed-shaped rice flour sweets fried in ghee."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Saraswati Devi",
      eveningAlankarana: "Sri Maha Lakshmi Devi",
      sessionGuide: "Moola Nakshatram most auspicious for students seeking wisdom (Aksharabhyasam); evening form changes to Maha Lakshmi Devi.",
      morningDetails: {
        deviName: "Sri Saraswati Devi",
        colorName: "Pure White / శ్వేత వర్ణం / श्वेत",
        colorHex: "#16A34A",
        saree: "Pure White Kanchi Silk Pattu Saree adorned with silver/gold threads (స్వచ్ఛమైన శ్వేత పట్టు చీర, వెండి-బంగారు జరీ అంచు)",
        ornaments: "Diamond-studded Swarna Kiritam, Divine Veena (స్వర్ణ వీణ), Palm-leaf scriptures (తాళపత్ర గ్రంథం), Crystal Rosary (స్పటిక మాల), Pearl Haram, seated on white lotus"
      },
      eveningDetails: {
        deviName: "Sri Maha Lakshmi Devi",
        colorName: "Grand Rose Magenta & Gold / గులాబీ-బంగారు రంగు",
        colorHex: "#6B7280",
        saree: "Rich Deep Magenta or Golden Silk Saree with broad temple zari borders (ఘనమైన మెజెంటా/బంగారు పట్టు చీర)",
        ornaments: "Swarna Makuta Kiritam, Golden Lotuses in two hands, Abhaya & Varada mudras showering gold coins (స్వర్ణ వర్ష ముద్ర), Kasula Peru, and Swarna Vaddanam"
      }
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
    whyWeCelebrate: `శ్రీ మహా లక్ష్మీ దేవి సకల జగత్తుల పోషకుడైన శ్రీమహావిష్ణువు దేవేరి మరియు సమస్త సంపదలకు, సౌభాగ్యానికి అధిదేవత. దేవాసురులు క్షీరసాగరాన్ని మథించినప్పుడు అమృతం కంటే ముందుగా స్వచ్ఛమైన బంగారు పద్మంలో జగన్మాత ఆవిర్భవించింది. లక్ష్మీదేవి కేవలం ధన ప్రదాత మాత్రమే కాదు; ధన, ధాన్య, ధైర్య, శౌర్య, విజయ, విద్య, సంతాన, గజలక్ష్మి అనే 'అష్టలక్ష్మి' రూపాలతో సర్వ సంపదలను ప్రసాదిస్తుంది.

శరన్నవరాత్రుల సప్తమి నాడు శ్రీ మహాలక్ష్మిని సహస్ర దీపారాధనతో, శ్రీసూక్తం మరియు కనకధారా స్తోత్రాలతో అర్చించడం వల్ల అప్పుల బాధలు, దారిద్య్రం, వ్యాపార నష్టాలు సమసిపోతాయి. ఇళ్లలో మరియు కార్యాలయాలలో శాశ్వత లక్ష్మీ కటాక్షం, ధనధాన్యాల సమృద్ధి, మానసిక సంతృప్తి మరియు మంగళకరమైన వాతావరణం సిద్ధిస్తాయి.

Sri Maha Lakshmi Devi is the divine consort of Lord Maha Vishnu and the eternal embodiment of cosmic wealth, auspiciousness, and abundance. She manifested from the cosmic churning of the Ocean of Milk (Ksheera Sagara Mathanam), seated majestically on a blooming lotus. As Ashta Lakshmi, She governs eight cosmic facets of prosperity: food grains, spiritual wealth, moral courage, lineage, triumph, knowledge, royalty, and material fortune. Worshipping Maha Lakshmi on Saptami with Sahasra Deeparadhana (lighting thousands of ghee lamps) and reciting Sri Suktam or Kanakadhara Stotram banishes poverty, debt, and misfortune, filling homes and enterprises with lasting peace, financial stability, and divine grace.`,
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద శ్రీం హ్రీం శ్రీం ఓం మహాలక్ష్మ్యై నమః",
      sloka: "నమస్తేస్తు మహామాయే శ్రీపీఠే సురపూజితే | శంఖచక్ర గదాహస్తే మహాలక్ష్మి నమోస్తుతే ||",
      recommendedStotram: "Sri Suktam, Kanakadhara Stotram & Lakshmi Ashtakam",
      bestChantingGuide: "Chanting Sri Suktam and Kanakadhara Stotram at dusk invites Mahalakshmi's permanent auspicious presence."
    },
    suggestedOfferings: "Chakkara Pongali, Purnam Boorelu, Ksheerannam, and Dry Fruits Laddu.",
    suggestedItems: "Pink Lotus, Bilva leaves, Gold/Silver coins, Betel leaves, and Red vastram.",
    standardActivities: "Sri Maha Lakshmi Sahasra Deeparadhana, Dhana Lakshmi & Dhanya Lakshmi Archana, and Kumkumarchana.",
    significance: "Eradicates financial distress and debts; invites Ashta Lakshmi blessings, prosperity, and peace through Sahasra Deeparadhana.",
    bathukammaDay: {
      dayNumber: 8,
      date: "2026-10-17",
      dayOfWeek: "శనివారం (Saturday)",
      teluguName: "వెన్నముద్దల బతుకమ్మ",
      englishName: "Vennamuddala Bathukamma",
      description: "Offered with fresh butter balls (vennamuddalu) and jaggery."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Maha Lakshmi Devi",
      eveningAlankarana: "Sri Durga Devi",
      sessionGuide: "Morning honors abundance and auspiciousness; evening shifts to Durga Devi as Durgashtami approaches.",
      morningDetails: {
        deviName: "Sri Maha Lakshmi Devi",
        colorName: "Sacred Ash / Grey & Rose Gold / బూడిద రంగు & గులాబీ",
        colorHex: "#6B7280",
        saree: "Royal Grey/Silver or Auspicious Pink Silk Pattu Saree with gold woven motifs (సిల్వర్ గ్రే లేదా గులాబీ పట్టు చీర, బంగారు జరీ బుట్టాలు)",
        ornaments: "Ashta Lakshmi Swarna Kiritam, Golden Lotuses (స్వర్ణ పద్మాలు), Kamandalam, Abhaya-Varada hastas, Kasula Haaram, Emerald Padakam, and Gold coin garlands"
      },
      eveningDetails: {
        deviName: "Sri Durga Devi",
        colorName: "Royal Purple & Fiery Red / ఊదా & ఎరుపు",
        colorHex: "#7E22CE",
        saree: "Royal Purple Silk Pattu Saree with bold Crimson Red border (ఊదా రంగు పట్టు చీర, ఎరుపు రంగు కుంభం అంచు)",
        ornaments: "Veera Makutam, Trishulam, Shankha, Chakra, Gada, Khadga, Bow & Arrows, resting atop the Simha Vahanam (సింహ వాహనం), Lemon garlands, and gold armlets"
      }
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
    whyWeCelebrate: `శ్రీ దుర్గా దేవి 'దుర్గతి నాశిని' — అంటే భక్తుల సమస్త కష్టాలను, ఆపదలను, దుఃఖాలను సమూలంగా రూపుమాపే సాక్షాత్తు పరాశక్తి. దుర్గాష్టమి నాడు అమ్మవారు సింహవాహనారూఢురాలై, దేవతలందరూ సమర్పించిన దివ్యాయుధాలను ధరించి వీరరస స్వరూపిణిగా దర్శనమిస్తుంది. అష్టమి మరియు నవమి తిథుల కలయికగా వచ్చే పవిత్ర 'సంధికాలం' లో జగన్మాత చాముండా దేవిగా ఆవిర్భవించి చండ, ముండులనే రాక్షస నాయకులను సంహరించింది.

గ్రహదోషాలు, దీర్ఘకాలిక అనారోగ్యాలు, కోర్టు వివాదాలు, శత్రుపీడల నుంచి విముక్తి పొందడానికి దుర్గాష్టమి పూజ అత్యంత ఫలప్రదమైనది. ఈ పుణ్యదినాన దుర్గా సప్తశతి పారాయణం, దుర్గా కవచ జపం చేసి, అమ్మవారికి ఎర్రటి పుష్పాలు మరియు నిమ్మకాయల దండలు సమర్పించడం వల్ల ఇళ్లకు అభేద్యమైన రక్షా కవచం ఏర్పడి, భయాలు తొలగి అద్భుతమైన విజయం లభిస్తుంది.

Sri Durga Devi is the cosmic vanquisher of hardships and distress ('Durgati Nashini'). Worshipped on holy Maha Durgashtami mounted upon a golden lion, She holds celestial weapons gifted by the Trimurtis and all Gods. During the climactic 'Sandhi Kala'—the auspicious intersection between Ashtami and Navami—the Mother manifested as Chamunda to annihilate the dreaded demons Chanda and Munda. Worshipping Durga Devi on this day dissolves stubborn planetary afflictions, dispels fears of premature adversity, and breaks chronic obstacles. Chanting Sri Durga Kavacham and offering bilva leaves and lemon garlands establishes a powerful spiritual shield of divine protection (Raksha) over one's family and home.`,
    sacredChanting: {
      moolaMantra: "ఓం దుం దుర్గాయై నమః (Om Dum Durgayai Namah)",
      sloka: "దుర్గే స్మృతా హరసి భీతిమశేషజంతోః | స్వస్థైః స్మృతా మతిమతీవ శుభాం దదాసి ||",
      recommendedStotram: "Sri Durga Kavacham, Devi Mahatmyam & Durga Ashtakam",
      bestChantingGuide: "Reciting Durga Kavacham on Durgashtami provides an invincible spiritual shield safeguarding the home."
    },
    suggestedOfferings: "Kadambam, Garelu (Vada with ginger), Bellam Kudumulu, and Coconuts.",
    suggestedItems: "Red Oleander (Ganneru), Lemon garlands, Trishulam decor, and Red silk vastram.",
    standardActivities: "Maha Durgashtami Special Pooja, Chandi Parayanam, and Sandhi Pooja (Midnight Sandhya).",
    significance: "Invincible warrior protection mounted on lion; dissolves chronic obstacles and shields families through Durga Kavacham.",
    bathukammaDay: {
      dayNumber: 9,
      date: "2026-10-18",
      dayOfWeek: "ఆదివారం (Sunday)",
      teluguName: "సద్ధుల బతుకమ్మ (మహా బతుకమ్మ)",
      englishName: "Saddula Bathukamma (Maha Bathukamma)",
      description: "Grand culmination of Telangana Bathukamma with five varieties of spiced rice (saddulu) and flower immersions."
    },
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Durga Devi",
      eveningAlankarana: "Sri Mahishasura Mardhini Devi",
      sessionGuide: "Morning dedicated to warrior form mounted on lion; evening transitions into fiercest form, Mahishasura Mardhini, preparing for final battle.",
      morningDetails: {
        deviName: "Sri Durga Devi",
        colorName: "Royal Purple & Red / ఊదా / बैंगनी",
        colorHex: "#7E22CE",
        saree: "Brilliant Purple and Crimson Silk Pattu Saree with gold temple borders (దివ్యమైన ఊదా & రక్తవర్ణ పట్టు చీర)",
        ornaments: "Simha Vahanam decor, 8 Celestial divine weapons (Trishulam, Sword, Discus, Mace, Conch, Bow, Arrow, Shield), Trishula tilakam, lemon garlands, and gold breastplate (కవచం)"
      },
      eveningDetails: {
        deviName: "Sri Mahishasura Mardhini Devi",
        colorName: "Peacock Green / Forest Green / నెమలి పింఛం ఆకుపచ్చ",
        colorHex: "#0F766E",
        saree: "Emerald Peacock Green Silk Saree with blood-red border (నెమలి ఆకుపచ్చ పట్టు చీర, ఎరుపు అంచు)",
        ornaments: "Raudra Veera Kiritam, Long Golden Trident (మహా త్రిశూలం) pinning the demon buffalo, 18 celestial weapons, skull/lemon garland, and diamond armlets"
      }
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
    whyWeCelebrate: `శ్రీ మహిషాసుర మర్దిని దేవి అధర్మంపై ధర్మం సాధించిన అమోఘ విజయానికి ప్రతీక. బ్రహ్మదేవుని వరాలతో గర్వించి ముల్లోకాలను అతలాకుతలం చేసిన మహిషాసురుడనే రాక్షస రాజును సంహరించడానికి జగన్మాత ఈ రౌద్ర వీర రూపంలో అవతరించింది. తొమ్మిది రోజుల అహోరాత్రుల తీవ్ర యుద్ధం అనంతరం, మహార్నవమి నాడు అమ్మవారు తన దివ్య త్రిశూలంతో మహిషాసురుని వక్షస్థలాన్ని చీల్చి లోకకళ్యాణాన్ని సాధించింది.

ఈ రోజున సనాతన సంప్రదాయంలో 'ఆయుధ పూజ' (శస్త్ర పూజ) అత్యంత వైభవంగా నిర్వహిస్తారు. మానవ జీవనోపాధికి మరియు దేశ రక్షణకు తోడ్పడే వాహనాలు, యంత్రాలు, కంప్యూటర్లు, పనిముట్లను దైవత్వంతో పూజిస్తారు. మహిషాసుర మర్దిని స్తోత్ర పారాయణం చేయడం వల్ల ఆత్మన్యూనత, బద్ధకం, అంతర్గత భయాలు నశించి, జీవితంలోని క్లిష్టమైన సవాళ్లపై సంపూర్ణ విజయం లభిస్తుంది.

Sri Mahishasura Mardhini Devi personifies the supreme victory of cosmic righteousness (Dharma) over tyranny and injustice. Empowered by divine boons, the buffalo-demon king Mahishasura drove the devas from heaven and terrorized creation. The Divine Mother manifested as an 18-armed warrior, armed with the weapons of all divinities. After nine days of relentless battle, on Maha Navami, She pinned Mahishasura beneath Her foot and vanquished him with Her divine trident (Trishulam). This day is revered with 'Ayudha Pooja'—worshipping machines, tools, vehicles, books, and implements of livelihood. Chanting the Mahishasura Mardhini Stotram dispels inertia, fear, and negativity, assuring victory in all righteous struggles.`,
    sacredChanting: {
      moolaMantra: "ఓం క్లీం కాళికాయై నమః | ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే",
      sloka: "అయి గిరినందిని నందితమేదిని విశ్వవినోదిని నందినుతే | గిరివరవింధ్య శిరోధినివాసిని విష్ణువిలాసిని జిష్ణునుతే ||",
      recommendedStotram: "Sri Mahishasura Mardhini Stotram & Kalika Ashtakam",
      bestChantingGuide: "Chanting Mahishasura Mardhini Stotram dispels fear, lethargy, and negative energies."
    },
    suggestedOfferings: "Allam Garelu, Tamarind Pulihora, Jaggery Sweet Pongali, and Whole Tender Coconut.",
    suggestedItems: "Kumkum, Red flowers, Lime garlands, Sandalwood, and Ayudha Pooja flowers.",
    standardActivities: "Sri Mahishasura Mardhini Devi Alankarana, Ayudha Pooja, Maha Harathi, and Maha Navami Chandi Homa.",
    significance: "Celebrates the cosmic victory over Mahishasura; grants indomitable willpower and success in livelihood through Ayudha Pooja.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Mahishasura Mardhini Devi",
      eveningAlankarana: "Sri Raja Rajeshwari Devi",
      sessionGuide: "Morning honors slaying of demon Mahishasura; evening shifts to triumphant, peaceful queen of universe, Sri Raja Rajeshwari Devi.",
      morningDetails: {
        deviName: "Sri Mahishasura Mardhini Devi",
        colorName: "Peacock Green / నెమలి ఆకుపచ్చ / मोरपंखी हरा",
        colorHex: "#0F766E",
        saree: "Majestic Peacock Green & Red Kanchi Pattu Saree with intricate gold brocade (నెమలి ఆకుపచ్చ & ఎరుపు కాంచీపురం పట్టు చీర)",
        ornaments: "18-Armed celestial arsenal (అష్టాదశ భుజ ఆయుధాలు: త్రిశూలం, ఖడ్గం, చక్రం, గద, బాణం, శంఖం, పాశం, ధనుస్సు), Piercing Trident over Mahishasura, Gold armor (స్వర్ణ కవచం), and Ayudha Pooja garlands"
      },
      eveningDetails: {
        deviName: "Sri Raja Rajeshwari Devi",
        colorName: "Royal Saffron / Golden Yellow / కాషాయం & పసుపు",
        colorHex: "#B45309",
        saree: "Imperial Saffron / Yellow Silk Pattu Saree with gold zari (సామ్రాజ్ఞి కాషాయం/పసుపు పట్టు చీర, మహారాజ్ఞి జరీ)",
        ornaments: "Sarva Samrajya Kiritam, Sugarcane bow, Pasha, Ankusha, Lotus, Chintamani crown, Shami (Jammi) sprigs, and Nine-gem imperial necklace"
      }
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
    whyWeCelebrate: `శ్రీ రాజరాజేశ్వరి దేవి సమస్త బ్రహ్మాండాలను పరిపాలించే శాంత స్వరూపిణి, పరాభట్టారిక మరియు విజయదశమి నాటి సర్వోన్నత దివ్య రూపం. దుష్టరాక్షస సంహారం ముగిసిన అనంతరం, జగన్మాత మధురమైన మందహాసంతో, కరుణామృత దృష్టితో సకల జీవులకు అభయాన్ని, సర్వార్థ సిద్ధిని అనుగ్రహిస్తుంది. అలాగే అధర్మరూపుడైన రావణాసురునిపై శ్రీరామచంద్రుడు విజయం సాధించిన పుణ్యదినం కూడా విజయదశమి.

ఈ రోజున ప్రారంభించే విద్య, వ్యాపారం లేదా ఏదైనా కొత్త ప్రయత్నం అప్రతిహత విజయాన్ని సాధిస్తుంది. సాయంత్రం జమ్మి చెట్టు (శమీ వృక్షం) వద్ద పూజ నిర్వహించి 'శమీ శమయతే పాపం' అంటూ జమ్మి ఆకులను పెద్దలకు ఇచ్చి ఆశీర్వాదం తీసుకోవడం విశిష్ట సంప్రదాయం. ఇంద్రకీలాద్రిపై మధ్యాహ్నం 3:30 గంటలకు జరిగే నగర ఉత్సవం, సాయంత్రం 5:00 నుండి 6:00 గంటల వరకు కృష్ణా నదిలో హంస వాహనంపై కనులపండువగా సాగే 'తెప్పోత్సవం'తో నవరాత్రుల ఉత్సవాలు సంపూర్ణ మంగళప్రదంగా ముగుస్తాయి.

Sri Raja Rajeshwari Devi is the Supreme Empress of all universes (Para Bhattarika), reigning in serene regal splendor after the eradication of evil. Vijayadashami celebrates the ultimate triumph of Good over Evil—commemorating both Goddess Durga's conquest over Mahishasura and Lord Sri Rama's vanquishing of Ravana. Any new business, educational endeavor, or auspicious journey launched on Vijayadashami is blessed with boundless success. Devotees perform Shami (Jammi) Pooja and exchange sacred Jammi leaves with elders with the prayer 'Shamī shamayate pāpaṁ' for lifelong prosperity. At Vijayawada Indrakeeladri, Dasara concludes with the 3:30 PM Nagarotsavam and the sunset Teppotsavam (swan boat float festival on the Krishna River at Durga Ghat).`,
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ రాజరాజేశ్వర్యై నమః",
      sloka: "అంబా శాంభవి చంద్రమౌళి రబలా పర్ణా ఉమా పార్వతీ | కాళీ హైమవతీ శివా త్రినయనీ కాత్యాయనీ భైరవీ ||",
      recommendedStotram: "Sri Raja Rajeshwari Ashtakam & Aparajita Stotram",
      bestChantingGuide: "Recite during evening Shami Pooja when exchanging Jammi leaves with family and elders for lifelong success."
    },
    suggestedOfferings: "Jalebi, Bellam Appalu, Laddu, Chakkara Pongali, and Grand Maha Prasadam.",
    suggestedItems: "Jammi (Shami) leaves, Golden Yellow/Red silk vastram, Lotus flowers, and Sweets for distribution.",
    standardActivities: "Sri Raja Rajeshwari Devi Rajabhishekam, Aparajita Pooja, Shami Pooja, 3:30 PM Nagarotsavam, and 5:00 PM Teppotsavam on Hamsa Vahanam (Krishna River).",
    significance: "Universal triumph on Vijayadashami; guarantees victory for new beginnings, blessed by Shami Pooja, Nagarotsavam & Krishna River Teppotsavam.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Raja Rajeshwari Devi (Full Day)",
      eveningAlankarana: "Teppotsavam (5-6 PM) & Nimarjanam",
      sessionGuide: "Full Day: Sri Raja Rajeshwari Devi. 3:30 PM: Nagarotsavam Procession. 5:00 PM – 6:00 PM: Teppotsavam on Hamsa Vahanam at Durga Ghat in Krishna River.",
      morningDetails: {
        deviName: "Sri Raja Rajeshwari Devi (Full Day)",
        colorName: "Royal Saffron / కాషాయం / केसरिया",
        colorHex: "#B45309",
        saree: "Royal Saffron & Golden Brocade Pattu Saree with rich temple motifs (దివ్య కాషాయ రత్న పట్టు చీర, స్వర్ణ అంచు)",
        ornaments: "Rajadhiraja Manikya Kiritam with crescent moon, Sugarcane bow, Pasha, Ankusha, Lotus, Diamond necklace, Lakshmi Kasula Peru, and Shami leaves"
      },
      eveningDetails: {
        deviName: "Teppotsavam & Nimarjanam (కృష్ణా నదిలో తెప్పోత్సవం)",
        colorName: "Auspicious Golden White & Crimson / స్వర్ణ శ్వేతం & ఎరుపు",
        colorHex: "#E11D48",
        saree: "Grand Festival Pattu Vastram with golden zari for Utsava Vigrahams (ఉత్సవ విగ్రహాలకు దివ్య స్వర్ణ పట్టు వస్త్రాలు)",
        ornaments: "Hamsa Vahanam (swan boat) floral decor, Swarna Kiritams, Grand Harathi deepams, pearl canopies, and Krishna River sacred offering garlands"
      }
    }
  }
];
