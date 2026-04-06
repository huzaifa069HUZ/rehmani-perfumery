'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export interface CartItem {
  id: number;
  name: string;
  size: number;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, change: number) => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to resolve before making decisions
    if (authLoading) return;

    if (!user) {
      // Guest User: Load exactly from Local Storage
      const localCart = localStorage.getItem('rahmani_cart');
      if (localCart) {
        setCart(JSON.parse(localCart));
      } else {
        setCart([]); // Reset empty state on clear logout
      }
      setIsSyncing(false);
      return;
    }

    // Authenticated User: Bind to Live Firestore Document
    setIsSyncing(true);
    const cartRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(cartRef, async (docSnap) => {
      let cloudCart: CartItem[] = [];
      if (docSnap.exists() && docSnap.data().cart) {
        cloudCart = docSnap.data().cart;
      }

      // Check if a guest built a local cart immediately prior to logging in
      const localStr = localStorage.getItem('rahmani_cart');
      if (localStr) {
        try {
          const localCart: CartItem[] = JSON.parse(localStr);
          if (localCart.length > 0) {
            // Intelligent Merge: Combine quantities for identical items, append new ones
            const merged = [...cloudCart];
            localCart.forEach(localItem => {
              const existing = merged.find(c => c.id === localItem.id && c.size === localItem.size);
              if (existing) {
                existing.quantity += localItem.quantity;
              } else {
                merged.push(localItem);
              }
            });
            cloudCart = merged;
            // Push merged cart back to cloud
            await setDoc(cartRef, { cart: cloudCart }, { merge: true });
          }
        } catch (e) {
          console.error("Cart merge error:", e);
        }
        // Purge local storage so we do not merge it again on next snapshot update
        localStorage.removeItem('rahmani_cart');
      }

      setCart(cloudCart);
      setIsSyncing(false);
    }, (err) => {
      console.warn("Cart snapshot listener error (likely permissions). Not syncing live cart for this user.", err);
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Singular gateway function to write cart mutations
  const saveCart = useCallback(async (newCart: CartItem[]) => {
    setCart(newCart); // Optimistic UI update

    if (user) {
      try {
        const cartRef = doc(db, 'users', user.uid);
        await setDoc(cartRef, { cart: newCart }, { merge: true });
      } catch (err) {
        console.error("Failed to sync cart to cloud:", err);
      }
    } else {
      localStorage.setItem('rahmani_cart', JSON.stringify(newCart));
    }
  }, [user]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    const existing = cart.find(c => c.id === item.id && c.size === item.size);
    let newCart;
    if (existing) {
      newCart = cart.map(c =>
        c.id === item.id && c.size === item.size ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1 }];
    }
    saveCart(newCart);
    setIsCartOpen(true);
  }, [cart, saveCart]);

  const removeItem = useCallback((index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    saveCart(newCart);
  }, [cart, saveCart]);

  const updateQuantity = useCallback((index: number, change: number) => {
    const updated = [...cart];
    updated[index] = { ...updated[index], quantity: updated[index].quantity + change };
    if (updated[index].quantity <= 0) updated.splice(index, 1);
    saveCart(updated);
  }, [cart, saveCart]);

  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, isCartOpen, addToCart, removeItem, updateQuantity, toggleCart, totalItems, totalPrice, isSyncing }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
