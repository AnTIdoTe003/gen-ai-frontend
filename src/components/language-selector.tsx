"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";

// Language options with their codes and labels
export const LANGUAGES = [
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧" },
  { code: "hi-IN", label: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja-JP", label: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "ar-SA", label: "العربية", flag: "🇸🇦" },
  { code: "ru-RU", label: "Русский", flag: "🇷🇺" },
  { code: "ko-KR", label: "한국어", flag: "🇰🇷" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
  { code: "nl-NL", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl-PL", label: "Polski", flag: "🇵🇱" },
  { code: "tr-TR", label: "Türkçe", flag: "🇹🇷" },
];

const STORAGE_KEY = "preferred-language";

interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: string) => void;
  onLanguageSelect?: (languageCode: string, languageLabel: string) => void;
  variant?: "navbar" | "inline";
}

export function LanguageSelector({
  onLanguageChange,
  onLanguageSelect,
  variant = "navbar",
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  // Load saved language preference on mount (without triggering message)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage);
        // Only update language code, don't send message on initial load
        onLanguageChange?.(savedLanguage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, languageCode);
    }

    // Notify parent component about language code change
    onLanguageChange?.(languageCode);

    // Notify parent component to send message about language selection
    const selectedLang = LANGUAGES.find((lang) => lang.code === languageCode);
    if (selectedLang && onLanguageSelect) {
      onLanguageSelect(languageCode, selectedLang.label);
    }
  };

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === selectedLanguage) || LANGUAGES[0];

  if (variant === "inline") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-9"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage.label}</span>
            <span className="sm:hidden">{currentLanguage.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Voice Input Language
          </div>
          {LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{language.flag}</span>
                <span className="text-sm">{language.label}</span>
              </span>
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Navbar variant - more compact
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          title={`Language: ${currentLanguage.label}`}
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
          Voice Input Language
        </div>
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{language.flag}</span>
              <span className="text-sm">{language.label}</span>
            </span>
            {selectedLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

