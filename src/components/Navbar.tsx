import { motion } from 'motion/react';
import { Sun, Moon, Languages, LogOut } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { logout } from '../firebase';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  user: any;
}

export default function Navbar({ lang, setLang, darkMode, setDarkMode, user }: NavbarProps) {
  const t = TRANSLATIONS[lang];

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${darkMode ? 'bg-black/50 border-white/10' : 'bg-white/50 border-black/5'}`}>
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9933] via-white to-[#138808] flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 rounded-full border-2 border-[#000080]" />
          </div>
          <span className={`font-bold text-lg hidden sm:block ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.appName}
          </span>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className={`p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium ${darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`}
          >
            <Languages size={18} />
            <span className="hidden xs:block">{t.toggleLang}</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/5 text-gray-600'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user && (
            <button
              onClick={logout}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/10 text-red-400' : 'hover:bg-black/5 text-red-600'}`}
              title={t.logout}
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
