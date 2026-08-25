import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Sync cart with backend whenever user logs in or changes
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        setLoading(true);
        try {
          // If guest had local items before logging in, push them to backend
          const localItems = JSON.parse(localStorage.getItem('guestCart') || '[]');
          if (localItems.length > 0) {
            for (const item of localItems) {
              const pId = item.product?._id || item.product;
              await cartService.addToCart({
                productId: pId,
                size: item.size,
                color: item.color,
                quantity: item.quantity
              });
            }
            localStorage.removeItem('guestCart');
          }

          // Fetch fresh DB cart
          const res = await cartService.getCart();
          if (res.success && res.data) {
            setCartItems(res.data.items || []);
          }
        } catch (err) {
          console.error('Failed to sync user cart:', err);
        } finally {
          setLoading(false);
        }
      } else {
        const saved = localStorage.getItem('guestCart');
        setCartItems(saved ? JSON.parse(saved) : []);
      }
    };

    syncCart();
  }, [user]);

  // Keep localStorage updated for guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, size = 'M', color = '', quantity = 1) => {
    const price = product.discountPrice > 0 ? product.discountPrice : product.price;

    if (user) {
      setLoading(true);
      try {
        const res = await cartService.addToCart({
          productId: product._id,
          size,
          color,
          quantity
        });
        if (res.success && res.data) {
          setCartItems(res.data.items);
          setIsCartOpen(true);
          return { success: true };
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Could not add to cart';
        return { success: false, message: msg };
      } finally {
        setLoading(false);
      }
    } else {
      // Guest local cart
      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            (item.product?._id === product._id || item.product === product._id) &&
            item.size === size &&
            item.color === color
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + Number(quantity);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(newQty, product.stock || 50)
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: `guest_${Date.now()}_${Math.random()}`,
              product,
              size,
              color,
              quantity: Number(quantity),
              price
            }
          ];
        }
      });
      setIsCartOpen(true);
      return { success: true };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    if (user) {
      try {
        const res = await cartService.updateCartItem(itemId, quantity);
        if (res.success && res.data) {
          setCartItems(res.data.items);
        }
      } catch (err) {
        console.error('Update quantity error:', err);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: Number(quantity) } : item
        )
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        const res = await cartService.removeCartItem(itemId);
        if (res.success && res.data) {
          setCartItems(res.data.items);
        }
      } catch (err) {
        console.error('Remove cart item error:', err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    }
    setCartItems([]);
    localStorage.removeItem('guestCart');
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Coupons
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRST10' || clean === 'OWNBRAND10') {
      setCouponCode(clean);
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied successfully!' };
    } else if (clean === 'VIP20' || clean === 'AURA20') {
      setCouponCode(clean);
      setDiscountPercent(20);
      return { success: true, message: '20% VIP Atelier discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Computed Values
  const totalItems = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const prod = item.product;
    const price = prod && prod.discountPrice > 0 ? prod.discountPrice : (prod?.price || item.price || 0);
    return acc + price * (Number(item.quantity) || 1);
  }, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingPrice = subtotal > 1999 || subtotal === 0 ? 0 : 150;
  const taxPrice = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingPrice + taxPrice);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        discountAmount,
        couponCode,
        discountPercent,
        shippingPrice,
        taxPrice,
        grandTotal,
        isCartOpen,
        loading,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
