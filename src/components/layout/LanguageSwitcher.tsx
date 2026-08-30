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
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    // Store in localStorage for persistence if detector doesn't
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    const lng = i18n.language || 'en';
    document.documentElement.dir = (lng.startsWith('ur')) ? 'rtl' : 'ltr';
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
      <DropdownMenuContent align="end" className="w-40 bg-zinc-950/95 backdrop-blur-xl border-white/10 p-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg transition-colors focus:bg-primary/10 focus:text-primary ${i18n.language.startsWith(lang.code) ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}
          >
            <span className="text-lg leading-none">{lang.flag}</span>
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
