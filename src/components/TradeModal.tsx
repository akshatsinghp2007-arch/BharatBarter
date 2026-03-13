import { motion, AnimatePresence } from 'motion/react';
import { X, Send } from 'lucide-react';
import { BarterItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BarterItem | null;
  lang: Language;
  darkMode: boolean;
}

export default function TradeModal({ isOpen, onClose, item, lang, darkMode }: TradeModalProps) {
  const t = TRANSLATIONS[lang];

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden ${
              darkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{t.proposeTrade}</h2>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6 p-4 rounded-2xl bg-black/5 flex items-center gap-4">
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-16 h-16 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t.owner}: {item.userName}</p>
                  <h3 className="font-bold">{item.title}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder={t.tradeMessage}
                  className={`w-full h-32 p-4 rounded-2xl border-2 outline-none transition-all resize-none ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                      : 'bg-gray-50 border-black/5 focus:border-[#FF9933]'
                  }`}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                      darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={() => {
                      alert('Proposal sent! (MVP Demo)');
                      onClose();
                    }}
                    className="flex-1 py-4 bg-[#FF9933] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#e68a2e] transition-all active:scale-95 shadow-lg"
                  >
                    <Send size={18} />
                    {t.sendProposal}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
