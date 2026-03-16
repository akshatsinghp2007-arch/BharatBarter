// Mock Firebase bridge for SQLite backend
import { UserProfile } from './types';

// Mock Auth State
let currentUser: any = JSON.parse(localStorage.getItem('mock_user') || 'null');
const authListeners: ((user: any) => void)[] = [];

export const auth = {
  get currentUser() {
    return currentUser;
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    authListeners.push(callback);
    callback(currentUser);
    return () => {
      const index = authListeners.indexOf(callback);
      if (index > -1) authListeners.splice(index, 1);
    };
  }
};

export const db = {
  // We'll use fetch for these instead of the Firebase SDK
};

export const signInWithGoogle = async () => {
  // Mock login
  const mockUser = {
    uid: 'local-user-' + Math.random().toString(36).substring(7),
    displayName: 'Local Trader',
    email: 'trader@local.host',
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
  };
  currentUser = mockUser;
  localStorage.setItem('mock_user', JSON.stringify(mockUser));
  
  // Sync with backend
  await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mockUser)
  });

  authListeners.forEach(l => l(currentUser));
  return { user: currentUser };
};

export const logout = async () => {
  currentUser = null;
  localStorage.removeItem('mock_user');
  authListeners.forEach(l => l(null));
};

// Helper for image upload (mocking storage)
export const storage = {
  // Not used directly, we'll store base64 in SQLite for simplicity
};
