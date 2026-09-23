import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { storageService } from '../services/storageService';
import { BUSINESS_INFO } from '../data/business';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: Coupon | null;
  couponCodeInput: string;
  setCouponCodeInput: (code: string) => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => boolean;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  applyCoupon: (code?: string) => boolean;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mlf_cart_items_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponCodeInput, setCouponCodeInput] = useState<string>('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Recalculate discount whenever cart items change
  useEffect(() => {
    if (coupon) {
      const currentSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const res = storageService.validateCoupon(coupon.code, currentSubtotal);
      if (res.valid) {
        setCouponDiscount(res.discount);
      } else {
        setCoupon(null);
        setCouponDiscount(0);
        showToast(`Coupon ${coupon.code} removed: ${res.message}`, 'info');
      }
    }
  }, [cart, coupon, showToast]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= BUSINESS_INFO.freeShippingThreshold ? 0 : BUSINESS_INFO.standardShippingFee;
  const total = Math.max(0, subtotal - couponDiscount + shipping);

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string): boolean => {
    const selectedColor = color || product.color || product.availableColors[0];
    const selectedSize = size || product.size || (product.availableSizes ? product.availableSizes[0] : undefined);

    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return false;
    }

    let added = false;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingIndex >= 0) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        if (newQty > product.stock) {
          showToast(`Cannot add more than available stock (${product.stock} available).`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex].quantity = newQty;
        added = true;
        return updated;
      } else {
        if (quantity > product.stock) {
          showToast(`Requested quantity exceeds stock (${product.stock} available).`, 'error');
          return prev;
        }
        added = true;
        return [...prev, { product, quantity, selectedColor, selectedSize }];
      }
    });

    if (added) {
      showToast(`Added ${product.name} to your cart.`, 'success');
      setIsCartDrawerOpen(true);
    }
    return added;
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          if (quantity > item.product.stock) {
            showToast(`Maximum available stock is ${item.product.stock}.`, 'error');
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setCouponDiscount(0);
    setCouponCodeInput('');
  };

  const applyCoupon = (code?: string): boolean => {
    const codeToTest = (code || couponCodeInput).trim();
    if (!codeToTest) {
      showToast('Please enter a coupon code.', 'error');
      return false;
    }

    const res = storageService.validateCoupon(codeToTest, subtotal);
    if (res.valid && res.coupon) {
      setCoupon(res.coupon);
      setCouponDiscount(res.discount);
      showToast(res.message, 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponDiscount(0);
    setCouponCodeInput('');
    showToast('Coupon removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discount: couponDiscount,
        shipping,
        total,
        coupon,
        couponCodeInput,
        setCouponCodeInput,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
