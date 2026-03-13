import { motion } from 'motion/react';
import { MapPin, Tag } from 'lucide-react';
import { BarterItem, Language } from '../types';
import { COLORS } from '../constants';

interface ItemCardProps {
  key?: string | number;
  item: BarterItem;
  onClick: () => void;
  darkMode: boolean;
  lang: Language;
}

export default function ItemCard({ item, onClick, darkMode }: ItemCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl overflow-hidden border transition-all ${
        darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-black/5 hover:shadow-xl'
      }`}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={item.images[0] || 'https://picsum.photos/seed/placeholder/400/400'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
          {item.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-bold text-lg truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {item.title}
        </h3>
        
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} className="text-[#FF9933]" />
          <span className="truncate">{item.city}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Tag size={12} className="text-[#138808]" />
            <span className="text-sm font-bold text-[#138808]">₹{item.estimatedValue}</span>
          </div>
          <span className="text-[10px] text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
