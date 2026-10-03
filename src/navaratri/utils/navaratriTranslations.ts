import { LanguageCode } from "../context/NavaratriLanguageContext";
import { Activity, Service } from "../types";

/**
 * Complete, seamless multi-language translation and localization dictionary
 * for Sharad Navaratri (en, te, hi, ta, ml, kn).
 */

// 1. Invocation Ribbon
export const INVOCATION_TRANSLATIONS: Record<LanguageCode, string> = {
  en: "॥ Om Sri Matre Namaha ॥",
  te: "॥ ॐ శ్రీ మాత్రే నమః ॥",
  hi: "॥ ॐ श्री मात्रे नमः ॥",
  ta: "॥ ஓம் ஸ்ரீ மாத்ரே நமஹ ॥",
  ml: "॥ ॐ ശ്രീ മാത്രേ നമഃ ॥",
  kn: "॥ ॐ ಶ್ರೀ ಮಾತ್ರೇ ನಮಃ ॥"
};

// 2. Footer Sloka
export const FOOTER_SLOKA_TRANSLATIONS: Record<LanguageCode, string> = {
  en: "॥ Om Sri Matre Namaha ॥ • Sarva Mangala Mangalye Shive Sarvartha Sadhike",
  te: "॥ ॐ శ్రీ మాత్రే నమః ॥ • సర్వమంగళ మాంగల్యే శివే సర్వార్థ సాధికే",
  hi: "॥ ॐ श्री मात्रे नमः ॥ • सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके",
  ta: "॥ ஓம் ஸ்ரீ மாத்ரே நமஹ ॥ • சர்வமங்கள மாங்கல்யே சிவே சர்வார்த்த சாதிகே",
  ml: "॥ ॐ ശ്രീ മാത്രേ നമഃ ॥ • സർവ്വമംഗള മാംഗല്യേ ശിവേ സർവ്വാർത്ഥ സാധികേ",
  kn: "॥ ॐ ಶ್ರೀ ಮಾತ್ರೇ ನಮಃ ॥ • ಸರ್ವಮಂಗಳ ಮಾಂಗಲ್ಯೇ ಶಿವೇ ಸರ್ವಾರ್ಥ ಸಾಧಿಕೇ"
};

// 3. Ad Space Placeholder
export const AD_PLACEHOLDER_TRANSLATIONS: Record<LanguageCode, string> = {
  en: "Ad Space Available (Tap to add image & run ad)",
  te: "ప్రకటన స్థలం అందుబాటులో ఉంది (చిత్రం జోడించి ప్రకటన ఇవ్వండి)",
  hi: "विज्ञापन स्थान उपलब्ध है (छवि जोड़ें व विज्ञापन चलाएँ)",
  ta: "விளம்பர இடம் உள்ளது (படத்தைச் சேர்த்து விளம்பரம் செய்க)",
  ml: "പരസ്യ സ്ഥലം ലഭ്യമാണ് (ചിത്രം ചേർത്ത് പരസ്യം നൽകുക)",
  kn: "ಜಾಹೀರಾತು ಸ್ಥಳ ಲಭ್ಯವಿದೆ (ಚಿತ್ರ ಸೇರಿಸಿ ಜಾಹೀರಾತು ಚಲಾಯಿಸಿ)"
};

// 4. Header Titles
export const HEADER_SUBTITLE_TRANSLATIONS: Record<LanguageCode, string> = {
  en: "Nizamabad & Telangana",
  te: "నిజామాబాద్ & తెలంగాణ",
  hi: "निज़ामाबाद एवं तेलंगाना",
  ta: "நிசாமாபாத் & தெலங்கானா",
  ml: "നിസാമാബാദ് & തെലങ്കാന",
  kn: "ನಿಜಾಮಾಬಾದ್ ಮತ್ತು ತೆಲಂಗಾಣ"
};

// 5. Mandapam Name & Location Translations
const MANDAPAM_NAMES: Record<string, Record<LanguageCode, string>> = {
  "hrudhaya ragu ram youth": {
    en: "hrudhaya ragu ram youth",
    te: "హృదయ రఘు రామ్ యూత్",
    hi: "हृदय रघु राम यूथ",
    ta: "ஹ்ருதய ரகு ராம் யூத்",
    ml: "ഹൃദയ രഘു റാം യൂത്ത്",
    kn: "ಹೃದಯ ರಘು ರಾಮ್ ಯೂತ್"
  },
  "Hrudhaya Ragu Ram Youth": {
    en: "Hrudhaya Ragu Ram Youth",
    te: "హృదయ రఘు రామ్ యూత్",
    hi: "हृदय रघु राम यूथ",
    ta: "ஹ்ருதய ரகு ராம் யூத்",
    ml: "ഹൃദയ രഘു റാം യൂത്ത്",
    kn: "ಹೃದಯ ರಘು ರಾಮ್ ಯೂತ್"
  },
  "Sri Durga Bhavani Bhakta Mandali": {
    en: "Sri Durga Bhavani Bhakta Mandali",
    te: "శ్రీ దుర్గా భవాని భక్త మండలి",
    hi: "श्री दुर्गा भवानी भक्त मंडली",
    ta: "ஸ்ரீ துர்கா பவானி பக்த மண்டலி",
    ml: "ശ്രീ ദുർഗ്ഗാ ഭവാനി ഭക്ത മണ്ഡലി",
    kn: "ಶ್ರೀ ದುರ್ಗಾ ಭವಾನಿ ಭಕ್ತ ಮಂಡಳಿ"
  },
  "Bhagyanagar Mahila Shakthi Utsav": {
    en: "Bhagyanagar Mahila Shakthi Utsav",
    te: "భాగ్యనగర్ మహిళా శక్తి ఉత్సవం",
    hi: "भाग्यनगर महिला शक्ति उत्सव",
    ta: "பாக்யநகர் மகிளா சக்தி உற்சவம்",
    ml: "ഭാഗ്യനഗർ മഹിളാ ശക്തി ഉത്സവം",
    kn: "ಭಾಗ್ಯನಗರ ಮಹಿಳಾ ಶಕ್ತಿ ಉತ್ಸವ"
  }
};

const ADDRESS_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  "3-5-260/2, shivaji nagar rd, kotagally, Nizamabad, Nizamabad": {
    en: "3-5-260/2, shivaji nagar rd, kotagally, Nizamabad, Nizamabad",
    te: "3-5-260/2, శివాజీ నగర్ రోడ్డు, కోటాగల్లీ, నిజామాబాద్, నిజామాబాద్",
    hi: "3-5-260/2, शिवाजी नगर रोड, कोटागल्ली, निज़ामाबाद, निज़ामाबाद",
    ta: "3-5-260/2, சிவாஜி நகர் சாலை, கோட்டாகல்லி, நிசாமாபாத், நிசாமாபாத்",
    ml: "3-5-260/2, ശിവാജി നഗർ റോഡ്, കോട്ടാഗല്ലി, നിസാമാബാദ്, നിസാമാബാദ്",
    kn: "3-5-260/2, ಶಿವಾಜಿ ನಗರ ರಸ್ತೆ, ಕೋಟಾಗಲ್ಲಿ, ನಿಜಾಮಾಬಾದ್, ನಿಜಾಮಾಬಾದ್"
  }
};

export const getTranslatedMandapamName = (name: string, lang: LanguageCode): string => {
  if (lang === "en") return name;
  const match = MANDAPAM_NAMES[name] || MANDAPAM_NAMES[name.trim()] || MANDAPAM_NAMES[name.toLowerCase()];
  return match?.[lang] || name;
};

export const getTranslatedAddress = (address: string, lang: LanguageCode): string => {
  if (lang === "en") return address;
  const match = ADDRESS_TRANSLATIONS[address] || ADDRESS_TRANSLATIONS[address.trim()];
  return match?.[lang] || address;
};

