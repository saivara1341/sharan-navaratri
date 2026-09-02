import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useEffect } from 'react';

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = ['ar', 'ur'].includes(lng) ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    // Store in localStorage for persistence if detector doesn't
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    const lng = i18n.language || 'en';
    document.documentElement.dir = (lng.startsWith('ur') || lng.startsWith('ar')) ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }, [i18n.language]);

  const currentLanguage = languages.find(l => i18n.language.startsWith(l.code)) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300">
          <Languages className="w-4 h-4 text-primary" />
          <span className="font-medium text-xs uppercase tracking-wider">{currentLanguage.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 w-48 overflow-y-auto bg-zinc-950/95 p-1 backdrop-blur-xl border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex cursor-pointer items-center py-2 px-3 rounded-lg transition-colors focus:bg-primary/10 focus:text-primary ${i18n.language.startsWith(lang.code) ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}
          >
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
