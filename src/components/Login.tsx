import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { Language } from '../types';
import { TRANSLATIONS, COLORS } from '../constants';

interface LoginProps {
  lang: Language;
}

export default function Login({ lang }: LoginProps) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5"
      >
        <div className="h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-[#FF9933] to-[#138808] flex items-center justify-center shadow-lg">
              <div className="w-10 h-10 rounded-full border-4 border-white/30 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.appName}
            </h1>
            <p className="text-gray-500 mb-8">
              {lang === 'en' ? 'Simple. Secure. Indian.' : 'सरल। सुरक्षित। भारतीय।'}
            </p>

            <button
              onClick={signInWithGoogle}
              className="w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg"
            >
              <LogIn size={20} />
              {t.loginWithGoogle}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
