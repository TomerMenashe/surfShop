//** Context for managing the user's cart data throughout the application **//

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

//** Provider component that wraps the part of the app needing cart data **//
export const CartProvider = ({ children }) => {
  //** Local state for storing cart items **//
  const [cart, setCart] = useState([]);

  //** Temporary hardcoded username for demonstration **//
  const username = 'admin';

  //** Fetch cart data on component mount (or when username changes) **//
  useEffect(() => {
    const fetchCart = async () => {
      try {
        //** Retrieve cart data from server **//
        const response = await axios.get('/api/cart', { params: { username } });
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error.message);
      }
    };
    fetchCart();
  }, [username]);

  //** Add a new item to the cart **//
  const addToCart = async (item) => {
    try {
      const response = await axios.post('/api/cart/add', item, { params: { username } });
      setCart(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };

  //** Remove a specific item from the cart by SKU and size **//
  const removeFromCart = async (sku, size) => {
    try {
      const response = await axios.post('/api/cart/remove', { sku, size }, { params: { username } });
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error.message);
    }
  };

  //** Update the quantity of an existing cart item **//
  const updateCartItem = async (sku, size, quantity) => {
    try {
      const response = await axios.post(
        '/api/cart/update',
        { sku, size, quantity },
        { params: { username } }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart item:', error.message);
    }
  };

  //** Clear the entire cart (placeholder—no server endpoint used here) **//
  const clearCart = async () => {
    try {
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error.message);
    }
  };

  //** Provide cart data and actions to the rest of the app **//
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

//** Hook for consuming the CartContext **//
export const useCart = () => useContext(CartContext);
