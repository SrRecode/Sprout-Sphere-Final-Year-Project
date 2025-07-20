import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// LocalStorage Key
const CART_STORAGE_KEY = 'sproutSphereCartItems';

// Create Context
const CartContext = createContext(null);

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart); // Parse the stored JSON
    } else {
      return []; // Return empty array if nothing stored
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted data
    return []; // Return empty array on error
  }
};

// Provider Component
export const CartProvider = ({ children }) => {
  // Initialize state from localStorage
  const [cartItems, setCartItems] = useState(loadCartFromStorage);
  const { isAuthenticated } = useAuth();

  // Load cart items when component mounts and auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isAuthenticated]);

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
        // Optionally notify the user if storage fails
        // toast.error("Could not save cart state.");
      }
    }
  }, [cartItems, isAuthenticated]); // Re-run this effect whenever cartItems changes

  // Add item to cart (or increase quantity)
  const addToCart = (plantToAdd) => {
    if (!isAuthenticated) return; // Prevent adding items if not authenticated
    setCartItems(prevItems => {
      // Check if item already exists
      const existingItem = prevItems.find(item => item.plant._id === plantToAdd._id);

      if (existingItem) {
        // Increase quantity
        toast.info(`${plantToAdd.name} quantity updated in cart.`);
        return prevItems.map(item => 
          item.plant._id === plantToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        toast.success(`${plantToAdd.name} added to cart!`);
        return [...prevItems, { plant: plantToAdd, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (plantId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.plant._id === plantId);
      if (itemToRemove) {
          toast.info(`${itemToRemove.plant.name} removed from cart.`);
      }
      return prevItems.filter(item => item.plant._id !== plantId);
    });
  };

  // Update item quantity
  const updateQuantity = (plantId, newQuantity) => {
     // Ensure quantity is at least 1
    const quantity = Math.max(1, newQuantity);

    setCartItems(prevItems => 
      prevItems.map(item => 
        item.plant._id === plantId 
          ? { ...item, quantity: quantity } 
          : item
      )
    );
  };
  
  // Clear the whole cart
  const clearCart = () => {
    setCartItems([]); // This will trigger the useEffect to update localStorage
    toast.info('Cart cleared.');
  };

  // Calculate total items count
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.plant.price * item.quantity), 0);

  // Context Value
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    cartTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};