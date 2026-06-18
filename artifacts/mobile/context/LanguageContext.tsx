import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Language = "fr" | "en" | "ar";

export type LanguageOption = {
  code: Language;
  label: string;
  nativeLabel: string;
  englishLabel: string;
};

export const LANGUAGE_STORAGE_KEY = "@nafa_language";

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: "fr", label: "Français", nativeLabel: "Français", englishLabel: "French" },
  { code: "en", label: "English", nativeLabel: "English", englishLabel: "English" },
  { code: "ar", label: "العربية", nativeLabel: "العربية", englishLabel: "Arabic" },
] as const;

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    languagePageTitle: "Langue",
    languageOptionFr: "Français",
    languageOptionEn: "English",
    languageOptionAr: "العربية",
  },
  en: {
    languagePageTitle: "Language",
    languageOptionFr: "Français",
    languageOptionEn: "English",
    languageOptionAr: "العربية",
  },
  ar: {},
};

type TranslationKey = string;

interface LanguageContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  languageLabel: string;
  supportedLanguages: readonly LanguageOption[];
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "fr",
  direction: "ltr",
  languageLabel: "Français",
  supportedLanguages: LANGUAGE_OPTIONS,
  setLanguage: async () => {},
  t: (key: TranslationKey) => TRANSLATIONS.fr[key] ?? key,
});

function getTranslation(lang: Language, key: TranslationKey): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS.fr[key] ?? key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (stored === "fr" || stored === "en" || stored === "ar") {
        setLanguageState(stored as Language);
      }
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const direction: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

  const value = useMemo(
    () => ({
      language,
      direction,
      languageLabel: LANGUAGE_OPTIONS.find((item) => item.code === language)?.label ?? "Français",
      supportedLanguages: LANGUAGE_OPTIONS,
      setLanguage,
      t: (key: TranslationKey) => getTranslation(language, key),
    }),
    [direction, language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
