import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { storageService } from '../services/storageService';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    storageService.initializeStorage();
    setWishlist(storageService.getWishlist());
  }, []);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (productId: string, productName = 'Item') => {
    const added = storageService.toggleWishlist(productId);
    const updated = storageService.getWishlist();
    setWishlist([...updated]);
    if (added) {
      showToast(`Added ${productName} to your wishlist.`, 'success');
    } else {
      showToast(`Removed ${productName} from your wishlist.`, 'info');
    }
  };

  const removeFromWishlist = (productId: string) => {
    storageService.toggleWishlist(productId);
    const updated = storageService.getWishlist();
    setWishlist([...updated]);
    showToast('Removed from wishlist.', 'info');
  };

  const moveToCart = (product: Product) => {
    const success = addToCart(product, 1);
    if (success) {
      removeFromWishlist(product.id);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
