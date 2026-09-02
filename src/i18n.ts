import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import ur from "./locales/ur.json";
import pa from "./locales/pa.json";
import ar from "./locales/ar.json";
import as from "./locales/as.json";
import bn from "./locales/bn.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import gu from "./locales/gu.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import kn from "./locales/kn.json";
import ko from "./locales/ko.json";
import kok from "./locales/kok.json";
import ml from "./locales/ml.json";
import mr from "./locales/mr.json";
import ne from "./locales/ne.json";
import or from "./locales/or.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";
import ta from "./locales/ta.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    te: { translation: te },
    ur: { translation: ur },
    pa: { translation: pa },
    ar: { translation: ar },
    as: { translation: as },
    bn: { translation: bn },
    de: { translation: de },
    fr: { translation: fr },
    gu: { translation: gu },
    it: { translation: it },
    ja: { translation: ja },
    kn: { translation: kn },
    ko: { translation: ko },
    kok: { translation: kok },
    ml: { translation: ml },
    mr: { translation: mr },
    ne: { translation: ne },
    or: { translation: or },
    pt: { translation: pt },
    ru: { translation: ru },
    ta: { translation: ta },
    "zh-CN": { translation: zhCN },
    "zh-TW": { translation: zhTW },
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
