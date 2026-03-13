import { motion } from 'motion/react';
import { PlusSquare, Search, ArrowRight } from 'lucide-react';
import { Language, NavTab } from '../types';
import { TRANSLATIONS } from '../constants';

interface HomeScreenProps {
  user: any;
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
  darkMode: boolean;
}

export default function HomeScreen({ user, setActiveTab, lang, darkMode }: HomeScreenProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-8 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center sm:text-left"
      >
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {t.welcome}, <span className="text-[#FF9933]">{user.displayName?.split(' ')[0]}</span>!
        </h2>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {lang === 'en' ? "Ready to trade something today?" : "आज कुछ व्यापार करने के लिए तैयार हैं?"}
        </p>
      </motion.div>

      <div className={`p-6 rounded-3xl bg-gradient-to-br from-[#FF9933] to-[#FF9933]/80 text-white shadow-xl relative overflow-hidden group`}>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">{t.pureBarter}</h3>
          <p className="text-sm opacity-90 mb-4">
            {lang === 'en' 
              ? "Join India's fastest growing community of barter traders. Swap anything from electronics to farm produce!" 
              : "वस्तु विनिमय व्यापारियों के भारत के सबसे तेजी से बढ़ते समुदाय में शामिल हों। इलेक्ट्रॉनिक्स से लेकर कृषि उपज तक कुछ भी बदलें!"}
          </p>
          <button 
            onClick={() => setActiveTab('browse')}
            className="px-6 py-3 bg-white text-[#FF9933] rounded-2xl font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            {t.browse}
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('post')}
          className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all group ${
            darkMode 
              ? 'bg-white/5 border-white/10 hover:border-[#FF9933] hover:bg-white/10' 
              : 'bg-white border-black/5 hover:border-[#FF9933] hover:shadow-xl'
          }`}
        >
          <div className="p-4 rounded-2xl bg-[#FF9933]/10 text-[#FF9933] group-hover:scale-110 transition-transform">
            <PlusSquare size={32} />
          </div>
          <span className="font-bold text-lg">{t.postNew}</span>
        </button>

        <button
          onClick={() => setActiveTab('browse')}
          className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all group ${
            darkMode 
              ? 'bg-white/5 border-white/10 hover:border-[#138808] hover:bg-white/10' 
              : 'bg-white border-black/5 hover:border-[#138808] hover:shadow-xl'
          }`}
        >
          <div className="p-4 rounded-2xl bg-[#138808]/10 text-[#138808] group-hover:scale-110 transition-transform">
            <Search size={32} />
          </div>
          <span className="font-bold text-lg">{t.browse}</span>
        </button>
      </div>

      <div className="space-y-4">
        <h4 className={`font-bold text-sm uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {lang === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
        </h4>
        <div className={`p-12 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center ${
          darkMode ? 'border-white/10 text-gray-600' : 'border-black/5 text-gray-400'
        }`}>
          <p className="text-sm italic">
            {lang === 'en' ? 'New trades happening every minute!' : 'हर मिनट नए व्यापार हो रहे हैं!'}
          </p>
        </div>
      </div>
    </div>
  );
}
