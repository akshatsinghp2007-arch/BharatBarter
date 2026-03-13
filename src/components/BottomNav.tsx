import { motion } from 'motion/react';
import { Home, PlusSquare, Search, User } from 'lucide-react';
import { NavTab, Language } from '../types';
import { TRANSLATIONS, COLORS } from '../constants';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
  darkMode: boolean;
}

export default function BottomNav({ activeTab, setActiveTab, lang, darkMode }: BottomNavProps) {
  const t = TRANSLATIONS[lang];

  const tabs: { id: NavTab; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'browse', icon: Search, label: t.browse },
    { id: 'post', icon: PlusSquare, label: t.post },
    { id: 'profile', icon: User, label: t.profile },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg ${
      darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-black/5'
    }`}>
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 group"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  color: isActive ? COLORS.saffron : (darkMode ? '#9ca3af' : '#6b7280')
                }}
                className="transition-colors"
              >
                <Icon size={24} />
              </motion.div>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#FF9933]' : (darkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 w-1 h-1 rounded-full bg-[#FF9933]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
