import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Tag, User, Calendar, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { BarterItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ItemDetailScreenProps {
  item: BarterItem | null;
  onClose: () => void;
  onProposeTrade: () => void;
  lang: Language;
  darkMode: boolean;
}

export default function ItemDetailScreen({ item, onClose, onProposeTrade, lang, darkMode }: ItemDetailScreenProps) {
  const t = TRANSLATIONS[lang];
  const [activeImage, setActiveImage] = useState(0);

  if (!item) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed inset-0 z-[60] overflow-y-auto ${darkMode ? 'bg-black' : 'bg-white'}`}
    >
      <div className="relative max-w-2xl mx-auto min-h-screen pb-32">
        {/* Header Actions */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
          <button 
            onClick={onClose}
            className="p-3 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-black/70 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Image Carousel */}
        <div className="relative aspect-square sm:aspect-video bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={item.images[activeImage]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          
          {item.images.length > 1 && (
            <>
              <button 
                onClick={() => setActiveImage((prev) => (prev === 0 ? item.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setActiveImage((prev) => (prev === item.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {item.images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all ${i === activeImage ? 'w-6 bg-[#FF9933]' : 'w-1.5 bg-white/50'}`} 
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-[10px] font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight">{item.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[#138808] font-bold text-xl">
                <Tag size={20} />
                <span>₹{item.estimatedValue}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin size={16} className="text-[#FF9933]" />
                <span>{item.city}{item.pincode ? `, ${item.pincode}` : ''}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-lg uppercase tracking-widest text-gray-400 text-xs">{t.description}</h3>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {item.description}
            </p>
          </div>

          <div className={`p-6 rounded-3xl border flex items-center gap-4 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'
          }`}>
            <div className="w-12 h-12 rounded-full bg-[#FF9933] flex items-center justify-center text-white font-bold text-xl">
              {item.userName.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.owner}</p>
              <p className="font-bold text-lg">{item.userName}</p>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className={`fixed bottom-0 left-0 right-0 p-6 border-t backdrop-blur-xl z-50 ${
          darkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-black/5'
        }`}>
          <div className="max-w-2xl mx-auto">
            <button
              onClick={onProposeTrade}
              className="w-full py-5 bg-[#FF9933] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#e68a2e] transition-all active:scale-95 shadow-xl"
            >
              <MessageCircle size={24} />
              {t.proposeTrade}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