// 6. Organizer Section Labels
export const getTranslatedOrganizerLabels = (lang: LanguageCode) => {
  switch (lang) {
    case "te":
      return {
        committee: "మండపం నిర్వాహకులు / కమిటీ",
        contactBadge: "అధికారిక సంప్రదింపు",
        leadRole: "యూత్ కమిటీ బాధ్యులు",
        callBtn: "కాల్ చేయండి",
        whatsappBtn: "💬 వాట్సాప్",
        greeting: "నమస్కారం, మండపం గురించి సంప్రదిస్తున్నాను."
      };
    case "hi":
      return {
        committee: "मंडप आयोजक / समिति",
        contactBadge: "आधिकारिक संपर्क",
        leadRole: "युवा समिति प्रमुख",
        callBtn: "कॉल करें",
        whatsappBtn: "💬 व्हाट्सएप",
        greeting: "नमस्ते, मंडप के संबंध में संपर्क कर रहे हैं।"
      };
    case "ta":
      return {
        committee: "மண்டப நிர்வாகி / குழு",
        contactBadge: "அதிகாரப்பூர்வ தொடர்பு",
        leadRole: "இளைஞர் குழு தலைவர்",
        callBtn: "அழைக்கவும்",
        whatsappBtn: "💬 வாட்ஸ்அப்",
        greeting: "வணக்கம், மண்டப வருகை தொடர்பாக தொடர்பு கொள்கிறேன்."
      };
    case "ml":
      return {
        committee: "മണ്ഡപ സംഘാടകർ / കമ്മിറ്റി",
        contactBadge: "ഔദ്യോഗിക ബന്ധപ്പെടൽ",
        leadRole: "യൂത്ത് കമ്മിറ്റി ലീഡ്",
        callBtn: "വിളിക്കുക",
        whatsappBtn: "💬 വാട്ട്‌സ്ആപ്പ്",
        greeting: "നമസ്കാരം, മണ്ഡപ ദർശനം സംബന്ധിച്ച് ബന്ധപ്പെടുന്നു."
      };
    case "kn":
      return {
        committee: "ಮಂಟಪ ಆಯೋಜಕರು / ಸಮಿತಿ",
        contactBadge: "ಅಧಿಕೃತ ಸಂಪರ್ಕ",
        leadRole: "ಯುವ ಸಮಿತಿ ಮುಖಂಡರು",
        callBtn: "ಕರೆ ಮಾಡಿ",
        whatsappBtn: "💬 ವಾಟ್ಸಾಪ್",
        greeting: "ನಮಸ್ಕಾರ, ನವರಾತ್ರಿ ಮಂಟಪ ದರ್ಶನದ ಕುರಿತು ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದೇನೆ."
      };
    default:
      return {
        committee: "Mandapam Organizer / Committee",
        contactBadge: "Official Contact",
        leadRole: "Youth Committee Lead",
        callBtn: "Call",
        whatsappBtn: "💬 WhatsApp",
        greeting: "Namaste, visiting your Navaratri Mandapam."
      };
  }
};

// 7. 10 Divine Days Devi Names & Short Names
export interface LocalizedDeviInfo {
  fullName: string;
  shortName: string;
  morning: string;
  evening: string;
}

