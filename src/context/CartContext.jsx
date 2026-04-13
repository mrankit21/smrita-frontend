import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateComboPrice } from '../utils/products';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      let newItems;
      if (existing) {
        newItems = state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      const pricing = calculateComboPrice(newItems);
      return { ...state, items: newItems, ...pricing };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(i => i.id !== action.payload);
      const pricing = calculateComboPrice(newItems);
      return { ...state, items: newItems, ...pricing };
    }
    case 'UPDATE_QUANTITY': {
      const newItems = action.payload.quantity === 0
        ? state.items.filter(i => i.id !== action.payload.id)
        : state.items.map(i =>
            i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
          );
      const pricing = calculateComboPrice(newItems);
      return { ...state, items: newItems, ...pricing };
    }
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalQuantity: 0,
  combos: 0,
  remainder: 0,
  regularTotal: 0,
  actualTotal: 0,
  savings: 0,
  hasCombo: false,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('smrita_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        const pricing = calculateComboPrice(parsed.items || []);
        return { ...init, ...parsed, ...pricing };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    localStorage.setItem('smrita_cart', JSON.stringify({ items: state.items }));
  }, [state.items]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const isInCart = (id) => state.items.some(i => i.id === id);
  const getItemQuantity = (id) => state.items.find(i => i.id === id)?.quantity || 0;

  return (
    <CartContext.Provider value={{
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
