import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { Language, Category, NavTab } from '../types';
import { TRANSLATIONS, CATEGORIES } from '../constants';
import ImageUpload from '../components/ImageUpload';

interface PostScreenProps {
  lang: Language;
  darkMode: boolean;
  setActiveTab: (tab: NavTab) => void;
}

export default function PostScreen({ lang, darkMode, setActiveTab }: PostScreenProps) {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0] as Category,
    estimatedValue: '',
    city: '',
    pincode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (images.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedValue: Number(formData.estimatedValue),
          images,
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName || 'Anonymous',
          userEmail: auth.currentUser.email || '',
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Item posted successfully!');
        setActiveTab('browse');
      } else {
        throw new Error('Failed to post item');
      }
    } catch (error) {
      console.error('Post error:', error);
      alert('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold tracking-tight">{t.postNew}</h2>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {lang === 'en' ? 'Fill in the details to list your item' : 'अपनी वस्तु सूचीबद्ध करने के लिए विवरण भरें'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className={`block text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {lang === 'en' ? 'Item Photos' : 'वस्तु की तस्वीरें'}
            </label>
            <ImageUpload images={images} setImages={setImages} darkMode={darkMode} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">{t.title}</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={lang === 'en' ? 'What are you offering?' : 'आप क्या दे रहे हैं?'}
                className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                    : 'bg-white border-black/5 focus:border-[#FF9933]'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">{t.description}</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={lang === 'en' ? 'Tell us more about the item...' : 'हमें वस्तु के बारे में और बताएं...'}
                className={`w-full h-32 p-4 rounded-2xl border-2 outline-none transition-all resize-none ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                    : 'bg-white border-black/5 focus:border-[#FF9933]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">{t.category}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className={`w-full p-4 rounded-2xl border-2 outline-none transition-all appearance-none ${
                    darkMode 
                      ? 'bg-[#1a1a1a] border-white/10 focus:border-[#FF9933]' 
                      : 'bg-white border-black/5 focus:border-[#FF9933]'
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">{t.estimatedValue}</label>
                <input
                  required
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                  placeholder="e.g. 5000"
                  className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                      : 'bg-white border-black/5 focus:border-[#FF9933]'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">{t.city}</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                      : 'bg-white border-black/5 focus:border-[#FF9933]'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">{t.pincode}</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g. 400001"
                  className={`w-full p-4 rounded-2xl border-2 outline-none transition-all ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 focus:border-[#FF9933]' 
                      : 'bg-white border-black/5 focus:border-[#FF9933]'
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#FF9933] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#e68a2e] transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {t.submit}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
