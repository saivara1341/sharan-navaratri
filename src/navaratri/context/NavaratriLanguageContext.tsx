import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "te" | "hi" | "ta" | "ml" | "kn";

export interface Translations {
  appName: string;
  tagline: string;
  home: string;
  explore: string;
  know: string;
  nearMe: string;
  following: string;
  services: string;
  activities: string;
  annadanam: string;
  pallakiSeva: string;
  dheeksha: string;
  nimarjanam: string;
  myBookings: string;
  myReminders: string;
  askQuestion: string;
  registerMandapam: string;
  mandapamLogin: string;
  organizerPortal: string;
  adminPortal: string;
  todayDarshan: string;
  today: string;
  tomorrow: string;
  tomorrowPrep: string;
  poojaTimings: string;
  naivedhyam: string;
  prasadam: string;
  itemsToBring: string;
  nineDaySchedule: string;
  verifiedMandapam: string;
  directions: string;
  share: string;
  follow: string;
  followingBtn: string;
  bookService: string;
  scanQr: string;
  exploreMandapams: string;
  searchPlaceholder: string;
  filterBy: string;
  allCities: string;
  openToday: string;
  annadanamToday: string;
  pallakiLive: string;
  sponsored: string;
  advertiseWithUs: string;
  supportLocal: string;
  walkInRegister: string;
  addWalkIn: string;
  slotFull: string;
  confirmed: string;
  bookingSuccess: string;
  remindMe: string;
  uploadAlankarana: string;
  publishAnnouncement: string;
}

