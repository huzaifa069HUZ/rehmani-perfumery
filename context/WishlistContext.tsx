'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export interface WishlistItem {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number | string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: number | string) => boolean;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const localWishlist = localStorage.getItem('rahmani_wishlist');
      if (localWishlist) {
        setWishlist(JSON.parse(localWishlist));
      } else {
        setWishlist([]);
      }
      return;
    }

    // Authenticated user: bind to Firestore
    const userRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      let cloudWishlist: WishlistItem[] = [];
      if (docSnap.exists() && docSnap.data().wishlist) {
        cloudWishlist = docSnap.data().wishlist;
      }

      // Merge local wishlist on first login
      const localStr = localStorage.getItem('rahmani_wishlist');
      if (localStr) {
        try {
          const localWishlist: WishlistItem[] = JSON.parse(localStr);
          if (localWishlist.length > 0) {
            const merged = [...cloudWishlist];
            localWishlist.forEach(localItem => {
              const exists = merged.find(w => w.id === localItem.id);
              if (!exists) {
                merged.push(localItem);
              }
            });
            cloudWishlist = merged;
            await setDoc(userRef, { wishlist: cloudWishlist }, { merge: true });
          }
        } catch (e) {
          console.error("Wishlist merge error:", e);
        }
        localStorage.removeItem('rahmani_wishlist');
      }

      setWishlist(cloudWishlist);
    }, (err) => {
      console.warn("Wishlist snapshot listener error:", err);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  const saveWishlist = useCallback(async (newWishlist: WishlistItem[]) => {
    setWishlist(newWishlist);

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { wishlist: newWishlist }, { merge: true });
      } catch (err) {
        console.error("Failed to sync wishlist to cloud:", err);
      }
    } else {
      localStorage.setItem('rahmani_wishlist', JSON.stringify(newWishlist));
    }
  }, [user]);

  const addToWishlist = useCallback((item: WishlistItem) => {
    const exists = wishlist.find(w => w.id === item.id);
    if (!exists) {
      saveWishlist([...wishlist, item]);
    }
  }, [wishlist, saveWishlist]);

  const removeFromWishlist = useCallback((id: number | string) => {
    saveWishlist(wishlist.filter(w => w.id !== id));
  }, [wishlist, saveWishlist]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    const exists = wishlist.find(w => w.id === item.id);
    if (exists) {
      saveWishlist(wishlist.filter(w => w.id !== item.id));
    } else {
      saveWishlist([...wishlist, item]);
    }
  }, [wishlist, saveWishlist]);

  const isInWishlist = useCallback((id: number | string) => {
    return wishlist.some(w => w.id === id);
  }, [wishlist]);

  const totalWishlistItems = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, totalWishlistItems }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
