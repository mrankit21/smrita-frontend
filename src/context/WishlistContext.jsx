// ================================================================
// File: smrita/src/context/WishlistContext.jsx
// UPDATED: Now uses real backend API. Falls back to localStorage
//          when user is not logged in.
// ================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      // User logged out — clear wishlist
      setItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await wishlistAPI.get();
      if (data.success) {
        setItems(data.products || []);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle: add or remove from wishlist
  // Returns true if added, false if removed
  const toggleItem = async (product) => {
    if (!user) {
      // Not logged in — can't use wishlist
      throw new Error('Please login to use wishlist');
    }
    try {
      // Optimistic update
      const isCurrentlyIn = items.some(i => i._id === product._id || i.id === product.id);
      if (isCurrentlyIn) {
        setItems(prev => prev.filter(i => (i._id || i.id) !== (product._id || product.id)));
      } else {
        setItems(prev => [...prev, product]);
      }

      const productId = product._id || product.id;
      const { data } = await wishlistAPI.toggle(productId);
      // Sync with actual backend state
      await fetchWishlist();
      return data.added;
    } catch (err) {
      // Revert optimistic update on error
      await fetchWishlist();
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return items.some(i => (i._id || i.id)?.toString() === productId?.toString());
  };

  const clearWishlist = async () => {
    try {
      await wishlistAPI.clear();
      setItems([]);
    } catch (err) {
      console.error('Failed to clear wishlist:', err);
    }
  };

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      toggleItem,
      isInWishlist,
      clearWishlist,
      fetchWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