export const DEVI_DAYS_LOCALIZED: Record<number, Record<LanguageCode, LocalizedDeviInfo>> = {
  1: {
    en: { fullName: "Sri Bala Tripura Sundari Devi", shortName: "Bala Tripura...", morning: "Sri Bala Tripura Sundari Devi", evening: "Sri Gayatri Devi (Day 2 Transition)" },
    te: { fullName: "శ్రీ బాలా త్రిపుర సుందరి దేవి", shortName: "బాలా త్రిపుర...", morning: "శ్రీ బాలా త్రిపుర సుందరి దేవి", evening: "శ్రీ గాయత్రీ దేవి (2వ రోజు అలంకారం)" },
    hi: { fullName: "श्री बाला त्रिपुरा सुंदरी देवी", shortName: "बाला त्रिपुरा...", morning: "श्री बाला त्रिपुरा सुंदरी देवी", evening: "श्री गायत्री देवी (द्वितीय दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ பாலா திரிபுர சுந்தரி தேவி", shortName: "பாலா திரிபுர...", morning: "ஸ்ரீ பாலா திரிபுர சுந்தரி தேவி", evening: "ஸ்ரீ காயத்ரி தேவி (நாள் 2 மாற்றம்)" },
    ml: { fullName: "ശ്രീ ബാലാ ത്രിപുര സുന്ദരി ദേവി", shortName: "ബാലാ ത്രിപുര...", morning: "ശ്രീ ബാലാ ത്രിപുര സുന്ദരി ദേവി", evening: "ശ്രീ ഗായത്രീ ദേവി (ദിനം 2 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಬಾಲಾ ತ್ರಿಪುರ ಸುಂದರಿ ದೇವಿ", shortName: "ಬಾಲಾ ತ್ರಿಪುರ...", morning: "ಶ್ರೀ ಬಾಲಾ ತ್ರಿಪುರ ಸುಂದರಿ ದೇವಿ", evening: "ಶ್ರೀ ಗಾಯತ್ರೀ ದೇವಿ (ದಿನ 2 ಬದಲಾವಣೆ)" }
  },
  2: {
    en: { fullName: "Sri Gayatri Devi", shortName: "Gayatri Devi", morning: "Sri Gayatri Devi", evening: "Sri Annapurna Devi (Day 3 Transition)" },
    te: { fullName: "శ్రీ గాయత్రీ దేవి", shortName: "గాయత్రీ దేవి", morning: "శ్రీ గాయత్రీ దేవి", evening: "శ్రీ అన్నపూర్ణా దేవి (3వ రోజు అలంకారం)" },
    hi: { fullName: "श्री गायत्री देवी", shortName: "गायत्री देवी", morning: "श्री गायत्री देवी", evening: "श्री अन्नपूर्णा देवी (तृतीय दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ காயத்ரி தேவி", shortName: "காயத்ரி தேவி", morning: "ஸ்ரீ காயத்ரி தேவி", evening: "ஸ்ரீ அன்னபூர்ணா தேவி (நாள் 3 மாற்றம்)" },
    ml: { fullName: "ശ്രീ ഗായത്രീ ദേവി", shortName: "ഗായത്രീ ദേവി", morning: "ശ്രീ ഗായത്രീ ദേവി", evening: "ശ്രീ അന്നപൂർണ്ണാ ദേവി (ദിനം 3 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಗಾಯತ್ರೀ ದೇವಿ", shortName: "ಗಾಯತ್ರೀ ದೇವಿ", morning: "ಶ್ರೀ ಗಾಯತ್ರೀ ದೇವಿ", evening: "ಶ್ರೀ ಅನ್ನಪೂರ್ಣಾ ದೇವಿ (ದಿನ 3 ಬದಲಾವಣೆ)" }
  },
  3: {
    en: { fullName: "Sri Annapurna Devi", shortName: "Annapurna", morning: "Sri Annapurna Devi", evening: "Sri Maha Chandi Devi (Day 4 Transition)" },
    te: { fullName: "శ్రీ అన్నపూర్ణా దేవి", shortName: "అన్నపూర్ణా దేవి", morning: "శ్రీ అన్నపూర్ణా దేవి", evening: "శ్రీ మహా చండీ దేవి (4వ రోజు అలంకారం)" },
    hi: { fullName: "श्री अन्नपूर्णा देवी", shortName: "अन्नपूर्णा देवी", morning: "श्री अन्नपूर्णा देवी", evening: "श्री महा चंडी देवी (चतुर्थ दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ அன்னபூர்ணா தேவி", shortName: "அன்னபூர்ணா", morning: "ஸ்ரீ அன்னபூர்ணா தேவி", evening: "ஸ்ரீ மகா சண்டி தேவி (நாள் 4 மாற்றம்)" },
    ml: { fullName: "ശ്രീ അന്നപൂർണ്ണാ ദേവി", shortName: "അന്നപൂർണ്ണ", morning: "ശ്രീ അന്നപൂർണ്ണാ ദേവി", evening: "ശ്രീ മഹാ ചണ്ഡീ ദേവി (ദിനം 4 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಅನ್ನಪೂರ್ಣಾ ದೇವಿ", shortName: "ಅನ್ನಪೂರ್ಣಾ", morning: "ಶ್ರೀ ಅನ್ನಪೂರ್ಣಾ ದೇವಿ", evening: "ಶ್ರೀ ಮಹಾ ಚಂಡೀ ದೇವಿ (ದಿನ 4 ಬದಲಾವಣೆ)" }
  },
  4: {
    en: { fullName: "Sri Maha Chandi Devi", shortName: "Maha Chandi", morning: "Sri Maha Chandi Devi", evening: "Sri Lalitha Tripura Sundari (Day 5 Transition)" },
    te: { fullName: "శ్రీ మహా చండీ దేవి", shortName: "మహా చండీ దేవి", morning: "శ్రీ మహా చండీ దేవి", evening: "శ్రీ లలితా త్రిపుర సుందరి (5వ రోజు అలంకారం)" },
    hi: { fullName: "श्री महा चंडी देवी", shortName: "महा चंडी देवी", morning: "श्री महा चंडी देवी", evening: "श्री ललिता त्रिपुरा सुंदरी (पंचम दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ மகா சண்டி தேவி", shortName: "மகா சண்டி", morning: "ஸ்ரீ மகா சண்டி தேவி", evening: "ஸ்ரீ லலிதா திரிபுர சுந்தரி (நாள் 5 மாற்றம்)" },
    ml: { fullName: "ശ്രീ മഹാ ചണ്ഡീ ദേവി", shortName: "മഹാ ചണ്ഡീ", morning: "ശ്രീ മഹാ ചണ്ഡീ ദേവി", evening: "ശ്രീ ലളിതാ ത്രിപുര സുന്ദരി (ദിനം 5 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಮಹಾ ಚಂಡೀ ದೇವಿ", shortName: "ಮಹಾ ಚಂಡೀ", morning: "ಶ್ರೀ ಮಹಾ ಚಂಡೀ ದೇವಿ", evening: "ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರ ಸುಂದರಿ (ದಿನ 5 ಬದಲಾವಣೆ)" }
  },
  5: {
    en: { fullName: "Sri Lalitha Tripura Sundari Devi", shortName: "Lalitha Trip...", morning: "Sri Lalitha Tripura Sundari Devi", evening: "Sri Saraswati Devi (Day 6 Transition)" },
    te: { fullName: "శ్రీ లలితా త్రిపుర సుందరి దేవి", shortName: "లలితా త్రిపుర...", morning: "శ్రీ లలితా త్రిపుర సుందరి దేవి", evening: "శ్రీ సరస్వతీ దేవి (6వ రోజు అలంకారం)" },
    hi: { fullName: "श्री ललिता त्रिपुरा सुंदरी देवी", shortName: "ललिता त्रिपुरा...", morning: "श्री ललिता त्रिपुरा सुंदरी देवी", evening: "श्री सरस्वती देवी (षष्ठ दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ லலிதா திரிபுர சுந்தரி தேவி", shortName: "லலிதா திரிபுர...", morning: "ஸ்ரீ லலிதா திரிபுர சுந்தரி தேவி", evening: "ஸ்ரீ சரஸ்வதி தேவி (நாள் 6 மாற்றம்)" },
    ml: { fullName: "ശ്രീ ലളിതാ ത്രിപുര സുന്ദരി ദേവി", shortName: "ലളിതാ ത്രിപുര...", morning: "ശ്രീ ലളിതാ ത്രിപുര സുന്ദരി ദേവി", evening: "ശ്രീ സരസ്വതീ ദേവി (ദിനം 6 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರ ಸುಂದರಿ ದೇವಿ", shortName: "ಲಲಿತಾ ತ್ರಿಪುರ...", morning: "ಶ್ರೀ ಲಲಿತಾ ತ್ರಿಪುರ ಸುಂದರಿ ದೇವಿ", evening: "ಶ್ರೀ ಸರಸ್ವತೀ ದೇವಿ (ದಿನ 6 ಬದಲಾವಣೆ)" }
  },
  6: {
    en: { fullName: "Sri Maha Saraswati Devi", shortName: "Saraswati", morning: "Sri Maha Saraswati Devi (Moola Nakshatram)", evening: "Sri Maha Lakshmi Devi (Day 7 Transition)" },
    te: { fullName: "శ్రీ మహా సరస్వతీ దేవి", shortName: "సరస్వతీ దేవి", morning: "శ్రీ మహా సరస్వతీ దేవి (మూలా నక్షత్రం)", evening: "శ్రీ మహాలక్ష్మీ దేవి (7వ రోజు అలంకారం)" },
    hi: { fullName: "श्री महा सरस्वती देवी", shortName: "सरस्वती देवी", morning: "श्री महा सरस्वती देवी (मूल नक्षत्र)", evening: "श्री महालक्ष्मी देवी (सप्तम दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ மகா சரஸ்வதி தேவி", shortName: "சரஸ்வதி தேவி", morning: "ஸ்ரீ மகா சரஸ்வதி தேவி (மூல நட்சத்திரம்)", evening: "ஸ்ரீ மகாலட்சுமி தேவி (நாள் 7 மாற்றம்)" },
    ml: { fullName: "ശ്രീ മഹാ സരസ്വതീ ദേവി", shortName: "സരസ്വതീ ദേവി", morning: "ശ്രീ മഹാ സരസ്വതീ ദേവി (മൂലം നക്ഷത്രം)", evening: "ശ്രീ മഹാലക്ഷ്മീ ദേവി (ദിനം 7 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಮಹಾ ಸರಸ್ವತೀ ದೇವಿ", shortName: "ಸರಸ್ವತೀ ದೇವಿ", morning: "ಶ್ರೀ ಮಹಾ ಸರಸ್ವತೀ ದೇವಿ (ಮೂಲಾ ನಕ್ಷತ್ರ)", evening: "ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಿ (ದಿನ 7 ಬದಲಾವಣೆ)" }
  },
  7: {
    en: { fullName: "Sri Maha Lakshmi Devi", shortName: "Maha Lakshmi", morning: "Sri Maha Lakshmi Devi", evening: "Sri Durga Devi (Day 8 Transition)" },
    te: { fullName: "శ్రీ మహాలక్ష్మీ దేవి", shortName: "మహాలక్ష్మీ దేవి", morning: "శ్రీ మహాలక్ష్మీ దేవి", evening: "శ్రీ దుర్గా దేవి (8వ రోజు అలంకారం)" },
    hi: { fullName: "श्री महालक्ष्मी देवी", shortName: "महालक्ष्मी देवी", morning: "श्री महालक्ष्मी देवी", evening: "श्री दुर्गा देवी (अष्टम दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ மகாலட்சுமி தேவி", shortName: "மகாலட்சுமி", morning: "ஸ்ரீ மகாலட்சுமி தேவி", evening: "ஸ்ரீ துர்கா தேவி (நாள் 8 மாற்றம்)" },
    ml: { fullName: "ശ്രീ മഹാലക്ഷ്മീ ദേവി", shortName: "മഹാലക്ഷ്മീ", morning: "ശ്രീ മഹാലക്ഷ്മീ ദേവി", evening: "ശ്രീ ദുർഗ്ഗാ ദേവി (ദിനം 8 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಿ", shortName: "ಮಹಾಲಕ್ಷ್ಮೀ", morning: "ಶ್ರೀ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಿ", evening: "ಶ್ರೀ ದುರ್ಗಾ ದೇವಿ (ದಿನ 8 ಬದಲಾವಣೆ)" }
  },
  8: {
    en: { fullName: "Sri Durga Devi", shortName: "Durga Devi", morning: "Sri Durga Devi (Durgashtami)", evening: "Sri Mahishasura Mardhini (Day 9 Transition)" },
    te: { fullName: "శ్రీ దుర్గా దేవి", shortName: "దుర్గా దేవి", morning: "శ్రీ దుర్గా దేవి (దుర్గాష్టమి)", evening: "శ్రీ మహిషాసుర మర్దిని (9వ రోజు అలంకారం)" },
    hi: { fullName: "श्री दुर्गा देवी", shortName: "दुर्गा देवी", morning: "श्री दुर्गा देवी (दुर्गाष्टमी)", evening: "श्री महिषासुर मर्दिनी (नवम दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ துர்கா தேவி", shortName: "துர்கா தேவி", morning: "ஸ்ரீ துர்கா தேவி (துர்காஷ்டமி)", evening: "ஸ்ரீ மஹிஷாசுர மர்த்தினி (நாள் 9 மாற்றம்)" },
    ml: { fullName: "ശ്രീ ദുർഗ്ഗാ ദേവി", shortName: "ദുർഗ്ഗാ ദേവി", morning: "ശ്രീ ദുർഗ്ഗാ ദേവി (ദുർഗ്ഗാഷ്ടമി)", evening: "ശ്രീ മഹിഷാസുര മർദ്ദിനി (ദിനം 9 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ದುರ್ಗಾ ದೇವಿ", shortName: "ದುರ್ಗಾ ದೇವಿ", morning: "ಶ್ರೀ ದುರ್ಗಾ ದೇವಿ (ದುರ್ಗಾಷ್ಟಮಿ)", evening: "ಶ್ರೀ ಮಹಿಷಾಸುರ ಮರ್ಧಿನಿ (ದಿನ 9 ಬದಲಾವಣೆ)" }
  },
  9: {
    en: { fullName: "Sri Mahishasura Mardhini Devi", shortName: "Mahishasura...", morning: "Sri Mahishasura Mardhini Devi (Mahanavami)", evening: "Sri Raja Rajeshwari Devi (Day 10 Transition)" },
    te: { fullName: "శ్రీ మహిషాసుర మర్దిని దేవి", shortName: "మహిషాసుర...", morning: "శ్రీ మహిషాసుర మర్దిని దేవి (మహార్నవమి)", evening: "శ్రీ రాజరాజేశ్వరి దేవి (10వ రోజు అలంకారం)" },
    hi: { fullName: "श्री महिषासुर मर्दिनी देवी", shortName: "महिषासुर...", morning: "श्री महिषासुर मर्दिनी देवी (महानवमी)", evening: "श्री राजराजेश्वरी देवी (दशम दिन संक्रमण)" },
    ta: { fullName: "ஸ்ரீ மஹிஷாசுர மர்த்தினி தேவி", shortName: "மஹிஷாசுர...", morning: "ஸ்ரீ மஹிஷாசுர மர்த்தினி தேவி (மகாநவமி)", evening: "ஸ்ரீ ராஜராஜேஸ்வரி தேவி (நாள் 10 மாற்றம்)" },
    ml: { fullName: "ശ്രീ മഹിഷാസുര മർദ്ദിനി ദേവി", shortName: "മഹിഷാസുര...", morning: "ശ്രീ മഹിഷാസുര മർദ്ദിനി ദേവി (മഹാനവമി)", evening: "ശ്രീ രാജരാജേശ്വരി ദേവി (ദിനം 10 മാറ്റം)" },
    kn: { fullName: "ಶ್ರೀ ಮಹಿಷಾಸುರ ಮರ್ಧಿನಿ ದೇವಿ", shortName: "ಮಹಿಷಾಸುರ...", morning: "ಶ್ರೀ ಮಹಿಷಾಸುರ ಮರ್ಧಿನಿ ದೇವಿ (ಮಹಾನವಮಿ)", evening: "ಶ್ರೀ ರಾಜರಾಜೇಶ್ವರೀ ದೇವಿ (ದಿನ 10 ಬದಲಾವಣೆ)" }
  },
  10: {
    en: { fullName: "Sri Raja Rajeshwari Devi", shortName: "Raja Rajeshw...", morning: "Sri Raja Rajeshwari Devi (Vijayadashami)", evening: "Nagarotsavam & Sacred Nimarjanam Teppotsavam" },
    te: { fullName: "శ్రీ రాజరాజేశ్వరి దేవి", shortName: "రాజరాజేశ్వరి...", morning: "శ్రీ రాజరాజేశ్వరి దేవి (విజయదశమి)", evening: "నగరోత్సవం & పవిత్ర నిమజ్జనం తెప్పోత్సవం" },
    hi: { fullName: "श्री राजराजेश्वरी देवी", shortName: "राजराजेश्वरी...", morning: "श्री राजराजेश्वरी देवी (विजयादशमी)", evening: "नगराभिगमन एवं पावन विसर्जन तेप्पोत्सव" },
    ta: { fullName: "ஸ்ரீ ராஜராஜேஸ்வரி தேவி", shortName: "ராஜராஜேஸ்வரி...", morning: "ஸ்ரீ ராஜராஜேஸ்வரி தேவி (விஜயதசமி)", evening: "நகரோற்சவம் & புனித விசர்ஜனம் தெப்போற்சவம்" },
    ml: { fullName: "ശ്രീ രാജരാജേശ്വരി ദേവി", shortName: "രാജരാജേശ്വരി...", morning: "ശ്രീ രാജരാജേശ്വരി ദേവി (വിജയദശമി)", evening: "നഗരോത്സവം & പവിത്ര നിമജ്ജനം തെപ്പോത്സവം" },
    kn: { fullName: "ಶ್ರೀ ರಾಜರಾಜೇಶ್ವರೀ ದೇವಿ", shortName: "ರಾಜರಾಜೇಶ್ವರಿ...", morning: "ಶ್ರೀ ರಾಜರಾಜೇಶ್ವರೀ ದೇವಿ (ವಿಜಯದಶಮಿ)", evening: "ನಗರೋತ್ಸವ & ಪವಿತ್ರ ವಿಸರ್ಜನೆ ತೆಪ್ಪೋತ್ಸವ" }
  }
};

