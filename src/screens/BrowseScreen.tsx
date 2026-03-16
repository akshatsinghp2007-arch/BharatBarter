import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { BarterItem, Language, Category } from '../types';
import { TRANSLATIONS, CATEGORIES } from '../constants';
import ItemCard from '../components/ItemCard';

interface BrowseScreenProps {
  lang: Language;
  darkMode: boolean;
  onItemClick: (item: BarterItem) => void;
}

export default function BrowseScreen({ lang, darkMode, onItemClick }: BrowseScreenProps) {
  const t = TRANSLATIONS[lang];
  const [items, setItems] = useState<BarterItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    // Optional: Polling for real-time feel
    const interval = setInterval(fetchItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const cities = ['All', ...new Set(items.map(item => item.city))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || item.city === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="pb-24 space-y-6">
      <div className="sticky top-16 z-40 py-4 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.search}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all ${
                darkMode 
                  ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                  : 'bg-white border-black/5 focus:border-[#FF9933] shadow-sm'
              }`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-2xl border-2 transition-all ${
              showFilters 
                ? 'bg-[#FF9933] border-[#FF9933] text-white' 
                : darkMode 
                  ? 'bg-white/5 border-white/10 text-gray-400' 
                  : 'bg-white border-black/5 text-gray-500'
            }`}
          >
            <SlidersHorizontal size={24} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">{t.category}</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className={`w-full p-3 rounded-xl border-2 outline-none appearance-none ${
                      darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-black/5'
                    }`}
                  >
                    <option value="All">{t.filterCategory}</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-2">{t.city}</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className={`w-full p-3 rounded-xl border-2 outline-none appearance-none ${
                      darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-black/5'
                    }`}
                  >
                    <option value="All">{t.filterCity}</option>
                    {cities.filter(c => c !== 'All').map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-black/5 rounded-full flex items-center justify-center text-gray-300">
            <Search size={40} />
          </div>
          <p className="text-gray-500 font-medium">{t.noItems}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
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
  );
}
