"use client";

import { translations } from "@/lib/tanslations";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Language = "en" | "ar";

type TranslationDict = Record<string, string | string[]>;
type Translations = Record<Language, TranslationDict>;

interface LanguageContextType {
  language: Language;
  toggleLanguage: (next: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Get initial language from localStorage; default to "ar"
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "ar";
  const saved = localStorage.getItem("country");
  return saved === "en" || saved === "ar" ? saved : "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  // Persist language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("country", language);
    }
  }, [language]);

  // Optional: react to changes from other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "country") {
        const next = e.newValue === "en" || e.newValue === "ar" ? e.newValue : "ar";
        setLanguage(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const dict = (translations as Translations)[language] ?? (translations as Translations)["ar"];

  const toggleLanguage = (next: Language) => {
    setLanguage(next);
  };

  const t = (key: string): string => {
    const value = dict[key];
    if (Array.isArray(value)) return value.join(" ");
    return value ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