// 8. Tithis Translations
export const TITHI_LOCALIZED: Record<number, Record<LanguageCode, string>> = {
  1: { en: "Padyami (Sunday)", te: "పాడ్యమి (ఆదివారం)", hi: "पाड्यमी (रविवार)", ta: "பாட்யமி (ஞாயிறு)", ml: "പാഡ്യമി (ഞായർ)", kn: "ಪಾಡ್ಯಮಿ (ಭಾನುವಾರ)" },
  2: { en: "Vidiya (Monday)", te: "విదియ (సోమవారం)", hi: "विदिया (सोमवार)", ta: "விதியா (திங்கள்)", ml: "വിദിയ (തിങ്കൾ)", kn: "ವಿದಿಯಾ (ಸೋಮವಾರ)" },
  3: { en: "Thadiya (Tuesday)", te: "తదియ (మంగళవారం)", hi: "तदिया (मंगलवार)", ta: "ததியா (செவ்வாய்)", ml: "തദിയ (ചൊവ്വ)", kn: "ತದಿಯಾ (ಮಂಗಳವಾರ)" },
  4: { en: "Chavithi (Wednesday)", te: "చవితి (బుధవారం)", hi: "चतुर्थी (बुधवार)", ta: "சதுர்த்தி (புதன்)", ml: "ചവിതി (ബുധൻ)", kn: "ಚವಿತಿ (ಬುಧವಾರ)" },
  5: { en: "Panchami (Thursday)", te: "పంచమి (గురువారం)", hi: "पंचमी (गुरुवार)", ta: "பஞ்சமி (வியாழன்)", ml: "പഞ്ചമി (വ്യാഴം)", kn: "ಪಂಚಮಿ (ಗುರುವಾರ)" },
  6: { en: "Shashthi (Friday)", te: "షష్ఠి (శుక్రవారం)", hi: "षष्ठी (शुक्रवार)", ta: "சஷ்டி (வெள்ளி)", ml: "ഷഷ്ഠി (വെള്ളി)", kn: "ಷಷ್ಠಿ (ಶುಕ್ರವಾರ)" },
  7: { en: "Saptami (Saturday)", te: "సప్తమి (శనివారం)", hi: "सप्तमी (शनिवार)", ta: "சப்தமி (சனி)", ml: "സപ്തമി (ശനി)", kn: "ಸಪ್ತಮಿ (ಶನಿವಾರ)" },
  8: { en: "Ashtami (Sunday)", te: "అష్టమి (ఆదివారం)", hi: "अष्टमी (रविवार)", ta: "அஷ்டமி (ஞாயிறு)", ml: "അഷ്ടമി (ഞായർ)", kn: "ಅಷ್ಟಮಿ (ಭಾನುವಾರ)" },
  9: { en: "Navami (Monday)", te: "నవమి (సోమవారం)", hi: "नवमी (सोमवार)", ta: "நவமி (திங்கள்)", ml: "നവമി (തിങ്കൾ)", kn: "ನವಮಿ (ಸೋಮವಾರ)" },
  10: { en: "Dashami (Tuesday)", te: "దశమి (మంగళవారం)", hi: "दशमी (मंगलवार)", ta: "தசமி (செவ்வாய்)", ml: "ദശമി (ചൊവ്വ)", kn: "ದಶಮಿ (ಮಂಗಳವಾರ)" }
};

// 9. Table Column Headers
export const TABLE_HEADERS = {
  title: {
    en: "Daily Tithi, Alankaram & Transition Schedule",
    te: "రోజువారీ తిథి, అలంకారం & అలంకరణ మార్పు వివరాలు",
    hi: "दैनिक तिथि, श्रृंगार व संक्रमण तालिका",
    ta: "தினசரி திதி, அலங்காரம் & மாற்ற அட்டவணை",
    ml: "ദൈനംദിന തിഥി, അലങ്കാരം & മാറ്റ പട്ടിക",
    kn: "ದೈನಂದಿನ ತಿಥಿ, ಅಲಂಕಾರ & ಬದಲಾವಣೆ ವೇಳಾಪಟ್ಟಿ"
  },
  date: { en: "Date", te: "తేదీ", hi: "तिथि / दिनांक", ta: "தேதி", ml: "തീയതി", kn: "ದಿನಾಂಕ" },
  tithi: { en: "Tithi", te: "తిథి", hi: "तिथि", ta: "திதி", ml: "തിഥി", kn: "ತಿಥಿ" },
  morning: { en: "Morning Alankaram & Pooja", te: "ఉదయం అలంకారం & పూజ", hi: "प्रातःकाल श्रृंगार व पूजा", ta: "காலை அலங்காரம் & பூஜை", ml: "രാവിലെ അലങ്കാരവും പൂജയും", kn: "ಬೆಳಗಿನ ಅಲಂಕಾರ & ಪೂಜೆ" },
  evening: { en: "Evening Alankaram & Transition", te: "సాయంత్రం అలంకరణ మార్పు", hi: "सायंकाल श्रृंगार व संक्रमण", ta: "மாலை அலங்கார மாற்றம்", ml: "വൈകുന്നേരത്തെ അലങ്കാര മാറ്റം", kn: "ಸಂಜೆಯ ಅಲಂಕಾರ ಬದಲಾವಣೆ" },
  morningPrefix: { en: "Morning:", te: "ఉదయం:", hi: "प्रातःकाल:", ta: "காலை:", ml: "രാവിലെ:", kn: "ಬೆಳಗ್ಗೆ:" },
  eveningPrefix: { en: "Evening:", te: "సాయంత్రం:", hi: "सायंकाल:", ta: "மாலை:", ml: "വൈകുന്നേരം:", kn: "ಸಂಜೆ:" }
};