const DICTIONARY: Record<LanguageCode, Translations> = {
  en: {
    appName: "Navaratri Mandapam",
    tagline: "One QR. Every Mandapam. Everything a devotee needs.",
    home: "Home",
    explore: "Explore",
    know: "Know",
    nearMe: "Near Me",
    following: "Following",
    services: "Services",
    activities: "Activities & Events",
    annadanam: "Annadanam",
    pallakiSeva: "Pallaki Seva",
    dheeksha: "Dheeksha",
    nimarjanam: "Nimarjanam",
    myBookings: "My Bookings",
    myReminders: "My Reminders",
    askQuestion: "Ask a Question",
    registerMandapam: "Register Mandapam",
    mandapamLogin: "Login as Mandapam",
    organizerPortal: "Organizer Portal",
    adminPortal: "Admin HQ",
    todayDarshan: "Today's Maa Darshan",
    today: "Today",
    tomorrow: "Tomorrow",
    tomorrowPrep: "Tomorrow's Preparation",
    poojaTimings: "Pooja Timings",
    naivedhyam: "Naivedhyam",
    prasadam: "Prasadam",
    itemsToBring: "Items to Bring",
    nineDaySchedule: "9-Day Navaratri Schedule",
    verifiedMandapam: "Verified Mandapam",
    directions: "Directions",
    share: "Share",
    follow: "Follow",
    followingBtn: "Following",
    bookService: "Book Service",
    scanQr: "Scan Mandapam QR",
    exploreMandapams: "Explore Mandapams",
    searchPlaceholder: "Search Mandapam, area, city or Devi...",
    filterBy: "Filter by",
    allCities: "All Cities",
    openToday: "Open Today",
    annadanamToday: "Annadanam Today",
    pallakiLive: "Pallaki Live Tracking",
    sponsored: "Sponsored Discovery",
    advertiseWithUs: "Advertise With Us",
    supportLocal: "Support Local Businesses",
    walkInRegister: "Walk-In Register",
    addWalkIn: "Add Walk-In",
    slotFull: "Slot Full",
    confirmed: "Confirmed",
    bookingSuccess: "Booking Confirmed Successfully",
    remindMe: "Remind Me",
    uploadAlankarana: "Upload Daily Alankarana",
    publishAnnouncement: "Publish Announcement"
  },
  te: {
    appName: "నవరాత్రి మండపం",
    tagline: "ఒకే QR. ప్రతి మండపం. భక్తులకు కావాల్సిన సర్వస్వం.",
    home: "హోమ్",
    explore: "అన్వేషణ",
    know: "తెలుసుకోండి",
    nearMe: "నా దగ్గరలో",
    following: "నేను ఫాలో అయ్యేవి",
    services: "సేవలు & పూజలు",
    activities: "కార్యక్రమాలు & వేడుకలు",
    annadanam: "అన్నదానం",
    pallakiSeva: "పల్లకీ సేవ",
    dheeksha: "భవాని దీక్ష",
    nimarjanam: "నిమజ్జనం",
    myBookings: "నా బుకింగ్స్",
    myReminders: "నా రిమైండర్స్",
    askQuestion: "ప్రశ్న అడగండి",
    registerMandapam: "మండపం నమోదు చేయండి",
    mandapamLogin: "మండపం లాగిన్",
    organizerPortal: "నిర్వాహకుల లాగిన్",
    adminPortal: "అడ్మిన్ హెచ్‌క్యూ",
    todayDarshan: "నేటి అమ్మవారి దర్శనం",
    today: "నేడు",
    tomorrow: "రేపు",
    tomorrowPrep: "రేపటి సన్నాహాలు",
    poojaTimings: "పూజా సమయాలు",
    naivedhyam: "నైవేద్యం",
    prasadam: "ప్రసాదం",
    itemsToBring: "భక్తులు తేవాల్సిన పూజా ద్రవ్యాలు",
    nineDaySchedule: "నవరాత్రి 9 రోజుల వివరాలు",
    verifiedMandapam: "ధృవీకరించబడిన మండపం",
    directions: "దారి / లొకేషన్",
    share: "షేర్ చేయండి",
    follow: "ఫాలో అవ్వండి",
    followingBtn: "ఫాలో అవుతున్నారు",
    bookService: "సేవ బుక్ చేయండి",
    scanQr: "QR కోడ్ స్కాన్ చేయండి",
    exploreMandapams: "మండపాలను చూడండి",
    searchPlaceholder: "మండపం పేరు, ప్రాంతం, ఊరు లేదా దేవి రూపం వెతకండి...",
    filterBy: "ఫిల్టర్",
    allCities: "అన్ని నగరాలు",
    openToday: "ఈరోజు తెరిచి ఉంది",
    annadanamToday: "నేడు అన్నదానం",
    pallakiLive: "పల్లకీ సేవ లైవ్ ట్రాకింగ్",
    sponsored: "స్థానిక ప్రకటన / స్పాన్సర్డ్",
    advertiseWithUs: "వ్యాపార ప్రకటన ఇవ్వండి",
    supportLocal: "స్థానిక వ్యాపారాలను ఆదరించండి",
    walkInRegister: "వాక్-ఇన్ రిజిస్టర్",
    addWalkIn: "వాక్-ఇన్ నమోదు",
    slotFull: "స్లాట్ నిండినది",
    confirmed: "ఖరారైనది",
    bookingSuccess: "బుకింగ్ విజయవంతంగా నమోదైనది",
    remindMe: "గుర్తుచేయండి (రిమైండర్)",
    uploadAlankarana: "నేటి అలంకరణ ఫోటో అప్‌లోడ్",
    publishAnnouncement: "ముఖ్య ప్రకటన జారీ చేయండి"
  },
  hi: {
    appName: "नवरात्रि मंडपम",
    tagline: "एक क्यूआर. हर मंडप. भक्त के लिए सब कुछ.",
    home: "होम",
    explore: "खोजें",
    know: "जानें",
    nearMe: "मेरे पास",
    following: "फॉलो किए गए",
    services: "सेवाएं व पूजा",
    activities: "कार्यक्रम व गतिविधियां",
    annadanam: "अन्नदानम् / भंडारा",
    pallakiSeva: "पालकी सेवा",
    dheeksha: "भवानी दीक्षा",
    nimarjanam: "विसर्जन / निमज्जनम्",
    myBookings: "मेरी बुकिंग्स",
    myReminders: "स्मरणपत्र",
    askQuestion: "प्रश्न पूछें",
    registerMandapam: "मंडप पंजीकृत करें",
    mandapamLogin: "मंडप लॉगिन",
    organizerPortal: "आयोजक पोर्टल",
    adminPortal: "एडमिन मुख्यालय",
    todayDarshan: "आज का माँ दर्शन",
    today: "आज",
    tomorrow: "कल",
    tomorrowPrep: "कल की तैयारी",
    poojaTimings: "पूजा का समय",
    naivedhyam: "नैवेद्यम् / भोग",
    prasadam: "प्रसाद",
    itemsToBring: "भक्तों द्वारा लाई जाने वाली सामग्री",
    nineDaySchedule: "नवरात्रि 9 दिवसीय कार्यक्रम",
    verifiedMandapam: "सत्यापित मंडप",
    directions: "दिशा-निर्देश",
    share: "साझा करें",
    follow: "फॉलो करें",
    followingBtn: "फॉलो किया गया",
    bookService: "सेवा बुक करें",
    scanQr: "क्यूआर स्कैन करें",
    exploreMandapams: "मंडप देखें",
    searchPlaceholder: "मंडप का नाम, क्षेत्र, शहर या देवी रूप खोजें...",
    filterBy: "फ़िल्टर",
    allCities: "सभी शहर",
    openToday: "आज खुला है",
    annadanamToday: "आज अन्नदानम् / भंडारा",
    pallakiLive: "पालकी सेवा लाइव स्थिति",
    sponsored: "प्रायोजित स्थानीय खोज",
    advertiseWithUs: "विज्ञापन दें",
    supportLocal: "स्थानीय व्यवसायों का सहयोग करें",
    walkInRegister: "वॉक-इन रजिस्टर",
    addWalkIn: "वॉक-इन जोड़ें",
    slotFull: "स्लॉट पूर्ण",
    confirmed: "पुष्ट",
    bookingSuccess: "बुकिंग सफलतापूर्वक संपन्न",
    remindMe: "याद दिलाएं",
    uploadAlankarana: "आज की श्रृंगार फोटो अपलोड करें",
    publishAnnouncement: "घोषणा जारी करें"
  },
  ta: {
    appName: "நவராத்திரி மண்டபம்", tagline: "ஒரே QR. எல்லா மண்டபங்களும். பக்தர்களுக்குத் தேவையான அனைத்தும்.",
    home: "முகப்பு", explore: "தேடுங்கள்", know: "அறிந்துகொள்ளுங்கள்", nearMe: "அருகில்", following: "பின்தொடர்பவை", services: "சேவைகள் & பூஜைகள்",
    activities: "நிகழ்ச்சிகள் & போட்டிகள்", annadanam: "அன்னதானம்", pallakiSeva: "பல்லக்கு சேவை", dheeksha: "தீட்சை", nimarjanam: "விசர்ஜனம்",
    myBookings: "என் முன்பதிவுகள்", myReminders: "நினைவூட்டல்கள்", askQuestion: "கேள்வி கேளுங்கள்", registerMandapam: "மண்டபத்தைப் பதிவு செய்க",
    mandapamLogin: "மண்டபம் உள்நுழைவு", organizerPortal: "நிர்வாகி தளம்", adminPortal: "நிர்வாக மையம்", todayDarshan: "இன்றைய அம்மன் தரிசனம்", today: "இன்று", tomorrow: "நாளை",
    tomorrowPrep: "நாளைய தயாரிப்பு", poojaTimings: "பூஜை நேரங்கள்", naivedhyam: "நைவேத்தியம்", prasadam: "பிரசாதம்", itemsToBring: "கொண்டு வர வேண்டியவை",
    nineDaySchedule: "9 நாள் நவராத்திரி அட்டவணை", verifiedMandapam: "சரிபார்க்கப்பட்ட மண்டபம்", directions: "வழிகாட்டி", share: "பகிரவும்",
    follow: "பின்தொடரவும்", followingBtn: "பின்தொடர்கிறது", bookService: "சேவையைப் பதிவு செய்க", scanQr: "மண்டப QR-ஐ ஸ்கேன் செய்க",
    exploreMandapams: "மண்டபங்களைப் பாருங்கள்", searchPlaceholder: "மண்டபம், பகுதி, நகரம் அல்லது அம்மனைத் தேடுங்கள்...", filterBy: "வடிகட்டி",
    allCities: "அனைத்து நகரங்கள்", openToday: "இன்று திறந்திருக்கும்", annadanamToday: "இன்று அன்னதானம்", pallakiLive: "பல்லக்கு நேரலை",
    sponsored: "விளம்பரம்", advertiseWithUs: "எங்களுடன் விளம்பரம் செய்க", supportLocal: "உள்ளூர் வணிகங்களை ஆதரிக்கவும்", walkInRegister: "நேரடி வருகைப் பதிவு",
    addWalkIn: "வருகையைச் சேர்க்கவும்", slotFull: "இடங்கள் நிரம்பின", confirmed: "உறுதி செய்யப்பட்டது", bookingSuccess: "முன்பதிவு வெற்றிகரமாக உறுதி செய்யப்பட்டது",
    remindMe: "நினைவூட்டவும்", uploadAlankarana: "தினசரி அலங்காரத்தைப் பதிவேற்றவும்", publishAnnouncement: "அறிவிப்பை வெளியிடவும்"
  },
  ml: {
    appName: "നവരാത്രി മണ്ഡപം", tagline: "ഒരു QR. എല്ലാ മണ്ഡപങ്ങളും. ഭക്തർക്കാവശ്യമായ എല്ലാം.",
    home: "ഹോം", explore: "കണ്ടെത്തുക", know: "അറിയുക", nearMe: "സമീപത്ത്", following: "പിന്തുടരുന്നവ", services: "സേവനങ്ങളും പൂജകളും",
    activities: "പരിപാടികളും മത്സരങ്ങളും", annadanam: "അന്നദാനം", pallakiSeva: "പല്ലക്കി സേവ", dheeksha: "ദീക്ഷ", nimarjanam: "നിമജ്ജനം",
    myBookings: "എന്റെ ബുക്കിങ്ങുകൾ", myReminders: "ഓർമ്മപ്പെടുത്തലുകൾ", askQuestion: "ചോദ്യം ചോദിക്കുക", registerMandapam: "മണ്ഡപം രജിസ്റ്റർ ചെയ്യുക",
    mandapamLogin: "മണ്ഡപം ലോഗിൻ", organizerPortal: "സംഘാടക പോർട്ടൽ", adminPortal: "അഡ്മിൻ കേന്ദ്രം", todayDarshan: "ഇന്നത്തെ അമ്മ ദർശനം", today: "ഇന്ന്", tomorrow: "നാളെ",
    tomorrowPrep: "നാളത്തെ ഒരുക്കം", poojaTimings: "പൂജാ സമയം", naivedhyam: "നൈവേദ്യം", prasadam: "പ്രസാദം", itemsToBring: "കൊണ്ടുവരേണ്ട സാധനങ്ങൾ",
    nineDaySchedule: "9 ദിവസത്തെ നവരാത്രി ക്രമം", verifiedMandapam: "സ്ഥിരീകരിച്ച മണ്ഡപം", directions: "വഴി", share: "പങ്കിടുക",
    follow: "പിന്തുടരുക", followingBtn: "പിന്തുടരുന്നു", bookService: "സേവനം ബുക്ക് ചെയ്യുക", scanQr: "മണ്ഡപ QR സ്കാൻ ചെയ്യുക",
    exploreMandapams: "മണ്ഡപങ്ങൾ കാണുക", searchPlaceholder: "മണ്ഡപം, പ്രദേശം, നഗരം അല്ലെങ്കിൽ ദേവിയെ തിരയുക...", filterBy: "ഫിൽട്ടർ",
    allCities: "എല്ലാ നഗരങ്ങളും", openToday: "ഇന്ന് തുറന്നിരിക്കുന്നു", annadanamToday: "ഇന്ന് അന്നദാനം", pallakiLive: "പല്ലക്കി തത്സമയം",
    sponsored: "സ്പോൺസർ ചെയ്തത്", advertiseWithUs: "പരസ്യം നൽകുക", supportLocal: "പ്രാദേശിക വ്യാപാരങ്ങളെ പിന്തുണയ്ക്കുക", walkInRegister: "വാക്ക്-ഇൻ രജിസ്റ്റർ",
    addWalkIn: "വരവ് ചേർക്കുക", slotFull: "സ്ലോട്ട് നിറഞ്ഞു", confirmed: "സ്ഥിരീകരിച്ചു", bookingSuccess: "ബുക്കിംഗ് വിജയകരമായി സ്ഥിരീകരിച്ചു",
    remindMe: "ഓർമ്മിപ്പിക്കുക", uploadAlankarana: "ദൈനംദിന അലങ്കാരം അപ്‌ലോഡ് ചെയ്യുക", publishAnnouncement: "അറിയിപ്പ് പ്രസിദ്ധീകരിക്കുക"
  },
  kn: {
    appName: "ನವರಾತ್ರಿ ಮಂಟಪ", tagline: "ಒಂದು QR. ಎಲ್ಲ ಮಂಟಪಗಳು. ಭಕ್ತರಿಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ.",
    home: "ಮುಖಪುಟ", explore: "ಹುಡುಕಿ", know: "ತಿಳಿಯಿರಿ", nearMe: "ನನ್ನ ಹತ್ತಿರ", following: "ಅನುಸರಿಸುವವು", services: "ಸೇವೆಗಳು ಮತ್ತು ಪೂಜೆಗಳು",
    activities: "ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಸ್ಪರ್ಧೆಗಳು", annadanam: "ಅನ್ನದಾನ", pallakiSeva: "ಪಲ್ಲಕ್ಕಿ ಸೇವೆ", dheeksha: "ದೀಕ್ಷೆ", nimarjanam: "ವಿಸರ್ಜನೆ",
    myBookings: "ನನ್ನ ಬುಕ್ಕಿಂಗ್‌ಗಳು", myReminders: "ಜ್ಞಾಪನೆಗಳು", askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ", registerMandapam: "ಮಂಟಪ ನೋಂದಾಯಿಸಿ",
    mandapamLogin: "ಮಂಟಪ ಲಾಗಿನ್", organizerPortal: "ಆಯೋಜಕರ ಪೋರ್ಟಲ್", adminPortal: "ನಿರ್ವಾಹಕ ಕೇಂದ್ರ", todayDarshan: "ಇಂದಿನ ದೇವಿ ದರ್ಶನ", today: "ಇಂದು", tomorrow: "ನಾಳೆ",
    tomorrowPrep: "ನಾಳೆಯ ಸಿದ್ಧತೆ", poojaTimings: "ಪೂಜೆಯ ಸಮಯ", naivedhyam: "ನೈವೇದ್ಯ", prasadam: "ಪ್ರಸಾದ", itemsToBring: "ತರಬೇಕಾದ ಸಾಮಗ್ರಿಗಳು",
    nineDaySchedule: "9 ದಿನಗಳ ನವರಾತ್ರಿ ವೇಳಾಪಟ್ಟಿ", verifiedMandapam: "ಪರಿಶೀಲಿಸಿದ ಮಂಟಪ", directions: "ದಾರಿ", share: "ಹಂಚಿಕೊಳ್ಳಿ",
    follow: "ಅನುಸರಿಸಿ", followingBtn: "ಅನುಸರಿಸಲಾಗುತ್ತಿದೆ", bookService: "ಸೇವೆ ಬುಕ್ ಮಾಡಿ", scanQr: "ಮಂಟಪ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    exploreMandapams: "ಮಂಟಪಗಳನ್ನು ನೋಡಿ", searchPlaceholder: "ಮಂಟಪ, ಪ್ರದೇಶ, ನಗರ ಅಥವಾ ದೇವಿಯನ್ನು ಹುಡುಕಿ...", filterBy: "ಫಿಲ್ಟರ್",
    allCities: "ಎಲ್ಲ ನಗರಗಳು", openToday: "ಇಂದು ತೆರೆದಿದೆ", annadanamToday: "ಇಂದು ಅನ್ನದಾನ", pallakiLive: "ಪಲ್ಲಕ್ಕಿ ನೇರ ಪ್ರಸಾರ",
    sponsored: "ಪ್ರಾಯೋಜಿತ", advertiseWithUs: "ಜಾಹೀರಾತು ನೀಡಿ", supportLocal: "ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಗಳನ್ನು ಬೆಂಬಲಿಸಿ", walkInRegister: "ನೇರ ಭೇಟಿ ನೋಂದಣಿ",
    addWalkIn: "ಭೇಟಿ ಸೇರಿಸಿ", slotFull: "ಸ್ಲಾಟ್ ತುಂಬಿದೆ", confirmed: "ದೃಢೀಕರಿಸಲಾಗಿದೆ", bookingSuccess: "ಬುಕ್ಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    remindMe: "ನೆನಪಿಸಿ", uploadAlankarana: "ದೈನಂದಿನ ಅಲಂಕಾರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", publishAnnouncement: "ಪ್ರಕಟಣೆ ಪ್ರಕಟಿಸಿ"
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const NavaratriLanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: DICTIONARY.en
});

export const NavaratriLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem("navaratri_lang") as LanguageCode;
      if (saved && Object.prototype.hasOwnProperty.call(DICTIONARY, saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return "en";
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("navaratri_lang", lang);
    } catch {
      // ignore
    }
  };

  return (
    <NavaratriLanguageContext.Provider value={{ language, setLanguage, t: DICTIONARY[language] }}>
      {children}
    </NavaratriLanguageContext.Provider>
  );
};

export const useNavaratriLanguage = () => useContext(NavaratriLanguageContext);
