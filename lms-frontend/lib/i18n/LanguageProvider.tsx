"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Locale, type Dictionary } from "./dictionaries";

type LanguageContextValue = {
  locale: Locale;
  dict: Dictionary;
  dir: "rtl" | "ltr";
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const stored = window.localStorage.getItem("locale") as Locale | null;
    if (stored === "ar" || stored === "en") {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.lang = locale;
    window.localStorage.setItem("locale", locale);
  }, [locale]);

  const toggleLocale = () => setLocale((prev) => (prev === "ar" ? "en" : "ar"));

  const value: LanguageContextValue = {
    locale,
    dict: dictionaries[locale],
    dir: locale === "ar" ? "rtl" : "ltr",
    toggleLocale,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