// 10. Date Formatter
export const formatLocalizedDateShort = (dateStr: string, lang: LanguageCode): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const day = parts[2].replace(/^0/, "");
  const month = parseInt(parts[1], 10);

  const monthMap: Record<LanguageCode, string> = {
    en: "Oct",
    te: "అక్టో",
    hi: "अक्टू",
    ta: "அக்",
    ml: "ഒക്ടോ",
    kn: "ಅಕ್ಟೋ"
  };

  if (month === 10) {
    return `${monthMap[lang] || "Oct"} ${day}`;
  }
  return dateStr;
};

// 11. Event Categories
const CATEGORY_MAP: Record<string, Record<LanguageCode, string>> = {
  "Cultural Program": {
    en: "Cultural Program",
    te: "సాంస్కృతిక కార్యక్రమం",
    hi: "सांस्कृतिक कार्यक्रम",
    ta: "கலாச்சார நிகழ்ச்சி",
    ml: "സാംസ്കാരിക പരിപാടി",
    kn: "ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ"
  },
  "Competition": {
    en: "Competition",
    te: "పోటీలు",
    hi: "प्रतियोगिता",
    ta: "போட்டி",
    ml: "മത്സരം",
    kn: "ಸ್ಪರ್ಧೆ"
  },
  "Pooja & Chanting": {
    en: "Pooja & Chanting",
    te: "పూజ & పారాయణం",
    hi: "पूजा व पाठ",
    ta: "பூஜை & பாராயணம்",
    ml: "പൂജയും പാരായണവും",
    kn: "ಪೂಜೆ ಮತ್ತು ಪಾರಾಯಣ"
  },
  "Devotional Program": {
    en: "Devotional Program",
    te: "భక్తి కార్యక్రమం",
    hi: "भक्ति कार्यक्रम",
    ta: "பக்தி நிகழ்ச்சி",
    ml: "ഭക്തി പരിപാടി",
    kn: "ಭಕ್ತಿ ಕಾರ್ಯಕ್ರಮ"
  }
};

export const getTranslatedCategory = (category: string, lang: LanguageCode): string => {
  if (lang === "en") return category;
  return CATEGORY_MAP[category]?.[lang] || category;
};

