import React, { useState, useEffect, Component, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  doc, 
  getDocFromServer
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { auth, db } from './firebase';
import { BarterItem, Language, NavTab } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import BrowseScreen from './screens/BrowseScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import TradeModal from './components/TradeModal';

import { handleFirestoreError, OperationType } from './utils/firestoreError';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">The application encountered an unexpected error.</p>
            <pre className="p-4 bg-gray-50 rounded-xl text-xs overflow-auto max-h-40 text-gray-500">
              {error?.message || 'Unknown error'}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full py-3 bg-red-600 text-white rounded-xl font-bold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [lang, setLang] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  
  // Selection state for details and trade
  const [selectedItem, setSelectedItem] = useState<BarterItem | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Test connection as required by guidelines
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        // Only log if it's a real connection error, not just permission denied
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#FF9933]" size={48} />
      </div>
    );
  }

  const renderContent = () => {
    if (!user) return <Login lang={lang} />;

    switch (activeTab) {
      case 'home':
        return <HomeScreen user={user} setActiveTab={setActiveTab} lang={lang} darkMode={darkMode} />;
      case 'post':
        return <PostScreen lang={lang} darkMode={darkMode} setActiveTab={setActiveTab} />;
      case 'browse':
        return <BrowseScreen lang={lang} darkMode={darkMode} onItemClick={setSelectedItem} />;
      case 'profile':
        return <ProfileScreen lang={lang} darkMode={darkMode} onItemClick={setSelectedItem} />;
      default:
        return <HomeScreen user={user} setActiveTab={setActiveTab} lang={lang} darkMode={darkMode} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Navbar 
          lang={lang} 
          setLang={setLang} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          user={user}
        />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (user ? 'auth' : 'noauth')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {user && (
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            lang={lang} 
            darkMode={darkMode} 
          />
        )}

        {/* Item Detail Overlay */}
        <AnimatePresence>
          {selectedItem && (
            <ItemDetailScreen
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onProposeTrade={() => setIsTradeModalOpen(true)}
              lang={lang}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>

        {/* Trade Proposal Modal */}
        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          item={selectedItem}
          lang={lang}
          darkMode={darkMode}
        />

        {/* Decorative elements */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-50 z-[100]" />
      </div>
    </ErrorBoundary>
  );
}
