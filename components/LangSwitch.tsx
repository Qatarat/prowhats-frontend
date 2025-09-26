"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { IoLanguageOutline } from "react-icons/io5";

const SUPPORTED_LANGS = ["en", "ar"] as const;
type LangCode = (typeof SUPPORTED_LANGS)[number];

export function LangSwitch() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { language, toggleLanguage, t } = useLanguage();
  const isArabic = language === "ar";
  const fallbackNonAr: LangCode = "en";

  const rewriteUrl = (nextLang: LangCode) => {
    const segments = pathname.split("/").filter(Boolean);
    const currentLang = segments[0] as LangCode | undefined;

    // No lang prefix -> prepend
    if (!currentLang || !SUPPORTED_LANGS.includes(currentLang)) {
      const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
      router.replace(`/${nextLang}${cleanPath}`);
      return;
    }

    // Swap prefix
    if (currentLang !== nextLang) {
      const restOfPath = segments.slice(1).join("/");
      router.replace(`/${nextLang}${restOfPath ? `/${restOfPath}` : ""}`);
    }
  };

  const selectLang = (nextLang: LangCode) => {
    localStorage.setItem("country", nextLang);
    toggleLanguage(nextLang);
    rewriteUrl(nextLang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 border p-1"
          aria-label={isArabic ? "Arabic" : "English"}
        >
          <IoLanguageOutline  className="ms-1 h-4 w-4 " />
          {isArabic ? "العربية" : "English"}

        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t("language") ?? "Language"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => selectLang("en")}
          className="flex items-center gap-2"
        >
          <img
            src="/images/flags/en.png"
            alt="English"
            className="w-4 h-4 rounded-full border"
          />
          <span className="text-sm">English</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => selectLang("ar")}
          className="flex items-center gap-2"
        >
          <img
            src="/images/flags/ar.png"
            alt="Arabic"
            className="w-4 h-4 rounded-full border"
          />
          <span className="text-sm">العربية</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