// 12. Mandapam Activities Localized Map
const ACTIVITIES_LOCALIZED: Record<string, Record<LanguageCode, {
  title: string;
  description: string;
  location?: string;
  instructions?: string;
}>> = {
  "act-hr-1": {
    en: {
      title: "Maha Bathukamma Sambaralu & Floral Pooja",
      description: "Grand traditional Bathukamma festivities organized by Hrudhaya Ragu Ram Youth. Devotees and families gather with flowers, folk singing, and prizes for best decorated Bathukamma.",
      location: "Mandapam Festival Ground, Nizamabad",
      instructions: "Free registration. Traditional attire encouraged. Saddula prasadam will be offered to all participants."
    },
    te: {
      title: "మహా బతుకమ్మ సంబరాలు & పూల పూజ",
      description: "హృదయ రఘు రామ్ యూత్ ఆధ్వర్యంలో నిర్వహించే ఘనమైన సంప్రదాయ బతుకమ్మ ఉత్సవం. భక్తులు, కుటుంబాలు రంగురంగుల పూలు, జానపద పాటలు మరియు ఉత్తమ బతుకమ్మలకు బహుమతులతో ఉత్సాహంగా జరుపుకుంటారు.",
      location: "మండపం ఉత్సవ మైదానం, నిజామాబాద్",
      instructions: "ఉచిత నమోదు. సంప్రదాయ వస్త్రధారణ ఆహ్వానించదగినది. పాల్గొన్న వారందరికీ సద్దుల ప్రసాదం అందించబడుతుంది."
    },
    hi: {
      title: "महा बतुकम्मा उत्सव व पुष्पार्चना",
      description: "हृदय रघु राम यूथ द्वारा आयोजित भव्य पारंपरिक बतुकम्मा उत्सव। भक्त व परिवार फूलों, लोकगीतों एवं सर्वश्रेष्ठ सजी बतुकम्मा के पुरस्कारों के साथ एकत्र होते हैं।",
      location: "मंडप उत्सव मैदान, निज़ामाबाद",
      instructions: "निःशुल्क पंजीकरण। पारंपरिक पोशाक प्रोत्साहित की जाती है। सभी प्रतिभागियों को सद्दुल प्रसाद अर्पित किया जाएगा।"
    },
    ta: {
      title: "மகா பதுகம்மா விழா & புஷ்பார்ச்சனை",
      description: "ஹ்ருதய ரகு ராம் யூத் ஏற்பாடு செய்துள்ள பிரம்மாண்ட பாரம்பரிய பதுகம்மா திருவிழா. மலர்கள், நாட்டுப்புற பாடல்கள் மற்றும் சிறந்த பதுகம்மாவிற்கான பரிசுகளுடன் குடும்பங்கள் கூடுகின்றன.",
      location: "மண்டப திருவிழா மைதானம், நிசாமாபாத்",
      instructions: "இலவச பதிவு. பாரம்பரிய உடை வரவேற்கப்படுகிறது. அனைத்து பங்கேற்பாளர்களுக்கும் சத்துல பிரசாதம் வழங்கப்படும்."
    },
    ml: {
      title: "മഹാ ബതുകമ്മ ആഘോഷം & പുഷ്പാർച്ചന",
      description: "ഹൃദയ രഘു റാം യൂത്ത് സംഘടിപ്പിക്കുന്ന പരമ്പരാഗത ബതുകമ്മ ഉത്സവം. പൂക്കളും നാടൻ പാട്ടുകളുമായി ഭക്തരും കുടുംബങ്ങളും ഒത്തുചേരുന്നു; മികച്ച ബതുകമ്മയ്ക്ക് സമ്മാനങ്ങൾ നൽകുന്നു.",
      location: "മണ്ഡപ ഉത്സവ മൈതാനം, നിസാമാബാദ്",
      instructions: "സൗജന്യ രജിസ്ട്രേഷൻ. പരമ്പരാഗത വസ്ത്രധാരണം പ്രോത്സാഹിപ്പിക്കുന്നു. എല്ലാ പങ്കാളികൾക്കും സദ്ദുല പ്രസാദം നൽകുന്നതാണ്."
    },
    kn: {
      title: "ಮಹಾ ಬತುಕಮ್ಮ ಸಂಭ್ರಮ & ಪುಷ್ಪಾರ್ಚನೆ",
      description: "ಹೃದಯ ರಘು ರಾಮ್ ಯೂತ್ ಆಯೋಜಿಸಿರುವ ಅದ್ಧೂರಿ ಸಾಂಪ್ರದಾಯಿಕ ಬತುಕಮ್ಮ ಉತ್ಸವ. ಭಕ್ತರು ಮತ್ತು ಕುಟುಂಬಗಳು ಸುಂದರ ಹೂವುಗಳು, ಜಾನಪದ ಗಾಯನ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಅಲಂಕೃತ ಬತುಕಮ್ಮ ಬಹುಮಾನಗಳೊಂದಿಗೆ ಒಟ್ಟಾಗಿ ಸಂಭ್ರಮಿಸುತ್ತಾರೆ.",
      location: "ಮಂಟಪ ಉತ್ಸವ ಮೈದಾನ, ನಿಜಾಮಾಬಾದ್",
      instructions: "ಉಚಿತ ನೋಂದಣಿ. ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಗೆಗೆ ಆದ್ಯತೆ. ಭಾಗವಹಿಸುವ ಎಲ್ಲಾ ಭಕ್ತರಿಗೆ ಸದ್ದುಲ ಪ್ರಸಾದ ವಿತರಿಸಲಾಗುವುದು."
    }
  },
  "act-hr-2": {
    en: {
      title: "Children's Devi Vesha Dharana & Sloka Recitation",
      description: "Children under 15 years dress up in sacred Navadurga divine forms and recite Devi slokas. Divine mementos & certificates for all participants.",
      location: "Mandapam Community Stage, Nizamabad",
      instructions: "Free registration online or at counter. Parents please register participant names in advance."
    },
    te: {
      title: "పిల్లల దేవి వేషధారణ & శ్లోక పఠన పోటీలు",
      description: "15 ఏళ్లలోపు పిల్లలు నవదుర్గల దివ్య రూపాలలో వేషధారణ ధరించి దేవి శ్లోకాలను పఠిస్తారు. పాల్గొన్న పిల్లలందరికీ జ్ఞాపికలు మరియు ధృవీకరణ పత్రాలు అందజేయబడతాయి.",
      location: "మండపం కమ్యూనిటీ వేదిక, నిజామాబాద్",
      instructions: "ఆన్‌లైన్ లేదా కౌంటర్‌లో ఉచిత నమోదు. తల్లిదండ్రులు ముందుగానే పేర్లను నమోదు చేయవలసిందిగా మనవి."
    },
    hi: {
      title: "बच्चों की देवी वेशभूषा व श्लोक पाठ प्रतियोगिता",
      description: "15 वर्ष से कम आयु के बच्चे नवदुर्गा के पावन रूपों में सजकर देवी श्लोकों का सस्वर पाठ करते हैं। सभी प्रतिभागियों को स्मृति चिह्न व प्रमाण पत्र दिए जाएंगे।",
      location: "मंडप सामुदायिक मंच, निज़ामाबाद",
      instructions: "ऑनलाइन या काउंटर पर निःशुल्क पंजीकरण। माता-पिता कृपया अग्रिम रूप से नाम पंजीकृत करें।"
    },
    ta: {
      title: "குழந்தைகள் தேவி வேடமணிதல் & ஸ்லோக பாராயண போட்டி",
      description: "15 வயதுக்குட்பட்ட குழந்தைகள் நவ துர்கா தெய்வீக வடிவங்களில் வேடமணிந்து தேவி ஸ்லோகங்களை ஓதுகிறார்கள். பங்கேற்கும் அனைவருக்கும் நினைவுப்பரிசுகள் & சான்றிதழ்கள் வழங்கப்படும்.",
      location: "மண்டப சமுதாய மேடை, நிசாமாபாத்",
      instructions: "இணையத்திலோ அல்லது நேரிலோ இலவச பதிவு. பெற்றோர் முன்கூட்டியே பெயர்களை பதிவு செய்யவும்."
    },
    ml: {
      title: "കുട്ടികളുടെ ദേവി വേഷവിധാനവും ശ്ലോകാലാപന മത്സരവും",
      description: "15 വയസ്സിന് താഴെയുള്ള കുട്ടികൾ നവദുർഗ്ഗാ ദിവ്യ രൂപങ്ങളിൽ അണിഞ്ഞൊരുങ്ങി ദേവി ശ്ലോകങ്ങൾ ചൊല്ലുന്നു. എല്ലാ പങ്കാളികൾക്കും സ്മരണികയും സർട്ടിഫിക്കറ്റുകളും നൽകുന്നു.",
      location: "മണ്ഡപ സാമുദായിക വേദി, നിസാമാബാദ്",
      instructions: "ഓൺലൈനായോ കൗണ്ടറിലോ സൗജന്യ രജിസ്ട്രേഷൻ. മാതാപിതാക്കൾ മുൻകൂട്ടി പേരുകൾ രജിസ്റ്റർ ചെയ്യുക."
    },
    kn: {
      title: "ಮಕ್ಕಳ ದೇವಿ ವೇಷಧಾರಣ & ಶ್ಲೋಕ ಪಠಣ ಸ್ಪರ್ಧೆ",
      description: "15 ವರ್ಷದೊಳಗಿನ ಮಕ್ಕಳು ನವದುರ್ಗೆಯರ ದಿವ್ಯ ಸ್ವರೂಪಗಳಲ್ಲಿ ವೇಷ ಧರಿಸಿ ದೇವಿ ಶ್ಲೋಕಗಳನ್ನು ಪಠಿಸುತ್ತಾರೆ. ಭಾಗವಹಿಸುವ ಎಲ್ಲಾ ಮಕ್ಕಳಿಗೆ ದಿವ್ಯ ಸ್ಮರಣಿಕೆಗಳು ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳನ್ನು ನೀಡಲಾಗುವುದು.",
      location: "ಮಂಟಪ ಸಮುದಾಯ ವೇದಿಕೆ, ನಿಜಾಮಾಬಾದ್",
      instructions: "ಆನ್‌ಲೈನ್ ಅಥವಾ ಕೌಂಟರ್‌ನಲ್ಲಿ ಉಚಿತ ನೋಂದಣಿ. ಪೋಷಕರು ಮುಂಚಿತವಾಗಿ ಭಾಗವಹಿಸುವವರ ಹೆಸರುಗಳನ್ನು ನೋಂದಾಯಿಸಲು ವಿನಂತಿ."
    }
  },
  "act-hr-3": {
    en: {
      title: "Sri Lalitha Sahasranama Stotram Group Parayanam",
      description: "Mass sacred chanting of Sri Lalitha Sahasranama with kumkuma archana for family prosperity, peace, and health.",
      location: "Main Mandapam Sanctum, Nizamabad",
      instructions: "All devotees are welcome to join the parayanam. Stotram books provided."
    },
    te: {
      title: "శ్రీ లలితా సహస్రనామ స్తోత్ర సామూహిక పారాయణం",
      description: "కుటుంబ శ్రేయస్సు, శాంతి మరియు ఆరోగ్యం కొరకు కుంకుమార్చనతో కూడిన శ్రీ లలితా సహస్రనామ సామూహిక పవిత్ర పారాయణం.",
      location: "ప్రధాన మండప గర్భాలయం, నిజామాబాద్",
      instructions: "భక్తులందరూ పారాయణంలో పాల్గొనవచ్చు. స్తోత్ర పుస్తకాలు మండపంలో అందించబడతాయి."
    },
    hi: {
      title: "श्री ललिता सहस्रनाम स्तोत्र सामूहिक पारायण",
      description: "पारिवारिक समृद्धि, शांति एवं आरोग्य हेतु कुंकुमार्चना के साथ श्री ललिता सहस्रनाम का सामूहिक पावन पाठ।",
      location: "मुख्य मंडप गर्भगृह, निज़ामाबाद",
      instructions: "सभी भक्त पारायण में सादर आमंत्रित हैं। स्तोत्र पुस्तिकाएँ उपलब्ध कराई जाएँगी।"
    },
    ta: {
      title: "ஸ்ரீ லலிதா சகஸ்ரநாம ஸ்தோத்திரம் கூட்டு பாராயணம்",
      description: "குடும்ப நன்மை, அமைதி மற்றும் ஆரோக்கியத்திற்காக குங்கும அர்ச்சனையுடன் கூடிய ஸ்ரீ லலிதா சகஸ்ரநாம கூட்டு பாராயணம்.",
      location: "முக்கிய மண்டப கருவறை, நிசாமாபாத்",
      instructions: "அனைத்து பக்தர்களும் பாராயணத்தில் கலந்து கொள்ளலாம். ஸ்தோத்திர புத்தகங்கள் வழங்கப்படும்."
    },
    ml: {
      title: "ശ്രീ ലളിതാ സഹസ്രനാമ സ്തോത്ര കൂട്ടായ്മ പാരായണം",
      description: "കുടുംബ ഐശ്വര്യത്തിനും സമാധാനത്തിനും ആരോഗ്യത്തിനുമായി കുങ്കുമാർച്ചനയോടുകൂടിയ ശ്രീ ലളിതാ സഹസ്രനാമ കൂട്ടായ പാരായണം.",
      location: "പ്രധാന മണ്ഡപ ശ്രീകോവിൽ, നിസാമാബാദ്",
      instructions: "എല്ലാ ഭക്തർക്കും പാരായണത്തിൽ പങ്കെടുക്കാം. സ്തോത്ര പുസ്തകങ്ങൾ നൽകുന്നതാണ്."
    },
    kn: {
      title: "ಶ್ರೀ ಲಲಿತಾ ಸಹಸ್ರನಾಮ ಸ್ತೋತ್ರ ಸಾಮೂಹಿಕ ಪಾರಾಯಣ",
      description: "ಕುಟುಂಬದ ಸುಖ-ಶಾಂತಿ, ಸಮೃದ್ಧಿ ಮತ್ತು ಉತ್ತಮ ಆರೋಗ್ಯಕ್ಕಾಗಿ ಕುಂಕುಮಾರ್ಚನೆಯೊಂದಿಗೆ ಶ್ರೀ ಲಲಿತಾ ಸಹಸ್ರನಾಮದ ಸಾಮೂಹಿಕ ಪವಿತ್ರ ಪಾರಾಯಣ.",
      location: "ಮುಖ್ಯ ಮಂಟಪ ಗರ್ಭಗುಡಿ, ನಿಜಾಮಾಬಾದ್",
      instructions: "ಎಲ್ಲಾ ಭಕ್ತರಿಗೂ ಪಾರಾಯಣಕ್ಕೆ ಸ್ವಾಗತ. ಸ್ತೋತ್ರ ಪುಸ್ತಕಗಳನ್ನು ಒದಗಿಸಲಾಗುವುದು."
    }
  },
  "act-hr-4": {
    en: {
      title: "Akhanda Dandiya & Kolatam Youth Night",
      description: "High-energy devotional Garba & Dandiya dance night by Hrudhaya Ragu Ram Youth. Pure devotional music, joyful celebration with prizes for best traditional dancers.",
      location: "Subhash Nagar Open Ground, Nizamabad",
      instructions: "Open to youth and families. Entry is free with online registration."
    },
    te: {
      title: "అఖండ దాండియా & కోలాటం యూత్ నైట్",
      description: "హృదయ రఘు రామ్ యూత్ ఆధ్వర్యంలో ఉల్లాసభరితమైన భక్తిపూర్వక గర్బా & దాండియా నృత్యోత్సవం. భక్తి సంగీతం, ఆనందోత్సాహాలు మరియు ఉత్తమ నృత్యకారులకు బహుమతులు.",
      location: "సుభాష్ నగర్ ఓపెన్ గ్రౌండ్, నిజామాబాద్",
      instructions: "యువత మరియు కుటుంబాలందరికీ ఆహ్వానం. ఆన్‌లైన్ నమోదుతో ఉచిత ప్రవేశం."
    },
    hi: {
      title: "अखंड डांडिया व कोलाटम यूथ नाइट",
      description: "हृदय रघु राम यूथ द्वारा आयोजित ऊर्जावान भक्तिमय गरबा व डांडिया नृत्य संध्या। शुद्ध भक्ति संगीत, उल्लासमय उत्सव व सर्वश्रेष्ठ नर्तकों को पुरस्कार।",
      location: "सुभाष नगर खुला मैदान, निज़ामाबाद",
      instructions: "युवाओं व परिवारों के लिए खुला। ऑनलाइन पंजीकरण के साथ निःशुल्क प्रवेश।"
    },
    ta: {
      title: "அகண்ட தாண்டியா & கோலாட்டம் இளைஞர் இரவு",
      description: "ஹ்ருதய ரகு ராம் யூத் நடத்தும் உற்சாகமான பக்தி கர்பா & தாண்டியா நடன இரவு. பக்தி இசை, மகிழ்ச்சியான கொண்டாட்டம் மற்றும் சிறந்த நடனக் கலைஞர்களுக்கு பரிசுகள்.",
      location: "சுபாஷ் நகர் திறந்தவெளி மைதானம், நிசாமாபாத்",
      instructions: "இளைஞர்கள் மற்றும் குடும்பங்களுக்கு திறக்கப்பட்டுள்ளது. இணைய பதிவில் இலவச நுழைவு."
    },
    ml: {
      title: "അഖണ്ഡ ദാണ്ഡിയ & കോലാട്ടം യൂത്ത് നൈറ്റ്",
      description: "ഹൃദയ രഘു റാം യൂത്ത് നടത്തുന്ന ഭക്തിനിർഭരമായ ഗർബ & ദാണ്ഡിയ നൃത്തരംഗം. ഭക്തിഗാനങ്ങളും ആനന്ദോത്സവവും; മികച്ച നർത്തകർക്ക് ആകർഷകമായ സമ്മാനങ്ങൾ.",
      location: "സുഭാഷ് നഗർ തുറന്ന മൈതാനം, നിസാമാബാദ്",
      instructions: "യുവജനങ്ങൾക്കും കുടുംബങ്ങൾക്കും പ്രവേശനം. ഓൺലൈൻ രജിസ്ട്രേഷനിലൂടെ സൗജന്യ പ്രവേശനം."
    },
    kn: {
      title: "ಅಖಂಡ ದಾಂಡಿಯಾ & ಕೋಲಾಟ ಯುವ ನೈಟ್",
      description: "ಹೃದಯ ರಘು ರಾಮ್ ಯೂತ್ ವತಿಯಿಂದ ಅದ್ಭುತ ಭಕ್ತಿಮಯ ಗರ್ಬಾ & ದಾಂಡಿಯಾ ನೃತ್ಯ ಸಂಜೆ. ಶುದ್ಧ ಭಕ್ತಿ ಸಂಗೀತ, ಹರ್ಷೋಲ್ಲಾಸದ ಸಂಭ್ರಮ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಸಾಂಪ್ರದಾಯಿಕ ನರ್ತಕರಿಗೆ ಆಕರ್ಷಕ ಬಹುಮಾನಗಳು.",
      location: "ಸುಭಾಷ್ ನಗರ ತೆರೆದ ಮೈದಾನ, ನಿಜಾಮಾಬಾದ್",
      instructions: "ಯುವಜನರು ಹಾಗೂ ಕುಟುಂಬಗಳಿಗೆ ಮುಕ್ತ ಅವಕಾಶ. ಆನ್‌ಲೈನ್ ನೋಂದಣಿಯೊಂದಿಗೆ ಉಚಿತ ಪ್ರವೇಶ."
    }
  }
};

