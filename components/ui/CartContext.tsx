import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import type { Beat } from '../../types/beat';

export type LicenseType = 'mp3' | 'wav' | 'premium' | 'exclusive';

export interface CartItem {
  beat: Beat;
  license: LicenseType;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (beatTitle: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load saved cart from localStorage on mount (client-only)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const saved = window.localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Persist cart to localStorage whenever it changes (client-only)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // If beat is already in cart, update its license. Otherwise, add it.
      const existingItem = prevItems.find(i => i.beat.title === item.beat.title);
      if (existingItem) {
        return prevItems.map(i => i.beat.title === item.beat.title ? item : i);
      }
      return [...prevItems, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (beatTitle: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.beat.title !== beatTitle));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartCount = cartItems.length;

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const licensePrice = item.beat.licenseTypes[item.license];
      return total + licensePrice;
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, addToCart, removeFromCart, clearCart, toggleCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};