"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Lang } from "@/i18n/translations";

type LanguageCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Translation table for the active language. */
  t: (typeof dict)[Lang];
};

const LanguageContext = createContext<LanguageCtx | null>(null);

const STORAGE_KEY = "site-lang";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server + first client render both start "en" so hydration matches.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore storage errors */
    }
    document.documentElement.lang = l === "zh" ? "zh" : "en";
  };

  const toggle = () => setLang(lang === "en" ? "zh" : "en");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