export const getTranslatedActivity = (act: Activity, lang: LanguageCode) => {
  const custom = ACTIVITIES_LOCALIZED[act.id]?.[lang];
  return {
    title: custom?.title || act.title,
    description: custom?.description || act.description,
    location: custom?.location || act.location,
    instructions: custom?.instructions || act.instructions,
    category: getTranslatedCategory(act.category, lang)
  };
};

// 13. Pooja Services Localized Map
const SERVICES_LOCALIZED: Record<string, Record<LanguageCode, {
  name: string;
  type: string;
  description: string;
  itemsRequired?: string;
  instructions?: string;
}>> = {
  "srv-hr-archana": {
    en: {
      name: "Sri Durga Devi Sahasranama Archana",
      type: "Kumkum Archana",
      description: "Participate in person with individual pooja plate, sacred bilva archana, and receive holy Prasadam packet.",
      itemsRequired: "2 Yellow coconuts, Betel leaves, Fresh red flower garland, Bananas",
      instructions: "Devotees are requested to wear traditional dress and arrive 15 minutes before the scheduled slot."
    },
    te: {
      name: "శ్రీ దుర్గా దేవి సహస్రనామ అర్చన",
      type: "కుంకుమార్చన",
      description: "వ్యక్తిగత పూజా పళ్లెం, పవిత్ర బిల్వార్చనతో స్వయంగా పాల్గొనండి మరియు దివ్య ప్రసాదం ప్యాకెట్ అందుకోండి.",
      itemsRequired: "2 పసుపు కొబ్బరికాయలు, తమలపాకులు, తాజా ఎరుపు పూలదండ, అరటిపండ్లు",
      instructions: "భక్తులు సంప్రదాయ వస్త్రాలు ధరించి నిర్ణీత సమయానికి 15 నిమిషాల ముందు రావాల్సిందిగా మనవి."
    },
    hi: {
      name: "श्री दुर्गा देवी सहस्रनाम अर्चना",
      type: "कुंकुमार्चना",
      description: "व्यक्तिगत पूजा थाली व पवित्र बिल्वार्चना के साथ स्वयं भाग लें एवं पावन प्रसाद पैकेट प्राप्त करें।",
      itemsRequired: "2 पीले नारियल, पान के पत्ते, ताज़ा लाल फूलों की माला, केले",
      instructions: "भक्तों से अनुरोध है कि पारंपरिक वेशभूषा पहनें और निर्धारित स्लॉट से 15 मिनट पहले पहुँचें।"
    },
    ta: {
      name: "ஸ்ரீ துர்கா தேவி சகஸ்ரநாம அர்ச்சனை",
      type: "குங்குமார்ச்சனை",
      description: "தனிநபர் பூஜை தட்டு, புனித வில்வார்ச்சனையுடன் நேரில் பங்கேற்று புனித பிரசாத பாக்கெட்டைப் பெறுங்கள்.",
      itemsRequired: "2 மஞ்சள் தேங்காய்கள், வெற்றிலைகள், புதிய சிவப்பு மலர் மாலை, வாழைப்பழங்கள்",
      instructions: "பக்தர்கள் பாரம்பரிய உடையில் குறிப்பிட்ட நேரத்திற்கு 15 நிமிடங்களுக்கு முன்பாக வரவும்."
    },
    ml: {
      name: "ശ്രീ ദുർഗ്ഗാ ദേവി സഹസ്രനാമ അർച്ചന",
      type: "കുങ്കുമാർച്ചന",
      description: "വ്യക്തിഗത പൂജ താലവും പവിത്ര ബിൽവാർച്ചനയുമോടെ നേരിട്ട് പങ്കെടുത്ത് പുണ്യ പ്രസാദം കൈപ്പറ്റുക.",
      itemsRequired: "2 മഞ്ഞ തേങ്ങകൾ, വെറ്റിലകൾ, പുതിയ ചുവന്ന പൂമാല, നേന്ത്രപ്പഴങ്ങൾ",
      instructions: "ഭക്തർ പരമ്പരാഗത വസ്ത്രം ധരിച്ച് നിശ്ചിത സമയത്തിന് 15 മിനിറ്റ് മുൻപ് എത്തുക."
    },
    kn: {
      name: "ಶ್ರೀ ದುರ್ಗಾ ದೇವಿ ಸಹಸ್ರನಾಮ ಅರ್ಚನೆ",
      type: "ಕುಂಕುಮಾರ್ಚನೆ",
      description: "ಪ್ರತ್ಯೇಕ ಪೂಜಾ ತಟ್ಟೆ, ಪವಿತ್ರ ಬಿಲ್ವಾರ್ಚನೆಯೊಂದಿಗೆ ಪ್ರತ್ಯಕ್ಷವಾಗಿ ಪಾಲ್ಗೊಳ್ಳಿ ಮತ್ತು ಪವಿತ್ರ ಪ್ರಸಾದ ಪೊಟ್ಟಣ ಸ್ವೀಕರಿಸಿ.",
      itemsRequired: "2 ಹಳದಿ ತೆಂಗಿನಕಾಯಿಗಳು, ವೀಳ್ಯದೆಲೆಗಳು, ತಾಜಾ ಕೆಂಪು ಹೂಮಾಲೆ, ಬಾಳೆಹಣ್ಣುಗಳು",
      instructions: "ಭಕ್ತರು ಸಾಂಪ್ರದಾಯಿಕ ವಸ್ತ್ರಗಳನ್ನು ಧರಿಸಿ ನಿಗದಿತ ಸ್ಲಾಟ್‌ಗಿಂತ 15 ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ಬರಬೇಕಾಗಿ ವಿನಂತಿ."
    }
  },
  "srv-kumkumarchana": {
    en: {
      name: "Sahasra Nama Kumkumarchana",
      type: "Kumkum Archana",
      description: "Participate in person with individual pooja plate and receive energized silver dollar & prasadam pack.",
      itemsRequired: "2 Yellow coconuts, Betel leaves & nuts, 1 Red flower garland"
    },
    te: {
      name: "సహస్ర నామ కుంకుమార్చన",
      type: "కుంకుమార్చన",
      description: "వ్యక్తిగత పూజా పళ్లెంతో పాల్గొని పూజించిన వెండి డాలర్ & ప్రసాదం ప్యాకెట్ అందుకోండి.",
      itemsRequired: "2 పసుపు కొబ్బరికాయలు, తమలపాకులు & వక్కలు, 1 ఎరుపు పూలదండ"
    },
    hi: {
      name: "सहस्रनाम कुंकुमार्चना",
      type: "कुंकुमार्चना",
      description: "व्यक्तिगत पूजा थाली के साथ भाग लें एवं सिद्ध चांदी का सिक्का व प्रसाद प्राप्त करें।",
      itemsRequired: "2 पीले नारियल, पान-सुपारी, 1 लाल फूलों की माला"
    },
    ta: {
      name: "சகஸ்ரநாம குங்குமார்ச்சனை",
      type: "குங்குமார்ச்சனை",
      description: "தனிநபர் பூஜை தட்டுடன் பங்கேற்று ஆசீர்வதிக்கப்பட்ட வெள்ளி நாணயம் & பிரசாதம் பெறுங்கள்.",
      itemsRequired: "2 மஞ்சள் தேங்காய்கள், வெற்றிலை பாக்கு, 1 சிவப்பு மலர் மாலை"
    },
    ml: {
      name: "സഹസ്രനാമ കുങ്കുമാർച്ചന",
      type: "കുങ്കുമാർച്ചന",
      description: "വ്യക്തിഗത പൂജ താലത്തോടെ പങ്കെടുത്ത് വെള്ളി നാണയവും പ്രസാദവും കൈപ്പറ്റുക.",
      itemsRequired: "2 മഞ്ഞ തേങ്ങകൾ, വെറ്റില അടയ്ക്ക, 1 ചുവന്ന പൂമാല"
    },
    kn: {
      name: "ಸಹಸ್ರನಾಮ ಕುಂಕುಮಾರ್ಚನೆ",
      type: "ಕುಂಕುಮಾರ್ಚನೆ",
      description: "ಪ್ರತ್ಯೇಕ ಪೂಜಾ ತಟ್ಟೆಯೊಂದಿಗೆ ಭಾಗವಹಿಸಿ ಮತ್ತು ಪವಿತ್ರ ಬೆಳ್ಳಿ ನಾಣ್ಯ ಹಾಗೂ ಪ್ರಸಾದ ಪೊಟ್ಟಣ ಸ್ವೀಕರಿಸಿ.",
      itemsRequired: "2 ಹಳದಿ ತೆಂಗಿನಕಾಯಿಗಳು, ವೀಳ್ಯದೆಲೆ-ಅಡಿಕೆ, 1 ಕೆಂಪು ಹೂಮಾಲೆ"
    }
  }
};

