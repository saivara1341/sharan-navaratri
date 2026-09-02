import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useEffect, useState } from 'react';

const languages = [
  { code: 'en', name: 'English' }, { code: 'hi', name: 'हिन्दी' }, { code: 'te', name: 'తెలుగు' },
  { code: 'ur', name: 'اردو' }, { code: 'pa', name: 'ਪੰਜਾਬੀ' }, { code: 'as', name: 'অসমীয়া' },
  { code: 'bn', name: 'বাংলা' }, { code: 'gu', name: 'ગુજરાતી' }, { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'kok', name: 'कोंकणी' }, { code: 'ml', name: 'മലയാളം' }, { code: 'mr', name: 'मराठी' },
  { code: 'ne', name: 'नेपाली' }, { code: 'or', name: 'ଓଡ଼ିଆ' }, { code: 'ta', name: 'தமிழ்' },
  { code: 'ar', name: 'العربية' }, { code: 'de', name: 'Deutsch' }, { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' }, { code: 'ja', name: '日本語' }, { code: 'ko', name: '한국어' },
  { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' }, { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(i18n.resolvedLanguage || i18n.language || 'en');

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setActiveLanguage(lng);
    document.documentElement.dir = ['ar', 'ur'].includes(lng) ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    const lng = i18n.resolvedLanguage || i18n.language || 'en';
    setActiveLanguage(lng);
    document.documentElement.dir = (lng.startsWith('ur') || lng.startsWith('ar')) ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }, [i18n.language, i18n.resolvedLanguage]);

  const currentLanguage = languages.find(l => l.code.toLowerCase() === activeLanguage.toLowerCase()) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
          <Languages className="w-4 h-4 text-primary" />
          <span className="font-medium text-xs uppercase tracking-wider md:hidden">{currentLanguage.code}</span>
          <span className="hidden font-medium text-sm tracking-wide md:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        sideOffset={8}
        className="z-[130] grid max-h-[calc(100vh-9rem)] w-[min(26rem,calc(100vw-2rem))] grid-cols-1 gap-1 overflow-y-auto rounded-2xl border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl sm:grid-cols-2"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => void changeLanguage(lang.code)}
            className={`flex cursor-pointer items-center rounded-xl px-3 py-2.5 transition-colors focus:bg-primary/10 focus:text-primary ${activeLanguage.toLowerCase() === lang.code.toLowerCase() ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
          >
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
