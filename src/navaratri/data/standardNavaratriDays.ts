import { StandardFestivalDay } from "../types";
import { navaratriAsset } from "../utils/navaratriAssets";

// Platform defaults for Sharad Navaratri 2026 in Telangana & South Indian Mandapams.
// Follows the authentic 10 Sacred Devi Alankaranas:
// Sri Swarna Kavachalankruta Durga Devi, Sri Bala Tripura Sundari Devi, Sri Gayatri Devi,
// Sri Annapurna Devi, Sri Lalitha Tripura Sundari Devi, Sri Maha Saraswathi Devi,
// Sri Maha Lakshmi Devi, Sri Durga Devi, Sri Mahishasura Mardhini Devi / Sri Kalika Devi,
// and Sri Raja Rajeshwari Devi (Vijaya Dashami).
export const STANDARD_NAVARATRI_DAYS: StandardFestivalDay[] = [
  {
    dayNumber: 1,
    date: "2026-10-11",
    deviName: "Sri Swarna Kavachalankruta Durga Devi",
    teluguDeviName: "శ్రీ స్వర్ణ కవచాలంకృత దుర్గా దేవి",
    hindiDeviName: "श्री स्वर्ण कवच अलंकृत दुर्गा देवी",
    colorName: "Golden Orange / బంగారు నారింజ / सुनहरा नारंगी",
    colorHex: "#EA580C",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-1-shailaputri.jpg"),
    description: "The grand inaugural alankarana where Devi is adorned in radiant golden armor (Swarna Kavacham), conferring fearlessness, victory, and divine health upon all devotees.",
    whyWeCelebrate: "According to sacred temple sthalapuranas, Indra and the Devas prayed to the Supreme Goddess when threatened by demon forces. Mother Durga appeared in luminous golden armor (Swarna Kavacham) to protect the cosmos. Devotees celebrate this day to remove life fears, eliminate evil drishti (negative energies), and start Navaratri with divine shield and blessings.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే (Om Aim Hreem Kleem Chamundayai Vicche)",
      sloka: "సర్వమంగళ మాంగల్యే శివే సర్వార్థ సాధికే | శరణ్యే త్ర్యంబకే గౌరి నారాయణి నమోస్తుతే ||",
      recommendedStotram: "Sri Durga Ashtottara Shatanama Stotram & Kanakadhara Stotram",
      bestChantingGuide: "Chant the Moola Mantra 108 times at dawn or dusk facing East. Lighting a pure cow-ghee deepam while reciting Sarva Mangala Mangalye brings divine peace to the household."
    },
    suggestedOfferings: "Katte Pongali, Ghee Naivedhyam, Honey, and Bananas.",
    suggestedItems: "Orange/Yellow flowers, bilva patra, kumkum, turmeric roots, akshata, and deepam oil.",
    standardActivities: "Kalasha Sthapana, Ghatasthapana, Swarna Kavacha Durga Pooja, and evening Maha Harathi.",
    significance: "Bestows divine protection against all negative energies and marks an auspicious start to Navaratri.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Ghatasthapana / Sri Shailaputri Pooja",
      eveningAlankarana: "Sri Swarna Kavachalankruta Durga Devi Darshan",
      sessionGuide: "Many mandapams perform Ghatasthapana rituals in the morning and unveil the radiant Golden Armor (Swarna Kavacham) alankarana for evening darshan."
    }
  },
  {
    dayNumber: 2,
    date: "2026-10-12",
    deviName: "Sri Bala Tripura Sundari Devi",
    teluguDeviName: "శ్రీ బాలా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री बाला त्रिपुरा सुंदरी देवी",
    colorName: "Pure White / తెలుపు / सफेद",
    colorHex: "#F5F5F4",
    imageUrl: navaratriAsset("/navaratri/assets/bala-tripura-sundari-alankarana.jpg"),
    description: "The youthful child manifestation of the Divine Mother Tripura Sundari, personifying innocence, spiritual wisdom, memory power, and divine playfulness.",
    whyWeCelebrate: "Bala Tripura Sundari is the 9-year-old child form of Sri Lalitha Tripura Sundari who led the divine army to vanquish the sons of Bhandasura. Devotees and parents celebrate this avatharam for their children's bright future, speech eloquence, academic excellence, and freedom from childhood illnesses.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం క్లీం సౌః సౌః క్లీం ఐం బాలాయై నమః (Om Aim Kleem Sauh Sauh Kleem Aim Balayai Namah)",
      sloka: "అరుణకిరణజాలై రంజితాశావకాశా | విధురజపపటీకా పుస్తకాభీష్టహస్తా ||",
      recommendedStotram: "Sri Bala Tripura Sundari Kavacham & Bala Sahasranama Stotram",
      bestChantingGuide: "Ideal for students and young children. Chanting the Bala Mantra 21 or 108 times in the morning boosts memory, concentration, and exams confidence."
    },
    suggestedOfferings: "Payasam, Ravva Kesari, Sugar candy (Kalkandu), Sweet milk, and Vadappappu (soaked moong dal with jaggery).",
    suggestedItems: "Jasmine flowers (Mallepulu), White Lotus, White vastram, Sugarcane pieces, and Panchamrutham.",
    standardActivities: "Bala Tripura Sundari Pooja, Bala Sahasranama Parayanam, Kumkumarchana, and Kanya Pooja.",
    significance: "Inspires inner purity, peace, and academic excellence for children and students.",
    dualSessionNote: {
      isCommonlyDual: false,
      morningAlankarana: "Sri Bala Tripura Sundari Devi",
      eveningAlankarana: "Kanya Pooja & Bala Sahasranama Kumkumarchana",
      sessionGuide: "Special Kanya Poojas (worshipping young girls as living forms of Bala Tripura Sundari) are conducted in the late afternoon / evening."
    }
  },
  {
    dayNumber: 3,
    date: "2026-10-13",
    deviName: "Sri Gayatri Devi",
    teluguDeviName: "శ్రీ గాయత్రీ దేవి",
    hindiDeviName: "श्री गायत्री देवी",
    colorName: "Auspicious Red / ఎరుపు / लाल",
    colorHex: "#DC2626",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-3-chandraghanta.jpg"),
    description: "The Vedamatha and supreme source of spiritual illumination, adorned with five sacred faces (Panchamukhi), bestowing intellect, wisdom, and inner light.",
    whyWeCelebrate: "Gayatri Devi is the mother of the four Vedas and personification of Gayatri Chhandas. She illuminates the human intellect (Dhiyo Yo Nah Prachodayat) to distinguish truth from untruth. Devotees celebrate this day to cleanse negative thoughts, overcome confusion, and awaken spiritual willpower.",
    sacredChanting: {
      moolaMantra: "ఓం భూర్భువస్సువః | తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి | ధియో యో నః ప్రచోదయాత్ || (Gayatri Maha Mantra)",
      sloka: "ముక్తావిద్రుమ హేమనీల ధవళచ్ఛాయైర్ముఖైస్త్రీక్షణైః | యుక్తామిందునిబద్ధరత్నమకుటాం తత్త్వార్థవర్ణాత్మికామ్ ||",
      recommendedStotram: "Gayatri Sahasranama Stotram & Gayatri Kavacham",
      bestChantingGuide: "Chanting Gayatri Mantra 108 times during sunrise (Pratah Sandhya) or sunset (Sayam Sandhya) brings mental stillness, sharp intellect, and radiant aura."
    },
    suggestedOfferings: "Allam Garelu (Medu Vada), Coconut Rice, and Pulihora.",
    suggestedItems: "Red lotus, Hibiscus (Mandara), Sandalwood paste, Akshata, and pure cow ghee for deepam.",
    standardActivities: "Gayatri Japa, Veda Parayanam, Gayatri Homa, and evening Mangala Harathi.",
    significance: "Removes ignorance, sharpens the intellect (dhiyo yo nah prachodayat), and brings spiritual clarity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Gayatri Devi Veda Parayanam",
      eveningAlankarana: "Sri Gayatri Sahasranama Deeparadhana",
      sessionGuide: "In several temples where Tithi spans two phases, Gayatri Devi is celebrated in the morning with Annapurna Devi in the evening."
    }
  },
  {
    dayNumber: 4,
    date: "2026-10-14",
    deviName: "Sri Annapurna Devi",
    teluguDeviName: "శ్రీ అన్నపూర్ణా దేవి",
    hindiDeviName: "श्री अन्नपूर्णा देवी",
    colorName: "Royal Blue / గాఢ నీలం / शाही नीला",
    colorHex: "#1D4ED8",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-4-kushmanda.jpg"),
    description: "The eternal provider of nourishment and mother of Kasi Kshetram, seated with a golden ladle and bowl of nectarous food, sustaining all living beings.",
    whyWeCelebrate: "When Lord Shiva demonstrated the illusion of the material world, Goddess Parvati took the form of Annapurna in Varanasi to feed every living being, including Lord Shiva Himself. Devotees celebrate this day so that no family ever faces shortage of food or basic necessities, and to practice the highest virtue of Annadanam (feeding the hungry).",
    sacredChanting: {
      moolaMantra: "ఓం హ్రీం శ్రీం క్లీం భగవత్యై అన్నపూర్ణాయై నమః (Om Hreem Shreem Kleem Bhagavatyai Annapurnayai Namah)",
      sloka: "నిత్యానందకరీ వరాభయకరీ సౌందర్యరత్నాకరీ | నిర్ధూతాఖిలఘోరపావనకరీ ప్రత్యక్షమాహేశ్వరీ ||",
      recommendedStotram: "Sri Annapurna Ashtakam (by Adi Shankaracharya)",
      bestChantingGuide: "Recite Annapurna Ashtakam before preparing food or serving meals at home. Chanting it on this day invokes the permanent blessing of Akshaya Patra (inexhaustible prosperity)."
    },
    suggestedOfferings: "Ksheerannam (Paramannam), Pongal, Dal Vadas, and Maha Annadanam meal distribution.",
    suggestedItems: "Navadhanyalu (nine sacred grains), Rice grains, Fresh harvest fruits, Yellow flowers, and ghee deepam.",
    standardActivities: "Annapurna Stotram parayanam, Maha Annadanam sponsorship, and evening Harathi.",
    significance: "Ensures abundance, hunger alleviation, and blessing of food and prosperity in every home.",
    dualSessionNote: {
      isCommonlyDual: false,
      morningAlankarana: "Sri Annapurna Devi Golden Ladle Pooja",
      eveningAlankarana: "Maha Annadanam & Ksheerannam Bhog Distribution",
      sessionGuide: "The entire day is traditionally dedicated to organizing community meals and distributing sanctified food to all pilgrims."
    }
  },
  {
    dayNumber: 5,
    date: "2026-10-15",
    deviName: "Sri Lalitha Tripura Sundari Devi",
    teluguDeviName: "శ్రీ లలితా త్రిపుర సుందరి దేవి",
    hindiDeviName: "श्री ललिता त्रिपुरा सुंदरी देवी",
    colorName: "Bright Yellow / పసుపు / पीला",
    colorHex: "#EAB308",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-5-skandamata.jpg"),
    description: "The supreme empress of the Sri Chakra (Sri Yantra), seated on a divine lotus throne, personifying universal bliss, compassion, and sovereign grace.",
    whyWeCelebrate: "Lalitha Maha Tripura Sundari is the supreme embodiment of the Mother of the Universe described in Lalitha Sahasranama and Brahmanda Purana. Devotees celebrate this sacred Panchami day to obtain family harmony, marital bliss (Sumangali / Soubhagyam), and the release from internal bondages.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ లలితా పరమేశ్వర్యై నమః (Om Shreem Hreem Kleem Aim Sauh Sri Lalitha Parameshwaryai Namah)",
      sloka: "సింధూరారుణ విగ్రహాం త్రినయనాం మాణిక్యమౌళిస్ఫురత్ | తారానాయక శేఖరాం స్మితముఖీం ఆపీనవక్షోరుహామ్ ||",
      recommendedStotram: "Sri Lalitha Sahasranama Stotram & Lalitha Trishati",
      bestChantingGuide: "Chanting Lalitha Sahasranama while offering red kumkum or fresh lotus petals at Devi's feet brings immense peaceful aura, removes obstacles in marriage, and fulfills righteous desires."
    },
    suggestedOfferings: "Pesara Boorelu, Sweet Pongali, Pulihora, and Panchamrutham.",
    suggestedItems: "Red Kumkum, Turmeric roots, Lotus flowers, Yellow silk vastram, and fragrant attar / jasmine.",
    standardActivities: "Sri Chakra Archana, Lalitha Sahasranama Parayanam, Suvasini Pooja, and Harathi.",
    significance: "Bestows family harmony, marital bliss, fulfillment of noble wishes, and supreme spiritual grace.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Chakra Navavarana Pooja",
      eveningAlankarana: "Sri Lalitha Sahasranama Kumkumarchana & Suvasini Pooja",
      sessionGuide: "Morning is dedicated to Sri Yantra consecration and evening is reserved for mass Suvasini Poojas and Kumkumarchana by women devotees."
    }
  },
  {
    dayNumber: 6,
    date: "2026-10-16",
    deviName: "Sri Maha Saraswathi Devi",
    teluguDeviName: "శ్రీ మహా సరస్వతీ దేవి",
    hindiDeviName: "श्री महा सरस्वती देवी",
    colorName: "Vedic Green / ఆకుపచ్చ / हरा",
    colorHex: "#16A34A",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-6-katyayani.jpg"),
    description: "Celebrated on sacred Moola Nakshatram holding the veena, book, and crystal rosary; the supreme goddess of wisdom, education, and fine arts.",
    whyWeCelebrate: "Celebrated on the auspicious Moola Nakshatra (Devi's birth constellation in Navaratri). She is the patron goddess of knowledge, arts, literature, and music. Devotees initiate children into their first letters (**Aksharabhyasam**) on this day and worship their books and instruments to receive Saraswathi Kataksham.",
    sacredChanting: {
      moolaMantra: "ఓం ఐం వాగ్దేవ్యై చ విద్మహే కామరాజాయ ధీమహి | తన్నో దేవీ ప్రచోదయాత్ || (Saraswathi Gayatri Mantra)",
      sloka: "యా కుందేందు తుషారహారధవళా యా శుభ్రవస్త్రావృతా | యా వీణావరదండమండితకరా యా శ్వేతపద్మాసనా ||",
      recommendedStotram: "Saraswathi Ashtottara Shata Namavali & Saraswathi Stotram (by Sage Agastya)",
      bestChantingGuide: "Students should chant Ya Kundendu Tushara Hara Dhavala every morning before starting studies. Placing study books before Goddess Saraswathi and reciting the mantra 11 times brings clarity and retentive memory."
    },
    suggestedOfferings: "Daddojanam (Curd Rice), Bellam Payasam, White Laddu, and Honey with milk.",
    suggestedItems: "White/Yellow flowers, Slates, Notebooks, Pens for Aksharabhyasam, and White lotus.",
    standardActivities: "Saraswathi Pooja, Aksharabhyasam ceremonies for children, Pustaka Pooja (worship of books), and music concerts.",
    significance: "Inspires wisdom, artistic eloquence, retentive memory, and blessings for students and scholars.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Aksharabhyasam & Pustaka Pooja (School & Children Initiation)",
      eveningAlankarana: "Sri Maha Saraswathi Sangeetha Seva & Classical Bhajans",
      sessionGuide: "Thousands of parents bring toddlers for Aksharabhyasam in the morning, followed by classical Carnatic music and Veena recitals in the evening."
    }
  },
  {
    dayNumber: 7,
    date: "2026-10-17",
    deviName: "Sri Maha Lakshmi Devi",
    teluguDeviName: "శ్రీ మహా లక్ష్మీ దేవి",
    hindiDeviName: "श्री महा लक्ष्मी देवी",
    colorName: "Sacred Ash / Grey / బూడిద రంగు / धूसर",
    colorHex: "#6B7280",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-7-kalaratri.jpg"),
    description: "The auspicious embodiment of Ashta Lakshmi (eight forms of wealth), bestowing prosperity, agricultural abundance, and royal fortune.",
    whyWeCelebrate: "Maha Lakshmi emerged from the churning of the cosmic ocean (Ksheera Sagara Mathanam) as the consort of Lord Maha Vishnu. She represents not just material wealth, but Dhaanya (food), Dhairya (courage), Vidya (knowledge), and Santhana (family) wealth. Devotees worship her to remove poverty and bring sustainable peace.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం శ్రీం కమలే కమలాలయే ప్రసీద ప్రసీద శ్రీం హ్రీం శ్రీం ఓం మహాలక్ష్మ్యై నమః",
      sloka: "నమస్తేస్తు మహామాయే శ్రీపీఠే సురపూజితే | శంఖచక్ర గదాహస్తే మహాలక్ష్మి నమోస్తుతే ||",
      recommendedStotram: "Sri Suktam, Kanakadhara Stotram & Lakshmi Ashtakam",
      bestChantingGuide: "Chanting Sri Suktam and Kanakadhara Stotram during dusk with ghee lamps lit at the doorstep invites Mahalakshmi's permanent auspicious presence into the home."
    },
    suggestedOfferings: "Chakkara Pongali, Purnam Boorelu, Ksheerannam, and Dry Fruits Laddu.",
    suggestedItems: "Pink Lotus, Bilva leaves, Gold/Silver coins, Betel leaves & nuts, and Red vastram.",
    standardActivities: "Sri Suktam Parayanam, Lakshmi Ashtottara Shata Namavali Kumkumarchana, and grand Deeparadhana.",
    significance: "Removes poverty and financial obstacles while inviting sustainable prosperity and peace.",
    dualSessionNote: {
      isCommonlyDual: false,
      morningAlankarana: "Sri Maha Lakshmi Sahasra Deeparadhana",
      eveningAlankarana: "Dhana Lakshmi & Dhanya Lakshmi Archana",
      sessionGuide: "Special coin archana (Swarna / Rajata Pushpa Archana) is performed in the morning, and 108 oil lamps are lit across the mandapam in the evening."
    }
  },
  {
    dayNumber: 8,
    date: "2026-10-18",
    deviName: "Sri Durga Devi",
    teluguDeviName: "శ్రీ దుర్గా దేవి",
    hindiDeviName: "श्री दुर्गा देवी",
    colorName: "Royal Purple / ఊదా / बैंगनी",
    colorHex: "#7E22CE",
    imageUrl: navaratriAsset("/navaratri/assets/durga-devi-alankarana.jpg"),
    description: "Worshipped on sacred Durgashtami as the mighty lion-rider; the universal warrior mother who protects righteousness and eliminates all hardships.",
    whyWeCelebrate: "Celebrated on sacred Maha Durgashtami. Armed with divine weapons bestowed by Brahma, Vishnu, and Shiva, Durga symbolizes the triumph of Dharma over Adharma. Devotees pray to Mother Durga for protection from adversities, legal disputes, health issues, and to gain unshakeable mental courage.",
    sacredChanting: {
      moolaMantra: "ఓం దుం దుర్గాయై నమః (Om Dum Durgayai Namah)",
      sloka: "దుర్గే స్మృతా హరసి భీతిమశేషజంతోః | స్వస్థైః స్మృతా మతిమతీవ శుభాం దదాసి ||",
      recommendedStotram: "Sri Durga Kavacham, Devi Mahatmyam & Durga Ashtakam",
      bestChantingGuide: "Reciting Durga Kavacham or chanting Om Dum Durgayai Namah 108 times on Durgashtami provides a spiritual armor that safeguards from all directions."
    },
    suggestedOfferings: "Kadambam, Garelu (Vada with ginger), Bellam Kudumulu, and Coconuts.",
    suggestedItems: "Red Oleander (Ganneru), Lemon garlands, Trishulam decor, Camphor, and Red silk vastram.",
    standardActivities: "Maha Durgashtami Pooja, Chandi Parayanam, Kanya Pooja (kumari pooja), and grand Harathi.",
    significance: "Destroys evil forces, bestows courage in difficult times, and safeguards devotees against adversity.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Maha Durgashtami Special Pooja",
      eveningAlankarana: "Chandi Parayanam & Sandhi Pooja (Midnight Sandhya)",
      sessionGuide: "In major shrines, the critical Sandhi Pooja is conducted at the exact junction of Ashtami and Navami Tithis with great devotion."
    }
  },
  {
    dayNumber: 9,
    date: "2026-10-19",
    deviName: "Sri Mahishasura Mardhini Devi / Sri Kalika Devi",
    teluguDeviName: "శ్రీ మహిషాసుర మర్దిని దేవి / శ్రీ కాళికా దేవి",
    hindiDeviName: "श्री महिषासुर मर्दिनी देवी / श्री कालिका देवी",
    colorName: "Peacock Green / నెమలి ఆకుపచ్చ / मोरपंखी हरा",
    colorHex: "#0F766E",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-9-siddhidatri.jpg"),
    description: "Celebrated on Maha Navami as the victorious warrior who slew the demon Mahishasura, and Sri Kalika Devi who dispels ignorance, negativity, and fear.",
    whyWeCelebrate: "On Maha Navami, the supreme battle reached its peak where Devi pierced Mahishasura with her Trishula. This day marks the liberation of the three worlds. Devotees also worship their tools, machines, vehicles, and books (**Ayudha Pooja**) recognizing divine energy in their livelihoods and skills.",
    sacredChanting: {
      moolaMantra: "ఓం క్లీం కాళికాయై నమః | ఓం ఐం హ్రీం క్లీం చాముండాయై విచ్చే",
      sloka: "అయి గిరినందిని నందితమేదిని విశ్వవినోదిని నందినుతే | గిరివరవింధ్య శిరోధినివాసిని విష్ణువిలాసిని జిష్ణునుతే ||",
      recommendedStotram: "Sri Mahishasura Mardhini Stotram & Kalika Ashtakam",
      bestChantingGuide: "Chanting all 21 verses of Mahishasura Mardhini Stotram with rhythmic zeal generates tremendous positive energy, dispelling fear and laziness."
    },
    suggestedOfferings: "Allam Garelu, Tamarind Pulihora, Jaggery Sweet Pongali, and Whole Tender Coconut.",
    suggestedItems: "Kumkum, Red flowers, Lime garlands, Sandalwood, and Ayudha Pooja flowers & kumkum.",
    standardActivities: "Maha Navami Chandi Homa, Purnahuti, Ayudha Pooja (worship of vehicles and tools), and midnight Harathi.",
    significance: "Conquering internal enemies (arishadvargas) and celebrating the supreme triumph of righteousness.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Kalika Devi Alankarana & Ayudha Pooja",
      eveningAlankarana: "Sri Mahishasura Mardhini Devi Maha Harathi",
      sessionGuide: "Very commonly celebrated as 2 distinct avatharams: Sri Kalika Devi in the morning for Ayudha Pooja, and Sri Mahishasura Mardhini in the evening for victory celebrations."
    }
  },
  {
    dayNumber: 10,
    date: "2026-10-20",
    deviName: "Sri Raja Rajeshwari Devi",
    teluguDeviName: "శ్రీ రాజరాజేశ్వరి దేవి (విజయదశమి)",
    hindiDeviName: "श्री राजराजेश्वरी देवी (विजयदशमी)",
    colorName: "Royal Saffron / కాషాయం / केसरिया",
    colorHex: "#B45309",
    imageUrl: navaratriAsset("/navaratri/assets/navadurga/day-10-vijayadashami.jpg"),
    description: "The serene, all-compassionate mother seated on the imperial throne on Vijaya Dashami, bestowing peace, fulfillment, nobility, and ultimate victory.",
    whyWeCelebrate: "Vijaya Dashami (Dasara) is the day of total victory. Having restored cosmic harmony, Mother Raja Rajeshwari sits peacefully on her throne holding sugarcane bow and flower arrows, showering grace. Devotees perform **Shami Pooja (Jammi Chettu pooja)** and start new businesses, education, and vehicles on this most auspicious day.",
    sacredChanting: {
      moolaMantra: "ఓం శ్రీం హ్రీం క్లీం ఐం సౌః శ్రీ రాజరాజేశ్వర్యై నమః (Om Shreem Hreem Kleem Aim Sauh Sri Raja Rajeshwaryai Namah)",
      sloka: "అంబా శాంభవి చంద్రమౌళి రబలా పర్ణా ఉమా పార్వతీ | కాళీ హైమవతీ శివా త్రినయనీ కాత్యాయనీ భైరవీ ||",
      recommendedStotram: "Sri Raja Rajeshwari Ashtakam & Aparajita Stotram",
      bestChantingGuide: "Recite during Shami Pooja in the evening. Devotees exchange Jammi leaves with elders to receive blessings for health, wealth, and continuous success in all ventures."
    },
    suggestedOfferings: "Jalebi, Bellam Appalu, Laddu, Chakkara Pongali, and Grand Maha Prasadam.",
    suggestedItems: "Jammi (Shami) leaves, Golden Yellow/Red silk vastram, Lotus flowers, and Sweets for distribution.",
    standardActivities: "Vijaya Dashami special pooja, Shami Pooja (Jammi Chettu pooja), distribution of Jammi leaves, Aparajita Pooja, and Teppotsavam / Shobhayatra.",
    significance: "The celebration of total victory of good over evil, bringing success to new ventures and auspicious beginnings.",
    dualSessionNote: {
      isCommonlyDual: true,
      morningAlankarana: "Sri Raja Rajeshwari Devi Rajabhishekam & Aparajita Pooja",
      eveningAlankarana: "Shami Pooja (Jammi Chettu) & Grand Shobhayatra / Nimarjanam",
      sessionGuide: "Morning features royal Devi Abhishekam, while late evening is celebrated with community Shami (Jammi) leaf exchanges and festive boat / chariot processions."
    }
  }
];
