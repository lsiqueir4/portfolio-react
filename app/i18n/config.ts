import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { pt } from "./locales/pt";
import { en } from "./locales/en";

// Synchronous, inline-resource init (no async backend) so useTranslation()
// works during SSR. CRITICAL (D-02): `lng` is the FIXED default "pt" on both
// server and client — this keeps first paint identical on both sides. The
// language hook (useLanguage.ts) changes the active language post-hydration,
// it never changes this config's initial `lng`.
i18next.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: "pt",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18next;
