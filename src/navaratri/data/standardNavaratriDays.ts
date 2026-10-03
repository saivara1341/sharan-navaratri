import { StandardFestivalDay } from "../types";
import { navaratriAsset } from "../utils/navaratriAssets";

// Authentic 10 Sacred Navaratri Days Alankaram & Tithi Transition Schedule:
// Oct 11: Shuddha Padyami - Sri Bala Tripura Sundari Devi | Sri Gayatri Devi (Prep for Day 2)
// Oct 12: Shuddha Vidiya - Sri Gayatri Devi | Sri Annapurna Devi (Prep for Day 3)
// Oct 13: Shuddha Tadiya - Sri Annapurna Devi | Sri Mahachandi Devi (Prep for Day 4)
// Oct 14: Shuddha Chavithi - Sri Mahachandi Devi | Sri Lalitha Tripura Sundari Devi (Prep for Day 5)
// Oct 15: Shuddha Panchami - Sri Lalitha Tripura Sundari Devi | Sri Saraswati Devi (Moola Nakshatram)
// Oct 16: Shuddha Shashti (Moola Nakshatram) - Sri Saraswati Devi | Sri Mahalaxmi Devi (Prep for Day 7)
// Oct 17: Shuddha Saptami - Sri Mahalaxmi Devi | Sri Durga Devi (Prep for Day 8)
// Oct 18: Shuddha Ashtami (Durgashtami) - Sri Durga Devi | Sri Mahishasura Mardhini Devi (Prep for Day 9)
// Oct 19: Shuddha Navami (Mahanavami) - Sri Mahishasura Mardhini Devi | Sri Rajarajeswari Devi (Prep for Vijaya Dasami)
// Oct 20: Shuddha Dashami (Vijaya Dashami) - Sri Rajarajeswari Devi | Nagarotsavam & Teppotsavam / Nimarjanam
export const STANDARD_NAVARATRI_DAYS: StandardFestivalDay[] = [
  {
    dayNumber: 1,
    date: "2026-10-11",
    tithi: "Shuddha Padyami",
    morningAlankaram: "Sri Bala Tripura Sundari Devi",
    eveningTransition: "Sri Gayatri Devi (Prep for Day 2)",
    deviName: "Sri Bala Tripura Sundari Devi",
    teluguDeviName: "శ్రీ బాలా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री बाला त्रिपुरा सुंदरी देवी",
    colorName: "Pure White / తెలుపు / सफेद",
    colorHex: "#F5F5F4",
    imageUrl: navaratriAsset("/navaratri/assets/bala-tripura-sundari-alankarana.jpg"),
    description: "Inaugural day of Sharad Navaratri starting on Shuddha Padyami with Sri Bala Tripura Sundari Devi, personifying spiritual innocence, wisdom, and auspicious beginnings.",
    whyWeCelebrate: "Bala Tripura Sundari is the 9-year-old manifestation of Sri Lalitha Tripura Sundari who confers speech eloquence, academic excellence, and cosmic protection. Devotees celebrate this sacred opening day to receive divine blessings and begin Navaratri with spiritual purity.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం క్లీం సౌః సౌః క్లీం ఐం బాలాయై నమః (Om Aim Kleem Sauh Sauh Kleem Aim Balayai Namah)",
      sloka: "అరుణకిరణజాలై రంజితాశావకాశా | విధురజపపటీకా పుస్తకాభీష్టహస్తా ||",
      recommendedStotram: "Sri Bala Tripura Sundari Kavacham & Bala Sahasranama Stotram",
      bestChantingGuide: "Chanting the Bala Mantra 21 or 108 times at dawn boosts memory, concentration, and eliminates all fear."
    },
    suggestedOfferings: "Payasam, Ravva Kesari, Sugar candy (Kalkandu), Sweet milk, and Vadappappu.",
    suggestedItems: "Jasmine flowers (Mallepulu), White Lotus, White vastram, Sugarcane pieces, and Panchamrutham.",
    standardActivities: "Kalash Sthapana, Bala Tripura Sundari Pooja, Kumkumarchana, and Kanya Pooja.",
    significance: "Inspires inner purity, peace, and academic excellence for children and families.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Bala Tripura Sundari Devi",
      eveningAlankarana: "Sri Gayatri Devi (Prep for Day 2)",
      sessionGuide: "Morning pooja begins with Sri Bala Tripura Sundari Devi; evening transitions with special deeparadhana in preparation for Day 2 Sri Gayatri Devi."
    }
  },
  {
    dayNumber: 2,
    date: "2026-10-12",
    tithi: "Shuddha Vidiya",
    morningAlankaram: "Sri Gayatri Devi",
    eveningTransition: "Sri Annapurna Devi (Prep for Day 3)",
    deviName: "Sri Gayatri Devi",
    teluguDeviName: "శ్రీ గాయత్రీ దేవి",
    hindiDeviName: "श्री गायत्री देवी",
    colorName: "Auspicious Red / ఎరుపు / लाल",
    colorHex: "#DC2626",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-3-chandraghanta.jpg"),
    description: "The Vedamatha and supreme source of spiritual illumination, adorned with five sacred faces (Panchamukhi), bestowing intellect, wisdom, and inner light.",
    whyWeCelebrate: "Gayatri Devi illuminates the human intellect (Dhiyo Yo Nah Prachodayat) to distinguish truth from illusion. Devotees celebrate Shuddha Vidiya to cleanse thoughts and awaken inner vitality.",
    sacredChanting: {
      moolaMantra: "ఓం భూర్భువస్సువః | తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి | ధియో యో నః ప్రచోదయాత్ || (Gayatri Maha Mantra)",
      sloka: "ముక్తావిద్రుమ హేమనీల ధవళచ్ఛాయైర్ముఖైస్త్రీక్షణైః | యుక్తామిందునిబద్ధరత్నమకుటాం తత్త్వార్థవర్ణాత్మికామ్ ||",
      recommendedStotram: "Gayatri Sahasranama Stotram & Gayatri Kavacham",
      bestChantingGuide: "Chanting Gayatri Mantra 108 times during sunrise brings mental stillness and radiant aura."
    },
    suggestedOfferings: "Allam Garelu (Medu Vada), Coconut Rice, and Pulihora.",
    suggestedItems: "Red lotus, Hibiscus (Mandara), Sandalwood paste, Akshata, and pure cow ghee for deepam.",
    standardActivities: "Gayatri Japa, Veda Parayanam, Gayatri Homa, and evening Mangala Harathi.",
    significance: "Removes ignorance, sharpens the intellect, and brings spiritual clarity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Gayatri Devi",
      eveningAlankarana: "Sri Annapurna Devi (Prep for Day 3)",
      sessionGuide: "Morning Vedamatha Gayatri Pooja; evening transitions with prep for Day 3 Sri Annapurna Devi."
    }
  },
  {
    dayNumber: 3,
    date: "2026-10-13",
    tithi: "Shuddha Tadiya",
    morningAlankaram: "Sri Annapurna Devi",
    eveningTransition: "Sri Mahachandi Devi (Prep for Day 4)",
    deviName: "Sri Annapurna Devi",
    teluguDeviName: "శ్రీ అన్నపూర్ణా దేవి",
    hindiDeviName: "श्री अन्नपूर्णा देवी",
    colorName: "Royal Blue / గాఢ నీలం / शाही नीला",
    colorHex: "#1D4ED8",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-4-kushmanda.jpg"),
    description: "The eternal provider of nourishment and mother of Kasi Kshetram, seated with a golden ladle and bowl of nectarous food, sustaining all living beings.",
    whyWeCelebrate: "Devotees celebrate Shuddha Tadiya with Annapurna Devi so that no family ever faces shortage of food or basic necessities, and to practice the highest virtue of Annadanam.",
    sacredChanting: {
      moolaMantra: "ఓం హ్రీం శ్రీం క్లీం భగవత్యై అన్నపూర్ణాయై నమః (Om Hreem Shreem Kleem Bhagavatyai Annapurnayai Namah)",
      sloka: "నిత్యానందకరీ వరాభయకరీ సౌందర్యరత్నాకరీ | నిర్ధూతాఖిలఘోరపావనకరీ ప్రత్యక్షమాహేశ్వరీ ||",
      recommendedStotram: "Sri Annapurna Ashtakam (by Adi Shankaracharya)",
      bestChantingGuide: "Recite Annapurna Ashtakam before preparing meals. Invokes the blessing of Akshaya Patra."
    },
    suggestedOfferings: "Ksheerannam (Paramannam), Pongal, Dal Vadas, and Maha Annadanam meal distribution.",
    suggestedItems: "Navadhanyalu (nine sacred grains), Rice grains, Fresh harvest fruits, and Yellow flowers.",
    standardActivities: "Annapurna Stotram parayanam, Maha Annadanam sponsorship, and evening Harathi.",
    significance: "Ensures abundance, hunger alleviation, and blessing of food and prosperity in every home.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Annapurna Devi",
      eveningAlankarana: "Sri Mahachandi Devi (Prep for Day 4)",
      sessionGuide: "Morning Sri Annapurna Devi Golden Ladle Pooja; evening transitions with prep for Day 4 Sri Mahachandi Devi."
    }
  },
  {
    dayNumber: 4,
    date: "2026-10-14",
    tithi: "Shuddha Chavithi",
    morningAlankaram: "Sri Mahachandi Devi",
    eveningTransition: "Sri Lalitha Tripura Sundari Devi (Prep for Day 5)",
    deviName: "Sri Mahachandi Devi",
    teluguDeviName: "శ్రీ మహాచండీ దేవి",
    hindiDeviName: "श्री महाचंडी देवी",
    colorName: "Fiery Crimson / ఎరుపు / गहरा लाल",
    colorHex: "#B91C1C",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-1-shailaputri.jpg"),
    description: "The fierce and supreme cosmic protectress wielding weapons of light, eradicating negative energies and granting unwavering spiritual courage.",
    whyWeCelebrate: "Sri Mahachandi embodies the combined powers of Maha Kali, Maha Lakshmi, and Maha Saraswathi to dispel demonic forces, protect dharma, and eliminate planetary doshas.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే (Chandi Navakshari Maha Mantra)",
      sloka: "సర్వమంగళ మాంగల్యే శివే సర్వార్థ సాధికే | శరణ్యే త్ర్యంబకే గౌరి నారాయణి నమోస్తుతే ||",
      recommendedStotram: "Sri Chandi Saptashati & Devi Mahatmyam",
      bestChantingGuide: "Chanting the Navakshari mantra with pure devotion provides an impenetrable armor of divine protection."
    },
    suggestedOfferings: "Garelu, Pulihora, Lemon Rice, and Bellam Pongali.",
    suggestedItems: "Red flowers, Bilva patra, Kumkum, Turmeric, and Cow ghee lamps.",
    standardActivities: "Chandi Parayanam, Chandi Homa, Kumkumarchana, and evening Maha Harathi.",
    significance: "Destroys evil drishti, removes deep karmic obstacles, and bestows supreme courage.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Mahachandi Devi",
      eveningAlankarana: "Sri Lalitha Tripura Sundari Devi (Prep for Day 5)",
      sessionGuide: "Morning Sri Mahachandi Pooja; evening transitions with prep for Day 5 Sri Lalitha Tripura Sundari Devi."
    }
  },
  {
    dayNumber: 5,
    date: "2026-10-15",
    tithi: "Shuddha Panchami",
    morningAlankaram: "Sri Lalitha Tripura Sundari Devi",
    eveningTransition: "Sri Saraswati Devi (Moola Nakshatram)",
    deviName: "Sri Lalitha Tripura Sundari Devi",
    teluguDeviName: "శ్రీ లలితా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री ललिता त्रिपुरा सुंदरी देवी",
    colorName: "Bright Yellow / పసుపు / पीला",
    colorHex: "#EAB308",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-5-skandamata.jpg"),
    description: "The supreme empress of the Sri Chakra, seated on a divine lotus throne, personifying universal bliss, compassion, and sovereign grace.",
    whyWeCelebrate: "Devotees celebrate sacred Lalitha Panchami for family harmony, marital bliss (Sumangali / Soubhagyam), and the release from internal bondages.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ లలితా పరమేశ్వర్యై నమః",
      sloka: "సింధూరారుణ విగ్రహాం త్రినయనాం మాణిక్యమౌళిస్ఫురత్ | తారానాయక శేఖరాం స్మితముఖీం ఆపీనవక్షోరుహామ్ ||",
      recommendedStotram: "Sri Lalitha Sahasranama Stotram & Lalitha Trishati",
      bestChantingGuide: "Chanting Lalitha Sahasranama with fresh red kumkum or lotus petals brings profound mental peace and fulfills righteous desires."
    },
    suggestedOfferings: "Pesara Boorelu, Sweet Pongali, Pulihora, and Panchamrutham.",
    suggestedItems: "Red Kumkum, Turmeric roots, Lotus flowers, and Yellow silk vastram.",
    standardActivities: "Sri Chakra Archana, Lalitha Sahasranama Parayanam, Suvasini Pooja, and Harathi.",
    significance: "Bestows family harmony, marital bliss, and sovereign spiritual grace.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Lalitha Tripura Sundari Devi",
      eveningAlankarana: "Sri Saraswati Devi (Moola Nakshatram)",
      sessionGuide: "Morning Sri Lalitha Tripura Sundari worship; evening transitions in preparation for sacred Moola Nakshatra Saraswati Pooja."
    }
  },
  {
    dayNumber: 6,
    date: "2026-10-16",
    tithi: "Shuddha Shashti (Moola Nakshatram)",
    morningAlankaram: "Sri Saraswati Devi",
    eveningTransition: "Sri Mahalaxmi Devi (Prep for Day 7)",
    deviName: "Sri Saraswati Devi",
    teluguDeviName: "శ్రీ సరస్వతీ దేవి",
    hindiDeviName: "श्री सरस्वती देवी",
    colorName: "Vedic Green / ఆకుపచ్చ / हरा",
    colorHex: "#16A34A",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-6-katyayani.jpg"),
    description: "Celebrated on sacred Moola Nakshatram holding the veena, book, and crystal rosary; the supreme goddess of wisdom, education, and fine arts.",
    whyWeCelebrate: "Celebrated on auspicious Moola Nakshatra (Devi's birth star in Navaratri). Devotees initiate children into learning (**Aksharabhyasam**) on this day and worship their books and instruments.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం వాగ్దేవ్యై చ విద్మహే కామరాజాయ ధీమహి | తన్నో దేవీ ప్రచోదయాత్ || (Saraswathi Gayatri)",
      sloka: "యా కుందేందు తుషారహారధవళా యా శుభ్రవస్త్రావృతా | యా వీణావరదండమండితకరా యా శ్వేతపద్మాసనా ||",
      recommendedStotram: "Saraswathi Ashtottara Shata Namavali & Saraswathi Stotram",
      bestChantingGuide: "Chant Ya Kundendu before studying. Placing books before Goddess Saraswathi and reciting 11 times boosts memory."
    },
    suggestedOfferings: "Daddojanam (Curd Rice), Bellam Payasam, White Laddu, and Honey with milk.",
    suggestedItems: "White/Yellow flowers, Slates, Notebooks, Pens for Aksharabhyasam, and White lotus.",
    standardActivities: "Saraswathi Pooja, Aksharabhyasam ceremonies for children, Pustaka Pooja, and music concerts.",
    significance: "Inspires wisdom, artistic eloquence, retentive memory, and blessings for students and scholars.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Saraswati Devi",
      eveningAlankarana: "Sri Mahalaxmi Devi (Prep for Day 7)",
      sessionGuide: "Auspicious Moola Nakshatram Saraswati Pooja and Aksharabhyasam in morning; evening prep for Day 7 Sri Mahalaxmi Devi."
    }
  },
  {
    dayNumber: 7,
    date: "2026-10-17",
    tithi: "Shuddha Saptami",
    morningAlankaram: "Sri Mahalaxmi Devi",
    eveningTransition: "Sri Durga Devi (Prep for Day 8)",
    deviName: "Sri Mahalaxmi Devi",
    teluguDeviName: "శ్రీ మహాలక్ష్మీ దేవి",
    hindiDeviName: "श्री महालक्ष्मी देवी",
    colorName: "Sacred Ash / Grey / బూడిద రంగు / धूसर",
    colorHex: "#6B7280",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-7-kalaratri.jpg"),
    description: "The auspicious embodiment of Ashta Lakshmi, bestowing prosperity, agricultural abundance, and spiritual contentment.",
    whyWeCelebrate: "Maha Lakshmi emerged from the cosmic ocean of milk. Devotees worship her on Shuddha Saptami to remove poverty and bring sustainable peace and wealth.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద శ్రీం హ్రీం శ్రీం ఓం మహాలక్ష్మ్యై నమః",
      sloka: "నమస్తేస్తు మహామాయే శ్రీపీఠే సురపూజితే | శంఖచక్ర గదాహస్తే మహాలక్ష్మి నమోస్తుతే ||",
      recommendedStotram: "Sri Suktam, Kanakadhara Stotram & Lakshmi Ashtakam",
      bestChantingGuide: "Chanting Sri Suktam and Kanakadhara Stotram at dusk invites Mahalakshmi's permanent auspicious presence."
    },
    suggestedOfferings: "Chakkara Pongali, Purnam Boorelu, Ksheerannam, and Dry Fruits Laddu.",
    suggestedItems: "Pink Lotus, Bilva leaves, Gold/Silver coins, Betel leaves, and Red vastram.",
    standardActivities: "Sri Suktam Parayanam, Lakshmi Ashtottara Kumkumarchana, and grand Deeparadhana.",
    significance: "Removes poverty and financial obstacles while inviting sustainable prosperity and peace.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Mahalaxmi Devi",
      eveningAlankarana: "Sri Durga Devi (Prep for Day 8)",
      sessionGuide: "Morning Sri Mahalaxmi Sahasra Deeparadhana; evening transitions with prep for Day 8 Sri Durga Devi."
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
    whyWeCelebrate: "Celebrated on sacred Maha Durgashtami. Mother Durga symbolizes the triumph of Dharma over Adharma, protecting devotees from adversities and fear.",
    sacredChanting: {
      moolaMantra: "ఓం దుం దుర్గాయై నమః (Om Dum Durgayai Namah)",
      sloka: "దుర్గే స్మృతా హరసి భీతిమశేషజంతోః | స్వస్థైః స్మృతా మతిమతీవ శుభాం దదాసి ||",
      recommendedStotram: "Sri Durga Kavacham, Devi Mahatmyam & Durga Ashtakam",
      bestChantingGuide: "Reciting Durga Kavacham on Durgashtami provides a spiritual shield safeguarding the home."
    },
    suggestedOfferings: "Kadambam, Garelu (Vada with ginger), Bellam Kudumulu, and Coconuts.",
    suggestedItems: "Red Oleander (Ganneru), Lemon garlands, Trishulam decor, and Red silk vastram.",
    standardActivities: "Maha Durgashtami Pooja, Chandi Parayanam, Kanya Pooja, and grand Harathi.",
    significance: "Destroys evil forces, bestows courage in difficult times, and safeguards devotees against adversity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Durga Devi",
      eveningAlankarana: "Sri Mahishasura Mardhini Devi (Prep for Day 9)",
      sessionGuide: "Durgashtami sacred Durga Pooja in morning; evening transitions with prep for Day 9 Sri Mahishasura Mardhini Devi."
    }
  },
  {
    dayNumber: 9,
    date: "2026-10-19",
    tithi: "Shuddha Navami (Mahanavami)",
    morningAlankaram: "Sri Mahishasura Mardhini Devi",
    eveningTransition: "Sri Rajarajeswari Devi (Prep for Vijaya Dasami)",
    deviName: "Sri Mahishasura Mardhini Devi",
    teluguDeviName: "శ్రీ మహిషాసుర మర్దిని దేవి",
    hindiDeviName: "श्री महिषासुर मर्दिनी देवी",
    colorName: "Peacock Green / నెమలి ఆకుపచ్చ / मोरपंखी हरा",
    colorHex: "#0F766E",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-9-siddhidatri.jpg"),
    description: "Celebrated on Maha Navami as the victorious warrior who slew the demon Mahishasura, dispelling ignorance and cosmic negative forces.",
    whyWeCelebrate: "On Maha Navami, the supreme battle reached its triumph with the vanquishing of Mahishasura. Devotees also celebrate **Ayudha Pooja**, worshipping instruments and vehicles.",
    sacredChanting: {
      moolaMantra: "ఓం క్లీం కాళికాయై నమః | ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే",
      sloka: "అయి గిరినందిని నందితమేదిని విశ్వవినోదిని నందినుతే | గిరివరవింధ్య శిరోధినివాసిని విష్ణువిలాసిని జిష్ణునుతే ||",
      recommendedStotram: "Sri Mahishasura Mardhini Stotram & Kalika Ashtakam",
      bestChantingGuide: "Chanting Mahishasura Mardhini Stotram dispels fear, lethargy, and negative energies."
    },
    suggestedOfferings: "Allam Garelu, Tamarind Pulihora, Jaggery Sweet Pongali, and Whole Tender Coconut.",
    suggestedItems: "Kumkum, Red flowers, Lime garlands, Sandalwood, and Ayudha Pooja flowers.",
    standardActivities: "Maha Navami Chandi Homa, Purnahuti, Ayudha Pooja, and midnight Harathi.",
    significance: "Conquering internal enemies and celebrating the supreme triumph of righteousness.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Mahishasura Mardhini Devi",
      eveningAlankarana: "Sri Rajarajeswari Devi (Prep for Vijaya Dasami)",
      sessionGuide: "Mahanavami Mahishasura Mardhini Alankarana & Ayudha Pooja; evening transitions with prep for Vijaya Dasami Sri Rajarajeswari Devi."
    }
  },
  {
    dayNumber: 10,
    date: "2026-10-20",
    tithi: "Shuddha Dashami (Vijaya Dashami)",
    morningAlankaram: "Sri Rajarajeswari Devi",
    eveningTransition: "Nagarotsavam & Teppotsavam / Nimarjanam",
    deviName: "Sri Rajarajeswari Devi",
    teluguDeviName: "శ్రీ రాజరాజేశ్వరి దేవి",
    hindiDeviName: "श्री राजराजेश्वरी देवी",
    colorName: "Royal Saffron / కాషాయం / केसरिया",
    colorHex: "#B45309",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-10-vijayadashami.jpg"),
    description: "The serene, all-compassionate mother seated on the imperial throne on Vijaya Dashami, bestowing peace, nobility, and ultimate victory.",
    whyWeCelebrate: "Vijaya Dashami (Dasara) is the day of total victory. Devotees perform **Shami Pooja (Jammi Chettu pooja)** and start new ventures on this most auspicious day.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ రాజరాజేశ్వర్యై నమః",
      sloka: "అంబా శాంభవి చంద్రమౌళి రబలా పర్ణా ఉమా పార్వతీ | కాళీ హైమవతీ శివా త్రినయనీ కాత్యాయనీ భైరవీ ||",
      recommendedStotram: "Sri Raja Rajeshwari Ashtakam & Aparajita Stotram",
      bestChantingGuide: "Recite during evening Shami Pooja when exchanging Jammi leaves with family and elders for lifelong success."
    },
    suggestedOfferings: "Jalebi, Bellam Appalu, Laddu, Chakkara Pongali, and Grand Maha Prasadam.",
    suggestedItems: "Jammi (Shami) leaves, Golden Yellow/Red silk vastram, Lotus flowers, and Sweets.",
    standardActivities: "Vijaya Dashami special pooja, Shami Pooja (Jammi Chettu), Aparajita Pooja, and Nagarotsavam / Nimarjanam.",
    significance: "The celebration of total victory of good over evil, bringing success to new ventures.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Rajarajeswari Devi",
      eveningAlankarana: "Nagarotsavam & Teppotsavam / Nimarjanam",
      sessionGuide: "Vijaya Dashami Sri Rajarajeswari Devi Darshan in morning; grand evening Nagarotsavam, Teppotsavam & Nimarjanam."
    }
  }
];