export const getTranslatedService = (srv: Service, lang: LanguageCode) => {
  const custom = SERVICES_LOCALIZED[srv.id]?.[lang];
  return {
    name: custom?.name || srv.name,
    type: custom?.type || srv.type,
    description: custom?.description || srv.description,
    itemsRequired: custom?.itemsRequired || srv.itemsRequired,
    instructions: custom?.instructions || srv.instructions
  };
};

// 14. Slot Full / Available Badges
export const getTranslatedSlotUI = (isFull: boolean, booked: number, total: number, remaining: number, lang: LanguageCode) => {
  switch (lang) {
    case "te":
      return {
        badge: `స్లాట్లు నిండాయి (${booked}/${total} పూర్తి)`,
        buttonFull: "స్లాట్లు నిండాయి",
        leftText: `${remaining} స్లాట్లు మిగిలి ఉన్నాయి (${booked}/${total} నమోదయ్యాయి)`,
        bookBtn: "స్లాట్ బుక్ చేయండి →"
      };
    case "hi":
      return {
        badge: `स्लॉट पूर्ण हैं (${booked}/${total} पूर्ण)`,
        buttonFull: "स्लॉट भर चुके हैं",
        leftText: `${remaining} स्लॉट शेष हैं (${booked}/${total} बुक)`,
        bookBtn: "स्लॉट बुक करें →"
      };
    case "ta":
      return {
        badge: `இடங்கள் நிரம்பின (${booked}/${total} முழுமை)`,
        buttonFull: "இடங்கள் நிரம்பின",
        leftText: `${remaining} இடங்கள் மீதமுள்ளன (${booked}/${total} பதிவு)`,
        bookBtn: "ஸ்லாட் பதிவு செய்க →"
      };
    case "ml":
      return {
        badge: `സ്ലോട്ടുകൾ നിറഞ്ഞു (${booked}/${total} പൂർണ്ണം)`,
        buttonFull: "സ്ലോട്ടുകൾ നിറഞ്ഞു",
        leftText: `${remaining} സ്ലോട്ടുകൾ ബാക്കി (${booked}/${total} ബുക്ക്)`,
        bookBtn: "സ്ലോട്ട് ബുക്ക് ചെയ്യുക →"
      };
    case "kn":
      return {
        badge: `ಸ್ಲಾಟ್‌ಗಳು ಭರ್ತಿಯಾಗಿವೆ (${booked}/${total} ಪೂರ್ಣ)`,
        buttonFull: "ಸ್ಲಾಟ್‌ಗಳು ಭರ್ತಿಯಾಗಿವೆ",
        leftText: `${remaining} ಸ್ಲಾಟ್‌ಗಳು ಬಾಕಿ ಇವೆ (${booked}/${total} ಬುಕ್)`,
        bookBtn: "ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ →"
      };
    default:
      return {
        badge: `FILLED SLOTS (${booked}/${total} FULL)`,
        buttonFull: "Slots Filled",
        leftText: `${remaining} Slots Left (${booked}/${total} Booked)`,
        bookBtn: "Book Slot →"
      };
  }
};

// 15. Venue & Annadanam
export const getTranslatedVenue = (venue: string, lang: LanguageCode): string => {
  if (lang === "en" || !venue) return venue;
  if (venue.includes("Kalyana Hall") || venue.includes("Kalyana Mandapam")) {
    switch (lang) {
      case "te": return "మండపం కళ్యాణ మండపం";
      case "hi": return "मंडप कल्याण मंडप";
      case "ta": return "மண்டப கல்யாண மண்டபம்";
      case "ml": return "മണ്ഡപ കല്യാണ മണ്ഡപം";
      case "kn": return "ಮಂಟಪ ಕಲ್ಯಾಣ ಮಂಟಪ";
    }
  }
  return venue;
};

export const getTranslatedAnnadanamTitle = (lang: LanguageCode): string => {
  switch (lang) {
    case "te": return "నిత్యాన్నదాన సేవ • పవిత్ర ప్రసాద భోజనం";
    case "hi": return "नित्यान्नदानम् सेवा • पवित्र प्रसाद भोजन";
    case "ta": return "நித்திய அன்னதான சேவை • புனித பிரசாத போஜனம்";
    case "ml": return "നിത്യാന്നദാന സേവ • പവിത്ര പ്രസാദ ഭോജനം";
    case "kn": return "ನಿತ್ಯಾನ್ನದಾನ ಸೇವೆ • ಪವಿತ್ರ ಪ್ರಸಾದ ಭೋಜನ";
    default: return "Nitya Annadanam Seva • Sacred Prasadam Bhojanam";
  }
};
