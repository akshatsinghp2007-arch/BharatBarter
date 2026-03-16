import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Settings, LogOut } from 'lucide-react';
import { auth, logout } from '../firebase';
import { BarterItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import ItemCard from '../components/ItemCard';

interface ProfileScreenProps {
  lang: Language;
  darkMode: boolean;
  onItemClick: (item: BarterItem) => void;
}

export default function ProfileScreen({ lang, darkMode, onItemClick }: ProfileScreenProps) {
  const t = TRANSLATIONS[lang];
  const [items, setItems] = useState<BarterItem[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchMyItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (response.ok) {
          const allItems = await response.json();
          setItems(allItems.filter((item: BarterItem) => item.userId === user.uid));
        }
      } catch (error) {
        console.error('Failed to fetch my items:', error);
      }
    };

    fetchMyItems();
    const interval = setInterval(fetchMyItems, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <div className="pb-24 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt={user.displayName || ''} 
            className="w-24 h-24 rounded-full border-4 border-[#FF9933] shadow-lg"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 p-2 bg-[#FF9933] text-white rounded-full shadow-md">
            <Settings size={16} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        
        <button
          onClick={logout}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
            darkMode ? 'bg-white/10 hover:bg-white/20 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'
          }`}
        >
          <LogOut size={16} />
          {t.logout}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Package size={20} className="text-[#FF9933]" />
          <h3 className="font-bold text-lg">{t.myItems}</h3>
          <span className="ml-auto px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-bold">
            {items.length}
          </span>
        </div>

        {items.length === 0 ? (
          <div className={`p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${
            darkMode ? 'border-white/10 text-gray-600' : 'border-black/5 text-gray-400'
          }`}>
            <p className="text-sm italic">{t.noItems}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick(item)}
                  darkMode={darkMode}
                  lang={lang}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
