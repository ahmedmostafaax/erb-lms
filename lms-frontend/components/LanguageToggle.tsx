"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <button
      onClick={toggleLocale}
      aria-label={isAr ? "Switch to English" : "التبديل للعربي"}
      className="relative inline-flex h-9 w-[68px] items-center rounded-full border border-line bg-paper-raised px-1 transition-colors hover:border-primary/40"
    >
      <span
        className="absolute h-7 w-7 rounded-full bg-primary transition-[inset-inline-start] duration-300 ease-out"
        style={{ insetInlineStart: isAr ? "4px" : "36px" }}
      />
      <span
        className={`relative z-10 flex-1 text-center text-sm font-semibold transition-colors ${
          isAr ? "text-white" : "text-ink/50"
        }`}
      >
        ع
      </span>
      <span
        className={`relative z-10 flex-1 text-center text-sm font-semibold transition-colors ${
          !isAr ? "text-white" : "text-ink/50"
        }`}
      >
        A
      </span>
    </button>
  );
}
