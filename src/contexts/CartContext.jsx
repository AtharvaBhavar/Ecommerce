import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../utils/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartState, setCartState] = useState({
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartState({
        items: [],
        total: 0,
        itemCount: 0,
        loading: false,
      });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setCartState(prev => ({ ...prev, loading: true }));
      const cartData = await apiService.getCart();
      setCartState({
        items: cartData.items,
        total: cartData.total,
        itemCount: cartData.itemCount,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartState(prev => ({ ...prev, loading: false }));
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setCartState(prev => ({ ...prev, loading: true }));
      await apiService.addToCart(product.id, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      setCartState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setCartState(prev => ({ ...prev, loading: true }));
      await apiService.updateCartItem(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      setCartState(prev => ({ ...prev, loading: false }));
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartState(prev => ({ ...prev, loading: true }));
      await apiService.removeFromCart(productId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      setCartState(prev => ({ ...prev, loading: false }));
    }
  };

  const clearCart = async () => {
    try {
      setCartState(prev => ({ ...prev, loading: true }));
      await apiService.clearCart();
      setCartState({
        items: [],
        total: 0,
        itemCount: 0,
        loading: false,
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCartState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <CartContext.Provider value={{
      ...cartState,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};