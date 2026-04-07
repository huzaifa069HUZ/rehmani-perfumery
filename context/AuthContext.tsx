'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Auto-sync email and Google display name to Firestore on every login.
      // This ensures the analytics page always has a user's email, whether they
      // signed in via Google or email/password — no manual profile save needed.
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const updateData: Record<string, string> = {
            email: currentUser.email || '',
          };
          // Save Google profile name only if present (won't overwrite custom names)
          if (currentUser.displayName) {
            updateData.googleName = currentUser.displayName;
          }
          await setDoc(userRef, updateData, { merge: true });
        } catch (err) {
          console.error('Failed to sync user profile to Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
