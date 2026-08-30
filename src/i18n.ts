import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import ur from "./locales/ur.json";
import pa from "./locales/pa.json";

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    te: { translation: te },
    ur: { translation: ur },
    pa: { translation: pa },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: typeof window === "undefined" ? "en" : localStorage.getItem("i18nextLng") || "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
